import { makePack } from '../factory';

export const housesPack = makePack({
  id: 'houses',
  noun: 'فيلا',
  detect: /فيلا|بيت/,
  allowRooms: true,
  allowBaths: true,
  allowArea: true,
  flags: { حديقة: /حديقة/, موقف: /موقف|كراج/ },
});
