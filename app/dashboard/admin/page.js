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
        <header className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

      {/* Stat Cards */}
      <Card>
        <CardHeader>
            <CardTitle>System Overview</CardTitle>
        </CardHeader>
        </Card>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">                       
                <CardTitle className="text-2xl font-bold">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">82</div>
                <p className="text-sm text-muted-foreground mt-1">Admin: 2, Teachers: 50, Staff: 30</p>
            </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground mt-1">Active academic departments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Recent Logins</CardTitle>
            <LogIn className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Logins in last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        </Card>
      <Card>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>

                        <TableHead> <div className="text-xl font-bold p-2 rounded-md">Time</div></TableHead>
                        <TableHead> <div className="text-xl font-bold p-2 rounded-md">Action</div></TableHead>
                        <TableHead> <div className="text-xl font-bold p-2 rounded-md">User</div></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentActivity.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell>{activity.time}</TableCell>
                            <TableCell>{activity.action}</TableCell>
                            <TableCell>{activity.user}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    </div>
  );
}