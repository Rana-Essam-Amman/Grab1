import { useUI } from '@/hooks/useUI';
import { TabType } from '@/store/ui.slice';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback } from 'react';
import { BottomNavItems } from './BottomNavItems';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo, isArabic, isSearchFocused } = useUI();
  const { conversations } = useChat();
  const { user, authStatus } = useAuth();

  const handleTabClick = useCallback((tab: TabType) => {
    if (tab === 'post') {
      navigateTo('post-ad-entry');
    } else if ((tab === 'messages' || tab === 'my-ads') && (authStatus === 'unauthenticated' || !user)) {
      navigateTo('login');
    } else {
      setActiveTab(tab);
      navigateTo('main');
    }
  }, [authStatus, user, navigateTo, setActiveTab]);

  if (currentScreen !== 'main') {
    return null;
  }

  if (isSearchFocused) {
    return null;
  }

  const hasUnread = conversations.length > 0;

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-[56px] border-t border-line grid grid-cols-5 z-40 px-1"
      style={{ backgroundColor: 'var(--color-nav)' }}
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
