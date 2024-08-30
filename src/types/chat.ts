export type Document = {
  pageContent: string;
  metadata: Record<string, any>;
};

export type Message = {
  type: 'apiMessage' | 'userMessage';
  message: string;
  isStreaming?: boolean;
  sourceDocs?: Document[];
  suggestions?: string[];
};

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
  handleQuerySubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearError: () => void;
};