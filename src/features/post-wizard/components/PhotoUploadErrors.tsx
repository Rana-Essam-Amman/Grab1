import React from 'react';
import { Warning2 } from 'iconsax-react';

export interface PhotoUploadErrorsProps {
  readonly errors: readonly string[];
}

export const PhotoUploadErrors: React.FC<PhotoUploadErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  return (
    <div className="p-3.5 rounded-2xl bg-warning/10 border border-warning/20 flex flex-col gap-1.5">
      {errors.map((e, i) => (
        <div key={i} className="text-[12px] font-medium text-warning flex items-start gap-2">
          <Warning2 size={14} variant="Bold" className="shrink-0 mt-0.5" />
          <span>{e}</span>
        </div>
      ))}
    </div>
  );
};
