
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, ClipboardList, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

const AdminSidebar: React.FC = () => {
  const { user } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-primary text-white' : 'hover:bg-neutral-dark/80'
    }`;

  return (
    <aside className="w-64 bg-neutral-dark text-white p-4 flex flex-col">
      <nav className="flex flex-col gap-2">
        <NavLink to="/staff" className={navLinkClass}>
          <ClipboardList size={20} />
          <span>Order Queue</span>
        </NavLink>
        {user?.role === Role.ADMIN && (
          <>
            <NavLink to="/admin/menu" className={navLinkClass}>
              <Utensils size={20} />
              <span>Menu Management</span>
            </NavLink>
            <NavLink to="/admin/tables" className={navLinkClass}>
              <BarChart2 size={20} />
              <span>Table Management</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
