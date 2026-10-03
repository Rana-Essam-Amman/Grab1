import { makePack } from '../factory';

export const fitnessPack = makePack({
  id: 'sports-fitness',
  noun: 'جهاز رياضي',
  detect: /جهاز رياضي|دمبل/,
  allowArea: false,
});
