'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, UserPlus, MoreHorizontal, Edit, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// AddUserModal component, updated based on your recommendation
const AddUserModal = ({ open, onOpenChange, onUserAdded }) => {
    const { toast } = useToast();
    const [uniqueId, setUniqueId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('active'); // Default status
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setUniqueId('');
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
        setStatus('active');
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uniqueId || !name || !email || !password || !role || !status) {
            toast({
                title: 'Missing Fields',
                description: 'Please fill out all required fields.',
                variant: 'destructive',
            });
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Submitting new user:', { uniqueId, name, email, role, status });
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            toast({
                title: 'Success!',
                description: `User "${name}" has been created successfully.`,
                className: 'bg-green-500 text-white',
            });
            onUserAdded(); 
            handleClose(); 
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Create a New User
                    </h3>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleClose} disabled={isSubmitting}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                         <div>
                            <label htmlFor="uniqueId" className="block mb-2 text-sm font-medium text-gray-700">Unique ID</label>
                            <Input id="uniqueId" placeholder="e.g., USR-005" value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} required disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                            <Input id="name" placeholder="e.g., John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <Input id="email" type="email" placeholder="e.g., name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                            <Select onValueChange={setRole} value={role} disabled={isSubmitting}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="head">Head</SelectItem>
                                    <SelectItem value="mazer">Mazer</SelectItem>
                                    <SelectItem value="assistant">Assistant</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                             <Select onValueChange={setStatus} value={status} disabled={isSubmitting}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                        <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// EditUserModal updated to be consistent with AddUserModal
