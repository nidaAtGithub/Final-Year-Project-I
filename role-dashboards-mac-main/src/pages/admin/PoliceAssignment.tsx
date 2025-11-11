import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Lock, Search, UserCheck, AlertCircle } from "lucide-react";

const PoliceAssignment = () => {
  const officers = [
    { id: "P001", name: "Fatima Ali", rank: "Inspector", activeCases: 5, pendingAssignments: 2, location: "Karachi", status: "Available" },
    { id: "P002", name: "Ayesha Rasheed", rank: "Sub-Inspector", activeCases: 3, pendingAssignments: 1, location: "Lahore", status: "Available" },
    { id: "P003", name: "Imran Sadiq", rank: "Inspector", activeCases: 7, pendingAssignments: 0, location: "Islamabad", status: "Busy" },
    { id: "P004", name: "Zara Khan", rank: "ASI", activeCases: 2, pendingAssignments: 3, location: "Rawalpindi", status: "Available" },
  ];

  const unassignedFirs = [
    { id: "FIR2025004", type: "Cybercrime", reportedBy: "Usman Tariq", date: "2025-02-20", location: "Rawalpindi", priority: "High" },
    { id: "FIR2025006", type: "Theft", reportedBy: "Nadia Akhtar", date: "2025-02-21", location: "Karachi", priority: "Medium" },
    { id: "FIR2025007", type: "Fraud", reportedBy: "Ali Raza", date: "2025-02-21", location: "Lahore", priority: "High" },
  ];

  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield },
    { label: "Police Assignment", icon: Lock, active: true },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock },
  ];

  const getStatusBadge = (status: string) => {
    return status === "Available" ? (
      <Badge className="bg-secondary">{status}</Badge>
    ) : (
      <Badge className="bg-warning">{status}</Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    return priority === "High" ? (
      <Badge variant="destructive">{priority}</Badge>
    ) : (
      <Badge variant="secondary">{priority}</Badge>
    );
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="Police Assignment">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Police Assignment</h1>
            <p className="text-muted-foreground mt-1">Assign FIRs to police officers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{officers.length}</div>
                  <div className="text-sm text-muted-foreground">Total Officers</div>
                </div>
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-secondary">{officers.filter(o => o.status === "Available").length}</div>
                  <div className="text-sm text-muted-foreground">Available Officers</div>
                </div>
                <Shield className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-destructive">{unassignedFirs.length}</div>
                  <div className="text-sm text-muted-foreground">Unassigned FIRs</div>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unassigned FIRs */}
        <Card>
          <CardHeader>
            <CardTitle>Unassigned FIRs</CardTitle>
            <CardDescription>These FIRs need to be assigned to officers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">FIR ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Reported By</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {unassignedFirs.map((fir) => (
                    <tr key={fir.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{fir.id}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{fir.type}</Badge>
                      </td>
                      <td className="py-3 px-4">{fir.reportedBy}</td>
                      <td className="py-3 px-4 text-muted-foreground">{fir.location}</td>
                      <td className="py-3 px-4">{getPriorityBadge(fir.priority)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{fir.date}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" className="bg-primary hover:bg-primary-hover">
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Officers List */}
        <Card>
          <CardHeader>
            <CardTitle>Police Officers</CardTitle>
            <CardDescription>View officer workload and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Officer ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Active Cases</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Pending</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{officer.id}</td>
                      <td className="py-3 px-4">{officer.name}</td>
                      <td className="py-3 px-4">{officer.rank}</td>
                      <td className="py-3 px-4 text-muted-foreground">{officer.location}</td>
                      <td className="py-3 px-4 text-center">{officer.activeCases}</td>
                      <td className="py-3 px-4 text-center">{officer.pendingAssignments}</td>
                      <td className="py-3 px-4">{getStatusBadge(officer.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoliceAssignment;
