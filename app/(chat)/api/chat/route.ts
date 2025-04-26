import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import { myProvider } from '@/lib/ai/providers';
import { createDocument } from '@/lib/ai/tools/create-document';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { isProductionEnvironment } from '@/lib/constants';
import {
  deleteChatById,
  getChatById,
  saveAnamnesisReport,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  extractAnamnesis,
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        // Create variables to store original text and track detection state
        let originalContent = '';
        let foundAnamnesis = false;

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  // 'getWeather',
                  // 'createDocument',
                  // 'updateDocument',
                  // 'requestSuggestions',
                ],
          // experimental_transform: smoothStream({ chunking: 'word' }),
          // Custom transform to intercept and replace anamnesis reports
          experimental_transform: (() => {
            // Create our custom transform
            const anamnesisTransform = new TransformStream({
              transform(chunk, controller) {
                // Handle text-delta chunks which contain actual text content
                if (chunk.type === 'text-delta' && chunk.textDelta) {
                  // Save original content for database processing
                  originalContent += chunk.textDelta;

                  // Check if accumulated content contains the marker
                  if (
                    originalContent.includes('<ANAMNESIS_REPORT>') &&
                    !foundAnamnesis
                  ) {
                    // First time we've found the marker
                    foundAnamnesis = true;
                    controller.enqueue({
                      type: 'text-delta',
                      textDelta:
                        'Your information was forwarded to the doctor. Thank you for providing these details.',
                    });
                  }
                  // If we've already found the marker, don't pass through more content
                  else if (foundAnamnesis) {
                    // Don't enqueue anything
                    return;
                  }
                  // Normal text before finding a marker
                  else {
                    controller.enqueue(chunk);
                  }
                }
                // For step-start, step-finish, and finish chunks, pass through unchanged
                else {
                  controller.enqueue(chunk);
                }
              },
            });

            // Return function that applies both our transform and smoothing
            return (chunk) => {
              // First get the smooth transform
              const smooth = smoothStream({ chunking: 'word' })(chunk);

              // Chain our transform after the smooth transform
              return {
                writable: smooth.writable,
                readable: smooth.readable.pipeThrough(anamnesisTransform),
              };
            };
          })(),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                if (
                  foundAnamnesis &&
                  originalContent.includes('<ANAMNESIS_REPORT>')
                ) {
                  const report = extractAnamnesis(originalContent);
                  if (!report) {
                    console.error('No anamnesis report found');
                    return;
                  }
                  await saveAnamnesisReport({
                    ...report,
                    userId: session.user.id,
                  });
                  console.log('report', report);

                  // Modify the message parts to contain our replacement message
                  if (foundAnamnesis) {
                    assistantMessage.parts = assistantMessage.parts?.map(
                      (part) => {
                        if (part.type === 'text') {
                          return {
                            ...part,
                            text: 'Your information was forwarded to the doctor. Thank you for providing these details.',
                          };
                        }
                        return part;
                      },
                    );
                  }
                }

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
