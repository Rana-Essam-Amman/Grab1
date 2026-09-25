import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../Card';
import { renderWithProviders } from '@/test/helpers';

describe('Card Primitive Component', () => {
  it('renders children content correctly', () => {
    renderWithProviders(
      <Card>
        <p>Card Body</p>
      </Card>
    );
    expect(screen.getByText('Card Body')).toBeInTheDocument();
  });

  it('renders various variants (default, elevated, flat, outline, interactive)', () => {
    const { rerender } = renderWithProviders(<Card variant="default">Default</Card>);
    expect(screen.getByText('Default')).toHaveClass('shadow-md');

    rerender(<Card variant="elevated">Elevated</Card>);
    expect(screen.getByText('Elevated')).toHaveClass('shadow-md');

    rerender(<Card variant="flat">Flat</Card>);
    expect(screen.getByText('Flat')).toHaveClass('bg-surface');

    rerender(<Card variant="outline">Outline</Card>);
    expect(screen.getByText('Outline')).toHaveClass('bg-transparent');

    rerender(<Card variant="interactive">Interactive</Card>);
    expect(screen.getByText('Interactive')).toHaveClass('cursor-pointer');
  });

  it('supports padding presets (none, sm, md, lg)', () => {
    const { rerender } = renderWithProviders(<Card padding="none">Pad None</Card>);
    expect(screen.getByText('Pad None')).toHaveClass('p-0');

    rerender(<Card padding="sm">Pad SM</Card>);
    expect(screen.getByText('Pad SM')).toHaveClass('p-3');

    rerender(<Card padding="md">Pad MD</Card>);
    expect(screen.getByText('Pad MD')).toHaveClass('p-4');

    rerender(<Card padding="lg">Pad LG</Card>);
    expect(screen.getByText('Pad LG')).toHaveClass('p-6');
  });

  it('renders complete compound Card structure', () => {
    renderWithProviders(
      <Card>
        <CardHeader>
          <CardTitle>Card Main Title</CardTitle>
          <CardDescription>Card descriptive subtitle</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Inner content body</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Main Title')).toBeInTheDocument();
    expect(screen.getByText('Card descriptive subtitle')).toBeInTheDocument();
    expect(screen.getByText('Inner content body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Card</CardTitle>
          <CardDescription>Accessible description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Text</p>
        </CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
