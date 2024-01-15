import React, { useEffect, useState } from 'react';
import { Message, MessageState } from '@/types/chat';
import Layout from '@/components/layout';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';
import { generateUUID, handleApiRequest } from '@/components/util';

const initMessages = (): Message[] => [
  {
    message: `Hi! I'm the (unofficial) Electoral Commission chatbot, I help you find information and sources related to the UK Electoral Commission to make your life easier!\n
    \u00A0\n
![A meme where AI is being used to do a job better](/work-working.gif)`,
    type: 'apiMessage',
  },
  {
    message: `Ask me a question or give me a prompt! 
I index everything published by the Electoral Commission, so you can be as specific as you like.\n
\u00A0\n
Here are some suggestions:  \n`,
    type: 'apiMessage',
    suggestions: [
      "Do I need to register if I'm a charity distributing leaflets during an election?",
      "What's the typical budget for a Police and Crime Commissioner campaign in Manchester?",
      'Provide a structured response indicating the spending limits for political parties at each stage in the election',
    ],
  },
];

export default function Home() {
  // TODO: Loooooads of state handlers here - need to implement global state or something
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<MessageState>({
    messages: initMessages(),
    history: [],
  });
  const [conversationId, setconversationId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setTimeout(() => error && setError(null), 2500);
  }, [error]);

  useEffect(() => {
    const newconversationId = generateUUID();
    window.localStorage.setItem('conversationId', newconversationId);
    setconversationId(newconversationId);
  }, []);

  async function handleQuerySubmit() {
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    const response = await handleApiRequest(
      question,
      messageState.history,
      conversationId,
    );

    if (response.error) {
      setError(response.error);
    } else {
      const sourceDocs = response.sourceDocuments || [];
      const message = response.text ?? '';
      // Update the local state with the new message and response
      setMessageState((prevState) => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            type: 'userMessage',
            message: question,
            sourceDocs: [],
          },
          {
            type: 'apiMessage',
            message,
            sourceDocs,
          },
        ],
        history: [...prevState.history, [question, message]],
      }));
    }

    setLoading(false);
  }

  return (
    <Layout>
      <MessageContainer
        loading={loading}
        messageState={messageState}
        onSuggestionClick={setQuery}
      />
      <MessageInput
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
      />
    </Layout>
  );
}
