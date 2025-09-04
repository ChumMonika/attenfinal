import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Badge } from "../../../ui/badge";
import { useToast } from "../../../../hooks/use-toast";
import { useData } from "../../../../contexts/DataContext";
import DashboardHeader from "../../../layout/dashboard-header";
import { UserCheck, UserX, CalendarMinus, Clock, Building2, Filter, FileText, Download, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../ui/dialog";
import { Textarea } from "../../../ui/textarea";
import { Label } from "../../../ui/label";

export default function HeadDashboard({ user }) {
  const { toast } = useToast();
  const {
    stats,
    attendance,
    leaveRequests,
    cvFiles,
    fetchStats,
    fetchAttendance,
    fetchLeaveRequests,
    fetchDepartmentSummary,
    approveLeaveRequest,
    rejectLeaveRequest,
    downloadCV,
    isLoading
  } = useData();
  
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCvFile, setSelectedCvFile] = useState(null);
  const [isCvDialogOpen, setIsCvDialogOpen] = useState(false);
  const [departmentSummary, setDepartmentSummary] = useState([]);

  // Load data on component mount
  useEffect(() => {
    fetchStats();
    fetchLeaveRequests();
    fetchAttendance({ department: selectedDepartment === "all" ? undefined : selectedDepartment });
    fetchDepartmentSummary().then(setDepartmentSummary);
  }, []);

  // Refetch attendance when department changes
  useEffect(() => {
    fetchAttendance({ department: selectedDepartment === "all" ? undefined : selectedDepartment });
  }, [selectedDepartment]);

  // Handle leave request approval
  const handleApproveLeave = async (requestId) => {
    try {
      await approveLeaveRequest(requestId, user.id);
      toast({
        title: "Success",
        description: "Leave request approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    }
  };

  // Handle leave request rejection
  const handleRejectLeave = async () => {
    if (!selectedRequest) return;
    
    try {
      await rejectLeaveRequest(selectedRequest.id, user.id, rejectionReason);
      setIsRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Leave request rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    }
  };

  // Handle CV download
  const handleDownloadCV = async (cvFile) => {
    try {
      await downloadCV(cvFile.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download CV",
        variant: "destructive",
      });
    }
  };

  // Handle CV view
  const handleViewCV = (cvFile) => {
    setSelectedCvFile(cvFile);
    setIsCvDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-modern w-12 h-12 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <DashboardHeader 
        user={user}
        title="Head Dashboard"
        subtitle="Manage university staff and oversee operations"
        borderColor="border-purple-600"
        bgColor="bg-purple-600"
      />
      
      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-modern shadow-modern border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Staff</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern shadow-modern border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.attendanceToday || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern shadow-modern border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.pendingLeaveRequests || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern shadow-modern border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-3xl font-bold text-purple-600">{departmentSummary?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card className="card-modern shadow-modern border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests?.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-gray-900">{request.user?.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-600">{request.leaveType}</p>
                        <p className="text-xs text-gray-500">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{request.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveLeave(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsRejectDialogOpen(true);
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {leaveRequests?.filter(req => req.status === 'pending').length === 0 && (
                <p className="text-center text-gray-500 py-8">No pending leave requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CV Files */}
        <Card className="card-modern shadow-modern border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">CV Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cvFiles?.map((cv) => (
                <div key={cv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cv.fileName}</p>
                      <p className="text-sm text-gray-600">Uploaded: {cv.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCV(cv)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadCV(cv)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
              {cvFiles?.length === 0 && (
                <p className="text-center text-gray-500 py-8">No CV files uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectLeave} disabled={!rejectionReason.trim()}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV View Dialog */}
      <Dialog open={isCvDialogOpen} onOpenChange={setIsCvDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>CV Details</DialogTitle>
          </DialogHeader>
          {selectedCvFile && (
            <div className="py-4">
              <div className="space-y-3">
                <div>
                  <Label>File Name</Label>
                  <p className="text-sm text-gray-600">{selectedCvFile.fileName}</p>
                </div>
                <div>
                  <Label>Upload Date</Label>
                  <p className="text-sm text-gray-600">{selectedCvFile.uploadDate}</p>
                </div>
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm text-gray-600">{selectedCvFile.userId}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCvDialogOpen(false)}>
              Close
            </Button>
            {selectedCvFile && (
              <Button onClick={() => handleDownloadCV(selectedCvFile)}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
