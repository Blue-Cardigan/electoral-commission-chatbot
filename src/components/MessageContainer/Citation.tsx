import React from 'react';

interface CitationProps {
  index: number;
  url: string;
  onClick: () => void;
}

export const Citation: React.FC<CitationProps> = ({ index, url, onClick }) => {
  return (
    <sup>
      <a
        href={url}
        onClick={onClick} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
      >
        {index+1}
      </a>
    </sup>
  );
};