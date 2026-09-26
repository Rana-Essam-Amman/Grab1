import React from 'react';
import { Edit, Trash, TickCircle } from 'iconsax-react';

export interface ListingActionsRowProps {
  readonly isArabic: boolean;
  readonly status?: string;
  readonly onEdit: () => void;
  readonly onMarkSold: () => void;
  readonly onDelete: () => void;
}

export const ListingActionsRow: React.FC<ListingActionsRowProps> = ({
  isArabic, status, onEdit, onMarkSold, onDelete,
}) => (
  <div className="absolute bottom-3 start-3 flex gap-2 z-20">
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
