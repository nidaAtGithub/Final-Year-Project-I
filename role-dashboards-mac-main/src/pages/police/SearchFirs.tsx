import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const SearchFirs = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: false },
    { label: "Under Investigation", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: true },
    { label: "Notifications", icon: Bell, active: false, badge: 5 },
    { label: "Profile", icon: User, active: false },
  ];

  const searchResults = [
    {
      id: "FIR-2025-001234",
      complainant: "Ahmed Khan",
      category: "Theft",
      location: "Model Town, Lahore",
      date: "2025-01-15",
      status: "Under Investigation",
      officer: "SI Ayesha Malik",
    },
    {
      id: "FIR-2025-001189",
      complainant: "Fatima Noor",
      category: "Fraud",
      location: "DHA, Karachi",
      date: "2025-01-10",
      status: "Approved",
      officer: "ASI Bilal Yousaf",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Investigation": return "bg-warning/10 text-warning border-warning/20";
      case "Approved": return "bg-secondary/10 text-secondary border-secondary/20";
      case "Pending": return "bg-accent/10 text-accent border-accent/20";
      case "Closed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Search FIRs</h2>
          <p className="text-muted-foreground mt-1">Find and filter FIRs across all statuses</p>
        </div>

        {/* Advanced Search */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Advanced Search</CardTitle>
            <CardDescription>Use filters to find specific FIRs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">FIR ID or Keyword</label>
                <Input placeholder="Enter FIR ID or search keyword..." className="border-border/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="investigation">Under Investigation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="assault">Assault</SelectItem>
                    <SelectItem value="cybercrime">Cybercrime</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input type="date" className="border-border/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input type="date" className="border-border/50" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary-hover">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="border-border/50">
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>{searchResults.length} FIRs found</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((fir) => (
                <Card key={fir.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{fir.id}</h4>
                        <p className="text-sm text-muted-foreground">{fir.complainant}</p>
                      </div>
                      <Badge className={getStatusColor(fir.status)}>
                        {fir.status}
                      </Badge>
                    </div>
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
                      <div>
                        <p className="text-muted-foreground">Officer</p>
                        <p className="font-medium">{fir.officer}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-border/50">
                      View Full Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SearchFirs;
