import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Lock, Search, Download, Filter, AlertCircle, CheckCircle, Info } from "lucide-react";

const SystemLogs = () => {
  const logs = [
    { id: 1, timestamp: "2025-02-21 14:35:22", user: "Fatima Ali", action: "FIR Assigned", details: "FIR2025001 assigned to officer", type: "info", ip: "192.168.1.105" },
    { id: 2, timestamp: "2025-02-21 14:30:15", user: "Ahmed Khan", action: "FIR Filed", details: "New FIR filed - FIR2025008", type: "success", ip: "192.168.1.156" },
    { id: 3, timestamp: "2025-02-21 14:25:10", user: "System", action: "Backup Completed", details: "Daily database backup completed successfully", type: "success", ip: "127.0.0.1" },
    { id: 4, timestamp: "2025-02-21 14:20:05", user: "Admin", action: "User Updated", details: "User U005 status changed to Suspended", type: "warning", ip: "192.168.1.100" },
    { id: 5, timestamp: "2025-02-21 14:15:00", user: "Hassan Mahmood", action: "Login Failed", details: "Multiple failed login attempts detected", type: "error", ip: "192.168.1.180" },
    { id: 6, timestamp: "2025-02-21 14:10:45", user: "Ayesha Rasheed", action: "Case Closed", details: "FIR2025003 marked as resolved", type: "success", ip: "192.168.1.110" },
    { id: 7, timestamp: "2025-02-21 14:05:30", user: "System", action: "AI Verification", details: "Automated verification completed for 5 FIRs", type: "info", ip: "127.0.0.1" },
    { id: 8, timestamp: "2025-02-21 14:00:20", user: "Admin", action: "Police Officer Added", details: "New officer P005 added to system", type: "success", ip: "192.168.1.100" },
  ];

  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield },
    { label: "Police Assignment", icon: Lock },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock, active: true },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-secondary" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getLogBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-secondary">{type}</Badge>;
      case "error":
        return <Badge variant="destructive">{type}</Badge>;
      case "warning":
        return <Badge className="bg-warning">{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="System Logs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
            <p className="text-muted-foreground mt-1">Monitor all system activities and events</p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{logs.filter(l => l.type === "info").length}</div>
                  <div className="text-sm text-muted-foreground">Info</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{logs.filter(l => l.type === "success").length}</div>
                  <div className="text-sm text-muted-foreground">Success</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">{logs.filter(l => l.type === "warning").length}</div>
                  <div className="text-sm text-muted-foreground">Warning</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{logs.filter(l => l.type === "error").length}</div>
                  <div className="text-sm text-muted-foreground">Error</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search logs by user, action, or details..." className="pl-10" />
              </div>
              <select className="px-4 py-2 border border-input rounded-md bg-background">
                <option>All Types</option>
                <option>Info</option>
                <option>Success</option>
                <option>Warning</option>
                <option>Error</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system logs and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">{log.action}</span>
                        {getLogBadge(log.type)}
                      </div>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>User: <span className="font-medium">{log.user}</span></span>
                      <span>IP: <span className="font-medium">{log.ip}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SystemLogs;
