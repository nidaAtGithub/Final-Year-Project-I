import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, FileText, Clock, CheckCircle, XCircle, Search, Bell, User, Filter } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const PoliceDashboard = () => {
  const [notifications] = useState(5);
  
  const pendingFIRs = [
    { id: "FIR2025001456", citizen: "Ahmed Khan", type: "Theft", priority: "High", date: "2025-01-20", time: "10:30 AM" },
    { id: "FIR2025001455", citizen: "Fatima Noor", type: "Assault", priority: "Critical", date: "2025-01-20", time: "09:15 AM" },
    { id: "FIR2025001452", citizen: "Hassan Mahmood", type: "Vandalism", priority: "Medium", date: "2025-01-19", time: "04:20 PM" },
  ];

  const activeCases = [
    { id: "FIR2025001234", citizen: "Zainab Hussain", type: "Fraud", status: "Evidence Collection", days: 5 },
    { id: "FIR2025001189", citizen: "Bilal Yousaf", type: "Cybercrime", status: "Suspect Identified", days: 10 },
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "High": return "bg-warning/10 text-warning border-warning/20";
      case "Medium": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const navItems = [
    { label: "Dashboard", icon: Shield, active: true },
    { label: "Pending FIRs", icon: Clock, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle },
    { label: "Under Investigation", icon: FileText, badge: 8 },
    { label: "Closed Cases", icon: XCircle },
    { label: "Search FIRs", icon: Search },
    { label: "Notifications", icon: Bell, badge: notifications },
    { label: "Profile", icon: User },
  ];

  return (
    <DashboardLayout 
      role="police" 
      navItems={navItems}
      title="Police Portal"
    >
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-warning">12</p>
              </div>
              <Clock className="w-10 h-10 text-warning/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Investigation</p>
                <p className="text-3xl font-bold text-secondary">8</p>
              </div>
              <FileText className="w-10 h-10 text-secondary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-3xl font-bold text-primary">15</p>
              </div>
              <CheckCircle className="w-10 h-10 text-primary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed This Month</p>
                <p className="text-3xl font-bold text-foreground">42</p>
              </div>
              <XCircle className="w-10 h-10 text-muted-foreground/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle>Search & Filter FIRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search by FIR ID, Citizen Name, or Type..." 
                className="border-border/50"
              />
            </div>
            <Button variant="outline" className="border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-primary hover:bg-primary-hover">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending FIRs - High Priority */}
      <Card className="mb-8 border-destructive/30">
        <CardHeader className="bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-destructive">⚠️ Pending FIRs - Requires Immediate Attention</CardTitle>
              <CardDescription>Review and approve/reject these reports</CardDescription>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
              {pendingFIRs.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {pendingFIRs.map((fir) => (
              <div key={fir.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{fir.id}</h4>
                    <Badge variant="outline" className={getPriorityColor(fir.priority)}>
                      {fir.priority}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Citizen:</span> {fir.citizen}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {fir.type}
                    </div>
                    <div>
                      <span className="font-medium">Filed:</span> {fir.date} at {fir.time}
                    </div>
                    <div className="text-warning font-medium">
                      ⏱️ Pending since: {Math.floor(Math.random() * 12) + 1}h
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50">
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Investigations */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Under Investigation - Your Active Cases</CardTitle>
              <CardDescription>Cases currently assigned to you</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-border/50">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCases.map((fir) => (
              <div key={fir.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{fir.id}</h4>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      {fir.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Citizen:</span> {fir.citizen}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {fir.type}
                    </div>
                    <div>
                      <span className="font-medium">Days Active:</span> {fir.days} days
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" className="border-border/50">
                    Update Status
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary-hover">
                    View Case
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistance */}
      <Card className="mt-8 border-accent/30">
        <CardHeader className="bg-accent/5">
          <CardTitle className="text-accent">🤖 AI Assistant Available</CardTitle>
          <CardDescription>Get help with procedures, legal guidelines, and case management</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button variant="outline" className="border-border/50">
              Procedural Guidance
            </Button>
            <Button variant="outline" className="border-border/50">
              Legal Knowledge Base
            </Button>
            <Button variant="outline" className="border-border/50">
              Case Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PoliceDashboard;
