'use client'

import { MailtrapAuthTest } from '@/components/MailtrapAuthTest'
import { AuthDebugView } from '@/components/AuthDebugView'

export default function TestAuthPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Supabase + Mailtrap Integration Test</h1>
      <div className="mb-8">
        <MailtrapAuthTest />
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-bold text-center mb-6">Auth Debug Information</h2>
        <AuthDebugView />
      </div>
    </div>
  )
}