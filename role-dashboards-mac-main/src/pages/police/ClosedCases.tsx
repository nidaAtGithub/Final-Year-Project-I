import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, BarChart3, Settings, Search, Filter, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ClosedCases = () => {
  const navItems = [
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Active Cases", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: FileText, active: true },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  const closedCases = [
    {
      id: "FIR-2023-009876",
      complainant: "Zainab Hussain",
      category: "Fraud",
      location: "F-7, Islamabad",
      closedDate: "2024-01-10",
      resolution: "Resolved - Suspect Arrested",
      officer: "Inspector Zubair Hassan",
    },
    {
      id: "FIR-2023-009654",
      complainant: "Usman Ghani",
      category: "Vehicle Theft",
      location: "Johar Town, Lahore",
      closedDate: "2024-01-05",
      resolution: "Resolved - Vehicle Recovered",
      officer: "SI Rabia Saleem",
    },
    {
      id: "FIR-2023-009432",
      complainant: "Nadia Ahmed",
      category: "Theft",
      location: "Saddar, Karachi",
      closedDate: "2023-12-28",
      resolution: "Closed - Insufficient Evidence",
      officer: "Inspector Kamran Malik",
    },
  ];

  const getResolutionColor = (resolution: string) => {
    if (resolution.includes("Resolved")) {
      return "bg-green-500/20 text-green-700 dark:text-green-400";
    }
    return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Closed Cases</h2>
          <p className="text-muted-foreground mt-1">View completed investigations and resolutions</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search closed cases..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {closedCases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <CardTitle className="text-lg">{case_.id}</CardTitle>
                      <CardDescription className="mt-1">
                        {case_.complainant} • {case_.category}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getResolutionColor(case_.resolution)}>
                    Closed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{case_.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Closed Date</p>
                    <p className="font-medium">{new Date(case_.closedDate).toLocaleDateString('en-PK')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Handled By</p>
                    <p className="font-medium">{case_.officer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resolution</p>
                    <p className="font-medium">{case_.resolution}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">View Full Report</Button>
                  <Button size="sm" variant="secondary">Download PDF</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClosedCases;
