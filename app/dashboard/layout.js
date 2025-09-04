'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar'; // Using @/ alias for reliability

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until the initial authentication check is complete
    if (isLoading) {
      return;
    }

    // If the check is done and there is NO user, redirect to the login page
    if (!user) {
      router.push('/');
      return;
    }

    // If the user is logged in but is on the base '/dashboard' path,
    // redirect them to their specific role's dashboard.
    if (user && pathname === '/dashboard') {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'teacher':
          router.push('/dashboard/teacher');
          break;
        // Add cases for other roles here
        default:
          router.push('/dashboard/profile');
          break;
      }
    }
  }, [user, isLoading, router, pathname]);

  // While loading or if there's no user (before redirect happens), show a loading screen.
  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p className="text-gray-700">Loading...</p>
        </div>
    );
  }

  // If the user is authenticated, show the dashboard layout.
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}

