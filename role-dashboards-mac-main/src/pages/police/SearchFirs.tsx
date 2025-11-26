// src/pages/police/SearchFirs.tsx
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Clock, FolderOpen, XCircle, Search, Bell, User, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api";

interface FIR {
  reference_id: string;
  full_name: string;
  crime_category: string;
  location: string;
  date_of_incident: string;
  status: string;
  created_at: string;
  // optional fields for modal details
  cnic?: string;
  phone?: string;
  email?: string;
  time_of_incident?: string;
  suspect_info?: string;
  citizen_narrative?: string;
  incident_description?: string;
  status_notes?: string;
}

const SearchFirs = () => {
  // ----- Core search state -----
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("keyword");
  const [searchResults, setSearchResults] = useState<FIR[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // ----- Modal state -----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFIR, setSelectedFIR] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // ----- Filter state -----
  const [useFilters, setUseFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // ----- Sort state -----
  const [sortOption, setSortOption] = useState<'date_desc' | 'date_asc' | 'status'>('date_desc');

  // ----- Navigation items -----
  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "Pending FIRs", icon: Clock, active: false, badge: 12 },
    { label: "Approved FIRs", icon: CheckCircle, active: false },
    { label: "Under Investigation", icon: FolderOpen, active: false, badge: 8 },
    { label: "Closed Cases", icon: XCircle, active: false },
    { label: "Search FIRs", icon: Search, active: true },
    { label: "Notifications", icon: Bell, active: false, badge: 5 },
    { label: "Profile", icon: User, active: false },
  ];

  // Helper to sort FIRs according to selected option
  const sortFIRs = (firs: FIR[]) => {
    const sorted = [...firs];
    if (sortOption === 'date_desc') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === 'date_asc') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortOption === 'status') {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    }
    return sorted;
  };

  // UI component for sort selection
  const sortSelect = (
    <div className="flex items-center space-x-2 mb-4">
      <label className="text-sm font-medium">Sort By</label>
      <Select value={sortOption} onValueChange={(v) => setSortOption(v as any)}>
        <SelectTrigger className="border-border/50 w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date_desc">Date (new → old)</SelectItem>
          <SelectItem value="date_asc">Date (old → new)</SelectItem>
          <SelectItem value="status">Status (A‑Z)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // ----- API calls -----
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_FIRS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_type: searchType,
          query: searchQuery,
          page: currentPage,
          per_page: 10,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const sorted = sortFIRs(data.results);
        setSearchResults(sorted);
        setTotalResults(data.pagination.total);
        setTotalPages(data.pagination.total_pages);
        toast.success(`Found ${data.pagination.total} result(s)`);
      } else {
        toast.error(data.error || "Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to connect to backend");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchType("keyword");
    setSearchResults([]);
    setTotalResults(0);
    setCurrentPage(1);
    setTotalPages(0);
    setUseFilters(false);
    setFilterStatus("");
    setFilterCategory("");
    setFilterLocation("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const handleFilter = async () => {
    setIsSearching(true);
    setUseFilters(true);
    try {
      const response = await fetch(API_ENDPOINTS.FILTER_FIRS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: filterStatus || undefined,
          crime_category: filterCategory || undefined,
          location: filterLocation || undefined,
          start_date: filterStartDate || undefined,
          end_date: filterEndDate || undefined,
          page: currentPage,
          per_page: 10,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const sorted = sortFIRs(data.results);
        setSearchResults(sorted);
        setTotalResults(data.pagination.total);
        setTotalPages(data.pagination.total_pages);
        toast.success(`Found ${data.pagination.total} result(s)`);
      } else {
        toast.error(data.error || "Filter failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Filter error:", error);
      toast.error("Failed to connect to backend");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Pagination effect – re‑run search/filter when page changes
  useEffect(() => {
    if (searchResults.length > 0) {
      if (useFilters) {
        handleFilter();
      } else if (searchQuery) {
        handleSearch();
      }
    }
  }, [currentPage]);

  const handleViewDetails = async (referenceId: string) => {
    setIsLoadingDetails(true);
    setIsModalOpen(true);
    try {
      const response = await fetch(API_ENDPOINTS.GET_FIR_DETAILS(referenceId));
      const data = await response.json();
      if (response.ok && data.fir) {
        setSelectedFIR(data.fir);
      } else {
        toast.error("Failed to load FIR details");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching FIR details:", error);
      toast.error("Failed to connect to backend");
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // ----- Print FIR Function -----
  const handlePrintFIR = () => {
    if (!selectedFIR) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to print FIR");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FIR - ${selectedFIR.reference_id}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
          .header p { margin: 5px 0 0; color: #666; }
          .meta-info { display: flex; justify-content: space-between; margin-bottom: 30px; background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; color: #2c3e50; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .field { margin-bottom: 10px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { font-weight: 500; font-size: 14px; }
          .narrative { background: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px; white-space: pre-line; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>First Information Report</h1>
          <p>Police Department • Government of Pakistan</p>
        </div>

        <div class="meta-info">
          <div>
            <div class="label">FIR Reference ID</div>
            <div class="value" style="font-size: 18px;">${selectedFIR.reference_id}</div>
          </div>
          <div style="text-align: right;">
            <div class="label">Date Filed</div>
            <div class="value">${new Date(selectedFIR.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Complainant Information</div>
          <div class="grid">
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${selectedFIR.full_name}</div>
            </div>
            <div class="field">
              <div class="label">CNIC</div>
              <div class="value">${selectedFIR.cnic || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="label">Phone Contact</div>
              <div class="value">${selectedFIR.phone || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value">${selectedFIR.email || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Incident Details</div>
          <div class="grid">
            <div class="field">
              <div class="label">Crime Category</div>
              <div class="value" style="text-transform: capitalize;">${selectedFIR.crime_category}</div>
            </div>
            <div class="field">
              <div class="label">Location</div>
              <div class="value">${selectedFIR.location}</div>
            </div>
            <div class="field">
              <div class="label">Date of Incident</div>
              <div class="value">${selectedFIR.date_of_incident}</div>
            </div>
            <div class="field">
              <div class="label">Time of Incident</div>
              <div class="value">${selectedFIR.time_of_incident || 'N/A'}</div>
            </div>
          </div>
        </div>

        ${selectedFIR.suspect_info ? `
        <div class="section">
          <div class="section-title">Suspect Information</div>
          <div class="narrative">${selectedFIR.suspect_info}</div>
        </div>
        ` : ''}

        ${selectedFIR.incident_description ? `
        <div class="section">
          <div class="section-title">Incident Description</div>
          <div class="narrative">${selectedFIR.incident_description}</div>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Current Status</div>
          <div class="field">
            <div class="label">Status</div>
            <div class="value">${selectedFIR.status}</div>
          </div>
          ${selectedFIR.status_notes ? `
          <div class="field" style="margin-top: 10px;">
            <div class="label">Status Notes</div>
            <div class="narrative">${selectedFIR.status_notes}</div>
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>This is a computer-generated document and does not require a signature.</p>
          <p>Generated on ${new Date().toLocaleString('en-PK')}</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Investigation":
        return "bg-warning/10 text-warning border-warning/20";
      case "Approved":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Pending":
        return "bg-accent/10 text-accent border-accent/20";
      case "Closed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout role="police" navItems={navItems} title="Police Officer Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Search FIRs</h2>
          <p className="text-muted-foreground mt-1">Find and filter FIRs across all statuses</p>
        </div>
        {/* Sort selector */}
        {sortSelect}
        {/* Search Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Search FIRs</CardTitle>
            <CardDescription>Search by FIR ID, CNIC, phone, suspect info, or keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Type</label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Select search type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword (in narrative/description)</SelectItem>
                    <SelectItem value="fir_id">FIR ID</SelectItem>
                    <SelectItem value="cnic">CNIC</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="suspect">Suspect Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Query</label>
                <Input
                  placeholder={
                    searchType === "fir_id"
                      ? "Enter FIR ID..."
                      : searchType === "cnic"
                        ? "Enter CNIC..."
                        : searchType === "phone"
                          ? "Enter phone number..."
                          : searchType === "suspect"
                            ? "Enter suspect info..."
                            : "Enter keywords..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="border-border/50"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSearch} disabled={isSearching} className="bg-primary hover:bg-primary-hover">
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-border/50">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Advanced Filters Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
            <CardDescription>Filter FIRs by status, category, location, and date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Charges Filed">Charges Filed</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="assault">Assault</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="cybercrime">Cybercrime</SelectItem>
                    <SelectItem value="vehicle">Vehicle Related</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Enter location..." value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="border-border/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="border-border/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="border-border/50" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleFilter} disabled={isSearching} className="bg-primary hover:bg-primary-hover">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {isSearching ? "Filtering..." : "Apply Filters"}
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-border/50">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>{totalResults} FIR(s) found - Page {currentPage} of {totalPages}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((fir) => (
                  <Card key={fir.reference_id} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{fir.reference_id}</h4>
                          <p className="text-sm text-muted-foreground">{fir.full_name}</p>
                        </div>
                        <Badge className={getStatusColor(fir.status)}>{fir.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium capitalize">{fir.crime_category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">{fir.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Incident Date</p>
                          <p className="font-medium">{fir.date_of_incident}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Filed On</p>
                          <p className="font-medium">{new Date(fir.created_at).toLocaleDateString('en-PK')}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-border/50" onClick={() => handleViewDetails(fir.reference_id)}>
                        View Full Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {/* No Results */}
        {searchResults.length === 0 && totalResults === 0 && searchQuery && !isSearching && (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No FIRs found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
        {/* FIR Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>FIR Details</DialogTitle>
              <DialogDescription>Complete information for the selected FIR</DialogDescription>
            </DialogHeader>
            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">Loading FIR details...</p>
              </div>
            ) : selectedFIR ? (
              <div className="space-y-6">
                {/* Reference ID & Status */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedFIR.reference_id}</h3>
                    <p className="text-sm text-muted-foreground">Filed on {new Date(selectedFIR.created_at).toLocaleString('en-PK')}</p>
                  </div>
                  <Badge className={getStatusColor(selectedFIR.status)}>{selectedFIR.status}</Badge>
                </div>
                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedFIR.full_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CNIC</p>
                      <p className="font-medium">{selectedFIR.cnic}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedFIR.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedFIR.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* Incident Information */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Incident Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Crime Category</p>
                      <p className="font-medium capitalize">{selectedFIR.crime_category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedFIR.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Incident</p>
                      <p className="font-medium">{selectedFIR.date_of_incident}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time of Incident</p>
                      <p className="font-medium">{selectedFIR.time_of_incident || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* Optional sections */}
                {selectedFIR.suspect_info && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Suspect Information</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-line">{selectedFIR.suspect_info}</p>
                    </div>
                  </div>
                )}
                {selectedFIR.citizen_narrative && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Citizen Narrative</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-line">{selectedFIR.citizen_narrative}</p>
                    </div>
                  </div>
                )}
                {selectedFIR.incident_description && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Incident Description</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-line">{selectedFIR.incident_description}</p>
                    </div>
                  </div>
                )}
                {selectedFIR.status_notes && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Status Notes</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-line">{selectedFIR.status_notes}</p>
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button variant="outline">Update Status</Button>
                  <Button variant="outline" onClick={handlePrintFIR}>Print FIR</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8"><p className="text-muted-foreground">No FIR details available</p></div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SearchFirs;
