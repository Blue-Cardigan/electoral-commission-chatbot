import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { MessageState, Message } from '@/types/chat';
import { MessageLine } from './MessageLine';
import { SourceAccordion } from './SourceAccordion';

interface MessageItemData {
  messages: Message[];
  loading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  setSize: (index: number, size: number) => void;
}

interface MessageContainerProps {
  loading: boolean;
  messageState: MessageState;
  onSuggestionClick: (suggestion: string) => void;
}

const MessageItem: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: MessageItemData;
}> = ({ index, style, data }) => {
  const { messages, loading, onSuggestionClick, setSize } = data;
  const message = messages[index];
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setSize(index, entry.contentRect.height);
        }
      });

      resizeObserver.observe(itemRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [index, setSize]);

  return (
    <div ref={itemRef} style={{...style, height: 'auto'}}>
      <MessageLine
        message={message}
        loading={loading && index === messages.length - 1}
        onSuggestionClick={onSuggestionClick}
      />
      {message.sourceDocs && message.sourceDocs.length > 0 && (
        <SourceAccordion sourceDocs={message.sourceDocs} msgIdx={index} />
      )}
    </div>
  );
};

export const MessageContainer: React.FC<MessageContainerProps> = ({
  loading,
  messageState,
  onSuggestionClick
}) => {
  const listRef = useRef<List>(null);
  const sizeMap = useRef<{[key: number]: number}>({});
  const [, forceUpdate] = useState({});
  const { messages } = messageState;

  const setSize = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current[index] = size;
      if (listRef.current) {
        listRef.current.resetAfterIndex(index);
      }
      forceUpdate({});
    }
  };

  const getSize = (index: number) => {
    return sizeMap.current[index] || 100; // Default to 100 if not measured yet
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]);

  const itemData: MessageItemData = { messages, loading, onSuggestionClick, setSize };

  return (
    <div className="h-[calc(100vh-150px)]">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            itemCount={messages.length}
            itemSize={getSize}
            width={width}
            itemData={itemData}
          >
            {(props) => <MessageItem {...props} />}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};