
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import Button from '../ui/Button';

const Topbar: React.FC = () => {
  const { user, logout } = useAppContext();

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
      <div className="md:hidden">
        {/* Mobile menu button can be added here */}
      </div>
      <div className="flex-1">
         {/* Search bar can be added here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">({user?.role})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
