"use client"
import { useState, useEffect } from 'react';
import {supabase} from '../supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthFormProps {
  type: 'signup' | 'signin';
}

interface AuthError {
  message: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const provider = session?.provider_token ? 'oauth' : 'email';
        toast.success(`Logged in with ${provider} successfully!`);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      });
  
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Error logging in with ${provider}: ${authError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const authFunction = type === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { data, error } = await authFunction({ email, password });

    if (error) {
      const authError = error as AuthError;
      toast.error(`${type === 'signup' ? 'Error signing up' : 'Error signing in'}: ${authError.message}`);
    } else {
      toast.success(`${type === 'signup' ? 'Sign up' : 'Sign in'} successful!`);
    }

    setIsLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>{type === 'signup' ? 'Sign Up' : 'Sign In'}</button>

        {type === 'signin' && (
          <div>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              Sign In with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
            >
              Sign In with GitHub
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default AuthForm;