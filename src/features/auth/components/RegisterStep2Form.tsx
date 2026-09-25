import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Refresh, DirectInbox, TickCircle } from 'iconsax-react';
import { useRegisterStep2 } from '../hooks/useRegisterStep2';
import { MarketCode } from '@/shared/lib/marketGate';

interface RegisterStep2FormProps {
  stagedPhone: string;
  stagedPassword: string;
  stagedEmail: string;
  stagedFirstName: string;
  stagedCountry: MarketCode;
  secureToken: string;
  onSuccess: (phone: string, firstName: string) => void;
  onSwitchToLogin: () => void;
  onToast: (msg: string) => void;
}

export const RegisterStep2Form: React.FC<RegisterStep2FormProps> = (props) => {
  const {
    subPhase,
    secureToken,
    loading,
    handleRegisterStep3Activate,
    isArabic,
  } = useRegisterStep2(props);

  if (subPhase === 'sending') {
    return (
      <div className="p-8 flex flex-col items-center justify-center flex-1 gap-4 text-center">
        <Refresh size={36} variant="Linear" color="#E57E25" className="animate-spin" />
        <div>
          <h3 className="text-base font-bold text-ink mb-1">
            {isArabic ? 'جاري إرسال الرابط التفعيل...' : 'Sending Activation Link...'}
          </h3>
          <p className="text-xs text-ink-muted max-w-[280px] mx-auto leading-relaxed">
            {isArabic
              ? 'جاري إعداد وتوجيه طلبك عبر خطوط التوزيع الآمنة للبريد الإلكتروني بواسطة Resend.'
              : 'Routing your request securely via our serverless Resend integration.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 flex-1 text-center justify-center max-w-sm mx-auto w-full">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
        <DirectInbox size={28} variant="Bold" color="#E57E25" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-ink">
          {isArabic ? 'تحقق من بريدك الإلكتروني لتفعيل حسابك' : 'Check your Email for Activation'}
        </h2>
        <Badge
          variant="success"
          size="md"
          icon={<TickCircle size={14} variant="Bold" color="#10B981" />}
          className="bg-green-50 text-green-700 border border-green-100 mx-auto font-bold py-1.5 px-3 rounded-lg"
        >
          {isArabic ? 'تم إرسال رابط التفعيل بنجاح' : 'Activation link sent successfully'}
        </Badge>
        
        {secureToken && (
          <div className="bg-amber-50 text-amber-800 border border-amber-200 p-3.5 rounded-xl text-xs font-bold text-center mt-2 max-w-[320px] mx-auto">
            <span className="block text-[10px] text-amber-600 uppercase tracking-wider mb-1">
              {isArabic ? '🔑 رمز التفعيل التجريبي (Demo Token)' : '🔑 Demo Verification Token'}
            </span>
            <span className="text-base font-mono font-extrabold select-all tracking-widest bg-white/70 px-3 py-1 rounded-lg border border-amber-100 shadow-sm block w-fit mx-auto mt-1">
              {secureToken}
            </span>
            <span className="block text-[10px] opacity-85 font-normal mt-1.5">
              {isArabic ? 'تمت طباعة الرمز في وحدة التحكم (Console) بالمتصفح أيضاً' : 'This token has also been logged in your browser Console.'}
            </span>
          </div>
        )}

        <p className="text-xs text-ink-soft leading-relaxed max-w-[320px] mx-auto mt-1">
          {isArabic
            ? `لقد أرسلنا للتو رابط تفعيل آمن عبر Resend إلى بريدك: ${props.stagedEmail}. يرجى النقر فوق زر التحقق في الرسالة لتفعيل الحساب.`
            : `We've dispatched a secure verification link via Resend to: ${props.stagedEmail}. Simply click the verification link inside to activate your session.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={props.onSwitchToLogin} type="button" variant="outline" size="lg" fullWidth>
          {isArabic ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </Button>
        <Button
          onClick={handleRegisterStep3Activate}
          type="button"
          variant="primary"
          size="lg"
          disabled={loading}
          fullWidth
        >
          {loading 
            ? (isArabic ? 'جاري التفعيل...' : 'Activating...') 
            : (isArabic ? 'تأكيد الرابط وتفعيل الحساب الآن' : 'Verify Link & Activate Account')
          }
        </Button>
      </div>
    </div>
  );
};
