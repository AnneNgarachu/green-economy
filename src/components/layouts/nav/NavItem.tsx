'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
  href: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}

export const NavItem: React.FC<NavItemProps> = ({ href, children, icon: Icon }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? "bg-green-100 text-green-700"
          : "text-gray-600 hover:bg-green-50 hover:text-green-700"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  )
}