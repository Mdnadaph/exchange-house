import { useState } from "react";
import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Search, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  X,
  Building2,
  Calendar,
  Info
} from "lucide-react";

const BranchBusinessDocuments = () => {
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Only businesses registered through this branch
  const branchBusinesses = [
    { id: "BIZ-001", name: "Tech Solutions LLC", registeredDate: "2023-05-15" },
    { id: "BIZ-003", name: "Global Enterprises", registeredDate: "2023-08-22" },
    { id: "BIZ-005", name: "Retail Solutions Ltd", registeredDate: "2023-11-10" }
  ];

  // Only documents from branch-registered businesses
  const documents = [
    {
      id: "DOC-001",
      businessId: "BIZ-001",
      businessName: "Tech Solutions LLC",
      name: "Trade License.pdf",
      type: "Trade License",
      uploadDate: "2023-05-15",
      uploadedBy: "Tech Solutions LLC",
      size: "2.4 MB",
      status: "verified"
    },
    {
      id: "DOC-002",
      businessId: "BIZ-001",
      businessName: "Tech Solutions LLC",
      name: "Tax Registration Certificate.pdf",
      type: "Tax Certificate",
      uploadDate: "2023-05-15",
      uploadedBy: "Tech Solutions LLC",
      size: "1.8 MB",
      status: "verified"
    },
    {
      id: "DOC-003",
      businessId: "BIZ-001",
      businessName: "Tech Solutions LLC",
      name: "Bank Statement - January 2024.pdf",
      type: "Bank Statement",
      uploadDate: "2024-01-10",
      uploadedBy: "Tech Solutions LLC",
      size: "3.2 MB",
      status: "pending_review"
    },
    {
      id: "DOC-007",
      businessId: "BIZ-003",
      businessName: "Global Enterprises",
      name: "Trade License.pdf",
      type: "Trade License",
      uploadDate: "2023-08-22",
      uploadedBy: "Global Enterprises",
      size: "2.3 MB",
      status: "verified"
    },
    {
      id: "DOC-008",
      businessId: "BIZ-005",
      businessName: "Retail Solutions Ltd",
      name: "Memorandum of Association.pdf",
      type: "Memorandum of Association",
      uploadDate: "2023-11-10",
      uploadedBy: "Retail Solutions Ltd",
      size: "4.1 MB",
      status: "verified"
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    if (selectedBusiness !== "all" && doc.businessId !== selectedBusiness) return false;
    if (selectedStatus !== "all" && doc.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending_review":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Documents</h1>
            <p className="text-muted-foreground">View documents from businesses registered through this branch</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Info Alert */}
        <Card className="bg-accent-muted/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Branch Document Access</p>
                <p className="text-sm text-muted-foreground">
                  You can only view documents from businesses that were registered through Dubai Mall Branch. 
                  Currently showing documents from {branchBusinesses.length} registered businesses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Businesses</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchBusinesses.length}</div>
              <p className="text-xs text-muted-foreground">Registered through branch</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">From branch businesses</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {documents.filter(d => d.status === "verified").length}
              </div>
              <p className="text-xs text-muted-foreground">Approved documents</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {documents.filter(d => d.status === "pending_review").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Documents</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by document name, type, or business..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessFilter">Filter by Business</Label>
                <select
                  id="businessFilter"
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Businesses</option>
                  {branchBusinesses.map((business) => (
                    <option key={business.id} value={business.id}>{business.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusFilter">Filter by Status</Label>
                <select
                  id="statusFilter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documents ({filteredDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{doc.name}</h4>
                            {getStatusBadge(doc.status)}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {doc.businessName} ({doc.businessId})
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {doc.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate}
                            </span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BranchLayout>
  );
};

export default BranchBusinessDocuments;
