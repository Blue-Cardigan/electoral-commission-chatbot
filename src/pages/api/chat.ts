import { OpenAI } from "openai";
import { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = 'asst_pCz4NAU7XQMakWZ9QuryyAWu';

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
      content: message
    });

    const stream = await openai.beta.threads.runs.stream(
      threadId,
      { assistant_id: assistantId }
    );

    let assistantResponse = '';
    let citationIndex = 0;
    let citationMap: Record<string, string> = {};
    let pendingReplacements: Array<{ original: string, replacement: string }> = [];

    stream
      .on("textCreated", () => {
        res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
      })
      .on("textDelta", async (delta) => {
        let updatedDelta = delta.value;

        // Process new annotations
        if (delta.annotations && delta.annotations.length > 0) {
          for (const annotation of delta.annotations) {
            const citationText = `[${citationIndex}]`;
            let citationContent = '';

            if ('file_citation' in annotation) {
              const citedFile = await openai.files.retrieve(annotation.file_citation?.file_id as string);
              const quote = (annotation.file_citation as any).quote || 'No quote available';
              citationContent = `${quote} from ${citedFile.filename}`;
            } else if ('file_path' in annotation) {
              const citedFile = await openai.files.retrieve(annotation.file_path?.file_id as string);
              citationContent = `Click <here> to download ${citedFile.filename}`;
            }

            citationMap[citationText] = citationContent;

            // Replace illegible substring in the current delta
            updatedDelta = updatedDelta?.replace(annotation.text as string, ` ${citationText}`);

            citationIndex++;
          }
        }

        assistantResponse += updatedDelta;

        // Send the updated delta to the client
        res.write(`data: ${JSON.stringify({ type: 'update', content: updatedDelta })}\n\n`);
      })
      .on("messageDone", (event) => {
        if (event.content[0].type === "text") {
          // Process any remaining pending replacements
          for (const { original, replacement } of pendingReplacements) {
            assistantResponse = assistantResponse.replace(original, replacement);
          }

          const citations = Object.entries(citationMap).map(([index, content]) => `${index} ${content}`);

          // Add footnotes to the end of the message
          const updatedContent = assistantResponse + '\n' + citations.join('\n');

          res.write(`data: ${JSON.stringify({ type: 'done', content: updatedContent, citations })}\n\n`);
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