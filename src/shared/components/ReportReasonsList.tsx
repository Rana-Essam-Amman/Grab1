import React from 'react';

interface Reason {
  id: string;
  labelAr: string;
  labelEn: string;
}

interface ReportReasonsListProps {
  reasons: Reason[];
  reason: string;
  isArabic: boolean;
  handleReasonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ReportReasonsList: React.FC<ReportReasonsListProps> = ({
  reasons,
  reason,
  isArabic,
  handleReasonChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {reasons.map((r) => (
        <label
          key={r.id}
          className={`p-3 rounded-xl border-2 flex items-center gap-3 cursor-pointer text-sm transition-all ${
            reason === r.id
              ? 'bg-primary/5 border-primary text-ink font-bold'
              : 'bg-surface border-border text-ink-soft font-medium hover:border-line-strong'
          }`}
        >
          <input
            type="radio"
            name="reportReason"
            value={r.id}
            checked={reason === r.id}
            onChange={handleReasonChange}
            className="accent-primary w-4 h-4"
          />
          <span>{isArabic ? r.labelAr : r.labelEn}</span>
        </label>
      ))}
    </div>
  );
};
