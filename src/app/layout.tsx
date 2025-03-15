'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth' // Import from the hooks folder instead
import '@/styles/globals.css'
import {
  BarChart,
  FileInput,
  Goal,
  HelpCircle,
  Home,
  Settings,
  LogOut,
} from "lucide-react";

// Sidebar component defined outside
const SidebarComponent = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-bold">Green Economy</h2>
        <div className="mt-8">
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <Home className="w-5 h-5 mr-3" />
              Home
            </a>
            <a href="/data-input" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <FileInput className="w-5 h-5 mr-3" />
              Data Input
            </a>
            <a href="/goals" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <Goal className="w-5 h-5 mr-3" />
              Goals
            </a>
            <a href="/reports" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <BarChart className="w-5 h-5 mr-3" />
              Reports
            </a>
            <a href="/settings" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
            <a href="/help" className="flex items-center px-4 py-2 rounded hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 mr-3" />
              Help
            </a>
          </nav>
          <div className="mt-8">
            <button 
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Content wrapper component
const ContentWrapper = ({ 
  children, 
  isAuthPage,
  onLogout
}: { 
  children: React.ReactNode
  isAuthPage: boolean 
  onLogout: () => void
}) => {
  return isAuthPage ? (
    <div className="min-h-screen bg-gray-50">{children}</div>
  ) : (
    <div className="flex h-screen bg-gray-50">
      <SidebarComponent onLogout={onLogout} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}

// This component safely uses the auth hook
function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password'
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