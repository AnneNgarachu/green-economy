'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase/client';
import type { AuthChangeEvent, AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

interface SignUpResponse {
  error: AuthError | null;
  emailConfirmationRequired?: boolean;
  user?: SupabaseUser | null;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: RegisterCredentials) => Promise<SignUpResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

// Helper function to convert Supabase User to our custom User type
const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    full_name: supabaseUser.user_metadata?.full_name,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at || supabaseUser.created_at,
    organization_id: supabaseUser.user_metadata?.organization_id
  };
};

// Create the context and export it - this is critical for useContext to work
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setState({ user: null, session: null, isLoading: false });
          return;
        }

        console.log('Session data:', data);

        // Update state with session data
        if (data?.session) {
          const mappedUser = mapSupabaseUser(data.session.user);
          setState({
            user: mappedUser,
            session: data.session,
            isLoading: false,
          });
          console.log('Auth state updated with user', mappedUser?.id);
        } else {
          console.log('No session found, updating loading state');
          setState({ user: null, session: null, isLoading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({ user: null, session: null, isLoading: false });
      }
    };

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            const mappedUser = mapSupabaseUser(session?.user || null);
            setState({
              user: mappedUser,
              session: session,
              isLoading: false,
            });
            break;
          
          case 'SIGNED_OUT':
            setState({
              user: null,
              session: null,
              isLoading: false,
            });
            break;
        }
      }
    );
    
    // Initialize the auth state
    initializeAuth();
    
    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting sign in for:', credentials.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful, session established:', data.session?.user?.id);
      
      // Update state immediately to prevent race conditions
      if (data.session) {
        const mappedUser = mapSupabaseUser(data.session.user);
        setState({
          user: mappedUser,
          session: data.session,
          isLoading: false,
        });
        
        router.push('/dashboard');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleSignUp = async (credentials: RegisterCredentials) => {
    try {
      console.log('Attempting sign up for:', credentials.email);
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
            organization_name: credentials.organization_name
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up response:', data);
      
      // Check if email confirmation is required (no session means confirmation required)
      const emailConfirmationRequired = !data.session;

      // If auto-confirmation is enabled and we have a session
      if (data.session) {
        const mappedUser = mapSupabaseUser(data.session.user);
        setState({
          user: mappedUser,
          session: data.session,
          isLoading: false,
        });
      }
      
      return { 
        error: null, 
        emailConfirmationRequired,
        user: data.user
      };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      console.log('Sign out successful, clearing state');
      setState({
        user: null,
        session: null,
        isLoading: false,
      });
      
      router.push('/login');
      return { error: null };
    } catch (error) {
      console.error('Sign out exception:', error);
      return { error: error as AuthError };
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        return { error };
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        return { error };
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