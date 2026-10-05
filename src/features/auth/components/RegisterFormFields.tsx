import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Mobile, Lock1, Sms, Eye, EyeSlash, InfoCircle } from 'iconsax-react';

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
        <Input label={isArabic ? 'رقم الهاتف *' : 'Phone Number *'} type="text" value={phone} onChange={onPhoneChange} placeholder="07xxxxxxxx" icon={<Mobile size={16} variant="Linear" color="#E57E25" />} size="lg" className="text-sm md:text-base" style={{ direction: 'ltr' }} required />
      </div>
      <Input label={isArabic ? 'البريد الإلكتروني *' : 'Email Address *'} type="email" value={email} onChange={onEmailChange} placeholder="name@example.com" icon={<Sms size={16} variant="Linear" color="#E57E25" />} size="lg" className="text-sm md:text-base" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label={isArabic ? 'كلمة المرور *' : 'Password *'} type={showPassword ? 'text' : 'password'} value={password} onChange={onPasswordChange} placeholder="••••••••" icon={<Lock1 size={16} variant="Linear" color="#E57E25" />} rightIcon={<button type="button" onClick={onToggleShowPassword} className="text-ink-muted hover:text-ink cursor-pointer focus:outline-none">{showPassword ? <EyeSlash size={16} variant="Linear" color="#94A3B8" /> : <Eye size={16} variant="Linear" color="#94A3B8" />}</button>} size="lg" className="text-sm md:text-base" required />
        <Input label={isArabic ? 'تأكيد كلمة المرور *' : 'Confirm Password *'} type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={onConfirmPasswordChange} placeholder="••••••••" icon={<Lock1 size={16} variant="Linear" color="#E57E25" />} rightIcon={<button type="button" onClick={onToggleShowConfirmPassword} className="text-ink-muted hover:text-ink cursor-pointer focus:outline-none">{showConfirmPassword ? <EyeSlash size={16} variant="Linear" color="#94A3B8" /> : <Eye size={16} variant="Linear" color="#94A3B8" />}</button>} size="lg" className="text-sm md:text-base" required />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-danger/10 text-xs font-bold text-danger border border-danger/20 flex items-start gap-2">
          <InfoCircle size={14} variant="Linear" color="currentColor" className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </>
  );
};
