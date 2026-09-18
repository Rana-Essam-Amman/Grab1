import { usePostWizard } from './usePostWizard';
import { validateLocations } from '@/data/locations';
import { useUIStore } from '@/store/ui.slice';

export interface UsePostWizardFormReturn {
  validateStep: (step: string) => { valid: boolean; error?: string };
  validatePublish: () => { valid: boolean; error?: string };
  isPriceMissing: boolean;
  isCityMissing: boolean;
  hasMissingParams: boolean;
}

export function usePostWizardForm(): UsePostWizardFormReturn {
  const { postDraft } = usePostWizard();
  const { browseCountryCode } = useUIStore();

  const validateStep = (step: string) => ({ valid: true });
  const validatePublish = () => ({ valid: true });
  
  const isPriceMissing = !postDraft.price;
  const isCityMissing = !postDraft.city;
  const hasMissingParams = isPriceMissing || isCityMissing;

  return { validateStep, validatePublish, isPriceMissing, isCityMissing, hasMissingParams };
}
