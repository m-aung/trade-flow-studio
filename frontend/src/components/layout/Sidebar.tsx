import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trading', label: 'Trading', icon: '💱' },
    { path: '/portfolio', label: 'Portfolio', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">TradeFlow</h2>
      </div>
      <nav className="mt-6">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-100 hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
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