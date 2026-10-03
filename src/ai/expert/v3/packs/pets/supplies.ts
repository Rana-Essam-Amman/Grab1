import { makePack } from '../factory';

export const suppliesPack = makePack({
  id: 'pets-supplies',
  noun: 'مستلزم',
  detect: /أكل كلاب|ليتر/,
  allowArea: false,
});
