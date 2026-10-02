import { makePack } from '../factory';

export const bagsPack = makePack({
  id: 'fashion-bags',
  noun: 'حقيبة',
  detect: /حقيبة|شنطة/,
  allowArea: false,
});
