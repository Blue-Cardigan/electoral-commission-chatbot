import { useState, useEffect, useCallback } from 'react';
import { MessageState } from '@/types/chat';
import { initMessages } from '@/constants/initMessages';
import { generateUUID, handleApiRequest } from '@/components/utils';
import { useErrorHandler } from './useErrorHandler';

export function useChatState() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<MessageState>({
    messages: initMessages(),
    history: [],
  });
  const [conversationId, setConversationId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const newconversationId = generateUUID();
    window.localStorage.setItem('conversationId', newconversationId);
    setConversationId(newconversationId);
  }, []);

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
      const response = await handleApiRequest(
        question,
        messageState.history,
        conversationId,
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const sourceDocs = response.sourceDocuments || [];
      const message = response.text ?? '';
      setMessageState((prevState) => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            type: 'apiMessage',
            message,
            sourceDocs,
          },
        ],
        history: [...prevState.history, [question, message]],
      }));
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [query, messageState.history, conversationId, clearError, handleError]);

  return {
    loading,
    messageState,
    error,
    query,
    setQuery,
    handleQuerySubmit,
    clearError,
  };
}