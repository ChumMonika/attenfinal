'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication check is complete
    if (isLoading) {
      return; // Do nothing while loading
    }

    // If the check is done and there is a user, redirect them
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'teacher':
          router.push('/dashboard/teacher'); // We'll create this page later
          break;
        // Add other roles here
        default:
          // For any other logged-in user, send them to their profile for now
          router.push('/dashboard/profile');
          break;
      }
    } else {
      // If the check is done and there is NO user, send them to the login page
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Display a simple loading state while the redirection is happening
  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="p-6">
            <p>Loading...</p>
        </div>
    </div>
  );
}