import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Bell, User, LogOut, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/AuthContext"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const CitizenDashboard = () => {
  const [myFIRs, setMyFIRs] = useState([]);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 useEffect(() => {
  const fetchFIRs = async () => {
    try {
      {/*const response = await axios.get("http://localhost:800/get-firs");*/}
      const response = await axios.get("http://localhost:8000/get-firs");
      setMyFIRs(response.data.firs);
    } catch (error) {
      console.error("Error fetching FIRs:", error);
    }
  };

  fetchFIRs();
}, []);



const handleViewDetails = async (reference_id: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/get-fir-details/${reference_id}`);
    const data = await res.json();

    if (data.fir) {
      setSelectedFIR(data.fir);
      setIsModalOpen(true); 
    } else {
      console.error("FIR not found");
    }
  } catch (error) {
    console.error("Error fetching FIR details:", error);
  }
};
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

const [notifications, setNotifications] = useState(3);

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
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold mb-4">My Filed FIRs</h2>

      {myFIRs.length === 0 ? (
        <p className="text-gray-500">No FIRs found.</p>
      ) : (
        myFIRs.map((fir, index) => (
          <Card key={index} className="shadow-sm border rounded-xl">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {fir.reference_id}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {fir.crime_category} • {fir.location}
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Under Investigation
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 mt-4 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500">Date Filed</p>
                  <p className="font-medium">
                    {fir.created_at
                      ? new Date(fir.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Assigned Officer</p>
                  <p className="font-medium italic text-gray-800">
                    Not Assigned Yet
                  </p>
                </div>

                <div className="flex justify-end items-center md:justify-end mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={() => handleViewDetails(fir.reference_id)}
                  >
                    View Details
                  </Button>


                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* FIR Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>FIR Details</DialogTitle>
          </DialogHeader>

          {selectedFIR ? (
            <div className="space-y-3">
              <p><strong>Reference ID:</strong> {selectedFIR.reference_id}</p>
              <p><strong>Full Name:</strong> {selectedFIR.full_name}</p>
              <p><strong>CNIC:</strong> {selectedFIR.cnic}</p>
              <p><strong>Email:</strong> {selectedFIR.email}</p>
              <p><strong>Phone:</strong> {selectedFIR.phone}</p>
              <p><strong>Crime Category:</strong> {selectedFIR.crime_category}</p>
              <p><strong>Location:</strong> {selectedFIR.location}</p>
              <p><strong>Date of Incident:</strong> {selectedFIR.date_of_incident}</p>

              {selectedFIR.suspect_info && (
                <p><strong>Suspect Info:</strong> {selectedFIR.suspect_info}</p>
              )}

              {selectedFIR.citizen_narrative && (
                <p><strong>Citizen Narrative:</strong> {selectedFIR.citizen_narrative}</p>
              )}

              {selectedFIR.incident_description && (
                <div className="mt-4">
                  <p className="font-semibold mb-1">Incident Description:</p>
                  <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto whitespace-pre-line">
                    {selectedFIR.incident_description}
                  </div>
                </div>
              )}

              <p><strong>Status:</strong> {selectedFIR.status || "Under Investigation"}</p>

              {selectedFIR.created_at && (
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedFIR.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <p>No FIR details available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>

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
