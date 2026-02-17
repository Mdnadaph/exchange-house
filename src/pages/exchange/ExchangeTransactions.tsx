import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TransactionComments from "@/components/transactions/TransactionComments";
import ProofOfPaymentUpload from "@/components/transactions/ProofOfPaymentUpload";
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

interface TransactionDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: string;
  uploadedBy: string;
}

interface ApiTransaction {
  transactionId: string;
  reference: string;
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
  commentCount?: number;
  latestComment?: string | null;
  type: "SINGLE" | "BULK";
  itemCount: number;
  beneficiaryFeeAmount: number;
  netPayoutAmount: number;
  complianceStatus: string;
  // totalDebit: number;
}

interface ApiResponse {
  status: boolean;
  message: string | null;
  statusCode: number;
  data: {
    transactions: ApiTransaction[];
    pagination: {
      totalItems: number;
    };
  };
}

// Define the UI transaction interface
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
  beneficiaryFeeAmount: string;
  netPayoutAmount: string;
  complianceStatus: string;
  totalDebit: number;
}

const ExchangeTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState<string>("ALL");
  const [cookies] = useCookies(["token", "email", "fullName"]);
  const [page, setPage] = useState<number>(0);
  const [totalTransactionData, setTotalTransactionData] = useState<number>(0);

  const token = cookies.token;
  const fullname = cookies.fullName;

  // Fetch data from API
  useEffect(() => {
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

        const response = await axios.get<ApiResponse>(
          `${BASE_URL}/api/v1/transactions?type=${transactionType}&page=${page}&pageSize=10`,
          config,
        );

        const data = response?.data;
        setTotalTransactionData(data?.data?.pagination?.totalItems);
        if (data.status && data.data) {
          // Transform API data to match UI structure
          const transformedTransactions: Transaction[] =
            data?.data?.transactions?.map((apiTx) => ({
              id: apiTx.reference,
              branchName: apiTx.branchName || "",
              businessId: apiTx.businessId || "",
              beneficiary: apiTx.beneficiaryName || "",
              amount: apiTx?.sourceAmount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: apiTx.sourceCurrency,
              exchangeRate: apiTx.exchangeRate?.toFixed(3),
              localAmount: apiTx.convertedAmount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              localCurrency: apiTx.targetCurrency,
              status: apiTx?.status,
              type: apiTx?.type,
              purpose: apiTx.purpose || "",
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
              referenceNumber: apiTx?.reference,
              fees: apiTx.feeAmount?.toFixed(2),
              feeResponsibility: apiTx.feeResponsibility || "",
              branch: apiTx.branchName,
              failureReason: apiTx.failureReason || "",
              documents: apiTx.documents,
              commentCount: apiTx.commentCount || 0,
              latestComment: apiTx.latestComment || null,
              bulkCount: apiTx?.itemCount,

              complianceStatus: apiTx.complianceStatus || "",
              totalDebit: apiTx.totalDebit,
              
              beneficiaryFeeAmount:
                apiTx.beneficiaryFeeAmount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00",
              netPayoutAmount:
                apiTx.netPayoutAmount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00",
            }));
          setTransactions(transformedTransactions);
        } else {
          throw new Error(data.message || "Failed to fetch transactions");
        }
      } catch (err: any) {
        console.error("Error fetching transactions:", err);

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

    fetchTransactions();
  }, [transactionType]);
  // console.log("transitionData", transactions);
  // Filter transactions based on search
  const filteredTransactions = transactions.filter((transaction) => {
    return (
      searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.beneficiary
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.referenceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      COMPLETED: {
        variant: "default" as const,
        label: "Completed",
        icon: CheckCircle,
      },
      PENDING_APPROVAL: {
        variant: "secondary" as const,
        label: "Pending Approval",
        icon: Clock,
      },
      pending_payment: {
        variant: "destructive" as const,
        label: "Pending Payment",
        icon: Wallet,
      },
      APPROVED: {
        variant: "secondary" as const,
        label: "Approved",
        icon: Clock,
      },
      PROCESSING: {
        variant: "destructive" as const,
        label: "Processing",
        icon: Clock,
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        icon: AlertCircle,
      },
      REJECTED: {
        variant: "outline" as const,
        label: "Rejetced",
        icon: AlertCircle,
      },
      DRAFT: {
        variant: "outline" as const,
        label: "Draft",
        icon: AlertCircle,
      },
      COMPLIANCE_REVIEW: {
        variant: "outline" as const,
        label: "Compliance Review",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap?.PROCESSING;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      SINGLE: "bg-blue-100 text-blue-800",
      BULK: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Calculate statistics
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

  if (isLoading) {
    return (
      <ExchangeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </ExchangeLayout>
    );
  }

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              All Business Transactions
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage all business payment transactions
            </p>
          </div>
          <Button variant="outline" disabled={transactions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Show error message prominently */}
        {error && (
          <Card className="border-red-200 bg-red-50 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="font-medium text-red-800">
                    Authentication Error
                  </p>
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
                {statistics.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground">+0 this month</p>
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
              <div className="text-2xl font-bold text-green-600">
                {statistics.completedTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                {statistics.totalTransactions > 0
                  ? `${((statistics.completedTransactions / statistics.totalTransactions) * 100).toFixed(1)}% success rate`
                  : "No transactions"}
              </p>
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
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.pendingTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Volume
              </CardTitle>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${statistics.totalVolume.toLocaleString("en-US")}
              </div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Transactions</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by ID, business, beneficiary, or reference..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={error !== null}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setTransactionType("ALL")}
                >
                  All Status
                </Button>
                <Button variant="outline">All Branches</Button>
                <Button variant="outline">This Month</Button>
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
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Unable to load transactions
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
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
                {filteredTransactions.map((transaction) => {
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
                                  <span className=" text-primary text-2xl font-bold">
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
                                  {transaction.beneficiary || "Beneficiary"}
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
                                  {transaction.type === "BULK"
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
                                {transaction.currency.toUpperCase()}{" "}
                                {transaction.amount}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.localCurrency}
                                {transaction.localAmount}
                              </p>
                            </div>
                          </div>

                          {/* Transaction Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
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
                                1 {transaction.currency.toUpperCase()} =
                                {transaction.exchangeRate}
                                {transaction.localCurrency} AED
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Fee Details:
                              </span>
                              <p className="font-medium">
                                AED {transaction.fees}
                              </p>
                              {transaction.feeResponsibility && (
                                <p className="text-xs text-muted-foreground">
                                  Paid by: {transaction.feeResponsibility}
                                </p>
                              )}
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
                                Beneficiary Fee Amount:
                              </span>
                              <p className="font-medium">
                                AED {transaction.beneficiaryFeeAmount}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Net Payout Amount:
                              </span>
                              <p className="font-medium">
                                AED {transaction.netPayoutAmount}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Total Debit:
                              </span>
                              <p className="font-medium">
                                AED {transaction.totalDebit}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Compliance Status:
                              </span>
                              <p className="font-medium">
                                {transaction.complianceStatus.replace(/_/g, ' ')}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Reference:
                              </span>
                              <p className="font-medium">
                                {transaction.referenceNumber}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                              {transaction.documents &&
                                transaction.documents.length > 0 && (
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Documents
                                  </Button>
                                )}
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
                            </div>
                          </div>

                          {/* Comments Section */}
                          {expandedTransaction === transaction.id && (
                            <div className="mt-4 pt-4 border-t space-y-4">
                              <ProofOfPaymentUpload
                                transactionId={transaction.id}
                                userRole="Exchange"
                                userName="Sarah Wilson"
                              />
                              <TransactionComments
                                transactionId={transaction.id}
                                userRole={token}
                                userName={fullname}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalTransactionData > 10 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {transactions?.length} of {totalTransactionData}{" "}
                  beneficiaries
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
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeTransactions;
