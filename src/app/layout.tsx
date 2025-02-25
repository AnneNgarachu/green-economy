// src/app/layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import '@/styles/globals.css'

// Sidebar component defined outside to avoid auth context issues
const SidebarComponent = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      {/* Sidebar content */}
      <div className="p-4">
        <h2 className="text-xl font-bold">Green Economy</h2>
        {/* Add your sidebar navigation items here */}
        <div className="mt-8">
          <button 
            onClick={onLogout}
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

// Main content wrapper
const ContentWrapper = ({ 
  children, 
  isAuthPage 
}: { 
  children: React.ReactNode
  isAuthPage: boolean 
}) => {
  return isAuthPage ? (
    <div className="min-h-screen bg-gray-50">{children}</div>
  ) : (
    <div className="flex h-screen bg-gray-50">
      {/* We'll conditionally render the sidebar in the AuthenticatedLayout */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

// The authenticated content with sidebar
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/register'
  const [isClient, setIsClient] = useState(false)
  
  // Use isClient to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only try to use auth hook on client-side
  if (isClient && !isAuthPage) {
    // We import and use useAuth dynamically only when needed
    const { useAuth } = require('@/lib/contexts/AuthContext')
    const { signOut } = useAuth()
    
    const handleLogout = async () => {
      await signOut()
    }

    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarComponent onLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    )
  }

  // For auth pages or during SSR
  return <div className="min-h-screen bg-gray-50">{children}</div>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/register'
  
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  )
}