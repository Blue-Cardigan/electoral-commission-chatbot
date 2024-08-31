import React, { useMemo, useRef } from 'react';
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
    threadId,
  } = useChatState();

  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const memoizedMessageContainer = useMemo(() => (
    <MessageContainer
      loading={loading}
      messageState={messageState}
      onCitationClick={(citation) => {/* handle citation click */}}
      setQuery={(suggestion) => {
        setQuery(suggestion);
        messageInputRef.current?.focus();
      }}
    />
  ), [loading, messageState, setQuery]);

  return (
    <>
      {memoizedMessageContainer}
      <MessageInput
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        clearError={clearError}
        threadId={threadId}
        ref={messageInputRef}
      />
    </>
  );
}
