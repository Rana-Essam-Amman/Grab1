import React from 'react';
import { LoginScreen } from './LoginScreen';

export const RegisterScreen: React.FC = () => {
  return <LoginScreen initialStep="reg-step1" />;
};
