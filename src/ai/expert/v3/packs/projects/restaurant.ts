import { makePack } from '../factory';

export const restaurantPack = makePack({
  id: 'projects-restaurant',
  noun: 'مطعم',
  detect: /مطعم للبيع/,
  allowArea: false,
});
