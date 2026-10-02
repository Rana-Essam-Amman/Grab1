import { makePack } from '../factory';

export const luxuryPack = makePack({
  id: 'watches-luxury',
  noun: 'ساعة فاخرة',
  detect: /رولكس|ساعة فاخرة/,
  allowArea: false,
});
