import React, { useEffect, useRef } from 'react';
import { Message, MessageState } from '@/types/chat';
import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Document } from 'langchain/document';

import styles from '@/styles/Home.module.css';

export const MessageContainer: React.FC<{
  loading: boolean;
  messageState: MessageState;
  onSuggestionClick: (suggestion: string) => void;
}> = ({ loading, messageState, onSuggestionClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = messageState;

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [messages],
  );

  return (
    <div className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5">
      {messages.map((message, index) => (
        <div key={`chatMessage-${index}`}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1}
            onSuggestionClick={onSuggestionClick}
          />
          {message.sourceDocs && message.sourceDocs.length > 0 && (
            <SourceAccordion sourceDocs={message.sourceDocs} msgIdx={index} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
};

const MessageLine: React.FC<{
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
        <div className={styles.markdownanswer + ''}>
          <ReactMarkdown linkTarget="_blank" className="flex flex-col gap-4 text-black">
            {message.message}
          </ReactMarkdown>
          {message.suggestions && (
            <ul className="list-none">
            {message.suggestions.map((suggestion, i) => (
              <li
                className="list-none hover:cursor-pointer hover:underline"
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

function getUniqueSourceDocs(
  sourceDocs: Document<Record<string, any>>[],
): Document<Record<string, any>>[] {
  const uniqueDocs = new Map<string, Document<Record<string, any>>>();

  sourceDocs.forEach((doc) => {
    // Check if pageContent exists and is not undefined before proceeding
    if (doc.pageContent) {
      const normalizedContent = doc.pageContent.toLowerCase(); // Normalize to lower case for comparison
      if (!uniqueDocs.has(normalizedContent)) {
        uniqueDocs.set(normalizedContent, doc);
      }
    }
  });

  return Array.from(uniqueDocs.values());
}

//Adjust the source back to URL format and handle PDFs
function formatSource(source: string, url?: string): JSX.Element {
  if (url) {
    // If url is provided, use it directly
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        {url}
      </a>
    );
  }

  if (typeof source !== 'string') {
    return <span>Source not available</span>;
  }

  // Remove the terms '1/', '2/', and 'Big/' from the source string
  let adjustedSource = source
    .replace(/^.*\/docs\//, '') // Remove the directory structure
    .replace(/(1\/|2\/|Big\/)/g, '');

  // Check if the source string ends with '.pdf'
  const isPdf =
    adjustedSource.includes('sites_default') || adjustedSource.endsWith('.pdf');
  if (isPdf) {
    // Extract the filename without the extension and directory prefix
    const filename = adjustedSource
      .replace('sites_default_files_', '')
      .replace('pdf_file_', '')
      .slice(0, -4) // Remove the '.pdf'
      .replace(/-/g, '+'); // Replace '-' with '+'

    // Create the search query URL
    const searchUrl = `https://www.electoralcommission.org.uk/search?search=${filename}`;
    return (
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        Search the Website for this PDF
      </a>
    );
  } else {
    // Replace underscores with slashes and remove the file extension
    adjustedSource = adjustedSource.replace(/_/g, '/').slice(0, -4);

    const finalUrl = 'https://www.electoralcommission.org.uk/' + adjustedSource;
    return (
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        {finalUrl}
      </a>
    );
  }
}

// Helper function to format the document content for display
function formatDocumentContent(content: string): string {
  // Replace multiple newlines and spaces with a single space
  let cleanedContent = content
    .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with a single space
    .trim(); // Trim whitespace from the start and end

  // Add '...' to the beginning if it doesn't start with a capital letter
  if (cleanedContent && !cleanedContent.charAt(0).match(/[A-Z]/)) {
    cleanedContent = '...' + cleanedContent;
  }

  // Add '...' to the end if it doesn't end with a full stop
  if (cleanedContent && !cleanedContent.endsWith('.')) {
    cleanedContent += '...';
  }
  return cleanedContent;
}

const SourceAccordion: React.FC<{
  sourceDocs: Document<Record<string, any>>[];
  msgIdx: number;
}> = ({ sourceDocs, msgIdx }) => {
  const accordionEndRef = useRef<HTMLDivElement>(null);

  const uniqueSourceDocs = sourceDocs ? getUniqueSourceDocs(sourceDocs) : [];

  // uniqueSourceDocs.forEach((doc) => {
  //   console.log('Metadata:', doc.metadata);
  //   console.log('Source:', doc.metadata.source);
  //   console.log('URL:', doc.metadata.url);
  // });

  return (
    <div className="text-black" key={`sourceDocsAccordion-${msgIdx}`}>
      <Accordion
        type="single"
        collapsible
        className="bg-ec-grey-50 flex flex-col px-4"
      >
        <AccordionItem className="" value={`item-${msgIdx}`}>
          <AccordionTrigger
            className="container"
            onClick={() =>
              accordionEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <h3>Click For Sources</h3>
          </AccordionTrigger>
          <AccordionContent className="container">
            <>
              <ul className="list-disc">
                {uniqueSourceDocs.map((doc, index) => (
                  <li key={`src-${index}`} className="flex flex-col mb-6">
                    <ReactMarkdown linkTarget="_blank">
                      {formatDocumentContent(doc.pageContent)}
                    </ReactMarkdown>
                    <p className="italic">
                      <b>Source:</b> {formatSource(doc.metadata.source, doc.metadata.url)}
                    </p>
                  </li>
                ))}
              </ul>
              <div ref={accordionEndRef} className="h-0" />
            </>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
