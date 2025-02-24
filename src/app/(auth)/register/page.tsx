// src/app/(auth)/register/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This is a redirect page since registration is handled in the AuthTabs component
export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page with register tab active
    router.replace('/login?tab=register')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting to registration form...</p>
    </div>
  )
}