import { useState, useEffect, useRef } from "react";
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
  Info,
} from "lucide-react";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import axios from "axios";
import { PermissionGate } from "@/contexts/PermissionGate";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationSummary from "@/components/PaginationSummary";
import PaginationControl from "@/components/PaginationControl";

interface Document {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  status: string;
  viewUrl: string;
  rejectionReason?: string;
}

interface Business {
  id: string;
  name: string;
}

interface Dashboard {
  branchBusinesses: number;
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const BranchBusinessDocuments = () => {
  const [cookies] = useCookies(["token", "email", "fullName"]);
  const { toast } = useToast();
  const token = cookies.token;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard>({
    branchBusinesses: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0,
  });
  const [branchBusinesses, setBranchBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessLoading, setBusinessLoading] = useState<boolean>(false);
  const [businessAdminList, setBusinessAdminList] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      let fetchedDashboard: Dashboard | null = null;
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v3/staff/kyb/documents?page=${pagination.pageNumber}&size=${pagination.pageSize}&businessId=${businessId}&search=${debouncedValue}&status=${selectedStatus}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const res = response.data;
        if (!res.status) throw new Error(res.message || "Failed to fetch");
        if (!fetchedDashboard) {
          fetchedDashboard = res.data.dashboard;
        }
        const mappedDocuments: Document[] = res?.data?.documents?.map(
          (apiDoc: any) => ({
            id: apiDoc.documentId.toString(),
            businessId: apiDoc.businessId.toString(),
            businessName: apiDoc.businessName,
            name: apiDoc.documentName,
            rejectionReason: apiDoc?.rejectionReason,
            type: apiDoc.documentType,
            uploadDate: apiDoc.uploadedAt,
            size: formatBytes(apiDoc.fileSize),
            status: apiDoc.status.toLowerCase().replace(/\s+/g, "_"),
            viewUrl: apiDoc.viewUrl,
          }),
        );
        setDocuments(mappedDocuments);
        if (fetchedDashboard) {
          setDashboard(fetchedDashboard);
        }
        setPagination((prev) => ({
          ...prev,
          pageNumber: res?.currentPage,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        }));

        const businessMap = new Map<string, Business>();
        mappedDocuments?.forEach((doc) => {
          if (!businessMap.has(doc.businessId)) {
            businessMap.set(doc.businessId, {
              id: doc.businessId,
              name: doc.businessName,
            });
          }
        });
        setBranchBusinesses(Array.from(businessMap.values()));
      } catch (err) {
        // setError("Failed to fetch documents");
        toast({
          title: "Error",
          description: err?.response?.data?.message,
          variant: "destructive",
        });
        return;
      } finally {
        setLoading(false);
      }

