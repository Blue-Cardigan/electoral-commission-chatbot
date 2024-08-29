import React from 'react';

export const Disclaimers: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <ul
    className={`${
      dark ? 'text-white/70' : 'text-gray-500'
    } py-2 px-6 text-sm  list-disc `}
  >
    <li>The answers provided are not legal advice.</li>
    <li>LLMs can hallucinate; check the sources provided</li>
  </ul>
);
