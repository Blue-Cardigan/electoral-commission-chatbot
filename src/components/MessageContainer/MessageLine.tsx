import React from 'react';
import { Message } from '@/types/chat';
import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/Home.module.css';

export const MessageLine: React.FC<{
    message: Message;
    loading: boolean;
    onSuggestionClick: (suggestion: string) => void;
  }> = ({ message, loading, onSuggestionClick }) => {
    const msgClass = `p-6 flex ${
      message.type === 'apiMessage' ? 'bg-ec-blue-50' : loading ? '' : 'bg-white'
    }`;
  
    return (
      <div
        className={`border-b border-b-slate-200 ${
          loading ? styles.usermessagewaiting : ''
        }`}
      >
        <div className={`${msgClass} container`}>
          {message.type === 'apiMessage' ? (
            <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
          ) : (
            <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
          )}
          <div className={`${styles.markdownanswer} flex-grow`}>
            <ReactMarkdown linkTarget="_blank" className="flex flex-col gap-4 text-black break-words">
              {message.message}
            </ReactMarkdown>
            {message.suggestions && (
              <ul className="list-none mt-4">
                {message.suggestions.map((suggestion, i) => (
                  <li
                    className="list-none hover:cursor-pointer hover:underline mb-2"
                    onClick={() => onSuggestionClick(suggestion)}
                    key={`suggestion-${i}`}
                    style={{ color: 'black', fontWeight: 'bold' }}
                  >{`👉 ${suggestion}`}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };