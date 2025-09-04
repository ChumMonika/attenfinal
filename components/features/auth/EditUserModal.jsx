'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

export default function EditUserModal({ user, open, onOpenChange, onUserUpdated }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'staff',
        department: user.department || '',
      });
    } else {
      // Reset form if no user is passed (e.g., when modal closes)
      setFormData({ name: '', email: '', role: 'staff', department: '' });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const response = await apiRequest('PUT', `/api/users/${user.id}`, formData);
      if (response.ok) {
        toast({ title: 'Success', description: 'User updated successfully.' });
        onUserUpdated();
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.message || 'Failed to update user.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the details for {user?.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={handleRoleChange} value={formData.role || 'staff'}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
                <SelectItem value="mazer">Mazer</SelectItem>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={formData.department || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
