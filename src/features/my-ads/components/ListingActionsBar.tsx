import React from 'react';
import { Edit, Trash, TickCircle, ArrowUp2 } from 'iconsax-react';

export interface ListingActionsBarProps {
  readonly isArabic: boolean;
  readonly status?: string;
  readonly bumpDisabled?: boolean;
  readonly onEdit: () => void;
  readonly onBump: () => void;
  readonly onMarkSold: () => void;
  readonly onDelete: () => void;
}

export const ListingActionsBar: React.FC<ListingActionsBarProps> = ({
  isArabic, status, bumpDisabled = false, onEdit, onBump, onMarkSold, onDelete,
}) => {
  const isSold = status === 'sold';
  const cell = 'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors active:scale-[0.98]';

  return (
    <div className="flex items-stretch divide-x divide-line border-t border-line bg-surface">
      <button onClick={onEdit} className={`${cell} text-blue-600 hover:bg-blue-50`}>
        <Edit size={16} variant="Linear" color="#2563EB" />
        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
      </button>
      {!isSold && (
        <button
          onClick={onBump}
          disabled={bumpDisabled}
          className={`${cell} ${bumpDisabled ? 'text-ink-muted cursor-not-allowed' : 'text-amber-700 hover:bg-amber-50'}`}
        >
          <ArrowUp2 size={16} variant="Linear" color={bumpDisabled ? '#94A3B8' : '#D97706'} />
          <span>{isArabic ? 'رفع' : 'Bump'}</span>
        </button>
      )}
      {!isSold && (
        <button onClick={onMarkSold} className={`${cell} text-green-700 hover:bg-green-50`}>
          <TickCircle size={16} variant="Linear" color="#16A34A" />
          <span>{isArabic ? 'تم البيع' : 'Sold'}</span>
        </button>
      )}
      <button onClick={onDelete} className={`${cell} text-red-600 hover:bg-red-50`}>
        <Trash size={16} variant="Linear" color="#DC2626" />
        <span>{isArabic ? 'حذف' : 'Delete'}</span>
      </button>
    </div>
  );
};
