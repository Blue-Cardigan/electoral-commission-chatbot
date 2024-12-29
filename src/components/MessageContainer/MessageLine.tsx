import { useCallback } from 'react';
import { Message, Citation } from '@/types/chat';
import styles from '@/styles/Home.module.css';

import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

export const MessageLine: React.FC<{
  message: Message;
  loading: boolean;
  onCitationClick: (citation: Citation) => void;
  onSuggestionClick: (suggestion: string) => void;
  userAvatar: string | null;
}> = ({ message, loading, onCitationClick, onSuggestionClick, userAvatar }) => {
  const renderMessageContent = useCallback((content: string) => {
    if (!message.citations?.length) return content;

    let processedContent = content;
    message.citations.forEach(citation => {
      const citationMark = `[${citation.citationIndex}]`;
      processedContent = processedContent.replaceAll(
        citationMark,
        `[${citation.citationIndex}](citation:${citation.citationIndex})`
      );
    });
    return processedContent;
  }, [message.citations]);

  const CitationLink = useCallback(({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Find the citation that matches this reference
    const citationNumber = Array.isArray(children) 
      ? children[0]?.toString() 
      : children?.toString();
    const citationIndex = citationNumber ? parseInt(citationNumber) : null;
    
    if (citationIndex === null || !message.citations?.find(c => c.citationIndex === citationIndex)) {
      // If no matching citation, just render as text
      return <>{children}</>;
    }

    const citation = message.citations.find(c => c.citationIndex === citationIndex)!;

    return (
      <button
        type="button"
        onClick={() => onCitationClick(citation)}
        className="inline-flex items-center px-2 py-0.5 rounded-full 
          bg-blue-100 text-blue-800 hover:bg-blue-200 
          transition-colors duration-200"
        title={citation.citationContent}
      >
        {children}
        <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    );
  }, [message.citations, onCitationClick]);

  return (
    <div className={`border-b border-b-slate-200 ${loading ? 'usermessagewaiting' : ''}`}>
      <div className={`p-6 flex ${message.type === 'apiMessage' ? 'bg-ec-blue-50' : loading ? '' : 'bg-white'}`}>
        {message.type === 'apiMessage' ? (
          <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
        ) : userAvatar ? (
          <img src={userAvatar} alt="User Avatar" className="shrink-0 h-[24px] w-[24px] rounded-full mr-3" />
        ) : (
          <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
        )}
        <div className={`${styles.markdownanswer} flex-grow`}>
          <ReactMarkdown
            components={{
              a: CitationLink
            }}
          >
            {renderMessageContent(message.message)}
          </ReactMarkdown>
          {message.suggestions && (
            <ul className="list-none mt-4">
              {message.suggestions.map((suggestion, i) => (
                <li
                  key={`suggestion-${i}`}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="list-none hover:cursor-pointer hover:underline mb-2 text-black font-bold"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};