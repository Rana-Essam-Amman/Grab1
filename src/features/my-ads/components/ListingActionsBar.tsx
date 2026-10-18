import React from 'react';
import { Edit, Trash, TickCircle } from 'iconsax-react';

export interface ListingActionsBarProps {
  readonly isArabic: boolean;
  readonly status?: string;
  readonly onEdit: () => void;
  readonly onMarkSold: () => void;
  readonly onDelete: () => void;
}

export const ListingActionsBar: React.FC<ListingActionsBarProps> = ({
  isArabic, status, onEdit, onMarkSold, onDelete,
}) => {
  const isSold = status === 'sold';
  const cell = 'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors active:scale-[0.98]';

  return (
    <div className="relative z-10 flex items-stretch divide-x divide-line border-t border-line bg-surface">
      <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(); }} className={`${cell} text-info hover:bg-info/10`}>
        <Edit size={16} variant="Linear" color="currentColor" />
        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
      </button>
      {!isSold && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onMarkSold(); }} className={`${cell} text-success hover:bg-success/10`}>
          <TickCircle size={16} variant="Linear" color="currentColor" />
          <span>{isArabic ? 'تم البيع' : 'Sold'}</span>
        </button>
      )}
      <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }} className={`${cell} text-danger hover:bg-danger/10`}>
        <Trash size={16} variant="Linear" color="currentColor" />
        <span>{isArabic ? 'حذف' : 'Delete'}</span>
      </button>
    </div>
  );
};
