'use client';

import { ChatHeader } from '@/components/chat-header';
import { useArtifactSelector } from '@/hooks/use-artifact';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import type { Attachment, UIMessage } from 'ai';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import { Artifact } from './artifact';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { getChatHistoryPaginationKey } from './sidebar-history';
import type { VisibilityType } from './visibility-selector';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  const [mounted, setMounted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const lastDismissed = localStorage.getItem('warningDismissedAt');

    if (lastDismissed) {
      const dismissedTime = Number.parseInt(lastDismissed);
      const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 hour

      if (dismissedTime > oneHourAgo) {
        setShowWarning(false);
      } else {
        setShowWarning(true);
      }
    } else {
      setShowWarning(true);
    }
  }, []);

  // Handle dismiss button click
  const dismissWarning = () => {
    localStorage.setItem('warningDismissedAt', Date.now().toString());
    setShowWarning(false);
  };

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  const lastMessageText = messages[messages.length - 1]?.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .toLowerCase();
  const anamnesisComplete = lastMessageText?.includes(
    'your information was forwarded to the doctor',
  );

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* Warning Banner */}
        {mounted && showWarning && (
          <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                className="hidden md:block size-5 text-amber-600 dark:text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                This is a prototype that uses the public API of Google Gemini.
                Please do not share any personal or sensitive information. The
                system is intended for demonstration purposes only.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissWarning}
              className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              disabled={anamnesisComplete}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
