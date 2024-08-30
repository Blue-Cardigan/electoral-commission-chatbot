import { useEffect, useRef, useCallback, FormEvent } from 'react';
import styles from '@/styles/Home.module.css';
import LoadingDots from './ui/LoadingDots';
import { MessageInputProps } from '@/types/chat';

// Custom event type for form submissions
type MessageSubmitEvent = FormEvent<HTMLFormElement> & {
  preventDefault: () => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  loading,
  error,
  query,
  setQuery,
  handleQuerySubmit,
  clearError,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleEnter = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && query.trim()) {
      e.preventDefault();
      handleQuerySubmit(e as unknown as MessageSubmitEvent);
    }
  }, [query, handleQuerySubmit]);

  return (
    <div className="flex justify-center container align-center px-4 py-0 flex-col -order-1 mt-3">
      {error && (
        <div className="border border-red-400 rounded-md p-4 mb-4">
          <p className="text-red-500">{error}</p>
          <button onClick={clearError} className="text-red-500 underline mt-2">
            Dismiss
          </button>
        </div>
      )}
      <div className={`${styles.cloudform} relative w-full`}>
        <form onSubmit={(e: MessageSubmitEvent) => handleQuerySubmit(e)} className="relative w-full">
          <textarea
            disabled={loading}
            onKeyDown={handleEnter}
            ref={textAreaRef}
            rows={1}
            maxLength={512}
            id="userInput"
            name="userInput"
            placeholder={loading ? 'Waiting for response...' : 'Ask a question...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${styles.textarea} relative w-full`}
            aria-label="Enter your question"
          />
          <button
            type="submit"
            disabled={loading}
            className="bottom-5 right-4 text-neutral-400 bg-none p-1.5 border-none absolute"
            aria-label="Send message"
          >
            {loading ? (
              <div className={`${styles.loadingwheel} bottom-2 right-3 absolute`}>
                <LoadingDots color="#003057" />
              </div>
            ) : (
              <svg
                viewBox="0 0 20 20"
                className={styles.svgicon}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            )}
          </button>
        </form>
        <div className="w-full text-center text-xs italic text-gray-400 font-light">
          Powered by GPT-4
        </div>
      </div>
    </div>
  );
};
