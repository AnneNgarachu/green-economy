// src/components/layouts/nav/NavLinks.tsx
'use client'

import { NavItem } from './NavItem'
import {
  BarChart,
  FileInput,
  Goal,
  HelpCircle,
  Home,
  Settings,
} from "lucide-react"

export const NavLinks = () => {
  return (
    <div className="flex-1 px-2 py-4 space-y-2">
      <NavItem href="/dashboard" icon={Home} iconClassName="text-red-500">
        Home
      </NavItem>
      <NavItem href="/data-input" icon={FileInput} iconClassName="text-blue-500">
        Data Input
      </NavItem>
      <NavItem href="/goals" icon={Goal} iconClassName="text-green-500">
        Goals
      </NavItem>
      <NavItem href="/reports" icon={BarChart} iconClassName="text-purple-500">
        Reports
      </NavItem>
      <NavItem href="/settings" icon={Settings} iconClassName="text-gray-500">
        Settings
      </NavItem>
      <NavItem href="/help" icon={HelpCircle} iconClassName="text-orange-500">
        Help
      </NavItem>
    </div>
  )
}

export default NavLinks;