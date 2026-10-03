import React from 'react';

interface Props {
  readonly city: string;
  readonly neighborhood: string;
  readonly isArabic: boolean;
}

export const StaticMapPreview: React.FC<Props> = ({ city, neighborhood }) => {
  const query = [neighborhood, city].filter(Boolean).join(', ');
  if (!query) return null;
  const googleSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className="rounded-2xl overflow-hidden border border-line h-40">
      <iframe
        title="location-map"
        src={googleSrc}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};
