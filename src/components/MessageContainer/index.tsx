import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageState, Message } from '@/types/chat';
import { MessageLine } from './MessageLine';

interface MessageContainerProps {
  loading: boolean;
  messageState: MessageState;
  onCitationClick: (citation: { type: 'file_citation' | 'file_path', text: string }) => void;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  loading,
  messageState,
  onCitationClick
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

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-150px)] overflow-y-auto"
      onScroll={handleScroll}
    >
      {messages.map((message, index) => (
        <div key={index}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1}
            onCitationClick={onCitationClick}
          />
        </div>
      ))}
    </div>
  );
};