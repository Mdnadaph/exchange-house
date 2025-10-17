import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Info
} from "lucide-react";

const BranchTransactions = () => {
  // Mock data - Branch only sees transactions for businesses registered through them
  const transactions = [
    {
      id: "TXN-2024-001",
      businessName: "Tech Solutions LLC",
      businessId: "BIZ-001",
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
      feeResponsibility: "Business",
      registeredDate: "2023-05-15"
    },
    {
      id: "TXN-2024-003",
      businessName: "Global Enterprises",
      businessId: "BIZ-003",
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
      feeResponsibility: "Business",
      bulkCount: 15,
      registeredDate: "2023-08-22"
    },
    {
      id: "TXN-2024-005",
      businessName: "Retail Solutions Ltd",
      businessId: "BIZ-005",
      beneficiary: "Supplier Network",
      amount: "5,500",
      currency: "USD",
      exchangeRate: "3.673", 
      localAmount: "20,201.50",
      localCurrency: "AED",
      status: "pending_payment",
      type: "single",
      purpose: "Supplier Payment",
      date: "2024-01-14 11:20",
      processedDate: null,
      referenceNumber: "REF-SN-445566",
      fees: "10.00",
      feeResponsibility: "Beneficiary",
      registeredDate: "2023-11-10"
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
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branch Transactions</h1>
            <p className="text-muted-foreground">Monitor transactions for businesses registered through this branch</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Branch Data
          </Button>
        </div>

        {/* Info Alert */}
        <Card className="bg-accent-muted/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Branch Transaction View</p>
                <p className="text-sm text-muted-foreground">
                  You can only view transactions for businesses that were registered through Dubai Mall Branch. 
                  Currently showing transactions from 3 registered businesses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Businesses</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Registered through branch</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">+23 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">312</div>
              <p className="text-xs text-muted-foreground">96.3% success rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.8M</div>
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
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">All Businesses</Button>
                <Button variant="outline">This Month</Button>
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
                              <Building2 className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-primary">{transaction.businessName}</span>
                              <span className="text-xs text-muted-foreground">({transaction.businessId})</span>
                              <Badge variant="outline" className="text-xs">
                                Registered: {transaction.registeredDate}
                              </Badge>
                            </div>
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
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Fee Details:</span>
                            <p className="font-medium">${transaction.fees}</p>
                            <p className="text-xs text-muted-foreground">Paid by: {transaction.feeResponsibility}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Reference:</span>
                            <p className="font-medium font-mono text-xs">{transaction.referenceNumber}</p>
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
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Documents
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 3 of 324 transactions
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
    </BranchLayout>
  );
};

export default BranchTransactions;
