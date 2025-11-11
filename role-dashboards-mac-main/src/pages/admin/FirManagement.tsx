import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Lock, Search, FileText, Eye, Trash2 } from "lucide-react";

const FirManagement = () => {
  const firs = [
    { id: "FIR2025001", type: "Theft", reportedBy: "Ahmed Khan", officer: "Fatima Ali", status: "Under Investigation", date: "2025-02-15", location: "Karachi" },
    { id: "FIR2025002", type: "Fraud", reportedBy: "Hassan Mahmood", officer: "Ayesha Rasheed", status: "Pending", date: "2025-02-18", location: "Lahore" },
    { id: "FIR2025003", type: "Assault", reportedBy: "Sara Malik", officer: "Fatima Ali", status: "Resolved", date: "2025-02-10", location: "Islamabad" },
    { id: "FIR2025004", type: "Cybercrime", reportedBy: "Usman Tariq", officer: "Unassigned", status: "Pending", date: "2025-02-20", location: "Rawalpindi" },
    { id: "FIR2025005", type: "Robbery", reportedBy: "Zainab Hussain", officer: "Ayesha Rasheed", status: "Under Investigation", date: "2025-02-17", location: "Faisalabad" },
  ];

  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield, active: true },
    { label: "Police Assignment", icon: Lock },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return <Badge className="bg-secondary">{status}</Badge>;
      case "Under Investigation":
        return <Badge className="bg-warning">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="FIR Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">FIR Management</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all FIRs in the system</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{firs.length}</div>
              <div className="text-sm text-muted-foreground">Total FIRs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">{firs.filter(f => f.status === "Pending").length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{firs.filter(f => f.status === "Under Investigation").length}</div>
              <div className="text-sm text-muted-foreground">Under Investigation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{firs.filter(f => f.status === "Resolved").length}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search by FIR ID, type, or reporter..." className="pl-10" />
              </div>
              <select className="px-4 py-2 border border-input rounded-md bg-background">
                <option>All Types</option>
                <option>Theft</option>
                <option>Fraud</option>
                <option>Assault</option>
                <option>Cybercrime</option>
                <option>Robbery</option>
              </select>
              <select className="px-4 py-2 border border-input rounded-md bg-background">
                <option>All Status</option>
                <option>Pending</option>
                <option>Under Investigation</option>
                <option>Resolved</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* FIRs List */}
        <Card>
          <CardHeader>
            <CardTitle>All FIRs</CardTitle>
            <CardDescription>Comprehensive list of all filed FIRs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">FIR ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Reported By</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Assigned Officer</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {firs.map((fir) => (
                    <tr key={fir.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{fir.id}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{fir.type}</Badge>
                      </td>
                      <td className="py-3 px-4">{fir.reportedBy}</td>
                      <td className="py-3 px-4 text-muted-foreground">{fir.officer}</td>
                      <td className="py-3 px-4">{getStatusBadge(fir.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{fir.location}</td>
                      <td className="py-3 px-4 text-muted-foreground">{fir.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
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

export default FirManagement;
