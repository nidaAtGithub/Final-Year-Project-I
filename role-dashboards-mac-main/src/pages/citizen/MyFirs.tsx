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
  const [filteredFIRs, setFilteredFIRs] = useState([]); // For search
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchFIRs = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get(`http://localhost:8001/get-firs?email=${userEmail}`);
        setMyFIRs(response.data.firs);
        setFilteredFIRs(response.data.firs); // initially show all
      } catch (error) {
        console.error("Error fetching FIRs:", error);
      }
    };

    fetchFIRs();
  }, [userEmail]);

  // Search functionality
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = myFIRs.filter(
      (fir) =>
        (fir.reference_id && fir.reference_id.toLowerCase().includes(term)) ||
        (fir.crime_category && fir.crime_category.toLowerCase().includes(term)) ||
        (fir.location && fir.location.toLowerCase().includes(term))
    );
    setFilteredFIRs(filtered);
  }, [searchTerm, myFIRs]);

  const handleViewDetails = async (referenceId: string) => {
    if (!userEmail) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8001/get-fir-details/${referenceId}?email=${userEmail}`
      );

      if (res.data.fir) {
        setSelectedFIR(res.data.fir);
        setIsModalOpen(true);
      } else {
        console.error("FIR not found or access denied");
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {filteredFIRs.length === 0 ? (
            <p className="text-gray-500">No FIRs found.</p>
          ) : (
            filteredFIRs.map((fir, index) => (
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

              {/* Evidence Section */}
              {selectedFIR.evidence_cids && selectedFIR.evidence_cids.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-lg font-semibold mb-3">Evidence</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedFIR.evidence_cids.map((cid: string, index: number) => {
                      const fileUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                          {/* Open Button */}
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Open File
                          </a>

                          {/* Try image preview */}
                          <div className="mt-2">
                            <img
                              src={fileUrl}
                              alt={`Evidence ${index + 1}`}
                              className="max-h-40 object-contain rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
