import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <h2 className="text-base font-semibold px-4 pt-3" data-testid="section-header">
    {title}
  </h2>
);