const EditUserModal = ({ open, onOpenChange, user, onUserUpdated }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', role: '', status: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                status: user.status || 'active',
            });
        }
    }, [user]);

    const handleClose = () => {
        onOpenChange(false);
    };
    
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSelectChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.role || !formData.status) {
            toast({ title: 'Missing Fields', description: 'Please fill out all required fields.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Updating user:', { id: user.id, ...formData });
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'Success!',
                description: `User "${formData.name}" has been updated.`,
                className: 'bg-green-500 text-white',
            });
            onUserUpdated();
            handleClose();
        } catch (error) {
            toast({ title: 'Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Edit User: <span className="text-teal-600">{user?.name}</span>
                    </h3>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleClose} disabled={isSubmitting}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="uniqueId" className="block mb-2 text-sm font-medium text-gray-700">Unique ID</label>
                            <Input id="uniqueId" value={user?.uniqueId || ''} readOnly disabled className="bg-gray-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                            <Input id="name" value={formData.name} onChange={handleInputChange} required disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required disabled={isSubmitting} />
                        </div>
                         <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                            <Select onValueChange={(value) => handleSelectChange('role', value)} value={formData.role} disabled={isSubmitting}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="head">Head</SelectItem>
                                    <SelectItem value="mazer">Mazer</SelectItem>
                                    <SelectItem value="assistant">Assistant</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                            <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status} disabled={isSubmitting}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t rounded-b">
                        <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ... (previous imports remain the same)

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const fetchUsers = async () => {
      setLoading(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUsers = [
              { id: 1, uniqueId: 'USR-001', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
              { id: 2, uniqueId: 'USR-002', name: 'Teacher One', email: 'teacher1@example.com', role: 'teacher', status: 'active' },
              { id: 3, uniqueId: 'USR-003', name: 'Staff Member', email: 'staff@example.com', role: 'staff', status: 'inactive' },
              { id: 4, uniqueId: 'USR-004', name: 'Head Dept', email: 'head@example.com', role: 'head', status: 'active' },
          ];
          setUsers(mockUsers);
      } catch (error) {
          toast({ title: 'Error', description: "Failed to fetch users", variant: 'destructive' });
          setUsers([]);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  const handleUserAdded = () => fetchUsers(); 
  const handleUserUpdated = () => fetchUsers();

  const openEditModal = (user) => {
      setSelectedUser(user);
      setEditModalOpen(true);
  };

  const openDeleteAlert = (user) => {
      setUserToDelete(user);
  };

  const handleDeleteUser = async () => {
      if (!userToDelete) return;
      toast({ title: 'Success (Mock)', description: `User ${userToDelete.name} would be deleted.` });
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
  };

  const getRoleBadgeClass = (role) => {
      const lowerCaseRole = role?.toLowerCase();
      switch (lowerCaseRole) {
          case 'admin': return 'bg-red-500 text-white';
          case 'head': return 'bg-purple-500 text-white';
          case 'mazer': return 'bg-yellow-500 text-white';
          case 'assistant': return 'bg-gray-500 text-white';
          case 'teacher': return 'bg-blue-500 text-white';
          case 'staff': return 'bg-green-500 text-white';
          default: return 'bg-gray-200 text-gray-800';
      }
  };

  const filteredUsers = useMemo(() => {
      return users.filter(user =>
          (roleFilter === 'all' || user.role?.toLowerCase() === roleFilter) &&
          ((user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
              (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
              (user.uniqueId?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
      );
  }, [users, searchTerm, roleFilter]);

  const paginatedUsers = filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
      );
  }

  return (
      <div className="space-y-6">
          <AddUserModal open={isAddModalOpen} onOpenChange={setAddModalOpen} onUserAdded={handleUserAdded} />
          {selectedUser && <EditUserModal user={selectedUser} open={isEditModalOpen} onOpenChange={setEditModalOpen} onUserUpdated={handleUserUpdated} />}
          <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the account for {userToDelete?.name}.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
          <a href="/dashboard/admin/tasks" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
          </a>
          <header className="bg-teal-700 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-bold">Manage all users in the system</h1>
              </div>
          </header>
          <Card>
              <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle className="font-bold text-teal-700">All Users ({filteredUsers.length})</CardTitle>
                      <div className="flex items-center gap-2">
                          <div className="relative flex-1 md:w-auto">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-teal-700" />
                              <Input
                                  placeholder="Search by ID, name, or email..."
                                  className="pl-8"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                              />
                          </div>
                          <Select value={roleFilter} onValueChange={setRoleFilter}>
                              <SelectTrigger className="w-full md:w-[180px]">
                                  <SelectValue placeholder="Filter by role" />
                              </SelectTrigger>
                              <SelectContent className="text-teal-700">
                                  <SelectItem value="all">All Roles</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="head">Head</SelectItem>
                                  <SelectItem value="mazer">Mazer</SelectItem>
                                  <SelectItem value="assistant">Assistant</SelectItem>
                                  <SelectItem value="teacher">Teacher</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                              </SelectContent>
                          </Select>
                          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setAddModalOpen(true)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add User
                          </Button>
                      </div>
                  </div>
              </CardHeader>
              <CardContent>
                  <div className="rounded-md border">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="font-semibold text-teal-700">ID</TableHead>
                                  <TableHead className="font-semibold text-teal-700">Name</TableHead>
                                  <TableHead className="font-semibold text-teal-700">Email</TableHead>
                                  <TableHead className="font-semibold text-teal-700">Role</TableHead>
                                  <TableHead className="font-semibold text-teal-700">Status</TableHead>
                                  <TableHead className="text-right font-semibold text-teal-700">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {paginatedUsers.length === 0 ? (
                                  <TableRow>
                                      <TableCell colSpan={6} className="text-center text-teal-700 py-8">
                                          No users found.
                                      </TableCell>
                                  </TableRow>
                              ) : (
                                  paginatedUsers.map((user) => (
                                      <TableRow key={user.id}>
                                          <TableCell className="font-medium text-gray-800">{user.uniqueId}</TableCell>
                                          <TableCell className="text-gray-800">{user.name}</TableCell>
                                          <TableCell className="text-gray-800">{user.email}</TableCell>
                                          <TableCell>
                                              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                                          </TableCell>
                                          <TableCell>
                                              <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className="capitalize">{user.status}</Badge>
                                          </TableCell>
                                          <TableCell className="text-right">
                                              <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                                          <span className="sr-only">Open menu</span>
                                                          <MoreHorizontal className="h-4 w-4" />
                                                      </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                      <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                          <Edit className="mr-2 h-4 w-4" />
                                                          <span>Edit</span>
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem className="text-red-600" onClick={() => openDeleteAlert(user)}>
                                                          <Trash2 className="mr-2 h-4 w-4" />
                                                          <span>Delete</span>
                                                      </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                              </DropdownMenu>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              )}
                          </TableBody>
                      </Table>
                  </div>
                  {totalPages > 1 && (
                      <div className="flex items-center justify-end space-x-2 py-4">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                              disabled={currentPage === 1}
                              className="text-teal-700"
                          >
                              Previous
                          </Button>
                          <span className="text-sm text-teal-700">
                              Page {currentPage} of {totalPages}
                          </span>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="text-teal-700"
                          >
                              Next
                          </Button>
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>
  );
}