import React from 'react';
import { Disclaimers } from './ui/Disclaimers';
import { SIDEBAR_TEXT } from '../constants/sidebarText';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-full justify-between">
    <Title dark />
    <div className="mt-auto">
      <h3 className="pt-3 text-white">{SIDEBAR_TEXT.DISCLAIMER_TITLE}</h3>
      <Disclaimers dark />
      <div>
        <h3 className="pt-3 text-white">{SIDEBAR_TEXT.FEEDBACK_TITLE}</h3>
        <p className="text-white italic text-xs">
          <a href={`mailto:${SIDEBAR_TEXT.FEEDBACK_EMAIL}`} className="hover:text-gray-300 underline">
            {SIDEBAR_TEXT.FEEDBACK_TEXT}
          </a> 😊
        </p>
      </div>
    </div>
  </div>
);

export const Title: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div
    className={`${
      dark ? 'text-white' : 'text-black'
    } flex flex-col pl-3 gap-0 lg:gap-3`}
  >
    <div className="pt-2">{SIDEBAR_TEXT.TITLE}</div>
    <div className="text-xs pb-2">
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
