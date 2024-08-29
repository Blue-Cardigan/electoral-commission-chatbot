import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/src/utils/pinecone-client';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

const filePath = 'scripts/data/scraped_txt';

// Simplified Document interface based on LangChain documentation
interface SimpleDocument {
  pageContent: string;
  metadata: Record<string, any>;
}

// Utility function to load JSON files
const loadMetadata = (filePath: string): Record<string, any> => {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData.toString());
  } catch (error) {
    console.error(`Failed to load metadata from ${filePath}`, error);
    return {};
  }
};

const metadata1 = loadMetadata('scripts/orig_metadata.json');
const metadata2 = loadMetadata('scripts/orig_metadata_1.json');

export const run = async () => {
  try {
    const directoryLoader = new DirectoryLoader(filePath, {
      '.txt': (path) => new TextLoader(path),
    });

    const rawDocs = await directoryLoader.load() as SimpleDocument[];
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    let docs: SimpleDocument[] = [];
    let homelessFilenames: string[] = []; // Step 1: Initialize the array

    for (const doc of rawDocs) {
      const baseFilename = path.basename(doc.metadata.source, '.txt');
      const uniqueId = baseFilename.slice(-16);

      let docUrl = '';
      console.log(`Looking for URL with filename: ${baseFilename}`);
      for (const [url, meta] of Object.entries({...metadata1, ...metadata2})) {
        const metaUniqueId = meta.filename.slice(-20, -4);
        if (metaUniqueId === uniqueId) {
          docUrl = url;
          console.log(`Match found: ${docUrl}`);
          break;
        }
      }

      if (!docUrl) {
        console.warn(`No URL found for document: ${baseFilename}`);
        homelessFilenames.push(baseFilename); // Step 2: Add to the array
        continue;
      }

      const chunks = await textSplitter.splitText(doc.pageContent);
      for (const chunk of chunks) {
        docs.push({
          pageContent: chunk,
          metadata: {
            ...doc.metadata,
            url: docUrl,
          },
        });
      }
    }

    // Step 3: Write the array to homeless.txt
    fs.writeFileSync('homeless.txt', homelessFilenames.join('\n'));
    console.log('Homeless filenames written to homeless.txt');

    console.log('split docs', docs);

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-large",
    });
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'pageContent',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();