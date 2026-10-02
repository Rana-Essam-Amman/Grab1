import { makePack } from '../factory';

export const decorPack = makePack({
  id: 'furniture-decor',
  noun: 'ديكور',
  detect: /ديكور|تحفة/,
  allowArea: false,
});
