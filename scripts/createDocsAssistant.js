import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, createReadStream } from 'fs';
import { promisify } from 'util';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();
const readdirAsync = promisify(readdir);

async function createAssistant() {
  // Prepare file streams from @/docs
  const docsPath = join(__dirname, '..', 'docs/test');
  const files = await readdirAsync(docsPath);
  const fileStreams = files.map(file => 
    createReadStream(join(docsPath, file))
  );

  // Create a vector store
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Document Store",
  });

  // Upload files and poll until processing is complete
  await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });

  // Create the assistant
  const assistant = await openai.beta.assistants.create({
    name: "Electoral Commission Assistant",
    instructions: "You are an expert in the UK Electoral Commission's rules and regulations. You can answer questions based on the provided documents.",
    model: "gpt-4o",
    tools: [{ type: "file_search" }]
  });

  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  console.log("Assistant created with ID:", assistant.id);
}

createAssistant().catch(console.error);