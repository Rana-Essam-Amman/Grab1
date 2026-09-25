import React, { useState } from 'react';
import { Button, Card, Badge, Chip, Input, Textarea } from '@/shared/ui';
import { useTheme } from '@/features/ui/hooks/useTheme';

const COLOR_SWATCHES = [
  { name: 'Brand', cls: 'bg-brand text-ink-inverse' },
  { name: 'Accent', cls: 'bg-accent text-ink-inverse' },
  { name: 'Canvas', cls: 'bg-canvas text-ink border border-line' },
  { name: 'Surface', cls: 'bg-surface text-ink border border-line' },
  { name: 'Line', cls: 'bg-line text-ink' },
  { name: 'Success', cls: 'bg-success text-white' },
  { name: 'Warning', cls: 'bg-warning text-white' },
  { name: 'Danger', cls: 'bg-danger text-white' },
  { name: 'Info', cls: 'bg-info text-white' },
];

export function CatalogScreen() {
  const { theme, toggle } = useTheme();
  const [chipSelected, setChipSelected] = useState(false);

  return (
    <div id="catalog-screen" className="min-h-screen bg-canvas text-ink p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h1 id="catalog-title" className="text-2xl font-bold">Design System Catalog</h1>
          <p className="text-sm text-ink-soft">Visual reference of design tokens &amp; primitives</p>
        </div>
        <Button id="catalog-theme-toggle" variant="secondary" size="sm" onClick={toggle}>
          Theme: {theme}
        </Button>
      </div>

      {/* Colors */}
      <section id="catalog-colors" className="space-y-3">
        <h2 className="text-lg font-bold">Colors</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {COLOR_SWATCHES.map((s) => (
            <div key={s.name} className={`${s.cls} rounded-xl p-3 text-center text-xs font-semibold shadow-xs`}>
              {s.name}
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section id="catalog-typography" className="space-y-3">
        <h2 className="text-lg font-bold">Typography</h2>
        <Card padding="sm" className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs text-ink-muted">Arabic (IBM Plex Sans Arabic)</span>
            <p className="font-arabic text-xl font-bold">سوق الإعلانات المبوبة الرائد</p>
            <p className="font-arabic text-sm text-ink-soft">ابحث واشترِ وبع بكل سهولة وأمان</p>
          </div>
          <div className="space-y-1 border-t border-line pt-2">
            <span className="text-xs text-ink-muted">Latin (Geist)</span>
            <p className="font-latin text-xl font-bold">Classifieds Marketplace 2026</p>
            <p className="font-latin text-sm text-ink-soft">Fast, secure local deals across the region</p>
          </div>
        </Card>
      </section>

      {/* Buttons */}
      <section id="catalog-buttons" className="space-y-3">
        <h2 className="text-lg font-bold">Buttons</h2>
        <Card padding="sm" className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center border-t border-line pt-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>
      </section>

      {/* Badges & Chips */}
      <section id="catalog-badges-chips" className="space-y-3">
        <h2 className="text-lg font-bold">Badges &amp; Chips</h2>
        <Card padding="sm" className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center border-t border-line pt-2">
            <Chip selected={chipSelected} onClick={() => setChipSelected(!chipSelected)}>
              {chipSelected ? 'Selected Chip' : 'Clickable Chip'}
            </Chip>
            <Chip selected size="sm">Small Chip</Chip>
            <Chip disabled>Disabled</Chip>
          </div>
        </Card>
      </section>

      {/* Inputs */}
      <section id="catalog-inputs" className="space-y-3">
        <h2 className="text-lg font-bold">Inputs</h2>
        <Card padding="sm" className="space-y-3">
          <Input id="catalog-sample-input" label="Sample Input" placeholder="Type something..." hint="Helpful hint message" />
          <Textarea id="catalog-sample-textarea" label="Sample Textarea" placeholder="Enter multiline text..." />
        </Card>
      </section>
    </div>
  );
}

export default CatalogScreen;
