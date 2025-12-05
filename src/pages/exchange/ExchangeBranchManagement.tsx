import { useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  MapPin, 
  Phone, 
  Mail, 
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  Trash2,
  Globe,
  Calendar
} from "lucide-react";

const ExchangeBranchManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    emirate: ""
  });

  const branches = [
    {
      id: "BR-001",
      name: "Dubai Mall Branch",
      location: "Dubai Mall, Downtown Dubai",
      address: "Ground Floor, Dubai Mall, Financial Centre Road, Downtown Dubai",
      emirate: "Dubai",
      phone: "+971 4 123 4567",
      email: "dubaimall@bizpayaxis.ae",
      manager: "Ahmed Hassan",
      managerId: "ST-001",
      status: "active",
      staffCount: 5,
      activeKYB: 12,
      completedKYB: 156,
      totalTransactions: 1250,
      monthlyVolume: "2,450,000",
      openingDate: "2022-03-15",
      operatingHours: "10:00 AM - 10:00 PM",
      efficiency: 94
    },
    {
      id: "BR-002",
      name: "Abu Dhabi ADGM Branch",
      location: "ADGM Square, Abu Dhabi",
      address: "Tower 1, Level 2, ADGM Square, Al Maryah Island, Abu Dhabi",
      emirate: "Abu Dhabi",
      phone: "+971 2 234 5678",
      email: "adgm@bizpayaxis.ae",
      manager: "Fatima Al-Zahra",
      managerId: "ST-003",
      status: "active",
      staffCount: 4,
      activeKYB: 8,
      completedKYB: 198,
      totalTransactions: 1580,
      monthlyVolume: "3,120,000",
      openingDate: "2021-11-20",
      operatingHours: "9:00 AM - 6:00 PM",
      efficiency: 97
    },
    {
      id: "BR-003",
      name: "Sharjah City Centre Branch",
      location: "City Centre Sharjah",
      address: "Level 1, City Centre Sharjah, Al Wahda Street, Sharjah",
      emirate: "Sharjah",
      phone: "+971 6 345 6789",
      email: "sharjah@bizpayaxis.ae",
      manager: "Raj Patel",
      managerId: "ST-005",
      status: "active",
      staffCount: 3,
      activeKYB: 5,
      completedKYB: 89,
      totalTransactions: 620,
      monthlyVolume: "890,000",
      openingDate: "2023-02-10",
      operatingHours: "10:00 AM - 10:00 PM",
      efficiency: 91
    },
    {
      id: "BR-004",
      name: "Ajman Corniche Branch",
      location: "Ajman Corniche",
      address: "Corniche Road, Near Ajman Museum, Ajman",
      emirate: "Ajman",
      phone: "+971 6 456 7890",
      email: "ajman@bizpayaxis.ae",
      manager: "Mohammed Ali",
      managerId: "ST-008",
      status: "inactive",
      staffCount: 2,
      activeKYB: 0,
      completedKYB: 45,
      totalTransactions: 180,
      monthlyVolume: "0",
      openingDate: "2023-06-01",
      operatingHours: "9:00 AM - 9:00 PM",
      efficiency: 0
    },
    {
      id: "BR-005",
      name: "Dubai Marina Branch",
      location: "Dubai Marina Mall",
      address: "Ground Floor, Dubai Marina Mall, Sheikh Zayed Road, Dubai",
      emirate: "Dubai",
      phone: "+971 4 567 8901",
      email: "marinamall@bizpayaxis.ae",
      manager: "Sarah Thompson",
      managerId: "ST-010",
      status: "pending",
      staffCount: 0,
      activeKYB: 0,
      completedKYB: 0,
      totalTransactions: 0,
      monthlyVolume: "0",
      openingDate: "2024-02-01",
      operatingHours: "10:00 AM - 10:00 PM",
      efficiency: 0
    }
  ];

  const emirates = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle, color: "text-success" },
      inactive: { variant: "secondary" as const, label: "Inactive", icon: XCircle, color: "text-muted-foreground" },
      pending: { variant: "outline" as const, label: "Pending Setup", icon: Clock, color: "text-warning" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 80) return "text-warning";
    if (efficiency === 0) return "text-muted-foreground";
    return "text-destructive";
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || branch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.location || !newBranch.emirate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Branch Created",
      description: `"${newBranch.name}" has been created successfully and is pending setup.`
    });

    setNewBranch({
      name: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      emirate: ""
    });
    setIsAddBranchOpen(false);
  };

  const totalStats = {
    totalBranches: branches.length,
    activeBranches: branches.filter(b => b.status === "active").length,
    totalStaff: branches.reduce((sum, b) => sum + b.staffCount, 0),
    totalKYB: branches.reduce((sum, b) => sum + b.completedKYB, 0)
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branch Management</h1>
            <p className="text-muted-foreground">Manage exchange house branches across UAE</p>
          </div>
          <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
            <DialogTrigger asChild>
              <Button variant="business">
                <Plus className="h-4 w-4 mr-2" />
                Add New Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Add New Branch
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="branchName">Branch Name *</Label>
                  <Input
                    id="branchName"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    placeholder="e.g., Dubai Marina Branch"
                  />
                </div>
                <div>
                  <Label htmlFor="emirate">Emirate *</Label>
                  <Select value={newBranch.emirate} onValueChange={(v) => setNewBranch({ ...newBranch, emirate: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {emirates.map((emirate) => (
                        <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newBranch.location}
                    onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                    placeholder="e.g., Dubai Marina Mall"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    placeholder="Complete branch address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                      placeholder="+971 4 XXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newBranch.email}
                      onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                      placeholder="branch@bizpayaxis.ae"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBranch}>
                    Create Branch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalBranches}</div>
              <p className="text-xs text-muted-foreground">Across UAE</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Branches</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalStats.activeBranches}</div>
              <p className="text-xs text-muted-foreground">{Math.round((totalStats.activeBranches / totalStats.totalBranches) * 100)}% operational</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">Across all branches</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total KYB Completed</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalKYB}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Branches</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by name, location, or manager..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All Branches
                </Button>
                <Button 
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button 
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </Button>
                <Button 
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branches List */}
        <div className="space-y-6">
          {filteredBranches.map((branch) => {
            const status = getStatusBadge(branch.status);
            const StatusIcon = status.icon;

            return (
              <Card key={branch.id} className="shadow-card hover:shadow-lg transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Branch Header */}
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-semibold text-foreground">{branch.name}</h3>
                            <Badge variant={status.variant} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {branch.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {branch.emirate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Branch Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            Branch Manager:
                          </div>
                          <p className="font-medium">{branch.manager}</p>
                          <p className="text-xs">ID: {branch.managerId}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact:
                          </div>
                          <p className="font-medium">{branch.phone}</p>
                          <p className="text-xs">{branch.email}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Operating Hours:
                          </div>
                          <p className="font-medium">{branch.operatingHours}</p>
                          <p className="text-xs">Open: {branch.openingDate}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Staff:</span>
                          <p className="font-medium">{branch.staffCount} members</p>
                          <p className="text-xs">{branch.activeKYB} active KYB</p>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="font-semibold text-primary text-lg">{branch.completedKYB}</p>
                          <p className="text-xs text-muted-foreground">KYB Completed</p>
                        </div>
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <p className="font-semibold text-success text-lg">{branch.totalTransactions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Transactions</p>
                        </div>
                        <div className="text-center p-3 bg-accent/10 rounded-lg">
                          <p className="font-semibold text-accent text-lg">AED {branch.monthlyVolume}</p>
                          <p className="text-xs text-muted-foreground">Monthly Volume</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className={`font-semibold text-lg ${getEfficiencyColor(branch.efficiency)}`}>
                            {branch.efficiency > 0 ? `${branch.efficiency}%` : "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">Efficiency</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="text-sm text-muted-foreground border-t pt-3">
                        <span className="font-medium text-foreground">Address: </span>
                        {branch.address}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Branch
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Manage Staff
                      </Button>
                      {branch.status === "active" ? (
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Deactivate
                        </Button>
                      ) : branch.status === "inactive" ? (
                        <Button variant="business" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      ) : (
                        <Button variant="business" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete Setup
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBranches.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No branches found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBranchManagement;
