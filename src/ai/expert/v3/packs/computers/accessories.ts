import { makePack } from '../factory';

export const accessoriesPack = makePack({
  id: 'computers-accessories',
  noun: 'إكسسوار',
  detect: /ماوس|كيبورد/,
  allowArea: false,
});
