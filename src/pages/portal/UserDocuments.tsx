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

  // ── Search & Filter States ──
  const [searchTerm, setSearchTerm] = useState("");
  const [debounce, setDebounce] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // All | Pending | Approved | Rejected

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounce(searchTerm);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchTerm]);
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

          const transformedDocs = data.documents
            .filter((doc: any) => doc.uploaded && doc.document)
            .map((doc: any) => {
              const docData = doc.document;

              let uploadDate = "Date not available";
              let uploadedAtFormatted = "N/A";

              if (docData.uploadedAt) {
                if (typeof docData.uploadedAt === "string") {
                  uploadDate = docData.uploadedAt;
                  uploadedAtFormatted = docData.uploadedAt;
                } else if (
                  Array.isArray(docData.uploadedAt) &&
                  docData.uploadedAt.length >= 5
                ) {
                  const [year, month, day, hour, minute] = docData.uploadedAt;
                  uploadDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                  uploadedAtFormatted = uploadDate;
                }
              }

              const fileName = docData.fileName || "";
              const fileExtension =
                fileName.split(".").pop()?.toLowerCase() || "";

              const categoryMap: Record<string, string> = {
                BUSINESS: "Compliance",
                FINANCIAL: "Financial",
                IDENTITY: "Identity",
                TRANSACTION: "Transaction Supporting",
              };

              let status = "pending_review";
              if (doc.verified === true) status = "approved";
              if (doc.verified === false) status = "rejected";

              const formatFileSize = (bytes: number): string => {
                if (bytes === 0 || bytes === undefined || bytes === null)
                  return "0 Bytes";
                const k = 1024;
                const sizes = ["Bytes", "KB", "MB", "GB"];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                if (i === 0) return `${bytes} ${sizes[i]}`;
                return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
              };

              let sizeFormatted = "N/A";
              if (docData.fileSize) {
                sizeFormatted = formatFileSize(docData.fileSize);
              }

              return {
                id: `DOC-${docData.id}`,
                name: fileName,
                type: doc.name,
                category: categoryMap[doc.category] || doc.category,
                size: sizeFormatted,
                uploadDate: uploadDate,
                uploadedAt: uploadedAtFormatted,
                uploadedBy: "System",
                status: status,
                transactionId: null,
                expiryDate: null,
                fileType: fileExtension,
                description: `${doc.name} for KYB compliance`,
                rejectionReason:
                  doc.verified === false
                    ? doc.rejectionReason || "Verification failed"
                    : null,
                documentNumber: docData.documentNumber,
                fileUrl: docData.fileUrl,
                rawFileSize: docData.fileSize,
              };
            });

          setDocuments(transformedDocs);
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
        description: (error as any)?.message || "Please try again",
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
        description: (error as any)?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  // ── Filtering & Searching Logic ──
  const filteredDocuments = documents.filter((doc) => {
    // Status filter
    if (activeFilter !== "All") {
      if (activeFilter === "Pending" && doc.status !== "pending_review")
        return false;
      if (activeFilter === "Approved" && doc.status !== "approved")
        return false;
      if (activeFilter === "Rejected" && doc.status !== "rejected")
        return false;
    }

    // Search term
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(term) ||
      doc.type?.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term) ||
      (doc.rejectionReason && doc.rejectionReason.toLowerCase().includes(term))
    );
  });

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
        </div>

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
                  ? `of ${apiData.documents.filter((d: any) => d.required).length} required`
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
                {documents?.filter((d) => d.status === "approved").length}
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
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <Label htmlFor="search">Search Documents</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, type, description, rejection reason..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mt-5">
                <Button
                  variant={activeFilter === "All" ? "default" : "outline"}
                  onClick={() => setActiveFilter("All")}
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "Pending" ? "default" : "outline"}
                  onClick={() => setActiveFilter("Pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={activeFilter === "Approved" ? "default" : "outline"}
                  onClick={() => setActiveFilter("Approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={activeFilter === "Rejected" ? "default" : "outline"}
                  onClick={() => setActiveFilter("Rejected")}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No documents found
                  </h3>
                  <p className="text-red-400">{error}</p>
                </div>
              ) : (
                filteredDocuments.map((doc) => {
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
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                          </div>

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
                              </div>
                            </div>

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
                                <p className="font-medium">{doc.uploadDate}</p>
                                <p className="text-xs text-muted-foreground">
                                  by {firstName}
                                </p>
                              </div>
                            </div>

                            {/* Show rejection reason when exists */}
                            {doc.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                  <span className="font-medium">
                                    Rejection Reason:
                                  </span>{" "}
                                  {doc.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Pagination (static for now) */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDocuments?.length} of {documents?.length}{" "}
                documents
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
