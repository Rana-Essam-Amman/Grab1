import { makePack } from '../factory';

export const tvPack = makePack({
  id: 'electronics-tv',
  noun: 'تلفزيون',
  detect: /تلفزيون|شاشة تلفاز/,
  allowArea: false,
});
