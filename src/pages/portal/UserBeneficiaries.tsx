import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building,
  MapPin,
  Banknote
} from "lucide-react";

const UserBeneficiaries = () => {
  const beneficiaries = [
    {
      id: "BEN-001",
      name: "Global Suppliers Inc",
      type: "Corporate",
      accountNumber: "****1234",
      bankName: "Emirates NBD",
      currency: "USD",
      country: "United Arab Emirates",
      status: "active",
      lastUsed: "2024-01-16",
      totalSent: "125,000",
      transactionCount: 15,
      payoutMethod: "Bank Transfer",
      verificationStatus: "verified"
    },
    {
      id: "BEN-002",
      name: "Tech Solutions Ltd", 
      type: "Corporate",
      accountNumber: "****5678",
      bankName: "ADCB Bank",
      currency: "AED",
      country: "United Arab Emirates", 
      status: "pending_approval",
      lastUsed: "Never",
      totalSent: "0",
      transactionCount: 0,
      payoutMethod: "Bank Transfer",
      verificationStatus: "pending"
    },
    {
      id: "BEN-003",
      name: "Office Supplies Co",
      type: "Corporate", 
      accountNumber: "****9876",
      bankName: "HSBC UAE",
      currency: "USD",
      country: "United Arab Emirates",
      status: "active",
      lastUsed: "2024-01-15", 
      totalSent: "45,000",
      transactionCount: 8,
      payoutMethod: "Bank Transfer",
      verificationStatus: "verified"
    },
    {
      id: "BEN-004",
      name: "John Smith",
      type: "Individual",
      accountNumber: "****4321", 
      bankName: "First Abu Dhabi Bank",
      currency: "USD",
      country: "United Kingdom",
      status: "verification_required",
      lastUsed: "2024-01-10",
      totalSent: "8,500", 
      transactionCount: 2,
      payoutMethod: "Bank Transfer",
      verificationStatus: "expired"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval", icon: Clock },
      verification_required: { variant: "destructive" as const, label: "Verification Required", icon: AlertCircle },
      inactive: { variant: "outline" as const, label: "Inactive", icon: AlertCircle }
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

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Beneficiaries</h1>
            <p className="text-muted-foreground">Manage your payment recipients and their details</p>
          </div>
          <Button variant="business">
            <Plus className="h-4 w-4 mr-2" />
            Add Beneficiary
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Beneficiaries</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">14</div>
              <p className="text-xs text-muted-foreground">78% active rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Require Action</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">2</div>
              <p className="text-xs text-muted-foreground">Need verification</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Beneficiaries</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by name, account, or bank..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">Active Only</Button>
                <Button variant="outline">Corporate</Button>
                <Button variant="outline">Individual</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiaries List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => {
                const status = getStatusBadge(beneficiary.status);
                const verification = getVerificationBadge(beneficiary.verificationStatus);
                const StatusIcon = status.icon;
                
                return (
                  <Card key={beneficiary.id} className="border-l-4 border-l-primary hover:shadow-md transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          {/* Beneficiary Header */}
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              {beneficiary.type === "Corporate" ? (
                                <Building className="h-6 w-6 text-muted-foreground" />
                              ) : (
                                <Users className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground">{beneficiary.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {beneficiary.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">ID: {beneficiary.id}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={status.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                              <Badge variant={verification.variant} className="text-xs">
                                {verification.label}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Beneficiary Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Banknote className="h-3 w-3 mr-1" />
                                Bank Details:
                              </div>
                              <p className="font-medium">{beneficiary.bankName}</p>
                              <p className="text-xs">{beneficiary.accountNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                Country:
                              </div>
                              <p className="font-medium">{beneficiary.country}</p>
                              <p className="text-xs">{beneficiary.currency} Account</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Last Transaction:</span>
                              <p className="font-medium">{beneficiary.lastUsed}</p>
                              <p className="text-xs">{beneficiary.transactionCount} transactions</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Total Sent:</span>
                              <p className="font-medium">{beneficiary.currency} {Number(beneficiary.totalSent).toLocaleString()}</p>
                              <p className="text-xs">{beneficiary.payoutMethod}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {beneficiary.status === "active" && (
                            <Button variant="business" size="sm">
                              Send Payment
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                Showing 4 of 18 beneficiaries
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

export default UserBeneficiaries;