import { makePack } from '../factory';

export const perfumesPack = makePack({
  id: 'fashion-perfumes',
  noun: 'عطر',
  detect: /عطر|برفان/,
  allowArea: false,
});
