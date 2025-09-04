import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/contexts/DataContext";
import { useNotifications } from "@/contexts/NotificationContext";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Upload, FileText, Download, Trash2, CheckCircle, AlertCircle, Calendar, Clock, User as UserIcon, Mail, Building, GraduationCap, TrendingUp, Clock as TimeIcon, Plus, Filter, ChevronDown, ChevronUp } from "lucide-react";

export default function TeacherDashboard({ user }) {
  const { showNotification } = useNotifications();
  const {
    leaveRequests,
    attendance,
    cvFiles,
    submitLeaveRequest,
    uploadCV,
    downloadCV,
    deleteCV,
    isLoading
  } = useData();

  if (!user) return <div className="text-center py-10">Loading user info...</div>;

  // Component state
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    error: '',
    submitting: false,
  });

  const [cvFile, setCvFile] = useState(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvUploadError, setCvUploadError] = useState("");
  const [cvUploadSuccess, setCvUploadSuccess] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [expandedLeaveRequestId, setExpandedLeaveRequestId] = useState(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');

  // Load user's CV file on mount
  useEffect(() => {
    const userCvFile = cvFiles.find(cv => cv.userId === user.id);
    setCvFile(userCvFile || null);
  }, [cvFiles, user.id]);

  // Get user's data from context
  const userLeaveRequests = leaveRequests.filter(req => req.userId === user.id);
  const userAttendance = attendance.filter(att => att.userId === user.id);

  // Get attendance for selected month
  const monthlyAttendance = userAttendance.filter((att) => {
    const attDate = new Date(att.date);
    const [year, month] = selectedMonth.split('-');
    return attDate.getFullYear() === parseInt(year) && 
           (attDate.getMonth() + 1) === parseInt(month);
  });

  // Calculate attendance stats
  const attendanceStats = {
    totalDays: monthlyAttendance.length,
    presentDays: monthlyAttendance.filter((att) => att.status === 'present').length,
    absentDays: monthlyAttendance.filter((att) => att.status === 'absent').length,
    lateDays: monthlyAttendance.filter((att) => att.status === 'late').length,
  };

  // Month options for attendance filter
  const monthOptions = (() => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.push({ value, label });
    }
    return months;
  })();

  // Filter leave requests based on status
  const filteredLeaveRequests = userLeaveRequests.filter(req => {
    if (historyStatusFilter === 'all') return true;
    return req.status === historyStatusFilter;
  });

  // Determine how many to show
  const displayedRequests = showAllHistory ? filteredLeaveRequests : filteredLeaveRequests.slice(0, 3);

  // Submit leave request
  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault();
    if (!form.leaveType || !form.startDate || !form.endDate || !form.reason) {
      setForm(prev => ({ ...prev, error: 'All fields are required' }));
      return;
    }

    setForm(prev => ({ ...prev, submitting: true, error: '' }));
    try {
      await submitLeaveRequest({
        userId: user.id,
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        type: form.leaveType
      });
      
      setForm({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        error: '',
        submitting: false,
      });
      
      showNotification({
        title: "Success",
        message: "Leave request submitted successfully",
        type: "success"
      });
    } catch (error) {
      setForm(prev => ({ ...prev, error: error.message || 'Failed to submit leave request', submitting: false }));
    }
  };

  // CV upload handler
  const handleCvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setCvUploadError("File size must be less than 10MB");
      return;
    }

    setUploadingCv(true);
    setCvUploadError("");
    setCvUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCvFile(data);
        setCvUploadSuccess(true);
        setShowUploadArea(false);
        setTimeout(() => setCvUploadSuccess(false), 3000);
      } else {
        const error = await response.json();
        setCvUploadError(error.message || 'Failed to upload CV');
      }
    } catch (error) {
      setCvUploadError('Failed to upload CV. Please try again.');
    } finally {
      setUploadingCv(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        setCvUploadError("File size must be less than 10MB");
        return;
      }

      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadingCv(true);
    setCvUploadError("");
    setCvUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCvFile(data);
        setCvUploadSuccess(true);
        setShowUploadArea(false);
        setTimeout(() => setCvUploadSuccess(false), 3000);
      } else {
        const error = await response.json();
        setCvUploadError(error.message || 'Failed to upload CV');
      }
    } catch (error) {
      setCvUploadError('Failed to upload CV. Please try again.');
    } finally {
      setUploadingCv(false);
    }
  };

  // Delete CV file
  const handleDeleteCv = async () => {
    if (!cvFile) return;
    
    if (!window.confirm('Are you sure you want to delete your CV?')) return;

    try {
      await deleteCV(cvFile.id);
      setCvFile(null);
    } catch (error) {
      setCvUploadError('Failed to delete CV');
    }
  };

  // Download CV file
  const handleDownloadCv = async () => {
    if (!cvFile) return;

    try {
      await downloadCV(cvFile.id);
    } catch (error) {
      setCvUploadError('Failed to download CV');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        title="Teacher Dashboard"
        subtitle={`Welcome back, ${user.name}!`}
        borderColor="border-primary"
        bgColor="bg-card/80 backdrop-blur-sm shadow-sm"
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Row - Profile, Stats, and CV */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="card-modern shadow-modern-lg border-0 overflow-hidden animate-fade-in">
            <div className="bg-gradient-primary p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30 shadow-modern">
                  {user.name?.split(' ').map(n => n[0]).join('') || 'NA'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary-foreground">{user.name}</h2>
                  <p className="text-primary-foreground/80 text-sm flex items-center mt-1">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {user.department} Teacher
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                  <UserIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Staff ID</p>
                    <p className="font-semibold text-foreground">{user.uniqueId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                  <Building className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Department</p>
                    <p className="font-semibold text-foreground">{user.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                  <TimeIcon className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-muted-foreground text-xs">Schedule</p>
                    <p className="font-semibold text-foreground">{user.schedule || 'Flexible'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                  <Mail className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-semibold text-foreground">{user.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Stats */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="bg-gradient-success p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3" />
                Attendance Overview
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-xl">
                  <div className="text-3xl font-bold text-success mb-1">{attendanceStats.presentDays}</div>
                  <div className="text-sm text-muted-foreground font-medium">Present</div>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-xl">
                  <div className="text-3xl font-bold text-destructive mb-1">{attendanceStats.absentDays}</div>
                  <div className="text-sm text-muted-foreground font-medium">Absent</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-xl">
                  <div className="text-3xl font-bold text-warning mb-1">{attendanceStats.lateDays}</div>
                  <div className="text-sm text-muted-foreground font-medium">Late</div>
                </div>
              </div>
              <div className="mt-4 text-center p-3 bg-muted rounded-xl">
                <div className="text-lg font-semibold text-foreground">Total: {attendanceStats.totalDays} days</div>
              </div>
            </CardContent>
          </Card>

          {/* CV Status */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-warning p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 mr-3" />
                CV Status
              </h2>
            </div>
            <CardContent className="p-6">
              {cvFile ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-modern">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">CV Uploaded</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cvFile.originalName}</p>
                  <div className="flex space-x-3">
                    <Button size="sm" onClick={handleDownloadCv} className="btn-modern bg-gradient-success text-white flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDeleteCv} className="btn-modern">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {!showUploadArea ? (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-modern">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No CV Uploaded</h3>
                      <p className="text-sm text-muted-foreground mb-6">Upload your CV to get started</p>
                      <Button 
                        size="sm" 
                        className="btn-modern bg-gradient-warning text-white w-full" 
                        onClick={() => setShowUploadArea(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CV
                      </Button>
                      <p className="text-xs text-muted-foreground mt-3">Supports any file type (max 10MB)</p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div
                        className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                          dragActive 
                            ? 'border-orange-400 bg-orange-50 shadow-modern' 
                            : 'border-gray-300 bg-muted'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="text-center">
                          <Upload className={`w-10 h-10 mx-auto mb-4 ${
                            dragActive ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {dragActive ? 'Drop your file here' : 'Drag and drop your CV here'}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-6">or</p>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="*/*"
                              onChange={handleCvUpload}
                              className="hidden"
                              disabled={uploadingCv}
                            />
                            <Button 
                              size="sm" 
                              className="btn-modern bg-gradient-warning text-white"
                              disabled={uploadingCv}
                            >
                              {uploadingCv ? (
                                <>
                                  <div className="spinner-modern w-4 h-4 mr-2"></div>
                                  Uploading...
                                </>
                              ) : (
                                'Choose File'
                              )}
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-3">Supports any file type (max 10MB)</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowUploadArea(false)}
                        className="w-full text-muted-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {cvUploadError && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                  {cvUploadError}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Row - Attendance and Leave Request */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance History */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-primary p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  Attendance History
                </h2>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  {monthOptions.map(m => (
                    <option key={m.value} value={m.value} className="text-foreground">{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="max-h-80 overflow-y-auto space-y-3">
                {monthlyAttendance.length > 0 ? (
                  monthlyAttendance.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-accent transition-colors">
                      <span className="font-medium text-foreground">{att.date}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        att.status === 'present' ? 'bg-success/10 text-success' :
                        att.status === 'absent' ? 'bg-destructive/10 text-destructive' :
                        att.status === 'late' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No attendance records found</p>
                    <p className="text-sm">for this month.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leave Request Form */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-destructive p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-6 h-6 mr-3" />
                Request Leave
              </h2>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitLeaveRequest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="leaveType" className="text-sm font-semibold text-foreground">Leave Type</label>
                    <Select onValueChange={(value) => setForm(prev => ({ ...prev, leaveType: value }))} value={form.leaveType}>
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="text-sm font-semibold text-foreground">Start Date</label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="text-sm font-semibold text-foreground">End Date</label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="reason" className="text-sm font-semibold text-foreground">Reason</label>
                    <Textarea
                      id="reason"
                      placeholder="Provide a brief reason for your leave..."
                      value={form.reason}
                      onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                
                {form.error && (
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm text-destructive">
                    {form.error}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={form.submitting} 
                    className="btn-modern bg-gradient-destructive text-white px-6 py-3 rounded-xl text-base font-semibold shadow-modern hover:shadow-modern-lg"
                  >
                    {form.submitting ? (
                      <>
                        <div className="spinner-modern w-5 h-5 mr-3"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="bg-gradient-warning p-6">
              <h2 className="text-xl font-bold text-primary-foreground">Pending Leave Requests</h2>
            </div>
            <CardContent className="p-6">
              {userLeaveRequests.filter(req => req.status === 'pending').length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {userLeaveRequests.filter(req => req.status === 'pending').map(lr => (
                    <div key={lr.id} className="bg-gradient-to-r from-warning/10 to-orange-500/10 p-4 rounded-xl border border-warning/20 shadow-modern">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-base capitalize">{lr.leaveType} Leave</h3>
                        <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-semibold">Pending</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lr.startDate} to {lr.endDate}</p>
                      <p className="text-sm text-muted-foreground">Reason: {lr.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-modern">
                    <CheckCircle className="w-8 h-8 text-warning" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">All your leave requests have been processed.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card className="card-modern shadow-modern-lg border-0 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="bg-gradient-info p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-foreground">Leave History</h2>
                <select
                  value={historyStatusFilter}
                  onChange={e => setHistoryStatusFilter(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="all" className="text-foreground">All Status</option>
                  <option value="approved" className="text-foreground">Approved</option>
                  <option value="rejected" className="text-foreground">Rejected</option>
                  <option value="pending" className="text-foreground">Pending</option>
                </select>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="max-h-80 overflow-y-auto space-y-4">
                {displayedRequests.length > 0 ? (
                  displayedRequests.map(lr => (
                    <div key={lr.id} className="p-4 bg-muted rounded-xl border hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-base capitalize">{lr.leaveType} Leave</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          lr.status === 'approved' ? 'bg-success/10 text-success' :
                          lr.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lr.startDate} to {lr.endDate}</p>
                      <p className="text-sm text-muted-foreground">Reason: {lr.reason}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No leave requests found</p>
                    <p className="text-sm">matching your filter criteria.</p>
                  </div>
                )}
              </div>
              
              {filteredLeaveRequests.length > 3 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showAllHistory ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show All ({filteredLeaveRequests.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
