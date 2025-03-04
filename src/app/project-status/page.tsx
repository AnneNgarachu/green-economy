'use client'

import React from 'react'
// Update this path to match where you placed the component
import StatusDashboard from '@/features/dashboard/components/StatusDashboard'

export default function ProjectStatusPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <StatusDashboard />
    </div>
  )
}