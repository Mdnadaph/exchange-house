import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import axios from "axios";
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
  Calendar,
} from "lucide-react";

const ExchangeBranchManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();
  const navigate = useNavigate();
  const uuid = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [branches, setBranches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    emirate: "",
    location: "",
    address: "",
    phone: "",
    email: "",
  });

  const emirates = [
    "DUBAI",
    "ABU_DHABI",
    "SHARJAH",
    "AJMAN",
    "RAS_AL_KHAIMAH",
    "FUJAIRAH",
    "UMM_AL_QUWAIN",
  ];

  /* =========================
     FETCH BRANCHES
  ========================= */
  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiData = res.data.data || [];

      const formatted = apiData.map((b: any) => ({
        id: b.branchId,
        uuid: b.uuid,
        name: b.name,
        location: b.location,
        address: b.address,
        emirate: b.emirate,
        email: b.email,
        phone: b.contactNumber,

        status: b.active ? "active" : "inactive",

        // simple default values (UI will not break)
        manager: "Not Assigned",
        managerId: "N/A",
        staffCount: 0,
        activeKYB: 0,
        completedKYB: 0,
        totalTransactions: 0,
        monthlyVolume: "0",
        operatingHours: "N/A",
        openingDate: b.createdDate,
        efficiency: 0,
      }));

      setBranches(formatted);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch branches",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  /* =========================
     OPEN ADD MODAL
  ========================= */
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingBranchId(null);
    setForm({
      name: "",
      emirate: "",
      location: "",
      address: "",
      phone: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */
  const openEditModal = (branch: any) => {
    setIsEditMode(true);
    setEditingBranchId(branch.uuid);
    setForm({
      name: branch.name || "",
      emirate: branch.emirate || "",
      location: branch.location || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
    });
    setIsModalOpen(true);
  };

  /* =========================
     CREATE BRANCH
  ========================= */
  const createBranch = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v3/branch/create`,
        {
          name: form.name,
          emirate: form.emirate,
          location: form.location,
          address: form.address,
          contactNumber: form.phone,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Branch created successfully",
      });

      setIsModalOpen(false);
      fetchBranches();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  /* =========================
     UPDATE BRANCH
  ========================= */
  const updateBranch = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v3/branch/update/${editingBranchId}`,
        {
          name: form.name,
          emirate: form.emirate,
          location: form.location,
          address: form.address,
          contactNumber: form.phone,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Branch updated successfully",
      });

      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingBranchId(null);
      fetchBranches();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update branch",
        variant: "destructive",
      });
    }
  };
  /* =========================
     HANDLE SUBMIT (ADD/EDIT)
  ========================= */
  const handleSubmit = async () => {
    if (!form.name || !form.emirate || !form.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode) {
      await updateBranch();
    } else {
      await createBranch();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
        color: "text-success",
      },
      inactive: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: XCircle,
        color: "text-muted-foreground",
      },
      pending: {
        variant: "outline" as const,
        label: "Pending Setup",
        icon: Clock,
        color: "text-warning",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 80) return "text-warning";
    if (efficiency === 0) return "text-muted-foreground";
    return "text-destructive";
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || branch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    totalBranches: branches.length,
    activeBranches: branches.filter((b) => b.status === "active").length,
    totalStaff: branches.reduce((sum, b) => sum + b.staffCount, 0),
    totalKYB: branches.reduce((sum, b) => sum + b.completedKYB, 0),
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Branch Management
            </h1>
            <p className="text-muted-foreground">
              Manage exchange house branches across UAE
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="business" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Branch
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {isEditMode ? "Edit Branch" : "Add New Branch"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="branchName">Branch Name *</Label>
                  <Input
                    id="branchName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Dubai Marina Branch"
                  />
                </div>

                <div>
                  <Label htmlFor="emirate">Emirate *</Label>
                  <Select
                    value={form.emirate}
                    onValueChange={(v) => setForm({ ...form, emirate: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent>
                      {emirates.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g., Dubai Marina Mall"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Complete branch address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+971 4 XXX XXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="branch@bizpayaxis.ae"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {isEditMode ? "Update Branch" : "Create Branch"}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Branches
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.totalBranches}
              </div>
              <p className="text-xs text-muted-foreground">Across UAE</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Branches
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {totalStats.activeBranches}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (totalStats.activeBranches / totalStats.totalBranches) *
                    100 || 0
                )}
                % operational
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                Across all branches
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total KYB Completed
              </CardTitle>
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
              <Card
                key={branch.id}
                className="shadow-card hover:shadow-lg transition-smooth"
              >
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
                            <h3 className="text-xl font-semibold text-foreground">
                              {branch.name}
                            </h3>
                            <Badge
                              variant={status.variant}
                              className="flex items-center gap-1"
                            >
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
                          <p className="font-medium">
                            {branch.staffCount} members
                          </p>
                          <p className="text-xs">
                            {branch.activeKYB} active KYB
                          </p>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="font-semibold text-primary text-lg">
                            {branch.completedKYB}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            KYB Completed
                          </p>
                        </div>
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <p className="font-semibold text-success text-lg">
                            {branch.totalTransactions.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Transactions
                          </p>
                        </div>
                        <div className="text-center p-3 bg-accent/10 rounded-lg">
                          <p className="font-semibold text-accent text-lg">
                            AED {branch.monthlyVolume}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Monthly Volume
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p
                            className={`font-semibold text-lg ${getEfficiencyColor(
                              branch.efficiency
                            )}`}
                          >
                            {branch.efficiency > 0
                              ? `${branch.efficiency}%`
                              : "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Efficiency
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="text-sm text-muted-foreground border-t pt-3">
                        <span className="font-medium text-foreground">
                          Address:{" "}
                        </span>
                        {branch.address}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/exchange/Details/${branch.uuid}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(branch)}
                      >
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
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBranchManagement;
