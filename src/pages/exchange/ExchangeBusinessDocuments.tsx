// import { useState } from "react";
// import ExchangeLayout from "@/components/layout/ExchangeLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// // import { pagination } from "@/components/ui/pagination";
// import {
//   FileText,
//   Search,
//   Download,
//   Eye,
//   CheckCircle,
//   Clock,
//   X,
//   Building2,
//   Calendar,
//   Filter
// } from "lucide-react";

// import { useToast } from "@/hooks/use-toast";
// import BASE_URL from "@/config/config";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate, useParams } from "react-router-dom";

// const ExchangeBusinessDocuments = () => {
//   const [selectedBusiness, setSelectedBusiness] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");

//     const [cookies] = useCookies(["token", "email"]);

//     const [branches, setBranches] = useState<any[]>([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [totalElements, setTotalElements] = useState(0);
//     const [pageSize] = useState(4);
//     const token = cookies.token;
//     const email = cookies.email;

//   const businesses = [
//     { id: "BIZ-001", name: "Tech Solutions LLC" },
//     { id: "BIZ-002", name: "Smart Trading Corp" },
//     { id: "BIZ-003", name: "Global Enterprises" },
//     { id: "BIZ-004", name: "Digital Marketing Inc" }
//   ];

//   const documents = [
//     {
//       id: "DOC-001",
//       businessId: "BIZ-001",
//       businessName: "Tech Solutions LLC",
//       name: "Trade License.pdf",
//       type: "Trade License",
//       uploadDate: "2023-05-15",
//       uploadedBy: "Tech Solutions LLC",
//       size: "2.4 MB",
//       status: "verified",
//       branch: "Dubai Mall Branch"
//     },
//     {
//       id: "DOC-002",
//       businessId: "BIZ-001",
//       businessName: "Tech Solutions LLC",
//       name: "Tax Registration Certificate.pdf",
//       type: "Tax Certificate",
//       uploadDate: "2023-05-15",
//       uploadedBy: "Tech Solutions LLC",
//       size: "1.8 MB",
//       status: "verified",
//       branch: "Dubai Mall Branch"
//     },
//     {
//       id: "DOC-003",
//       businessId: "BIZ-001",
//       businessName: "Tech Solutions LLC",
//       name: "Bank Statement - January 2024.pdf",
//       type: "Bank Statement",
//       uploadDate: "2024-01-10",
//       uploadedBy: "Tech Solutions LLC",
//       size: "3.2 MB",
//       status: "pending_review",
//       branch: "Dubai Mall Branch"
//     },
//     {
//       id: "DOC-005",
//       businessId: "BIZ-002",
//       businessName: "Smart Trading Corp",
//       name: "Trade License.pdf",
//       type: "Trade License",
//       uploadDate: "2023-07-20",
//       uploadedBy: "Smart Trading Corp",
//       size: "2.1 MB",
//       status: "verified",
//       branch: "Abu Dhabi Branch"
//     },
//     {
//       id: "DOC-006",
//       businessId: "BIZ-002",
//       businessName: "Smart Trading Corp",
//       name: "Board Resolution 2024.pdf",
//       type: "Board Resolution",
//       uploadDate: "2024-01-15",
//       uploadedBy: "Smart Trading Corp",
//       size: "1.3 MB",
//       status: "pending_review",
//       branch: "Abu Dhabi Branch"
//     }
//   ];

//   const filteredDocuments = documents.filter(doc => {
//     if (selectedBusiness !== "all" && doc.businessId !== selectedBusiness) return false;
//     if (selectedStatus !== "all" && doc.status !== selectedStatus) return false;
//     return true;
//   });

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "verified":
//         return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
//       case "pending_review":
//         return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
//       case "rejected":
//         return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   return (
//     <ExchangeLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Business Documents</h1>
//             <p className="text-muted-foreground">View and manage all business documents across all branches</p>
//           </div>
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export Report
//           </Button>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
//               <FileText className="h-5 w-5 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{documents.length}</div>
//               <p className="text-xs text-muted-foreground">From {businesses.length} businesses</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
//               <CheckCircle className="h-5 w-5 text-success" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-success">
//                 {documents.filter(d => d.status === "verified").length}
//               </div>
//               <p className="text-xs text-muted-foreground">Approved documents</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
//               <Clock className="h-5 w-5 text-warning" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-warning">
//                 {documents.filter(d => d.status === "pending_review").length}
//               </div>
//               <p className="text-xs text-muted-foreground">Awaiting verification</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Businesses</CardTitle>
//               <Building2 className="h-5 w-5 text-accent" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{businesses.length}</div>
//               <p className="text-xs text-muted-foreground">Active businesses</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="shadow-card">
//           <CardContent className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1">
//                 <Label htmlFor="search">Search Documents</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="search"
//                     placeholder="Search by document name, type, or business..."
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="businessFilter">Filter by Business</Label>
//                 <select
//                   id="businessFilter"
//                   value={selectedBusiness}
//                   onChange={(e) => setSelectedBusiness(e.target.value)}
//                   className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
//                 >
//                   <option value="all">All Businesses</option>
//                   {businesses.map((business) => (
//                     <option key={business.id} value={business.id}>{business.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="statusFilter">Filter by Status</Label>
//                 <select
//                   id="statusFilter"
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="verified">Verified</option>
//                   <option value="pending_review">Pending Review</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Documents List */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-primary" />
//               Documents ({filteredDocuments.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {filteredDocuments.map((doc) => (
//                 <Card key={doc.id} className="hover:shadow-md transition-smooth">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 flex-1">
//                         <FileText className="h-8 w-8 text-primary" />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <h4 className="font-semibold text-foreground">{doc.name}</h4>
//                             {getStatusBadge(doc.status)}
//                           </div>
//                           <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
//                             <span className="flex items-center gap-1">
//                               <Building2 className="h-3 w-3" />
//                               {doc.businessName} ({doc.businessId})
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <FileText className="h-3 w-3" />
//                               {doc.type}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {doc.uploadDate}
//                             </span>
//                             <span>{doc.size}</span>
//                             <Badge variant="outline" className="text-xs">{doc.branch}</Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button variant="outline" size="sm">
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Download className="h-4 w-4 mr-1" />
//                           Download
//                         </Button>
//                         {doc.status === "pending_review" && (
//                           <>
//                             <Button variant="default" size="sm">
//                               <CheckCircle className="h-4 w-4 mr-1" />
//                               Verify
//                             </Button>
//                             <Button variant="destructive" size="sm">
//                               <X className="h-4 w-4 mr-1" />
//                               Reject
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {filteredDocuments.length === 0 && (
//               <div className="text-center py-8 text-muted-foreground">
//                 <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                 <p>No documents found matching your filters.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </ExchangeLayout>
//   );
// };

// export default ExchangeBusinessDocuments;

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
