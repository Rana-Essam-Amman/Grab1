import React, { useState } from 'react';
import { useAdminListingActions } from '../hooks/useAdminListingActions';
import { toast } from 'sonner';

interface Props {
  listingId: string;
  currentStatus: string;
  isPremium: boolean;
  isArabic: boolean;
}

export const AdminActionsPanel: React.FC<Props> = ({ listingId, currentStatus, isPremium, isArabic }) => {
  const { isProcessing, featureFree, unfeature, setStatus } = useAdminListingActions();
  const [status, setLocalStatus] = useState(currentStatus);
  const [premium, setLocalPremium] = useState(isPremium);

  const handleFeature = async () => {
    const res = await featureFree(listingId, 14);
    if (res.success) {
      setLocalPremium(true);
      toast.success(isArabic ? 'تم التمييز مجاناً (14 يوم)' : 'Featured successfully (14 days)');
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleUnfeature = async () => {
    const res = await unfeature(listingId);
    if (res.success) {
      setLocalPremium(false);
      toast.success(isArabic ? 'تم إلغاء التمييز' : 'Unfeatured successfully');
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleStatus = async (newStatus: 'active' | 'sold' | 'archived') => {
    const res = await setStatus(listingId, newStatus);
    if (res.success) {
      setLocalStatus(newStatus);
      toast.success(isArabic ? 'تم تغيير الحالة' : 'Status updated');
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3 mt-2">
      <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <span>⚡</span> {isArabic ? 'إجراءات الأدمن' : 'Admin Actions'}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {!premium ? (
          <button type="button" onClick={handleFeature} disabled={isProcessing} className="px-3 py-1.5 bg-warning/10 text-warning text-xs font-semibold rounded-lg hover:bg-warning/20 disabled:opacity-50">
            {isArabic ? 'تمييز (14 يوم)' : 'Feature (14d)'}
          </button>
        ) : (
          <button type="button" onClick={handleUnfeature} disabled={isProcessing} className="px-3 py-1.5 bg-surface border border-line text-ink-muted text-xs font-semibold rounded-lg hover:bg-surface/80 disabled:opacity-50">
            {isArabic ? 'إلغاء التمييز' : 'Unfeature'}
          </button>
        )}
        
        <div className="w-px h-6 bg-line mx-1" />

        {status !== 'sold' && (
          <button type="button" onClick={() => handleStatus('sold')} disabled={isProcessing} className="px-3 py-1.5 bg-success/10 text-success text-xs font-semibold rounded-lg hover:bg-success/20 disabled:opacity-50">
            {isArabic ? 'تم البيع' : 'Mark as Sold'}
          </button>
        )}
        
        {status !== 'active' && (
          <button type="button" onClick={() => handleStatus('active')} disabled={isProcessing} className="px-3 py-1.5 bg-info/10 text-info text-xs font-semibold rounded-lg hover:bg-info/20 disabled:opacity-50">
            {isArabic ? 'تفعيل' : 'Set Active'}
          </button>
        )}
        
        {status !== 'archived' && (
          <button type="button" onClick={() => handleStatus('archived')} disabled={isProcessing} className="px-3 py-1.5 bg-danger/10 text-danger text-xs font-semibold rounded-lg hover:bg-danger/20 disabled:opacity-50">
            {isArabic ? 'أرشفة' : 'Archive'}
          </button>
        )}
      </div>
    </div>
  );
};
