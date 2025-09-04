'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
        <header className="bg-teal-700 text-white p-4 rounded-lg shadow-md">
           <h1 className="text-xl font-bold">My Profile</h1>
        </header>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-teal-600 font-bold">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="text-gray-900">{user.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Role:</span>
              <span className="capitalize text-gray-900">{user.role}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Department:</span>
              <span className="text-gray-900">{user.department || 'N/A'}</span>
            </div>
             <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className="capitalize text-gray-900">{user.status}</span>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}