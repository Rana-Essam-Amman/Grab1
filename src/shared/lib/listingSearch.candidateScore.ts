
import { phoneticKey } from './phoneticKey';
import { stemArabic } from './arabicStemmer';

export type SearchFields = {
  title: string;
  desc: string;
  catSlug: string;
  subSlug: string;
  other: string;
  titlePhon: string;
  descPhon: string;
  otherPhon: string;
  titleStem: string;
  descStem: string;
  otherStem: string;
};

export const scoreCandidate = (
  candidate: string,
  fields: SearchFields,
): number => {
  const t = candidate;
  const tStem = stemArabic(t);

  let score = 0;

  if (
    fields.title.includes(t) ||
    (tStem.length >= 2 && fields.titleStem.includes(tStem))
  ) {
    score += 10;
  }

  if (fields.catSlug.includes(t) || fields.subSlug.includes(t)) {
    score += 8;
  }

  if (
    fields.desc.includes(t) ||
    (tStem.length >= 2 && fields.descStem.includes(tStem))
  ) {
    score += 5;
  }

  if (
    fields.other.includes(t) ||
    (tStem.length >= 2 && fields.otherStem.includes(tStem))
  ) {
    score += 3;
  }

  // Use phonetic matching only when direct matching found nothing.
  if (score === 0) {
    const key = phoneticKey(t);

    if (key.length >= 2) {
      if (fields.titlePhon.includes(key)) {
        score = 6;
      } else if (fields.descPhon.includes(key)) {
        score = 4;
      } else if (fields.otherPhon.includes(key)) {
        score = 2;
      }
    }
  }

  return score;
};
