import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostAdEntryScreen } from '../PostAdEntryScreen';
import { toast } from 'sonner';

// Mock @iconify/react: it schedules async work that touches `window` inside
// React's scheduler callback (getCurrentEventPriority). That callback fires
// after Vitest tears down jsdom for this file, producing
// "ReferenceError: window is not defined" as an unhandled error and failing
// the Quality job even though all test assertions pass.
vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon" data-icon={icon} />,
}));

const mockNavigateTo = vi.fn();
const mockSetActiveTab = vi.fn();
const mockGoBack = vi.fn();
const mockStartPostFlow = vi.fn();

let mockUserCountryCode = 'JO';
let mockBrowseCountryCode = 'JO';
let mockIsArabic = true;

// Mock Sonner toast to test the error
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

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

// We need a dynamic mock for updateUserMarket to test both success and failure
const mockUpdateUserMarket = vi.fn();

vi.mock('../../hooks/usePostAdEntry', () => ({
  usePostAdEntry: () => ({
    isArabic: mockIsArabic,
    handleBack: () => {
      mockSetActiveTab('explore');
      mockGoBack();
    },
    startPostFlow: mockStartPostFlow,
    canPostInMarket: mockUserCountryCode === mockBrowseCountryCode,
    myMarket: mockUserCountryCode,
    freeLimit: 20,
    freeRemaining: 10,
    updateUserMarket: mockUpdateUserMarket,
  }),
}));

describe('PostAdEntryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'JO';
    mockIsArabic = true;
    mockUpdateUserMarket.mockResolvedValue(true);
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

  it('updates the market successfully when a market button is clicked', async () => {
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'LB';
    mockIsArabic = true;

    render(<PostAdEntryScreen />);

    const joBtn = screen.getByText('الأردن');
    fireEvent.click(joBtn);

    expect(mockUpdateUserMarket).toHaveBeenCalledWith('JO');
    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('shows an error toast if the market update fails', async () => {
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'LB';
    mockIsArabic = true;

    // Force the update to fail
    mockUpdateUserMarket.mockResolvedValueOnce(false);

    render(<PostAdEntryScreen />);

    const joBtn = screen.getByText('الأردن');
    fireEvent.click(joBtn);

    await waitFor(() => {
      expect(mockUpdateUserMarket).toHaveBeenCalledWith('JO');
      expect(toast.error).toHaveBeenCalledWith('فشل تحديث الدولة، يرجى المحاولة مرة أخرى');
    });
  });
});
