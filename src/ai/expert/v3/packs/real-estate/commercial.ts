import { makePack } from '../factory';

export const commercialPack = makePack({
  id: 'commercial',
  noun: 'محل',
  detect: /محل|مكتب|معرض/,
  allowArea: true,
  flags: { واجهة: /واجهة/ },
});
