import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Lock, UserCheck, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

const PoliceAssignment = () => {
  const [officers, setOfficers] = useState<any[]>([]);
  const [unassignedFirs, setUnassignedFirs] = useState<any[]>([]);
  const [assignedFirs, setAssignedFirs] = useState<any[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<{[key: string]: string}>({});

  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield },
    { label: "Police Assignment", icon: Lock, active: true },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock },
  ];

  useEffect(() => {
    axios.get("http://localhost:8004/get-officers")
      .then(res => setOfficers(res.data.officers))
      .catch(() => toast.error("Failed to load officers"));

    axios.get("http://localhost:8004/get-unassigned-firs")
      .then(res => setUnassignedFirs(res.data.firs))
      .catch(() => toast.error("Failed to load unassigned FIRs"));

    axios.get("http://localhost:8004/get-assigned-firs")
      .then(res => setAssignedFirs(res.data.firs))
      .catch(() => toast.error("Failed to load assigned FIRs"));
  }, []);

  const handleAssign = async (firId: string) => {
    const officerName = selectedOfficer[firId];
    if (!officerName) {
      toast.error("Please select an officer first!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8004/assign-officer", {
        fir_id: firId,
        officer_name: officerName,
      });

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      toast.success(res.data.message);

      // Find the FIR being assigned
      const assignedFir = unassignedFirs.find((f: any) => f.reference_id === firId);

      // Move it from unassigned to assigned list
      setUnassignedFirs(prev => prev.filter((f: any) => f.reference_id !== firId));
      setAssignedFirs(prev => [...prev, {
        ...assignedFir,
        assigned_officer: officerName,
        status: "assigned"
      }]);

      // Update officer active cases in UI
      setOfficers(prev => prev.map((o: any) =>
        o.name === officerName
          ? { ...o, active_cases: o.active_cases + 1 }
          : o
      ));

    } catch {
      toast.error("Failed to assign officer.");
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Available" ? (
      <Badge className="bg-secondary">{status}</Badge>
    ) : (
      <Badge className="bg-warning">{status}</Badge>
    );
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="Police Assignment">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Police Assignment</h1>
          <p className="text-muted-foreground mt-1">Assign FIRs to police officers</p>
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
                  <div className="text-2xl font-bold text-secondary">
                    {officers.filter((o: any) => o.status === "Available").length}
                  </div>
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
            {unassignedFirs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No unassigned FIRs at the moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">FIR ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Reported By</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Assign To</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedFirs.map((fir: any) => (
                      <tr key={fir.reference_id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{fir.reference_id}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{fir.crime_category}</Badge>
                        </td>
                        <td className="py-3 px-4">{fir.full_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.location}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.date_of_incident}</td>
                        <td className="py-3 px-4">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={selectedOfficer[fir.reference_id] || ""}
                            onChange={(e) => setSelectedOfficer(prev => ({
                              ...prev,
                              [fir.reference_id]: e.target.value
                            }))}
                          >
                            <option value="">Select Officer</option>
                            {officers
                              .filter((o: any) => o.status === "Available")
                              .map((o: any) => (
                                <option key={o.name} value={o.name}>
                                  {o.name} ({o.role})
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary-hover"
                            onClick={() => handleAssign(fir.reference_id)}
                          >
                            Assign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned FIRs */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned FIRs</CardTitle>
            <CardDescription>FIRs that have been assigned to officers</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedFirs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No assigned FIRs yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">FIR ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Reported By</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Assigned Officer</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedFirs.map((fir: any) => (
                      <tr key={fir.reference_id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{fir.reference_id}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{fir.crime_category}</Badge>
                        </td>
                        <td className="py-3 px-4">{fir.full_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.location}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.date_of_incident}</td>
                        <td className="py-3 px-4 font-medium text-primary">{fir.assigned_officer}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500 text-white">Assigned</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Officers List */}
        <Card>
          <CardHeader>
            <CardTitle>Police Officers</CardTitle>
            <CardDescription>View officer workload and availability</CardDescription>
          </CardHeader>
          <CardContent>
            {officers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No officers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Active Cases</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officers.map((officer: any) => (
                      <tr key={officer.name} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{officer.name}</td>
                        <td className="py-3 px-4">{officer.role}</td>
                        <td className="py-3 px-4 text-muted-foreground">{officer.email}</td>
                        <td className="py-3 px-4 text-center">{officer.active_cases}</td>
                        <td className="py-3 px-4">{getStatusBadge(officer.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default PoliceAssignment;