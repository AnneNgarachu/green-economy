// src/app/layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/contexts/AuthContext'
import '@/styles/globals.css'
import Image from 'next/image'
import {
  BarChart,
  FileInput,
  Goal,
  HelpCircle,
  Home,
  Settings,
  LogOut,
} from "lucide-react";

// User Profile Component
const UserProfile = ({ user }: { user: any }) => {
  if (!user) {
    return <p className="text-sm text-gray-500">Loading user...</p>
  }

  return (
    <div className="flex items-center p-4 space-x-3 border-b border-gray-200">
      <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-200">
        <Image
          src={user.user_metadata?.avatar_url || "/api/placeholder/40/40"}
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p 
          className="text-sm font-medium" 
          style={{ 
            color: 'black', 
            WebkitTextFillColor: 'black' 
          }}
        >
          {user.user_metadata?.full_name || user.email || "User Name"}
        </p>
        <p className="text-xs text-gray-500">Logged in</p>
      </div>
    </div>
  )
}

// Sidebar component with colorful icons
const SidebarComponent = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-bold text-green-700">Green Economy</h2>
        <p className="text-sm text-gray-500">Sustainability Dashboard</p>
      </div>
      <UserProfile user={user} />
      <div className="mt-4">
        <nav className="space-y-2 px-2">
          <a href="/dashboard" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-green-600">🏠</span>
            Home
          </a>
          <a href="/data-input" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-blue-600">📊</span>
            Data Input
          </a>
          <a href="/goals" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-red-600">🎯</span>
            Goals
          </a>
          <a href="/reports" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-purple-600">📝</span>
            Reports
          </a>
          <a href="/settings" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-gray-600">⚙️</span>
            Settings
          </a>
          <a href="/help" className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-green-50 hover:text-green-700">
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-yellow-600">❓</span>
            Help
          </a>
        </nav>
        <div className="px-2 py-4 mt-4">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition"
          >
            <span className="flex items-center justify-center w-5 h-5 mr-3 text-orange-600">📤</span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

// Content wrapper component
const ContentWrapper = ({ 
  children, 
  isAuthPage,
  user,
  onLogout
}: { 
  children: React.ReactNode
  isAuthPage: boolean
  user: any
  onLogout: () => void
}) => {
  return isAuthPage ? (
    <div className="min-h-screen bg-gray-50">{children}</div>
  ) : (
    <div className="flex h-screen bg-gray-50">
      <SidebarComponent user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}

// This component safely uses the auth hook
function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/register'
  const [isClient, setIsClient] = useState(false)
  const auth = useAuth() // Always call the hook unconditionally at the top level
  
  // Use isClient to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    await auth.signOut()
  }

  // ContentWrapper handles both auth and non-auth layouts
  return (
    <ContentWrapper 
      isAuthPage={isAuthPage}
      user={auth.user}
      onLogout={handleLogout}
    >
      {children}
    </ContentWrapper>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthenticatedContent>
            {children}
          </AuthenticatedContent>
        </AuthProvider>
      </body>
    </html>
  )
}