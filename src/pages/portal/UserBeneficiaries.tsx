// import UserLayout from "@/components/layout/UserLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import BeneficiaryRegistrationForm from "@/components/beneficiary/BeneficiaryRegistrationForm";
// import BeneficiaryProfile from "@/components/beneficiary/BeneficiaryProfile";
// import BeneficiaryGroupForm from "@/components/beneficiary/BeneficiaryGroupForm";
// import {
//  Users,
//  Plus,
//  Search,
//  Edit,
//  Trash2,
//  CheckCircle,
//  Clock,
//  AlertCircle,
//  Building,
//  MapPin,
//  Banknote,
//  Eye,
//  Filter,
//  Globe,
//  CreditCard,
//  Wallet,
//  FolderPlus,
//  Layers,
//  User,
// } from "lucide-react";
// import { useState } from "react";

// export interface BeneficiaryGroup {
//  id: string;
//  name: string;
//  description: string;
//  beneficiaryIds: string[];
//  beneficiaries: any[];
//  createdAt: string;
//  memberCount: number;
// }

// const UserBeneficiaries = () => {
//  const [view, setView] = useState<"list" | "register" | "profile">("list");
//  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
//  const [filterStatus, setFilterStatus] = useState<string>("all");
//  const [activeTab, setActiveTab] = useState<"beneficiaries" | "groups">(
//    "beneficiaries",
//  );
//  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
//    BeneficiaryGroup[]
//  >([
//    {
//      id: "GRP-001",
//      name: "Monthly Payroll",
//      description: "Regular monthly salary payments",
//      beneficiaryIds: ["BEN-001", "BEN-003"],
//      beneficiaries: [],
//      createdAt: "2024-01-01",
//      memberCount: 2,
//    },
//    {
//      id: "GRP-002",
//      name: "Vendor Payments Q1",
//      description: "Q1 vendor and supplier payments",
//      beneficiaryIds: ["BEN-001", "BEN-002"],
//      beneficiaries: [],
//      createdAt: "2024-01-10",
//      memberCount: 2,
//    },
//  ]);

//  const beneficiaries = [
//    {
//      id: "BEN-001",
//      name: "Global Suppliers Inc",
//      type: "corporate" as const,
//      email: "payments@globalsuppliers.com",
//      phone: "+971 4 123 4567",
//      address: {
//        line1: "Dubai International Financial Centre",
//        line2: "Level 15, Building 3",
//        city: "Dubai",
//        country: "United Arab Emirates",
//        postalCode: "00000",
//      },
//      bankDetails: [
//        {
//          bankName: "Emirates NBD",
//          accountNumber: "1234567890",
//          accountName: "Global Suppliers Inc",
//          swift: "EBILAEAD",
//          currency: "USD",
//        },
//      ],
//      relationship: "Supplier",
//      status: "active",
//      verificationStatus: "verified",
//      lastUsed: "2024-01-16",
//      totalSent: "125000",
//      transactionCount: 15,
//      payoutMethod: "Bank Transfer",
//      registrationDate: "2023-08-15",
//      documents: [
//        { type: "Trade License", status: "approved", uploadDate: "2023-08-15" },
//        {
//          type: "Bank Statement",
//          status: "approved",
//          uploadDate: "2023-08-15",
//        },
//      ],
//      riskLevel: "low",
//      monthlyLimit: "50000",
//      averageTransaction: "8333",
//    },
//    {
//      id: "BEN-002",
//      name: "Tech Solutions Ltd",
//      type: "corporate" as const,
//      email: "finance@techsolutions.ae",
//      phone: "+971 2 987 6543",
//      address: {
//        line1: "Abu Dhabi Global Market",
//        city: "Abu Dhabi",
//        country: "United Arab Emirates",
//      },
//      bankDetails: [
//        {
//          bankName: "ADCB Bank",
//          accountNumber: "9876543210",
//          accountName: "Tech Solutions Ltd",
//          currency: "AED",
//        },
//      ],
//      relationship: "Service Provider",
//      status: "pending_approval",
//      verificationStatus: "pending",
//      lastUsed: "Never",
//      totalSent: "0",
//      transactionCount: 0,
//      payoutMethod: "Bank Transfer",
//      registrationDate: "2024-01-15",
//      documents: [
//        { type: "Trade License", status: "pending", uploadDate: "2024-01-15" },
//        { type: "Bank Statement", status: "pending", uploadDate: "2024-01-15" },
//      ],
//      riskLevel: "medium",
//      monthlyLimit: "25000",
//      averageTransaction: "0",
//    },
//    {
//      id: "BEN-003",
//      name: "Office Supplies Co",
//      type: "corporate" as const,
//      email: "orders@officesupplies.ae",
//      phone: "+971 4 555 0123",
//      address: {
//        line1: "Jebel Ali Free Zone",
//        city: "Dubai",
//        country: "United Arab Emirates",
//      },
//      bankDetails: [
//        {
//          bankName: "HSBC UAE",
//          accountNumber: "5555666677",
//          accountName: "Office Supplies Co",
//          currency: "USD",
//        },
//      ],
//      relationship: "Supplier",
//      status: "active",
//      verificationStatus: "verified",
//      lastUsed: "2024-01-15",
//      totalSent: "45000",
//      transactionCount: 8,
//      payoutMethod: "Bank Transfer",
//      registrationDate: "2023-11-10",
//      documents: [
//        { type: "Trade License", status: "approved", uploadDate: "2023-11-10" },
//        {
//          type: "Bank Statement",
//          status: "approved",
//          uploadDate: "2023-11-10",
//        },
//      ],
//      riskLevel: "low",
//      monthlyLimit: "30000",
//      averageTransaction: "5625",
//    },
//    {
//      id: "BEN-004",
//      name: "John Smith",
//      type: "individual" as const,
//      email: "j.smith@email.com",
//      phone: "+44 20 1234 5678",
//      address: {
//        line1: "123 London Street",
//        city: "London",
//        country: "United Kingdom",
//      },
//      bankDetails: [
//        {
//          bankName: "Barclays Bank UK",
//          accountNumber: "12345678",
//          accountName: "John Smith",
//          swift: "BARCGB22",
//          currency: "GBP",
//        },
//      ],
//      relationship: "Consultant",
//      status: "verification_required",
//      verificationStatus: "expired",
//      lastUsed: "2024-01-10",
//      totalSent: "8500",
//      transactionCount: 2,
//      payoutMethod: "Bank Transfer",
//      registrationDate: "2023-06-20",
//      documents: [
//        { type: "Passport", status: "expired", uploadDate: "2023-06-20" },
//        {
//          type: "Bank Statement",
//          status: "approved",
//          uploadDate: "2023-12-15",
//        },
//      ],
//      riskLevel: "medium",
//      monthlyLimit: "15000",
//      averageTransaction: "4250",
//    },
//  ];

//  const filteredBeneficiaries = beneficiaries.filter((ben) => {
//    if (filterStatus === "all") return true;
//    return ben.status === filterStatus;
//  });

//  const getStatusBadge = (status: string) => {
//    const statusMap = {
//      active: {
//        variant: "default" as const,
//        label: "Active",
//        icon: CheckCircle,
//      },
//      pending_approval: {
//        variant: "secondary" as const,
//        label: "Pending Approval",
//        icon: Clock,
//      },
//      verification_required: {
//        variant: "destructive" as const,
//        label: "Verification Required",
//        icon: AlertCircle,
//      },
//      inactive: {
//        variant: "outline" as const,
//        label: "Inactive",
//        icon: AlertCircle,
//      },
//    };
//    return (
//      statusMap[status as keyof typeof statusMap] || statusMap.pending_approval
//    );
//  };

//  const getVerificationBadge = (status: string) => {
//    const statusMap = {
//      verified: { variant: "default" as const, label: "Verified" },
//      pending: { variant: "secondary" as const, label: "Pending" },
//      expired: { variant: "destructive" as const, label: "Expired" },
//      rejected: { variant: "destructive" as const, label: "Rejected" },
//    };
//    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
//  };

//  const getRiskColor = (risk: string) => {
//    const colors = {
//      low: "bg-green-100 text-green-800",
//      medium: "bg-yellow-100 text-yellow-800",
//      high: "bg-red-100 text-red-800",
//    };
//    return colors[risk as keyof typeof colors] || colors.medium;
//  };

//  if (view === "register") {
//    return (
//      <UserLayout>
//        <div className="space-y-6">
//          <div className="flex items-center justify-between">
//            <Button variant="ghost" onClick={() => setView("list")}>
//              ← Back to Beneficiaries
//            </Button>
//          </div>
//          <BeneficiaryRegistrationForm />
//        </div>
//      </UserLayout>
//    );
//  }

//  if (view === "profile" && selectedBeneficiary) {
//    return (
//      <UserLayout>
//        <div className="space-y-6">
//          <div className="flex items-center justify-between">
//            <Button variant="ghost" onClick={() => setView("list")}>
//              ← Back to Beneficiaries
//            </Button>
//          </div>
//          <BeneficiaryProfile beneficiary={selectedBeneficiary} />
//        </div>
//      </UserLayout>
//    );
//  }

//  const handleGroupCreated = (group: BeneficiaryGroup) => {
//    // Update group with full beneficiary data
//    const groupWithBeneficiaries = {
//      ...group,
//      beneficiaries: beneficiaries.filter((b) =>
//        group.beneficiaryIds.includes(b.id),
//      ),
//    };
//    setBeneficiaryGroups((prev) => [...prev, groupWithBeneficiaries]);
//  };

//  const handleDeleteGroup = (groupId: string) => {
//    setBeneficiaryGroups((prev) => prev.filter((g) => g.id !== groupId));
//  };

//  // Update existing groups with beneficiary data for export
//  const groupsWithBeneficiaryData = beneficiaryGroups.map((group) => ({
//    ...group,
//    beneficiaries: beneficiaries.filter((b) =>
//      group.beneficiaryIds.includes(b.id),
//    ),
//  }));

//  // Export groups for use in BulkTransactionForm
//  if (typeof window !== "undefined") {
//    (window as any).__beneficiaryGroups = groupsWithBeneficiaryData;
//  }

//  return (
//    <UserLayout>
//      <div className="space-y-8">
//        {/* Header */}
//        <div className="flex items-center justify-between">
//          <div>
//            <h1 className="text-3xl font-bold text-foreground">
//              Beneficiaries
//            </h1>
//            <p className="text-muted-foreground">
//              Manage your payment recipients, groups, and verification status
//            </p>
//          </div>
//          <div className="flex gap-2">
//            <BeneficiaryGroupForm
//              beneficiaries={beneficiaries}
//              onGroupCreated={handleGroupCreated}
//              trigger={
//                <Button variant="outline">
//                  <FolderPlus className="h-4 w-4 mr-2" />
//                  Create Group
//                </Button>
//              }
//            />
//            <Button variant="business" onClick={() => setView("register")}>
//              <Plus className="h-4 w-4 mr-2" />
//              Register Beneficiary
//            </Button>
//          </div>
//        </div>

//        {/* Payout Destinations & Exchange Rates Information */}
//        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//          <Card className="shadow-card">
//            <CardHeader>
//              <CardTitle className="flex items-center gap-2">
//                <Globe className="h-5 w-5 text-primary" />
//                Available Payout Destinations
//              </CardTitle>
//            </CardHeader>
//            <CardContent>
//              <div className="space-y-3">
//                {[
//                  {
//                    country: "India",
//                    code: "IN",
//                    exchangeRate: "22.45",
//                    fees: "5.00",
//                  },
//                  {
//                    country: "Philippines",
//                    code: "PH",
//                    exchangeRate: "3.67",
//                    fees: "3.50",
//                  },
//                  {
//                    country: "Pakistan",
//                    code: "PK",
//                    exchangeRate: "84.50",
//                    fees: "4.00",
//                  },
//                  {
//                    country: "Bangladesh",
//                    code: "BD",
//                    exchangeRate: "29.75",
//                    fees: "3.00",
//                  },
//                  {
//                    country: "UAE",
//                    code: "AE",
//                    exchangeRate: "1.00",
//                    fees: "2.00",
//                  },
//                ].map((destination) => (
//                  <div
//                    key={destination.code}
//                    className="flex items-center justify-between p-3 border rounded-lg"
//                  >
//                    <div className="flex items-center space-x-3">
//                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                        <span className="text-xs font-bold text-primary">
//                          {destination.code}
//                        </span>
//                      </div>
//                      <div>
//                        <p className="font-medium text-foreground">
//                          {destination.country}
//                        </p>
//                        <p className="text-xs text-muted-foreground">
//                          Rate: 1 AED = {destination.exchangeRate}
//                        </p>
//                      </div>
//                    </div>
//                    <div className="text-right">
//                      <Badge variant="default">Available</Badge>
//                      <p className="text-xs text-muted-foreground mt-1">
//                        Fee: AED {destination.fees}
//                      </p>
//                    </div>
//                  </div>
//                ))}
//              </div>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader>
//              <CardTitle className="flex items-center gap-2">
//                <CreditCard className="h-5 w-5 text-primary" />
//                Supported Payout Mechanisms
//              </CardTitle>
//            </CardHeader>
//            <CardContent>
//              <div className="space-y-4">
//                <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
//                  <Banknote className="h-6 w-6 text-primary" />
//                  <div>
//                    <p className="font-medium text-foreground">
//                      Bank Account Transfer
//                    </p>
//                    <p className="text-sm text-muted-foreground">
//                      Direct transfer to beneficiary bank account
//                    </p>
//                  </div>
//                </div>

//                <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
//                  <Wallet className="h-6 w-6 text-primary" />
//                  <div>
//                    <p className="font-medium text-foreground">
//                      Digital Wallet
//                    </p>
//                    <p className="text-sm text-muted-foreground">
//                      Mobile wallets and digital payment platforms
//                    </p>
//                  </div>
//                </div>

//                <div className="bg-muted/30 rounded-lg p-3">
//                  <h4 className="font-medium text-foreground mb-2">
//                    Wallet Providers
//                  </h4>
//                  <div className="space-y-1 text-sm text-muted-foreground">
//                    <p>• India: Paymi India</p>
//                    <p>• Philippines: GCash, PayMaya</p>
//                    <p>• Bangladesh: bKash, Nagad</p>
//                    <p>• UAE: Paymi UAE</p>
//                  </div>
//                </div>
//              </div>
//            </CardContent>
//          </Card>
//        </div>

//        {/* Statistics Cards */}
//        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Total Beneficiaries
//              </CardTitle>
//              <Users className="h-5 w-5 text-primary" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold">{beneficiaries.length}</div>
//              <p className="text-xs text-muted-foreground">+3 this month</p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Groups
//              </CardTitle>
//              <Layers className="h-5 w-5 text-primary" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold">
//                {beneficiaryGroups.length}
//              </div>
//              <p className="text-xs text-muted-foreground">For bulk payments</p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Active
//              </CardTitle>
//              <CheckCircle className="h-5 w-5 text-success" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold text-success">
//                {beneficiaries.filter((b) => b.status === "active").length}
//              </div>
//              <p className="text-xs text-muted-foreground">Verified & active</p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Pending
//              </CardTitle>
//              <Clock className="h-5 w-5 text-orange-600" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold text-orange-600">
//                {
//                  beneficiaries.filter((b) => b.status === "pending_approval")
//                    .length
//                }
//              </div>
//              <p className="text-xs text-muted-foreground">Awaiting approval</p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Need Action
//              </CardTitle>
//              <AlertCircle className="h-5 w-5 text-destructive" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold text-destructive">
//                {
//                  beneficiaries.filter(
//                    (b) =>
//                      b.verificationStatus === "expired" ||
//                      b.verificationStatus === "rejected",
//                  ).length
//                }
//              </div>
//              <p className="text-xs text-muted-foreground">
//                Require verification
//              </p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                High Risk
//              </CardTitle>
//              <AlertCircle className="h-5 w-5 text-warning" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold text-warning">
//                {beneficiaries.filter((b) => b.riskLevel === "high").length}
//              </div>
//              <p className="text-xs text-muted-foreground">
//                Enhanced monitoring
//              </p>
//            </CardContent>
//          </Card>
//        </div>

//        {/* Tabs for Beneficiaries and Groups */}
//        <Tabs
//          value={activeTab}
//          onValueChange={(v) => setActiveTab(v as "beneficiaries" | "groups")}
//        >
//          <TabsList className="grid w-full max-w-md grid-cols-2">
//            <TabsTrigger
//              value="beneficiaries"
//              className="flex items-center gap-2"
//            >
//              <Users className="h-4 w-4" />
//              Beneficiaries
//            </TabsTrigger>
//            <TabsTrigger value="groups" className="flex items-center gap-2">
//              <Layers className="h-4 w-4" />
//              Groups
//            </TabsTrigger>
//          </TabsList>

