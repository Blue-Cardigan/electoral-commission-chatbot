import React, { useMemo, useRef, useEffect, useState } from 'react';
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
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/randomAvatar')
      .then(response => response.json())
      .then(data => setUserAvatar(data.avatar))
      .catch(error => console.error('Error fetching random avatar:', error));
  }, []);

  const memoizedMessageContainer = useMemo(() => (
    <MessageContainer
      loading={loading}
      messageState={messageState}
      onCitationClick={(citation) => {/* handle citation click */}}
      setQuery={(suggestion) => {
        setQuery(suggestion);
        messageInputRef.current?.focus();
      }}
      userAvatar={userAvatar} // Pass the avatar URL as a prop
    />
  ), [loading, messageState, setQuery, userAvatar]);

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