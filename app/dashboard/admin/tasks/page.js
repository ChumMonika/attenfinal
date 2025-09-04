'use client';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Calendar, BarChart, Settings } from "lucide-react";

const TaskCard = ({ href, icon: Icon, title, description }) => (
    <Link href={href} passHref>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle  className="font-semibold text-gray-700">{title}</CardTitle>
                <p className="text-gray-600">{description}</p>
            </CardHeader>
        </Card>
    </Link>
);

export default function AdminTasksPage() {
    const tasks = [
        { href: '/dashboard/admin/users', icon: Users, title: 'User Management', description: 'Manage user accounts, roles, and permissions' },
        { href: '/dashboard/admin/schedules', icon: Calendar, title: 'Schedules', description: 'Create and manage class schedules' },
        { href: '#', icon: BarChart, title: 'Reports', description: 'Generate and view system reports' },
        { href: '#', icon: Settings, title: 'Settings', description: 'Configure system settings' },
    ];

    return (
        <div className="space-y-8">
            <header className="bg-teal-700 text-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold">Administrative Tasks - Manage system operations</h1>
                <p className="text-teal-100 mt-2"></p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                    <TaskCard key={task.title} {...task} />
                ))}
            </div>
        </div>
    );
}