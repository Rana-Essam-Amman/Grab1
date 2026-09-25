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
  <div className="rounded-2xl overflow-hidden border border-line shadow-sm">
    <div className="bg-[#E57E25] px-4 py-3 flex items-center justify-between gap-2">
      <h3 className="text-white text-[14px] font-bold">{title}</h3>
      {trailing && (
        <span className="text-white/85 text-[11px] font-bold">{trailing}</span>
      )}
    </div>
    <div className="bg-white px-4 py-4">{children}</div>
  </div>
);
