import { Message } from '@/types/chat';

export const initMessages = (): Message[] => [
    {
      message: `Hi 👋 I find information published by the Electoral Commission, and present it to you in natural language - like a friendly database.`,
      type: 'apiMessage',
    },
    {
      message: `🤖 Remember, LLMs like me aren't perfect:
- Sometimes you need to [rephrase your question](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) to get the answer you need.
- Check the source yourself before passing on information I provide.
\n
Here are some suggestions of questions you can ask 👉  \n`,
      type: 'apiMessage',
      suggestions: [
        "Do I need to register if I'm a charity distributing leaflets during an election?",
        'Explain each of the voting systems used in UK elections and referendums',
        "How much can a candidate spend during the regulated per\iod for the police and crime commissioner election in North Wales?"
    ],
  },
];