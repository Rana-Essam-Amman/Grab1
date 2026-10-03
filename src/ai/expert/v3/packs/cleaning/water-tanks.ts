import { makePack } from '../factory';

export const water_tanksPack = makePack({
  id: 'cleaning-water-tanks',
  noun: 'تنظيف خزان',
  detect: /خزان ماء/,
  allowArea: false,
});
