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
      {}
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
  
   <CardContent>
    <div className="grid md:grid-cols-3 gap-4">
      <Link to="/citizen/dashboard/file-fir">
        <Button className="w-full h-auto py-6 flex flex-col gap-2 bg-primary hover:bg-primary-hover">
          <Plus className="w-6 h-6" />
          <span>File New FIR</span>
        </Button>
      </Link>

      <Link to="/citizen/dashboard/track-status">
        <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 border-border/50">
          <Search className="w-6 h-6" />
          <span>Track FIR Status</span>
        </Button>
      </Link>

      <Link to="/citizen/dashboard/notifications">
        <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 border-border/50">
          <Bell className="w-6 h-6" />
          <span>View Notifications</span>
        </Button>
      </Link>
    </div>
  </CardContent>

  </DashboardLayout>
);
}; 

export default CitizenDashboard;
