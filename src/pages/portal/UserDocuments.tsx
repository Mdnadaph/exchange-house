import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import axios from "axios";
// Add any missing imports
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle, // Make sure this is imported
  File,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserDocuments = () => {
  const { id } = useParams();
  const [cookie] = useCookies(["token", "firstName"]);
  const token = cookie.token;
  const firstName = cookie.firstName;
  const { toast } = useToast();
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  // Fetch KYB context data
  // Fetch KYB context data
  useEffect(() => {
    const fetchKYBContext = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/api/business/${id}/kyb-context`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response?.data?.data;

        if (data?.documents) {
          setApiData(data);

          // Transform API data to match your document structure
          const transformedDocs = data.documents
            .filter((doc: any) => doc.uploaded && doc.document)
            .map((doc: any) => {
              const docData = doc.document;

              // Format uploaded date - handle both string and array formats
              let uploadDate = "Date not available";
              let uploadedAtFormatted = "N/A";

              if (docData.uploadedAt) {
                if (typeof docData.uploadedAt === "string") {
                  // If it's already a string, use it directly
                  uploadDate = docData.uploadedAt;
                  uploadedAtFormatted = docData.uploadedAt;
                } else if (
                  Array.isArray(docData.uploadedAt) &&
                  docData.uploadedAt.length >= 5
                ) {
                  // If it's an array, format it
                  const [year, month, day, hour, minute] = docData.uploadedAt;
                  uploadDate = `${year}-${String(month).padStart(
                    2,
                    "0",
                  )}-${String(day).padStart(2, "0")} ${String(hour).padStart(
                    2,
                    "0",
                  )}:${String(minute).padStart(2, "0")}`;
                  uploadedAtFormatted = uploadDate;
                }
              }

              // Determine file type
              const fileName = docData.fileName || "";
              const fileExtension =
                fileName.split(".").pop()?.toLowerCase() || "";

              // Map API categories to your categories
              const categoryMap: Record<string, string> = {
                BUSINESS: "Compliance",
                FINANCIAL: "Financial",
                IDENTITY: "Identity",
                TRANSACTION: "Transaction Supporting",
              };

              // Determine status
              let status = "pending_review";
              if (doc.verified === true) status = "approved";
              if (doc.verified === false) status = "rejected";

              // Add this helper function to format file sizes
              const formatFileSize = (bytes: number): string => {
                if (bytes === 0 || bytes === undefined || bytes === null)
                  return "0 Bytes";

                const k = 1024;
                const sizes = ["Bytes", "KB", "MB", "GB"];
                const i = Math.floor(Math.log(bytes) / Math.log(k));

                // Handle very small sizes (less than 1 KB)
                if (i === 0) {
                  return `${bytes} ${sizes[i]}`;
                }

                return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
              };
              // Format file size - FIX HERE
              let sizeFormatted = "N/A";
              if (docData.fileSize) {
                sizeFormatted = formatFileSize(docData.fileSize);
              }

              return {
                id: `DOC-${docData.id}`,
                name: fileName,
                type: doc.name,
                category: categoryMap[doc.category] || doc.category,
                size: sizeFormatted, // Use the formatted file size
                uploadDate: uploadDate,
                uploadedAt: uploadedAtFormatted,
                uploadedBy: "System",
                status: status,
                transactionId: null,
                expiryDate: null,
                fileType: fileExtension,
                description: `${doc.name} for KYB compliance`,
                rejectionReason:
                  doc.verified === false ? "Verification failed" : null,
                documentNumber: docData.documentNumber,
                fileUrl: docData.fileUrl,
                rawFileSize: docData.fileSize, // Keep raw size for reference if needed
              };
            });

          setDocuments(transformedDocs); // Add this for debugging
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchKYBContext();
    } else {
      setLoading(false);
      setError("Missing business ID or authentication token");
    }
  }, [id, token]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: {
        variant: "default" as const,
        label: "Approved",
        icon: CheckCircle,
      },
      pending_review: {
        variant: "secondary" as const,
        label: "Pending Review",
        icon: Clock,
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: AlertCircle,
      },
      expired: {
        variant: "destructive" as const,
        label: "Expired",
        icon: AlertCircle,
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || statusMap.pending_review
    );
  };

  const getFileIcon = (fileType: string) => {
    const iconMap = {
      pdf: FileText,
      xlsx: FileSpreadsheet,
      xls: FileSpreadsheet,
      jpg: Image,
      jpeg: Image,
      png: Image,
      default: File,
    };
    return iconMap[fileType as keyof typeof iconMap] || iconMap.default;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Transaction Supporting": "bg-blue-100 text-blue-800",
      Compliance: "bg-green-100 text-green-800",
      Financial: "bg-purple-100 text-purple-800",
      Identity: "bg-orange-100 text-orange-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const handleView = async (viewUrl: string) => {
    try {
      const response = await axios.get(viewUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (viewUrl: string, fileName: string) => {
    try {
      const response = await axios.get(viewUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Error loading documents: {error}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">
              Manage transaction supporting documents and compliance files
            </p>
          </div>
          {/* <Button variant="business">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button> */}
        </div>

        {/* Statistics Cards */}
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uploaded Documents
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">
                {apiData
                  ? `of ${
                      apiData.documents.filter((d: any) => d.required).length
                    } required`
                  : "No data"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {documents.filter((d) => d.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {documents.length > 0
                  ? `${Math.round(
                      (documents.filter((d) => d.status === "approved").length /
                        documents.length) *
                        100,
                    )}% approval rate`
                  : "No documents"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {documents.filter((d) => d.status === "pending_review").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Required Documents
              </CardTitle>
              <File className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apiData
                  ? apiData.documents.filter((d: any) => d.required).length
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total required for KYB
              </p>
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
        {/* <Card className="shadow-card border-2 border-dashed border-muted hover:border-primary transition-colors">
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload New Document
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here or click to browse. Supports PDF, JPG,
              PNG, XLSX files up to 10MB.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="business">Choose Files</Button>
              <Button variant="outline">Scan Document</Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Documents Library</CardTitle>
            {apiData && (
              <p className="text-sm text-muted-foreground">
                KYB Type: {apiData.kybType} • Business Type:{" "}
                {apiData.businessType}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No documents uploaded yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your required documents to complete KYB compliance
                  </p>
                  {/* <Button variant="business">Upload Your First Document</Button> */}
                </div>
              ) : (
                documents.map((doc) => {
                  const status = getStatusBadge(doc.status);
                  const StatusIcon = status.icon;
                  const FileIcon = getFileIcon(doc.fileType);
                  return (
                    <Card
                      key={doc.id}
                      className="hover:shadow-md transition-smooth"
                    >
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
                                  <h4 className="font-semibold text-foreground">
                                    {doc.name}
                                  </h4>
                                  <Badge
                                    variant={status.variant}
                                    className="flex items-center gap-1"
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {status.label}
                                  </Badge>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                      doc.category,
                                    )}`}
                                  >
                                    {doc.category}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {doc.description}
                                </p>
                                {/*{doc.rejectionReason && (
                                  <p className="text-sm text-destructive">
                                    Rejection reason: {doc.rejectionReason}
                                  </p>
                                )}*/}
                              </div>

                              <div className="flex space-x-1 pl-8">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(doc?.fileUrl)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(doc?.fileUrl, doc?.name)
                                  }
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                {/* <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </div>

                            {/* Document Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                              <div>
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <p className="font-medium">{doc.type}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Size:
                                </span>
                                <p className="font-medium">{doc.size}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Uploaded:
                                </span>
                                <p className="font-medium">{doc.uploadDate}</p>{" "}
                                {/* Use uploadDate instead of uploadedAt */}
                                <p className="text-xs text-muted-foreground">
                                  by {firstName}
                                </p>
                              </div>
                              {/*<div>
                                {doc.transactionId ? (
                                  <>
                                    <span className="text-muted-foreground">
                                      Transaction:
                                    </span>
                                    <p className="font-medium font-mono text-xs">
                                      {doc.transactionId}
                                    </p>
                                  </>
                                ) : doc.expiryDate ? (
                                  <>
                                    <span className="text-muted-foreground">
                                      Expires:
                                    </span>
                                    <p className="font-medium">
                                      {doc.expiryDate}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-muted-foreground">
                                      Status:
                                    </span>
                                    <p className="font-medium">
                                      General Document
                                    </p>
                                  </>
                                )}
                              </div>*/}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {documents.length} of{" "}
                {apiData
                  ? apiData.documents.filter((d: any) => d.required).length
                  : 0}{" "}
                required documents
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
