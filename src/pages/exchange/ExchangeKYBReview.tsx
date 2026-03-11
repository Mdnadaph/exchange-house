import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  MessageSquare,
  User,
  Building,
  MapPin,
  Calendar,
  RefreshCw,
  FileText,
  X,
  FileImage,
  File,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import BASE_URL from "@/config/config";

// Dialog component import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Type definitions for API response
interface KYBDocument {
  documentId: number;
  documentType: string;
  documentName: string;
  status: string;
  uploadedAt: string;
  rejectionReason: string | null;
  viewUrl: string;
}

interface KYBApplication {
  id: number;
  uuid: string;
  companyName: string;
  businessType: string;
  country: string;
  branchName: string;
  kybStatus: string;
  businessAdminName: string | null;
  businessAdminEmail: string | null;
  businessAdminPhone: string | null;
  kybReviewedBy: string | null;
  kybReviewComment: string | null;
  kybRejectionReason: string | null;
  kybEvaluatedAt: string | null;
  createdDate: string;
  documents: KYBDocument[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: KYBApplication[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface DocumentViewerData {
  document: any;
  application: any;
}

const ExchangeKYBReview = () => {
  const [kybApplications, setKybApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cookies] = useCookies(["token", "email"]);

  // Comments state for each application
  const [comments, setComments] = useState<Record<string, string>>({});

  // Document viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerData, setViewerData] = useState<DocumentViewerData | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  // Image preview state
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // PDF preview state
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(2);

  const token = cookies.token;

  useEffect(() => {
    fetchKYBApplications(currentPage);
  }, [currentPage]);

  // Clean up blob URLs when component unmounts or when viewer closes
  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [imageBlobUrl, pdfBlobUrl]);

  const fetchKYBApplications = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/v3/admin/kyb/businesses?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.status) {
        const data: ApiResponse = response.data;

        // Update pagination info
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.currentPage || 0);
        setTotalElements(data.totalElements || 0);

        // Map API data to component structure
        const mappedApplications = data.data.map((app) => ({
          id: `KYB-${app.id.toString().padStart(4, "0")}`,
          businessName: app.companyName || "",
          businessType: app.businessType || "",
          submittedDate: formatDate(app.createdDate) || "",
          priority: determinePriority(app.kybStatus, app.createdDate),
          status: mapKybStatus(app.kybStatus),
          completeness: calculateCompleteness(app.documents),
          riskScore: determineRiskScore(app.businessType, app.country),
          branch: app.branchName || "",
          assignedStaff: app.kybReviewedBy || "Unassigned",
          contactPerson: app.businessAdminName || "Not Available",
          email: app.businessAdminEmail || "No email provided",
          phone: app.businessAdminPhone || "No phone provided",
          address: `${app.branchName || ""}, ${app.country || ""}`,
          documents: app.documents.map((doc) => ({
            name: doc.documentType || "",
            documentName: doc.documentName || "",
            status: mapDocumentStatus(doc.status),
            originalStatus: doc.status,
            uploadDate: formatDate(doc.uploadedAt) || "",
            viewUrl: doc.viewUrl,
            documentId: doc.documentId,
            rejectionReason: doc.rejectionReason,
          })),
          transactionProfile: {
            expectedVolume: "",
            expectedFrequency: "",
            sourceOfFunds: "",
            destinations: [],
          },
          uuid: app.uuid,
          originalData: app,
        }));

        setKybApplications(mappedApplications);

        // Initialize comments from existing review comments
        const initialComments: Record<string, string> = {};
        data.data.forEach((app) => {
          if (app.uuid && app.kybReviewComment) {
            initialComments[app.uuid] = app.kybReviewComment;
          }
        });
        setComments((prev) => ({ ...prev, ...initialComments }));
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch KYB applications";
        setError(errorMessage);
      }
      console.error("Error fetching KYB applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to determine priority
  const determinePriority = (status: string, createdDate: string): string => {
    const statusPriority: Record<string, string> = {
      NOT_STARTED: "high",
      IN_PROGRESS: "medium",
      APPROVED: "low",
      REJECTED: "low",
    };

    const basePriority = statusPriority[status] || "medium";

    if (status === "NOT_STARTED" && createdDate) {
      const created = new Date(createdDate);
      const now = new Date();
      const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
      if (diffDays > 2) return "high";
    }

    return basePriority;
  };

  // Helper function to map API kybStatus to component status
  const mapKybStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      NOT_STARTED: "pending_review",
      IN_PROGRESS: "under_review",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    return statusMap[status] || "pending_review";
  };

  // Add this helper function after the other helpers
  const checkAllDocumentsApproved = (documents: any[]): boolean => {
    if (!documents || documents.length === 0) return false;

    return documents.every(
      (doc) => doc.originalStatus === "APPROVED" || doc.status === "approved",
    );
  };

  // Helper function to map API document status to component status
  const mapDocumentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
      REQUIRES_ATTENTION: "requires_attention",
    };
    return statusMap[status] || "pending";
  };

  // Calculate completeness based on document status
  const calculateCompleteness = (documents: KYBDocument[]): number => {
    if (!documents || documents.length === 0) return 0;

    const approvedDocs = documents.filter(
      (doc) => doc.status === "APPROVED",
    ).length;

    return Math.round((approvedDocs / documents.length) * 100);
  };

  // Determine risk score based on business type and country
  const determineRiskScore = (
    businessType: string,
    country: string,
  ): string => {
    const highRiskCountries = ["HighRiskCountry1", "HighRiskCountry2"];
    const highRiskBusinessTypes = ["GAMBLING", "CRYPTOCURRENCY", "CASINO"];

    if (highRiskBusinessTypes.includes(businessType.toUpperCase())) {
      return "High";
    }

    if (highRiskCountries.includes(country)) {
      return "High";
    }

    return "Medium";
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending_review: {
        variant: "secondary" as const,
        label: "Pending Review",
        icon: Clock,
      },
      under_review: {
        variant: "destructive" as const,
        label: "Under Review",
        icon: Eye,
      },
      approved: {
        variant: "default" as const,
        label: "Approved",
        icon: CheckCircle,
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || statusMap.pending_review
    );
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusMap = {
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "secondary" as const, label: "Pending" },
      requires_attention: {
        variant: "destructive" as const,
        label: "Requires Attention",
      },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-red-100 text-red-800",
    };
    return colors[risk as keyof typeof colors] || colors.Medium;
  };

  // Filter applications based on search term
  const filteredApplications = kybApplications.filter(
    (app) =>
      (app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === null || app.status === filterStatus),
  );

  const handleViewDocument = async (document: any, application: any) => {
    // console.log("Opening document:", {
    //   documentId: document.documentId,
    //   viewUrl: document.viewUrl,
    //   name: document.name,
    // });

    // Clear previous blob URLs
    if (imageBlobUrl) {
      URL.revokeObjectURL(imageBlobUrl);
      setImageBlobUrl(null);
    }
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }

    setViewerData({ document, application });
    setRejectionReason(document.rejectionReason || "");
    setViewerOpen(true);

    // If it's an image or PDF, fetch it with axios
    if (document.viewUrl) {
      if (isImageFile(document.documentName)) {
        await loadImageWithAuth(document.viewUrl);
      } else if (isPDFFile(document.documentName)) {
        await loadPdfWithAuth(document.viewUrl);
      }
    }
  };

  // Function to load image with authentication
  const loadImageWithAuth = async (imageUrl: string) => {
    try {
      if (!token) {
        setError("Authentication required to view document");
        return;
      }

      setImageLoading(true);

      const response = await axios.get(imageUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a blob URL from the response
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      setImageBlobUrl(url);
      setImageLoading(false);
    } catch (err) {
      console.error("Error loading image:", err);
      setImageLoading(false);
      setError("Error loading image. Please try again.");
    }
  };

  // Function to load PDF with authentication
  const loadPdfWithAuth = async (pdfUrl: string) => {
    try {
      if (!token) {
        setError("Authentication required to view document");
        return;
      }

      setPdfLoading(true);

      const response = await axios.get(pdfUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a blob URL from the response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfBlobUrl(url);
      setPdfLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setPdfLoading(false);
      setError("Error loading PDF. Please try again.");
    }
  };

  const handleDownloadDocument = async (
    viewUrl: string,
    documentName: string,
  ) => {
    try {
      if (!token) {
        setError("Authentication required to download document");
        return;
      }

      const response = await axios.get(viewUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a blob from the response
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set the download filename
      const fileName = documentName || "document";
      const extension = fileName.split(".").pop() || "";
      const downloadName = fileName.includes(".")
        ? fileName
        : `${fileName}.${extension || "pdf"}`;

      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading document:", err);
      setError("Error downloading document. Please try again.");
    }
  };

  // Handle document approval
  const handleDocumentApprove = async (e: React.MouseEvent) => {
    if (!viewerData || !token) {
      setError("Missing authentication or document data");
      return;
    }

    try {
      setActionLoading(true);
      // console.log("Approving document ID:", viewerData.document.documentId);
      // console.log("Sending approval request...");

      const response = await axios.post(
        `${BASE_URL}/api/v3/admin/kyb/documents/${viewerData.document.documentId}/review`,
        {
          approved: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // console.log("Approval response:", response.data);

      if (response.data?.status) {
        await fetchKYBApplications(currentPage);
        setViewerOpen(false);
        setError(null);
      } else {
        setError(response.data?.message || "Approval failed without error");
      }
    } catch (err: any) {
      console.error("Error approving document:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "Failed to approve document");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle document rejection
  const handleDocumentReject = async () => {
    if (!viewerData || !token || !rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      // console.log("Rejecting document ID:", viewerData.document.documentId);
      // console.log("Rejection reason:", rejectionReason);

      const response = await axios.post(
        `${BASE_URL}/api/v3/admin/kyb/documents/${viewerData.document.documentId}/review`,
        {
          approved: false,
          rejectionReason: rejectionReason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // console.log("Rejection response:", response.data);

      if (response.data?.status) {
        await fetchKYBApplications(currentPage);
        setViewerOpen(false);
        setRejectionReason("");
        setError(null);
      } else {
        setError(response.data?.message || "Rejection failed without error");
      }
    } catch (err: any) {
      console.error("Error rejecting document:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "Failed to reject document");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Get file extension for icon display
  const getFileIcon = (fileName: string) => {
    if (!fileName) return <File className="h-6 w-6" />;

    const extension = fileName.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
        extension || "",
      )
    ) {
      return <FileImage className="h-6 w-6 text-blue-500" />;
    } else if (extension === "pdf") {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (["doc", "docx"].includes(extension || "")) {
      return <FileText className="h-6 w-6 text-blue-600" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  // Check if file is an image
  const isImageFile = (fileName: string) => {
    if (!fileName) return false;
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
      extension || "",
    );
  };

  // Check if file is PDF
  const isPDFFile = (fileName: string) => {
    if (!fileName) return false;
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension === "pdf";
  };

  // Handle approve/reject actions for KYB application (business level)
  const handleKybAction = async (
    businessId: number,
    action: "approve" | "reject",
    comment: string,
  ) => {
    try {
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Find the application to check document statuses
      const application = kybApplications.find(
        (app) => app.originalData.id === businessId,
      );

      // If approving, check if all documents are approved
      if (action === "approve") {
        const hasPendingDocuments = application?.documents?.some(
          (doc: any) =>
            doc.originalStatus !== "APPROVED" &&
            doc.originalStatus !== "APPROVED",
        );

        // More accurate check:
        const unapprovedDocuments = application?.documents?.filter(
          (doc: any) =>
            doc.originalStatus !== "APPROVED" && doc.status !== "approved",
        );

        if (unapprovedDocuments && unapprovedDocuments.length > 0) {
          setError(
            `Cannot approve business. ${unapprovedDocuments.length} document(s) are not approved yet.`,
          );
          return;
        }
      }

      // Map action to decision field for API
      const decision = action === "approve" ? "APPROVED" : "REJECTED";

      const endpoint = `${BASE_URL}/api/v3/admin/kyb/${businessId}/decision`;

      const requestBody =
        action === "approve"
          ? { decision, comment }
          : { decision, rejectionReason: comment };

      const response = await axios.post(endpoint, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status) {
        // Refresh the applications list
        await fetchKYBApplications(currentPage);
        setError(null);
      } else {
        setError(response.data?.message || `Failed to ${action} business`);
      }
    } catch (err: any) {
      console.error(`Error ${action}ing business:`, err);

      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || `Failed to ${action} business`);
      }
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push(-1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        if (end < totalPages - 2) pages.push(-2);
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <ExchangeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading KYB applications...
            </p>
          </div>
        </div>
      </ExchangeLayout>
    );
  }

  return (
    <ExchangeLayout>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-8"
        noValidate
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                KYB Review & Approval
              </h1>
              <p className="text-muted-foreground">
                Review and process business verification applications
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => fetchKYBApplications(currentPage)}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              {/*<Button type="button" variant="business">
                Assign Reviewer
              </Button>*/}
            </div>
          </div>

          {/* Error Display */}
          {error && !viewerOpen && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Applications</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by business name, ID, contact person, or email..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {/*<div className="flex gap-2 items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                  >
                    Rejected
                  </Button>
                  <Button type="button" variant="outline">
                    Approved
                  </Button>
                  <Button type="button" variant="outline">
                    Pending Review
                  </Button>
                </div>*/}
                <div className="flex gap-2 items-end">
                  <Button
                    type="button"
                    variant={filterStatus === null ? "default" : "outline"}
                    onClick={() => setFilterStatus(null)}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    variant={
                      filterStatus === "pending_review" ? "default" : "outline"
                    }
                    onClick={() => setFilterStatus("pending_review")}
                  >
                    Pending Review
                  </Button>
                  <Button
                    type="button"
                    variant={
                      filterStatus === "approved" ? "default" : "outline"
                    }
                    onClick={() => setFilterStatus("approved")}
                  >
                    Approved
                  </Button>
                  <Button
                    type="button"
                    variant={
                      filterStatus === "rejected" ? "default" : "outline"
                    }
                    onClick={() => setFilterStatus("rejected")}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYB Applications */}
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              const status = getStatusBadge(application.status);
              const StatusIcon = status.icon;
              const allDocumentsApproved = checkAllDocumentsApproved(
                application.documents,
              );

              return (
                <Card key={application.uuid} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {application.businessName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.id} • {application.businessType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={status.variant}
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {application.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                            application.riskScore,
                          )}`}
                        >
                          {application.riskScore.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 rounded-lg p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <User className="h-3 w-3 mr-1" />
                          Business Admin:
                        </div>
                        <p className="font-medium">
                          {application.contactPerson}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {application.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          Location:
                        </div>
                        <p className="font-medium">{application.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {application.phone}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Submitted:
                        </div>
                        <p className="font-medium">
                          {application.submittedDate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Assigned: {application.assignedStaff}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">
                          Completeness:
                        </span>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${application.completeness}%` }}
                          />
                        </div>
                        <p className="text-xs font-medium">
                          {application.completeness}% Complete
                        </p>
                      </div>
                    </div>

                    {/* Transaction Profile */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Transaction Profile
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Expected Volume:
                          </span>
                          <p className="font-medium">
                            {application.transactionProfile.expectedVolume ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Frequency:
                          </span>
                          <p className="font-medium">
                            {application.transactionProfile.expectedFrequency ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Source of Funds:
                          </span>
                          <p className="font-medium">
                            {application.transactionProfile.sourceOfFunds ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Destinations:
                          </span>
                          <p className="font-medium">
                            {application.transactionProfile.destinations
                              .length > 0
                              ? application.transactionProfile.destinations.join(
                                  ", ",
                                )
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents Review */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Documents Review
                      </h4>
                      {application.documents &&
                      application.documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {application.documents.map(
                            (doc: any, index: number) => {
                              const docStatus = getDocumentStatusBadge(
                                doc.status,
                              );
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">
                                        {doc.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {doc.documentName} • Uploaded:{" "}
                                        {doc.uploadDate}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={docStatus.variant}
                                      className="text-xs"
                                    >
                                      {docStatus.label}
                                    </Badge>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleViewDocument(doc, application)
                                      }
                                      disabled={!doc.viewUrl}
                                      title="View Document"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        doc.viewUrl &&
                                        handleDownloadDocument(
                                          doc.viewUrl,
                                          doc.documentName,
                                        )
                                      }
                                      disabled={!doc.viewUrl}
                                      title="Download Document"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-lg">
                          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            No documents uploaded yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Review Actions */}
                    <div className="border-t pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Review Comments */}
                        <div className="space-y-4">
                          <Label htmlFor={`comments-${application.uuid}`}>
                            Review Comments
                          </Label>
                          <Textarea
                            id={`comments-${application.uuid}`}
                            placeholder="Add review comments, questions, or requirements..."
                            rows={4}
                            value={
                              comments[application.uuid] ||
                              application.originalData?.kybReviewComment ||
                              ""
                            }
                            onChange={(e) =>
                              setComments((prev) => ({
                                ...prev,
                                [application.uuid]: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                          <Label>Review Actions</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant="default"
                              className="w-full"
                              disabled={!allDocumentsApproved}
                              title={
                                !allDocumentsApproved
                                  ? "All documents must be approved first"
                                  : "Approve business application"
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleKybAction(
                                  application.originalData.id,
                                  "approve",
                                  comments[application.uuid] ||
                                    "Application approved",
                                );
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            {/*<Button
                              type="button"
                              variant="destructive"
                              className="w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleKybAction(
                                  application.originalData.id,
                                  "reject",
                                  comments[application.uuid] ||
                                    "Application rejected",
                                );
                              }}
                            >
                              Reject
                            </Button>*/}

                            <Button
                              type="button"
                              variant="destructive"
                              className="w-full"
                              disabled={application.documents.length === 0} // <-- added
                              title={
                                application.documents.length === 0
                                  ? "No documents uploaded"
                                  : ""
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleKybAction(
                                  application.originalData.id,
                                  "reject",
                                  comments[application.uuid] ||
                                    "Application rejected",
                                );
                              }}
                            >
                              Reject
                            </Button>
                            {/*<Button
                              type="button"
                              variant="outline"
                              className="w-full"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Request Info
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Assign Reviewer
                            </Button>*/}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredApplications.length === 0 && !loading && (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No KYB Applications Found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No applications match your search criteria."
                      : "No business verification applications to review at the moment."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || loading}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {generatePageNumbers().map((pageIndex, idx) => {
                    if (pageIndex === -1 || pageIndex === -2) {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2">
                          ...
                        </span>
                      );
                    }

                    return (
                      <Button
                        type="button"
                        key={pageIndex}
                        variant={
                          currentPage === pageIndex ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageIndex)}
                        disabled={loading}
                        className="min-w-[40px]"
                      >
                        {pageIndex + 1}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1 || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Document Viewer Dialog */}
          <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {viewerData?.document &&
                      getFileIcon(viewerData.document.documentName)}
                    <div className="max-w-[80%]">
                      <DialogTitle className="text-lg truncate">
                        {viewerData?.document?.name || "Document Preview"}
                      </DialogTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {viewerData?.application?.businessName} •{" "}
                        {viewerData?.document?.documentName}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {viewerData && (
                <div className="flex-1 flex flex-col">
                  {/* Document Preview - Main Content */}
                  <div className="flex-1 overflow-auto bg-gray-100">
                    {viewerData.document.viewUrl ? (
                      <>
                        {isImageFile(viewerData.document.documentName) ? (
                          <div className="h-full w-full overflow-auto">
                            {imageLoading ? (
                              <div className="h-full w-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                  <p className="mt-4 text-muted-foreground">
                                    Loading image...
                                  </p>
                                </div>
                              </div>
                            ) : imageBlobUrl ? (
                              <div className="p-4">
                                <img
                                  src={imageBlobUrl}
                                  alt="Document Preview"
                                  className="max-w-full max-h-[calc(100vh-300px)] mx-auto object-contain rounded-lg shadow-lg"
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center">
                                <FileImage className="h-24 w-24 text-gray-400 mb-4 mx-auto" />
                                <p className="text-lg font-medium mb-2">
                                  Image Not Loaded
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Click the View button again to load the image
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    viewerData.document.viewUrl &&
                                    loadImageWithAuth(
                                      viewerData.document.viewUrl,
                                    )
                                  }
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Load Image
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : isPDFFile(viewerData.document.documentName) ? (
                          <div className="h-full w-full">
                            {pdfLoading ? (
                              <div className="h-full w-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                  <p className="mt-4 text-muted-foreground">
                                    Loading PDF...
                                  </p>
                                </div>
                              </div>
                            ) : pdfBlobUrl ? (
                              <iframe
                                src={`${pdfBlobUrl}#view=fitH`}
                                className="w-full h-full border-0"
                                title="PDF Preview"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center">
                                <FileText className="h-24 w-24 text-gray-400 mb-4" />
                                <p className="text-lg font-medium mb-2">
                                  PDF Not Loaded
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Click the View button again to load the PDF
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    viewerData.document.viewUrl &&
                                    loadPdfWithAuth(viewerData.document.viewUrl)
                                  }
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Load PDF
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center p-8">
                            <File className="h-24 w-24 text-gray-400 mb-4" />
                            <p className="text-lg font-medium mb-2">
                              Document Preview Not Available
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              This file format cannot be previewed in the
                              browser
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                handleDownloadDocument(
                                  viewerData.document.viewUrl,
                                  viewerData.document.documentName,
                                )
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download to View
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 p-8">
                        <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Document Not Available
                        </p>
                        <p className="text-sm text-muted-foreground">
                          The document URL is not available or the file cannot
                          be loaded.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t p-4 bg-white">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="rejection-reason"
                          className="text-sm font-medium"
                        >
                          Rejection Reason
                        </Label>
                        <Textarea
                          id="rejection-reason"
                          placeholder="Enter reason for rejection..."
                          rows={3}
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          disabled={actionLoading}
                          className="resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="default"
                          className="flex-1"
                          onClick={handleDocumentApprove}
                          disabled={
                            actionLoading ||
                            viewerData.document.originalStatus === "APPROVED"
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {actionLoading ? "Processing..." : "Approve Document"}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="flex-1"
                          onClick={handleDocumentReject}
                          disabled={
                            actionLoading ||
                            viewerData.document.originalStatus === "REJECTED" ||
                            !rejectionReason.trim()
                          }
                        >
                          {actionLoading ? "Processing..." : "Reject Document"}
                        </Button>
                      </div>

                      {viewerData.document.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800">
                            Previous Rejection Reason:
                          </p>
                          <p className="text-sm text-red-600">
                            {viewerData.document.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </ExchangeLayout>
  );
};

export default ExchangeKYBReview;
