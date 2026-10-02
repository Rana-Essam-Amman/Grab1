import { makePack } from '../factory';

export const womenPack = makePack({
  id: 'fashion-women',
  noun: 'قطعة نسائية',
  detect: /فستان|عباية/,
  allowArea: false,
});
