import { OpenAI } from "openai";
import { NextApiRequest, NextApiResponse } from 'next';
import { formatSource } from './formUrls';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.ASSISTANT_ID;

type Annotation = {
  type: 'file_citation' | 'file_path';
  text: string;
  file_citation?: {
    file_id: string;
    quote: string;
  };
  file_path?: {
    file_id: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, threadId } = req.body;

  if (!threadId) {
    return res.status(400).json({ error: 'Thread ID is required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: "Provide a concise answer based on the provided documents. Use British English spelling." + message
    });

    const stream = await openai.beta.threads.runs.stream(
      threadId,
      { assistant_id: assistantId || '' }
    );

    let assistantResponse = '';
    let annotationIndex = 0;
    const annotationMap = new Map<number, string>();

    stream
      .on("textCreated", () => {
        res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
      })
      .on("textDelta", (delta) => {
        let processedDelta = delta.value?.replace(/【(.+?)】/g, (match, content) => {
          annotationMap.set(annotationIndex, content);
          const replacement = `[${annotationIndex}]`;
          annotationIndex++;
          return replacement;
        });
        assistantResponse += processedDelta;
        res.write(`data: ${JSON.stringify({ type: 'update', content: processedDelta })}\n\n`);
      })
      .on("messageDone", async (event) => {
        if (event.content[0].type === "text") {
          const { text } = event.content[0];
          const annotations = text.annotations as Annotation[];

          for (let i = 0; i < annotationMap.size; i++) {
            const originalContent = annotationMap.get(i);
            if (originalContent) {
              const annotation = annotations.find(a => a.text.includes(originalContent));
              if (annotation) {
                if (annotation.file_citation) {
                  const citedFile = await openai.files.retrieve(annotation.file_citation.file_id);
                  const formattedSource = formatSource(citedFile.filename);
                  const replacement = `[[CITATION:${formattedSource}]]`;
                  assistantResponse = assistantResponse.replace(`[${i}]`, replacement);
                } else if (annotation.file_path) {
                  const citedFile = await openai.files.retrieve(annotation.file_path.file_id);
                  const formattedSource = formatSource(citedFile.filename);
                  const replacement = `[[FILE:${formattedSource}]]`;
                  assistantResponse = assistantResponse.replace(`[${i}]`, replacement);
                }
              } else {
                // If no matching annotation is found, assume it's a filename
                const formattedSource = formatSource(originalContent);
                const replacement = `[[FILE:${formattedSource}]]`;
                assistantResponse = assistantResponse.replace(`[${i}]`, replacement);
              }
            }
          }

          // Add commas between consecutive citations
          assistantResponse = assistantResponse.replace(/(\]\])(\[\[)/g, '$1, $2');

          res.write(`data: ${JSON.stringify({ type: 'done', content: assistantResponse })}\n\n`);
        }
        res.end();
      })
      .on("error", (error) => {
        console.error("Stream error:", error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      });
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'An error occurred while processing your request.' })}\n\n`);
    res.end();
  }
}