// Mock API functions for development

// Mock users data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'IT',
    email: 'admin@university.edu',
    phone: '1234567890'
  },
  // Add more mock users as needed
];

// Mock attendance data
const mockAttendance = [
  {
    id: '1',
    userId: '1',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '08:00',
    checkOut: '17:00'
  },
  // Add more mock attendance records as needed
];

// Mock leave requests
const mockLeaveRequests = [
  {
    id: '1',
    userId: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reason: 'Sick leave',
    status: 'pending'
  },
  // Add more mock leave requests as needed
];

// Mock schedules
const mockSchedules = [
  {
    id: '1',
    userId: '1',
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Main Campus'
  },
  // Add more mock schedules as needed
];

// Mock CV files
const mockCvFiles = [
  {
    id: '1',
    userId: '1',
    filename: 'cv.pdf',
    url: '/files/cv.pdf',
    uploadedAt: new Date().toISOString()
  },
  // Add more mock CV files as needed
];

// Mock API functions
export const mockAPI = {
  // User related functions
  login: async (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { ...user, password: undefined }; // Don't return password
  },

  getCurrentUser: async () => {
    // In a real app, this would check the session/token
    return mockUsers[0];
  },

  // Attendance related functions
  getAttendance: async (userId, date) => {
    return mockAttendance.filter(a => a.userId === userId && a.date === date);
  },

  markAttendance: async (userId, status) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = mockAttendance.find(a => a.userId === userId && a.date === today);
    
    if (existing) {
      // Update existing record
      Object.assign(existing, { status, updatedAt: new Date().toISOString() });
      return existing;
    } else {
      // Create new record
      const newRecord = {
        id: `att-${mockAttendance.length + 1}`,
        userId,
        date: today,
        status,
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockAttendance.push(newRecord);
      return newRecord;
    }
  },

  // Leave request functions
  getLeaveRequests: async (userId) => {
    if (userId) {
      return mockLeaveRequests.filter(req => req.userId === userId);
    }
    return [...mockLeaveRequests];
  },

  createLeaveRequest: async (data) => {
    const newRequest = {
      id: `leave-${mockLeaveRequests.length + 1}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockLeaveRequests.push(newRequest);
    return newRequest;
  },

  updateLeaveRequest: async (id, updates) => {
    const index = mockLeaveRequests.findIndex(req => req.id === id);
    if (index === -1) throw new Error('Leave request not found');
    
    mockLeaveRequests[index] = {
      ...mockLeaveRequests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockLeaveRequests[index];
  },

  // Schedule functions
  getSchedules: async (userId) => {
    if (userId) {
      return mockSchedules.filter(s => s.userId === userId);
    }
    return [...mockSchedules];
  },

  // CV Files functions
  getCvFiles: async (userId) => {
    if (userId) {
      return mockCvFiles.filter(cv => cv.userId === userId);
    }
    return [...mockCvFiles];
  },

  uploadCv: async (userId, file) => {
    const newCv = {
      id: `cv-${mockCvFiles.length + 1}`,
      userId,
      filename: file.name,
      url: `/files/${Date.now()}-${file.name}`,
      uploadedAt: new Date().toISOString()
    };
    mockCvFiles.push(newCv);
    return newCv;
  },

  // Utility function to reset mock data (for testing)
  _reset: () => {
    // In a real implementation, this would reset the mock data
    console.log('Mock data reset');
  }
};

export default mockAPI;
