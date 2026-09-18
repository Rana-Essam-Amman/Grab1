import { z } from 'zod';
import type { UserProfile as TypeScriptUserProfile, RegisteredAccount as TypeScriptRegisteredAccount } from '../types';

export const UserProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  countryCode: z.string(),
  avatarUrl: z.string().optional(),
  isVipShop: z.boolean().optional(),
});

export const RegisteredAccountSchema = z.object({
  email: z.string(),
  phone: z.string(),
  countryCode: z.string(),
  password: z.string().optional(),
  firstName: z.string(),
  lastName: z.string().optional(),
  status: z.enum(['Pending', 'Active']).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type RegisteredAccount = z.infer<typeof RegisteredAccountSchema>;

// Static type assertions ensuring structural compatibility with src/types.ts
type AssertProfileCompatible<T extends TypeScriptUserProfile> = true;
type _TestProfile = AssertProfileCompatible<UserProfile>;

type AssertAccountCompatible<T extends TypeScriptRegisteredAccount> = true;
type _TestAccount = AssertAccountCompatible<RegisteredAccount>;
