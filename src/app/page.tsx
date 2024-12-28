'use client'

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';
import { useChatState } from '@/hooks/useChatState';
import { Citation } from '@/types/chat';

interface StreamingContent {
  text: string;
  citations: Citation[];
}

export default function Home() {
  const {
    loading,
    messageState,
    setMessageState,
    error,
    query,
    setQuery,
    handleQuerySubmit,
    clearError,
    threadId,
  } = useChatState();

  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<StreamingContent>({ 
    text: '', 
    citations: [] 
  });

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
      setQuery={(suggestion) => {
        setQuery(suggestion);
        messageInputRef.current?.focus();
      }}
      userAvatar={userAvatar}
      streamingContent={streamingContent}
    />
  ), [loading, messageState, setQuery, userAvatar, streamingContent]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStreamingContent({ text: '', citations: [] });
    handleQuerySubmit(e, (text: string, citations: Citation[]) => {
      setStreamingContent({ 
        text, 
        citations: citations.map(c => ({
          ...c,
          url: c.url || ''
        }))
      });
    });
  };

  return (
    <>
      {memoizedMessageContainer}
      <MessageInput
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={onSubmit}
        clearError={clearError}
        threadId={threadId}
        ref={messageInputRef}
      />
    </>
  );
}