export function calculateGeoSimilarity(s1: string, s2: string): number {
  const normalize = (s: string) => {
    let v = s.toLowerCase().trim()
      .replace(/[\u064B-\u0652]/g, '') // Strip diacritics
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه');
    
    // Strip 'ال' prefix if it exists and result is long enough
    if (v.startsWith('ال') && v.length > 3) {
      v = v.substring(2);
    }
    return v;
  };

  const v1 = normalize(s1);
  const v2 = normalize(s2);

  if (v1 === v2) return 1.0;

  // Use Dice Coefficient for better fuzzy matching than positional matching
  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const b1 = getBigrams(v1);
  const b2 = getBigrams(v2);
  
  if (b1.size === 0 || b2.size === 0) {
    return v1 === v2 ? 1.0 : 0;
  }

  let intersection = 0;
  for (const b of b1) {
    if (b2.has(b)) intersection++;
  }

  return (2 * intersection) / (b1.size + b2.size);
}
