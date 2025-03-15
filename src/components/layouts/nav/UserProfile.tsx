'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

// This matches the structure in your image more closely
interface UserProfileProps {
  user?: any;
  onLogout?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user: propsUser, onLogout }) => {
  // If user is provided as prop, use it, otherwise use from auth context
  const auth = useAuth();
  const user = propsUser || auth.user;
  
  if (!user) {
    return <p className="text-sm text-gray-500">Loading user...</p>
  }

  return (
    <div className="flex items-center p-4 space-x-3 border-b border-gray-200">
      <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-200">
        <Image
          src={user?.user_metadata?.avatar_url || "/api/placeholder/40/40"}
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
          {user?.user_metadata?.full_name || user?.email || "User Name"}
        </p>
        <p className="text-xs text-gray-500">Logged in</p>
      </div>
      {onLogout && (
        <button 
          onClick={onLogout}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  )
};

export default UserProfile;