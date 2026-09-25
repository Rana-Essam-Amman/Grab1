import React from 'react';
import { Magicpen } from 'iconsax-react';
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
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 transform group-hover:scale-105 active:scale-95 shadow-sm ${item.bgColor}`}
            >
              {item.icon}
            </div>
            <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#E57E25] transition-colors truncate max-w-full">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {toastMessage && (
        <div className="mt-3 p-3 bg-[#1a2238] text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg">
          <Magicpen variant="Bold" size={16} color="#E57E25" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
