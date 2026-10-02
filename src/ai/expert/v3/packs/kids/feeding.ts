import { makePack } from '../factory';

export const feedingPack = makePack({
  id: 'kids-feeding',
  noun: 'رضاعة',
  detect: /رضاعة|حليب/,
  allowArea: false,
});
