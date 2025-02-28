import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Target, FileText, Settings, HelpCircle } from 'lucide-react';

export const NavLinks: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    {
      to: '/',
      icon: <Home className="w-5 h-5 text-red-500" />,
      label: 'Home',
      color: 'red'
    },
    {
      to: '/data-input',
      icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
      label: 'Data Input',
      color: 'blue'
    },
    {
      to: '/goals',
      icon: <Target className="w-5 h-5 text-green-500" />,
      label: 'Goals',
      color: 'green'
    },
    {
      to: '/reports',
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      label: 'Reports',
      color: 'purple'
    },
    {
      to: '/settings',
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      label: 'Settings',
      color: 'gray'
    },
    {
      to: '/help',
      icon: <HelpCircle className="w-5 h-5 text-orange-500" />,
      label: 'Help',
      color: 'orange'
    }
  ];

  return (
    <div className="px-2 py-4 space-y-1">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive(link.to)
              ? `bg-${link.color}-50 text-${link.color}-700`
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="mr-3">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;