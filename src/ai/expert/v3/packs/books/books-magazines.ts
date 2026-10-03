import { makePack } from '../factory';

export const books_magazinesPack = makePack({
  id: 'books-books-magazines',
  noun: 'كتاب',
  detect: /كتاب|مجلة/,
  allowArea: false,
});
