import { makePack } from '../factory';

export const partsPack = makePack({
  id: 'computers-parts',
  noun: 'قطعة',
  detect: /رام|معالج/,
  allowArea: false,
});
