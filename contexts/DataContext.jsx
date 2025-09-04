import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAPI } from '../data/mockAPI';
import { useNotifications } from './NotificationContext';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [cvFiles, setCvFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotifications();

  // User management
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await mockAPI.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await mockAPI.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      showNotification('User created successfully', 'success');
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification('Failed to create user', 'error');
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await mockAPI.updateUser(id, userData);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      showNotification('User updated successfully', 'success');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Failed to update user', 'error');
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await mockAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Failed to delete user', 'error');
    }
  };

  // Attendance management
  const fetchAttendance = async (filters) => {
    setIsLoading(true);
    try {
      const fetchedAttendance = await mockAPI.getAttendance(filters);
      setAttendance(fetchedAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      showNotification('Failed to fetch attendance', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendance = async (data) => {
    try {
      const newAttendance = await mockAPI.markAttendance(data);
      setAttendance(prev => {
        // Remove existing attendance for same user and date, then add new one
        const filtered = prev.filter(a => !(a.userId === data.userId && a.date === data.date));
        return [...filtered, newAttendance];
      });
      showNotification('Attendance marked successfully', 'success');
    } catch (error) {
      console.error('Error marking attendance:', error);
      showNotification('Failed to mark attendance', 'error');
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      return await mockAPI.getTodayAttendance();
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      showNotification('Failed to fetch today attendance', 'error');
      return [];
    }
  };

  // Leave request management
  const fetchLeaveRequests = async (userId) => {
    setIsLoading(true);
    try {
      const fetchedRequests = await mockAPI.getLeaveRequests(userId);
      setLeaveRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      showNotification('Failed to fetch leave requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const submitLeaveRequest = async (data) => {
    try {
      const newRequest = await mockAPI.submitLeaveRequest(data);
      setLeaveRequests(prev => [...prev, newRequest]);
      showNotification('Leave request submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      showNotification('Failed to submit leave request', 'error');
    }
  };

  const approveLeaveRequest = async (id, respondedBy) => {
    try {
      const updatedRequest = await mockAPI.approveLeaveRequest(id, respondedBy);
      setLeaveRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      showNotification('Leave request approved', 'success');
    } catch (error) {
      console.error('Error approving leave request:', error);
      showNotification('Failed to approve leave request', 'error');
    }
  };

  const rejectLeaveRequest = async (id, respondedBy, rejectionReason) => {
    try {
      const updatedRequest = await mockAPI.rejectLeaveRequest(id, respondedBy, rejectionReason);
      setLeaveRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      showNotification('Leave request rejected', 'success');
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      showNotification('Failed to reject leave request', 'error');
    }
  };

  // Schedule management
  const fetchSchedules = async (filters) => {
    setIsLoading(true);
    try {
      const fetchedSchedules = await mockAPI.getSchedules(filters);
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      showNotification('Failed to fetch schedules', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const createSchedule = async (data) => {
    try {
      const newSchedule = await mockAPI.createSchedule(data);
      setSchedules(prev => [...prev, newSchedule]);
      showNotification('Schedule created successfully', 'success');
    } catch (error) {
      console.error('Error creating schedule:', error);
      showNotification('Failed to create schedule', 'error');
    }
  };

  const updateSchedule = async (id, data) => {
    try {
      const updatedSchedule = await mockAPI.updateSchedule(id, data);
      setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
      showNotification('Schedule updated successfully', 'success');
    } catch (error) {
      console.error('Error updating schedule:', error);
      showNotification('Failed to update schedule', 'error');
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await mockAPI.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      showNotification('Schedule deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showNotification('Failed to delete schedule', 'error');
    }
  };

  // CV management
  const uploadCV = async (file, userId) => {
    try {
      const newCV = await mockAPI.uploadCV(file, userId);
      setCvFiles(prev => {
        // Remove existing CV for user, then add new one
        const filtered = prev.filter(cv => cv.userId !== userId);
        return [...filtered, newCV];
      });
      showNotification('CV uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading CV:', error);
      showNotification('Failed to upload CV', 'error');
    }
  };

  const fetchCV = async (userId) => {
    try {
      return await mockAPI.getCV(userId);
    } catch (error) {
      console.error('Error fetching CV:', error);
      showNotification('Failed to fetch CV', 'error');
      return null;
    }
  };

  const downloadCV = async (id) => {
    try {
      const result = await mockAPI.downloadCV(id);
      showNotification(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      console.error('Error downloading CV:', error);
      showNotification('Failed to download CV', 'error');
    }
  };

  const deleteCV = async (id) => {
    try {
      await mockAPI.deleteCV(id);
      setCvFiles(prev => prev.filter(cv => cv.id !== id));
      showNotification('CV deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting CV:', error);
      showNotification('Failed to delete CV', 'error');
    }
  };

  // Statistics
  const fetchStats = async () => {
    try {
      const fetchedStats = await mockAPI.getStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showNotification('Failed to fetch statistics', 'error');
    }
  };

  const fetchDepartmentSummary = async () => {
    try {
      return await mockAPI.getDepartmentSummary();
    } catch (error) {
      console.error('Error fetching department summary:', error);
      showNotification('Failed to fetch department summary', 'error');
      return [];
    }
  };

  const value = {
    // Data
    users,
    attendance,
    leaveRequests,
    schedules,
    cvFiles,
    stats,
    
    // Loading states
    isLoading,
    
    // User management
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Attendance management
    fetchAttendance,
    markAttendance,
    fetchTodayAttendance,
    
    // Leave request management
    fetchLeaveRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    
    // Schedule management
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    
    // CV management
    uploadCV,
    fetchCV,
    downloadCV,
    deleteCV,
    
    // Statistics
    fetchStats,
    fetchDepartmentSummary,
    
    // Notifications
    showNotification
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