//          <TabsContent value="groups" className="mt-6">
//            {/* Groups Section */}
//            <Card className="shadow-card">
//              <CardHeader>
//                <div className="flex items-center justify-between">
//                  <CardTitle className="flex items-center gap-2">
//                    <Layers className="h-5 w-5" />
//                    Beneficiary Groups
//                  </CardTitle>
//                  <BeneficiaryGroupForm
//                    beneficiaries={beneficiaries}
//                    onGroupCreated={handleGroupCreated}
//                  />
//                </div>
//              </CardHeader>
//              <CardContent>
//                {groupsWithBeneficiaryData.length === 0 ? (
//                  <div className="text-center py-8 text-muted-foreground">
//                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                    <p>No groups created yet</p>
//                    <p className="text-sm">
//                      Create groups to organize beneficiaries for bulk
//                      transactions
//                    </p>
//                  </div>
//                ) : (
//                  <div className="space-y-4">
//                    {groupsWithBeneficiaryData.map((group) => (
//                      <Card
//                        key={group.id}
//                        className="border-l-4 border-l-primary"
//                      >
//                        <CardContent className="p-4">
//                          <div className="flex items-start justify-between">
//                            <div className="flex-1">
//                              <div className="flex items-center gap-3 mb-2">
//                                <h3 className="font-semibold text-lg">
//                                  {group.name}
//                                </h3>
//                                <Badge variant="secondary">
//                                  {group.memberCount} members
//                                </Badge>
//                              </div>
//                              {group.description && (
//                                <p className="text-sm text-muted-foreground mb-3">
//                                  {group.description}
//                                </p>
//                              )}
//                              <div className="flex flex-wrap gap-2">
//                                {group.beneficiaries.slice(0, 5).map((ben) => (
//                                  <Badge
//                                    key={ben.id}
//                                    variant="outline"
//                                    className="flex items-center gap-1"
//                                  >
//                                    {ben.type === "corporate" ? (
//                                      <Building className="h-3 w-3" />
//                                    ) : (
//                                      <User className="h-3 w-3" />
//                                    )}
//                                    {ben.name}
//                                  </Badge>
//                                ))}
//                                {group.beneficiaries.length > 5 && (
//                                  <Badge variant="outline">
//                                    +{group.beneficiaries.length - 5} more
//                                  </Badge>
//                                )}
//                              </div>
//                            </div>
//                            <div className="flex gap-2">
//                              <Button variant="outline" size="sm">
//                                <Edit className="h-4 w-4" />
//                              </Button>
//                              <Button
//                                variant="outline"
//                                size="sm"
//                                onClick={() => handleDeleteGroup(group.id)}
//                              >
//                                <Trash2 className="h-4 w-4" />
//                              </Button>
//                            </div>
//                          </div>
//                        </CardContent>
//                      </Card>
//                    ))}
//                  </div>
//                )}
//              </CardContent>
//            </Card>
//          </TabsContent>

//          <TabsContent value="beneficiaries" className="mt-6 space-y-6">
//            {/* Search and Filters */}
//            <Card className="shadow-card">
//              <CardContent className="p-6">
//                <div className="flex flex-col sm:flex-row gap-4">
//                  <div className="flex-1">
//                    <Label htmlFor="search">Search Beneficiaries</Label>
//                    <div className="relative">
//                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                      <Input
//                        id="search"
//                        placeholder="Search by name, account, bank, or country..."
//                        className="pl-9"
//                      />
//                    </div>
//                  </div>
//                  <div className="flex gap-2">
//                    <Button
//                      variant={filterStatus === "all" ? "default" : "outline"}
//                      onClick={() => setFilterStatus("all")}
//                    >
//                      All Status
//                    </Button>
//                    <Button
//                      variant={
//                        filterStatus === "active" ? "default" : "outline"
//                      }
//                      onClick={() => setFilterStatus("active")}
//                    >
//                      Active
//                    </Button>
//                    <Button
//                      variant={
//                        filterStatus === "pending_approval"
//                          ? "default"
//                          : "outline"
//                      }
//                      onClick={() => setFilterStatus("pending_approval")}
//                    >
//                      Pending
//                    </Button>
//                    <Button variant="outline">
//                      <Filter className="h-4 w-4 mr-2" />
//                      More Filters
//                    </Button>
//                  </div>
//                </div>
//              </CardContent>
//            </Card>

//            {/* Beneficiaries List */}
//            <Card className="shadow-card">
//              <CardHeader>
//                <CardTitle>Registered Beneficiaries</CardTitle>
//              </CardHeader>
//              <CardContent>
//                <div className="space-y-4">
//                  {filteredBeneficiaries.map((beneficiary) => {
//                    const status = getStatusBadge(beneficiary.status);
//                    const verification = getVerificationBadge(
//                      beneficiary.verificationStatus,
//                    );
//                    const StatusIcon = status.icon;

//                    return (
//                      <Card
//                        key={beneficiary.id}
//                        className="border-l-4 border-l-primary hover:shadow-md transition-smooth"
//                      >
//                        <CardContent className="p-6">
//                          <div className="flex items-start justify-between">
//                            <div className="space-y-4 flex-1">
//                              {/* Beneficiary Header */}
//                              <div className="flex items-center space-x-4">
//                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
//                                  {beneficiary.type === "corporate" ? (
//                                    <Building className="h-6 w-6 text-muted-foreground" />
//                                  ) : (
//                                    <Users className="h-6 w-6 text-muted-foreground" />
//                                  )}
//                                </div>
//                                <div className="flex-1">
//                                  <div className="flex items-center gap-3 mb-1">
//                                    <h3 className="font-semibold text-foreground">
//                                      {beneficiary.name}
//                                    </h3>
//                                    <Badge
//                                      variant="outline"
//                                      className="text-xs"
//                                    >
//                                      {beneficiary.type === "corporate"
//                                        ? "Corporate"
//                                        : "Individual"}
//                                    </Badge>
//                                    <span
//                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(beneficiary.riskLevel)}`}
//                                    >
//                                      {beneficiary.riskLevel?.toUpperCase()}{" "}
//                                      RISK
//                                    </span>
//                                  </div>
//                                  <p className="text-sm text-muted-foreground">
//                                    ID: {beneficiary.id}
//                                  </p>
//                                </div>
//                                <div className="flex items-center space-x-2">
//                                  <Badge
//                                    variant={status.variant}
//                                    className="flex items-center gap-1"
//                                  >
//                                    <StatusIcon className="h-3 w-3" />
//                                    {status.label}
//                                  </Badge>
//                                  <Badge
//                                    variant={verification.variant}
//                                    className="text-xs"
//                                  >
//                                    {verification.label}
//                                  </Badge>
//                                </div>
//                              </div>

//                              {/* Enhanced Beneficiary Details */}
//                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
//                                <div className="space-y-1">
//                                  <div className="flex items-center text-muted-foreground">
//                                    <Banknote className="h-3 w-3 mr-1" />
//                                    Primary Bank:
//                                  </div>
//                                  <p className="font-medium">
//                                    {beneficiary.bankDetails[0]?.bankName}
//                                  </p>
//                                  <p className="text-xs">
//                                    ****
//                                    {beneficiary.bankDetails[0]?.accountNumber.slice(
//                                      -4,
//                                    )}
//                                  </p>
//                                </div>
//                                <div className="space-y-1">
//                                  <div className="flex items-center text-muted-foreground">
//                                    <MapPin className="h-3 w-3 mr-1" />
//                                    Location:
//                                  </div>
//                                  <p className="font-medium">
//                                    {beneficiary.address.country}
//                                  </p>
//                                  <p className="text-xs">
//                                    {beneficiary.bankDetails[0]?.currency}{" "}
//                                    Account
//                                  </p>
//                                </div>
//                                <div className="space-y-1">
//                                  <span className="text-muted-foreground">
//                                    Transaction History:
//                                  </span>
//                                  <p className="font-medium">
//                                    {beneficiary.transactionCount} payments
//                                  </p>
//                                  <p className="text-xs">
//                                    Last: {beneficiary.lastUsed}
//                                  </p>
//                                </div>
//                                <div className="space-y-1">
//                                  <span className="text-muted-foreground">
//                                    Total Sent:
//                                  </span>
//                                  <p className="font-medium">
//                                    {beneficiary.bankDetails[0]?.currency}{" "}
//                                    {Number(
//                                      beneficiary.totalSent,
//                                    ).toLocaleString()}
//                                  </p>
//                                  <p className="text-xs">
//                                    Avg:{" "}
//                                    {beneficiary.averageTransaction
//                                      ? beneficiary.bankDetails[0]?.currency +
//                                        " " +
//                                        Number(
//                                          beneficiary.averageTransaction,
//                                        ).toLocaleString()
//                                      : "N/A"}
//                                  </p>
//                                </div>
//                              </div>

//                              {/* Risk & Compliance Info */}
//                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                                <div className="space-y-1">
//                                  <span className="text-muted-foreground">
//                                    Relationship:
//                                  </span>
//                                  <p className="font-medium">
//                                    {beneficiary.relationship}
//                                  </p>
//                                </div>
//                                <div className="space-y-1">
//                                  <span className="text-muted-foreground">
//                                    Monthly Limit:
//                                  </span>
//                                  <p className="font-medium">
//                                    {beneficiary.bankDetails[0]?.currency}{" "}
//                                    {Number(
//                                      beneficiary.monthlyLimit,
//                                    ).toLocaleString()}
//                                  </p>
//                                </div>
//                                <div className="space-y-1">
//                                  <span className="text-muted-foreground">
//                                    Payout Method:
//                                  </span>
//                                  <p className="font-medium">
//                                    {beneficiary.payoutMethod}
//                                  </p>
//                                </div>
//                              </div>

//                              {/* Documents Status */}
//                              <div className="border-t pt-3">
//                                <div className="flex items-center justify-between mb-2">
//                                  <span className="text-sm font-medium text-muted-foreground">
//                                    Documents Status:
//                                  </span>
//                                  <div className="flex space-x-2">
//                                    {beneficiary.documents.map((doc, index) => (
//                                      <Badge
//                                        key={index}
//                                        variant={
//                                          doc.status === "approved"
//                                            ? "default"
//                                            : doc.status === "pending"
//                                              ? "secondary"
//                                              : "destructive"
//                                        }
//                                        className="text-xs"
//                                      >
//                                        {doc.type}: {doc.status}
//                                      </Badge>
//                                    ))}
//                                  </div>
//                                </div>
//                              </div>
//                            </div>

