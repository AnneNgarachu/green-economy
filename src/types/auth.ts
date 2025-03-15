import type { Session } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
  organization_id?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    organization_name?: string
    [key: string]: any
  }
}

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string
  organization_name?: string
}