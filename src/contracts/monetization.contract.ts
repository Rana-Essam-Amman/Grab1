export interface MonetizationStoreContract {
  isQuotaExhausted: boolean;
  validateAdQuotaAvailability: (categorySlug: string) => boolean;
}
