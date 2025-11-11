import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Users, FileText, Shield, BarChart3, Settings, Database, Activity } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const navItems = [
    { label: "Dashboard", icon: BarChart3, active: true },
    { label: "User Management", icon: Users, badge: 2 },
    { label: "FIR Management", icon: FileText },
    { label: "Police Assignment", icon: Shield },
    { label: "Blockchain Ledger", icon: Database },
    { label: "AI Monitoring", icon: Activity },
    { label: "Reports & Analytics", icon: BarChart3 },
    { label: "System Logs", icon: Settings },
  ];

  const firData = [
    { month: "Jan", filed: 120, approved: 110, closed: 95 },
    { month: "Feb", filed: 150, approved: 140, closed: 120 },
    { month: "Mar", filed: 180, approved: 170, closed: 150 },
    { month: "Apr", filed: 160, approved: 155, closed: 140 },
    { month: "May", filed: 190, approved: 180, closed: 165 },
  ];

  const crimeTypeData = [
    { type: "Theft", count: 245 },
    { type: "Fraud", count: 189 },
    { type: "Assault", count: 156 },
    { type: "Cybercrime", count: 134 },
    { type: "Vandalism", count: 98 },
  ];

  const recentActivities = [
    { user: "Police Officer SI Ayesha Malik", action: "Approved FIR #2025001456", time: "5 min ago", type: "success" },
    { user: "Citizen Ahmed Khan", action: "Filed new FIR #2025001457", time: "12 min ago", type: "info" },
    { user: "Admin Zubair Hassan", action: "Assigned FIR to Station 12", time: "1 hour ago", type: "info" },
    { user: "System", action: "Blockchain verification completed", time: "2 hours ago", type: "success" },
  ];

  return (
    <DashboardLayout 
      role="admin" 
      navItems={navItems}
      title="Admin Portal"
    >
      {/* System Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">1,247</p>
                <p className="text-xs text-muted-foreground mt-1">+12% this month</p>
              </div>
              <Users className="w-10 h-10 text-primary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Officers</p>
                <p className="text-3xl font-bold text-secondary">156</p>
                <p className="text-xs text-muted-foreground mt-1">89% online now</p>
              </div>
              <Shield className="w-10 h-10 text-secondary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total FIRs</p>
                <p className="text-3xl font-bold text-accent">12,543</p>
                <p className="text-xs text-muted-foreground mt-1">190 this week</p>
              </div>
              <FileText className="w-10 h-10 text-accent/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-3xl font-bold text-secondary">98%</p>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </div>
              <Activity className="w-10 h-10 text-secondary/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle>Admin Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50">
              <Shield className="w-6 h-6" />
              <span>Assign FIRs</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50">
              <Database className="w-6 h-6" />
              <span>View Blockchain</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50">
              <BarChart3 className="w-6 h-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>FIR Trends (Last 5 Months)</CardTitle>
            <CardDescription>Overview of FIR filing and resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={firData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="filed" stroke="hsl(var(--primary))" strokeWidth={2} name="Filed" />
                <Line type="monotone" dataKey="approved" stroke="hsl(var(--secondary))" strokeWidth={2} name="Approved" />
                <Line type="monotone" dataKey="closed" stroke="hsl(var(--accent))" strokeWidth={2} name="Closed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Crime Types Distribution</CardTitle>
            <CardDescription>Most common crime categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crimeTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent System Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Real-time activity logs across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-secondary' : 'bg-primary'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-secondary/30">
          <CardHeader className="bg-secondary/5">
            <CardTitle className="text-secondary flex items-center gap-2">
              <Database className="w-5 h-5" />
              Blockchain Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Blocks:</span>
                <span className="font-semibold">12,543</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Verified:</span>
                <span className="font-semibold">2 min ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Integrity:</span>
                <span className="font-semibold text-secondary">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-accent flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Classifications Today:</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy Rate:</span>
                <span className="font-semibold">96.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-secondary">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU Usage:</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Memory:</span>
                <span className="font-semibold">6.2 / 16 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage:</span>
                <span className="font-semibold">124 / 500 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
