import React, { useState, useEffect } from 'react';
import {supabase} from '../supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import AuthToggle from './AuthToggle';
import { FaGoogle, FaGithub } from 'react-icons/fa';

interface AuthError {
  message: string;
}

interface SignInFormProps {
  onToggle: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onToggle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN') {
            const provider = session?.provider_token ? 'oauth' : 'email';
            toast.success(`Logged in with ${provider} successfully!`);
            }
        }
        );

        return () => {
        listener?.subscription.unsubscribe();
        };
    }, []);

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({ provider });

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
        const authError = error as AuthError;
        toast.error(`Error signing in: ${authError.message}`);
        } else {
        toast.success('Sign in successful!');
        }

        setIsLoading(false);
    };

    return (
        <div className="sign-in-bg bg-cover min-h-screen bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <article className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Email Address"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center p-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign In
                            </button>
                            <p className="text-center font-bold my-4">OR</p>
                            <div className="auth-btns flex flex-col gap-2">
                                <button
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={isLoading}
                                    className="w-full flex justify-center gap-3 items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                    <FaGoogle className="w-8 h-8" />
                                    Continue with Google
                                </button>
                                <button
                                    onClick={() => handleOAuthLogin('github')}
                                    disabled={isLoading}
                                    className="w-full flex justify-center gap-3 items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                    <FaGithub className="w-8 h-8" />
                                    Continue with GitHub
                                </button>
                            </div>
                        </div>
                    </form>
                    <AuthToggle isSignUp={false} onToggle={onToggle} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignInForm;