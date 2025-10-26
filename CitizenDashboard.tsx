import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Bell, User, LogOut, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const CitizenDashboard = () => {
  const [notifications] = useState(3);
  
  const myFIRs = [
    { id: "FIR2025001234", type: "Theft", status: "Under Investigation", date: "2025-01-15", officer: "SI Ayesha Malik" },
    { id: "FIR2025001189", type: "Cybercrime", status: "Approved", date: "2025-01-10", officer: "Inspector Imran Ahmed" },
    { id: "FIR2025001098", type: "Fraud", status: "Closed", date: "2024-12-28", officer: "ASI Zubair Hassan" },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Under Investigation": return <Clock className="w-4 h-4" />;
      case "Approved": return <CheckCircle className="w-4 h-4" />;
      case "Closed": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Under Investigation": return "bg-warning/10 text-warning border-warning/20";
      case "Approved": return "bg-secondary/10 text-secondary border-secondary/20";
      case "Closed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const navItems = [
    { label: "Dashboard", icon: FileText, active: true },
    { label: "File New FIR", icon: Plus },
    { label: "My FIRs", icon: FileText },
    { label: "Track Status", icon: Search },
    { label: "Notifications", icon: Bell, badge: notifications },
    { label: "Profile", icon: User },
    { label: "AI Chatbot", icon: User, path: "/citizen/dashboard/ai-chatbot" },
  ];

  return (
    <DashboardLayout 
      role="citizen" 
      navItems={navItems}
      title="Citizen Portal"
    >
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total FIRs</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <FileText className="w-10 h-10 text-primary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-warning">1</p>
              </div>
              <Clock className="w-10 h-10 text-warning/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-secondary">1</p>
              </div>
              <CheckCircle className="w-10 h-10 text-secondary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-accent">1</p>
              </div>
              <AlertCircle className="w-10 h-10 text-accent/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-auto py-6 flex flex-col gap-2 bg-primary hover:bg-primary-hover">
              <Plus className="w-6 h-6" />
              <span>File New FIR</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50">
              <Search className="w-6 h-6" />
              <span>Track FIR Status</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50">
              <Bell className="w-6 h-6" />
              <span>View Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My FIRs */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My FIRs</CardTitle>
              <CardDescription>Recently filed FIRs and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-border/50">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myFIRs.map((fir) => (
              <div key={fir.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{fir.id}</h4>
                    <Badge variant="outline" className={getStatusColor(fir.status)}>
                      {getStatusIcon(fir.status)}
                      <span className="ml-1">{fir.status}</span>
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Type:</span> {fir.type}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {fir.date}
                    </div>
                    <div>
                      <span className="font-medium">Officer:</span> {fir.officer}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4 border-border/50">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="mt-8 border-border/50">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Bell className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">FIR Status Update</p>
                <p className="text-sm text-muted-foreground">Your FIR #FIR2025001234 is now under investigation</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Officer Assigned</p>
                <p className="text-sm text-muted-foreground">SI Ayesha Malik has been assigned to your case</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
