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
              ? 'bg-[#1a2238]/5 border-[#1a2238] text-[#0F172A] font-bold'
              : 'bg-white border-[#E2E8F0] text-[#334155] font-medium hover:border-[#CBD5E1]'
          }`}
        >
          <input
            type="radio"
            name="reportReason"
            value={r.id}
            checked={reason === r.id}
            onChange={handleReasonChange}
            className="accent-[#1a2238] w-4 h-4"
          />
          <span>{isArabic ? r.labelAr : r.labelEn}</span>
        </label>
      ))}
    </div>
  );
};
