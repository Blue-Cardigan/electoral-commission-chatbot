import React, { useEffect, useState } from 'react';
import { Message, MessageState } from '@/types/chat';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';
import { generateUUID, handleApiRequest } from '@/components/util';

const initMessages = (): Message[] => [
  {
    message: `Hi 👋 I find the information on electoral regulations, and provide sources which link to the Electoral Commission website. Remember - what I say isn't legal advice. Check the sources before acting on the information I provide. \n
![A meme where AI is being used to do a job better](/work-working.gif)`,
    type: 'apiMessage',
  },
  {
    message: `Ask me any question - I index everything on the Electoral Commission website \n
That's a lot of overlapping information on here, so it helps if you're specific. In particular, make it clear whether you're asking about national or local elections. Also let me know which part of the UK you're talking about - England, Scotland, Wales, or Northern Ireland - as the advice may differ. 
\n
Here are some suggestions:  \n`,
    type: 'apiMessage',
    suggestions: [
      "Do I need to register if I'm a charity distributing leaflets during an election?",
      'Can you explain the different voting systems used in UK elections and referendums?',
      "How much can a candidate spend during the regulated period for the police and crime commissioner election in North Wales?"
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

  async function handleQuerySubmit(e: any) {
    e.preventDefault();
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
    <>
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
    </>
  );
}
