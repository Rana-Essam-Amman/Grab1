import React, { useState } from 'react';
import { Copy, TickCircle } from 'iconsax-react';

interface Props {
  id: string;
  isArabic: boolean;
}

export const ListingIdBadge: React.FC<Props> = ({ id, isArabic }) => {
  const [copied, setCopied] = useState(false);
  const shortId = id.split('-')[0]; // first 8 chars

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-line rounded-lg text-xs font-mono text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
      title={isArabic ? 'نسخ الـ ID الكامل' : 'Copy full ID'}
    >
      <span>#{shortId}</span>
      {copied ? (
        <TickCircle size={14} variant="Bold" className="text-success" />
      ) : (
        <Copy size={14} variant="Linear" />
      )}
    </button>
  );
};
