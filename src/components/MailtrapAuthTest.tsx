'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const MailtrapAuthTest = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Password123!')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  
  // Test registration with email verification
  const testSignUp = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      console.log('Testing sign up with email:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: 'Test User',
          }
        }
      })
      
      console.log('Sign up response:', { data, error })
      
      if (error) throw error
      
      setMessage({ 
        text: `Sign up successful! Email confirmation sent to ${email}. Check Mailtrap inbox.`, 
        type: 'success' 
      })
    } catch (error) {
      console.error('Sign up error:', error)
      setMessage({ 
        text: error instanceof Error ? error.message : 'Sign up failed', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Test password reset
  const testPasswordReset = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      console.log('Testing password reset for email:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
      
      setMessage({ 
        text: `Password reset email sent to ${email}. Check Mailtrap inbox.`, 
        type: 'success' 
      })
    } catch (error) {
      console.error('Password reset error:', error)
      setMessage({ 
        text: error instanceof Error ? error.message : 'Password reset failed', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Mailtrap Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={message.type === 'error' ? '' : 'text-green-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email address</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            required
          />
          <p className="text-xs text-gray-500">
            Enter an email that you can verify in Mailtrap
          </p>
        </div>
        
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up Test</TabsTrigger>
            <TabsTrigger value="reset">Password Reset Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup" className="pt-4">
            <Button 
              onClick={testSignUp} 
              disabled={isLoading || !email} 
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Test Sign Up Email'}
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Tests the registration email verification flow via Mailtrap
            </p>
          </TabsContent>
          
          <TabsContent value="reset" className="pt-4">
            <Button 
              onClick={testPasswordReset} 
              disabled={isLoading || !email} 
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Test Password Reset Email'}
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Tests the password reset email flow via Mailtrap
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-xs text-gray-500 text-center">
          <p>After testing, check your Mailtrap inbox to verify email delivery</p>
          <p className="mt-1">Log data will be printed to the browser console</p>
        </div>
      </CardFooter>
    </Card>
  )
}