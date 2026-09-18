import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Smartphone, Lock, Mail, Eye, EyeOff, Info } from 'lucide-react';

interface RegisterFormFieldsProps {
  isArabic: boolean;
  firstName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  error: string;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
}

export const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  isArabic, firstName, phone, email, password, confirmPassword,
  showPassword, showConfirmPassword, error,
  onFirstNameChange, onPhoneChange, onEmailChange, onPasswordChange,
  onConfirmPasswordChange, onToggleShowPassword, onToggleShowConfirmPassword
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input label={isArabic ? 'الاسم الأول *' : 'First Name *'} type="text" value={firstName} onChange={onFirstNameChange} placeholder={isArabic ? 'الاسم الأول' : 'First Name'} size="lg" className="text-sm md:text-base" required />
        <Input label={isArabic ? 'رقم الهاتف *' : 'Phone Number *'} type="text" value={phone} onChange={onPhoneChange} placeholder="07xxxxxxxx" icon={<Smartphone size={16} />} size="lg" className="text-sm md:text-base" style={{ direction: 'ltr' }} required />
      </div>
      <Input label={isArabic ? 'البريد الإلكتروني *' : 'Email Address *'} type="email" value={email} onChange={onEmailChange} placeholder="name@example.com" icon={<Mail size={16} />} size="lg" className="text-sm md:text-base" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label={isArabic ? 'كلمة المرور *' : 'Password *'} type={showPassword ? 'text' : 'password'} value={password} onChange={onPasswordChange} placeholder="••••••••" icon={<Lock size={16} />} rightIcon={<button type="button" onClick={onToggleShowPassword} className="text-ink-muted hover:text-ink cursor-pointer focus:outline-none">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} size="lg" className="text-sm md:text-base" required />
        <Input label={isArabic ? 'تأكيد كلمة المرور *' : 'Confirm Password *'} type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={onConfirmPasswordChange} placeholder="••••••••" icon={<Lock size={16} />} rightIcon={<button type="button" onClick={onToggleShowConfirmPassword} className="text-ink-muted hover:text-ink cursor-pointer focus:outline-none">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} size="lg" className="text-sm md:text-base" required />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-xs font-bold text-red-500 border border-red-100 flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </>
  );
};
