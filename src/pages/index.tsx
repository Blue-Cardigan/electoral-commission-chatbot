import React from 'react';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';
import { useChatState } from '@/hooks/useChatState';

export default function Home() {
  const {
    loading,
    messageState,
    error,
    query,
    setQuery,
    handleQuerySubmit,
    clearError,
  } = useChatState();

  return (
    <>
      <MessageContainer
        loading={loading}
        messageState={messageState}
        onSuggestionClick={setQuery}
      />
      <MessageInput
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        clearError={clearError}
      />
    </>
  );
}
