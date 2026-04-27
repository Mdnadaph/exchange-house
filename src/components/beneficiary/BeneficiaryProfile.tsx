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
  Eye,
} from "lucide-react";

interface BeneficiaryProfileProps {
  beneficiary: {
    id: string | number;
    name: string;
    type: "INDIVIDUAL" | "BUSINESS";
    email?: string;
    phone?: string;
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
    totalSent: string | number;
    transactionCount: number;
    lastTransaction?: string;
    registrationDate: string;
    transactionHistory: Array<{
      reference: string;
      bulkReference: string | null;
      type: "SINGLE" | "BULK";
      status: string;
      sourceAmount: number;
      convertedAmount: number;
      totalDebit: number;
      sourceCurrency: string;
      destinationCurrency: string;
      createdAt: string;
    }>;
    payoutDetails?: Array<{
      payoutMechanismId: number;
      payoutTypeName: string;
      providerName: string;
      countryCurrencyId: number;
      currencyCode: string;
      fieldValues: Record<string, string>;
    }>;
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
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      pending_approval: {
        variant: "secondary" as const,
        label: "Pending Approval",
        icon: Clock,
      },
      verification_required: {
        variant: "destructive" as const,
        label: "Verification Required",
        icon: AlertTriangle,
      },
      inactive: {
        variant: "outline" as const,
        label: "Inactive",
        icon: AlertTriangle,
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || statusMap.pending_approval
    );
  };

  const getVerificationBadge = (status: string) => {
    const statusMap = {
      verified: { variant: "default" as const, label: "Verified" },
      pending: { variant: "secondary" as const, label: "Pending" },
      expired: { variant: "destructive" as const, label: "Expired" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
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
      status: "completed",
    },
    {
      id: "TXN-2024-005",
      amount: "8,500",
      currency: "USD",
      purpose: "Service Payment",
      date: "2024-01-12",
      status: "completed",
    },
    {
      id: "TXN-2023-089",
      amount: "12,000",
      currency: "USD",
      purpose: "Equipment Purchase",
      date: "2023-12-28",
      status: "completed",
    },
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
              {beneficiary.type === "BUSINESS" ? (
                <Building className="h-8 w-8 text-muted-foreground" />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {beneficiary.name}
              </h1>
              {/*<p className="text-muted-foreground">ID: {beneficiary.id}</p>*/}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={status.variant}
                  className="flex items-center gap-1"
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
                <Badge variant={verification.variant} className="text-xs">
                  {verification.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {beneficiary.type === "BUSINESS" ? "business" : "Individual"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="flex space-x-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
          <Button variant="business">
            <CreditCard className="h-4 w-4 mr-2" />
            Send Payment
          </Button>
        </div>*/}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              USD {Number(beneficiary.totalSent).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {beneficiary.transactionCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Transaction
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beneficiary?.lastTransaction || "Never"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent payment</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Relationship
            </CardTitle>
            <Building className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beneficiary?.relationship}
            </div>
            <p className="text-xs text-muted-foreground">
              Business relationship
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registered
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beneficiary?.registrationDate}
            </div>
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
                    {beneficiary.address.line2 && (
                      <p>{beneficiary.address.line2}</p>
                    )}
                    <p>
                      {beneficiary.address.city}, {beneficiary.address.country}
                    </p>
                    {beneficiary.address.postalCode && (
                      <p>{beneficiary.address.postalCode}</p>
                    )}
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
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        doc.status === "approved" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
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
                Payout Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {beneficiary?.payoutDetails?.map((payout, index) => (
                <Card
                  key={index}
                  className="border-l-4 border-l-accent shadow-sm"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Type
                        </p>
                        <h3 className="font-semibold text-base">
                          {payout?.payoutTypeName}
                        </h3>
                      </div>

                      {/* <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button> */}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Provider</p>
                        <p className="font-medium">{payout?.providerName}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Currency</p>
                        <p className="font-medium">{payout?.currencyCode}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t pt-3" />

                    {/* Dynamic Fields */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Details</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {Object.entries(payout?.fieldValues || {}).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex flex-col border rounded-md p-2 bg-muted/30"
                            >
                              <span className="text-muted-foreground text-xs">
                                {key}
                              </span>
                              <span className="font-medium break-words">
                                {value}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
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
                {/* <Button variant="ghost" size="sm">
                  View All
                </Button> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {beneficiary?.transactionHistory?.map((transaction) => (
                <div
                  key={transaction?.reference}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                >
                  {/* Left Section */}
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {transaction?.type} Transaction
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {transaction?.reference}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Right Section */}
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">
                      {transaction?.sourceCurrency}{" "}
                      {Number(transaction?.sourceAmount)?.toLocaleString()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      → {transaction?.destinationCurrency}{" "}
                      {Number(transaction?.convertedAmount)?.toLocaleString()}
                    </p>

                    <Badge variant="outline" className="text-xs">
                      {transaction?.status}
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
