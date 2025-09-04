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
import AddUserModal from '@/components/features/auth/add-user-modal';
import EditUserModal from '@/components/features/auth/EditUserModal';


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
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'head':
        return 'bg-primary text-primary-foreground';
      case 'mazer':
        return 'bg-yellow-500 text-white'; // No direct mapping, leaving as is for now
      case 'assistant':
        return 'bg-secondary text-secondary-foreground';
      case 'teacher':
        return 'bg-blue-500 text-white'; // No direct mapping, leaving as is for now
      case 'staff':
        return 'bg-green-500 text-white'; // No direct mapping, leaving as is for now
      default:
        return 'bg-muted text-muted-foreground';
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
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      <AlertDialogAction onClick={handleDeleteUser} variant="destructive">Delete</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
          <a href="/dashboard/admin/tasks" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
          </a>
          <header className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-bold">Manage all users in the system</h1>
              </div>
          </header>
          <Card>
              <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                      <div className="flex items-center gap-2">
                          <div className="relative flex-1 md:w-auto">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                              <SelectContent>
                                  <SelectItem value="all">All Roles</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="head">Head</SelectItem>
                                  <SelectItem value="mazer">Mazer</SelectItem>
                                  <SelectItem value="assistant">Assistant</SelectItem>
                                  <SelectItem value="teacher">Teacher</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                              </SelectContent>
                          </Select>
                          <Button onClick={() => setAddModalOpen(true)}>
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
                                  <TableHead className="font-semibold text-foreground">ID</TableHead>
                                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                                  <TableHead className="font-semibold text-foreground">Role</TableHead>
                                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {paginatedUsers.length === 0 ? (
                                  <TableRow>
                                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                          No users found.
                                      </TableCell>
                                  </TableRow>
                              ) : (
                                  paginatedUsers.map((user) => (
                                      <TableRow key={user.id}>
                                          <TableCell className="font-medium text-foreground">{user.uniqueId}</TableCell>
                                          <TableCell className="text-foreground">{user.name}</TableCell>
                                          <TableCell className="text-foreground">{user.email}</TableCell>
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
                                                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteAlert(user)}>
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
                              className="text-primary"
                          >
                              Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                              Page {currentPage} of {totalPages}
                          </span>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="text-primary"
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