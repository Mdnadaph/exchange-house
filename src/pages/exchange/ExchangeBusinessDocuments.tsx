import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
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
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";

const ExchangeBusinessDocuments = () => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [documents, setDocuments] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>({
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0,
    activeBusinesses: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  // ✅ CHANGED: track loading per document ID instead of a single boolean
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<
    "image" | "pdf" | "other"
  >("other");
  const [previewFileName, setPreviewFileName] = useState("");

  /* ================= VIEW DOCUMENT ================= */
  const handleView = async (doc: any) => {
    try {
      // ✅ CHANGED: set loading only for this specific document's ID
      setLoadingDocId(doc.documentId);
      setPreviewFileName(doc.documentName);

      const response = await axios.get(doc.viewUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const blob = response.data;
      const blobUrl = URL.createObjectURL(blob);

      if (doc.documentName.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
        setPreviewFileType("image");
      } else if (doc.documentName.match(/\.pdf$/i)) {
        setPreviewFileType("pdf");
      } else {
        setPreviewFileType("other");
      }

      setPreviewUrl(blobUrl);
      setPreviewOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "Unable to load document preview.",
      });
    } finally {
      // ✅ CHANGED: clear the loading ID when done
      setLoadingDocId(null);
    }
  };

  /* ================= CLOSE PREVIEW ================= */
  const handleClosePreview = (open: boolean) => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPreviewOpen(open);
  };

  /* ================= DOWNLOAD DOCUMENT ================= */
  const handleDownload = async (doc: any) => {
    try {
      const response = await axios.get(doc.viewUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download document",
      });
    }
  };

  /* ================= FETCH DOCUMENTS ================= */
  const fetchDocuments = async (page = 0) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/kyb/documents?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status) {
        setDocuments(res.data.data.documents || []);
        setDashboard(res.data.data.dashboard || {});
        setTotalPages(res.data.totalPages || 0);
        setCurrentPage(res.data.currentPage || 0);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load documents",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage);
  }, [currentPage]);

  /* ================= FILTER (status + search) ================= */
  const filteredDocuments = documents.filter((doc) => {
    if (selectedStatus !== "all") {
      if (selectedStatus === "verified" && doc.status !== "Verified")
        return false;
      if (
        selectedStatus === "pending_review" &&
        doc.status !== "Pending Review"
      )
        return false;
      if (selectedStatus === "rejected" && doc.status !== "Rejected")
        return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.documentName?.toLowerCase().includes(q) ||
        doc.businessName?.toLowerCase().includes(q) ||
        doc.documentType?.toLowerCase().includes(q) ||
        doc.branchName?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  /* ================= STATUS BADGE ================= */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "Pending Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Documents</h1>
            <p className="text-muted-foreground">
              View and manage all business documents across all branches
            </p>
          </div>
        </div>

        {/* ================= DASHBOARD ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm">Total Documents</CardTitle>
              <FileText />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.totalDocuments}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm">Verified</CardTitle>
              <CheckCircle />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dashboard.verifiedDocuments}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm">Pending Review</CardTitle>
              <Clock />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {dashboard.pendingDocuments}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm">Businesses</CardTitle>
              <Building2 />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.activeBusinesses}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= FILTERS ================= */}
        <Card>
          <CardContent className="p-6 flex gap-4 flex-wrap">
            <div className="flex-1">
              <Label>Search Documents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search by name, business, type, branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3 border rounded-md"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending_review">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* ================= DOCUMENT LIST ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!loading &&
              filteredDocuments.map((doc) => {
                // ✅ CHANGED: each row checks if ITS OWN ID is loading
                const isThisDocLoading = loadingDocId === doc.documentId;

                return (
                  <Card key={doc.documentId}>
                    <CardContent className="p-4 flex justify-between">
                      <div className="flex gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <div className="flex gap-2 flex-wrap items-center">
                            <h4 className="font-semibold">
                              {doc.documentName}
                            </h4>
                            {getStatusBadge(doc.status)}
                          </div>

                          <div className="text-xs text-muted-foreground flex gap-4 flex-wrap mt-1">
                            <span>
                              <Building2 className="inline h-3 w-3 mr-1" />
                              {doc.businessName}
                            </span>
                            <span>{doc.documentType}</span>
                            <span>
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {doc.uploadedAt}
                            </span>
                            <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                            <Badge variant="outline">{doc.branchName}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* ✅ CHANGED: only THIS button disables and shows spinner */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(doc)}
                          disabled={isThisDocLoading}
                        >
                          {isThisDocLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4 mr-1" />
                          )}
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>

                        {doc.status === "Pending Review" && (
                          <>
                            <Button variant="default" size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

            {!loading && filteredDocuments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No documents found</p>
                {(searchQuery || selectedStatus !== "all") && (
                  <p className="text-sm mt-1">
                    Try clearing your search or filter
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* ================= PREVIEW MODAL ================= */}
        <Dialog open={previewOpen} onOpenChange={handleClosePreview}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="truncate">{previewFileName}</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-auto p-4 bg-muted/10">
              {!previewUrl && (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {previewUrl && (
                <>
                  {previewFileType === "image" && (
                    <div className="flex justify-center items-center h-full">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                  )}

                  {previewFileType === "pdf" && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full min-h-[500px] border rounded"
                      title="PDF Preview"
                    />
                  )}

                  {previewFileType === "other" && (
                    <div className="text-center text-muted-foreground py-8">
                      Preview not available for this file type.
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBusinessDocuments;