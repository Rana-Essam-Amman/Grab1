import { makePack } from '../factory';

export const tabletsPack = makePack({
  id: 'tabletsPack',
  noun: 'تابلت',
  detect: /تابلت|ايباد|آيباد/,
  allowArea: false,
});
