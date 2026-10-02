import { makePack } from '../factory';

export const fishPack = makePack({
  id: 'pets-fish',
  noun: 'سمك',
  detect: /سمك|حوض/,
  allowArea: false,
});
