import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  File,
  Image,
  FileSpreadsheet
} from "lucide-react";

const UserDocuments = () => {
  const documents = [
    {
      id: "DOC-001",
      name: "Invoice_GS_Jan2024.pdf",
      type: "Invoice",
      category: "Transaction Supporting",
      size: "2.4 MB",
      uploadDate: "2024-01-16 14:20",
      uploadedBy: "Sarah Johnson",
      status: "approved",
      transactionId: "TXN-2024-001",
      expiryDate: null,
      fileType: "pdf",
      description: "Invoice from Global Suppliers for equipment purchase"
    },
    {
      id: "DOC-002",
      name: "Service_Agreement_TS.pdf", 
      type: "Contract",
      category: "Transaction Supporting",
      size: "1.8 MB",
      uploadDate: "2024-01-16 10:10",
      uploadedBy: "Sarah Johnson",
      status: "pending_review",
      transactionId: "TXN-2024-002",
      expiryDate: null,
      fileType: "pdf",
      description: "Service agreement with Tech Solutions Ltd"
    },
    {
      id: "DOC-003",
      name: "Employee_Payroll_Jan2024.xlsx",
      type: "Payroll",
      category: "Transaction Supporting", 
      size: "856 KB",
      uploadDate: "2024-01-15 16:15",
      uploadedBy: "Michael Chen",
      status: "approved",
      transactionId: "TXN-2024-003",
      expiryDate: null,
      fileType: "xlsx",
      description: "Monthly payroll details for January 2024"
    },
    {
      id: "DOC-004",
      name: "Business_License_2024.pdf",
      type: "License",
      category: "Compliance",
      size: "3.1 MB", 
      uploadDate: "2024-01-10 11:30",
      uploadedBy: "Sarah Johnson",
      status: "approved",
      transactionId: null,
      expiryDate: "2024-12-31",
      fileType: "pdf",
      description: "Updated business license for 2024"
    },
    {
      id: "DOC-005",
      name: "Bank_Statement_Dec2023.pdf",
      type: "Bank Statement",
      category: "Financial",
      size: "4.2 MB",
      uploadDate: "2024-01-08 09:45", 
      uploadedBy: "Ahmad Al-Rashid",
      status: "rejected",
      transactionId: null,
      expiryDate: null,
      fileType: "pdf",
      description: "December 2023 bank statement - requires re-upload",
      rejectionReason: "Document quality insufficient - please re-scan"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: { variant: "default" as const, label: "Approved", icon: CheckCircle },
      pending_review: { variant: "secondary" as const, label: "Pending Review", icon: Clock },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: AlertCircle },
      expired: { variant: "destructive" as const, label: "Expired", icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending_review;
  };

  const getFileIcon = (fileType: string) => {
    const iconMap = {
      pdf: FileText,
      xlsx: FileSpreadsheet,
      xls: FileSpreadsheet,
      jpg: Image,
      jpeg: Image,
      png: Image,
      default: File
    };
    return iconMap[fileType as keyof typeof iconMap] || iconMap.default;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Transaction Supporting": "bg-blue-100 text-blue-800",
      "Compliance": "bg-green-100 text-green-800",
      "Financial": "bg-purple-100 text-purple-800",
      "Identity": "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">Manage transaction supporting documents and compliance files</p>
          </div>
          <Button variant="business">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+5 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">42</div>
              <p className="text-xs text-muted-foreground">87.5% approval rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">4</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
              <File className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 GB</div>
              <p className="text-xs text-muted-foreground">of 10 GB limit</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Documents</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by name, type, or transaction ID..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">Approved</Button>
                <Button variant="outline">Compliance</Button>
                <Button variant="outline">This Month</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="shadow-card border-2 border-dashed border-muted hover:border-primary transition-colors">
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload New Document</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here or click to browse. Supports PDF, JPG, PNG, XLSX files up to 10MB.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="business">
                Choose Files
              </Button>
              <Button variant="outline">
                Scan Document
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Document Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => {
                const status = getStatusBadge(doc.status);
                const StatusIcon = status.icon;
                const FileIcon = getFileIcon(doc.fileType);
                
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* File Icon */}
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        
                        {/* Document Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-foreground">{doc.name}</h4>
                                <Badge variant={status.variant} className="flex items-center gap-1">
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                                  {doc.category}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{doc.description}</p>
                              {doc.rejectionReason && (
                                <p className="text-sm text-destructive">Rejection reason: {doc.rejectionReason}</p>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Document Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <p className="font-medium">{doc.type}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Size:</span>
                              <p className="font-medium">{doc.size}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Uploaded:</span>
                              <p className="font-medium">{doc.uploadDate}</p>
                              <p className="text-xs text-muted-foreground">by {doc.uploadedBy}</p>
                            </div>
                            <div>
                              {doc.transactionId ? (
                                <>
                                  <span className="text-muted-foreground">Transaction:</span>
                                  <p className="font-medium font-mono text-xs">{doc.transactionId}</p>
                                </>
                              ) : doc.expiryDate ? (
                                <>
                                  <span className="text-muted-foreground">Expires:</span>
                                  <p className="font-medium">{doc.expiryDate}</p>
                                </>
                              ) : (
                                <>
                                  <span className="text-muted-foreground">Status:</span>
                                  <p className="font-medium">General Document</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 5 of 48 documents
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserDocuments;