import { makePack } from '../factory';

export const antiquesPack = makePack({
  id: 'books-antiques',
  noun: 'تحفة',
  detect: /تحفة|مقتنى/,
  allowArea: false,
});
