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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
  Loader2,
} from "lucide-react";
import { PermissionGate } from "@/contexts/PermissionGate";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ExchangeBranchManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();
  const navigate = useNavigate();
  const uuid = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<boolean>(true);
  const [debounceValue, setDebounceValue] = useState("");

  const [branches, setBranches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [totalElement, setTotalElements] = useState<number>(0);
  const [dashboardStats, setDashboardStats] = useState<Record<string, number>>({
    totalBranches: 0,
    activeBranches: 0,
    totalStaffs: 0,
  });
  const [isFetchingbranchList, setIsFetchingBranchList] =
    useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0,
  });

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
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!form.name.trim()) newErrors.name = "Branch name is required";
    else if (form.name.trim().length < 2)
      newErrors.name = "Branch name must be at least 2 characters";

    // Emirate
    if (!form.emirate) newErrors.emirate = "City is required";

    // Location
    if (!form.location.trim()) newErrors.location = "Location is required";

    // Address
    if (!form.address.trim()) newErrors.address = "Address is required";

    // Email
    if (!form.email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        newErrors.email = "Enter a valid email address";
    }

    // Phone
    const phoneDigits = form.phone ? form.phone.replace(/\D/g, "") : "";
    if (!phoneDigits) {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 5) {
      newErrors.phone = "Phone number must be at least 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceValue(searchQuery);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);

  const fetchBranches = async () => {
    setIsFetchingBranchList(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/branch/all-branches?page=${pagination?.pageNumber}&pageSize=10&active=${filterStatus}&search=${debounceValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res?.data?.status) {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
      const apiData = res?.data?.data || [];
      setPagination({
        pageNumber: res?.data?.currentPage || 0,
        pageSize: res?.data?.pageSize || 10,
        totalPages: res?.data?.totalPages || 1,
        totalElements: res?.data?.totalElements || 0,
      });

      setDashboardStats({
        totalBranches: res?.data?.dashboardStats?.totalBranches || 0,
        activeBranches: res?.data?.dashboardStats?.activeBranches || 0,
        totalStaffs: res?.data?.dashboardStats?.totalStaffs || 0,
      });

      const formatted = apiData.map((b: any) => ({
        id: b.branchId,
        uuid: b.uuid,
        name: b.name,
        location: b.location,
        address: b.address,
        emirate: b.city,
        email: b.email,
        phone: b.contactNumber,

        status: b.active ? "active" : "inactive",

        // simple default values (UI will not break)
        manager: b.managerName,
        managerId: "N/A",
        staffCount: b.staffCount,
        activeKYB: 0,
        completedKYB: 0,
        totalTransactions: 0,
        monthlyVolume: "0",
        operatingHours: "N/A",
        openingDate: b.createdDate,
        efficiency: 0,
        managerRole: b?.managerRoleName,
      }));

      setBranches(formatted);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch branches",
        variant: "destructive",
      });
    } finally {
      setIsFetchingBranchList(false);
    }
  };
  console.log("totalElement", totalElement);
  useEffect(() => {
    fetchBranches();
  }, [filterStatus, pagination?.pageNumber, debounceValue]);

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
    setErrors({});
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
    setErrors({});
    setIsModalOpen(true);
  };

  /* =========================
     CREATE BRANCH
  ========================= */
  const createBranch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v3/branch/create`,
        {
          name: form.name,
          city: form.emirate,
          location: form.location,
          address: form.address,
          contactNumber: form.phone,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        toast({
          title: "Success",
          description: res?.data?.message || "Branch created successfully",
        });

        setIsModalOpen(false);
        fetchBranches();
      } else {
        toast({
          title: "Error",
          description: res?.data?.message || "Some thing went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create branch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE BRANCH
  ========================= */
  const updateBranch = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/branch/update/${editingBranchId}`,
        {
          name: form.name,
          city: form.emirate,
          location: form.location,
          address: form.address,
          contactNumber: form.phone,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        toast({
          title: "Success",
          description: res?.data?.message || "Branch updated successfully",
        });
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingBranchId(null);
        fetchBranches();
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message || "Something went wrong while update",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update branch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  /* =========================
     HANDLE SUBMIT (ADD/EDIT)
  ========================= */
  //const handleSubmit = async () => {
  //  if (!form.name || !form.emirate || !form.location) {
  //    toast({
  //      title: "Error",
  //      description: "Please fill in all required fields",
  //      variant: "destructive",
  //    });
  //    return;
  //  }

  //  if (isEditMode) {
  //    await updateBranch();
  //  } else {
  //    await createBranch();
  //  }
  //};

  const handleSubmit = async () => {
    if (!validateAll()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
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

  // const filteredBranches = branches.filter((branch) => {
  //   const matchesSearch =
  //     (branch.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
  //     (branch.location?.toLowerCase() || "").includes(
  //       searchQuery.toLowerCase(),
  //     ) ||
  //     (branch.manager?.toLowerCase() || "").includes(searchQuery.toLowerCase());
  //   const matchesStatus =
  //     filterStatus === "all" || branch.status === filterStatus;
  //   return matchesSearch && matchesStatus;
  // });

  // const totalStats = {
  //   totalBranches: branches.length,
  //   activeBranches: branches.filter((b) => b.status === "active").length,
  //   totalStaff: branches.reduce((sum, b) => sum + b.staffCount, 0),
  //   totalKYB: branches.reduce((sum, b) => sum + b.completedKYB, 0),
  // };
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
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
            <PermissionGate permission="BTN_CREATE_BRANCH">
              <DialogTrigger asChild>
                <Button variant="business" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Branch
                </Button>
              </DialogTrigger>
            </PermissionGate>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {isEditMode ? "Edit Branch" : "Add New Branch"}
                </DialogTitle>
              </DialogHeader>

              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-4 py-4 ">
                  <div>
                    <Label htmlFor="branchName">
                      Branch Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="branchName"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        clearError("name");
                      }}
                      placeholder="e.g., Dubai Marina Branch"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emirate">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="emirate"
                      value={form.emirate}
                      onChange={(e) => {
                        setForm({ ...form, emirate: e.target.value });
                        clearError("emirate");
                      }}
                      placeholder="Enter City"
                    />
                    {/* <Select
                      value={form.emirate}
                      onValueChange={(v) => {
                        setForm({ ...form, emirate: v });
                        clearError("emirate");
                      }}
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
                    </Select> */}
                    {errors.emirate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.emirate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => {
                        setForm({ ...form, location: e.target.value });
                        clearError("location");
                      }}
                      placeholder="e.g., Dubai Marina Mall"
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">
                      Full Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => {
                        setForm({ ...form, address: e.target.value });
                        clearError("address");
                      }}
                      placeholder="Complete branch address"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          clearError("email");
                        }}
                        placeholder="branch@bizpayaxis.ae"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <PhoneInput
                        country={"ae"} // default country (UAE)
                        value={form.phone}
                        onChange={(value) => {
                          setForm({ ...form, phone: value });
                          clearError("phone");
                        }}
                        inputProps={{
                          name: "phone",
                          id: "phone",
                        }}
                        containerClass="w-full mt-1"
                        inputClass="!h-10 !w-full !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm !ring-offset-background !pl-[52px] !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:ring-offset-2"
                        buttonClass="!absolute !left-0 !top-0 !h-10 !w-12 !border-0 !bg-transparent !flex !items-center !justify-center !rounded-l-md hover:!bg-accent/50"
                        dropdownClass="!bg-background !border !border-border !rounded-md !shadow-lg"
                        enableSearch
                        searchPlaceholder="Search country..."
                        preferredCountries={["ae", "in"]} // optional
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {isEditMode ? "Update Branch" : "Create Branch"}
                    </Button>
                  </div>
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
                {dashboardStats?.totalBranches}
              </div>
              {/* <p className="text-xs text-muted-foreground">Across UAE</p> */}
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
                {dashboardStats?.activeBranches}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (dashboardStats?.activeBranches /
                    dashboardStats?.totalBranches) *
                    100 || 0,
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
              <div className="text-2xl font-bold">
                {dashboardStats?.totalStaffs}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all branches
              </p>
            </CardContent>
          </Card>

          {/*<Card className="shadow-card">
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
          </Card>*/}
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-center">
              <div className="flex-1">
                <Label htmlFor="search">Search Branches</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, location, or manager..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPagination((prev) => ({
                        ...prev,
                        pageNumber: 0,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                {/*<Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All Branches
                </Button>*/}
                <Button
                  variant={filterStatus === true ? "default" : "outline"}
                  onClick={() => {
                    setFilterStatus(true);
                    setPagination((prev) => ({
                      ...prev,
                      pageNumber: 0,
                    }));
                  }}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === false ? "default" : "outline"}
                  onClick={() => {
                    setFilterStatus(false);
                    setPagination((prev) => ({
                      ...prev,
                      pageNumber: 0,
                    }));
                  }}
                >
                  Inactive
                </Button>
                {/* <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branches List */}
        <div className="space-y-6">
          {isFetchingbranchList ? (
            <div>
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    Loading Branch Data...
                  </p>
                </div>
              </div>
            </div>
          ) : branches?.length > 0 ? (
            <div>
              {branches?.map((branch) => {
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
                                  {branch?.name}
                                </h3>
                                <Badge
                                  variant={status.variant}
                                  className="flex items-center gap-1"
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {status?.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {branch?.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Globe className="h-4 w-4" />
                                  {branch?.emirate}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Branch Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {branch?.managerRole
                                  ?.replace(/^ROLE_/, "")
                                  ?.split("_")
                                  ?.map(
                                    (word) =>
                                      word?.charAt(0)?.toUpperCase() +
                                      word?.slice(1)?.toLowerCase(),
                                  )
                                  ?.join(" ")}
                                :
                              </div>
                              <p className="font-medium">{branch.manager}</p>
                              {/* <p className="text-xs">ID: {branch.managerId}</p> */}
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
                              <p className="font-medium">
                                {branch.operatingHours}
                              </p>
                              <p className="text-xs">
                                Open: {branch.openingDate}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Staff:
                              </span>
                              <p className="font-medium">
                                {branch?.staffCount} members
                              </p>
                              <p className="text-xs">
                                {branch?.activeKYB} active KYB
                              </p>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                              branch.efficiency,
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
                      </div> */}

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
                              navigate(
                                `/exchange/branches/Details/${branch.uuid}`,
                              )
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>

                          <PermissionGate permission="BTN_EDIT_BRANCH">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(branch)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Branch
                            </Button>
                          </PermissionGate>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/exchange/staff")}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Manage Staff
                          </Button>
                          {/* {branch.status === "active" ? (
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
                      )} */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.pageNumber - 1);
                      }}
                      className={
                        pagination.pageNumber === 0
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(index);
                        }}
                        isActive={pagination.pageNumber === index}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.pageNumber + 1);
                      }}
                      className={
                        pagination.pageNumber === pagination.totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : (
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

        {/* {branches?.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No branches found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )} */}
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBranchManagement;
