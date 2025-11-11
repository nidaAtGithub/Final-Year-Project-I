import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, Filter, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ApprovedFirs = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: true },
    { label: "Under Investigation", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: false },
    { label: "Notifications", icon: Bell, active: false, badge: 5 },
    { label: "Profile", icon: User, active: false },
  ];

  const approvedFirs = [
    {
      id: "FIR-2025-001250",
      complainant: "Fatima Noor",
      category: "Theft",
      location: "Gulberg, Lahore",
      approvedDate: "2025-01-20",
      approvedBy: "Inspector Kamran Malik",
      assignedTo: "SI Ayesha Malik",
    },
    {
      id: "FIR-2025-001248",
      complainant: "Hassan Mahmood",
      category: "Fraud",
      location: "DHA, Karachi",
      approvedDate: "2025-01-19",
      approvedBy: "Inspector Zubair Hassan",
      assignedTo: "ASI Bilal Yousaf",
    },
    {
      id: "FIR-2025-001245",
      complainant: "Zainab Hussain",
      category: "Cybercrime",
      location: "F-7, Islamabad",
      approvedDate: "2025-01-18",
      approvedBy: "Inspector Kamran Malik",
      assignedTo: "SI Rabia Saleem",
    },
  ];

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Approved FIRs</h2>
          <p className="text-muted-foreground mt-1">FIRs that have been reviewed and approved</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by FIR ID, complainant, or location..." className="pl-10 border-border/50" />
          </div>
          <Button variant="outline" className="border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {approvedFirs.map((fir) => (
            <Card key={fir.id} className="hover:shadow-md transition-shadow border-border/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                      {fir.id}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Filed by {fir.complainant}
                    </CardDescription>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    Approved
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
                    <p className="text-muted-foreground">Approved By</p>
                    <p className="font-medium">{fir.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{fir.assignedTo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary-hover">View Details</Button>
                  <Button size="sm" variant="outline" className="border-border/50">Assign Officer</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApprovedFirs;
