import React from 'react';
import { Message } from '@/types/chat';
import { ChatBubbleLeftEllipsisIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

interface Citation {
  type: 'file_citation' | 'file_path';
  text: string;
}

export const MessageLine: React.FC<{
    message: Message & { citations?: Citation[] };
    loading: boolean;
    onCitationClick: (citation: Citation) => void;
  }> = ({ message, loading, onCitationClick }) => {
    const msgClass = `p-6 flex ${
      message.type === 'apiMessage' ? 'bg-ec-blue-50' : loading ? '' : 'bg-white'
    }`;

    return (
      <div className={`border-b border-b-slate-200 ${loading ? 'usermessagewaiting' : ''}`}>
        <div className={`${msgClass} container`}>
          {message.type === 'apiMessage' ? (
            <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
          ) : (
            <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
          )}
          <div className="markdownanswer flex-grow">
            <ReactMarkdown 
              components={{
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
              }} 
              className="flex flex-col gap-4 text-black break-words"
            >
              {message.message}
            </ReactMarkdown>
            {message.citations && message.citations.length > 0 && (
              <ul className="list-none mt-4">
                {message.citations.map((citation, i) => (
                  <li 
                    className="list-none hover:cursor-pointer hover:underline mb-2"
                    onClick={() => onCitationClick(citation)}
                    key={`suggestion-${i}`}
                    style={{ color: 'black', fontWeight: 'bold' }}
                  >{`👉 ${citation.text}`}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };