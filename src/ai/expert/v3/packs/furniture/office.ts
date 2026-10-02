import { makePack } from '../factory';

export const officePack = makePack({
  id: 'furniture-office',
  noun: 'مكتب',
  detect: /مكتب خشب|كرسي مكتب/,
  allowArea: false,
});
