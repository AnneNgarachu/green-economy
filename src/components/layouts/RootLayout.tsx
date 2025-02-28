// src/components/layouts/RootLayout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import {
  BarChart,
  FileInput,
  Goal,
  HelpCircle,
  Home,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const supabase = createClientComponentClient();

const NavItem = ({ href, children, icon: Icon }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? "bg-green-100 text-green-700"
          : "text-black hover:bg-green-50 hover:text-green-700"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform translate-x-0 md:translate-x-0 md:static z-50"
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-700">EcoTrack</h1>
          <p className="text-sm text-black">Sustainability Dashboard</p>
        </div>
        <div className="flex items-center p-4 space-x-3 border-b border-gray-200">
          <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/placeholder-avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-black">User Name</p>
            <p className="text-xs text-black">Logged in</p>
          </div>
        </div>
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
        <div className="px-2 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-black hover:bg-red-50 hover:text-red-700 rounded-md transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold text-black">
              Sustainability Dashboard
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-black bg-gray-200 rounded-md hover:bg-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-black">
              Sustainability Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}