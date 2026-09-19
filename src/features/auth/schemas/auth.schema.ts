import { z } from 'zod';

export const StoredUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isRevoked: z.boolean().optional(),
}).passthrough();

export const UserProfileSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().optional(),
}).passthrough();

export const RegisteredAccountSchema = z.object({
  email: z.string(),
  phone: z.string(),
  countryCode: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  status: z.string(),
}).passthrough();

export const RegisteredAccountsArraySchema = z.array(RegisteredAccountSchema);
