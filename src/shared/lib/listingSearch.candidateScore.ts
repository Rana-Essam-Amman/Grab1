import { phoneticKey } from './phoneticKey';

export interface CandidateScoreFields {
  title: string;
  desc: string;
  catSlug: string;
  subSlug: string;
  other: string;
  sellerName: string;
  titlePhon: string;
  descPhon: string;
  otherPhon: string;
  titleStem: string;
  descStem: string;
  otherStem: string;
}

export const scoreCandidate = (t: string, fields: CandidateScoreFields): number => {
  let score = 0;
  const tStem = t; // Default stem fallback

  if (fields.title.includes(t)) score += 10;
  else if (tStem.length >= 2 && fields.titleStem.includes(tStem)) score += 8;

  if (fields.catSlug.includes(t) || fields.subSlug.includes(t)) score += 8;

  // Seller names use direct text matching only, not phonetic matching.
  if (fields.sellerName.includes(t)) score += 3;

  if (fields.desc.includes(t) || (tStem.length >= 2 && fields.descStem.includes(tStem))) {
    score += 6;
  }

  if (fields.other.includes(t) || (tStem.length >= 2 && fields.otherStem.includes(tStem))) {
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
