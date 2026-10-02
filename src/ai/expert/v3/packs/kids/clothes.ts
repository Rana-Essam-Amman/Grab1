import { makePack } from '../factory';

export const clothesPack = makePack({
  id: 'kids-clothes',
  noun: 'ملابس أطفال',
  detect: /ملابس أطفال/,
  allowArea: false,
});
