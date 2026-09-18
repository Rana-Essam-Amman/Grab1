import { useUI } from '@/hooks/useUI';
import { TabType } from '@/store/ui.slice';
import { useDraft } from '@/hooks/useDraft';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback } from 'react';
import { BottomNavItems } from './BottomNavItems';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo, isArabic, isAiFocused } = useUI();
  const { startPostFlow } = useDraft();
  const { conversations } = useChat();
  const { user, authStatus } = useAuth();

  const handleTabClick = useCallback((tab: TabType) => {
    if (tab === 'post') {
      startPostFlow();
    } else if ((tab === 'messages' || tab === 'my-ads') && (authStatus === 'unauthenticated' || !user)) {
      navigateTo('login');
    } else {
      setActiveTab(tab);
      navigateTo('main');
    }
  }, [startPostFlow, authStatus, user, navigateTo, setActiveTab]);

  if (currentScreen !== 'main' || isAiFocused) {
    return null;
  }

  const hasUnread = conversations.length > 0;

  return (
    <nav 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-[80px] bg-surface/95 backdrop-blur-md border-t border-border grid grid-cols-5 z-40 px-1"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <BottomNavItems
        activeTab={activeTab}
        isArabic={isArabic}
        hasUnread={hasUnread}
        handleTabClick={handleTabClick}
      />
    </nav>
  );
};
