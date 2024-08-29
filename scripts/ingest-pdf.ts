import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/src/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

const filePath = 'scripts/data/scraped_pdfs';

interface SimpleDocument {
  pageContent: string;
  metadata: Record<string, any>;
}

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
      '.pdf': (path) => new PDFLoader(path),
    });

    const rawDocs = await directoryLoader.load() as SimpleDocument[];
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    let docs: SimpleDocument[] = [];
    let homelessFilenames: string[] = [];
    let invalidPDFs: string[] = [];

    for (const doc of rawDocs) {
      const baseFilename = path.basename(doc.metadata.source, '.pdf');
      const uniqueId = baseFilename.slice(-16);

      let docUrl = '';
      console.log(`Looking for URL with filename: ${baseFilename}`);
      for (const [url, meta] of Object.entries({ ...metadata1, ...metadata2 })) {
        const metaUniqueId = meta.filename.slice(-20, -4);
        if (metaUniqueId === uniqueId) {
          docUrl = url;
          console.log(`Match found: ${docUrl}`);
          break;
        }
      }

      if (!docUrl) {
        console.warn(`No URL found for document: ${baseFilename}`);
        homelessFilenames.push(baseFilename);
        continue;
      }

      try {
        const chunks = await textSplitter.splitDocuments([doc]);
        for (const chunk of chunks) {
          docs.push({
            pageContent: chunk.pageContent,
            metadata: {
              url: docUrl, // Only include the URL in the metadata
            },
          });
        }
      } catch (error) {
        console.error(`Error processing PDF: ${baseFilename}`, error);
        invalidPDFs.push(baseFilename);
        continue; // Ensure the loop continues with the next document
      }
    }

    fs.writeFileSync('homeless.txt', homelessFilenames.join('\n'));
    console.log('Homeless filenames written to homeless.txt');

    fs.writeFileSync('invalid_pdfs.txt', invalidPDFs.join('\n'));
    console.log('Invalid PDF filenames written to invalid_pdfs.txt');

    console.log('Preparing to upsert documents with embeddings...');
    const embeddings = new OpenAIEmbeddings({
        modelName: "text-embedding-3-large",
      });
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'pageContent',
    });
    console.log('Upsert complete.');
  } catch (error) {
    console.error('An unexpected error occurred during the run', error);
    throw new Error('Failed to complete the ingestion process');
  }
};

(async () => {
  await run();
  console.log('Ingestion complete');
})();