import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SingleTransactionForm from "@/components/transactions/SingleTransactionForm";
import BulkTransactionForm from "@/components/transactions/BulkTransactionForm";
import PaymentExecutionForm from "@/components/transactions/PaymentExecutionForm";
import TransactionComments from "@/components/transactions/TransactionComments";
import ProofOfPaymentUpload from "@/components/transactions/ProofOfPaymentUpload";
import TransactionDetailModal, {
  handleDownloadReceipt,
} from "./TransactionDetailModal";
import {
  CreditCard,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Building2,
  Wallet,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import DocumentUploadModal from "@/components/transactions/DocumentUpload";
import ComplianceStatus from "@/components/transactions/ComplianceStatus";

interface TransactionDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: string;
  uploadedBy: string;
  documentType?: string;
}

interface ApiTransaction {
  transactionId: string;
  status: string;
  sourceAmount: number;
  convertedAmount: number;
  feeAmount: number;
  totalDebit: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  branchId: number;
  branchName: string;
  createdAt: string;
  documentCount: number;
  documents: TransactionDocument[];
  businessName?: string;
  businessId?: string;
  beneficiaryName?: string;
  purpose?: string;
  feeResponsibility?: string;
  failureReason?: string;
  discountAmount: number;
  discounts: Array<{
    id: number;
    name: string;
    discountCode: string;
    description: string;
    type: "FIXED_AMOUNT" | "PERCENTAGE";
    discountValue: number;
    status: string;
    expiryDate: string;
    createdAt: string;
  }>;
}

interface ApiResponse {
  status: boolean;
  message: string | null;
  statusCode: number;
  data: {
    dashboard: {
      totalTransactions: number;
      completedTransactions: number;
      successRate: number;
      pendingTransactions: number;
      totalAmount: number;
      amountPeriod: string | null;
    };
    transactions: ApiTransaction[];
    pagination: { totalItems: number };
  };
}

interface Transaction {
  id: string;
  branchName: string;
  businessId: string;
  beneficiary: string;
  amount: string;
  currency: string;
  exchangeRate: string;
  localAmount: string;
  localCurrency: string;
  status: string;
  type: "SINGLE" | "BULK";
  purpose: string;
  date: string;
  processedDate: string | null;
  referenceNumber: string;
  fees: string;
  feeResponsibility: string;
  branch: string;
  bulkCount?: number;
  failureReason?: string;
  documents?: TransactionDocument[];
  totalDebit: number;
  discountValue: string;
  discountAmount: String;
  beneficiaryName: string;
  businessName: string;
  singleBeneficiary: {
    name: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
    nationality: string;
    city: string;
    state: string;
  };
  canExecutePayment?: boolean;
}

const UserTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disableButton, setDisableButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [cookies] = useCookies([
    "token",
    "email",
    "fullName",
    "firstName",
    "lastName",
    "currencyCode",
  ]);
  const [transactionType, setTransactionType] = useState<string>("ALL");
  const [page, setPage] = useState<number>(0);
  const [totalTransactionData, setTotalTransactionData] = useState<number>(0);

  //document upload state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTransaction, setUploadTransaction] =
    useState<Transaction | null>(null);
  const [openCompliance, setOpenCompliance] = useState(false);
  const [complianceTransaction, setComplianceTransaction] =
    useState<Transaction | null>(null);
  const token = cookies.token;
  const userName = cookies.fullName || "User";
  const fullname = cookies.fullName;
  const firstName = cookies.firstName;
  const lastName = cookies.lastName;
  const operatorName = firstName + lastName;
  const currencyCode = cookies.currencyCode;
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      };

      let url = `${BASE_URL}/api/v1/transactions?search=${encodeURIComponent(debouncedSearch)}&type=${transactionType}&page=${page}&size=10`;

      const response = await axios.get<ApiResponse>(url, config);
      const data = response.data;
      setTotalTransactionData(data?.data?.pagination?.totalItems);

      if (data?.data?.dashboard) {
        setDashboardData(data?.data?.dashboard);
      }
      if (data.status && data.data) {
        const transformedTransactions: Transaction[] =
          data?.data?.transactions?.map((apiTx: any) => {
            let discountValueDisplay = "—";
            let discountAmountDisplay = "0.00";

            if (apiTx.discounts && apiTx.discounts.length > 0) {
              const firstDiscount = apiTx.discounts[0];
              const totalDiscountAmount = apiTx.discountAmount || 0;
              discountAmountDisplay = totalDiscountAmount.toFixed(2);

              if (firstDiscount.type === "PERCENTAGE") {
                discountValueDisplay = `${firstDiscount.discountValue}%`;
              } else if (firstDiscount.type === "FIXED_AMOUNT") {
                discountValueDisplay = "—";
              }
            }

            return {
              businessPhone: apiTx?.businessPhone,
              businessName: apiTx?.businessName,
              id: apiTx.reference,
              sourceAmount: apiTx.sourceAmount,
              branchName: apiTx.branchName || "",
              convertedAmount: apiTx?.convertedAmount,
              businessId: apiTx.businessId || "",
              beneficiary: apiTx.beneficiaryName || "Beneficiary",
              amount: apiTx?.sourceAmount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: apiTx.sourceCurrency,
              totalDebit: apiTx.totalDebit,
              exchangeRate: apiTx?.exchangeRate?.toFixed(3),
              localAmount: apiTx?.convertedAmount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              localCurrency: apiTx.targetCurrency,
              status: apiTx.status,
              logoUrl: apiTx?.logoUrl,
              type: apiTx?.type,
              bulkCount: apiTx?.itemCount,
              purpose: apiTx.purpose || "Transaction",
              date: new Date(apiTx.createdAt)
                .toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .replace(",", ""),
              processedDate: null,
              referenceNumber: apiTx.reference,
              fees: apiTx?.feeAmount?.toFixed(2),
              feeResponsibility: apiTx.feeResponsibility || "",
              branch: apiTx.branchName,
              failureReason: apiTx.failureReason || "",
              //documents: apiTx.documents,
              documents: apiTx.documents?.map((doc: any) => ({
                ...doc,
                documentType: doc.documentType,
              })),
              discountValue: discountValueDisplay,
              discountAmount: discountAmountDisplay,
              beneficiaryName: apiTx.beneficiaryName,
              singleBeneficiary: {
                name: apiTx?.singleBeneficiary?.name,
                phone: apiTx?.singleBeneficiary?.phone,
                email: apiTx?.singleBeneficiary?.email,
                address: apiTx?.singleBeneficiary?.addressLine1,
                dateOfBirth: apiTx?.singleBeneficiary?.dateOfBirth,
                nationality: apiTx?.singleBeneficiary?.nationality,
                city: apiTx?.singleBeneficiary?.city,
                state: apiTx?.singleBeneficiary?.state,
              },
              canExecutePayment: apiTx.canExecutePayment,
            };
          });

        setTransactions(transformedTransactions);
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again.");
        } else if (err.response?.status === 403) {
          setError(
            "Forbidden: You don't have permission to view transactions.",
          );
        } else if (err.response?.status === 404) {
          setError("API endpoint not found. Please check the URL.");
        } else if (err.code === "ECONNABORTED") {
          setError("Request timeout. Please try again.");
        } else if (err.response) {
          setError(
            `Server Error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`,
          );
        } else if (err.request) {
          setError("Network error: Could not connect to server.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch transactions",
        );
      }
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchTransactions();
  }, [token, transactionType, page, debouncedSearch]);

  //const getStatusBadge = (status: string) => {
  //  const statusMap = {
  //    COMPLETED: {
  //      variant: "default" as const,
  //      label: "Completed",
  //      icon: CheckCircle,
  //    },
  //    PENDING_APPROVAL: {
  //      variant: "secondary" as const,
  //      label: "Pending Approval",
  //      icon: Clock,
  //    },
  //    pending_payment: {
  //      variant: "destructive" as const,
  //      label: "Pending Payment",
  //      icon: Wallet,
  //    },
  //    payment_verification: {
  //      variant: "secondary" as const,
  //      label: "Payment Verification",
  //      icon: Clock,
  //    },
  //    PROCESSING: {
  //      variant: "destructive" as const,
  //      label: "Processing",
  //      icon: Clock,
  //    },
  //    FAILED: {
  //      variant: "destructive" as const,
  //      label: "Failed",
  //      icon: AlertCircle,
  //    },
  //    APPROVED: {
  //      variant: "default" as const,
  //      label: "Approved",
  //      icon: AlertCircle,
  //    },
  //    cancelled: {
  //      variant: "outline" as const,
  //      label: "Cancelled",
  //      icon: AlertCircle,
  //    },
  //    COMPLIANCE_REVIEW: {
  //      variant: "outline" as const,
  //      label: "Compliance Review",
  //      icon: AlertCircle,
  //    },
  //  };
  //  return statusMap[status as keyof typeof statusMap] || statusMap.PROCESSING;
  //};

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        icon: any;
      }
    > = {
      // Draft
      DRAFT: {
        variant: "outline",
        label: "Draft",
        icon: FileText,
      },

      // Payment flow
      PAYMENT_PENDING: {
        variant: "secondary",
        label: "Payment Pending",
        icon: Wallet,
      },
      PAYMENT_VERIFICATION_PENDING: {
        variant: "secondary",
        label: "Payment Verification",
        icon: Clock,
      },
      PENDING_APPROVAL: {
        variant: "secondary",
        label: "Pending Approval",
        icon: Clock,
      },
      PROCESSING: {
        variant: "secondary",
        label: "Processing",
        icon: Clock,
      },

      // Final states
      COMPLETED: {
        variant: "default",
        label: "Completed",
        icon: CheckCircle,
      },
      REJECTED: {
        variant: "destructive",
        label: "Rejected",
        icon: AlertCircle,
      },
      FAILED: {
        variant: "destructive",
        label: "Failed",
        icon: AlertCircle,
      },

      // Compliance
      COMPLIANCE_REVIEW: {
        variant: "outline",
        label: "Compliance Review",
        icon: AlertCircle,
      },
    };

    return (
      statusMap[status] || { variant: "secondary", label: status, icon: Clock }
    );
  };
  const getTypeColor = (type: string) => {
    const colors = {
      SINGLE: "bg-blue-100 text-blue-800",
      BULK: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const calculateStatistics = () => {
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(
      (tx) => tx.status === "COMPLETED",
    ).length;
    const pendingTransactions = transactions.filter(
      (tx) =>
        tx.status === "PENDING_APPROVAL" ||
        tx.status === "pending_payment" ||
        tx.status === "PROCESSING",
    ).length;
    const totalVolume = transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.amount.replace(/,/g, "")),
      0,
    );
    return {
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      totalVolume,
    };
  };

  const statistics = calculateStatistics();

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your payment transactions
            </p>
          </div>
          <div className="flex space-x-3">
            <BulkTransactionForm refetch={fetchTransactions} />
            <SingleTransactionForm refetch={fetchTransactions} />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-red-200 bg-red-50 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalTransactions ??
                  statistics.totalTransactions}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {dashboardData?.completedTransactions ??
                  statistics.completedTransactions}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {dashboardData?.pendingTransactions ??
                  statistics.pendingTransactions}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {dashboardData?.totalAmount?.toLocaleString("en-US") ??
                  statistics.totalVolume.toLocaleString("en-US")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Transactions</Label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by ID, beneficiary, or reference..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={error !== null}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setTransactionType("ALL")}
                >
                  All Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTransactionType("COMPLETED")}
                >
                  Approved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTransactionType("SINGLE")}
                >
                  Single
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTransactionType("BULK")}
                >
                  Bulk
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Unable to load transactions
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {transactions.length === 0
                    ? "No transactions found"
                    : "No matching transactions"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "No transactions available in the system"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const status = getStatusBadge(transaction.status);
                  const StatusIcon = status.icon;

                  return (
                    <Card
                      key={transaction.id}
                      className="hover:shadow-md transition-smooth"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Transaction Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              {transaction.branchName && (
                                <div className="flex items-center gap-3">
                                  <Building2 className="h-8 w-8 text-primary" />
                                  <span className="text-primary text-2xl font-bold">
                                    {transaction.branchName}
                                  </span>
                                  {transaction.businessId && (
                                    <span className="text-xs text-muted-foreground">
                                      ({transaction.businessId})
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">
                                  {transaction.beneficiary}
                                </h3>
                                <Badge
                                  variant={status.variant}
                                  className="flex items-center gap-1"
                                >
                                  <StatusIcon className="h-4 w-4" />
                                  {status.label}
                                </Badge>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}
                                >
                                  {transaction?.type === "BULK"
                                    ? `Bulk (${transaction.bulkCount})`
                                    : "Single"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {transaction.id}
                                {transaction.purpose &&
                                  ` • ${transaction.purpose}`}
                              </p>
                            </div>

                            <div className="text-right space-y-1">
                              <p className="text-xl font-bold text-foreground">
                                {transaction?.currency?.toUpperCase()}
                                {transaction.amount}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.localCurrency}
                                {transaction.localAmount}
                              </p>
                            </div>
                          </div>

                          {/* Transaction Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                Submitted:
                              </div>
                              <p className="font-medium">{transaction.date}</p>
                              {transaction.processedDate && (
                                <p className="text-xs text-muted-foreground">
                                  Processed: {transaction.processedDate}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Exchange Rate:
                              </span>
                              <p className="font-medium">
                                1 AED =
                                {transaction?.exchangeRate
                                  ? (
                                      1 / Number(transaction?.exchangeRate)
                                    ).toFixed(2)
                                  : "-"}{" "}
                                {transaction.currency.toUpperCase()}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Fee Details:
                              </span>
                              <p className="font-medium">
                                {transaction.fees} AED
                              </p>
                              {transaction.feeResponsibility && (
                                <p className="text-xs text-muted-foreground">
                                  Paid by: {transaction.feeResponsibility}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Total Debit:
                              </span>
                              <p className="font-medium">
                                {transaction.totalDebit} AED
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Branch:
                              </span>
                              <p className="font-medium">
                                {transaction.branch}
                              </p>
                              {transaction.failureReason && (
                                <p className="text-xs text-red-600">
                                  Reason: {transaction.failureReason}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Reference:
                              </span>
                              <p className="font-medium font-mono text-xs">
                                {transaction?.referenceNumber}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Discount %:
                              </span>
                              <p className="font-medium">
                                {transaction.discountValue}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Discount Amount:
                              </span>
                              <p className="font-medium">
                                {transaction.discountAmount === "0.00"
                                  ? "—"
                                  : `AED ${transaction.discountAmount}`}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Beneficiary Name:
                              </span>
                              <p className="font-medium font-mono text-xs">
                                {transaction?.beneficiaryName}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Business Name:
                              </span>
                              <p className="font-medium font-mono text-xs">
                                {transaction?.businessName}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex space-x-2">
                              {/* ── View Details → opens modal ── */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedTransaction(transaction)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>

                              {/* ── Receipt → direct PDF download ── */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadReceipt(
                                    transaction,
                                    operatorName,
                                    currencyCode,
                                  )
                                }
                              >
                                <Download className="h-4 w-4 mr-1" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setUploadModalOpen(true);
                                  setUploadTransaction(transaction);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Upload Documents
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setExpandedTransaction(
                                    expandedTransaction === transaction.id
                                      ? null
                                      : transaction.id,
                                  )
                                }
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Comments
                                {expandedTransaction === transaction.id ? (
                                  <ChevronUp className="h-4 w-4 ml-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                // type="button"
                                // className="w-full bg-green-700 hover:bg-green-900"
                                onClick={() => {
                                  setComplianceTransaction(transaction);
                                  setOpenCompliance(true);
                                }}
                              >
                                Change Compliance Status
                              </Button>

                              {transaction.status === "failed" && (
                                <Button variant="default" size="sm">
                                  Retry Payment
                                </Button>
                              )}

                              {transaction.canExecutePayment &&
                                transaction.status === "PAYMENT_PENDING" && (
                                  <PaymentExecutionForm
                                    transaction={{
                                      id: transaction.id,
                                      beneficiary: transaction.beneficiary,
                                      amount: transaction.amount,
                                      currency: transaction.currency,
                                      localAmount: transaction.localAmount,
                                      localCurrency: transaction.localCurrency,
                                      purpose: transaction.purpose,
                                    }}
                                  />
                                )}
                            </div>
                          </div>
                          {openCompliance && complianceTransaction && (
                            <ComplianceStatus
                              open={openCompliance}
                              onClose={() => {
                                setOpenCompliance(false);
                                setComplianceTransaction(null);
                              }}
                              transactionReference={
                                complianceTransaction.referenceNumber
                              }
                              onSuccess={() => {
                                setOpenCompliance(false);
                                setComplianceTransaction(null);
                                fetchTransactions(); // Refresh the transaction list
                              }}
                            />
                          )}
                          {/* Comments Section */}
                          {expandedTransaction === transaction.id && (
                            <div className="mt-4 pt-4 border-t space-y-4">
                              <ProofOfPaymentUpload
                                transactionId={transaction.id}
                                userRole="Business"
                                userName={userName}
                                branchName={transaction.branchName}
                                initialDocuments={transaction.documents}
                              />
                              <TransactionComments
                                transactionId={transaction.id}
                                userRole="Business"
                                userName={userName}
                                branchName={transaction.branchName}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {totalTransactionData > 10 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {transactions?.length} of {totalTransactionData}{" "}
                      transation
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={(page + 1) * 10 >= totalTransactionData}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {uploadModalOpen && (
        <DocumentUploadModal
          open={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setUploadTransaction(null);
          }}
          documentType={uploadTransaction?.type}
          transactionReference={uploadTransaction?.referenceNumber}
          userRole="Exchange Admin"
          userName={fullname}
          onSuccess={() => {
            setUploadModalOpen(false);
            setUploadTransaction(null);
            fetchTransactions();
          }}
        />
      )}

      {/* ── Transaction Detail Modal ── */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </UserLayout>
  );
};

export default UserTransactions;
