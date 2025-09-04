import { useState } from "react"; 
import { Card, CardContent } from "../../../ui/card"; 
import { Button } from "../../../ui/button"; 
import { Input } from "../../../ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"; 
import { useData } from "../../../../contexts/DataContext"; 
import { useNotifications } from "../../../../contexts/NotificationContext"; 
import DashboardHeader from "../layout/dashboard-header"; 
import AddUserModal from "../auth/add-user-modal"; 
import AdminSidebar from "../layout/admin-sidebar"; 
import { Plus, Search, Edit, Trash2, FileText, Download, Eye, Calendar, Clock, MapPin, GraduationCap } from "lucide-react"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../ui/dialog"; 
import { Label } from "../../../ui/label"; 
import { Textarea } from "../../../ui/textarea"; 
import { useToast } from "../../../../hooks/use-toast"; 

export default function AdminDashboard({ user }) { 
const { toast } = useToast(); 
const [searchTerm, setSearchTerm] = useState(""); 
const [roleFilter, setRoleFilter] = useState("all"); 
const [showAddUserModal, setShowAddUserModal] = useState(false); 
const [selectedCvFile, setSelectedCvFile] = useState(null); 
const [isCvDialogOpen, setIsCvDialogOpen] = useState(false); 
const [activeTab, setActiveTab] = useState("users"); 
const [showAddScheduleModal, setShowAddScheduleModal] = useState(false); 
const [editingSchedule, setEditingSchedule] = useState(null); 
const [scheduleFormData, setScheduleFormData] = useState({ 
day: "", 
course: "", 
teacherId: 0, 
startTime: "", 
endTime: "", 
room: "", 
major: "Data Science and Engineering" 
}); 

const { data: users } = useQuery({ 
queryKey: ["/api/users"], 
}); 

const { data: schedules } = useQuery({ 
queryKey: ["/api/schedules"], 
}); 

const { data: teachers } = useQuery({ 
queryKey: ["/api/users"], 
select: (data) => { 
const teacherUsers = data?.filter(user => user.role === 'teacher') || []; 
console.log("=== TEACHERS DEBUG ==="); 
console.log("All users:", data?.length); 
console.log("Teacher users:", teacherUsers.length); 
console.log("Teachers:", teacherUsers); 
console.log("=== END TEACHERS DEBUG ==="); 
return teacherUsers; 
} 
}); 

const deleteUserMutation = useMutation({ 
mutationFn: (userId) => apiRequest("DELETE", `/api/user/${userId}`), 
onSuccess: () => { 
queryClient.invalidateQueries({ queryKey: ["/api/users"] }); 
toast({ 
title: "Success", 
description: "User deleted successfully", 
}); 
}, 
onError: () => { 
toast({ 
title: "Error", 
description: "Failed to delete user", 
variant: "destructive", 
}); 
}, 
}); 

const createScheduleMutation = useMutation({ 
mutationFn: (scheduleData) => apiRequest("POST", "/api/schedules", scheduleData), 
onSuccess: () => { 
queryClient.invalidateQueries({ queryKey: ["/api/schedules"] }); 
setShowAddScheduleModal(false); 
setScheduleFormData({ 
day: "", 
course: "", 
teacherId: 0, 
startTime: "", 
endTime: "", 
room: "", 
major: "Data Science and Engineering" 
}); 
toast({ 
title: "Success", 
description: "Schedule created successfully", 
}); 
}, 
onError: (error) => { 
console.error("Schedule creation error:", error); 
toast({ 
title: "Error", 
description: error?.message || "Failed to create schedule", 
variant: "destructive", 
}); 
}, 
}); 

const updateScheduleMutation = useMutation({ 
mutationFn: ({ id, data }) => apiRequest("PUT", `/api/schedules/${id}`, data), 
onSuccess: () => { 
queryClient.invalidateQueries({ queryKey: ["/api/schedules"] }); 
setEditingSchedule(null); 
toast({ 
title: "Success", 
description: "Schedule updated successfully", 
}); 
}, 
onError: () => { 
toast({ 
title: "Error", 
description: "Failed to update schedule", 
variant: "destructive", 
}); 
}, 
}); 

const deleteScheduleMutation = useMutation({ 
mutationFn: (scheduleId) => apiRequest("DELETE", `/api/schedules/${scheduleId}`), 
onSuccess: () => { 
queryClient.invalidateQueries({ queryKey: ["/api/schedules"] }); 
toast({ 
title: "Success", 
description: "Schedule deleted successfully", 
}); 
}, 
onError: () => { 
toast({ 
title: "Error", 
description: "Failed to delete schedule", 
variant: "destructive", 
}); 
}, 
}); 

const handleDeleteUser = (userId, userName) => { 
if (window.confirm(`Are you sure you want to delete ${userName}?`)) { 
deleteUserMutation.mutate(userId); 
} 
}; 

const handleCreateSchedule = () => { 
console.log("=== FRONTEND SCHEDULE CREATE DEBUG ==="); 
console.log("Schedule form data:", scheduleFormData); 
console.log("Day:", scheduleFormData.day); 
console.log("Course:", scheduleFormData.course); 
console.log("Teacher ID:", scheduleFormData.teacherId); 
console.log("Start Time:", scheduleFormData.startTime); 
console.log("End Time:", scheduleFormData.endTime); 
console.log("Room:", scheduleFormData.room); 
console.log("Major:", scheduleFormData.major); 
// Validate form data 
if (!scheduleFormData.day || !scheduleFormData.course || !scheduleFormData.teacherId || 
!scheduleFormData.startTime || !scheduleFormData.endTime || !scheduleFormData.room) { 
toast({ 
title: "Validation Error", 
description: "Please fill in all required fields", 
variant: "destructive", 
}); 
return; 
} 
if (scheduleFormData.teacherId === 0) { 
toast({ 
title: "Validation Error", 
description: "Please select a teacher", 
variant: "destructive", 
}); 
return; 
} 
console.log("=== END FRONTEND SCHEDULE CREATE DEBUG ==="); 
createScheduleMutation.mutate(scheduleFormData); 
}; 

const handleUpdateSchedule = () => { 
if (editingSchedule) { 
updateScheduleMutation.mutate({ id: editingSchedule.id, data: scheduleFormData }); 
} 
}; 

const handleDeleteSchedule = (scheduleId, courseName) => { 
if (window.confirm(`Are you sure you want to delete the schedule for ${courseName}?`)) { 
deleteScheduleMutation.mutate(scheduleId); 
} 
}; 

const handleEditSchedule = (schedule) => { 
setEditingSchedule(schedule); 
setScheduleFormData({ 
day: schedule.day, 
course: schedule.course, 
teacherId: schedule.teacherId, 
startTime: schedule.startTime, 
endTime: schedule.endTime, 
room: schedule.room, 
major: schedule.major || "Data Science and Engineering" 
}); 
setShowAddScheduleModal(true); 
}; 

const handleAddSchedule = () => { 
setEditingSchedule(null); 
setScheduleFormData({ 
day: "", 
course: "", 
teacherId: 0, 
startTime: "", 
endTime: "", 
room: "", 
major: "Data Science and Engineering" 
}); 
setShowAddScheduleModal(true); 
}; 

// CV viewing handlers 
const handleViewCv = async (userId, userName) => { 
try { 
const response = await apiRequest('GET', `/api/cv/${userId}`); 
const cvFile = await response.json(); 
if (cvFile) { 
setSelectedCvFile(cvFile); 
setIsCvDialogOpen(true); 
} else { 
toast({ 
title: "No CV Found", 
description: `${userName} has not uploaded a CV yet.`, 
variant: "destructive", 
}); 
} 
} catch (error) { 
toast({ 
title: "Error", 
description: "Failed to fetch CV", 
variant: "destructive", 
}); 
} 
}; 

const handleDownloadCv = async () => { 
if (!selectedCvFile) return; 

try { 
const response = await fetch(`/api/cv/download/${selectedCvFile.id}`, { 
credentials: 'include' 
}); 
if (response.ok) { 
const blob = await response.blob(); 
const url = window.URL.createObjectURL(blob); 
const a = document.createElement('a'); 
a.href = url; 
a.download = selectedCvFile.originalName; 
document.body.appendChild(a); 
a.click(); 
window.URL.revokeObjectURL(url); 
document.body.removeChild(a); 
} 
} catch (error) { 
toast({ 
title: "Error", 
description: "Failed to download CV", 
variant: "destructive", 
}); 
} 
}; 

const filteredUsers = users?.filter(u => { 
const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
u.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()); 
const matchesRole = roleFilter === "all" || u.role === roleFilter; 
return matchesSearch && matchesRole; 
}) || []; 

