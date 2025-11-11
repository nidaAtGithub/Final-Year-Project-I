import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, Lock, Download, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const navItems = [
    { label: "User Management", icon: Users },
    { label: "FIR Management", icon: Shield },
    { label: "Police Assignment", icon: Lock },
    { label: "Reports", icon: Lock, active: true },
    { label: "System Logs", icon: Lock },
  ];

  const monthlyData = [
    { month: "Jan", firs: 120 },
    { month: "Feb", firs: 150 },
    { month: "Mar", firs: 180 },
    { month: "Apr", firs: 140 },
    { month: "May", firs: 200 },
    { month: "Jun", firs: 170 },
  ];

  const crimeTypeData = [
    { name: "Theft", value: 35, color: "#3B82F6" },
    { name: "Fraud", value: 25, color: "#10B981" },
    { name: "Assault", value: 20, color: "#F59E0B" },
    { name: "Cybercrime", value: 15, color: "#EF4444" },
    { name: "Others", value: 5, color: "#8B5CF6" },
  ];

  const resolutionData = [
    { month: "Jan", resolved: 95, pending: 25 },
    { month: "Feb", resolved: 110, pending: 40 },
    { month: "Mar", resolved: 145, pending: 35 },
    { month: "Apr", resolved: 115, pending: 25 },
    { month: "May", resolved: 165, pending: 35 },
    { month: "Jun", resolved: 140, pending: 30 },
  ];

  return (
    <DashboardLayout role="admin" navItems={navItems} title="Reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive system reports and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button className="bg-primary hover:bg-primary-hover">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">1,240</div>
                  <div className="text-sm text-muted-foreground">Total FIRs</div>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="mt-2 flex items-center text-sm text-secondary">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-secondary">920</div>
                  <div className="text-sm text-muted-foreground">Resolved Cases</div>
                </div>
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                74.2% resolution rate
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">185</div>
                  <div className="text-sm text-muted-foreground">Under Investigation</div>
                </div>
                <BarChart3 className="w-8 h-8 text-warning" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                14.9% of total
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-destructive">135</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <BarChart3 className="w-8 h-8 text-destructive" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                10.9% of total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly FIRs Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly FIRs Trend</CardTitle>
              <CardDescription>FIRs filed over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="firs" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crime Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Type Distribution</CardTitle>
              <CardDescription>Breakdown by crime category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={crimeTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {crimeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resolution Rate */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resolution Rate Trend</CardTitle>
              <CardDescription>Comparison of resolved vs pending cases</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="pending" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
