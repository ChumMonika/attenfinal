'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
// CORRECTED: Import the new unified Sidebar
import Sidebar from '../../components/layout/sidebar'; 

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
          {children}
      </main>
    </div>
  );
}