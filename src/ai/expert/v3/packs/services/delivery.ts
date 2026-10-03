import { makePack } from '../factory';

export const deliveryPack = makePack({
  id: 'services-delivery',
  noun: 'توصيل',
  detect: /توصيل/,
  allowArea: false,
});
