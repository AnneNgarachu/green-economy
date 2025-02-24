// src/lib/services/authService.ts
import { createClient } from '@supabase/supabase-js';
import type { AuthResponse } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return await this.supabase.auth.signInWithPassword(credentials);
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const { email, password, full_name, organization_name } = credentials;
    return await this.supabase.auth.signUp({
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

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  async getUser() {
    return await this.supabase.auth.getUser();
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  async updatePassword(newPassword: string) {
    return await this.supabase.auth.updateUser({
      password: newPassword,
    });
  }
}