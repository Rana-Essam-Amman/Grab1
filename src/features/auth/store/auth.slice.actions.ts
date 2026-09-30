import { AuthState } from './auth.slice.types';
import { UserProfile, RegisteredAccount } from '@/types';
import { globalStorage } from '@/shared/lib/marketStorage';
import { signOut } from '../services/authService';

type SetState = (fn: (state: AuthState) => void) => void;
type GetState = () => AuthState;

export const createAuthActions = (set: SetState, get: GetState) => ({
  confirmRegistration: (fallbackCountryCode?: string) => {
    const pending = get().registrationPendingUser;
    if (!pending) return;

    const defaultCountry = fallbackCountryCode || globalStorage().get<string>('catch_browse_country') || 'JO';
    const newUser: UserProfile = {
      firstName: pending.firstName || 'User',
      lastName: pending.lastName || '',
      email: pending.email || '',
      phone: pending.phone || '',
      countryCode: pending.countryCode || defaultCountry,
    };
    const token = 'token-' + Date.now();

    globalStorage().set('catch_user', newUser);
    globalStorage().set('catch_token', token);

    set((state) => {
      state.user = newUser;
      state.sessionToken = token;
      state.authStatus = 'authenticated';
      state.registrationPendingUser = null;
    });
  },

  logout: () => {
    // Fire-and-forget: clears Supabase session + fires SIGNED_OUT event
    // The useSupabaseAuthListener hook will also react to SIGNED_OUT.
    void signOut().catch(() => {
      // Ignore network errors — local logout still proceeds
    });

    globalStorage().remove('catch_user');
    globalStorage().remove('catch_token');
    set((state) => {
      state.user = null;
      state.sessionToken = null;
      state.authStatus = 'unauthenticated';
    });
  },

  loginDirectly: (email: string, phone?: string, countryCode?: string, firstName?: string) => {
    const savedBrowseCountry = globalStorage().get<string>('catch_browse_country') || 'JO';
    const finalCountry = countryCode || savedBrowseCountry;
    const newUser: UserProfile = {
      firstName: firstName || 'Test',
      lastName: 'User',
      email: email || 'test@example.com',
      phone: phone || '+962799999999',
      countryCode: finalCountry,
    };
    const token = 'token-' + Date.now();

    globalStorage().set('catch_user', newUser);
    globalStorage().set('catch_token', token);

    set((state) => {
      state.user = newUser;
      state.sessionToken = token;
      state.authStatus = 'authenticated';
    });
  },

  verifySession: async () => {
    return Boolean(get().sessionToken);
  },

  registerNewUser: (userData: RegisteredAccount) => {
    const newUser: RegisteredAccount = { ...userData, status: userData.status || 'active' };
    const currentUsers = get().registeredUsers;
    const updated = [
      newUser,
      ...currentUsers.filter(
        (u) => u.email?.toLowerCase() !== newUser.email?.toLowerCase() && u.phone !== newUser.phone
      ),
    ];

    globalStorage().set('catch_registered_users', updated);

    set((state) => {
      state.registeredUsers = updated;
    });

    if (newUser.status === 'active') {
      get().loginDirectly(newUser.email, newUser.phone, newUser.countryCode, newUser.firstName);
    }
  },
});
