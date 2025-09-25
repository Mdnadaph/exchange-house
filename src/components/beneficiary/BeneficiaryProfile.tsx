import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Banknote, 
  FileText, 
  Edit, 
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye
} from "lucide-react";

interface BeneficiaryProfileProps {
  beneficiary: {
    id: string;
    name: string;
    type: "individual" | "corporate";
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      country: string;
      postalCode?: string;
    };
    bankDetails: {
      bankName: string;
      accountNumber: string;
      accountName: string;
      swift?: string;
      currency: string;
    }[];
    relationship: string;
    status: string;
    verificationStatus: string;
    totalSent: string;
    transactionCount: number;
    lastTransaction?: string;
    registrationDate: string;
    documents: {
      type: string;
      status: string;
      uploadDate: string;
    }[];
  };
}

const BeneficiaryProfile = ({ beneficiary }: BeneficiaryProfileProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval", icon: Clock },
      verification_required: { variant: "destructive" as const, label: "Verification Required", icon: AlertTriangle },
      inactive: { variant: "outline" as const, label: "Inactive", icon: AlertTriangle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending_approval;
  };

  const getVerificationBadge = (status: string) => {
    const statusMap = {
      verified: { variant: "default" as const, label: "Verified" },
      pending: { variant: "secondary" as const, label: "Pending" },
      expired: { variant: "destructive" as const, label: "Expired" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const recentTransactions = [
    {
      id: "TXN-2024-001",
      amount: "15,000",
      currency: "USD",
      purpose: "Invoice Payment",
      date: "2024-01-16",
      status: "completed"
    },
    {
      id: "TXN-2024-005",
      amount: "8,500",
      currency: "USD", 
      purpose: "Service Payment",
      date: "2024-01-12",
      status: "completed"
    },
    {
      id: "TXN-2023-089",
      amount: "12,000",
      currency: "USD",
      purpose: "Equipment Purchase",
      date: "2023-12-28",
      status: "completed"
    }
  ];

  const status = getStatusBadge(beneficiary.status);
  const verification = getVerificationBadge(beneficiary.verificationStatus);
  const StatusIcon = status.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {beneficiary.type === "corporate" ? (
                <Building className="h-8 w-8 text-muted-foreground" />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{beneficiary.name}</h1>
              <p className="text-muted-foreground">ID: {beneficiary.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={status.variant} className="flex items-center gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
                <Badge variant={verification.variant} className="text-xs">
                  {verification.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {beneficiary.type === "corporate" ? "Corporate" : "Individual"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
          <Button variant="business">
            <CreditCard className="h-4 w-4 mr-2" />
            Send Payment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">USD {Number(beneficiary.totalSent).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{beneficiary.transactionCount} transactions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Transaction</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiary.lastTransaction || "Never"}</div>
            <p className="text-xs text-muted-foreground">Most recent payment</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Relationship</CardTitle>
            <Building className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiary.relationship}</div>
            <p className="text-xs text-muted-foreground">Business relationship</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered</CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiary.registrationDate}</div>
            <p className="text-xs text-muted-foreground">Registration date</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact & Address Information */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{beneficiary.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{beneficiary.phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <div className="font-medium">
                    <p>{beneficiary.address.line1}</p>
                    {beneficiary.address.line2 && <p>{beneficiary.address.line2}</p>}
                    <p>{beneficiary.address.city}, {beneficiary.address.country}</p>
                    {beneficiary.address.postalCode && <p>{beneficiary.address.postalCode}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {beneficiary.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">Uploaded {doc.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={doc.status === "approved" ? "default" : "secondary"} className="text-xs">
                      {doc.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bank Details & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bank Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Payout Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {beneficiary.bankDetails.map((bank, index) => (
                <Card key={index} className="border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{bank.bankName}</h4>
                          {index === 0 && <Badge variant="default" className="text-xs">Default</Badge>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Account Name:</span>
                            <p className="font-medium">{bank.accountName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Account Number:</span>
                            <p className="font-medium font-mono">****{bank.accountNumber.slice(-4)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Currency:</span>
                            <p className="font-medium">{bank.currency}</p>
                          </div>
                          {bank.swift && (
                            <div>
                              <span className="text-muted-foreground">SWIFT:</span>
                              <p className="font-medium font-mono">{bank.swift}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{transaction.purpose}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.id} • {transaction.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {transaction.currency} {Number(transaction.amount).toLocaleString()}
                    </p>
                    <Badge variant="default" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryProfile;