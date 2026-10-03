import { makePack } from '../factory';

export const blacksmithPack = makePack({
  id: 'handymen-blacksmith',
  noun: 'حداد',
  detect: /حداد/,
  allowArea: false,
});
