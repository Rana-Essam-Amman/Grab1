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
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-medium transition-all ${
            reason === r.id
              ? 'bg-surface border-primary text-ink shadow-xs'
              : 'border-border text-ink-soft hover:bg-surface'
          }`}
        >
          <input
            type="radio"
            name="reportReason"
            value={r.id}
            checked={reason === r.id}
            onChange={handleReasonChange}
            className="accent-primary"
          />
          <span>{isArabic ? r.labelAr : r.labelEn}</span>
        </label>
      ))}
    </div>
  );
};
