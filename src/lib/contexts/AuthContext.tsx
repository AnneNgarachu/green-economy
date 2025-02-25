// src/lib/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthError, User, Session } from '@supabase/supabase-js';
import {
  signIn,
  signUp,
  signOut,
  getSession,
  getUser,
  resetPassword,
  updatePassword,
} from '../services/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

type AuthErrorType = AuthError | null;

interface AuthContextType extends AuthState {
  signIn: (credentials: { email: string; password: string }) => Promise<{ error: AuthErrorType }>;
  signUp: (credentials: {
    email: string;
    password: string;
    full_name: string;
    organization_name?: string;
  }) => Promise<{ error: AuthErrorType }>;
  signOut: () => Promise<{ error: AuthErrorType }>;
  resetPassword: (email: string) => Promise<{ error: AuthErrorType }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthErrorType }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    console.log('Auth context initializing');
    
    const initializeAuth = async () => {
      try {
        console.log('Fetching auth session...');
        const { data, error: sessionError } = await getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Session data:', data);

        if (data?.session) {
          console.log('Session found, fetching user...');
          const { data: userData, error: userError } = await getUser();
          
          if (userError) {
            console.error('User error:', userError);
            throw userError;
          }

          console.log('User data:', userData);

          setState({
            user: userData.user,
            session: data.session,
            isLoading: false,
          });
          console.log('Auth state updated with user');
        } else {
          console.log('No session found, updating loading state');
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await signIn({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data?.session) {
        console.log('Sign in successful, updating state');
        setState({
          user: data.session.user,
          session: data.session,
          isLoading: false,
        });
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleSignUp = async ({
    email,
    password,
    full_name,
    organization_name,
  }: {
    email: string;
    password: string;
    full_name: string;
    organization_name?: string;
  }) => {
    try {
      console.log('Attempting sign up for:', email);
      const { data, error } = await signUp({
        email,
        password,
        full_name,
        organization_name,
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up response:', data);

      if (data?.session) {
        console.log('Sign up successful with session, updating state');
        setState({
          user: data.session.user,
          session: data.session,
          isLoading: false,
        });
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        console.log('Sign up successful, email confirmation may be required');
      }
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      console.log('Sign out successful, clearing state');
      setState({
        user: null,
        session: null,
        isLoading: false,
      });
      console.log('Redirecting to login...');
      router.push('/auth/login');
      return { error: null };
    } catch (error) {
      console.error('Sign out exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      
      console.log('Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('Password reset exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      console.log('Attempting password update');
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        console.error('Password update error:', error);
        throw error;
      }
      
      console.log('Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Password update exception:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    ...state,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}