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
    const citations: string[] = [];

    stream
      .on("textCreated", () => {
        res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
      })
      .on("textDelta", (delta) => {
        assistantResponse += delta.value; // Changed from delta.text to delta.value
        res.write(`data: ${JSON.stringify({ type: 'update', content: delta.value })}\n\n`);
      })
      .on("messageDone", async (event) => {
        if (event.content[0].type === "text") {
          const { text } = event.content[0];
          const { annotations } = text;

          let citations: string[] = [];
          let updatedContent = text.value;

          for (let [index, annotation] of annotations.entries()) {
            // Replace the text with a footnote
            updatedContent = updatedContent.replace(annotation.text, ` [${index}]`);

            // Gather citations based on annotation attributes
            if ('file_citation' in annotation) {
              const citedFile = await openai.files.retrieve(annotation.file_citation.file_id);
              const quote = (annotation.file_citation as any).quote || 'No quote available';
              citations.push(`[${index}] ${quote} from ${citedFile.filename}`);
            } else if ('file_path' in annotation) {
              const citedFile = await openai.files.retrieve(annotation.file_path.file_id);
              citations.push(`[${index}] Click <here> to download ${citedFile.filename}`);
            }
          }

          // Add footnotes to the end of the message
          updatedContent += '\n' + citations.join('\n');

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