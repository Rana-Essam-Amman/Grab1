import { useMonetizationStore } from '@/features/listings/store/monetization.slice';

export const useMonetization = () => {
  const store = useMonetizationStore();
  return {
    isQuotaExhausted: store.isQuotaExhausted,
    setIsQuotaExhausted: store.setIsQuotaExhausted,
    validateAdQuotaAvailability: store.validateAdQuotaAvailability,
  };
};
