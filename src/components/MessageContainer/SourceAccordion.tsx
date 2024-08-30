import React, { useRef } from 'react';
import { Document } from 'langchain/document';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDocumentContent, formatSource } from '@/components/utils';

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

export const SourceAccordion: React.FC<{
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