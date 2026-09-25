import { locations, locationsAr } from '../data';
import { calculateGeoSimilarity } from './similarity';
import { ReconciledLocation } from '../types';

export function reconcileLocation(
  countryCode: string,
  inputCity?: string,
  inputNeighborhood?: string
): ReconciledLocation {
  const countryDataEn = locations[countryCode];
  const countryDataAr = locationsAr[countryCode];

  if ((!countryDataEn && !countryDataAr) || !inputCity) {
    return { confidence: 0 };
  }

  let bestCity: string | undefined;
  let bestNeighborhood: string | undefined;
  let maxConfidence = 0;

  const allData = [
    ...(countryDataEn ? Object.entries(countryDataEn) : []),
    ...(countryDataAr ? Object.entries(countryDataAr) : []),
  ];

  for (const [city, neighborhoods] of allData) {
    const citySim = calculateGeoSimilarity(inputCity, city);
    
    // Check city only first
    if (citySim > maxConfidence) {
      maxConfidence = citySim;
      bestCity = city;
      bestNeighborhood = undefined;
    }

    if (inputNeighborhood) {
      for (const neigh of neighborhoods) {
        const neighSim = calculateGeoSimilarity(inputNeighborhood, neigh);
        // Weighted combined score - prioritizing city slightly but requiring neighborhood presence
        const combinedSim = (citySim * 0.6) + (neighSim * 0.4);
        
        if (combinedSim >= maxConfidence && combinedSim > 0.5) {
          maxConfidence = combinedSim;
          bestCity = city;
          bestNeighborhood = neigh;
        }
      }
    }
  }

  return {
    city: maxConfidence > 0.7 ? bestCity : undefined,
    neighborhood: maxConfidence > 0.7 ? bestNeighborhood : undefined,
    confidence: maxConfidence,
  };
}
