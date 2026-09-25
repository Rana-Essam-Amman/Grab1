import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AiPostSuggestion } from '../AiPostSuggestion';

const baseState = {
  confidence: 0.9,
  signals: ['explicit_sell', 'price'] as const,
  rawText: 'كامري 2020 بحالة ممتازة بدي أبيعها 12 ألف',
};

describe('AiPostSuggestion', () => {
  it('renders title + preview + buttons (Arabic)', () => {
    render(
      <AiPostSuggestion
        state={baseState}
        onAccept={() => {}}
        onDismiss={() => {}}
        isArabic={true}
      />
    );
    expect(screen.getByText('يبدو أنك تصف إعلان للبيع')).toBeInTheDocument();
    expect(screen.getByText('انشر الإعلان')).toBeInTheDocument();
    expect(screen.getByText('ابحث فقط')).toBeInTheDocument();
  });

  it('renders title in English when isArabic false', () => {
    render(
      <AiPostSuggestion
        state={baseState}
        onAccept={() => {}}
        onDismiss={() => {}}
        isArabic={false}
      />
    );
    expect(screen.getByText('It looks like a listing')).toBeInTheDocument();
  });

  it('truncates preview at 60 chars + appends ellipsis', () => {
    const longText = 'أ'.repeat(80);
    render(
      <AiPostSuggestion
        state={{ ...baseState, rawText: longText }}
        onAccept={() => {}}
        onDismiss={() => {}}
        isArabic={true}
      />
    );
    const expectedText = 'أ'.repeat(60) + '…';
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('renders only known signal chips', () => {
    render(
      <AiPostSuggestion
        state={{ ...baseState, signals: ['explicit_sell', 'unknown_key', 'price'] }}
        onAccept={() => {}}
        onDismiss={() => {}}
        isArabic={true}
      />
    );
    expect(screen.getByText('نية بيع')).toBeInTheDocument();
    expect(screen.getByText('سعر محدد')).toBeInTheDocument();
    expect(screen.queryByText('unknown_key')).not.toBeInTheDocument();
  });

  it('hides chips row when signals array empty', () => {
    render(
      <AiPostSuggestion
        state={{ ...baseState, signals: [] }}
        onAccept={() => {}}
        onDismiss={() => {}}
        isArabic={true}
      />
    );
    expect(screen.queryByText('نية بيع')).not.toBeInTheDocument();
    expect(screen.queryByText('سعر محدد')).not.toBeInTheDocument();
    expect(screen.getByText('انشر الإعلان')).toBeInTheDocument();
    expect(screen.getByText('ابحث فقط')).toBeInTheDocument();
  });

  it('fires callbacks on button click', () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();
    render(
      <AiPostSuggestion
        state={baseState}
        onAccept={onAccept}
        onDismiss={onDismiss}
        isArabic={true}
      />
    );
    fireEvent.click(screen.getByText('انشر الإعلان'));
    expect(onAccept).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('ابحث فقط'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
