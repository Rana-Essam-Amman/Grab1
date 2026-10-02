import { makePack } from '../factory';

export const mobileAccPack = makePack({
  id: 'mobileAccPack',
  noun: 'إكسسوار',
  detect: /كفر|شاحن|سماعة/,
  allowArea: false,
});
