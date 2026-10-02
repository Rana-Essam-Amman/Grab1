import { makePack } from '../factory';

export const gamingPack = makePack({
  id: 'electronics-gaming',
  noun: 'جهاز ألعاب',
  detect: /بلايستيشن|قيمنق/,
  allowArea: false,
});
