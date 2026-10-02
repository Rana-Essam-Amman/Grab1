import { goodsPack } from '../goods';
import type { Facts } from '../../types';

const base = goodsPack({
  id: 'phonesPack',
  noun: 'جوال',
  detect: /ايفون|آيفون|جوال|هاتف|سامسونج/,
  brands: ['آيفون', 'ايفون', 'سامسونج', 'Samsung'],
});

export const phonesPack = {
  ...base,
  title: (facts: Facts) => {
    const place = facts.place ? ` في ${facts.place}` : '';
    const storage = facts.storage ? ` ${facts.storage} جيجا` : '';
    const brand = facts.subject && facts.subject !== 'جوال' ? facts.subject : '';
    return `جوال ${brand} للبيع${place}${storage ? ` —${storage}` : ''}`.replace(/\s+/g, ' ').trim();
  },
};
