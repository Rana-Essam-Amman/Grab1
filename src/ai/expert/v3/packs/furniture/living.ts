import { makePack } from '../factory';

export const livingPack = makePack({
  id: 'furniture-living',
  noun: 'كنبة',
  detect: /كنبة|كنبه|جلسة/,
  allowArea: false,
});
