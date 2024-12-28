export type Document = {
  pageContent: string;
  metadata: Record<string, any>;
};

export interface Message {
  type: 'userMessage' | 'apiMessage';
  message: string;
  citations?: Citation[];
  suggestions?: string[];
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

export interface Citation {
  citationIndex: number;
  citationContent: string;
  url: string;
}