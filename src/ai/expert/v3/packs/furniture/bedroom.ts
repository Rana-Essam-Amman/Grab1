import { makePack } from '../factory';

export const bedroomPack = makePack({
  id: 'furniture-bedroom',
  noun: 'غرفة نوم',
  detect: /غرفة نوم|سرير/,
  allowArea: false,
});
