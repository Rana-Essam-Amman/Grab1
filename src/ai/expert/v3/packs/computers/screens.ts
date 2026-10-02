import { makePack } from '../factory';

export const screensPack = makePack({
  id: 'computers-screens',
  noun: 'شاشة',
  detect: /شاشة/,
  allowArea: false,
});
