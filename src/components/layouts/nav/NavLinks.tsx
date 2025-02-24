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
      <NavItem href="/dashboard" icon={Home}>
        Home
      </NavItem>
      <NavItem href="/data-input" icon={FileInput}>
        Data Input
      </NavItem>
      <NavItem href="/goals" icon={Goal}>
        Goals
      </NavItem>
      <NavItem href="/reports" icon={BarChart}>
        Reports
      </NavItem>
      <NavItem href="/settings" icon={Settings}>
        Settings
      </NavItem>
      <NavItem href="/help" icon={HelpCircle}>
        Help
      </NavItem>
    </div>
  )
}