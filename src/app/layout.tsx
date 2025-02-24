'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import '@/styles/globals.css'

// Separate Sidebar component for better organization
const Sidebar = () => {
  const { signOut, user } = useAuth()
  
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-green-600">EcoTrack</h1>
        <p className="text-sm text-gray-600">Sustainability Dashboard</p>
      </div>
      
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div>
          <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
          <p className="text-xs text-gray-600">Logged in</p>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link href="/data-input" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">📊</span> Data Input
            </Link>
          </li>
          <li>
            <Link href="/goals" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">🎯</span> Goals
            </Link>
          </li>
          <li>
            <Link href="/reports" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">📝</span> Reports
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">⚙️</span> Settings
            </Link>
          </li>
          <li>
            <Link href="/help" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <span className="mr-3">❓</span> Help
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <span className="mr-3">🚪</span> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

// Layout Wrapper component to handle auth state and routing
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const { isLoading } = useAuth()
  
  const isAuthPage = pathname?.includes('/auth') || 
                    pathname?.includes('/login') || 
                    pathname?.includes('/register')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return isAuthPage ? (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  ) : (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}