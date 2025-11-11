import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, MapPin, Calendar, FileCheck, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import axios from "axios";

const MyFirs = () => {
  const navItems = [
    { label: "File FIR", icon: FileText, active: false },
    { label: "My FIRs", icon: FileCheck, active: true },
    { label: "Track Status", icon: MapPin, active: false },
    { label: "Notifications", icon: Calendar, active: false, badge: 3 },
  ];

  const [myFIRs, setMyFIRs] = useState([]);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFIRs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-firs");
        setMyFIRs(response.data.firs);
      } catch (error) {
        console.error("Error fetching FIRs:", error);
      }
    };

    fetchFIRs();
  }, []);

  const handleViewDetails = async (referenceId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/get-fir-details/${referenceId}`);
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

  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">My FIRs</h2>
          <p className="text-muted-foreground mt-1">
            View and track all your filed reports
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by FIR ID, category, or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* My FIRs Section */}
        <div className="space-y-4 p-4 bg-card rounded-xl shadow-sm">
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
                        {fir.reference_id || "FIR"}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {fir.crime_category} • {fir.location}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {fir.status || "Under Investigation"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 mt-4 text-sm text-gray-700">
                    <div>
                      <p className="text-gray-500">Date Filed</p>
                      <p className="font-medium">
                        {fir.created_at
                          ? new Date(fir.created_at).toLocaleDateString("en-PK")
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Assigned Officer</p>
                      <p className="font-medium italic text-gray-800">
                        {fir.officer || "Not Assigned Yet"}
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
        </div>

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
    </DashboardLayout>
  );
};

export default MyFirs;
