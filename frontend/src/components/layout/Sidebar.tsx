import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trading', label: 'Trading', icon: '💱' },
    { path: '/portfolio', label: 'Portfolio', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">TradeFlow</h2>
      </div>
      <nav className="mt-6">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : ''
              }`
            }
          >
            <span className="mr-3">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 