export type Document = {
  pageContent: string;
  metadata: Record<string, any>;
};

export interface Message {
  type: 'apiMessage' | 'userMessage';
  message: string;
  citations?: Array<{ type: 'file_citation' | 'file_path'; text: string }>;
}

export type MessageState = {
  messages: Message[];
  pending?: string;
  history: [string, string][];
  pendingSourceDocs?: Document[];
};

export type MessageInputProps = {
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (query: string) => void;
  handleQuerySubmit: (e: React.FormEvent<HTMLFormElement>, threadId: string) => void;
  clearError: () => void;
  threadId: string;
};