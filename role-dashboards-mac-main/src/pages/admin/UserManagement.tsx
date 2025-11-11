import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Lock, Search, UserPlus, Edit, Trash2 } from "lucide-react";

const UserManagement = () => {
  const users = [
    { id: "U001", name: "Ahmed Khan", email: "ahmed@example.com", role: "Citizen", status: "Active", registeredDate: "2025-01-15" },
    { id: "U002", name: "Fatima Ali", email: "fatima@police.gov.pk", role: "Police", status: "Active", registeredDate: "2024-11-20" },
    { id: "U003", name: "Hassan Mahmood", email: "hassan@example.com", role: "Citizen", status: "Active", registeredDate: "2025-02-10" },
    { id: "U004", name: "Ayesha Rasheed", email: "ayesha@police.gov.pk", role: "Police", status: "Active", registeredDate: "2024-12-05" },
    { id: "U005", name: "Bilal Ahmed", email: "bilal@example.com", role: "Citizen", status: "Suspended", registeredDate: "2025-01-25" },
  ];

  const navItems = [
    { label: "User Management", icon: Users, active: true },
    { label: "FIR Management", icon: Shield },
    { label: "Police Assignment", icon: Lock },
    { label: "Reports", icon: Lock },
    { label: "System Logs", icon: Lock },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Police":
        return <Badge className="bg-secondary">{role}</Badge>;
      case "Admin":
        return <Badge className="bg-accent">{role}</Badge>;
      default:
        return <Badge className="bg-primary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-secondary">{status}</Badge>
    ) : (
      <Badge variant="destructive">{status}</Badge>
    );
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search by name, email, or ID..." className="pl-10" />
              </div>
              <select className="px-4 py-2 border border-input rounded-md bg-background">
                <option>All Roles</option>
                <option>Citizen</option>
                <option>Police</option>
                <option>Admin</option>
              </select>
              <select className="px-4 py-2 border border-input rounded-md bg-background">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Total {users.length} users registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">User ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Registered</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{user.id}</td>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.registeredDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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

export default UserManagement;
