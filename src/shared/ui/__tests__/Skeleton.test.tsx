import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Skeleton, SkeletonText } from '../Skeleton';
import { renderWithProviders } from '@/test/helpers';

describe('Skeleton Primitive Component', () => {
  it('renders skeleton element with pulse animation', () => {
    const { container } = renderWithProviders(<Skeleton data-testid="test-skeleton" />);
    const skeleton = screen.getByTestId('test-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders custom dimensions via width and height props', () => {
    renderWithProviders(
      <Skeleton data-testid="custom-dim-skeleton" width="200px" height="50px" />
    );
    const skeleton = screen.getByTestId('custom-dim-skeleton');
    expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
  });

  it('renders text, circle, and rect variants', () => {
    const { rerender } = renderWithProviders(<Skeleton data-testid="sk" variant="circle" />);
    expect(screen.getByTestId('sk')).toHaveClass('rounded-full');

    rerender(<Skeleton data-testid="sk" variant="rect" />);
    expect(screen.getByTestId('sk')).toHaveClass('rounded-lg');

    rerender(<Skeleton data-testid="sk" variant="text" />);
    expect(screen.getByTestId('sk')).toHaveClass('rounded-md');
  });

  it('SkeletonText renders specified number of lines and gaps', () => {
    const { container, rerender } = renderWithProviders(
      <SkeletonText lines={4} gap="lg" data-testid="sk-text" />
    );
    const containerEl = screen.getByTestId('sk-text');
    expect(containerEl).toHaveClass('space-y-3');
    expect(containerEl.children.length).toBe(4);

    rerender(<SkeletonText lines={2} gap="sm" data-testid="sk-text" />);
    expect(containerEl).toHaveClass('space-y-1.5');
    expect(containerEl.children.length).toBe(2);
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(<SkeletonText lines={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
