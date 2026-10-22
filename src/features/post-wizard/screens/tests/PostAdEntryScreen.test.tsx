import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostAdEntryScreen } from '../PostAdEntryScreen';

const mockNavigateTo = vi.fn();
const mockSetActiveTab = vi.fn();
const mockGoBack = vi.fn();
const mockStartPostFlow = vi.fn();

let mockUserCountryCode = 'JO';
let mockBrowseCountryCode = 'JO';
let mockIsArabic = true;

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: mockIsArabic,
    navigateTo: mockNavigateTo,
    setActiveTab: mockSetActiveTab,
    goBack: mockGoBack,
    browseCountryCode: mockBrowseCountryCode,
    setBrowseMarketOverrideLocal: vi.fn(),
  }),
}));

vi.mock('../../hooks/usePostAdEntry', () => ({
  usePostAdEntry: () => ({
    isArabic: mockIsArabic,
    handleBack: mockGoBack,
    startPostFlow: mockStartPostFlow,
    canPostInMarket: mockUserCountryCode === mockBrowseCountryCode,
    myMarket: mockUserCountryCode,
    freeLimit: 20,
    freeRemaining: 10,
    updateUserMarket: vi.fn(),
  }),
}));

describe('PostAdEntryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'JO';
    mockIsArabic = true;
  });

  it('renders a single "Post New Ad" button when markets match', () => {
    render(<PostAdEntryScreen />);
    const button = document.getElementById('post-ad-entry-start');
    expect(button).toBeInTheDocument();
  });

  it('does not render AI or Traditional option cards anymore', () => {
    render(<PostAdEntryScreen />);
    expect(screen.queryByText(/AI/i)).toBeNull();
    expect(screen.queryByText(/Traditional/i)).toBeNull();
  });

  it('clicking the button calls startPostFlow and navigates to post-category', () => {
    render(<PostAdEntryScreen />);
    const button = document.getElementById('post-ad-entry-start');
    expect(button).not.toBeNull();
    fireEvent.click(button!);
    expect(mockStartPostFlow).toHaveBeenCalledTimes(1);
  });

  it('back button calls setActiveTab explore and goBack', () => {
    render(<PostAdEntryScreen />);
    const backBtn = document.getElementById('post-ad-entry-back-btn');
    expect(backBtn).not.toBeNull();
    fireEvent.click(backBtn!);
    expect(mockSetActiveTab).toHaveBeenCalledWith('explore');
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('blocks posting when browse market differs from user market', () => {
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'LB';
    mockIsArabic = true;

    render(<PostAdEntryScreen />);

    expect(document.getElementById('post-ad-entry-start')).toBeNull();
    expect(document.getElementById('post-ad-entry-blocked-title')).toBeInTheDocument();
    expect(screen.getByText('الأردن')).toBeInTheDocument();
    expect(screen.getByText('السعودية')).toBeInTheDocument();
    expect(screen.getByText('لبنان')).toBeInTheDocument();
    expect(screen.getByText('فلسطين')).toBeInTheDocument();
    expect(screen.getByText('سوريا')).toBeInTheDocument();
  });
});
