import React, { useState, useEffect, useCallback } from 'react';
import * as rpc from './adminRpc';
import type { MarketCode } from './adminRpc';
import { PhoneRequestsTab } from './PhoneRequestsTab';

type Tab = 'reports' | 'listings' | 'users' | 'revenue' | 'phoneRequests';

export const AdminTabs: React.FC<{ market: MarketCode; actions: any; actionLoading: boolean }> = ({ market, actions, actionLoading }) => {
  const [tab, setTab] = useState<Tab>('reports');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [payForm, setPayForm] = useState({ userId: '', listingId: '', product: 'featured' as any, amount: '', currency: 'JOD' });

  const loadTab = useCallback(async () => {
    if (tab === 'phoneRequests') return; // Let the child component handle its own loading
    setLoading(true);
    let res: any;
    if (tab === 'reports') res = await rpc.listReports(market, 'pending');
    else if (tab === 'listings') res = await rpc.listListings(market, 'active');
    else if (tab === 'users') res = await rpc.listUsers(market);
    if (res?.data) setItems(res.data);
    setLoading(false);
  }, [market, tab]);

  useEffect(() => { loadTab(); }, [loadTab]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.userId || !payForm.amount) return;
    const ok = await actions.recordPayment({
      userId: payForm.userId,
      listingId: payForm.listingId || null,
      product: payForm.product,
      amountCents: Math.round(parseFloat(payForm.amount) * 100),
      currency: payForm.currency
    });
    if (ok) setPayForm({ userId: '', listingId: '', product: 'featured', amount: '', currency: 'JOD' });
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-12" dir="rtl">
      <div className="flex border-b border-border text-xs font-bold">
        {[
          { id: 'reports', label: 'بلاغات' },
          { id: 'listings', label: 'إعلانات' },
          { id: 'users', label: 'مستخدمون' },
          { id: 'revenue', label: 'الدخل' },
          { id: 'phoneRequests', label: 'طلبات الأرقام' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-ink-muted'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-ink-muted">جاري التحميل...</div>
      ) : tab === 'revenue' ? (
        <form onSubmit={handlePay} className="flex flex-col gap-2 bg-surface border border-border p-3 rounded-xl text-xs">
          <span className="font-bold text-ink">تسجيل دفعة يدوية</span>
          <input placeholder="معرّف المستخدم (UUID)" value={payForm.userId} onChange={(e) => setPayForm({ ...payForm, userId: e.target.value })} className="p-2 border rounded border-border bg-background" required />
          <input placeholder="معرّف الإعلان (اختياري UUID)" value={payForm.listingId} onChange={(e) => setPayForm({ ...payForm, listingId: e.target.value })} className="p-2 border rounded border-border bg-background" />
          <div className="flex gap-2">
            <select value={payForm.product} onChange={(e) => setPayForm({ ...payForm, product: e.target.value as any })} className="p-2 border rounded border-border bg-background flex-1">
              <option value="featured">featured</option>
              <option value="turbo">turbo</option>
              <option value="auto_bump">auto_bump</option>
              <option value="vip_store">vip_store</option>
            </select>
            <input type="number" step="0.01" placeholder="المبلغ" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} className="p-2 border rounded border-border bg-background w-24" required />
            <select value={payForm.currency} onChange={(e) => setPayForm({ ...payForm, currency: e.target.value })} className="p-2 border rounded border-border bg-background w-20">
              {['JOD', 'SAR', 'USD', 'ILS', 'SYP'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" disabled={actionLoading} className="py-2 bg-primary text-white rounded font-bold cursor-pointer hover:opacity-90 disabled:opacity-50">تسجيل وتفعيل</button>
        </form>
      ) : tab === 'phoneRequests' ? (
        <PhoneRequestsTab />
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted">لا توجد بيانات حالياً</div>
      ) : (
        <div className="flex flex-col gap-2">
          {tab === 'reports' && items.map((r) => (
            <div key={r.id} className="p-2.5 bg-surface border border-border rounded-xl flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-bold text-ink"><span>{r.reason}</span><span className="text-ink-muted text-[10px]">{r.listing_title}</span></div>
              {r.details && <p className="text-ink-muted text-[11px]">{r.details}</p>}
              <div className="flex gap-1.5 pt-1">
                <button onClick={async () => { await actions.dismissReport(r.id); loadTab(); }} disabled={actionLoading} className="px-2 py-1 bg-surface border border-border rounded text-[11px] text-ink cursor-pointer">تجاهل</button>
                <button onClick={async () => { await actions.hideListing(r.listing_id); loadTab(); }} disabled={actionLoading} className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded text-[11px] cursor-pointer">اخفي الإعلان</button>
                <button onClick={async () => { const reason = prompt('سبب الحظر:'); if (reason) { await actions.banUser(r.reporter_id, reason); loadTab(); } }} disabled={actionLoading} className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-[11px] cursor-pointer">احظر</button>
              </div>
            </div>
          ))}
          {tab === 'listings' && items.map((l) => (
            <div key={l.id} className="p-2.5 bg-surface border border-border rounded-xl flex items-center justify-between text-xs">
              <div className="flex flex-col"><span className="font-bold text-ink">{l.title}</span><span className="text-ink-muted text-[11px]">{l.price} {l.currency}</span></div>
              <button onClick={async () => { await actions.hideListing(l.id); loadTab(); }} disabled={actionLoading || l.status === 'hidden'} className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded text-[11px] cursor-pointer">{l.status === 'hidden' ? 'مخفي' : 'اخفي الإعلان'}</button>
            </div>
          ))}
          {tab === 'users' && items.map((u) => (
            <div key={u.id} className="p-2.5 bg-surface border border-border rounded-xl flex items-center justify-between text-xs">
              <div className="flex flex-col"><span className="font-bold text-ink">{u.first_name || 'بدون اسم'} {u.last_name || ''}</span><span className="text-ink-muted text-[11px]">{u.phone || 'بدون رقم'} {u.banned && <span className="text-red-500">(محظور)</span>}</span></div>
              {u.banned ? (
                <button onClick={async () => { await actions.unbanUser(u.id); loadTab(); }} disabled={actionLoading} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-[11px] cursor-pointer">إلغاء الحظر</button>
              ) : (
                <button onClick={async () => { const reason = prompt('سبب الحظر:'); if (reason) { await actions.banUser(u.id, reason); loadTab(); } }} disabled={actionLoading} className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-[11px] cursor-pointer">حظر</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
