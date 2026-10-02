import { goodsPack } from '../goods';

export const tabletsPack = goodsPack({
  id: 'tabletsPack',
  noun: 'تابلت',
  detect: /تابلت|ايباد|آيباد/,
  brands: ['آيباد','ايباد','سامسونج'],
});
