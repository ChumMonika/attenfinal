import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Bus, UserCog, Presentation, Users, User as UserIcon, Calendar, Clock } from "lucide-react";

export default function DashboardHeader({ 
  user, 
  title, 
  subtitle, 
  borderColor, 
  bgColor,
  children 
}) {
  // Provide a default user if undefined
  const safeUser = user || { name: '', role: '', department: '', uniqueId: '' };

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/login");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "head":
        return <Bus className="text-white h-5 w-5" />;
      case "admin":
        return <UserCog className="text-white h-5 w-5" />;
      case "mazer":
        return <Presentation className="text-white h-5 w-5" />;
      case "assistant":
        return <Users className="text-white h-5 w-5" />;
      default:
        return <UserIcon className="text-white h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "head":
        return "bg-gradient-to-r from-purple-500 to-indigo-600";
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-cyan-600";
      case "mazer":
        return "bg-gradient-to-r from-orange-500 to-red-600";
      case "assistant":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-modern border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${getRoleColor(safeUser.role)} rounded-xl flex items-center justify-center shadow-modern`}>
              {getRoleIcon(safeUser.role)}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {children}
            
            {/* Date and Time */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{getCurrentDate()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{getCurrentTime()}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{safeUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{safeUser.role}</p>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="btn-modern text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl px-4 py-2 transition-all duration-200"
              >
                {logoutMutation.isPending ? (
                  <div className="spinner-modern w-4 h-4 mr-2"></div>
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
