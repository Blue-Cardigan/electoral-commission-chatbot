import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI();

async function createAssistant() {
  // Prepare file streams from @/docs
  const docsPath = path.join(__dirname, '@', 'docs');
  const files = fs.readdirSync(docsPath);
  const fileStreams = files.map(file => 
    fs.createReadStream(path.join(docsPath, file))
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
   
  await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams })

  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  console.log("Assistant created with ID:", assistant.id);
}

createAssistant().catch(console.error);

// You're a helpful AI assistant representing the UK electoral commission. You provide clear and concise legal and financial advice on UK elections. 
// Use the context to answer the question at the end. Use British English spelling.
// If the question is not related to the documents provided, suggest more relevant questions.