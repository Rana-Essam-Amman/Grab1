import type { AuthSession, User } from '../../domain';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  countryCode: string;
  password: string;
}

/**
 * Abstract repository contract for authentication.
 * Implementations (localStorage, Firebase) live in ../adapters/.
 */
export interface AuthRepository {
  getCurrentSession(): Promise<AuthSession | null>;
  register(payload: RegisterPayload): Promise<AuthSession>;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  updateProfile(updates: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User>;
}
