'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  return (
    <div className="flex h-screen w-full">
      {/* Left half - green section with background image */}
      <div 
        className="hidden md:block md:w-1/2 relative bg-green-500"
        style={{
          backgroundImage: 'url("/images/sustainability.svg")',
          backgroundSize: '70%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white max-w-md p-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Green Economy</h1>
            <h2 className="text-3xl mb-6">Sustainability Dashboard</h2>
            <p className="text-xl mb-8">
              Contribute to the Green Economy
            </p>
            <div className="w-16 h-1 bg-white rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
      
      {/* Right half - form container */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">
          {/* Mobile header */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Green Economy</h1>
            <p className="mt-2 text-gray-600">Contribute to the Green Economy</p>
          </div>
          
          {/* Form container */}
          <div className="rounded-lg shadow-sm border border-gray-100 w-full bg-white">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                id="login-tab"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                id="register-tab"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Container */}
            <div className="p-6">
              {activeTab === 'login' && (
                <div className="space-y-4">
                  <LoginForm />
                  <div className="text-center text-sm">
                    <Link 
                      href="/auth/forgot-password"
                      className="text-green-600 hover:text-green-700 transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              )}
              {activeTab === 'register' && <RegisterForm />}
            </div>
          </div>

          {/* Additional links/info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {activeTab === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}