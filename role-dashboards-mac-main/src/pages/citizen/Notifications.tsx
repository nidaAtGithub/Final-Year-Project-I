import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, MapPin, Calendar, FileCheck, Bell, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Notifications = () => {
  const navItems = [
    { label: "File FIR", icon: FileText, active: false },
    { label: "My FIRs", icon: FileCheck, active: false },
    { label: "Track Status", icon: MapPin, active: false },
    { label: "Notifications", icon: Calendar, active: true, badge: 3 },
  ];

  const notifications = [
    {
      id: 1,
      title: "FIR Status Update",
      message: "Your FIR-2024-001234 has been approved and assigned to Inspector Imran Ahmed",
      time: "2 hours ago",
      unread: true,
      type: "status",
    },
    {
      id: 2,
      title: "Investigation Update",
      message: "Investigation team has been deployed for your case FIR-2024-001234",
      time: "5 hours ago",
      unread: true,
      type: "investigation",
    },
    {
      id: 3,
      title: "Court Hearing Scheduled",
      message: "Hearing scheduled for FIR-2024-000987 on 25th January 2024 at 10:00 AM",
      time: "1 day ago",
      unread: true,
      type: "hearing",
    },
    {
      id: 4,
      title: "FIR Registered Successfully",
      message: "Your complaint has been registered with ID: FIR-2024-001234",
      time: "2 days ago",
      unread: false,
      type: "success",
    },
  ];

  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
            <p className="text-muted-foreground mt-1">Stay updated with your FIR status</p>
          </div>
          <Button variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.unread ? "border-primary/50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.unread ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Bell className={`w-5 h-5 ${notification.unread ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      {notification.unread && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {notification.message}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
