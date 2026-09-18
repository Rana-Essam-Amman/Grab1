import { ListingSchema } from '../listing.schema';
import { seedListings } from '../../data/seedListings';

export function validateSeedData() {
  let hasErrors = false;

  seedListings.forEach((listing, index) => {
    const result = ListingSchema.safeParse(listing);
    if (!result.success) {
      hasErrors = true;
      console.error(`[Validation Error] Seed listing at index ${index} (ID: ${listing.id}) failed validation:`, result.error.format());
    }
  });

  return !hasErrors;
}

// Auto-run if executed in dev/test environment or standalone execution
validateSeedData();
