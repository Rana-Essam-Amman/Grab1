import { useState, useEffect, useCallback } from 'react';
import * as rpc from './adminRpc';

interface PhoneRequest {
  id: string;
  user_id: string;
  current_phone: string | null;
  requested_phone: string;
  reason: string;
  created_at: string;
  user_name: string;
}

export function PhoneRequestsTab() {
  const [requests, setRequests] = useState<PhoneRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await rpc.listPendingPhoneRequests();
    if (fetchErr) {
      setError('فشل تحميل الطلبات');
    } else if (data) {
      setRequests(data as PhoneRequest[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const { error: approveErr } = await rpc.approvePhoneChangeRequest(id);
    if (approveErr) {
      setError(approveErr.message || 'تعذرت الموافقة');
    } else {
      await loadRequests();
    }
    setActionLoading(null);
  };

  if (loading) {
    return <div className="py-8 text-center text-xs text-ink-muted">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-xs text-red-500">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="py-8 text-center text-xs text-ink-muted">لا توجد طلبات تغيير أرقام حالياً</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((req) => (
        <div key={req.id} className="p-3 bg-surface border border-border rounded-xl flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-ink">{req.user_name}</span>
            <span className="text-[10px] text-ink-muted">
              {new Date(req.created_at).toLocaleDateString('ar-JO')}
            </span>
          </div>
          <div className="text-ink-muted">
            <span>الرقم الحالي: </span>
            <span dir="ltr" className="font-mono">{req.current_phone || 'لا يوجد'}</span>
          </div>
          <div className="text-primary font-bold">
            <span>الرقم المطلوب: </span>
            <span dir="ltr" className="font-mono">{req.requested_phone}</span>
          </div>
          <div className="bg-canvas p-2 rounded-lg text-ink-muted text-[11px]">
            السبب: {req.reason}
          </div>
          <button
            onClick={() => handleApprove(req.id)}
            disabled={actionLoading === req.id}
            className="mt-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg self-end cursor-pointer disabled:opacity-50"
          >
            {actionLoading === req.id ? 'جاري الموافقة...' : 'موافقة وتغيير الرقم'}
          </button>
        </div>
      ))}
    </div>
  );
}
