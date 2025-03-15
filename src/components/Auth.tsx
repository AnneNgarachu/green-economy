'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { AlertCircle } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setView('sign-in')
    }
    
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-6">
        {view === 'sign-in' ? 'Sign In' : 'Create Account'}
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4 w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form 
        onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp} 
        className="space-y-4 w-full"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : view === 'sign-in' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        {view === 'sign-in' ? (
          <p className="text-sm">
            Don't have an account?{' '}
            <button
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => setView('sign-up')}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{' '}
            <button
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => setView('sign-in')}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}