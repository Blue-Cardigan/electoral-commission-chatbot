import React from 'react';
import { Message } from '@/types/chat';
import styles from '@/styles/Home.module.css';

import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { Citation } from './Citation'; // New import

export const MessageLine: React.FC<{
    message: Message;
    loading: boolean;
    onCitationClick: (citation: { type: 'file_citation' | 'file_path', text: string }) => void;
    onSuggestionClick: (suggestion: string) => void;
  }> = ({ message, loading, onCitationClick, onSuggestionClick }) => {
    const msgClass = `p-6 flex ${
      message.type === 'apiMessage' ? 'bg-ec-blue-50' : loading ? '' : 'bg-white'
    }`;
  
    const replaceCitations = (text: string) => {
      const regex = /\[\[(?:CITATION|FILE):(https?:\/\/[^\]]+)\]\]/g;
      const parts = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;
      let citationIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        const [fullMatch, url] = match;
        const type = fullMatch.startsWith('[[CITATION:') ? 'file_citation' : 'file_path';
        parts.push(
          <Citation
            key={`citation-${citationIndex}`}
            index={citationIndex}
            url={url}
            onClick={() => onCitationClick({ type, text: url })}
          />
        );
        citationIndex++;
        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts;
    };

    return (
      <div
        className={`border-b border-b-slate-200 ${
          loading ? 'usermessagewaiting' : ''
        }`}
      >
        <div className={`${msgClass} container`}>
          {message.type === 'apiMessage' ? (
            <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
          ) : (
            <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
          )}
          <div className={`${styles.markdownanswer} flex-grow`}>
            <ReactMarkdown 
              components={{
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                p: ({node, ...props}) => <p {...props}>{replaceCitations(props.children as string).map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}</p>
              }} 
              className="flex flex-col gap-4 text-black break-words"
            >
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
                  >{`${suggestion}`}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };