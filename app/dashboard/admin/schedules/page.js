'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const ScheduleForm = ({ schedule, onSave, onCancel, courses, teachers }) => {
  const [formData, setFormData] = useState(
    schedule || {
      courseId: '',
      teacherId: '',
      day: '',
      startTime: '',
      endTime: '',
    }
  );

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
        <Select name="courseId" value={formData.courseId} onValueChange={(value) => handleSelectChange('courseId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
        <Select name="teacherId" value={formData.teacherId} onValueChange={(value) => handleSelectChange('teacherId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">Day</label>
        <Select name="day" value={formData.day} onValueChange={(value) => handleSelectChange('day', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
        <Input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
        <Input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Schedule</Button>
      </div>
    </form>
  );
};

export default function ScheduleManagementPage() {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // NOTE: /api/courses is a placeholder and needs to be created.
      const [schedulesRes, usersRes, coursesRes] = await Promise.all([
        fetch('/api/schedules'),
        fetch('/api/users'),
        fetch('/api/courses').catch(() => ({ ok: true, json: () => Promise.resolve({ courses: [] }) })) // Mock courses for now
      ]);

      if (!schedulesRes.ok) throw new Error('Failed to fetch schedules');
      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const schedulesData = await schedulesRes.json();
      const usersData = await usersRes.json();
      const coursesData = await coursesRes.json();
      
      setSchedules(schedulesData.schedules || []);
      setUsers(usersData.users || []);
      setCourses(coursesData.courses || []);

    } catch (error) {
      toast({ title: 'Error fetching data', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSchedule = async (newScheduleData) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScheduleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add schedule');
      }
      toast({ title: 'Success', description: 'Schedule added successfully.' });
      setAddModalOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const handleUpdateSchedule = async (updatedScheduleData) => {
    try {
      const response = await fetch(`/api/schedules/${updatedScheduleData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedScheduleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update schedule');
      }
      toast({ title: 'Success', description: 'Schedule updated successfully.' });
      setEditModalOpen(false);
      setSelectedSchedule(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };  

  const openDeleteAlert = (schedule) => {
    setScheduleToDelete(schedule);
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      const response = await fetch(`/api/schedules/${scheduleToDelete.id}`, {
        method: 'DELETE',
      });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete schedule');
      }
      toast({ title: 'Success', description: 'Schedule deleted successfully.' });
      setScheduleToDelete(null);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const scheduleDisplayData = useMemo(() => {
    return schedules.map(schedule => ({
      ...schedule,
      courseName: courses.find(c => c.id === schedule.courseId)?.name || 'N/A',
      teacherName: users.find(u => u.id === schedule.teacherId)?.name || 'N/A',
    }));
  }, [schedules, courses, users]);

  const teachers = useMemo(() => users.filter(u => u.role?.toLowerCase() === 'teacher'), [users]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Schedule</DialogTitle></DialogHeader>
          <ScheduleForm onSave={handleAddSchedule} onCancel={() => setAddModalOpen(false)} courses={courses} teachers={teachers} />
        </DialogContent>
      </Dialog>
      
      {selectedSchedule && (
        <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Schedule</DialogTitle></DialogHeader>
            <ScheduleForm schedule={selectedSchedule} onSave={handleUpdateSchedule} onCancel={() => setEditModalOpen(false)} courses={courses} teachers={teachers} />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!scheduleToDelete} onOpenChange={() => setScheduleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the schedule.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
          <p className="text-gray-500">Manage course and teacher schedules.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-700">All Schedules</CardTitle>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleDisplayData.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">No schedules found.</TableCell></TableRow>
                ) : scheduleDisplayData.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.courseName}</TableCell>
                    <TableCell>{schedule.teacherName}</TableCell>
                    <TableCell>{schedule.day}</TableCell>
                    <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditSchedule(schedule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => openDeleteAlert(schedule)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
