import { useState } from "react";
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
import { 
  CreditCard, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Wallet,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const UserTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  
  const transactions = [
    {
      id: "TXN-2024-001",
      beneficiary: "Global Suppliers Inc",
      amount: "15,000",
      currency: "USD",
      exchangeRate: "3.673",
      localAmount: "55,095",
      localCurrency: "AED",
      status: "completed",
      type: "single",
      purpose: "Invoice Payment",
      date: "2024-01-16 14:30",
      processedDate: "2024-01-16 14:45",
      referenceNumber: "REF-GS-001234",
      fees: "25.00",
      documents: ["invoice.pdf", "purchase_order.pdf"]
    },
    {
      id: "TXN-2024-002", 
      beneficiary: "Tech Solutions Ltd",
      amount: "8,500",
      currency: "USD",
      exchangeRate: "3.673",
      localAmount: "31,220.50",
      localCurrency: "AED",
      status: "pending_payment",
      type: "single",
      purpose: "Service Payment",
      date: "2024-01-16 10:15",
      processedDate: null,
      referenceNumber: "REF-TS-005678",
      fees: "15.00",
      documents: ["service_agreement.pdf"]
    },
    {
      id: "TXN-2024-003",
      beneficiary: "Multiple Recipients",
      amount: "25,000",
      currency: "USD", 
      exchangeRate: "3.673",
      localAmount: "91,825",
      localCurrency: "AED",
      status: "processing",
      type: "bulk",
      purpose: "Salary Payment",
      date: "2024-01-15 16:20",
      processedDate: null,
      referenceNumber: "REF-BULK-001",
      fees: "35.00",
      documents: ["payroll.xlsx", "employee_list.pdf"],
      bulkCount: 15
    },
    {
      id: "TXN-2024-004",
      beneficiary: "Marketing Agency",
      amount: "12,000",
      currency: "USD",
      exchangeRate: "3.675", 
      localAmount: "44,100",
      localCurrency: "AED",
      status: "failed",
      type: "single",
      purpose: "Marketing Services",
      date: "2024-01-15 09:30",
      processedDate: null,
      referenceNumber: "REF-MA-098765",
      fees: "20.00",
      documents: ["contract.pdf"],
      failureReason: "Insufficient funds"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { variant: "default" as const, label: "Completed", icon: CheckCircle },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval", icon: Clock },
      pending_payment: { variant: "destructive" as const, label: "Pending Payment", icon: Wallet },
      payment_verification: { variant: "secondary" as const, label: "Payment Verification", icon: Clock },
      processing: { variant: "destructive" as const, label: "Processing", icon: Clock },
      failed: { variant: "destructive" as const, label: "Failed", icon: AlertCircle },
      cancelled: { variant: "outline" as const, label: "Cancelled", icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.processing;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      single: "bg-blue-100 text-blue-800",
      bulk: "bg-purple-100 text-purple-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">View and manage your payment transactions</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <BulkTransactionForm />
            <SingleTransactionForm />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">148</div>
              <p className="text-xs text-muted-foreground">94.9% success rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">5</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.2M</div>
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
                    placeholder="Search by ID, beneficiary, or reference..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">This Month</Button>
                <Button variant="outline">Completed</Button>
                <Button variant="outline">Single</Button>
                <Button variant="outline">Bulk</Button>
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
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const status = getStatusBadge(transaction.status);
                const StatusIcon = status.icon;
                
                return (
                  <Card key={transaction.id} className="hover:shadow-md transition-smooth">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Transaction Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-foreground">{transaction.beneficiary}</h3>
                              <Badge variant={status.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                {transaction.type === "bulk" ? `Bulk (${transaction.bulkCount})` : "Single"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {transaction.id} • {transaction.purpose}
                            </p>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <p className="text-xl font-bold text-foreground">
                              {transaction.currency} {Number(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.localCurrency} {Number(transaction.localAmount).toLocaleString()}
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
                            <span className="text-muted-foreground">Exchange Rate:</span>
                            <p className="font-medium">1 {transaction.currency} = {transaction.exchangeRate} {transaction.localCurrency}</p>
                            <p className="text-xs text-muted-foreground">Fees: ${transaction.fees}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Reference:</span>
                            <p className="font-medium font-mono text-xs">{transaction.referenceNumber}</p>
                            {transaction.failureReason && (
                              <p className="text-xs text-destructive">Reason: {transaction.failureReason}</p>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-muted-foreground">
                              <FileText className="h-3 w-3 mr-1" />
                              Documents:
                            </div>
                            <div className="space-y-1">
                              {transaction.documents.map((doc, index) => (
                                <p key={index} className="text-xs text-primary cursor-pointer hover:underline">
                                  {doc}
                                </p>
                              ))}
                            </div>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setExpandedTransaction(
                                expandedTransaction === transaction.id ? null : transaction.id
                              )}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Comments
                              {expandedTransaction === transaction.id ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              )}
                            </Button>
                            {transaction.status === "failed" && (
                              <Button variant="business" size="sm">
                                Retry Payment
                              </Button>
                            )}
                            {transaction.status === "pending_payment" && (
                              <PaymentExecutionForm
                                transaction={{
                                  id: transaction.id,
                                  beneficiary: transaction.beneficiary,
                                  amount: transaction.amount,
                                  currency: transaction.currency,
                                  localAmount: transaction.localAmount,
                                  localCurrency: transaction.localCurrency,
                                  purpose: transaction.purpose
                                }}
                              />
                            )}
                          </div>
                          
                          {transaction.status === "pending_approval" && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>Awaiting approval from Treasury Department</span>
                              </div>
                            </div>
                          )}
                          
                          {transaction.status === "pending_payment" && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Wallet className="h-3 w-3" />
                                <span>Payment execution required to proceed</span>
                              </div>
                            </div>
                          )}
                          
                          {transaction.status === "payment_verification" && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Verifying payment proof - will route to Core system</span>
                              </div>
                            </div>
                          )}
                          
                          {transaction.status === "processing" && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Processing through approval workflow</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Comments Section */}
                        {expandedTransaction === transaction.id && (
                          <div className="mt-4 pt-4 border-t">
                            <TransactionComments 
                              transactionId={transaction.id}
                              userRole="Business"
                              userName="Sarah Smith"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 4 of 156 transactions
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

export default UserTransactions;