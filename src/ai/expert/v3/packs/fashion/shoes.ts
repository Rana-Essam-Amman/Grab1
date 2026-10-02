import { makePack } from '../factory';

export const shoesPack = makePack({
  id: 'fashion-shoes',
  noun: 'حذاء',
  detect: /حذاء|جزمة/,
  allowArea: false,
});
