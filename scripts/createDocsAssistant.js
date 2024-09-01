import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readdir, createReadStream } from 'fs';
import { promisify } from 'util';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();
const readdirAsync = promisify(readdir);

async function createAssistant() {
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Document Store",
  });

  const subdirectories = ['1', '2', '2_1', '2_2', '2_3', '2_4', 'Big'];
  const chunkSize = 400;

  for (const subdir of subdirectories) {
    const docsPath = join(__dirname, '..', 'docs', subdir);
    const allFiles = await readdirAsync(docsPath);
    const files = allFiles.filter(file => extname(file) !== '');
    
    // Process files in chunks
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      const fileStreams = chunk.map(file => 
        createReadStream(join(docsPath, file))
      );

      // Upload files and poll until processing is complete
      await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });
      console.log(`Uploaded ${chunk.length} files from ${subdir}`);
    }
  }

  // Create the assistant
  const assistant = await openai.beta.assistants.create({
    name: "Electoral Commission Assistant",
    instructions: "You are an expert in the UK Electoral Commission's rules and regulations. Provide concise answers based on the provided documents. Use British English spelling.",
    model: "gpt-4o",
    tools: [{ type: "file_search" }]
  });

  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  console.log("Assistant created with ID:", assistant.id);
}

createAssistant().catch(console.error);