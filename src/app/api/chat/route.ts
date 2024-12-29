import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Note: runtime config is no longer needed in App Router
// as Edge runtime is configured in route segment config

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { message, threadId } = await req.json();

    // Create a message in the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial 'start' event
          controller.enqueue(encoder.encode(
            JSON.stringify({ type: 'start' }) + '\n\n'
          ));

          const runStream = await openai.beta.threads.runs.createAndStream(
            threadId, { assistant_id: process.env.ASSISTANT_ID! }
          );
    
          for await (const part of runStream) {
            if (part.event === "thread.message.delta") {
              const content = part.data.delta.content;
              if (content && content.length > 0) {
                const firstContent = content[0];
                if ('text' in firstContent) {
                  const textContent = firstContent.text?.value;
                  if (textContent) {
                    controller.enqueue(encoder.encode(
                      JSON.stringify({ 
                        type: 'update', 
                        content: textContent 
                      }) + '\n\n'
                    ));
                  }
                }
              }
            } else if (part.event === "thread.message.completed") {
              if (part.data.content[0].type === "text") {
                const { text } = part.data.content[0];
                const { annotations } = text;
                const citations = [];

                let index = 0;
                for (let annotation of annotations) {
                  text.value = text.value.replace(annotation.text, "[" + index + "]");
                  if ('file_citation' in annotation) {
                    const file_citation = (annotation as { file_citation: { file_id: string } }).file_citation;
                    if (file_citation) {
                      const citedFile = await openai.files.retrieve(file_citation.file_id);
                      // Send citation event
                      controller.enqueue(encoder.encode(
                        JSON.stringify({
                          type: 'citation',
                          citationContent: citedFile.filename,
                          citationIndex: index,
                          url: `https://electoralcommission.org.uk/${citedFile.filename.split('.txt')[0].replace(/(pdf_file)|_/g, (match) => match === 'pdf_file' ? match : '/')}${citedFile.filename.includes('pdf_file') ? '.pdf' : ''}`
                        }) + '\n\n'
                      ));
                      citations.push({
                        citationIndex: index,
                        citationContent: citedFile.filename,
                        url: `https://electoralcommission.org.uk/${citedFile.filename.split('.txt')[0].replace(/(pdf_file)|_/g, (match) => match === 'pdf_file' ? match : '/')}${citedFile.filename.includes('pdf_file') ? '.pdf' : ''}`
                      });
                    }
                  }
                  index++;
                }

                // Send final done event with complete content and citations
                controller.enqueue(encoder.encode(
                  JSON.stringify({
                    type: 'done',
                    content: text.value,
                    citations: citations
                  }) + '\n\n'
                ));
              }
            }
          }
          
          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.error(error);
        }
      }
    });      

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in streaming route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
} 