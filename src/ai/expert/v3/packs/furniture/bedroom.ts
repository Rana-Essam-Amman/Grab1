import { goodsPack } from '../goods';

export const bedroomPack = goodsPack({
  id: 'bedroomPack',
  noun: 'غرفة نوم',
  detect: /سرير|غرفة نوم/,
  brands: [],
});
