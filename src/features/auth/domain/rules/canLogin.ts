export interface LoginInput {
  phone: string;
  password: string;
}

export type CanLoginReason = 'empty-phone' | 'empty-password';

export interface CanLoginResult {
  allowed: boolean;
  reason?: CanLoginReason;
}

export function canLogin(input: LoginInput): CanLoginResult {
  if (input.phone.trim().length === 0) {
    return { allowed: false, reason: 'empty-phone' };
  }
  if (input.password.length === 0) {
    return { allowed: false, reason: 'empty-password' };
  }
  return { allowed: true };
}
