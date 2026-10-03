import { makePack } from '../factory';

export const sofas_carpetsPack = makePack({
  id: 'cleaning-sofas-carpets',
  noun: 'تنظيف قماش',
  detect: /تنظيف كنب|سجاد/,
  allowArea: false,
});
