// src/components/layouts/nav/NavItem.tsx
import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  iconClassName?: string; // Added this prop
  children: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon: Icon, 
  iconClassName = "", 
  children 
}) => {
  return (
    <Link 
      href={href} 
      className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
    >
      <Icon className={`w-5 h-5 mr-3 ${iconClassName}`} />
      <span>{children}</span>
    </Link>
  );
};

export default NavItem;