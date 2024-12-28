import { useState, useEffect, useCallback } from 'react';
import { MessageState, Message } from '@/types/chat';
import { initMessages } from '@/constants/initMessages';
import { useErrorHandler } from './useErrorHandler';
import { Citation } from '@/types/chat';

// Update the Message type
type UpdatedMessage = Message & {
  citations?: Citation[];
};

// Update the MessageState type
type UpdatedMessageState = Omit<MessageState, 'messages'> & {
  messages: UpdatedMessage[];
};

export function useChatState() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<UpdatedMessageState>({
    messages: initMessages() as UpdatedMessage[],
    history: [],
  });
  const [threadId, setThreadId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const { error, handleError, clearError } = useErrorHandler();

  const createThread = useCallback(async () => {
    try {
      const response = await fetch('/api/createThread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.threadId) {
        setThreadId(data.threadId);
      } else {
        throw new Error('Failed to create thread: No threadId received');
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unexpected error occurred while creating thread');
    }
  }, [handleError]);

  useEffect(() => {
    createThread();
  }, [createThread]);

  const handleQuerySubmit = useCallback(async (
    e: React.FormEvent<HTMLFormElement> | null,
    onStreamingUpdate?: (text: string, citations: Citation[]) => void
  ) => {
    if (e) e.preventDefault();
    clearError();

    if (!query.trim()) {
      handleError('Please input a question');
      return;
    }

    setMessageState((prev) => ({
      ...prev,
      messages: [...prev.messages, { type: 'userMessage', message: query }],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim(), threadId }),
      });

      if (!response.ok) throw new Error('Failed to get response from API');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let buffer = '';
      let currentText = '';
      let currentCitations: Citation[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += new TextDecoder().decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          const { type, content, citations } = JSON.parse(line);
          
          if (type === 'update') {
            currentText += content;
          } else if (type === 'done') {
            currentText = content;
            currentCitations = citations.map(({ citationIndex, citationContent, url }: any) => ({
              citationIndex,
              citationContent: citationContent || '',
              url: url || ''
            }));

            setMessageState((prev) => ({
              ...prev,
              messages: [
                ...prev.messages,
                {
                  type: 'apiMessage',
                  message: currentText,
                  citations: currentCitations,
                },
              ],
            }));
            setLoading(false);
          }

          if (onStreamingUpdate) {
            onStreamingUpdate(currentText, currentCitations);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      if (onStreamingUpdate) {
        onStreamingUpdate(errorMessage, []);
      }
      setLoading(false);
    }
  }, [query, threadId, clearError, handleError]);

  return {
    loading,
    messageState,
    setMessageState,
    error,
    query,
    setQuery,
    handleQuerySubmit,
    clearError,
    threadId,
  };
}