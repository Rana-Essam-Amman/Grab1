import React from 'react';
import { Edit, Trash, TickCircle, ArrowUp2 } from 'iconsax-react';

export interface ListingActionsRowProps {
  readonly isArabic: boolean;
  readonly status?: string;
  readonly onEdit: () => void;
  readonly onMarkSold: () => void;
  readonly onDelete: () => void;
  readonly onBump: () => void;
  readonly bumpDisabled?: boolean;
}

export const ListingActionsRow: React.FC<ListingActionsRowProps> = ({
  isArabic, status, onEdit, onMarkSold, onDelete, onBump, bumpDisabled = false,
}) => (
  <div className="absolute bottom-3 start-3 flex gap-2 z-20">
    {status !== 'sold' && (
      <button
        onClick={onBump}
        disabled={bumpDisabled}
        className={`p-2 rounded-lg transition-colors ${bumpDisabled ? 'bg-canvas text-ink-muted cursor-not-allowed' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
        title={isArabic ? 'رفع الإعلان (3 مرات/يوم)' : 'Bump ad (3×/day)'}
      >
        <ArrowUp2 size={16} variant="Linear" color={bumpDisabled ? '#94A3B8' : '#D97706'} />
      </button>
    )}
    <button
      onClick={onEdit}
      className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
      title={isArabic ? 'تعديل الإعلان' : 'Edit ad'}
    >
      <Edit size={16} variant="Linear" color="#2563EB" />
    </button>
    {status !== 'sold' && (
      <button
        onClick={onMarkSold}
        className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        title={isArabic ? 'تم البيع' : 'Mark as sold'}
      >
        <TickCircle size={16} variant="Linear" color="#16A34A" />
      </button>
    )}
    <button
      onClick={onDelete}
      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      title={isArabic ? 'حذف الإعلان' : 'Delete ad'}
    >
      <Trash size={16} variant="Linear" color="#DC2626" />
    </button>
  </div>
);
