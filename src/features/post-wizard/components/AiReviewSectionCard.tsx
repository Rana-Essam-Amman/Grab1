import React from 'react';

interface AiReviewSectionCardProps {
  readonly title: string;
  readonly trailing?: string;
  readonly children: React.ReactNode;
}

export const AiReviewSectionCard: React.FC<AiReviewSectionCardProps> = ({
  title,
  trailing,
  children,
}) => (
  <div className="rounded-2xl overflow-hidden border border-line bg-surface shadow-xs">
    <div className="px-4 py-3 flex items-center justify-between gap-2 bg-accent/12 border-b border-accent/20">
      <h3 className="text-[13px] font-bold text-accent-strong">{title}</h3>
      {trailing && (
        <span className="text-[11px] font-bold text-accent-strong/70">{trailing}</span>
      )}
    </div>
    <div className="bg-surface px-4 py-4">{children}</div>
  </div>
);
