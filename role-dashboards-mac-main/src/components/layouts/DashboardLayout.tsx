import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Menu, X, LogOut, Home } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: any;
  active?: boolean;
  badge?: number;
  path?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "citizen" | "police" | "admin";
  navItems: NavItem[];
  title: string;
}

const DashboardLayout = ({ children, role, navItems, title }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getNavPath = (label: string) => {
    const baseRoute = `/${role}/dashboard`;
    const routes: Record<string, Record<string, string>> = {
      citizen: {
        "Dashboard": `${baseRoute}`,
        "File New FIR": `${baseRoute}/file-fir`,
        "My FIRs": `${baseRoute}/my-firs`,
        "Track Status": `${baseRoute}/track-status`,
        "Notifications": `${baseRoute}/notifications`,
        "Profile": `${baseRoute}/profile`,
      },
      police: {
        "Dashboard": `${baseRoute}`,
        "Pending FIRs": `${baseRoute}/pending`,
        "Approved FIRs": `${baseRoute}/approved`,
        "Under Investigation": `${baseRoute}/investigation`,
        "Active Cases": `${baseRoute}/active`,
        "Closed Cases": `${baseRoute}/closed`,
        "Search FIRs": `${baseRoute}/search`,
        "Notifications": `${baseRoute}/notifications`,
        "Profile": `${baseRoute}/profile`,
        "Analytics": `${baseRoute}/analytics`,
      },
      admin: {
        "Dashboard": `${baseRoute}`,
        "User Management": `${baseRoute}/users`,
        "FIR Management": `${baseRoute}/firs`,
        "Police Assignment": `${baseRoute}/assignments`,
        "Blockchain Ledger": `${baseRoute}/blockchain`,
        "AI Monitoring": `${baseRoute}/ai`,
        "Reports & Analytics": `${baseRoute}/reports`,
        "System Logs": `${baseRoute}/logs`,
      },
    };
    return routes[role]?.[label] || baseRoute;
  };

  const getRoleColor = () => {
    switch(role) {
      case "citizen": return "text-primary";
      case "police": return "text-secondary";
      case "admin": return "text-accent";
      default: return "text-primary";
    }
  };

  const getRoleBg = () => {
    switch(role) {
      case "citizen": return "bg-primary";
      case "police": return "bg-secondary";
      case "admin": return "bg-accent";
      default: return "bg-primary";
    }
  };
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("firDraft"); 
  localStorage.removeItem("userEmail"); 
  navigate("/");
};
  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-gradient-header border-b border-sidebar-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-navy-foreground hover:bg-navy-foreground/10"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getRoleBg())}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy-foreground">FIR System</h1>
                <p className="text-xs text-navy-foreground/80">{title}</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {location.pathname !== `/${role}/dashboard` ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-navy-foreground hover:bg-navy-foreground/10"
                onClick={() => navigate(`/${role}/dashboard`)}
              >
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            ) : (
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-navy-foreground hover:bg-navy-foreground/10">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-navy-foreground hover:bg-navy-foreground/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto",
            sidebarOpen ? "w-64" : "w-0 border-0"
          )}
        >
          {sidebarOpen && (
            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path || getNavPath(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    item.active 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-destructive/90 text-destructive-foreground border-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-6 transition-all duration-300",
          sidebarOpen ? "ml-0" : "ml-0"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
