'use client'

import Link from 'next/link';
import {
  BarChart,
  FileInput,
  Goal,
  HelpCircle,
  Home,
  Settings,
} from "lucide-react"

export const NavLinks = () => {
  // Define inline styles for each icon
  const iconStyles = {
    home: { color: '#ef4444' },
    dataInput: { color: '#3b82f6' },
    goals: { color: '#22c55e' },
    reports: { color: '#a855f7' },
    settings: { color: '#6b7280' },
    help: { color: '#f97316' },
  };

  return (
    <div className="flex-1 px-2 py-4 space-y-2">
      <Link href="/dashboard" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <Home className="w-5 h-5 mr-3" style={iconStyles.home} />
        <span>Home</span>
      </Link>
      
      <Link href="/data-input" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <FileInput className="w-5 h-5 mr-3" style={iconStyles.dataInput} />
        <span>Data Input</span>
      </Link>
      
      <Link href="/goals" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <Goal className="w-5 h-5 mr-3" style={iconStyles.goals} />
        <span>Goals</span>
      </Link>
      
      <Link href="/reports" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <BarChart className="w-5 h-5 mr-3" style={iconStyles.reports} />
        <span>Reports</span>
      </Link>
      
      <Link href="/settings" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <Settings className="w-5 h-5 mr-3" style={iconStyles.settings} />
        <span>Settings</span>
      </Link>
      
      <Link href="/help" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100">
        <HelpCircle className="w-5 h-5 mr-3" style={iconStyles.help} />
        <span>Help</span>
      </Link>
    </div>
  )
}

export default NavLinks;