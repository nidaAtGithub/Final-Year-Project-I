import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, MapPin, Calendar, FileCheck, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TrackStatus = () => {
  const navItems = [
    { label: "File FIR", icon: FileText, active: false },
    { label: "My FIRs", icon: FileCheck, active: false },
    { label: "Track Status", icon: MapPin, active: true },
    { label: "Notifications", icon: Calendar, active: false, badge: 3 },
  ];

  const timeline = [
    {
      date: "2024-01-15 09:30 AM",
      status: "FIR Filed",
      description: "Your complaint has been registered successfully",
      officer: "System",
    },
    {
      date: "2024-01-15 11:45 AM",
      status: "Under Review",
      description: "FIR is being reviewed by Inspector Imran Ahmed",
      officer: "Inspector Imran Ahmed",
    },
    {
      date: "2024-01-15 02:20 PM",
      status: "Approved",
      description: "FIR approved and assigned for investigation",
      officer: "Inspector Imran Ahmed",
    },
    {
      date: "2024-01-16 10:00 AM",
      status: "Investigation Started",
      description: "Investigation team deployed to the location",
      officer: "SI Ayesha Malik",
    },
  ];

  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Track FIR Status</h2>
          <p className="text-muted-foreground mt-1">Real-time tracking of your FIR progress</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search FIR</CardTitle>
            <CardDescription>Enter your FIR ID to track status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter FIR ID (e.g., FIR-2024-001234)" className="pl-10" defaultValue="FIR-2024-001234" />
              </div>
              <Button>Track</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>FIR-2024-001234</CardTitle>
                <CardDescription className="mt-1">Theft • Gulberg, Lahore</CardDescription>
              </div>
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">
                Under Investigation
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {index !== timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border absolute top-3" />
                      )}
                    </div>
                    <div className="flex-1 -mt-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.status}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            By {item.officer} • {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TrackStatus;
