import React from 'react';
import { Icon } from '@iconify/react';
import { AiReviewLocation } from './AiReviewLocation';

interface AiReviewLocationSectionProps {
  readonly isArabic: boolean;
  readonly city: string;
  readonly neighborhood: string;
  readonly mapQuery: string;
  readonly onOpenCityPicker: () => void;
  readonly onOpenNeighborhoodPicker: () => void;
}

export const AiReviewLocationSection: React.FC<AiReviewLocationSectionProps> = (props) => (
  <AiReviewLocation {...props} />
);
