import { makePack } from '../factory';

export const bbqPack = makePack({
  id: 'home-garden-bbq',
  noun: 'شواية',
  detect: /شواية/,
  allowArea: false,
});
