import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PostAdEntryScreen } from '../PostAdEntryScreen';

const mockGoBack = vi.fn();
const mockNavigateTo = vi.fn();
const mockSetActiveTab = vi.fn();
const mockStartPostFlow = vi.fn();

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: mockGoBack,
    navigateTo: mockNavigateTo,
    setActiveTab: mockSetActiveTab,
  }),
}));

vi.mock('@hookrouter', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    startPostFlow: mockStartPostFlow,
  }),
}));

describe('PostAdEntryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both option buttons (AI + Traditional)', () => {
    render(<PostAdEntryScreen />);
    expect(screen.getByTestId('post-entry-ai-card')).toBeInTheDocument();
    expect(screen.getByTestId('post-entry-traditional-card')).toBeInTheDocument();
  });

  it('clicking AI card calls startPostFlow and navigates to post-ai-capture', () => {
    render(<PostAdEntryScreen />);
    fireEvent.click(screen.getByTestId('post-entry-ai-card'));
    expect(mockStartPostFlow).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith('post-ai-capture');
  });

  it('clicking Traditional card calls startPostFlow and navigates to post-category', () => {
    render(<PostAdEntryScreen />);
    fireEvent.click(screen.getByTestId('post-entry-traditional-card'));
    expect(mockStartPostFlow).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith('post-category');
  });

  it('back button calls setActiveTab explore and goBack', () => {
    render(<PostAdEntryScreen />);
    const backBtn = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backBtn);
    expect(mockSetActiveTab).toHaveBeenCalledWith('explore');
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
