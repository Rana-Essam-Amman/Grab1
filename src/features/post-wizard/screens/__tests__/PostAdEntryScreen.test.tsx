import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostAdEntryScreen } from '../PostAdEntryScreen';
import { usePostAdEntry } from '../../hooks/usePostAdEntry';

const mockHandleBack = vi.fn();
const mockStartPostFlow = vi.fn();

vi.mock('../../hooks/usePostAdEntry', () => ({
  usePostAdEntry: vi.fn(),
}));

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: true,
    navigateTo: vi.fn(),
  }),
}));

vi.mock('@iconify/react', () => ({
  Icon: () => <span data-testid="mock-icon" />,
}));

vi.mock('@/shared/components/BrandMark', () => ({
  BrandMark: () => <div data-testid="brand-mark">FOX</div>,
}));

describe('PostAdEntryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the blocked state when canPostInMarket is false', () => {
    vi.mocked(usePostAdEntry).mockReturnValue({
      isArabic: true,
      handleBack: mockHandleBack,
      startPostFlow: mockStartPostFlow,
      canPostInMarket: false,
      myMarket: 'JO',
      freeRemaining: 0,
      freeLimit: 20,
      updateUserMarket: vi.fn(),
    });

    render(<PostAdEntryScreen />);
    
    expect(screen.getByText(/لا يمكنك النشر إلا في سوق الأردن/)).toBeInTheDocument();
    expect(screen.queryByText('نشر إعلان جديد')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('رجوع'));
    expect(mockHandleBack).toHaveBeenCalled();
  });

  it('renders the ready state and allows starting post flow when canPostInMarket is true', () => {
    vi.mocked(usePostAdEntry).mockReturnValue({
      isArabic: true,
      handleBack: mockHandleBack,
      startPostFlow: mockStartPostFlow,
      canPostInMarket: true,
      myMarket: 'JO',
      freeRemaining: 20,
      freeLimit: 20,
      updateUserMarket: vi.fn(),
    });

    render(<PostAdEntryScreen />);
    
    expect(screen.getByText('جاهز لنشر إعلانك؟')).toBeInTheDocument();
    expect(screen.getByText('عندك 20 من 20 إعلانات مجانية')).toBeInTheDocument();
    
    const startBtn = screen.getByText('نشر إعلان جديد');
    fireEvent.click(startBtn);
    expect(mockStartPostFlow).toHaveBeenCalled();
  });
});