//                            {/* Enhanced Actions */}
//                            <div className="flex flex-col space-y-2 ml-4">
//                              <Button
//                                variant="outline"
//                                size="sm"
//                                onClick={() => {
//                                  setSelectedBeneficiary(beneficiary);
//                                  setView("profile");
//                                }}
//                              >
//                                <Eye className="h-4 w-4 mr-1" />
//                                View Profile
//                              </Button>
//                              <Button variant="outline" size="sm">
//                                <Edit className="h-4 w-4 mr-1" />
//                                Edit Details
//                              </Button>
//                              {beneficiary.status === "active" && (
//                                <Button variant="business" size="sm">
//                                  Send Payment
//                                </Button>
//                              )}
//                              {(beneficiary.verificationStatus === "expired" ||
//                                beneficiary.verificationStatus ===
//                                  "rejected") && (
//                                <Button variant="destructive" size="sm">
//                                  Re-verify
//                                </Button>
//                              )}
//                              <Button variant="outline" size="sm">
//                                <Trash2 className="h-4 w-4" />
//                              </Button>
//                            </div>
//                          </div>
//                        </CardContent>
//                      </Card>
//                    );
//                  })}
//                </div>

//                {/* Pagination */}
//                <div className="flex items-center justify-between mt-6 pt-6 border-t">
//                  <p className="text-sm text-muted-foreground">
//                    Showing {filteredBeneficiaries.length} of{" "}
//                    {beneficiaries.length} beneficiaries
//                  </p>
//                  <div className="flex space-x-2">
//                    <Button variant="outline" size="sm" disabled>
//                      Previous
//                    </Button>
//                    <Button variant="outline" size="sm">
//                      Next
//                    </Button>
//                  </div>
//                </div>
//              </CardContent>
//            </Card>
//          </TabsContent>
//        </Tabs>
//      </div>
//    </UserLayout>
//  );
// };

// export default UserBeneficiaries;

// import UserLayout from "@/components/layout/UserLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import BeneficiaryRegistrationForm from "@/components/beneficiary/BeneficiaryRegistrationForm";
// import BeneficiaryProfile from "@/components/beneficiary/BeneficiaryProfile";
// import BeneficiaryGroupForm from "@/components/beneficiary/BeneficiaryGroupForm";
// import {
//   Users,
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Building,
//   MapPin,
//   Banknote,
//   Eye,
//   Filter,
//   Globe,
//   CreditCard,
//   Wallet,
//   FolderPlus,
//   Layers,
//   User,
//   RefreshCw,
//   Loader2,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import BASE_URL from "@/config/config";
// import { useCookies } from "react-cookie";

// // Type definitions matching real API
// interface Beneficiary {
//   id: number;
//   name: string;
//   type: "INDIVIDUAL" | "CORPORATE";
//   countryId: number;
//   countryName: string;
//   currency: string;
//   bankName: string;
//   maskedAccount: string;
//   relationshipType: string;
//   monthlyLimit: number;
//   payoutMethod: string;
//   active: boolean;
//   approvalStatus: string;
//   totalPayments: number | null;
//   lastPaymentDate: string | null;
//   totalSent: number | null;
//   avgAmount: number | null;
//   // Added for design match
//   email?: string;
//   phone?: string;
//   address: {
//     line1: string;
//     line2?: string;
//     city: string;
//     country: string;
//     postalCode?: string;
//   };
//   documents: Array<{ type: string; status: string; uploadDate: string }>;
//   riskLevel: string;
//   registrationDate: string;
//   bankDetails: Array<{
//     bankName: string;
//     accountNumber: string;
//     accountName: string;
//     swift?: string;
//     currency: string;
//   }>;
//   relationship: string;
//   status: string;
//   verificationStatus: string;
//   lastUsed: string;
//   totalSent: string;
//   transactionCount: number;
//   averageTransaction?: string;
// }

// interface BeneficiaryGroup {
//   id: number;
//   groupName: string;
//   description: string;
//   totalBeneficiaries: number;
//   beneficiaryNames: string[];
//   // For design match – mock beneficiaries based on names
//   beneficiaries: Beneficiary[];
//   memberCount: number;
//   createdAt: string;
//   name: string;
//   beneficiaryIds: string[];
// }

// const UserBeneficiaries = () => {
//   const [cookies] = useCookies(["token"]);
//   const token = cookies.token;

//   const [view, setView] = useState<"list" | "register" | "profile">("list");
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [activeTab, setActiveTab] = useState<"beneficiaries" | "groups">("beneficiaries");

//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
//   const [beneficiaryGroups, setBeneficiaryGroups] = useState<BeneficiaryGroup[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Helper function to map API status to component status
//   const mapStatus = (active: boolean, approvalStatus: string) => {
//     if (!active) return "inactive";
//     if (approvalStatus === "PENDING") return "pending_approval";
//     if (approvalStatus === "APPROVED") return "active";
//     return "inactive";
//   };

//   // Helper function to map verification status
//   const mapVerificationStatus = (approvalStatus: string) => {
//     const statusMap: Record<string, string> = {
//       PENDING: "pending",
//       APPROVED: "verified",
//       REJECTED: "rejected",
//       EXPIRED: "expired",
//     };
//     return statusMap[approvalStatus] || "pending";
//   };

//   // Fetch beneficiaries from API
//   const fetchBeneficiaries = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/api/v1/beneficiaries`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();
//       if (json.status !== true || !json.data?.beneficiaries) {
//         throw new Error("Unexpected response format");
//       }

//       const mappedData = json.data.beneficiaries.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//         type: item.type,
//         email: "", // API doesn't provide, keep empty
//         phone: "", // API doesn't provide, keep empty
//         address: {
//           line1: "",
//           city: "",
//           country: item.countryName || "",
//           postalCode: "",
//         },
//         bankDetails: [
//           {
//             bankName: item.bankName,
//             accountNumber: item.maskedAccount || "N/A",
//             accountName: item.name,
//             swift: "", // API doesn't provide
//             currency: item.currency,
//           },
//         ],
//         relationship: item.relationshipType,
//         status: mapStatus(item.active, item.approvalStatus),
//         verificationStatus: mapVerificationStatus(item.approvalStatus),
//         lastUsed: item.lastPaymentDate || "Never",
//         totalSent: item.totalSent ? String(item.totalSent) : "0",
//         transactionCount: item.totalPayments || 0,
//         payoutMethod: item.payoutMethod,
//         registrationDate: "", // API doesn't provide
//         documents: [], // API doesn't provide, keep empty or mock if needed
//         riskLevel: "medium", // Default as per your design
//         monthlyLimit: String(item.monthlyLimit || 0),
//         averageTransaction: item.avgAmount ? String(item.avgAmount) : "0",
//       }));
//       setBeneficiaries(mappedData);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch beneficiaries");
//       console.error("Error fetching beneficiaries:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch groups from API
//   const fetchGroups = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/beneficiary-groups`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();
//       if (json.status !== true || !json.data?.groups) {
//         throw new Error("Unexpected response format");
//       }

//       // Map to your design shape (mock beneficiaries from names since API doesn't give full info)
//       const mappedGroups = json.data.groups.map((group: any) => ({
//         id: group.id.toString(),
//         name: group.groupName,
//         description: group.description,
//         beneficiaryIds: [], // API doesn't provide IDs
//         beneficiaries: group.beneficiaryNames.map((name: string) => ({
//           id: Math.random().toString(), // Mock ID
//           name,
//           type: "individual", // Default, since API doesn't provide type
//           // Mock other fields for display
//           bankDetails: [{ bankName: "", accountNumber: "", currency: "" }],
//         })),
//         createdAt: "", // API doesn't provide
//         memberCount: group.totalBeneficiaries,
//       }));
//       setBeneficiaryGroups(mappedGroups);
//     } catch (err: any) {
//       console.error("Error fetching groups:", err);
//     }
//   };

//   useEffect(() => {
//     fetchBeneficiaries();
//     fetchGroups();
//   }, [token]);

