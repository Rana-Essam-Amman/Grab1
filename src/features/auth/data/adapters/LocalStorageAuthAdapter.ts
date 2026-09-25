import { globalStorage } from '@/shared/lib/marketStorage';
import type { AuthRepository, LoginCredentials, RegisterPayload } from '../repositories/AuthRepository';
import type { AuthSession, User } from '../../domain';
import { readValidated, writeValidated, removeStored } from '@/shared/lib/safeStorage';
import { z } from 'zod';

const SESSION_KEY = 'auth_session_v1';
const USERS_KEY = 'auth_users_v1';

const USER_SCHEMA = z.object({
  id: z.string(),
  phone: z.string(),
  countryCode: z.enum(['JO', 'SA', 'PS', 'LB', 'SY']),
  name: z.string(),
  avatarUrl: z.string().optional(),
  isVerified: z.boolean(),
});

const STORED_USER_SCHEMA = USER_SCHEMA.extend({
  password: z.string(),
});

const SESSION_SCHEMA = z.object({
  token: z.string(),
  user: USER_SCHEMA,
  createdAt: z.string(),
});

interface StoredUser extends User {
  password: string;
}

/**
 * LocalStorage implementation of AuthRepository.
 * Simple in-memory user store with password hashing disabled (demo only).
 * Swappable with FirebaseAuthAdapter in the future.
 */
export class LocalStorageAuthAdapter implements AuthRepository {
  async getCurrentSession(): Promise<AuthSession | null> {
    return this._readSession();
  }

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const users = this._readUsers();
    const exists = users.find((u) => u.phone === payload.phone);
    if (exists) {
      throw new Error('user-already-exists');
    }

    const user: StoredUser = {
      id: `u_${Date.now()}`,
      phone: payload.phone,
      countryCode: payload.countryCode as User['countryCode'],
      name: payload.name,
      isVerified: false,
      password: payload.password,
    };

    users.push(user);
    this._writeUsers(users);

    const { password, ...sessionUser } = user;
    const session: AuthSession = {
      token: `t_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: sessionUser,
      createdAt: new Date().toISOString(),
    };

    this._writeSession(session);
    return session;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const users = this._readUsers();
    const match = users.find(
      (u) => u.phone === credentials.phone && u.password === credentials.password,
    );

    if (!match) {
      throw new Error('invalid-credentials');
    }

    const { password, ...sessionUser } = match;
    const session: AuthSession = {
      token: `t_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: sessionUser,
      createdAt: new Date().toISOString(),
    };

    this._writeSession(session);
    return session;
  }

  async logout(): Promise<void> {
    removeStored(SESSION_KEY);
  }

  async updateProfile(
    updates: Partial<Pick<User, 'name' | 'avatarUrl'>>,
  ): Promise<User> {
    const session = await this.getCurrentSession();
    if (!session) throw new Error('no-session');

    const users = this._readUsers();
    const idx = users.findIndex((u) => u.id === session.user.id);
    if (idx === -1) throw new Error('user-not-found');

    users[idx] = { ...users[idx], ...updates };
    this._writeUsers(users);

    const { password, ...updatedUser } = users[idx];
    const newSession: AuthSession = { ...session, user: updatedUser };
    this._writeSession(newSession);

    return updatedUser;
  }

  private _readSession(): AuthSession | null {
    return readValidated(SESSION_KEY, SESSION_SCHEMA, null);
  }

  private _writeSession(session: AuthSession): void {
    writeValidated(SESSION_KEY, SESSION_SCHEMA, session);
  }

  private _readUsers(): StoredUser[] {
    return readValidated(USERS_KEY, z.array(STORED_USER_SCHEMA), []);
  }

  private _writeUsers(users: StoredUser[]): void {
    writeValidated(USERS_KEY, z.array(STORED_USER_SCHEMA), users);
  }
}
