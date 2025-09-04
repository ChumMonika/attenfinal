'use client';

import { useAuth } from '../../contexts/AuthContext'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User } from 'lucide-react';

const NavLink = ({ href, children, icon: Icon, activePaths }) => {
  const pathname = usePathname();
  
  let isActive = pathname === href || (activePaths && activePaths.some(path => pathname.startsWith(path)));

  return (
    <Link 
      href={href} 
      className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-[#0F766E] text-white shadow-sm' 
          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
      }`}
    >
      {Icon && (
        <Icon 
          className={`h-5 w-5 mr-3 ${ isActive ? 'text-white' : 'text-teal-600' }`} 
        />
      )}
      {children}
    </Link>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const adminTaskPaths = ['/dashboard/admin/tasks', '/dashboard/admin/users', '/dashboard/admin/schedules'];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4 min-h-screen sticky top-0">
      <div className="flex items-center mb-10">
        <span className="text-2xl font-bold text-teal-700">University System</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {user.role === 'admin' && (
          <>
            <NavLink href="/dashboard/admin" icon={Home}>Dashboard</NavLink>
            <NavLink href="/dashboard/admin/tasks" icon={Briefcase} activePaths={adminTaskPaths}>Tasks</NavLink>
            <NavLink href="/dashboard/profile" icon={User}>Profile</NavLink>
          </>
        )}

        {/* === THIS IS THE CORRECTED SECTION === */}
        {user.role === 'teacher' && (
          <>
            <NavLink href="/dashboard/teacher" icon={Home}>Dashboard</NavLink>
            <NavLink href="/dashboard/profile" icon={User}>Profile</NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto">
        <button 
          onClick={logout} 
          className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}