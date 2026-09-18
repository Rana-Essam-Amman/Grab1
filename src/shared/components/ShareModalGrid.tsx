import React from 'react';
import { Sparkles } from 'lucide-react';
import { ShareItem } from './useShareItems';

interface ShareModalGridProps {
  shareItems: ShareItem[];
  toastMessage: string | null;
}

export const ShareModalGrid: React.FC<ShareModalGridProps> = ({
  shareItems,
  toastMessage,
}) => {
  return (
    <>
      <div className="grid grid-cols-5 gap-2 pt-1 pb-2">
        {shareItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${item.bgColor} ${item.shadowColor}`}
            >
              {item.icon}
            </div>
            <span className="text-[11px] font-bold text-ink group-hover:text-primary transition-colors truncate max-w-full">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {toastMessage && (
        <div className="mt-3 p-3 bg-ink text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg animate-in fade-in zoom-in duration-200">
          <Sparkles size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
