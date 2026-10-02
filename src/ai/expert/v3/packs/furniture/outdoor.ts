import { makePack } from '../factory';

export const outdoorPack = makePack({
  id: 'furniture-outdoor',
  noun: 'أثاث خارجي',
  detect: /أثاث حديقة|جلسات خارجية/,
  allowArea: false,
});
