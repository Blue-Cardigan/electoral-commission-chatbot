import { Message } from '@/types/chat';

export const initMessages = (): Message[] => [
    {
      message: `Hi 👋 I find information published by the Electoral Commission, and present it to you in natural language, with sources. 
I can help you with information on:

- Campaign spending
- Polling day
- Voting systems
- Registering to vote
- And more...!`,
      type: 'apiMessage',
    },
    {
      message: `Treat me like a friendly database. Instead of using ugly SQL queries like this one: 

\`\`\`sql
SELECT * FROM messages 
WHERE type = 'apiMessage' 
AND message LIKE '%[North Wales Police and Crime Commissioner elections]%'
\`\`\`

You can ask me questions in plain English, and I'll find the answer for you.

**Remember, LLMs like me are not perfect:**
- Sometimes you need to [rephrase your question](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) to get the answer you need.
- If you need to know something with certainty, please check the source.
\n
**Here are some suggestions of questions you can ask:**  \n`,
      type: 'apiMessage',
      suggestions: [
        "Provide a short analysis with citations",
        "Do I need to register if I'm a charity distributing leaflets during an election?",
        'Can you explain the different voting systems used in UK elections and referendums?',
        "How much can a candidate spend during the regulated period for the police and crime commissioner election in North Wales?"
    ],
  },
];