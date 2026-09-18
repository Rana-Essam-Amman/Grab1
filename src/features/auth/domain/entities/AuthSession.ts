import type { User } from './User';

export interface AuthSession {
  readonly token: string;
  readonly user: User;
  readonly createdAt: string;
}
