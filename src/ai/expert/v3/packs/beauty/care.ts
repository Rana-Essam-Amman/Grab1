import { makePack } from '../factory';

export const carePack = makePack({
  id: 'beauty-care',
  noun: 'جهاز عناية',
  detect: /جهاز عناية|مكواة شعر/,
  allowArea: false,
});