const getRoleBadgeColor = (role) => { 
switch (role) { 
case "head": 
return "bg-university-head bg-opacity-10 text-university-head"; 
case "admin": 
return "bg-university-admin bg-opacity-10 text-university-admin"; 
case "mazer": 
return "bg-university-mazer bg-opacity-10 text-university-mazer"; 
case "assistant": 
return "bg-university-assistant bg-opacity-10 text-university-assistant"; 
case "teacher": 
return "bg-blue-100 text-blue-800"; 
case "staff": 
return "bg-gray-100 text-gray-800"; 
default: 
return "bg-gray-100 text-gray-800"; 
} 
}; 

// Use window.location.pathname for current route 
const currentRoute = typeof window !== 'undefined' ? window.location.pathname : ''; 

return ( 
<div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-orange-100 flex"> 
{/* Sidebar Navigation */} 
<AdminSidebar currentRoute={currentRoute} /> 
{/* Main Content */} 
<div className="flex-1 flex flex-col"> 
<DashboardHeader 
user={user} 
title="Admin Dashboard" 
subtitle="System Administration" 
borderColor="border-university-admin" 
bgColor="bg-university-admin" 
> 
<Button 
onClick={() => setShowAddUserModal(true)} 
className="bg-university-admin text-white hover:bg-cyan-700" 
> 
<Plus className="w-4 h-4 mr-2" /> 
Add User 
</Button> 
</DashboardHeader> 

<div className="max-w-7xl mx-auto px-6 py-8"> 
{/* Tab Navigation */} 
<div className="mb-6"> 
<div className="border-b border-gray-200"> 
<nav className="-mb-px flex space-x-8"> 
<button 
onClick={() => setActiveTab("users")} 
className={`py-2 px-1 border-b-2 font-medium text-sm ${ 
activeTab === "users" 
? "border-university-admin text-university-admin" 
: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
}`} 
> 
User Management 
</button> 
<button 
onClick={() => setActiveTab("schedules")} 
className={`py-2 px-1 border-b-2 font-medium text-sm ${ 
activeTab === "schedules" 
? "border-university-admin text-university-admin" 
: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
}`} 
> 
Schedule Management 
</button> 
</nav> 
</div> 
</div> 

{/* Users Tab */} 
{activeTab === "users" && ( 
<Card> 
<div className="p-6 border-b border-gray-200"> 
<div className="flex justify-between items-center"> 
<h2 className="text-lg font-semibold text-gray-900">User Management</h2> 
<div className="flex items-center space-x-4"> 
<div className="relative"> 
<Input 
type="text" 
placeholder="Search users..." 
value={searchTerm} 
onChange={(e) => setSearchTerm(e.target.value)} 
className="pl-10 pr-4 py-2 w-64" 
/> 
<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> 
</div> 
<Select value={roleFilter} onValueChange={setRoleFilter}> 
<SelectTrigger className="w-40"> 
<SelectValue placeholder="All Roles" /> 
</SelectTrigger> 
<SelectContent> 
<SelectItem value="all">All Roles</SelectItem> 
<SelectItem value="head">Head</SelectItem> 
<SelectItem value="admin">Admin</SelectItem> 
<SelectItem value="mazer">Mazer</SelectItem> 
<SelectItem value="assistant">Assistant</SelectItem> 
<SelectItem value="teacher">Teacher</SelectItem> 
<SelectItem value="staff">Staff</SelectItem> 
</SelectContent> 
</Select> 
</div> 
</div> 
</div> 

<div className="overflow-x-auto"> 
<table className="w-full shadow-xl rounded-2xl overflow-hidden"> 
<thead> 
<tr> 
<th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50">User</th> 
<th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider bg-pink-50">ID</th> 
<th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50">Role</th> 
<th className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider bg-orange-50">Department</th> 
<th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50">Actions</th> 
</tr> 
</thead> 
<tbody className="bg-white divide-y divide-gray-200"> 
{filteredUsers.map((user) => ( 
<tr key={user.id} className="hover:bg-gray-50"> 
<td className="px-6 py-4 whitespace-nowrap"> 
<div className="flex items-center"> 
<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"> 
<span className="text-gray-600 font-medium"> 
{user.name.split(' ').map(n => n[0]).join('').toUpperCase()} 
</span> 
</div> 
<div className="ml-4"> 
<div className="text-sm font-medium text-gray-900">{user.name}</div> 
<div className="text-sm text-gray-500">{user.email}</div> 
</div> 
</div> 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{user.uniqueId} 
</td> 
<td className="px-6 py-4 whitespace-nowrap"> 
<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}> 
{user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
</span> 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{user.department || 'N/A'} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> 
<div className="flex space-x-2"> 
<Button 
variant="ghost" 
size="sm" 
onClick={() => handleViewCv(user.id, user.name)} 
className="text-blue-600 hover:text-blue-900" 
> 
<FileText className="h-4 w-4 mr-1" /> 
View CV 
</Button> 
<Button 
variant="ghost" 
size="sm" 
onClick={() => handleDeleteUser(user.id, user.name)} 
className="text-red-600 hover:text-red-900" 
> 
<Trash2 className="h-4 w-4 mr-1" /> 
Delete 
</Button> 
</div> 
</td> 
</tr> 
))} 
</tbody> 
</table> 
</div> 
</Card> 
)} 

{/* Schedules Tab */} 
{activeTab === "schedules" && ( 
<Card> 
<div className="p-6 border-b border-gray-200 flex justify-between items-center"> 
<h2 className="text-lg font-semibold text-gray-900">Schedule Management</h2> 
<Button 
onClick={handleAddSchedule} 
className="bg-university-admin text-white hover:bg-cyan-700" 
> 
<Plus className="w-4 h-4 mr-2" /> 
Add Schedule 
</Button> 
</div> 
<div className="overflow-x-auto"> 
<table className="min-w-full divide-y divide-gray-200"> 
<thead className="bg-gray-50"> 
<tr> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major</th> 
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> 
</tr> 
</thead> 
<tbody className="bg-white divide-y divide-gray-200"> 
{schedules?.map((schedule) => ( 
<tr key={schedule.id}> 
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> 
{schedule.course} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{schedule.teacher?.name || 'N/A'} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{schedule.day} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{schedule.startTime} - {schedule.endTime} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{schedule.room} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
{schedule.major || 'N/A'} 
</td> 
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> 
<div className="flex space-x-2"> 
<Button 
variant="ghost" 
size="sm" 
onClick={() => handleEditSchedule(schedule)} 
className="text-blue-600 hover:text-blue-900" 
> 
<Edit className="h-4 w-4 mr-1" /> 
Edit 
</Button> 
<Button 
variant="ghost" 
size="sm" 
onClick={() => handleDeleteSchedule(schedule.id, schedule.course)} 
className="text-red-600 hover:text-red-900" 
> 
<Trash2 className="h-4 w-4 mr-1" /> 
Delete 
</Button> 
</div> 
</td> 
</tr> 
))} 
</tbody> 
</table> 
</div> 
</Card> 
)} 
</div> 
</div> 

{/* Add/Edit User Modal */} 
<AddUserModal 
open={showAddUserModal} 
onOpenChange={setShowAddUserModal} 
/> 

{/* Add/Edit Schedule Modal */} 
<Dialog open={showAddScheduleModal} onOpenChange={setShowAddScheduleModal}> 
<DialogContent className="sm:max-w-[600px]"> 
<DialogHeader> 
<DialogTitle> 
{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'} 
</DialogTitle> 
<DialogDescription> 
{editingSchedule 
? 'Update the schedule details below.' 
: 'Fill in the details below to create a new schedule.'} 
</DialogDescription> 
</DialogHeader> 
<div className="grid gap-4 py-4"> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="course" className="text-right"> 
Course <span className="text-red-500">*</span> 
</Label> 
<Input 
id="course" 
value={scheduleFormData.course} 
onChange={(e) => setScheduleFormData({...scheduleFormData, course: e.target.value})} 
className="col-span-3" 
placeholder="Enter course name" 
/> 
</div> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="teacher" className="text-right"> 
Teacher <span className="text-red-500">*</span> 
</Label> 
<Select 
value={scheduleFormData.teacherId} 
onValueChange={(value) => setScheduleFormData({...scheduleFormData, teacherId: parseInt(value)})} 
> 
<SelectTrigger className="col-span-3"> 
<SelectValue placeholder="Select a teacher" /> 
</SelectTrigger> 
<SelectContent> 
{teachers?.map((teacher) => ( 
<SelectItem key={teacher.id} value={teacher.id.toString()}> 
{teacher.name} ({teacher.uniqueId}) 
</SelectItem> 
))} 
</SelectContent> 
</Select> 
</div> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="day" className="text-right"> 
Day <span className="text-red-500">*</span> 
</Label> 
<Select 
value={scheduleFormData.day} 
onValueChange={(value) => setScheduleFormData({...scheduleFormData, day: value})} 
> 
<SelectTrigger className="col-span-3"> 
<SelectValue placeholder="Select a day" /> 
</SelectTrigger> 
<SelectContent> 
<SelectItem value="Monday">Monday</SelectItem> 
<SelectItem value="Tuesday">Tuesday</SelectItem> 
<SelectItem value="Wednesday">Wednesday</SelectItem> 
<SelectItem value="Thursday">Thursday</SelectItem> 
<SelectItem value="Friday">Friday</SelectItem> 
<SelectItem value="Saturday">Saturday</SelectItem> 
<SelectItem value="Sunday">Sunday</SelectItem> 
</SelectContent> 
</Select> 
</div> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="time" className="text-right"> 
Time <span className="text-red-500">*</span> 
</Label> 
<div className="col-span-3 grid grid-cols-2 gap-2"> 
<div className="flex items-center"> 
<Clock className="h-4 w-4 mr-2 text-gray-500" /> 
<Input 
type="time" 
value={scheduleFormData.startTime} 
onChange={(e) => setScheduleFormData({...scheduleFormData, startTime: e.target.value})} 
className="w-full" 
/> 
</div> 
<div className="flex items-center"> 
<Clock className="h-4 w-4 mr-2 text-gray-500" /> 
<Input 
type="time" 
value={scheduleFormData.endTime} 
onChange={(e) => setScheduleFormData({...scheduleFormData, endTime: e.target.value})} 
className="w-full" 
/> 
</div> 
</div> 
</div> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="room" className="text-right"> 
Room <span className="text-red-500">*</span> 
</Label> 
<div className="col-span-3 flex items-center"> 
<MapPin className="h-4 w-4 mr-2 text-gray-500" /> 
<Input 
id="room" 
value={scheduleFormData.room} 
onChange={(e) => setScheduleFormData({...scheduleFormData, room: e.target.value})} 
className="flex-1" 
placeholder="Enter room number" 
/> 
</div> 
</div> 
<div className="grid grid-cols-4 items-center gap-4"> 
<Label htmlFor="major" className="text-right"> 
Major 
</Label> 
<div className="col-span-3 flex items-center"> 
<GraduationCap className="h-4 w-4 mr-2 text-gray-500" /> 
<Input 
id="major" 
value={scheduleFormData.major} 
onChange={(e) => setScheduleFormData({...scheduleFormData, major: e.target.value})} 
className="flex-1" 
placeholder="Enter major (optional)" 
/> 
</div> 
</div> 
</div> 
<DialogFooter> 
<Button 
variant="outline" 
onClick={() => setShowAddScheduleModal(false)} 
> 
Cancel 
</Button> 
<Button 
onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule} 
className="bg-university-admin text-white hover:bg-cyan-700" 
> 
{editingSchedule ? 'Update' : 'Create'} Schedule 
</Button> 
</DialogFooter> 
</DialogContent> 
</Dialog> 

{/* CV View Dialog */} 
<Dialog open={isCvDialogOpen} onOpenChange={setIsCvDialogOpen}> 
<DialogContent className="sm:max-w-[600px]"> 
<DialogHeader> 
<DialogTitle>CV Details</DialogTitle> 
<DialogDescription> 
View and download CV for {selectedCvFile?.userName || 'user'} 
</DialogDescription> 
</DialogHeader> 
{selectedCvFile && ( 
<div className="space-y-4"> 
<div className="border rounded-lg p-4"> 
<h4 className="font-medium mb-2">File Information</h4> 
<p className="text-sm text-gray-600"> 
<span className="font-medium">File Name:</span> {selectedCvFile.originalName} 
</p> 
<p className="text-sm text-gray-600"> 
<span className="font-medium">Uploaded:</span> {new Date(selectedCvFile.uploadedAt).toLocaleDateString()} 
</p> 
<p className="text-sm text-gray-600"> 
<span className="font-medium">File Size:</span> {(selectedCvFile.size / 1024).toFixed(2)} KB 
</p> 
</div> 
<div className="border rounded-lg p-4"> 
<h4 className="font-medium mb-2">Preview</h4> 
<div className="bg-gray-100 rounded p-4 text-center"> 
<FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" /> 
<p className="text-sm text-gray-600"> 
{selectedCvFile.originalName} 
</p> 
<p className="text-xs text-gray-500 mt-1"> 
PDF Document • {(selectedCvFile.size / 1024).toFixed(2)} KB 
</p> 
</div> 
</div> 
</div> 
)} 
<DialogFooter> 
<Button 
variant="outline" 
onClick={() => setIsCvDialogOpen(false)} 
> 
Close 
</Button> 
<Button 
onClick={handleDownloadCv} 
className="bg-university-admin text-white hover:bg-cyan-700" 
> 
<Download className="h-4 w-4 mr-2" /> 
Download CV 
</Button> 
</DialogFooter> 
</DialogContent> 
</Dialog> 
</div> 
); 
}
