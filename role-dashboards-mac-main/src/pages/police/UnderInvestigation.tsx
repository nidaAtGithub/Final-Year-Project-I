import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, Filter, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const UnderInvestigation = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: false },
    { label: "Under Investigation", icon: FolderOpen, active: true, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: false },
    { label: "Notifications", icon: Bell, active: false, badge: 5 },
    { label: "Profile", icon: User, active: false },
  ];

  const investigations = [
    {
      id: "FIR-2025-001234",
      complainant: "Ahmed Khan",
      category: "Vehicle Theft",
      location: "Model Town, Lahore",
      officer: "SI Ayesha Malik",
      progress: 65,
      status: "Evidence Collection",
      daysActive: 8,
    },
    {
      id: "FIR-2025-001189",
      complainant: "Fatima Noor",
      category: "Fraud",
      location: "Clifton, Karachi",
      officer: "ASI Bilal Yousaf",
      progress: 45,
      status: "Suspect Identified",
      daysActive: 12,
    },
    {
      id: "FIR-2025-001156",
      complainant: "Hassan Mahmood",
      category: "Cybercrime",
      location: "Blue Area, Islamabad",
      officer: "SI Rabia Saleem",
      progress: 80,
      status: "Final Review",
      daysActive: 15,
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-secondary";
    if (progress >= 40) return "bg-warning";
    return "bg-accent";
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Under Investigation</h2>
          <p className="text-muted-foreground mt-1">Active cases currently being investigated</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search investigations..." className="pl-10 border-border/50" />
          </div>
          <Button variant="outline" className="border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {investigations.map((fir) => (
            <Card key={fir.id} className="hover:shadow-md transition-shadow border-border/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{fir.id}</CardTitle>
                    <CardDescription className="mt-1">
                      {fir.complainant} • {fir.category}
                    </CardDescription>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    {fir.daysActive} days active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{fir.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Investigating Officer</p>
                    <p className="font-medium">{fir.officer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Status</p>
                    <p className="font-medium">{fir.status}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Investigation Progress</span>
                    <span className="font-medium">{fir.progress}%</span>
                  </div>
                  <Progress value={fir.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary-hover">Update Progress</Button>
                  <Button size="sm" variant="outline" className="border-border/50">View Details</Button>
                  <Button size="sm" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                    Close Case
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UnderInvestigation;
