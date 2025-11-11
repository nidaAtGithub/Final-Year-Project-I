import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, BarChart3, Settings, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PendingFirs = () => {
  const navItems = [
    { label: "Pending FIRs", icon: Clock, active: true, badge: 12 },
    { label: "Active Cases", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: FileText, active: false },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  const pendingFirs = [
    {
      id: "FIR-2024-001256",
      complainant: "Sana Ijaz",
      category: "Theft",
      location: "Model Town, Lahore",
      date: "2024-01-17",
      priority: "High",
      time: "2 hours ago",
    },
    {
      id: "FIR-2024-001255",
      complainant: "Hassan Mahmood",
      category: "Vehicle Theft",
      location: "Clifton, Karachi",
      date: "2024-01-17",
      priority: "Medium",
      time: "4 hours ago",
    },
    {
      id: "FIR-2024-001254",
      complainant: "Ayesha Tariq",
      category: "Fraud",
      location: "Blue Area, Islamabad",
      date: "2024-01-16",
      priority: "High",
      time: "1 day ago",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-700 dark:text-red-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "Low": return "bg-green-500/20 text-green-700 dark:text-green-400";
      default: return "bg-gray-500/20 text-gray-700";
    }
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Pending FIRs</h2>
          <p className="text-muted-foreground mt-1">Review and approve new complaints</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by FIR ID, complainant, or location..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {pendingFirs.map((fir) => (
            <Card key={fir.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{fir.id}</CardTitle>
                    <CardDescription className="mt-1">
                      Filed by {fir.complainant} • {fir.time}
                    </CardDescription>
                  </div>
                  <Badge className={getPriorityColor(fir.priority)}>
                    {fir.priority} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{fir.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{fir.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(fir.date).toLocaleDateString('en-PK')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Review & Approve</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PendingFirs;
