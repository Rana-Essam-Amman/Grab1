import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiDraft } from '../useAiDraft';
import { useDraftStore } from '../../store/draft.slice';
import { useUIStore } from '@/store/ui.slice';

describe('useAiDraft', () => {
  beforeEach(() => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: 'عمّان', neighborhood: 'خلدا', site: '', noteText: '',
      },
    });
    useUIStore.setState({ currentScreen: 'main', screenHistory: ['main'] });
  });

  it('initial state: empty prompt, no error, not generating', () => {
    const { result } = renderHook(() => useAiDraft());
    expect(result.current.prompt).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });

  it('setPrompt updates prompt', () => {
    const { result } = renderHook(() => useAiDraft());
    act(() => {
      result.current.setPrompt('test prompt');
    });
    expect(result.current.prompt).toBe('test prompt');
  });

  it('handleManualSubmit writes title/price/description into draft.generated', () => {
    const { result } = renderHook(() => useAiDraft());
    act(() => {
      result.current.handleManualSubmit({
        title: 'Test Title',
        price: '500',
        description: 'A description',
      });
    });
    const draft = useDraftStore.getState().postDraft;
    expect(draft.title).toBe('Test Title');
    expect(draft.price).toBe('500');
    expect(draft.generated?.description).toBe('A description');
  });
});
