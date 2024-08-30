import { useState, useEffect, useCallback } from 'react';
import { MessageState, Message } from '@/types/chat';
import { initMessages } from '@/constants/initMessages';
import { useErrorHandler } from './useErrorHandler';

type Citation = {
  type: 'file_citation' | 'file_path';
  text: string;
};

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
      const response = await fetch('/api/createThread', { method: 'POST' });
      const data = await response.json();
      if (data.threadId) {
        setThreadId(data.threadId);
      } else {
        throw new Error('Failed to create thread');
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [handleError]);

  useEffect(() => {
    createThread();
  }, [createThread]);

  const handleQuerySubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!query) {
      handleError('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          threadId: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let partialMessage = '';
      let citations: Citation[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            switch (data.type) {
              case 'start':
                setMessageState((prevState) => ({
                  ...prevState,
                  messages: [
                    ...prevState.messages,
                    {
                      type: 'apiMessage',
                      message: '',
                      citations: [],
                    },
                  ],
                }));
                break;
              case 'update':
                partialMessage += data.content;
                setMessageState((prevState) => ({
                  ...prevState,
                  messages: prevState.messages.map((msg, i) => 
                    i === prevState.messages.length - 1
                      ? { ...msg, message: partialMessage } as UpdatedMessage
                      : msg
                  ),
                }));
                break;
              case 'citation':
                citations.push({
                  type: data.citationType,
                  text: data.citationContent,
                });
                setMessageState((prevState) => ({
                  ...prevState,
                  messages: prevState.messages.map((msg, i) => 
                    i === prevState.messages.length - 1
                      ? { ...msg, citations } as UpdatedMessage
                      : msg
                  ),
                }));
                break;
              case 'done':
                setMessageState((prevState) => ({
                  ...prevState,
                  messages: prevState.messages.map((msg, i) => 
                    i === prevState.messages.length - 1
                      ? { ...msg, message: data.content, citations } as UpdatedMessage
                      : msg
                  ),
                  history: [...prevState.history, [question, data.content]],
                }));
                break;
              case 'error':
                throw new Error(data.error);
            }
          }
        }
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [query, threadId, clearError, handleError]);

  return {
    loading,
    messageState,
    error,
    query,
    setQuery,
    handleQuerySubmit,
    clearError,
    threadId,
  };
}