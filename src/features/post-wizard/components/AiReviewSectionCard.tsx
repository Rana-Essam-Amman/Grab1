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
    <div className="px-4 py-3 flex items-center gap-2.5 border-b border-line bg-canvas/40">
      <span className="w-1 h-4 rounded-full bg-accent shrink-0" />
      <h3 className="text-[13px] font-bold text-ink flex-1">{title}</h3>
      {trailing && (
        <span className="text-[11px] font-bold text-ink-muted">{trailing}</span>
      )}
    </div>
    <div className="bg-surface px-4 py-4">{children}</div>
  </div>
);
