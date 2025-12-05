import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeneficiaryRegistrationForm from "@/components/beneficiary/BeneficiaryRegistrationForm";
import BeneficiaryProfile from "@/components/beneficiary/BeneficiaryProfile";
import BeneficiaryGroupForm from "@/components/beneficiary/BeneficiaryGroupForm";
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
  Banknote,
  Eye,
  Filter,
  Globe,
  CreditCard,
  Wallet,
  FolderPlus,
  Layers,
  User
} from "lucide-react";
import { useState } from "react";

export interface BeneficiaryGroup {
  id: string;
  name: string;
  description: string;
  beneficiaryIds: string[];
  beneficiaries: any[];
  createdAt: string;
  memberCount: number;
}

const UserBeneficiaries = () => {
  const [view, setView] = useState<"list" | "register" | "profile">("list");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"beneficiaries" | "groups">("beneficiaries");
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<BeneficiaryGroup[]>([
    {
      id: "GRP-001",
      name: "Monthly Payroll",
      description: "Regular monthly salary payments",
      beneficiaryIds: ["BEN-001", "BEN-003"],
      beneficiaries: [],
      createdAt: "2024-01-01",
      memberCount: 2
    },
    {
      id: "GRP-002",
      name: "Vendor Payments Q1",
      description: "Q1 vendor and supplier payments",
      beneficiaryIds: ["BEN-001", "BEN-002"],
      beneficiaries: [],
      createdAt: "2024-01-10",
      memberCount: 2
    }
  ]);

  const beneficiaries = [
    {
      id: "BEN-001",
      name: "Global Suppliers Inc",
      type: "corporate" as const,
      email: "payments@globalsuppliers.com",
      phone: "+971 4 123 4567",
      address: {
        line1: "Dubai International Financial Centre",
        line2: "Level 15, Building 3",
        city: "Dubai",
        country: "United Arab Emirates",
        postalCode: "00000"
      },
      bankDetails: [{
        bankName: "Emirates NBD",
        accountNumber: "1234567890",
        accountName: "Global Suppliers Inc",
        swift: "EBILAEAD",
        currency: "USD"
      }],
      relationship: "Supplier",
      status: "active",
      verificationStatus: "verified",
      lastUsed: "2024-01-16",
      totalSent: "125000",
      transactionCount: 15,
      payoutMethod: "Bank Transfer",
      registrationDate: "2023-08-15",
      documents: [
        { type: "Trade License", status: "approved", uploadDate: "2023-08-15" },
        { type: "Bank Statement", status: "approved", uploadDate: "2023-08-15" }
      ],
      riskLevel: "low",
      monthlyLimit: "50000",
      averageTransaction: "8333"
    },
    {
      id: "BEN-002",
      name: "Tech Solutions Ltd", 
      type: "corporate" as const,
      email: "finance@techsolutions.ae",
      phone: "+971 2 987 6543",
      address: {
        line1: "Abu Dhabi Global Market",
        city: "Abu Dhabi", 
        country: "United Arab Emirates"
      },
      bankDetails: [{
        bankName: "ADCB Bank",
        accountNumber: "9876543210",
        accountName: "Tech Solutions Ltd",
        currency: "AED"
      }],
      relationship: "Service Provider",
      status: "pending_approval",
      verificationStatus: "pending",
      lastUsed: "Never",
      totalSent: "0",
      transactionCount: 0,
      payoutMethod: "Bank Transfer",
      registrationDate: "2024-01-15",
      documents: [
        { type: "Trade License", status: "pending", uploadDate: "2024-01-15" },
        { type: "Bank Statement", status: "pending", uploadDate: "2024-01-15" }
      ],
      riskLevel: "medium",
      monthlyLimit: "25000",
      averageTransaction: "0"
    },
    {
      id: "BEN-003",
      name: "Office Supplies Co",
      type: "corporate" as const,
      email: "orders@officesupplies.ae",
      phone: "+971 4 555 0123",
      address: {
        line1: "Jebel Ali Free Zone",
        city: "Dubai",
        country: "United Arab Emirates"
      },
      bankDetails: [{
        bankName: "HSBC UAE",
        accountNumber: "5555666677",
        accountName: "Office Supplies Co",
        currency: "USD"
      }],
      relationship: "Supplier",
      status: "active",
      verificationStatus: "verified", 
      lastUsed: "2024-01-15",
      totalSent: "45000",
      transactionCount: 8,
      payoutMethod: "Bank Transfer",
      registrationDate: "2023-11-10",
      documents: [
        { type: "Trade License", status: "approved", uploadDate: "2023-11-10" },
        { type: "Bank Statement", status: "approved", uploadDate: "2023-11-10" }
      ],
      riskLevel: "low", 
      monthlyLimit: "30000",
      averageTransaction: "5625"
    },
    {
      id: "BEN-004",
      name: "John Smith",
      type: "individual" as const,
      email: "j.smith@email.com",
      phone: "+44 20 1234 5678", 
      address: {
        line1: "123 London Street",
        city: "London",
        country: "United Kingdom"
      },
      bankDetails: [{
        bankName: "Barclays Bank UK",
        accountNumber: "12345678",
        accountName: "John Smith",
        swift: "BARCGB22",
        currency: "GBP"
      }],
      relationship: "Consultant",
      status: "verification_required",
      verificationStatus: "expired",
      lastUsed: "2024-01-10",
      totalSent: "8500",
      transactionCount: 2,
      payoutMethod: "Bank Transfer", 
      registrationDate: "2023-06-20",
      documents: [
        { type: "Passport", status: "expired", uploadDate: "2023-06-20" },
        { type: "Bank Statement", status: "approved", uploadDate: "2023-12-15" }
      ],
      riskLevel: "medium",
      monthlyLimit: "15000", 
      averageTransaction: "4250"
    }
  ];

  const filteredBeneficiaries = beneficiaries.filter(ben => {
    if (filterStatus === "all") return true;
    return ben.status === filterStatus;
  });

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

  const getRiskColor = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      high: "bg-red-100 text-red-800"
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  if (view === "register") {
    return (
      <UserLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setView("list")}>
              ← Back to Beneficiaries
            </Button>
          </div>
          <BeneficiaryRegistrationForm />
        </div>
      </UserLayout>
    );
  }

  if (view === "profile" && selectedBeneficiary) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setView("list")}>
              ← Back to Beneficiaries
            </Button>
          </div>
          <BeneficiaryProfile beneficiary={selectedBeneficiary} />
        </div>
      </UserLayout>
    );
  }

  const handleGroupCreated = (group: BeneficiaryGroup) => {
    // Update group with full beneficiary data
    const groupWithBeneficiaries = {
      ...group,
      beneficiaries: beneficiaries.filter(b => group.beneficiaryIds.includes(b.id))
    };
    setBeneficiaryGroups(prev => [...prev, groupWithBeneficiaries]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setBeneficiaryGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Update existing groups with beneficiary data for export
  const groupsWithBeneficiaryData = beneficiaryGroups.map(group => ({
    ...group,
    beneficiaries: beneficiaries.filter(b => group.beneficiaryIds.includes(b.id))
  }));

  // Export groups for use in BulkTransactionForm
  if (typeof window !== 'undefined') {
    (window as any).__beneficiaryGroups = groupsWithBeneficiaryData;
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Beneficiaries</h1>
          <p className="text-muted-foreground">Manage your payment recipients, groups, and verification status</p>
        </div>
        <div className="flex gap-2">
          <BeneficiaryGroupForm 
            beneficiaries={beneficiaries}
            onGroupCreated={handleGroupCreated}
            trigger={
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            }
          />
          <Button variant="business" onClick={() => setView("register")}>
            <Plus className="h-4 w-4 mr-2" />
            Register Beneficiary
          </Button>
        </div>
      </div>

      {/* Payout Destinations & Exchange Rates Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Available Payout Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { country: "India", code: "IN", exchangeRate: "22.45", fees: "5.00" },
                { country: "Philippines", code: "PH", exchangeRate: "3.67", fees: "3.50" },
                { country: "Pakistan", code: "PK", exchangeRate: "84.50", fees: "4.00" },
                { country: "Bangladesh", code: "BD", exchangeRate: "29.75", fees: "3.00" },
                { country: "UAE", code: "AE", exchangeRate: "1.00", fees: "2.00" }
              ].map((destination) => (
                <div key={destination.code} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{destination.code}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{destination.country}</p>
                      <p className="text-xs text-muted-foreground">
                        Rate: 1 AED = {destination.exchangeRate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Available</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fee: AED {destination.fees}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Supported Payout Mechanisms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Bank Account Transfer</p>
                  <p className="text-sm text-muted-foreground">Direct transfer to beneficiary bank account</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Digital Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Mobile wallets and digital payment platforms
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-medium text-foreground mb-2">Wallet Providers</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• India: Paymi India</p>
                  <p>• Philippines: GCash, PayMaya</p>
                  <p>• Bangladesh: bKash, Nagad</p>
                  <p>• UAE: Paymi UAE</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Beneficiaries</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{beneficiaries.length}</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Groups</CardTitle>
              <Layers className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{beneficiaryGroups.length}</div>
              <p className="text-xs text-muted-foreground">For bulk payments</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {beneficiaries.filter(b => b.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Verified & active</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {beneficiaries.filter(b => b.status === "pending_approval").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Need Action</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {beneficiaries.filter(b => b.verificationStatus === "expired" || b.verificationStatus === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">Require verification</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
              <AlertCircle className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {beneficiaries.filter(b => b.riskLevel === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Enhanced monitoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Beneficiaries and Groups */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "beneficiaries" | "groups")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="beneficiaries" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Beneficiaries
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-6">
            {/* Groups Section */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Beneficiary Groups
                  </CardTitle>
                  <BeneficiaryGroupForm 
                    beneficiaries={beneficiaries}
                    onGroupCreated={handleGroupCreated}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {groupsWithBeneficiaryData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No groups created yet</p>
                    <p className="text-sm">Create groups to organize beneficiaries for bulk transactions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupsWithBeneficiaryData.map((group) => (
                      <Card key={group.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{group.name}</h3>
                                <Badge variant="secondary">
                                  {group.memberCount} members
                                </Badge>
                              </div>
                              {group.description && (
                                <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {group.beneficiaries.slice(0, 5).map((ben) => (
                                  <Badge key={ben.id} variant="outline" className="flex items-center gap-1">
                                    {ben.type === "corporate" ? (
                                      <Building className="h-3 w-3" />
                                    ) : (
                                      <User className="h-3 w-3" />
                                    )}
                                    {ben.name}
                                  </Badge>
                                ))}
                                {group.beneficiaries.length > 5 && (
                                  <Badge variant="outline">+{group.beneficiaries.length - 5} more</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries" className="mt-6 space-y-6">

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
                    placeholder="Search by name, account, bank, or country..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All Status
                </Button>
                <Button 
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button 
                  variant={filterStatus === "pending_approval" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending_approval")}
                >
                  Pending
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiaries List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Registered Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBeneficiaries.map((beneficiary) => {
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
                              {beneficiary.type === "corporate" ? (
                                <Building className="h-6 w-6 text-muted-foreground" />
                              ) : (
                                <Users className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground">{beneficiary.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {beneficiary.type === "corporate" ? "Corporate" : "Individual"}
                                </Badge>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(beneficiary.riskLevel)}`}>
                                  {beneficiary.riskLevel?.toUpperCase()} RISK
                                </span>
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
                          
                          {/* Enhanced Beneficiary Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Banknote className="h-3 w-3 mr-1" />
                                Primary Bank:
                              </div>
                              <p className="font-medium">{beneficiary.bankDetails[0]?.bankName}</p>
                              <p className="text-xs">****{beneficiary.bankDetails[0]?.accountNumber.slice(-4)}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                Location:
                              </div>
                              <p className="font-medium">{beneficiary.address.country}</p>
                              <p className="text-xs">{beneficiary.bankDetails[0]?.currency} Account</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Transaction History:</span>
                              <p className="font-medium">{beneficiary.transactionCount} payments</p>
                              <p className="text-xs">Last: {beneficiary.lastUsed}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Total Sent:</span>
                              <p className="font-medium">{beneficiary.bankDetails[0]?.currency} {Number(beneficiary.totalSent).toLocaleString()}</p>
                              <p className="text-xs">Avg: {beneficiary.averageTransaction ? beneficiary.bankDetails[0]?.currency + " " + Number(beneficiary.averageTransaction).toLocaleString() : "N/A"}</p>
                            </div>
                          </div>

                          {/* Risk & Compliance Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Relationship:</span>
                              <p className="font-medium">{beneficiary.relationship}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Monthly Limit:</span>
                              <p className="font-medium">{beneficiary.bankDetails[0]?.currency} {Number(beneficiary.monthlyLimit).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Payout Method:</span>
                              <p className="font-medium">{beneficiary.payoutMethod}</p>
                            </div>
                          </div>

                          {/* Documents Status */}
                          <div className="border-t pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-muted-foreground">Documents Status:</span>
                              <div className="flex space-x-2">
                                {beneficiary.documents.map((doc, index) => (
                                  <Badge 
                                    key={index}
                                    variant={doc.status === "approved" ? "default" : doc.status === "pending" ? "secondary" : "destructive"}
                                    className="text-xs"
                                  >
                                    {doc.type}: {doc.status}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Actions */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedBeneficiary(beneficiary);
                              setView("profile");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Details
                          </Button>
                          {beneficiary.status === "active" && (
                            <Button variant="business" size="sm">
                              Send Payment
                            </Button>
                          )}
                          {(beneficiary.verificationStatus === "expired" || beneficiary.verificationStatus === "rejected") && (
                            <Button variant="destructive" size="sm">
                              Re-verify
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
                Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries
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
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default UserBeneficiaries;