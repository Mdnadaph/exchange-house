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
  // console.log("Token:-",token);

  const [openViewer, setOpenViewer] = useState(false);
  const [activeDoc, setActiveDoc] = useState<any>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>({
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0,
    activeBusinesses: 0,
  });

  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleView = (doc: any) => {
    setActiveDoc(doc);
    setOpenViewer(true);
  };

  const handleDownload = async (doc: any) => {
    try {
      const response = await axios.get(doc.fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", doc.documentName || "document");
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

  /* ================= FILTER ================= */
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
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
                <Input className="pl-9" placeholder="Search..." />
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
            {!loading &&
              filteredDocuments.map((doc) => (
                <Card key={doc.documentId}>
                  <CardContent className="p-4 flex justify-between">
                    <div className="flex gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <div className="flex gap-2">
                          <h4 className="font-semibold">{doc.documentName}</h4>
                          {getStatusBadge(doc.status)}
                        </div>

                        <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc.viewUrl)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
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

                      {doc.status === "pending_review" && (
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
              ))}

            {!loading && filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No documents found
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

        {/* ============= Modal for View Documents =========== */}
        <Dialog open={openViewer} onOpenChange={setOpenViewer}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{activeDoc?.documentName}</DialogTitle>
            </DialogHeader>

            {activeDoc && (
              <>
                {/* IMAGE */}
                {activeDoc.fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                  <img
                    src={activeDoc.fileUrl}
                    alt="Document Preview"
                    className="w-full h-full object-contain"
                  />
                )}

                {/* PDF */}
                {activeDoc.fileUrl?.match(/\.pdf$/i) && (
                  <iframe
                    src={activeDoc.fileUrl}
                    className="w-full h-full border rounded"
                  />
                )}

                {/* OTHER FILES */}
                {!activeDoc.fileUrl?.match(/\.(jpg|jpeg|png|webp|pdf)$/i) && (
                  <div className="text-center text-muted-foreground">
                    Preview not available. Please download the file.
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBusinessDocuments;
