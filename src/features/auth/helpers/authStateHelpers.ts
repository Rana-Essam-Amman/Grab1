import { useAuthStore } from '../store/auth.slice';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings';
import { toast } from 'sonner';

/** Clear all auth + listings state after a confirmed sign-out. */
export function clearAuthState(): void {
  useAuthStore.setState({
    user: null,
    sessionToken: null,
    authStatus: 'unauthenticated',
    isAnonymous: false,
    profileHydrated: false,
  });
  useListingsStore.setState({ listings: [], wishlist: [] });
}

/** If a pending wishlist exists (pre-login), apply it after sign-in. */
export function resumePendingWishlist(): void {
  const ui = useUIStore.getState();
  const pendingId = ui.pendingWishlistId;
  if (!pendingId) return;
  const listing = useListingsStore.getState().listings.find((l) => l.id === pendingId);
  if (listing) {
    useListingsStore.getState().toggleWishlist(listing.id, listing.countryCode);
    toast.success(ui.isArabic ? 'تم حفظ الإعلان في المفضلة ✓' : 'Saved to favorites ✓');
  }
  ui.setPendingWishlistId(null);
}
