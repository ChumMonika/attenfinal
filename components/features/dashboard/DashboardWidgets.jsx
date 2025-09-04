'use client';

import { useAuth } from '../../../contexts/AuthContext'; // Adjust path
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'; // Adjust path

// A simple widget component for demonstration
const InfoWidget = ({ title, value, description }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardWidgets() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* === Admin Widgets === */}
        {user.role === 'admin' && (
          <>
            <InfoWidget title="Total Users" value="10" description="All registered users" />
            <InfoWidget title="Pending Leave Requests" value="3" description="Awaiting approval" />
            <InfoWidget title="Active Departments" value="5" description="Across the university" />
            <InfoWidget title="System Status" value="Online" description="All systems operational" />
          </>
        )}

        {/* === Teacher Widgets === */}
        {user.role === 'teacher' && (
          <>
            <InfoWidget title="Today's Classes" value="3" description="Scheduled for today" />
            <InfoWidget title="My Students" value="85" description="Across all classes" />
            <InfoWidget title="My Attendance" value="100%" description="For the last 30 days" />
            <InfoWidget title="Pending Leave" value="0" description="Your leave requests" />
          </>
        )}

        {/* === Mazer Widgets === */}
        {user.role === 'mazer' && (
            <>
                <InfoWidget title="Teachers to Monitor" value="7" description="All assigned teachers" />
                <InfoWidget title="Attendance Marked Today" value="5" description="Records submitted" />
                <InfoWidget title="Next Scheduled Class" value="CS101 at 9 AM" description="In Room 101" />
            </>
        )}

        {/* === Assistant Widgets (NEW) === */}
        {user.role === 'assistant' && (
            <>
                <InfoWidget title="Staff to Monitor" value="3" description="All general staff" />
                <InfoWidget title="Staff Marked Today" value="2" description="Records submitted" />
                <InfoWidget title="Recent Absences" value="1" description="In the last 7 days" />
            </>
        )}

        {/* === Staff Widgets (NEW) === */}
        {user.role === 'staff' && (
            <>
                <InfoWidget title="My Attendance" value="98%" description="For the last 30 days" />
                <InfoWidget title="My Department" value={user.department} description="Current assignment" />
                <InfoWidget title="Leave Requests" value="1" description="Your pending requests" />
            </>
        )}

        {/* === Head Widgets (NEW) === */}
        {user.role === 'head' && (
            <>
                <InfoWidget title="Department Staff" value="12" description="Teachers and staff" />
                <InfoWidget title="Pending Leave" value="3" description="Requests to approve" />
                <InfoWidget title="Department Attendance" value="96%" description="Overall rate" />
            </>
        )}

      </div>
    </div>
  );
}