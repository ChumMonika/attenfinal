'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building, LogIn } from "lucide-react";

export default function AdminDashboardPage() {
   // Placeholder data for recent activity
  const recentActivity = [
    { time: '10:45 AM', action: 'User Jane Smith added', user: 'Admin' },
    { time: '10:42 AM', action: 'Teacher John Doe marked present', user: 'Mazer' },
    { time: '09:15 AM', action: 'Leave request approved for Staff A', user: 'Head' },
  ];

  return (
    <div className="space-y-8">
        <header className="bg-teal-700 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

      {/* Stat Cards */}
      <Card>
        <CardHeader>
            <CardTitle className="text-gray-900">System Overview</CardTitle>
        </CardHeader>
        </Card>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">                       
                <CardTitle className="text-2xl font-bold text-gray-900">Total Users</CardTitle>
                <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">82</div>
                <p className="text-sm text-gray-600 mt-1">Admin: 2, Teachers: 50, Staff: 30</p>
            </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="text-sm text-gray-600 mt-1">Active academic departments</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Logins</CardTitle>
            <LogIn className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">45</div>
            <p className="text-xs text-gray-500 mt-1">Logins in last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
            <CardTitle className="text-gray-900">Recent System Activity</CardTitle>
        </CardHeader>
        </Card>
      <Card>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>

                        <TableHead> <div className="text-xl font-bold text-gray-900  p-2 rounded-md">Time</div></TableHead>
                        <TableHead> <div className="text-xl font-bold text-gray-900  p-2 rounded-md">Action</div></TableHead>
                        <TableHead> <div className="text-xl font-bold text-gray-900  p-2 rounded-md">User</div></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentActivity.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-gray-900">{activity.time}</TableCell>
                            <TableCell className="text-gray-900">{activity.action}</TableCell>
                            <TableCell className="text-gray-900">{activity.user}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    </div>
  );
}