"use client"

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    uniqueId: "",
    email: "",
    password: "",
    role: "",
    department: "",
    workType: "",
    schedule: "",
    subject: "",
  });

  const createUserMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/user", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
      onClose();
      if (onUserAdded) {
        onUserAdded();
      }
      setFormData({
        name: "",
        uniqueId: "",
        email: "",
        password: "",
        role: "",
        department: "",
        workType: "",
        schedule: "",
        subject: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.uniqueId || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Set default password if not provided
    const submitData = {
      ...formData,
      password: formData.password || "password123",
      status: "active",
    };

    createUserMutation.mutate(submitData);
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Set default values based on role
    if (role === "teacher") {
      setFormData(prev => ({ 
        ...prev, 
        role,
        schedule: "08:00-16:00",
        workType: "Full-Time"
      }));
    } else if (role === "staff") {
      setFormData(prev => ({ 
        ...prev, 
        role,
        schedule: "08:00-17:00",
        workType: "Full-Time"
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        role,
        schedule: "08:00-17:00",
        workType: "Full-Time",
        subject: ""
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Add New User</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="uniqueId">
              User ID *
            </Label>
            <Input
              id="uniqueId"
              type="text"
              placeholder="e.g., T001, S001"
              value={formData.uniqueId}
              onChange={(e) => setFormData(prev => ({ ...prev, uniqueId: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="email">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@university.edu"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="password">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="role">
              Role *
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mazer">Mazer</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">
              Department
            </Label>
            <Input
              id="department"
              type="text"
              placeholder="e.g., Mathematics, IT Support"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          {formData.role === "teacher" && (
            <div>
              <Label htmlFor="subject">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="e.g., Mathematics, English"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                disabled={createUserMutation.isPending}
              />
            </div>
          )}

          <div>
            <Label htmlFor="schedule">
              Schedule
            </Label>
            <Input
              id="schedule"
              type="text"
              placeholder="e.g., 08:00-17:00"
              value={formData.schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
              disabled={createUserMutation.isPending}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
