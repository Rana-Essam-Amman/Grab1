import { makePack } from '../factory';

export const campingPack = makePack({
  id: 'sports-camping',
  noun: 'تخييم',
  detect: /خيمة|تخييم/,
  allowArea: false,
});
