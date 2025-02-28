'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('login')

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <Card>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger id="login-tab" value="login">
              Sign In
            </TabsTrigger>
            <TabsTrigger id="register-tab" value="register">
              Create Account
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

export default AuthTabs