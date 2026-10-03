import { makePack } from '../factory';

export const cosmeticsPack = makePack({
  id: 'beauty-cosmetics',
  noun: 'مكياج',
  detect: /مكياج|روج/,
  allowArea: false,
});
