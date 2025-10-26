
import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-neutral-dark text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">Scan & Dine - Staff Panel</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle size={24} />
          <span>{user?.name} ({user?.role})</span>
        </div>
        <Button onClick={logout} variant="danger" size="sm">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