//   // Filter beneficiaries based on status and search
//   const filteredBeneficiaries = beneficiaries.filter((ben) => {
//     const statusMatch = filterStatus === "all" || ben.status === filterStatus;
//     const searchMatch =
//       searchQuery === "" ||
//       ben.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ben.bankDetails[0]?.bankName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       ben.address.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ben.id.toLowerCase().includes(searchQuery.toLowerCase());
//     return statusMatch && searchMatch;
//   });

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       active: {
//         variant: "default" as const,
//         label: "Active",
//         icon: CheckCircle,
//       },
//       pending_approval: {
//         variant: "secondary" as const,
//         label: "Pending Approval",
//         icon: Clock,
//       },
//       verification_required: {
//         variant: "destructive" as const,
//         label: "Verification Required",
//         icon: AlertCircle,
//       },
//       inactive: {
//         variant: "outline" as const,
//         label: "Inactive",
//         icon: AlertCircle,
//       },
//     };
//     return (
//       statusMap[status as keyof typeof statusMap] || statusMap.pending_approval
//     );
//   };

//   const getVerificationBadge = (status: string) => {
//     const statusMap = {
//       verified: { variant: "default" as const, label: "Verified" },
//       pending: { variant: "secondary" as const, label: "Pending" },
//       expired: { variant: "destructive" as const, label: "Expired" },
//       rejected: { variant: "destructive" as const, label: "Rejected" },
//     };
//     return statusMap[status as keyof typeof statusMap] || statusMap.pending;
//   };

//   const getRiskColor = (risk: string) => {
//     const colors = {
//       low: "bg-green-100 text-green-800",
//       medium: "bg-yellow-100 text-yellow-800",
//       high: "bg-red-100 text-red-800",
//     };
//     return colors[risk as keyof typeof colors] || colors.medium;
//   };

//   // Handle delete beneficiary
//   const handleDeleteBeneficiary = async (id: string) => {
//     // Implement delete logic if needed
//   };

//   // Handle group created
//   const handleGroupCreated = (group: BeneficiaryGroup) => {
//     const groupWithBeneficiaries = {
//       ...group,
//       beneficiaries: beneficiaries.filter((b) =>
//         group.beneficiaryIds.includes(b.id),
//       ),
//     };
//     setBeneficiaryGroups((prev) => [...prev, groupWithBeneficiaries]);
//   };

//   const handleDeleteGroup = (groupId: string) => {
//     setBeneficiaryGroups((prev) => prev.filter((g) => g.id !== groupId));
//   };

//   // Update groups with beneficiary data
//   const groupsWithBeneficiaryData = beneficiaryGroups.map((group) => ({
//     ...group,
//     beneficiaries: beneficiaries.filter((b) =>
//       group.beneficiaryIds.includes(b.id),
//     ),
//   }));

//   // Export groups for use in BulkTransactionForm
//   if (typeof window !== "undefined") {
//     (window as any).__beneficiaryGroups = groupsWithBeneficiaryData;
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <UserLayout>
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">
//               Loading beneficiaries...
//             </p>
//           </div>
//         </div>
//       </UserLayout>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <UserLayout>
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
//             <p className="mt-4 text-destructive">{error}</p>
//             <Button className="mt-4" onClick={fetchBeneficiaries}>
//               Retry
//             </Button>
//           </div>
//         </div>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//       {view === "list" && (
//         <div className="space-y-8">
//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">
//                 Beneficiaries
//               </h1>
//               <p className="text-muted-foreground">
//                 Manage your payment recipients, groups, and verification status
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <BeneficiaryGroupForm
//                 beneficiaries={beneficiaries}
//                 onGroupCreated={handleGroupCreated}
//                 trigger={
//                   <Button variant="outline">
//                     <FolderPlus className="h-4 w-4 mr-2" />
//                     Create Group
//                   </Button>
//                 }
//               />
//               <Button variant="business" onClick={() => setView("register")}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Register Beneficiary
//               </Button>
//             </div>
//           </div>

//           {/* Payout Destinations & Exchange Rates Information */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Globe className="h-5 w-5 text-primary" />
//                   Available Payout Destinations
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {[
//                     {
//                       country: "India",
//                       code: "IN",
//                       exchangeRate: "22.45",
//                       fees: "5.00",
//                     },
//                     {
//                       country: "Philippines",
//                       code: "PH",
//                       exchangeRate: "3.67",
//                       fees: "3.50",
//                     },
//                     {
//                       country: "Pakistan",
//                       code: "PK",
//                       exchangeRate: "84.50",
//                       fees: "4.00",
//                     },
//                     {
//                       country: "Bangladesh",
//                       code: "BD",
//                       exchangeRate: "29.75",
//                       fees: "3.00",
//                     },
//                     {
//                       country: "UAE",
//                       code: "AE",
//                       exchangeRate: "1.00",
//                       fees: "2.00",
//                     },
//                   ].map((destination) => (
//                     <div
//                       key={destination.code}
//                       className="flex items-center justify-between p-3 border rounded-lg"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                           <span className="text-xs font-bold text-primary">
//                             {destination.code}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-foreground">
//                             {destination.country}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             Rate: 1 AED = {destination.exchangeRate}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <Badge variant="default">Available</Badge>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Fee: AED {destination.fees}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CreditCard className="h-5 w-5 text-primary" />
//                   Supported Payout Mechanisms
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
//                     <Banknote className="h-6 w-6 text-primary" />
//                     <div>
//                       <p className="font-medium text-foreground">
//                         Bank Account Transfer
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         Direct transfer to beneficiary bank account
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
//                     <Wallet className="h-6 w-6 text-primary" />
//                     <div>
//                       <p className="font-medium text-foreground">
//                         Digital Wallet
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         Mobile wallets and digital payment platforms
//                       </p>
//                     </div>
//                   </div>
//                   <div className="bg-muted/30 rounded-lg p-3">
//                     <h4 className="font-medium text-foreground mb-2">
//                       Wallet Providers
//                     </h4>
//                     <div className="space-y-1 text-sm text-muted-foreground">
//                       <p>• India: Paymi India</p>
//                       <p>• Philippines: GCash, PayMaya</p>
//                       <p>• Bangladesh: bKash, Nagad</p>
//                       <p>• UAE: Paymi UAE</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           {/* Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Beneficiaries
//                 </CardTitle>
//                 <Users className="h-5 w-5 text-primary" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{beneficiaries.length}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {beneficiaries.filter((b) => b.status === "active").length}{" "}
//                   active
//                 </p>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Groups
//                 </CardTitle>
//                 <Layers className="h-5 w-5 text-primary" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {beneficiaryGroups.length}
//                 </div>
//                 <p className="text-xs text-muted-foreground">For bulk payments</p>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Active
//                 </CardTitle>
//                 <CheckCircle className="h-5 w-5 text-success" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-success">
//                   {beneficiaries.filter((b) => b.status === "active").length}
//                 </div>
//                 <p className="text-xs text-muted-foreground">Verified & active</p>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Pending
//                 </CardTitle>
//                 <Clock className="h-5 w-5 text-orange-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-orange-600">
//                   {
//                     beneficiaries.filter((b) => b.status === "pending_approval")
//                       .length
//                   }
//                 </div>
//                 <p className="text-xs text-muted-foreground">Awaiting approval</p>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Need Action
//                 </CardTitle>
//                 <AlertCircle className="h-5 w-5 text-destructive" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-destructive">
//                   {
//                     beneficiaries.filter(
//                       (b) =>
//                         b.verificationStatus === "expired" ||
//                         b.verificationStatus === "rejected",
//                     ).length
//                   }
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Require verification
//                 </p>
//               </CardContent>
//             </Card>
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   High Risk
//                 </CardTitle>
//                 <AlertCircle className="h-5 w-5 text-warning" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-warning">
//                   {beneficiaries.filter((b) => b.riskLevel === "high").length}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Enhanced monitoring
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//           {/* Tabs for Beneficiaries and Groups */}
//           <Tabs
//             value={activeTab}
//             onValueChange={(v) => setActiveTab(v as "beneficiaries" | "groups")}
//           >
//             <TabsList className="grid w-full max-w-md grid-cols-2">
//               <TabsTrigger
//                 value="beneficiaries"
//                 className="flex items-center gap-2"
//               >
//                 <Users className="h-4 w-4" />
//                 Beneficiaries
//               </TabsTrigger>
//               <TabsTrigger value="groups" className="flex items-center gap-2">
//                 <Layers className="h-4 w-4" />
//                 Groups
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="groups" className="mt-6">
//               {/* Groups Section */}
//               <Card className="shadow-card">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <CardTitle className="flex items-center gap-2">
//                       <Layers className="h-5 w-5" />
//                       Beneficiary Groups
//                     </CardTitle>
//                     <BeneficiaryGroupForm
//                       beneficiaries={beneficiaries}
//                       onGroupCreated={handleGroupCreated}
//                     />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {groupsWithBeneficiaryData.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                       <p>No groups created yet</p>
//                       <p className="text-sm">
//                         Create groups to organize beneficiaries for bulk
//                         transactions
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {groupsWithBeneficiaryData.map((group) => (
//                         <Card
//                           key={group.id}
//                           className="border-l-4 border-l-primary"
//                         >
//                           <CardContent className="p-4">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-3 mb-2">
//                                   <h3 className="font-semibold text-lg">
//                                     {group.name}
//                                   </h3>
//                                   <Badge variant="secondary">
//                                     {group.memberCount} members
//                                   </Badge>
//                                 </div>
//                                 {group.description && (
//                                   <p className="text-sm text-muted-foreground mb-3">
//                                     {group.description}
//                                   </p>
//                                 )}
//                                 <div className="flex flex-wrap gap-2">
//                                   {group.beneficiaries.slice(0, 5).map((ben) => (
//                                     <Badge
//                                       key={ben.id}
//                                       variant="outline"
//                                       className="flex items-center gap-1"
//                                     >
//                                       {ben.type === "corporate" ? (
//                                         <Building className="h-3 w-3" />
//                                       ) : (
//                                         <User className="h-3 w-3" />
//                                       )}
//                                       {ben.name}
//                                     </Badge>
//                                   ))}
//                                   {group.beneficiaries.length > 5 && (
//                                     <Badge variant="outline">
//                                       +{group.beneficiaries.length - 5} more
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button variant="outline" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleDeleteGroup(group.id)}
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="beneficiaries" className="mt-6 space-y-6">
//               {/* Search and Filters */}
//               <Card className="shadow-card">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="flex-1">
//                       <Label htmlFor="search">Search Beneficiaries</Label>
//                       <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="search"
//                           placeholder="Search by name, account, bank, or country..."
//                           className="pl-9"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant={filterStatus === "all" ? "default" : "outline"}
//                         onClick={() => setFilterStatus("all")}
//                       >
//                         All Status
//                       </Button>
//                       <Button
//                         variant={
//                           filterStatus === "active" ? "default" : "outline"
//                         }
//                         onClick={() => setFilterStatus("active")}
//                       >
//                         Active
//                       </Button>
//                       <Button
//                         variant={
//                           filterStatus === "pending_approval"
//                             ? "default"
//                             : "outline"
//                         }
//                         onClick={() => setFilterStatus("pending_approval")}
//                       >
//                         Pending
//                       </Button>
//                       <Button variant="outline">
//                         <Filter className="h-4 w-4 mr-2" />
//                         More Filters
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               {/* Beneficiaries List */}
//               <Card className="shadow-card">
//                 <CardHeader>
//                   <CardTitle>Registered Beneficiaries</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {filteredBeneficiaries.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                       <p>No beneficiaries found</p>
//                       <p className="text-sm">
//                         {searchQuery
//                           ? "Try a different search"
//                           : "Register your first beneficiary"}
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {filteredBeneficiaries.map((beneficiary) => {
//                         const status = getStatusBadge(beneficiary.status);
//                         const verification = getVerificationBadge(
//                           beneficiary.verificationStatus,
//                         );
//                         const StatusIcon = status.icon;
//                         return (
//                           <Card
//                             key={beneficiary.id}
//                             className="border-l-4 border-l-primary hover:shadow-md transition-smooth"
//                           >
//                             <CardContent className="p-6">
//                               <div className="flex items-start justify-between">
//                                 <div className="space-y-4 flex-1">
//                                   {/* Beneficiary Header */}
//                                   <div className="flex items-center space-x-4">
//                                     <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
//                                       {beneficiary.type === "corporate" ? (
//                                         <Building className="h-6 w-6 text-muted-foreground" />
//                                       ) : (
//                                         <Users className="h-6 w-6 text-muted-foreground" />
//                                       )}
//                                     </div>
//                                     <div className="flex-1">
//                                       <div className="flex items-center gap-3 mb-1">
//                                         <h3 className="font-semibold text-foreground">
//                                           {beneficiary.name}
//                                         </h3>
//                                         <Badge
//                                           variant="outline"
//                                           className="text-xs"
//                                         >
//                                           {beneficiary.type === "corporate"
//                                             ? "Corporate"
//                                             : "Individual"}
//                                         </Badge>
//                                         <span
//                                           className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(beneficiary.riskLevel)}`}
//                                         >
//                                           {beneficiary.riskLevel?.toUpperCase()}{" "}
//                                           RISK
//                                         </span>
//                                       </div>
//                                       <p className="text-sm text-muted-foreground">
//                                         ID: {beneficiary.id}
//                                       </p>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <Badge
//                                         variant={status.variant}
//                                         className="flex items-center gap-1"
//                                       >
//                                         <StatusIcon className="h-3 w-3" />
//                                         {status.label}
//                                       </Badge>
//                                       <Badge
//                                         variant={verification.variant}
//                                         className="text-xs"
//                                       >
//                                         {verification.label}
//                                       </Badge>
//                                     </div>
//                                   </div>
//                                   {/* Enhanced Beneficiary Details */}
//                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
//                                     <div className="space-y-1">
//                                       <div className="flex items-center text-muted-foreground">
//                                         <Banknote className="h-3 w-3 mr-1" />
//                                         Primary Bank:
//                                       </div>
//                                       <p className="font-medium">
//                                         {beneficiary.bankDetails[0]?.bankName ||
//                                           "N/A"}
//                                       </p>
//                                       <p className="text-xs">
//                                         {
//                                           beneficiary.bankDetails[0]
//                                             ?.accountNumber
//                                         }
//                                       </p>
//                                     </div>
//                                     <div className="space-y-1">
//                                       <div className="flex items-center text-muted-foreground">
//                                         <MapPin className="h-3 w-3 mr-1" />
//                                         Location:
//                                       </div>
//                                       <p className="font-medium">
//                                         {beneficiary.address.country || "N/A"}
//                                       </p>
//                                       <p className="text-xs">
//                                         {beneficiary.bankDetails[0]?.currency}{" "}
//                                         Account
//                                       </p>
//                                     </div>
//                                     <div className="space-y-1">
//                                       <span className="text-muted-foreground">
//                                         Transaction History:
//                                       </span>
//                                       <p className="font-medium">
//                                         {beneficiary.transactionCount} payments
//                                       </p>
//                                       <p className="text-xs">
//                                         Last: {beneficiary.lastUsed}
//                                       </p>
//                                     </div>
//                                     <div className="space-y-1">
//                                       <span className="text-muted-foreground">
//                                         Total Sent:
//                                       </span>
//                                       <p className="font-medium">
//                                         {beneficiary.bankDetails[0]?.currency}{" "}
//                                         {Number(
//                                           beneficiary.totalSent,
//                                         ).toLocaleString()}
//                                       </p>
//                                       <p className="text-xs">
//                                         Avg:{" "}
//                                         {beneficiary.averageTransaction
//                                           ? beneficiary.bankDetails[0]?.currency +
//                                             " " +
//                                             Number(
//                                               beneficiary.averageTransaction,
//                                             ).toLocaleString()
//                                           : "N/A"}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   {/* Risk & Compliance Info */}
//                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                                     <div className="space-y-1">
//                                       <span className="text-muted-foreground">
//                                         Relationship:
//                                       </span>
//                                       <p className="font-medium">
//                                         {beneficiary.relationship}
//                                       </p>
//                                     </div>
//                                     <div className="space-y-1">
//                                       <span className="text-muted-foreground">
//                                         Monthly Limit:
//                                       </span>
//                                       <p className="font-medium">
//                                         {beneficiary.bankDetails[0]?.currency}{" "}
//                                         {Number(
//                                           beneficiary.monthlyLimit,
//                                         ).toLocaleString()}
//                                       </p>
//                                     </div>
//                                     <div className="space-y-1">
//                                       <span className="text-muted-foreground">
//                                         Payout Method:
//                                       </span>
//                                       <p className="font-medium">
//                                         {beneficiary.payoutMethod}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   {/* Documents Status */}
//                                   {beneficiary.documents.length > 0 && (
//                                     <div className="border-t pt-3">
//                                       <div className="flex items-center justify-between mb-2">
//                                         <span className="text-sm font-medium text-muted-foreground">
//                                           Documents Status:
//                                         </span>
//                                         <div className="flex space-x-2">
//                                           {beneficiary.documents.map(
//                                             (doc: any, index: number) => (
//                                               <Badge
//                                                 key={index}
//                                                 variant={
//                                                   doc.status === "approved"
//                                                     ? "default"
//                                                     : doc.status === "pending"
//                                                       ? "secondary"
//                                                       : "destructive"
//                                                 }
//                                                 className="text-xs"
//                                               >
//                                                 {doc.type}: {doc.status}
//                                               </Badge>
//                                             ),
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                                 {/* Enhanced Actions */}
//                                 <div className="flex flex-col space-y-2 ml-4">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => {
//                                       setSelectedBeneficiary(beneficiary);
//                                       setView("profile");
//                                     }}
//                                   >
//                                     <Eye className="h-4 w-4 mr-1" />
//                                     View Profile
//                                   </Button>
//                                   <Button variant="outline" size="sm">
//                                     <Edit className="h-4 w-4 mr-1" />
//                                     Edit Details
//                                   </Button>
//                                   {beneficiary.status === "active" && (
//                                     <Button variant="business" size="sm">
//                                       Send Payment
//                                     </Button>
//                                   )}
//                                   {(beneficiary.verificationStatus ===
//                                     "expired" ||
//                                     beneficiary.verificationStatus ===
//                                       "rejected") && (
//                                     <Button variant="destructive" size="sm">
//                                       Re-verify
//                                     </Button>
//                                   )}
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() =>
//                                       handleDeleteBeneficiary(beneficiary.id)
//                                     }
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         );
//                       })}
//                     </div>
//                   )}
//                   {/* Pagination */}
//                   <div className="flex items-center justify-between mt-6 pt-6 border-t">
//                     <p className="text-sm text-muted-foreground">
//                       Showing {filteredBeneficiaries.length} of{" "}
//                       {beneficiaries.length} beneficiaries
//                     </p>
//                     <div className="flex space-x-2">
//                       <Button variant="outline" size="sm" disabled>
//                         Previous
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       )}
//       {view === "register" && (
//         <div className="space-y-8">
//           <Button variant="outline" onClick={() => setView("list")}>
//             Back to List
//           </Button>
//           <BeneficiaryRegistrationForm />
//         </div>
//       )}
//       {view === "profile" && selectedBeneficiary && (
//         <div className="space-y-8">
//           <Button variant="outline" onClick={() => setView("list")}>
//             Back to List
//           </Button>
//           <BeneficiaryProfile beneficiary={selectedBeneficiary} />
//         </div>
//       )}
//     </UserLayout>
//   );
// };

// export default UserBeneficiaries;

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
  User,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Type definitions matching real API
interface Beneficiary {
  id: number;
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  countryId: number;
  countryName: string;
  currency: string;
  bankName: string;
  maskedAccount: string;
  relationshipType: string;
  monthlyLimit: number;
  payoutMethod: string;
  active: boolean;
  approvalStatus: string;
  totalPayments: number | null;
  lastPaymentDate: string | null;
  totalSent: number | null;
  avgAmount: number | null;
  // Added for design match
  email?: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  documents: Array<{ type: string; status: string; uploadDate: string }>;
  riskLevel: string;
  registrationDate: string;
  bankDetails: Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
    swift?: string;
    currency: string;
  }>;
  relationship: string;
  status: string;
  verificationStatus: string;
  lastUsed: string;
  transactionCount: number;
  averageTransaction?: string;
}

interface BeneficiaryGroup {
  id: number;
  groupName: string;
  description: string;
  totalBeneficiaries: number;
  beneficiaryNames: string[];
  // For design match – mock beneficiaries based on names
  beneficiaries: Beneficiary[];
  memberCount: number;
  createdAt: string;
  name: string;
  beneficiaryIds: string[];
}

interface DashboardData {
  totalBeneficiaries: number;
  newThisMonth: number;
  groups: number;
  active: number;
  pending: number;
  needAction: number;
  highRisk: number;
}

const UserBeneficiaries = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "register" | "profile">("list");
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"beneficiaries" | "groups">(
    "beneficiaries",
  );

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
    BeneficiaryGroup[]
  >([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [beneficiariesPage, setBeneficiariesPage] = useState(0);
  const [beneficiariesSize] = useState(10);
  const [beneficiariesTotalPages, setBeneficiariesTotalPages] = useState(1);
  const [beneficiariesTotalItems, setBeneficiariesTotalItems] = useState(0);

  const [groupsPage, setGroupsPage] = useState(0);
  const [groupsSize] = useState(10);
  const [groupsTotalPages, setGroupsTotalPages] = useState(1);
  const [groupsTotalItems, setGroupsTotalItems] = useState(0);
  const [payOutConfigData, setPayOutConfigData] = useState(null);
  const [page, setPage] = useState(0);
  // Helper function to map API status to component status
  const mapStatus = (active: boolean, approvalStatus: string) => {
    if (!active) return "inactive";
    if (approvalStatus === "PENDING") return "pending_approval";
    if (approvalStatus === "APPROVED") return "active";
    return "inactive";
  };
  // Helper function to map verification status
  const mapVerificationStatus = (approvalStatus: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      APPROVED: "verified",
      REJECTED: "rejected",
      EXPIRED: "expired",
    };
    return statusMap[approvalStatus] || "pending";
  };
  const { t, language } = useLanguage();
  // Fetch beneficiaries from API
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/api/v1/beneficiaries?page=${beneficiariesPage}&size=${beneficiariesSize}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      let approvalStatus = "";
      if (filterStatus === "active") approvalStatus = "APPROVED";
      if (filterStatus === "pending_approval") approvalStatus = "PENDING";
      if (approvalStatus) url += `&approvalStatus=${approvalStatus}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.status !== true || !json.data?.beneficiaries) {
        throw new Error("Unexpected response format");
      }

      setDashboardData(json.data.dashboard);

      const mappedData = json.data.beneficiaries.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        email: item?.email, // API doesn't provide, keep empty
        phone: item?.phoneNumber,
        address: {
          line1: "",
          city: "",
          country: item.countryName || "",
          postalCode: "",
        },
        bankDetails: [
          {
            bankName: item.bankName,
            accountNumber: item.maskedAccount || "N/A",
            accountName: item.name,
            swift: "", // API doesn't provide
            currency: item.currency,
          },
        ],
        relationship: item.relationshipType,
        status: mapStatus(item.active, item.approvalStatus),
        verificationStatus: mapVerificationStatus(item.approvalStatus),
        lastUsed: item.lastPaymentDate || "Never",
        totalSent: item.totalSent ? String(item.totalSent) : "0",
        transactionCount: item.totalPayments || 0,
        payoutMethod: item.payoutMethod,
        registrationDate: "", // API doesn't provide
        documents: [], // API doesn't provide, keep empty or mock if needed
        riskLevel: "medium", // Default as per your design
        monthlyLimit: item.monthlyLimit || 0,
        averageTransaction: item.avgAmount ? String(item.avgAmount) : "0",
      }));
      setBeneficiaries(mappedData);
      setBeneficiariesTotalPages(json.data.pagination.totalPages);
      setBeneficiariesTotalItems(json.data.pagination.totalItems);
    } catch (err: any) {
      setError(err.message || "Failed to fetch beneficiaries");
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPayOutConfig = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config?page=${page}&size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setPayOutConfigData(json);
    } catch (error) {
      const msg = error.message || "Failed to load payout config";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => {
    getPayOutConfig();
  }, [page]);
  // Fetch groups from API
  const fetchGroups = async () => {
    try {
      const url = `${BASE_URL}/api/v1/beneficiary-groups?page=${groupsPage}&size=${groupsSize}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.status !== true || !json.data?.groups) {
        throw new Error("Unexpected response format");
      }

      // Map to your design shape (mock beneficiaries from names since API doesn't give full info)
      const mappedGroups = json.data.groups.map((group: any) => ({
        id: group.id.toString(),
        name: group.groupName,
        description: group.description,
        beneficiaryIds: [], // API doesn't provide IDs
        beneficiaries: group.beneficiaryNames.map((name: string) => ({
          id: Math.random().toString(), // Mock ID
          name,
          type: "individual", // Default, since API doesn't provide type
          // Mock other fields for display
          bankDetails: [{ bankName: "", accountNumber: "", currency: "" }],
        })),
        createdAt: "", // API doesn't provide
        memberCount: group.totalBeneficiaries,
      }));
      setBeneficiaryGroups(mappedGroups);
      setGroupsTotalPages(json.data.pagination.totalPages);
      setGroupsTotalItems(json.data.pagination.totalItems);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, [token, beneficiariesPage, searchQuery, filterStatus]);

  useEffect(() => {
    fetchGroups();
  }, [token, groupsPage]);

  // Filter beneficiaries based on status and search - now server-side, so filteredBeneficiaries = beneficiaries
  const filteredBeneficiaries = beneficiaries;

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
        icon: AlertCircle,
      },
      inactive: {
        variant: "outline" as const,
        label: "Inactive",
        icon: AlertCircle,
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
  const getAvailabePayoutDestinationStatusBadge = (status: string) => {
    const statusMap = {
      ACTIVE: {
        variant: "default" as const,
        label: t("active") || "Active",
        icon: CheckCircle,
      },
      MAINTENANCE: {
        variant: "secondary" as const,
        label: t("maintenance") || "Maintenance",
        icon: Clock,
      },
      INACTIVE: {
        variant: "destructive" as const,
        label: t("inactive") || "Inactive",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap?.ACTIVE;
  };
  const getRiskColor = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  // Handle delete beneficiary
  const handleDeleteBeneficiary = async (id: string) => {
    // Implement delete logic if needed
  };

  // Handle group created
  const handleGroupCreated = (group: BeneficiaryGroup) => {
    const groupWithBeneficiaries = {
      ...group,
      beneficiaries: beneficiaries?.filter((b: any) =>
        group?.beneficiaryIds?.includes(b?.id),
      ),
    };
    setBeneficiaryGroups((prev) => [...prev, groupWithBeneficiaries]);
    fetchGroups(); // Refetch to update pagination if needed
  };

  const handleDeleteGroup = (groupId: string) => {
    setBeneficiaryGroups((prev) => prev.filter((g: any) => g.id !== groupId));
    fetchGroups(); // Refetch
  };

  // Update groups with beneficiary data
  const groupsWithBeneficiaryData = beneficiaryGroups?.map((group) => ({
    ...group,
    beneficiaries: beneficiaries?.filter((b: any) =>
      group.beneficiaryIds?.includes(b.id),
    ),
  }));

  // Export groups for use in BulkTransactionForm
  if (typeof window !== "undefined") {
    (window as any).__beneficiaryGroups = groupsWithBeneficiaryData;
  }

  const totalPayOutConfigDataList = payOutConfigData?.totalElements;
  // Loading state
  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading beneficiaries...
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <p className="mt-4 text-destructive">{error}</p>
            <Button className="mt-4" onClick={fetchBeneficiaries}>
              Retry
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {view === "list" && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Beneficiaries
              </h1>
              <p className="text-muted-foreground">
                Manage your payment recipients, groups, and verification status
              </p>
            </div>
            <div className="flex gap-2">
              <BeneficiaryGroupForm
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
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {payOutConfigData?.data?.countries?.length > 0 ? (
                    payOutConfigData?.data?.countries?.map(
                      (destination: any) => {
                        const status = getAvailabePayoutDestinationStatusBadge(
                          destination?.status,
                        );
                        const StatusIcon = status.icon;
                        return (
                          <div
                            key={destination.countryId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                  {destination?.currency}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {destination?.countryName}
                                </p>
                                {/* <p className="text-xs text-muted-foreground">
                            Rate: 1 AED = {destination.exchangeRate}
                          </p> */}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={status?.variant}
                                className="flex items-center gap-1 self-start sm:self-auto"
                              >
                                <StatusIcon className="h-3 w-3" />
                                {status?.label}
                              </Badge>
                              {/* <p className="text-xs text-muted-foreground mt-1">
                          Fee: AED {destination.fees}
                        </p> */}
                            </div>
                          </div>
                        );
                      },
                    )
                  ) : (
                    <p className="text-center font-medium text-gray-400 text-xl">
                      No Data Found
                    </p>
                  )}
                  {totalPayOutConfigDataList > 10 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {payOutConfigData?.data?.countries?.length} of{" "}
                        {totalPayOutConfigDataList} beneficiaries
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
                          disabled={
                            (page + 1) * 10 >= totalPayOutConfigDataList
                          }
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
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
                      <p className="font-medium text-foreground">
                        Bank Account Transfer
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Direct transfer to beneficiary bank account
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-accent-muted/20 rounded-lg">
                    <Wallet className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        Digital Wallet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mobile wallets and digital payment platforms
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="font-medium text-foreground mb-2">
                      Wallet Providers
                    </h4>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Beneficiaries
                </CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.totalBeneficiaries || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.active || 0} active
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Groups
                </CardTitle>
                <Layers className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.groups || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  For bulk payments
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {dashboardData?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Verified & active
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <Clock className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData?.pending || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Need Action
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {dashboardData?.needAction || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require verification
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  High Risk
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {dashboardData?.highRisk || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enhanced monitoring
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Tabs for Beneficiaries and Groups */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "beneficiaries" | "groups")}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="beneficiaries"
                className="flex items-center gap-2"
              >
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
                    <BeneficiaryGroupForm onGroupCreated={handleGroupCreated} />
                  </div>
                </CardHeader>
                <CardContent>
                  {groupsWithBeneficiaryData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No groups created yet</p>
                      <p className="text-sm">
                        Create groups to organize beneficiaries for bulk
                        transactions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupsWithBeneficiaryData.map((group: any) => (
                        <Card
                          key={group.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {group.name}
                                  </h3>
                                  <Badge variant="secondary">
                                    {group.memberCount} members
                                  </Badge>
                                </div>
                                {group.description && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {group.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {group.beneficiaries
                                    .slice(0, 5)
                                    .map((ben: any) => (
                                      <Badge
                                        key={ben.id}
                                        variant="outline"
                                        className="flex items-center gap-1"
                                      >
                                        {ben.type === "corporate" ? (
                                          <Building className="h-3 w-3" />
                                        ) : (
                                          <User className="h-3 w-3" />
                                        )}
                                        {ben.name}
                                      </Badge>
                                    ))}
                                  {group.beneficiaries.length > 5 && (
                                    <Badge variant="outline">
                                      +{group.beneficiaries.length - 5} more
                                    </Badge>
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
                  {/* Pagination for groups */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {beneficiaryGroups.length} of {groupsTotalItems}{" "}
                      groups
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={groupsPage === 0}
                        onClick={() => setGroupsPage(groupsPage - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={groupsPage >= groupsTotalPages - 1}
                        onClick={() => setGroupsPage(groupsPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
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
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setBeneficiariesPage(0);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterStatus === "all" ? "default" : "outline"}
                        onClick={() => {
                          setFilterStatus("all");
                          setBeneficiariesPage(0);
                        }}
                      >
                        All Status
                      </Button>
                      <Button
                        variant={
                          filterStatus === "active" ? "default" : "outline"
                        }
                        onClick={() => {
                          setFilterStatus("active");
                          setBeneficiariesPage(0);
                        }}
                      >
                        Active
                      </Button>
                      <Button
                        variant={
                          filterStatus === "pending_approval"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          setFilterStatus("pending_approval");
                          setBeneficiariesPage(0);
                        }}
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
                  {filteredBeneficiaries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No beneficiaries found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try a different search"
                          : "Register your first beneficiary"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBeneficiaries.map((beneficiary: any) => {
                        const status = getStatusBadge(beneficiary.status);
                        const verification = getVerificationBadge(
                          beneficiary.verificationStatus,
                        );
                        const StatusIcon = status.icon;
                        return (
                          <Card
                            key={beneficiary.id}
                            className="border-l-4 border-l-primary hover:shadow-md transition-smooth"
                          >
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
                                        <h3 className="font-semibold text-foreground">
                                          {beneficiary.name}
                                        </h3>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {beneficiary.type === "corporate"
                                            ? "Corporate"
                                            : "Individual"}
                                        </Badge>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(beneficiary.riskLevel)}`}
                                        >
                                          {beneficiary.riskLevel?.toUpperCase()}{" "}
                                          RISK
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        ID: {beneficiary.id}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant={status.variant}
                                        className="flex items-center gap-1"
                                      >
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                      </Badge>
                                      <Badge
                                        variant={verification.variant}
                                        className="text-xs"
                                      >
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
                                      <p className="font-medium">
                                        {beneficiary.bankDetails[0]?.bankName ||
                                          "N/A"}
                                      </p>
                                      <p className="text-xs">
                                        {
                                          beneficiary.bankDetails[0]
                                            ?.accountNumber
                                        }
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center text-muted-foreground">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Location:
                                      </div>
                                      <p className="font-medium">
                                        {beneficiary.address.country || "N/A"}
                                      </p>
                                      <p className="text-xs">
                                        {beneficiary.bankDetails[0]?.currency}{" "}
                                        Account
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">
                                        Transaction History:
                                      </span>
                                      <p className="font-medium">
                                        {beneficiary.transactionCount} payments
                                      </p>
                                      <p className="text-xs">
                                        Last: {beneficiary.lastUsed}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">
                                        Total Sent:
                                      </span>
                                      <p className="font-medium">
                                        {beneficiary.bankDetails[0]?.currency}{" "}
                                        {Number(
                                          beneficiary.totalSent,
                                        ).toLocaleString()}
                                      </p>
                                      <p className="text-xs">
                                        Avg:{" "}
                                        {beneficiary.averageTransaction
                                          ? beneficiary.bankDetails[0]
                                              ?.currency +
                                            " " +
                                            Number(
                                              beneficiary.averageTransaction,
                                            ).toLocaleString()
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Risk & Compliance Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">
                                        Relationship:
                                      </span>
                                      <p className="font-medium">
                                        {beneficiary.relationship}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">
                                        Monthly Limit:
                                      </span>
                                      <p className="font-medium">
                                        {beneficiary.bankDetails[0]?.currency}{" "}
                                        {Number(
                                          beneficiary.monthlyLimit,
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">
                                        Payout Method:
                                      </span>
                                      <p className="font-medium">
                                        {beneficiary.payoutMethod}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Documents Status */}
                                  {beneficiary.documents.length > 0 && (
                                    <div className="border-t pt-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                          Documents Status:
                                        </span>
                                        <div className="flex space-x-2">
                                          {beneficiary.documents.map(
                                            (doc: any, index: number) => (
                                              <Badge
                                                key={index}
                                                variant={
                                                  doc.status === "approved"
                                                    ? "default"
                                                    : doc.status === "pending"
                                                      ? "secondary"
                                                      : "destructive"
                                                }
                                                className="text-xs"
                                              >
                                                {doc.type}: {doc.status}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
                                  {(beneficiary.verificationStatus ===
                                    "expired" ||
                                    beneficiary.verificationStatus ===
                                      "rejected") && (
                                    <Button variant="destructive" size="sm">
                                      Re-verify
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteBeneficiary(beneficiary.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredBeneficiaries.length} of{" "}
                      {beneficiariesTotalItems} beneficiaries
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={beneficiariesPage === 0}
                        onClick={() =>
                          setBeneficiariesPage(beneficiariesPage - 1)
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          beneficiariesPage >= beneficiariesTotalPages - 1
                        }
                        onClick={() =>
                          setBeneficiariesPage(beneficiariesPage + 1)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {view === "register" && (
        <div className="space-y-8">
          <Button variant="outline" onClick={() => setView("list")}>
            Back to List
          </Button>
          <BeneficiaryRegistrationForm
            onSuccess={fetchBeneficiaries}
            setView={setView}
          />
        </div>
      )}
      {view === "profile" && selectedBeneficiary && (
        <div className="space-y-8">
          <Button variant="outline" onClick={() => setView("list")}>
            Back to List
          </Button>
          <BeneficiaryProfile beneficiary={selectedBeneficiary} />
        </div>
      )}
    </UserLayout>
  );
};

export default UserBeneficiaries;
