import React, { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useUI } from '@/hooks/useUI';
import { useAdmin } from './useAdmin';
import { AdminOverview } from './AdminOverview';
import { AdminTabs } from './AdminTabs';
import { ArrowRight, ArrowLeft } from 'iconsax-react';

const ADMIN_EMAIL = 'sufyanyounis83@gmail.com';

export const AdminScreen: React.FC = () => {
  const { navigateTo, isArabic } = useUI();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { market, setMarket, dashboard, loading, error, actionLoading, refresh, ...actions } = useAdmin();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email?.toLowerCase();
      if (email === ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        navigateTo('main');
      }
    });
  }, [navigateTo]);

  if (authorized === null || (!authorized && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xs text-ink-muted">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col min-h-screen bg-background" dir="rtl">
      <div className="sticky top-0 z-10 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('settings')}
            className="p-1 text-ink hover:text-primary transition-colors cursor-pointer"
            aria-label="الرجوع"
          >
            <BackIcon size={20} />
          </button>
          <h1 className="text-base font-bold text-ink">لوحة التحكم</h1>
        </div>
        <button
          onClick={() => refresh()}
          disabled={loading || actionLoading}
          className="text-xs font-semibold text-primary px-2.5 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'تحديث...' : 'تحديث'}
        </button>
      </div>

      <div className="mx-4 mt-3 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-400">
        علامة إدارية — لا تمنع الدخول حالياً
      </div>

      {error && (
        <div className="mx-4 mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <AdminOverview
        market={market}
        onMarketChange={setMarket}
        metrics={dashboard?.metrics}
      />

      <AdminTabs
        market={market}
        actions={{ refresh, ...actions }}
        actionLoading={actionLoading}
      />
    </div>
  );
};
