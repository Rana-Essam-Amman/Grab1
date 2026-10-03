import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PostAdEntryScreen } from '../PostAdEntryScreen';

const mockGoBack = vi.fn();
const mockNavigateTo = vi.fn();
const mockSetActiveTab = vi.fn();
const mockStartPostFlow = vi.fn();
const mockSetAiFlowPending = vi.fn();

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: mockGoBack,
    navigateTo: mockNavigateTo,
    setActiveTab: mockSetActiveTab,
    setAiFlowPending: mockSetAiFlowPending,
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

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    authStatus: 'authenticated',
    isAnonymous: false,
  }),
}));

describe('PostAdEntryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a single "Post New Ad" button', () => {
    render(<PostAdEntryScreen />);
    const button = document.getElementById('post-ad-entry-start');
    expect(button).toBeInTheDocument();
  });

  it('does not render AI or Traditional option cards anymore', () => {
    render(<PostAdEntryScreen />);
    expect(screen.queryByTestId('post-entry-ai-card')).toBeNull();
    expect(screen.queryByTestId('post-entry-traditional-card')).toBeNull();
  });

  it('clicking the button calls startPostFlow and navigates to post-category', () => {
    render(<PostAdEntryScreen />);
    const button = document.getElementById('post-ad-entry-start');
    expect(button).not.toBeNull();
    fireEvent.click(button!);
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
