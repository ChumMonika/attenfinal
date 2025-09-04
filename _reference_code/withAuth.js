'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const withAuth = (WrappedComponent, allowedRoles) => {
  const AuthComponent = (props) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.replace('/');
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace('/dashboard');
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
