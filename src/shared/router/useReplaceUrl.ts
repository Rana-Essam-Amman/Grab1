import { useNavigate } from 'react-router-dom';

/**
 * Wraps react-router's navigate with { replace: true }.
 * Exists so feature folders can update the URL without importing
 * react-router-dom directly (banned outside src/shared/router/**).
 */
export function useReplaceUrl(): (path: string) => void {
  const navigate = useNavigate();
  return (path: string) => navigate(path, { replace: true });
}
