
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border">
      <div className="flex items-center justify-center h-16 border-b border-border">
        <Shield className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">RiskWatch</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-accent text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-primary'
              )
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
