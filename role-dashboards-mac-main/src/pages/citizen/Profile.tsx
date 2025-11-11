import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Plus, Bell, User, Search, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "File New FIR", icon: Plus, active: false },
    { label: "My FIRs", icon: FileText, active: false },
    { label: "Track Status", icon: Search, active: false },
    { label: "Notifications", icon: Bell, active: false },
    { label: "Profile", icon: User, active: true },
  ];

  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">AK</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="border-border/50">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="border-border/50 md:col-span-2">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Total FIRs</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-warning">1</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-secondary">1</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Ahmed Khan" className="border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC Number</Label>
                  <Input id="cnic" defaultValue="42101-1234567-8" className="border-border/50" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="ahmed.khan@email.com" className="border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+92 300 1234567" className="border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="House 123, Street 4, Model Town, Lahore" className="border-border/50" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Lahore" className="border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input id="province" defaultValue="Punjab" className="border-border/50" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-primary hover:bg-primary-hover">Save Changes</Button>
                <Button variant="outline" className="border-border/50">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your password and security options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="border-border/50" />
              </div>
              <Button className="bg-primary hover:bg-primary-hover">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
