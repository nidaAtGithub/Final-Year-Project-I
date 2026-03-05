import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Lock, Search, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

const FirManagement = () => {
  const [firs, setFirs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0, submitted: 0, assigned: 0,
    under_review: 0, resolved: 0, rejected: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedFir, setSelectedFir] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield, active: true },
    { label: "Police Assignment", icon: Lock },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock },
  ];

  // Fetch stats
  const fetchStats = () => {
    axios.get("http://localhost:8005/admin/fir-stats")
      .then(res => setStats(res.data))
      .catch(() => toast.error("Failed to load stats"));
  };

  // Fetch FIRs with filters
  const fetchFirs = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (categoryFilter !== "all") params.append("crime_category", categoryFilter);
    if (searchQuery) params.append("search", searchQuery);

    axios.get(`http://localhost:8005/admin/get-all-firs?${params.toString()}`)
      .then(res => setFirs(res.data.firs))
      .catch(() => toast.error("Failed to load FIRs"));
  };

  useEffect(() => {
    fetchStats();
    fetchFirs();
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchFirs();
  };

  const handleDelete = async (referenceId: string) => {
    if (!confirm(`Are you sure you want to delete FIR ${referenceId}?`)) return;

    try {
      const res = await axios.delete(`http://localhost:8005/admin/delete-fir/${referenceId}`);
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      toast.success(res.data.message);
      setFirs(prev => prev.filter((f: any) => f.reference_id !== referenceId));
      fetchStats(); // refresh stats
    } catch {
      toast.error("Failed to delete FIR.");
    }
  };

  const handleViewDetails = async (referenceId: string) => {
    try {
      const res = await axios.get(`http://localhost:8001/get-fir-details/${referenceId}`);
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      setSelectedFir(res.data.fir);
      setShowModal(true);
    } catch {
      toast.error("Failed to load FIR details.");
    }
  };

  const handleStatusUpdate = async (firId: string, newStatus: string) => {
    try {
      const res = await axios.post("http://localhost:8005/update-fir-status", {
        fir_id: firId,
        status: newStatus
      });
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      toast.success(res.data.message);
      fetchFirs();
      fetchStats();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      submitted: "bg-blue-500 text-white",
      assigned: "bg-yellow-500 text-white",
      under_review: "bg-orange-500 text-white",
      resolved: "bg-green-500 text-white",
      rejected: "bg-red-500 text-white",
    };
    return (
      <Badge className={styles[status] || "bg-gray-400 text-white"}>
        {status?.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="FIR Management">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">FIR Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all FIRs in the system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Submitted", value: stats.submitted, color: "text-blue-500" },
            { label: "Assigned", value: stats.assigned, color: "text-yellow-500" },
            { label: "Under Review", value: stats.under_review, color: "text-orange-500" },
            { label: "Resolved", value: stats.resolved, color: "text-green-500" },
            { label: "Rejected", value: stats.rejected, color: "text-red-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by FIR ID, type, or reporter... (press Enter)"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <select
                className="px-4 py-2 border border-input rounded-md bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="theft">Theft</option>
                <option value="fraud">Fraud</option>
                <option value="assault">Assault</option>
                <option value="cybercrime">Cybercrime</option>
                <option value="vehicle">Vehicle Related</option>
                <option value="other">Other</option>
              </select>
              <select
                className="px-4 py-2 border border-input rounded-md bg-background"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="assigned">Assigned</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* FIRs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All FIRs</CardTitle>
            <CardDescription>Comprehensive list of all filed FIRs</CardDescription>
          </CardHeader>
          <CardContent>
            {firs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No FIRs found.</p>
            ) : (
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
                    {firs.map((fir: any) => (
                      <tr key={fir.reference_id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{fir.reference_id}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{fir.crime_category}</Badge>
                        </td>
                        <td className="py-3 px-4">{fir.full_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {fir.assigned_officer || "Unassigned"}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(fir.status)}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.location}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fir.date_of_incident}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 items-center">
                            {/* View details */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(fir.reference_id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {/* Status update dropdown — only for submitted/assigned */}
                            {["submitted", "assigned", "under_review"].includes(fir.status) && (
                              <select
                                className="text-xs border rounded px-1 py-1"
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleStatusUpdate(fir.reference_id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                              >
                                <option value="">Update</option>
                                <option value="under_review">Under Review</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            )}

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(fir.reference_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FIR Detail Modal */}
        {showModal && selectedFir && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">FIR Details — {selectedFir.reference_id}</h2>
                <Button variant="ghost" onClick={() => setShowModal(false)}>✕</Button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Full Name", selectedFir.full_name],
                  ["CNIC", selectedFir.cnic],
                  ["Phone", selectedFir.phone],
                  ["Email", selectedFir.email],
                  ["Crime Category", selectedFir.crime_category],
                  ["Location", selectedFir.location],
                  ["Date", selectedFir.date_of_incident],
                  ["Time", selectedFir.time_of_incident],
                  ["Status", selectedFir.status],
                  ["Assigned Officer", selectedFir.assigned_officer || "Unassigned"],
                  ["Citizen Narrative", selectedFir.citizen_narrative],
                  ["Suspect Info", selectedFir.suspect_info],
                  ["Incident Description", selectedFir.incident_description],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <span className="font-semibold w-44 shrink-0">{label}:</span>
                    <span className="text-muted-foreground">{value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default FirManagement;