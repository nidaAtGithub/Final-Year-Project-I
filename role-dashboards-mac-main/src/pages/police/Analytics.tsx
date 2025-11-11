import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, BarChart3, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const navItems = [
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Active Cases", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: FileText, active: false },
    { label: "Analytics", icon: BarChart3, active: true },
    { label: "Settings", icon: Settings, active: false },
  ];

  const monthlyData = [
    { month: "Aug", filed: 45, resolved: 38 },
    { month: "Sep", filed: 52, resolved: 41 },
    { month: "Oct", filed: 61, resolved: 55 },
    { month: "Nov", filed: 58, resolved: 49 },
    { month: "Dec", filed: 67, resolved: 52 },
    { month: "Jan", filed: 71, resolved: 58 },
  ];

  const crimeData = [
    { name: "Theft", value: 35 },
    { name: "Fraud", value: 25 },
    { name: "Vehicle Theft", value: 18 },
    { name: "Cybercrime", value: 12 },
    { name: "Assault", value: 10 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground mt-1">Crime statistics and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Cases (Month)</CardDescription>
              <CardTitle className="text-3xl">71</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600">↑ 12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolved Cases</CardDescription>
              <CardTitle className="text-3xl">58</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600">↑ 8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolution Rate</CardDescription>
              <CardTitle className="text-3xl">81.7%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600">↑ 3.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Resolution Time</CardDescription>
              <CardTitle className="text-3xl">12.5d</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-600">↓ 2.1 days from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly FIR Trends</CardTitle>
              <CardDescription>Filed vs Resolved cases over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="filed" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crime Category Distribution</CardTitle>
              <CardDescription>Breakdown of FIRs by crime type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={crimeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {crimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
