import { z } from 'zod';
import type { Listing as TypeScriptListing } from '../types';

export const ListingAttributeSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ListingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  price: z.string(),
  currency: z.enum(['JOD', 'USD', 'LBP', 'SYP', 'ILS', 'SAR']),
  countryCode: z.enum(['JO', 'LB', 'PS', 'SY', 'SA']),
  city: z.string(),
  neighborhood: z.string().optional().default(''),
  categorySlug: z.string(),
  subcategorySlug: z.string(),
  imageUrl: z.string(),
  images: z.array(z.string()),
  sellerPhone: z.string(),
  sellerName: z.string(),
  createdAt: z.string(),
  views: z.number().nonnegative(),
  attributes: z.array(ListingAttributeSchema),
  isPremium: z.boolean().optional(),
  lastBumpedAt: z.string().optional(),
  isAutoBumpActive: z.boolean().optional(),
  sourceLocale: z.enum(['ar', 'en']).optional(),
  titleEn: z.string().optional(),
  descriptionEn: z.string().optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

// Static type assertion ensuring structural compatibility with src/types.ts
type AssertCompatible<T extends TypeScriptListing> = true;
type _TestCompatibility = AssertCompatible<Listing>;
