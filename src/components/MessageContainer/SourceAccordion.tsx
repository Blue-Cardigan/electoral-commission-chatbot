import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDocumentContent, formatSource } from '@/components/utils';
import { Document } from '@/types/chat';

function getUniqueSourceDocs(
  sourceDocs: Document[] = [],
): Document[] {
  const uniqueDocs = new Map<string, Document>();

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

export const SourceAccordion: React.FC<{
  sourceDocs: Document[];
  msgIdx: number;
}> = ({ sourceDocs, msgIdx }) => {
  const accordionEndRef = useRef<HTMLDivElement>(null);

  const uniqueSourceDocs = sourceDocs ? getUniqueSourceDocs(sourceDocs) : [];
  
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
                    <ReactMarkdown 
                      components={{
                        a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
                      }}
                      className="flex flex-col gap-4 text-black break-words"
                    >
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