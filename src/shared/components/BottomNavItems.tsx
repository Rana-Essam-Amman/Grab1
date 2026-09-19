import React from 'react';
import { motion } from 'motion/react';
import { Home, Category, MessageText, Profile, Add } from 'iconsax-react';
import { TabType } from '@/store/ui.slice';
import { ANIMATIONS } from '@/config/animations.config';

interface BottomNavItemsProps {
  activeTab: TabType;
  isArabic: boolean;
  hasUnread: boolean;
  handleTabClick: (tab: TabType) => void;
}

export const BottomNavItems: React.FC<BottomNavItemsProps> = ({
  activeTab,
  isArabic,
  hasUnread,
  handleTabClick,
}) => {
  return (
    <>
      {/* 1. Explore */}
      <motion.button
        {...ANIMATIONS.tap}
        onClick={() => handleTabClick('explore')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'explore' ? 'nav-btn-active font-bold text-primary' : 'nav-btn-inactive text-ink-soft'
        }`}
      >
        <Home variant="Bold" size={24} color={activeTab === 'explore' ? '#E57E25' : '#94A3B8'} />
        <span className="text-[10px]">{isArabic ? 'الرئيسية' : 'Explore'}</span>
      </motion.button>

      {/* 2. Categories */}
      <motion.button
        {...ANIMATIONS.tap}
        onClick={() => handleTabClick('categories')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'categories' ? 'nav-btn-active font-bold text-primary' : 'nav-btn-inactive text-ink-soft'
        }`}
      >
        <Category variant="Bold" size={24} color={activeTab === 'categories' ? '#E57E25' : '#94A3B8'} />
        <span className="text-[10px]">{isArabic ? 'الأقسام' : 'Categories'}</span>
      </motion.button>

      {/* 3. Post Ad (Raised Action Button) */}
      <div className="flex flex-col items-center justify-start relative">
        <motion.button
          {...ANIMATIONS.tap}
          onClick={() => handleTabClick('post')}
          className="relative -mt-6 rounded-full hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label={isArabic ? 'أضف إعلان' : 'Post ad'}
        >
          <div className="rounded-full p-3 flex items-center justify-center shadow-md bg-canvas border border-border">
            <Add variant="Bold" size={26} className="text-ink" color="currentColor" />
          </div>
        </motion.button>
        <span className="text-[10px] font-bold text-ink mt-1">{isArabic ? 'أضف إعلان' : 'Post Ad'}</span>
      </div>

      {/* 4. Messages */}
      <motion.button
        {...ANIMATIONS.tap}
        onClick={() => handleTabClick('messages')}
        className={`flex flex-col items-center justify-center gap-1 relative transition-colors cursor-pointer ${
          activeTab === 'messages' ? 'nav-btn-active font-bold text-primary' : 'nav-btn-inactive text-ink-soft'
        }`}
      >
        <div className="relative">
          <MessageText variant="Bold" size={24} color={activeTab === 'messages' ? '#E57E25' : '#94A3B8'} />
          {hasUnread && (
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-danger border border-white shadow-xs" />
          )}
        </div>
        <span className="text-[10px]">{isArabic ? 'الرسائل' : 'Messages'}</span>
      </motion.button>

      {/* 5. My Ads */}
      <motion.button
        {...ANIMATIONS.tap}
        onClick={() => handleTabClick('my-ads')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'my-ads' ? 'nav-btn-active font-bold text-primary' : 'nav-btn-inactive text-ink-soft'
        }`}
      >
        <Profile variant="Bold" size={24} color={activeTab === 'my-ads' ? '#E57E25' : '#94A3B8'} />
        <span className="text-[10px]">{isArabic ? 'إعلاناتي' : 'My Ads'}</span>
      </motion.button>
    </>
  );
};
