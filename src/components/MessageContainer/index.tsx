import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageState, Message } from '@/types/chat';
import { MessageLine } from './MessageLine';

interface MessageContainerProps {
  loading: boolean;
  messageState: MessageState;
  onCitationClick: (citation: { type: 'file_citation' | 'file_path', text: string }) => void;
  setQuery: (query: string) => void;
  userAvatar: string | null; // Add userAvatar prop
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  loading,
  messageState,
  onCitationClick,
  setQuery,
  userAvatar // Destructure userAvatar prop
}) => {
  const { messages } = messageState;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // Scroll to top on initial load
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-150px)] overflow-y-auto lg:pt-0 pt-16" // Added pt-16 for mobile padding
      onScroll={handleScroll}
    >
      {messages.map((message, index) => (
        <div key={index}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1}
            onCitationClick={onCitationClick}
            onSuggestionClick={setQuery}
            userAvatar={userAvatar} // Pass the avatar URL to MessageLine
          />
        </div>
      ))}
    </div>
  );
};