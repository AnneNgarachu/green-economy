// src/lib/services/authService.ts
'use server';

import { createClient } from '@supabase/supabase-js';
import type { AuthResponse } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables!
    Add these to your .env.local file:

    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    NEXT_PUBLIC_APP_URL=your-app-url (e.g. http://localhost:3001)
  `);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SignUpCredentials {
  email: string;
  password: string;
  full_name: string;
  organization_name?: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  return supabase.auth.signInWithPassword(credentials);
}

export async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
  const { email, password, full_name, organization_name } = credentials;
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        organization_name,
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function getUser() {
  return supabase.auth.getUser();
}

export async function resetPassword(email: string) {
  // Use environment variable instead of window.location
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({
    password: newPassword,
  });
}