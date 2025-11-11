import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, CheckCircle, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PoliceProfile = () => {
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: false },
    { label: "Under Investigation", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: false },
    { label: "Notifications", icon: Bell, active: false, badge: 5 },
    { label: "Profile", icon: User, active: true },
  ];

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Officer Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your profile and performance</p>
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
                <AvatarFallback className="text-2xl bg-secondary text-white">
                  <Shield className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <Badge className="mb-2 bg-secondary text-white">Sub Inspector</Badge>
              <h3 className="font-semibold text-lg">Ayesha Malik</h3>
              <p className="text-sm text-muted-foreground">Badge #SI-2345</p>
              <Button variant="outline" size="sm" className="mt-4 border-border/50">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="border-border/50 md:col-span-2">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">45</p>
                  <p className="text-sm text-muted-foreground">Cases Handled</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-secondary">38</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-warning">7</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">84%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Officer Information</CardTitle>
            <CardDescription>Your official details and credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Ayesha Malik" className="border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badgeNumber">Badge Number</Label>
                  <Input id="badgeNumber" defaultValue="SI-2345" className="border-border/50" disabled />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input id="rank" defaultValue="Sub Inspector" className="border-border/50" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Police Station</Label>
                  <Input id="station" defaultValue="Model Town Police Station" className="border-border/50" disabled />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="ayesha.malik@punjabpolice.gov.pk" className="border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+92 300 9876543" className="border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="Police Lines, Model Town, Lahore" className="border-border/50" />
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
            <CardDescription>Change your password and security preferences</CardDescription>
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

export default PoliceProfile;
