import { goodsPack } from '../goods';

export const phonesPack = goodsPack({
  id: 'phonesPack',
  noun: 'جوال',
  detect: /ايفون|آيفون|جوال|هاتف|سامسونج/,
  brands: ['آيفون','ايفون','سامسونج','Samsung'],
});
