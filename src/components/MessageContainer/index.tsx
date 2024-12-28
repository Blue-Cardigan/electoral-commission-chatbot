import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageState, Citation } from '@/types/chat';
import { MessageLine } from './MessageLine';

interface MessageContainerProps {
  loading: boolean;
  messageState: MessageState;
  setQuery: (query: string) => void;
  userAvatar: string | null;
  streamingContent?: {
    text: string;
    citations: Citation[];
  };
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  loading,
  messageState,
  setQuery,
  userAvatar,
  streamingContent
}) => {
  const { messages } = messageState;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleCitationClick = useCallback((citation: Citation) => {
    if (citation.url) {
      window.open(citation.url, '_blank');
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, streamingContent, isAtBottom, scrollToBottom]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-150px)] overflow-y-auto lg:pt-0 pt-16"
      onScroll={handleScroll}
    >
      {messages.map((message, index) => (
        <div key={index}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1 && !streamingContent}
            onCitationClick={handleCitationClick}
            onSuggestionClick={setQuery}
            userAvatar={userAvatar}
          />
        </div>
      ))}
      {loading && streamingContent && (
        <div>
          <MessageLine
            message={{
              type: 'apiMessage',
              message: streamingContent.text,
              citations: streamingContent.citations
            }}
            loading={false}
            onCitationClick={handleCitationClick}
            onSuggestionClick={setQuery}
            userAvatar={userAvatar}
          />
        </div>
      )}
    </div>
  );
};