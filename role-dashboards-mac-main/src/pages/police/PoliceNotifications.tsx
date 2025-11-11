import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PoliceNotifications = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: false },
    { label: "Under Investigation", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: false },
    { label: "Notifications", icon: Bell, active: true, badge: 5 },
    { label: "Profile", icon: User, active: false },
  ];

  const notifications = [
    {
      title: "New FIR Assigned",
      message: "FIR #2025-001456 has been assigned to you for investigation",
      time: "10 minutes ago",
      type: "assignment",
      read: false,
    },
    {
      title: "Case Update Required",
      message: "Please update the progress for FIR #2025-001234 (Pending for 3 days)",
      time: "2 hours ago",
      type: "reminder",
      read: false,
    },
    {
      title: "Evidence Submitted",
      message: "New evidence has been submitted for case #2025-001189",
      time: "5 hours ago",
      type: "evidence",
      read: false,
    },
    {
      title: "Supervisor Review",
      message: "Your case report for FIR #2025-001098 has been approved",
      time: "1 day ago",
      type: "approval",
      read: true,
    },
    {
      title: "System Announcement",
      message: "System maintenance scheduled for Sunday 2 AM - 4 AM",
      time: "2 days ago",
      type: "system",
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment": return "📋";
      case "reminder": return "⏰";
      case "evidence": return "📎";
      case "approval": return "✅";
      case "system": return "⚙️";
      default: return "🔔";
    }
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
            <p className="text-muted-foreground mt-1">Stay updated with case assignments and updates</p>
          </div>
          <Button variant="outline" className="border-border/50">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-md transition-shadow border-border/50 ${
                !notification.read ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        {!notification.read && (
                          <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {notification.message}
                      </CardDescription>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {notification.time}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button size="sm" variant="outline" className="border-border/50">
                      Mark as Read
                    </Button>
                  )}
                  {notification.type === "assignment" && (
                    <Button size="sm" className="bg-primary hover:bg-primary-hover">
                      View Case
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoliceNotifications;
