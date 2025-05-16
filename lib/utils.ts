import {
  generateId,
  type CoreAssistantMessage,
  type CoreToolMessage,
  type Message,
  type UIMessage,
} from 'ai';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Document } from '@/lib/db/schema';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function sanitizeResponseMessages({
  messages,
  reasoning,
}: {
  messages: Array<ResponseMessage>;
  reasoning: string | undefined;
}) {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true,
    );

    if (reasoning) {
      // @ts-expect-error: reasoning message parts in sdk is wip
      sanitizedContent.push({ type: 'reasoning', reasoning });
    }

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function generateDummyPassword() {
  const password = generateId(12);

  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

interface AnamnesisReport {
  type: string;
  fullName: string;
  ahvNumber: string;
  urgency: string;
  summary: string;
  symptoms: string;
  suggestedMedicaments: string;
  suggestedTreatment: string;
  painLevel: string;
}

export function extractAnamnesis(message: string): AnamnesisReport | null {
    // Determine which format we're dealing with
    const hasNormalOpening = message.includes('<ANAMNESIS_REPORT>');
    const hasDoubleClosing = message.includes('</ANAMNESIS_REPORT>');
    
      // If neither format is found, return null
  if (!hasNormalOpening && !hasDoubleClosing) {
    return {
      type: 'error while parsing',
      fullName: 'error while parsing',
      ahvNumber: 'error while parsing',
      urgency: 'error while parsing',
      summary: 'error while parsing',
      symptoms: 'error while parsing',
      suggestedMedicaments: 'error while parsing',
      suggestedTreatment: 'error while parsing',
      painLevel: 'error while parsing',
    };
  }

  let reportContent = '';
  
  if (hasNormalOpening) {
    // Standard format: <ANAMNESIS_REPORT> ... </ANAMNESIS_REPORT>
    const parts = message.split(/<ANAMNESIS_REPORT>/i);
    if (parts.length > 1) {
      reportContent = parts[1].split(/<\/ANAMNESIS_REPORT>/i)[0];
    }
  } else {
    // Erroneous format: </ANAMNESIS_REPORT> ... </ANAMNESIS_REPORT>
    const parts = message.split(/<\/ANAMNESIS_REPORT>/i);
    if (parts.length > 2) {
      // Skip the first part (before first closing tag) and get content until next closing tag
      reportContent = parts[1];
    } else if (parts.length > 1) {
      // If there's only one closing tag, use everything after it
      reportContent = parts[0]; // The text to parse will be before the closing tag
    }
  }

  const grab = (key: string) => {
    const rx = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=\\n[a-z_]+:\\s*|$)`, 'i');
    const m = reportContent.match(rx);
    return (m ? m[1] : '').trim().replace(/^\[|\]$/g, '');
  };

  return {
    type: grab('type'),
    fullName: grab('full_name'),
    ahvNumber: grab('ahv_number'),
    urgency: grab('urgency'),
    summary: grab('summary'),
    symptoms: grab('symptoms'),
    suggestedMedicaments: grab('suggested_medicaments'),
    suggestedTreatment: grab('suggested_treatment'),
    painLevel: grab('pain_level'),
  };
}
