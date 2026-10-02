import { makePack } from '../factory';

export const phonesPack = makePack({
  id: 'phonesPack',
  noun: 'جوال',
  detect: /ايفون|آيفون|جوال|هاتف/,
  allowArea: false,
});
