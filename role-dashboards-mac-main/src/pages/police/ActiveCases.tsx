import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, BarChart3, Settings, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const ActiveCases = () => {
  const navItems = [
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Active Cases", icon: FolderOpen, active: true, badge: 8 },
    { label: "Closed Cases", icon: FileText, active: false },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  const activeCases = [
    {
      id: "FIR-2024-001234",
      complainant: "Ahmed Khan",
      category: "Theft",
      location: "Gulberg, Lahore",
      assignedOfficer: "SI Ayesha Malik",
      progress: 65,
      startDate: "2024-01-15",
      lastUpdate: "2 hours ago",
    },
    {
      id: "FIR-2024-001198",
      complainant: "Fatima Noor",
      category: "Cybercrime",
      location: "DHA, Karachi",
      assignedOfficer: "Inspector Zain Abbas",
      progress: 40,
      startDate: "2024-01-12",
      lastUpdate: "1 day ago",
    },
    {
      id: "FIR-2024-001167",
      complainant: "Bilal Yousaf",
      category: "Assault",
      location: "G-10, Islamabad",
      assignedOfficer: "SI Hira Jamil",
      progress: 85,
      startDate: "2024-01-08",
      lastUpdate: "3 hours ago",
    },
  ];

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Active Investigations</h2>
          <p className="text-muted-foreground mt-1">Track ongoing cases and progress</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search active cases..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {activeCases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{case_.id}</CardTitle>
                    <CardDescription className="mt-1">
                      {case_.complainant} • {case_.category}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">
                    In Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{case_.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned Officer</p>
                    <p className="font-medium">{case_.assignedOfficer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Update</p>
                    <p className="font-medium">{case_.lastUpdate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investigation Progress</span>
                    <span className="font-medium">{case_.progress}%</span>
                  </div>
                  <Progress value={case_.progress} />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Update Progress</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="secondary">Close Case</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActiveCases;
