'use client'

import React from "react"
import Image from "next/image" 
import { User } from "@supabase/supabase-js"

interface UserProfileProps {
  user: User | null
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return <p className="text-sm text-gray-500">Loading user...</p>
  }

  return (
    <div className="flex items-center p-4 space-x-3 border-b border-gray-200">
      <div className="relative w-10 h-10 overflow-hidden rounded-full">
        <Image
          src={user.user_metadata?.avatar_url || "/api/placeholder/40/40"}
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>
      <div>
        {/* Apply inline styles to force black text */}
        <p 
          className="text-sm font-medium" 
          style={{ 
            color: 'black', 
            WebkitTextFillColor: 'black' 
          }}
        >
          {user.user_metadata?.full_name || user.email}
        </p>
        <p className="text-xs text-gray-500">Logged in</p>
      </div>
    </div>
  )
}

export default UserProfile