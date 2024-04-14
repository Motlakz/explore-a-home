'use client';

import React from 'react';
import Header from './_components/Header';
import SignInForm from './auth/SignInForm';
import SignUpForm from './auth/SignUpForm';

type Props = {
  children: React.ReactNode;
};

const Provider: React.FC<Props> = ({ children }) => {
  const [authType, setAuthType] = React.useState<'signup' | 'signin'>('signin');

  const handleToggle = () => {
    setAuthType((prevAuthType) => (prevAuthType === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <div>
      <Header />
      {authType === 'signin' ? (
        <SignInForm onToggle={handleToggle} />
      ) : (
        <SignUpForm onToggle={handleToggle} />
      )}
      {children}
    </div>
  );
};

export default Provider;