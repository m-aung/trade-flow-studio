import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trading', label: 'Trading', icon: '💱' },
    { path: '/portfolio', label: 'Portfolio', icon: '📈' },
  ];

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">TradeFlow</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="sr-only">Close sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 py-4 space-y-1">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-md transition-colors
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : ''}`
              }
            >
              <span className="mr-3 text-xl">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 