import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { MarketCode } from '@/shared/lib/marketGate';
import { publishDraftAfterAuth } from '../helpers/publishDraftAfterAuth';

interface UseRegisterStep2Options {
  stagedPhone: string;
  stagedPassword: string;
  stagedEmail: string;
  stagedFirstName: string;
  stagedCountry: MarketCode;
  secureToken: string;
  onSuccess: (phone: string, firstName: string) => void;
  onToast?: (msg: string) => void;
}

export const useRegisterStep2 = ({
  stagedPhone,
  stagedPassword,
  stagedEmail,
  stagedFirstName,
  stagedCountry,
  secureToken,
  onSuccess,
  onToast,
}: UseRegisterStep2Options) => {
  const { isArabic } = useUI();
  const { registerNewUser } = useAuth();
  
  const [subPhase, setSubPhase] = useState<'sending' | 'sent'>('sending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSubPhase('sent'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterStep3Activate = useCallback(async () => {
    if (!registerNewUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      registerNewUser({
        firstName: stagedFirstName || 'Sufyan',
        email: stagedEmail,
        phone: stagedPhone,
        countryCode: stagedCountry,
        password: stagedPassword,
        status: 'Active'
      });
      
      onToast?.(
        isArabic
          ? 'تم تفعيل الحساب بنجاح وتسجيل الدخول!'
          : 'Account successfully activated & logged in!'
      );
      
      setTimeout(() => onToast?.(''), 4000);
      publishDraftAfterAuth(stagedPhone, stagedFirstName || 'Sufyan', stagedCountry);
      
      onSuccess(stagedPhone, stagedFirstName || 'Sufyan');
    } catch (err: any) {
      setError(err.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  }, [
    registerNewUser, stagedFirstName, stagedEmail, stagedPhone, 
    stagedCountry, stagedPassword, isArabic, onToast, onSuccess
  ]);

  return {
    subPhase,
    secureToken,
    loading,
    error,
    handleRegisterStep3Activate,
    isArabic,
  };
};
