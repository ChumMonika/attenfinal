'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
        <header className="bg-primary text-primary-foreground p-4 rounded-lg shadow-md">
           <h1 className="text-xl font-bold">My Profile</h1>
        </header>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="font-bold">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Role:</span>
              <span className="capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Department:</span>
              <span>{user.department || 'N/A'}</span>
            </div>
             <div className="flex justify-between">
              <span className="font-semibold text-muted-foreground">Status:</span>
              <span className="capitalize">{user.status}</span>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}