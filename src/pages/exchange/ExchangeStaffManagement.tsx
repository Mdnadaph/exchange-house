import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Users,
  Plus,
  Search,
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

const ExchangeStaffManagement = () => {
  const [cookies] = useCookies(["token", "email"]);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(4);
  const token = cookies.token;
  const email = cookies.email;

  const { toast } = useToast();
  const navigate = useNavigate();
  const uuid = useParams();

  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    branchId: "",
    roleId: "",
  });
  const [staffErrors, setStaffErrors] = useState<Record<string, string>>({});

  const clearStaffError = (field: string) => {
    setStaffErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateAllStaff = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!staffForm.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (staffForm.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email
    if (!staffForm.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staffForm.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Contact Number
    const digits = staffForm.contactNumber
      ? staffForm.contactNumber.replace(/\D/g, "")
      : "";
    if (!digits) {
      newErrors.contactNumber = "Contact number is required";
    } else if (digits.length < 5) {
      newErrors.contactNumber = "Contact number must be at least 5 digits";
    }

    // Branch
    if (!staffForm.branchId) {
      newErrors.branchId = "Branch is required";
    }

    // Role
    if (!staffForm.roleId) {
      newErrors.roleId = "Role is required";
    }

    setStaffErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ROLE_OPTIONS = [
    {
      id: 2,
      label: "Branch Manager",
      value: "ROLE_BRANCH_MANAGER",
    },
    {
      id: 3,
      label: "Senior KYB Officer",
      value: "ROLE_SENIOR_KYB_OFFICER",
    },
    {
      id: 4,
      label: "KYB Officer",
      value: "ROLE_KYB_OFFICER",
    },
  ];

  const fetchBranchWithStaff = async (page = 0) => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v3/branch/branch-staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          size: pageSize,
        },
      });
      setBranches(res?.data?.data?.content || []);
      // Set pagination info from API response
      setTotalPages(res?.data?.data?.totalPages || 0);
      setTotalElements(res?.data?.data?.totalElements || 0);
      setCurrentPage(res?.data?.data?.page || 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load branches with staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchBranchWithStaff(currentPage);
    }
  }, [token, currentPage]);
  const createStaff = async () => {
    if (!validateAllStaff()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v3/admin/staff/create`,
        {
          fullName: staffForm.fullName,
          email: staffForm.email,
          contactNumber: staffForm.contactNumber,
          branchId: Number(staffForm.branchId),
          roleId: Number(staffForm.roleId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Success",
        description:
          response?.data?.message || "Staff member created successfully",
      });

      setIsCreateModalOpen(false);
      setStaffForm({
        fullName: "",
        email: "",
        contactNumber: "",
        branchId: "",
        roleId: "",
      });
      setStaffErrors({}); // clear errors on success
      setCurrentPage(0);
      fetchBranchWithStaff(0);
    } catch (error: any) {
      console.error("Create Staff Error:", error?.response?.data || error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create staff",
        variant: "destructive",
      });
    }
  };

  const fetchBranches = async () => {
    if (!cookies.token) {
      console.error("Token not found. Skipping branch fetch.");
      return;
    }

    try {
      setBranchLoading(true);

      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      setBranchList(res.data?.data || []);
    } catch (error: any) {
      console.error("Fetch branches error:", error?.response?.data || error);

      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    } finally {
      setBranchLoading(false);
    }
  };

  useEffect(() => {
    if (isCreateModalOpen && cookies.token) {
      fetchBranches();
    }
  }, [isCreateModalOpen, cookies.token]);
  useEffect(() => {});

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      inactive: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: Clock,
      },
      training: {
        variant: "destructive" as const,
        label: "Training",
        icon: Clock,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 80) return "text-warning";
    return "text-destructive";
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Branch Manager": "bg-purple-100 text-purple-800",
      "Senior KYB Officer": "bg-blue-100 text-blue-800",
      "KYB Officer": "bg-green-100 text-green-800",
      "Compliance Officer": "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  // Calculate real statistics from the branches data
  const totalStaff = branches.reduce(
    (acc, branch) => acc + (branch.staff?.length || 0),
    0,
  );
  const activeStaff = branches.reduce(
    (acc, branch) =>
      acc + (branch.staff?.filter((s: any) => s.active)?.length || 0),
    0,
  );
  const totalBranches = branches.length;
  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground">
              Manage branch staff and workload distribution
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Reports
            </Button>
            <Button
              variant="business"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                Across {totalBranches} branches
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Members
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {activeStaff}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalStaff > 0
                  ? `${Math.round(
                      (activeStaff / totalStaff) * 100,
                    )}% availability`
                  : "No staff"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Efficiency
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">
                Data not available
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending KYB
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">
                Data not available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Create staff Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Staff Member</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 py-4">
              <div>
                <Label>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={staffForm.fullName}
                  onChange={(e) => {
                    setStaffForm({ ...staffForm, fullName: e.target.value });
                    clearStaffError("fullName");
                  }}
                  placeholder="full name"
                />
                {staffErrors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {staffErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => {
                    setStaffForm({ ...staffForm, email: e.target.value });
                    clearStaffError("email");
                  }}
                  placeholder="example@gmail.com"
                />
                {staffErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {staffErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <PhoneInput
                  country={"ae"} // default country (UAE)
                  value={staffForm.contactNumber}
                  onChange={(value) => {
                    setStaffForm({ ...staffForm, contactNumber: value });
                    clearStaffError("contactNumber");
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
                  preferredCountries={["ae", "in"]}
                />
                {staffErrors.contactNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {staffErrors.contactNumber}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Select Branch <span className="text-red-500">*</span>
                </Label>

                <Select
                  value={staffForm.branchId}
                  onValueChange={(value) => {
                    setStaffForm({ ...staffForm, branchId: value });
                    clearStaffError("branchId");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        branchLoading ? "Loading branches..." : "Select Branch"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {branchList.map((branch) => (
                      <SelectItem
                        key={branch.branchId}
                        value={String(branch.branchId)}
                      >
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {staffErrors.branchId && (
                  <p className="text-sm text-red-500 mt-1">
                    {staffErrors.branchId}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Staff Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={staffForm.roleId}
                  onValueChange={(value) => {
                    setStaffForm({ ...staffForm, roleId: value });
                    clearStaffError("roleId");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {staffErrors.roleId && (
                  <p className="text-sm text-red-500 mt-1">
                    {staffErrors.roleId}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="business" onClick={createStaff}>
                Create Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">
                  Search Staff <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, role, or branch..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Staff</Button>
                <Button variant="outline">Managers</Button>
                <Button variant="outline">KYB Officers</Button>
                <Button variant="outline">High Performers</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Branch Staff */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading branches and staff...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {branches.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No branches found</h3>
                <p className="text-muted-foreground">
                  Create your first branch to get started
                </p>
              </div>
            ) : (
              branches.map((branch) => {
                // Map API status to UI status
                const mapStatus = (apiStatus: string) => {
                  const statusMap: Record<string, string> = {
                    ACTIVE: "active",
                    INACTIVE: "inactive",
                    PENDING: "training",
                  };
                  return statusMap[apiStatus] || "inactive";
                };

                // Map roleName to display label
                const getRoleLabel = (roleName: string) => {
                  const roleMap: Record<string, string> = {
                    ROLE_BRANCH_MANAGER: "Branch Manager",
                    ROLE_SENIOR_KYB_OFFICER: "Senior KYB Officer",
                    ROLE_KYB_OFFICER: "KYB Officer",
                  };
                  return roleMap[roleName] || roleName;
                };

                return (
                  <Card
                    key={branch.branchId || branch.uuid}
                    className="shadow-card"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">
                              {branch.name}
                            </h3>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>{branch.location}</span>
                              <span>•</span>
                              <span>{branch.emirate}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {branch.address}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {branch.staff?.length || 0} Staff Members
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {branch.staff && branch.staff.length > 0 && (
                        <div className="space-y-4">
                          {branch.staff.map((staff: any) => {
                            const status = getStatusBadge(
                              mapStatus(staff.status),
                            );
                            const StatusIcon = status.icon;

                            return (
                              <Card
                                key={staff.uuid}
                                className="border-l-4 border-l-accent hover:shadow-md transition-smooth"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-4 flex-1">
                                      {/* Staff Header */}
                                      <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                          <span className="text-primary-foreground font-semibold">
                                            {staff.fullName
                                              ?.split(" ")
                                              .map((n: string) => n[0])
                                              .join("")}
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-semibold text-foreground">
                                              {staff.fullName}
                                            </h4>
                                            <Badge
                                              variant={status.variant}
                                              className="flex items-center gap-1"
                                            >
                                              <StatusIcon className="h-3 w-3" />
                                              {status.label}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                                getRoleLabel(staff.roleName),
                                              )}`}
                                            >
                                              {getRoleLabel(staff.roleName)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                              ID: {staff.uuid?.slice(0, 8)}...
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Staff Details - Updated for API data */}
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                                        <div className="space-y-1">
                                          <div className="flex items-center text-muted-foreground">
                                            <Mail className="h-3 w-3 mr-1" />
                                            Contact:
                                          </div>
                                          <p className="font-medium">
                                            {staff.email}
                                          </p>
                                          <p className="text-xs">
                                            {staff.contactNumber}
                                          </p>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="flex items-center text-muted-foreground">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Status:
                                          </div>
                                          <p className="font-medium">
                                            {staff.active
                                              ? "Active"
                                              : "Inactive"}
                                          </p>
                                          <p className="text-xs">
                                            {staff.status}
                                          </p>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="flex items-center text-muted-foreground">
                                            <Phone className="h-3 w-3 mr-1" />
                                            Branch:
                                          </div>
                                          <p className="font-medium">
                                            {branch.name}
                                          </p>
                                          <p className="text-xs">
                                            {branch.emirate}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col space-y-2 ml-4">
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit Details
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Shield className="h-4 w-4 mr-1" />
                                        Permissions
                                      </Button>
                                      <Button variant="business" size="sm">
                                        Assign KYB
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
      {/* Pagination */}
      {!loading && branches.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </ExchangeLayout>
  );
};

export default ExchangeStaffManagement;
