import React, { lazy } from 'react';
import { useScreenFromUrl } from './useScreenFromUrl';
import { useRegistry } from '@/shared/registry';
import { useUIStore } from '@/store/ui.slice';
import { AdminScreen } from '@/features/admin/AdminScreen';
import { ExploreScreen } from '@/features/explore/screens/ExploreScreen';

const CategoriesScreen = lazy(() => import('@/features/categories/screens/CategoriesScreen').then((m) => ({ default: m.CategoriesScreen })));
const MyAdsScreen = lazy(() => import('@/features/my-ads/screens/MyAdsScreen').then((m) => ({ default: m.MyAdsScreen })));
const MessagesScreen = lazy(() => import('@/features/chat/screens/MessagesScreen').then((m) => ({ default: m.MessagesScreen })));
const ThreadScreen = lazy(() => import('@/features/chat/screens/ThreadScreen').then((m) => ({ default: m.ThreadScreen })));
const ListingDetailScreen = lazy(() => import('@/features/listings/screens/ListingDetailScreen').then((m) => ({ default: m.ListingDetailScreen })));
const SellerProfileScreen = lazy(() => import('@/features/listings/screens/SellerProfileScreen').then((m) => ({ default: m.SellerProfileScreen })));
const SearchResultsScreen = lazy(() => import('@/features/listings/screens/SearchResultsScreen').then((m) => ({ default: m.SearchResultsScreen })));
const SettingsScreen = lazy(() => import('@/features/profile/screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));
const TermsScreen = lazy(() => import('@/features/auth/screens/TermsScreen').then((m) => ({ default: m.TermsScreen })));
const PricingScreen = lazy(() => import('@/features/pricing/screens/PricingScreen').then((m) => ({ default: m.PricingScreen })));
const FiltersScreen = lazy(() => import('@/features/explore/screens/FiltersScreen').then((m) => ({ default: m.FiltersScreen })));
const ChooseCategoryScreen = lazy(() => import('@/features/post-wizard/screens/ChooseCategoryScreen').then((m) => ({ default: m.ChooseCategoryScreen })));
const ChooseSubcategoryScreen = lazy(() => import('@/features/post-wizard/screens/ChooseSubcategoryScreen').then((m) => ({ default: m.ChooseSubcategoryScreen })));
const PhotoUploadScreen = lazy(() => import('@/features/post-wizard/screens/PhotoUploadScreen').then((m) => ({ default: m.PhotoUploadScreen })));
const LocationPickScreen = lazy(() => import('@/features/post-wizard/screens/LocationPickScreen').then((m) => ({ default: m.LocationPickScreen })));
const PostDetailsScreen = lazy(() => import('@/features/post-wizard/screens/PostDetailsScreen').then((m) => ({ default: m.PostDetailsScreen })));
const PublishSuccessScreen = lazy(() => import('@/features/post-wizard/screens/PublishSuccessScreen').then((m) => ({ default: m.PublishSuccessScreen })));
const AiDraftScreen = lazy(() => import('@/features/post-wizard/screens/AiDraftScreen').then((m) => ({ default: m.AiDraftScreen })));
const AiReviewScreen = lazy(() => import('@/features/post-wizard/screens/AiReviewScreen').then((m) => ({ default: m.AiReviewScreen })));
const PostAdEntryScreen = lazy(() => import('@/features/post-wizard/screens/PostAdEntryScreen').then((m) => ({ default: m.PostAdEntryScreen })));
const CategoryPickScreen = lazy(() => import('@/features/post-wizard/screens/CategoryPickScreen').then((m) => ({ default: m.CategoryPickScreen })));
const AiCaptureScreen = lazy(() => import('@/features/post-wizard/screens/AiCaptureScreen').then((m) => ({ default: m.AiCaptureScreen })));
const WishlistScreen = lazy(() => import('@/features/wishlist/screens/WishlistScreen').then((m) => ({ default: m.WishlistScreen })));
const NotificationsScreen = lazy(() => import('@/features/profile/screens/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })));
const LoginScreen = lazy(() => import('@/features/auth/screens/LoginScreen').then((m) => ({ default: m.LoginScreen })));
const SubCategoriesScreen = lazy(() => import('@/features/categories/screens/SubCategoriesScreen').then((m) => ({ default: m.SubCategoriesScreen })));
const EditProfileScreen = lazy(() => import('@/features/profile/screens/EditProfileScreen').then((m) => ({ default: m.EditProfileScreen })));
const ProfileScreen = lazy(() => import('@/features/profile/screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));

const registryScreensMap = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

export const ScreenRouter: React.FC = () => {
  const { currentScreen, activeTab } = useScreenFromUrl();
  const { screens: registryScreens } = useRegistry();
  const isArabic = useUIStore((s) => s.isArabic);

  if (registryScreensMap.size === 0) {
    registryScreens.forEach((def, name) => {
      registryScreensMap.set(name, React.lazy(def.component as any));
    });
  }

  const renderRegistryScreen = (screenName: string) => {
    const LazyComponent = registryScreensMap.get(screenName);
    return LazyComponent ? <LazyComponent /> : null;
  };

  const r = (name: string, Component: React.ComponentType) => renderRegistryScreen(name) ?? <Component />;

  switch (currentScreen) {
    case 'login': return r('login', LoginScreen);
    case 'notifications': return r('notifications', NotificationsScreen);
    case 'wishlist': return r('wishlist', WishlistScreen);
    case 'listing-detail': return r('listing-detail', ListingDetailScreen);
    case 'seller-profile': return r('seller-profile', SellerProfileScreen);
    case 'search-results': return r('search-results', SearchResultsScreen);
    case 'settings': return r('settings', SettingsScreen);
    case 'admin': return r('admin', AdminScreen);
    case 'register': return <LoginScreen />;
    case 'terms': return r('terms', TermsScreen);
    case 'pricing': return r('pricing', PricingScreen);
    case 'filters': return r('filters', FiltersScreen);
    case 'thread': return r('thread', ThreadScreen);
    case 'post-category': return r('post-category', ChooseCategoryScreen);
    case 'post-subcategory': return r('post-subcategory', ChooseSubcategoryScreen);
    case 'post-photos': return r('post-photos', PhotoUploadScreen);
    case 'post-location': return r('post-location', LocationPickScreen);
    case 'post-details': return r('post-details', PostDetailsScreen);
    case 'post-publish-success': return r('post-publish-success', PublishSuccessScreen);
    case 'post-ai-draft': return r('post-ai-draft', AiDraftScreen);
    case 'post-ai-review': return r('post-ai-review', AiReviewScreen);
    case 'post-ai-capture': return r('post-ai-capture', AiCaptureScreen);
    case 'post-category-pick': return r('post-category-pick', CategoryPickScreen);
    case 'sub-categories': return r('sub-categories', SubCategoriesScreen);
    case 'edit-profile': return r('edit-profile', EditProfileScreen);
    case 'profile': return r('profile', ProfileScreen);
    case 'main':
      switch (activeTab) {
        case 'categories': return <CategoriesScreen />;
        case 'messages': return <MessagesScreen />;
        case 'my-ads': return <MyAdsScreen />;
        case 'explore':
        default: return <ExploreScreen />;
      }
    default: return renderRegistryScreen(currentScreen);
  }
};
