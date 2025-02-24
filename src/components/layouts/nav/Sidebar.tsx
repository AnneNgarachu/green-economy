import { LogOut } from "lucide-react"
import { NavLinks } from "./NavLinks" // Make sure NavLinks.tsx is in the same directory
import { UserProfile } from "./UserProfile"
import { User } from "@supabase/supabase-js"

interface SidebarProps {
  user: User | null
  isSidebarOpen: boolean
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isSidebarOpen, onLogout }) => {
  return (
    <nav
      className={`w-64 fixed inset-y-0 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:w-64 z-50`}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold text-green-700">EcoTrack</h1>
        <p className="text-sm text-gray-500">Sustainability Dashboard</p>
      </div>
      <UserProfile user={user} />
      <NavLinks />
      <div className="px-2 py-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  )
}