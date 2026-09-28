import { useMonetizationStore } from '@/features/monetization/store/monetization.slice';

export const useMonetization = () => {
  const store = useMonetizationStore();
  return {
    isQuotaExhausted: store.isQuotaExhausted,
    setIsQuotaExhausted: store.setIsQuotaExhausted,
    validateAdQuotaAvailability: store.validateAdQuotaAvailability,
  };
};
