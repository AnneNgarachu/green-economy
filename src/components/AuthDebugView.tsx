'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export const AuthDebugView = () => {
  const { user } = useAuth()
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getSession()
      if (!error && data) {
        setSession(data.session)
      }
      setIsLoading(false)
    }
    
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.getSession()
    if (!error && data) {
      setSession(data.session)
    }
    setIsLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Auth Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">User Status:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-32">
            <pre className="text-sm">{user ? 'Logged In' : 'Not Logged In'}</pre>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">User Details:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Session Details:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Auth State'}
        </Button>
      </CardFooter>
    </Card>
  )
}