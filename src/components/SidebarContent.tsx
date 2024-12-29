import React from 'react';
import { Disclaimers } from './ui/Disclaimers';
import { SIDEBAR_TEXT } from '../constants/sidebarText';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col min-h-full">
    <div className="flex-none border-b border-ec-blue-700 pb-6">
      <Title dark />
    </div>
    
    <div className="mt-auto">
      <div className="flex-none border-t border-ec-blue-700 pt-6">
        <section className="mb-6">
          <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
            {SIDEBAR_TEXT.DISCLAIMER_TITLE}
          </h3>
          <Disclaimers dark />
        </section>

        <section>
          <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
            {SIDEBAR_TEXT.FEEDBACK_TITLE}
          </h3>
          <a 
            href={`mailto:${SIDEBAR_TEXT.FEEDBACK_EMAIL}`} 
            className="text-white/80 italic text-sm transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1 -ml-2"
          >
            {SIDEBAR_TEXT.FEEDBACK_TEXT}
          </a>
        </section>
      </div>
    </div>
  </div>
);

export const Title: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className={`${dark ? 'text-white' : 'text-black'} flex flex-col gap-2 mb-6`}>
    <div className="font-semibold">{SIDEBAR_TEXT.TITLE}</div>
    <div className="text-xs">
      {SIDEBAR_TEXT.SUBTITLE.split('Campaign Lab')[0]}
      <a
        className="hover:text-gray-300 italic"
        href={SIDEBAR_TEXT.CAMPAIGN_LAB_URL}
      >
        Campaign Lab
      </a>
      {SIDEBAR_TEXT.SUBTITLE.split('Campaign Lab')[1]}
    </div>
  </div>
);
