// src/lib/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthError, User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

type AuthErrorType = AuthError | null

interface AuthContextType extends AuthState {
  signIn: (credentials: { email: string; password: string }) => Promise<{ error: AuthErrorType }>
  signUp: (credentials: { 
    email: string
    password: string
    full_name: string
    organization_name?: string 
  }) => Promise<{ error: AuthErrorType }>
  signOut: () => Promise<{ error: AuthErrorType }>
  resetPassword: (email: string) => Promise<{ error: AuthErrorType }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthErrorType }>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the auth service instance
const authService = new AuthService()

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  })

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error: sessionError } = await authService.getSession()
        if (sessionError) throw sessionError

        if (data?.session) {
          const { data: userData, error: userError } = await authService.getUser()
          if (userError) throw userError

          setState({
            user: userData.user,
            session: data.session,
            isLoading: false,
          })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, [])

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await authService.signIn({ email, password })
      if (error) throw error

      if (data?.session) {
        setState({
          user: data.session.user,
          session: data.session,
          isLoading: false,
        })
        router.push('/dashboard')
      }
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signUp = async ({ 
    email, 
    password, 
    full_name, 
    organization_name 
  }: { 
    email: string
    password: string
    full_name: string
    organization_name?: string 
  }) => {
    try {
      const { data, error } = await authService.signUp({ 
        email, 
        password, 
        full_name, 
        organization_name 
      })
      if (error) throw error

      if (data?.session) {
        setState({
          user: data.session.user,
          session: data.session,
          isLoading: false,
        })
        router.push('/dashboard')
      }
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await authService.signOut()
      if (error) throw error

      setState({
        user: null,
        session: null,
        isLoading: false,
      })
      router.push('/auth/login')
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await authService.updatePassword(newPassword)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Export the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}