      // Extract unique businesses
    };

    fetchDocuments();
  }, [
    token,
    businessId,
    selectedStatus,
    debouncedValue,
    pagination?.pageNumber,
  ]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchQuery, selectedBusiness, selectedStatus]);

  // const filteredDocuments = documents.filter((doc) => {
  //   const searchLower = searchQuery.toLowerCase();
  //   if (
  //     searchQuery &&
  //     !doc.name.toLowerCase().includes(searchLower) &&
  //     !doc.type.toLowerCase().includes(searchLower) &&
  //     !doc.businessName.toLowerCase().includes(searchLower)
  //   ) {
  //     return false;
  //   }
  //   if (selectedBusiness !== "all" && doc.businessId !== selectedBusiness)
  //     return false;
  //   if (selectedStatus !== "all" && doc.status !== selectedStatus) return false;
  //   return true;
  // });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "rejected":
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
      console.error("Error viewing document:", error);
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
      console.error("Error downloading document:", error);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const getBusinessAdminList = async () => {
    // IMPORTANT
    if (businessLoading || !hasMore) return;
    try {
      setBusinessLoading(true);
      const currentPage = page;
      const res = await axios.get(
        `${BASE_URL}/api/v3/business?page=${currentPage}&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        const newData = res?.data?.data?.businesses?.items || [];

        // No more data
        if (newData.length < 10) {
          setHasMore(false);
        }

        // Prevent duplicate data
        setBusinessAdminList((prev) => {
          const merged = [...prev, ...newData];

          const uniqueData = merged.filter(
            (item, index, self) =>
              index === self.findIndex((x) => x.id === item.id),
          );

          return uniqueData;
        });

        // NEXT PAGE
        setPage((prev) => prev + 1);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setBusinessLoading(false);
    }
  };

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
    if (isBottom && !businessLoading && hasMore) {
      getBusinessAdminList();
    }
  };
  useEffect(() => {
    getBusinessAdminList();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination?.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: 0,
    }));
  }, [businessId, debouncedValue, selectedStatus]);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Business Documents
            </h1>
            <p className="text-muted-foreground">
              View documents from businesses registered through this branch
            </p>
          </div>
          {/* <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button> */}
        </div>

        {/* Info Alert */}
        {/* <Card className="bg-accent-muted/20 border-accent">
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
        </Card> */}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Branch Businesses
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.branchBusinesses}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered through branch
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Documents
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.totalDocuments}
              </div>
              <p className="text-xs text-muted-foreground">
                From branch businesses
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {dashboard.verifiedDocuments}
              </div>
              <p className="text-xs text-muted-foreground">
                Approved documents
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
                {dashboard.pendingDocuments}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Documents</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by document name, type, or business..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPagination((prev) => ({
                        ...prev,
                        pageNumber: 0,
                      }));
                    }}
                  />
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="businessFilter">Filter by Business</Label>
                <select
                  id="businessFilter"
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Businesses</option>
                  {branchBusinesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="flex-1">
                <label>Filter By Business</label>
                <Select
                  value={businessId}
                  onValueChange={(val) => {
                    setBusinessId(val == "all" ? "" : val);
                    setPagination((prev) => ({
                      ...prev,
                      pageNumber: 0,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Business Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <div
                      ref={listRef}
                      onScroll={handleScroll}
                      className="max-h-60 overflow-y-auto"
                    >
                      {businessAdminList?.length > 0 && (
                        <SelectItem value="all">All</SelectItem>
                      )}
                      {businessAdminList?.map((c, index) => (
                        <SelectItem key={index} value={c?.id}>
                          {c?.companyName}
                        </SelectItem>
                      ))}
                      {/* OBSERVER TARGET */}
                      {businessLoading && (
                        <div className="py-2 text-center text-sm text-gray-500">
                          Loading...
                        </div>
                      )}
                      {/* {!hasMore && (
                        <div className="py-2 text-center text-sm text-gray-400">
                          No More Data
                        </div>
                      )} */}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="space-y-2">
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
              </div> */}
              <div className="flex-1">
                <label>Filter by Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={(val) => {
                    setSelectedStatus(val);
                    setPagination((prev) => ({
                      ...prev,
                      pageNumber: 0,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Business Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending_review">
                        {" "}
                        Pending Review
                      </SelectItem>
                      <SelectItem value="rejected"> Rejected</SelectItem>
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents ({documents?.length})
              </CardTitle>
              <PaginationSummary
                totalElements={pagination?.totalElements}
                pageSize={pagination?.pageSize}
                currentPage={pagination?.pageNumber}
                itemCount={documents?.length}
                itemLabel="Documents"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                      Loading Document...
                    </p>
                  </div>
                </div>
              ) : (
                documents?.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex md:items-center gap-3 flex-1 flex-wrap ">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold text-foreground">
                                {doc.name}
                              </h4>
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
                            {doc?.rejectionReason && (
                              <p className="text-xs text-muted-foreground pt-1">
                                Rejected Reason: {doc?.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PermissionGate permission="BTN_BRANCH_VIEW_DOCUMENT">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(doc.viewUrl)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission="BTN_BRANCH_DOWNLOAD_DOCUMENT">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownload(doc.viewUrl, doc.name)
                              }
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </PermissionGate>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {documents?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents found matching your filters.</p>
              </div>
            )}
            <PaginationControl
              currentPage={pagination?.pageNumber}
              totalPages={pagination?.totalPages}
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  pageNumber: page,
                }))
              }
            />
          </CardContent>
        </Card>
      </div>
    </BranchLayout>
  );
};

export default BranchBusinessDocuments;
