import { makePack } from '../factory';

export const strollersPack = makePack({
  id: 'kids-strollers',
  noun: 'عربة',
  detect: /عربة|كرسي سيارة/,
  allowArea: false,
});
