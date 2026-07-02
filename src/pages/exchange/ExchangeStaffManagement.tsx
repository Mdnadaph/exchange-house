//import { useEffect, useState } from "react";
//import ExchangeLayout from "@/components/layout/ExchangeLayout";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import PhoneInput from "react-phone-input-2";
//import "react-phone-input-2/lib/style.css";
//import {
//  Users,
//  Plus,
//  Search,
//  Edit,
//  MapPin,
//  Phone,
//  Mail,
//  Calendar,
//  TrendingUp,
//  CheckCircle,
//  Clock,
//  Shield,
//} from "lucide-react";

//import {
//  Dialog,
//  DialogContent,
//  DialogHeader,
//  DialogTitle,
//  DialogFooter,
//} from "@/components/ui/dialog";

//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";

//import { useToast } from "@/hooks/use-toast";
//import BASE_URL from "@/config/config";
//import axios from "axios";
//import { useCookies } from "react-cookie";
//import { useNavigate, useParams } from "react-router-dom";
//import { PermissionGate } from "@/contexts/PermissionGate";

//const ExchangeStaffManagement = () => {
//  const [cookies] = useCookies(["token", "email"]);
//  const [branches, setBranches] = useState<any[]>([]);
//  const [currentPage, setCurrentPage] = useState(0);
//  const [totalPages, setTotalPages] = useState(0);
//  const [loading, setLoading] = useState(false);
//  const [totalElements, setTotalElements] = useState(0);
//  const [pageSize] = useState(4);
//  const token = cookies.token;
//  const email = cookies.email;

//  const { toast } = useToast();
//  const navigate = useNavigate();
//  const uuid = useParams();

//  const [branchList, setBranchList] = useState<any[]>([]);
//  const [branchLoading, setBranchLoading] = useState(false);

//  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
//  const [editableStaffData, setEditableStaffData] = useState<any>({});
//  const [staffUUID, setStaffUUID] = useState<string>("");
//  const [searchQuery, setSearchQuery] = useState("");
//  const [filterByRole, setFilterByRole] = useState("");
//  const [staffForm, setStaffForm] = useState({
//    fullName: "",
//    email: "",
//    contactNumber: "",
//    branchId: "",
//    roleId: "",
//  });
//  const [staffErrors, setStaffErrors] = useState<Record<string, string>>({});

//  const clearStaffError = (field: string) => {
//    setStaffErrors((prev) => {
//      const newErrors = { ...prev };
//      delete newErrors[field];
//      return newErrors;
//    });
//  };

//  const validateAllStaff = (): boolean => {
//    const newErrors: Record<string, string> = {};

//    // Full Name
//    if (!staffForm.fullName.trim()) {
//      newErrors.fullName = "Full name is required";
//    } else if (staffForm.fullName.trim().length < 2) {
//      newErrors.fullName = "Full name must be at least 2 characters";
//    }

//    // Email
//    if (!staffForm.email.trim()) {
//      newErrors.email = "Email is required";
//    } else {
//      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//      if (!emailRegex.test(staffForm.email)) {
//        newErrors.email = "Enter a valid email address";
//      }
//    }

//    // Contact Number
//    const digits = staffForm.contactNumber
//      ? staffForm.contactNumber.replace(/\D/g, "")
//      : "";
//    if (!digits) {
//      newErrors.contactNumber = "Contact number is required";
//    } else if (digits.length < 5) {
//      newErrors.contactNumber = "Contact number must be at least 5 digits";
//    }

//    // Branch
//    if (!staffForm.branchId) {
//      newErrors.branchId = "Branch is required";
//    }

//    // Role
//    if (!staffForm.roleId) {
//      newErrors.roleId = "Role is required";
//    }

//    setStaffErrors(newErrors);
//    return Object.keys(newErrors).length === 0;
//  };

//  const ROLE_OPTIONS = [
//    {
//      id: 2,
//      label: "Branch Manager",
//      value: "ROLE_BRANCH_MANAGER",
//    },
//    {
//      id: 3,
//      label: "Senior KYB Officer",
//      value: "ROLE_SENIOR_KYB_OFFICER",
//    },
//    {
//      id: 4,
//      label: "KYB Officer",
//      value: "ROLE_KYB_OFFICER",
//    },
//  ];

//  const fetchBranchWithStaff = async (page = 0) => {
//    if (!token) {
//      return;
//    }

//    try {
//      setLoading(true);
//      const res = await axios.get(`${BASE_URL}/api/v3/branch/branch-staff`, {
//        headers: {
//          Authorization: `Bearer ${token}`,
//        },
//        params: {
//          page: page,
//          size: pageSize,
//          query: searchQuery,
//          role: filterByRole,
//        },
//      });
//      setBranches(res?.data?.data?.content || []);
//      // Set pagination info from API response
//      setTotalPages(res?.data?.data?.totalPages || 0);
//      setTotalElements(res?.data?.data?.totalElements || 0);
//      setCurrentPage(res?.data?.data?.page || 0);
//    } catch (error: any) {
//      toast({
//        title: "Error",
//        description: "Failed to load branches with staff",
//        variant: "destructive",
//      });
//    } finally {
//      setLoading(false);
//    }
//  };
//  useEffect(() => {
//    if (token) {
//      fetchBranchWithStaff(currentPage);
//    }
//  }, [token, currentPage, searchQuery, filterByRole]);
//  const createStaff = async () => {
//    if (!validateAllStaff()) {
//      toast({
//        title: "Validation Error",
//        description: "Please fix the errors before submitting.",
//        variant: "destructive",
//      });
//      return;
//    }

//    try {
//      setLoading(true);
//      const response = await axios.post(
//        `${BASE_URL}/api/v3/admin/staff/create`,
//        {
//          fullName: staffForm.fullName,
//          email: staffForm.email,
//          contactNumber: staffForm.contactNumber,
//          branchId: Number(staffForm.branchId),
//          roleId: Number(staffForm.roleId),
//        },
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//          },
//        },
//      );
//      if (response?.data?.status) {
//        toast({
//          title: "Success",
//          description:
//            response?.data?.message || "Staff member created successfully",
//        });
//      } else {
//        toast({
//          title: "Error",
//          description:
//            response?.data?.message || "Failed to create staff member",
//          variant: "destructive",
//        });
//      }

//      setIsCreateModalOpen(false);
//      setStaffForm({
//        fullName: "",
//        email: "",
//        contactNumber: "",
//        branchId: "",
//        roleId: "",
//      });
//      setStaffErrors({}); // clear errors on success
//      setCurrentPage(0);
//      fetchBranchWithStaff(0);
//    } catch (error: any) {
//      console.error("Create Staff Error:", error?.response?.data || error);
//      toast({
//        title: "Error",
//        description: error?.response?.data?.message || "Failed to create staff",
//        variant: "destructive",
//      });
//    } finally {
//      setLoading(false);
//    }
//  };

//  const EditStaff = async () => {
//    if (!validateAllStaff()) {
//      toast({
//        title: "Validation Error",
//        description: "Please fix the errors before submitting.",
//        variant: "destructive",
//      });
//      return;
//    }

//    try {
//      setLoading(true);
//      const response = await axios.put(
//        `${BASE_URL}/api/v3/admin/staff/${staffUUID}/edit`,
//        {
//          fullName: staffForm.fullName,
//          email: staffForm.email,
//          contactNumber: staffForm.contactNumber,
//          branchId: Number(staffForm.branchId),
//          roleId: Number(staffForm.roleId),
//        },
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//          },
//        },
//      );
//      if (response?.data?.status) {
//        toast({
//          title: "Success",
//          description:
//            response?.data?.message || "Staff member edited successfully",
//        });
//      } else {
//        toast({
//          title: "Error",
//          description: response?.data?.message || "failed to edit staff",
//          variant: "destructive",
//        });
//      }

//      setIsEditStaffModalOpen(false);
//      setStaffUUID("");
//      setStaffForm({
//        fullName: "",
//        email: "",
//        contactNumber: "",
//        branchId: "",
//        roleId: "",
//      });
//      setStaffErrors({}); // clear errors on success
//      setCurrentPage(0);
//      fetchBranchWithStaff(0);
//    } catch (error: any) {
//      console.error("Update Staff Error:", error?.response?.data || error);
//      toast({
//        title: "Error",
//        description: error?.response?.data?.message || "Failed to update staff",
//        variant: "destructive",
//      });
//    } finally {
//      setLoading(false);
//    }
//  };

//  const fetchBranches = async () => {
//    if (!cookies.token) {
//      console.error("Token not found. Skipping branch fetch.");
//      return;
//    }

//    try {
//      setBranchLoading(true);

//      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
//        headers: {
//          Authorization: `Bearer ${cookies.token}`,
//        },
//      });

//      setBranchList(res.data?.data || []);
//    } catch (error: any) {
//      console.error("Fetch branches error:", error?.response?.data || error);

//      toast({
//        title: "Error",
//        description: "Failed to load branches",
//        variant: "destructive",
//      });
//    } finally {
//      setBranchLoading(false);
//    }
//  };

//  useEffect(() => {
//    if (isCreateModalOpen || (isEditStaffModalOpen && cookies.token)) {
//      fetchBranches();
//    }
//  }, [isCreateModalOpen, cookies.token, isEditStaffModalOpen]);
//  useEffect(() => {});

//  const getStatusBadge = (status: string) => {
//    const statusMap = {
//      active: {
//        variant: "default" as const,
//        label: "Active",
//        icon: CheckCircle,
//      },
//      inactive: {
//        variant: "secondary" as const,
//        label: "Inactive",
//        icon: Clock,
//      },
//      training: {
//        variant: "destructive" as const,
//        label: "Training",
//        icon: Clock,
//      },
//    };
//    return statusMap[status as keyof typeof statusMap] || statusMap.active;
//  };

//  const getEfficiencyColor = (efficiency: number) => {
//    if (efficiency >= 90) return "text-success";
//    if (efficiency >= 80) return "text-warning";
//    return "text-destructive";
//  };

//  const getRoleColor = (role: string) => {
//    const colors = {
//      "Branch Manager": "bg-purple-100 text-purple-800",
//      "Senior KYB Officer": "bg-blue-100 text-blue-800",
//      "KYB Officer": "bg-green-100 text-green-800",
//      "Compliance Officer": "bg-orange-100 text-orange-800",
//    };
//    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
//  };
//  // Calculate real statistics from the branches data
//  const totalStaff = branches.reduce(
//    (acc, branch) => acc + (branch.staff?.length || 0),
//    0,
//  );
//  const activeStaff = branches.reduce(
//    (acc, branch) =>
//      acc + (branch.staff?.filter((s: any) => s.active)?.length || 0),
//    0,
//  );
//  const totalBranches = branches.length;
//  const individualStaffData = editableStaffData?.staff?.find(
//    (staff: any) => staff?.uuid == staffUUID,
//  );

//  useEffect(() => {
//    setStaffForm({
//      fullName: individualStaffData?.fullName ?? "",
//      email: individualStaffData?.email ?? "",
//      contactNumber: individualStaffData?.contactNumber ?? "",
//      branchId: String(editableStaffData?.branchId) ?? "",
//      roleId: String(individualStaffData?.roleId) ?? "",
//    });
//  }, [isEditStaffModalOpen]);
//  return (
//    <ExchangeLayout>
//      <div className="space-y-8">
//        {/* Header */}
//        <div className="flex items-center justify-between">
//          <div>
//            <h1 className="text-3xl font-bold text-foreground">
//              Staff Management
//            </h1>
//            <p className="text-muted-foreground">
//              Manage branch staff and workload distribution
//            </p>
//          </div>
//          <div className="flex space-x-3">
//            {/* <Button variant="outline">
//              <TrendingUp className="h-4 w-4 mr-2" />
//              Performance Reports
//            </Button> */}

//            <PermissionGate permission="BTN_CREATE_STAFF">
//              <Button
//                variant="business"
//                onClick={() => setIsCreateModalOpen(true)}
//              >
//                <Plus className="h-4 w-4 mr-2" />
//                Add Staff Member
//              </Button>
//            </PermissionGate>
//          </div>
//        </div>

//        {/* Overview Stats */}
//        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Total Staff
//              </CardTitle>
//              <Users className="h-5 w-5 text-primary" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold">{totalStaff}</div>
//              <p className="text-xs text-muted-foreground">
//                Across {totalBranches} branches
//              </p>
//            </CardContent>
//          </Card>
//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Active Members
//              </CardTitle>
//              <CheckCircle className="h-5 w-5 text-success" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold text-success">
//                {activeStaff}
//              </div>
//              <p className="text-xs text-muted-foreground">
//                {totalStaff > 0
//                  ? `${Math.round(
//                      (activeStaff / totalStaff) * 100,
//                    )}% availability`
//                  : "No staff"}
//              </p>
//            </CardContent>
//          </Card>

//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Avg Efficiency
//              </CardTitle>
//              <TrendingUp className="h-5 w-5 text-accent" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold">N/A</div>
//              <p className="text-xs text-muted-foreground">
//                Data not available
//              </p>
//            </CardContent>
//          </Card>
//          <Card className="shadow-card">
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//              <CardTitle className="text-sm font-medium text-muted-foreground">
//                Pending KYB
//              </CardTitle>
//              <Clock className="h-5 w-5 text-warning" />
//            </CardHeader>
//            <CardContent>
//              <div className="text-2xl font-bold">N/A</div>
//              <p className="text-xs text-muted-foreground">
//                Data not available
//              </p>
//            </CardContent>
//          </Card>
//        </div>

//        {/* Create staff Modal */}
//        <Dialog
//          open={isCreateModalOpen}
//          onOpenChange={(open) => {
//            setIsCreateModalOpen(open);
//            if (!open) {
//              setStaffErrors({});
//            }
//          }}
//        >
//          <DialogContent className="sm:max-w-lg">
//            <DialogHeader>
//              <DialogTitle>Create Staff Member</DialogTitle>
//            </DialogHeader>

//            <div className="grid grid-cols-1 gap-4 py-4">
//              <div>
//                <Label>
//                  Full Name <span className="text-red-500">*</span>
//                </Label>
//                <Input
//                  value={staffForm.fullName}
//                  onChange={(e) => {
//                    setStaffForm({ ...staffForm, fullName: e.target.value });
//                    clearStaffError("fullName");
//                  }}
//                  placeholder="full name"
//                />
//                {staffErrors.fullName && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.fullName}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Email Address <span className="text-red-500">*</span>
//                </Label>
//                <Input
//                  type="email"
//                  value={staffForm.email}
//                  onChange={(e) => {
//                    setStaffForm({ ...staffForm, email: e.target.value });
//                    clearStaffError("email");
//                  }}
//                  placeholder="example@gmail.com"
//                />
//                {staffErrors.email && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.email}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Contact Number <span className="text-red-500">*</span>
//                </Label>
//                <PhoneInput
//                  country={"ae"} // default country (UAE)
//                  value={staffForm.contactNumber}
//                  onChange={(value) => {
//                    setStaffForm({ ...staffForm, contactNumber: value });
//                    clearStaffError("contactNumber");
//                  }}
//                  inputProps={{
//                    name: "phone",
//                    id: "phone",
//                  }}
//                  containerClass="w-full mt-1"
//                  inputClass="!h-10 !w-full !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm !ring-offset-background !pl-[52px] !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:ring-offset-2"
//                  buttonClass="!absolute !left-0 !top-0 !h-10 !w-12 !border-0 !bg-transparent !flex !items-center !justify-center !rounded-l-md hover:!bg-accent/50"
//                  dropdownClass="!bg-background !border !border-border !rounded-md !shadow-lg"
//                  enableSearch
//                  searchPlaceholder="Search country..."
//                  preferredCountries={["ae", "in"]}
//                />
//                {staffErrors.contactNumber && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.contactNumber}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Select Branch <span className="text-red-500">*</span>
//                </Label>

//                <Select
//                  value={staffForm.branchId}
//                  onValueChange={(value) => {
//                    setStaffForm({ ...staffForm, branchId: value });
//                    clearStaffError("branchId");
//                  }}
//                >
//                  <SelectTrigger>
//                    <SelectValue
//                      placeholder={
//                        branchLoading ? "Loading branches..." : "Select Branch"
//                      }
//                    />
//                  </SelectTrigger>

//                  <SelectContent>
//                    {branchList.map((branch) => (
//                      <SelectItem
//                        key={branch.branchId}
//                        value={String(branch.branchId)}
//                      >
//                        {branch.name}
//                      </SelectItem>
//                    ))}
//                  </SelectContent>
//                </Select>
//                {staffErrors.branchId && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.branchId}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Staff Role <span className="text-red-500">*</span>
//                </Label>
//                <Select
//                  value={staffForm.roleId}
//                  onValueChange={(value) => {
//                    setStaffForm({ ...staffForm, roleId: value });
//                    clearStaffError("roleId");
//                  }}
//                >
//                  <SelectTrigger>
//                    <SelectValue placeholder="Select Role" />
//                  </SelectTrigger>

//                  <SelectContent>
//                    {ROLE_OPTIONS.map((role) => (
//                      <SelectItem key={role.id} value={String(role.id)}>
//                        {role.label}
//                      </SelectItem>
//                    ))}
//                  </SelectContent>
//                </Select>
//                {staffErrors.roleId && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.roleId}
//                  </p>
//                )}
//              </div>
//            </div>

//            <DialogFooter>
//              <Button
//                variant="outline"
//                onClick={() => setIsCreateModalOpen(false)}
//              >
//                Cancel
//              </Button>
//              <Button
//                variant="business"
//                onClick={createStaff}
//                disabled={loading}
//              >
//                Create Staff
//              </Button>
//            </DialogFooter>
//          </DialogContent>
//        </Dialog>

//        {/* Edit staff Modal*/}

//        <Dialog
//          open={isEditStaffModalOpen}
//          onOpenChange={(open) => {
//            setIsEditStaffModalOpen(open);
//            if (!open) {
//              setEditableStaffData({});
//              setStaffUUID("");
//              setStaffErrors({});
//            }
//          }}
//        >
//          <DialogContent className="sm:max-w-lg">
//            <DialogHeader>
//              <DialogTitle>Edit Staff Member</DialogTitle>
//            </DialogHeader>

//            <div className="grid grid-cols-1 gap-4 py-4">
//              <div>
//                <Label>
//                  Full Name <span className="text-red-500">*</span>
//                </Label>
//                <Input
//                  value={staffForm.fullName}
//                  onChange={(e) => {
//                    setStaffForm({ ...staffForm, fullName: e.target.value });
//                    clearStaffError("fullName");
//                  }}
//                  placeholder="full name"
//                />
//                {staffErrors.fullName && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.fullName}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Email Address <span className="text-red-500">*</span>
//                </Label>
//                <Input
//                  disabled={!!staffUUID}
//                  type="email"
//                  value={staffForm.email}
//                  onChange={(e) => {
//                    setStaffForm({ ...staffForm, email: e.target.value });
//                    clearStaffError("email");
//                  }}
//                  placeholder="example@gmail.com"
//                />
//                {staffErrors.email && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.email}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Contact Number <span className="text-red-500">*</span>
//                </Label>
//                <PhoneInput
//                  country={"ae"} // default country (UAE)
//                  value={staffForm.contactNumber}
//                  onChange={(value) => {
//                    setStaffForm({ ...staffForm, contactNumber: value });
//                    clearStaffError("contactNumber");
//                  }}
//                  inputProps={{
//                    name: "phone",
//                    id: "phone",
//                  }}
//                  containerClass="w-full mt-1"
//                  inputClass="!h-10 !w-full !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm !ring-offset-background !pl-[52px] !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:ring-offset-2"
//                  buttonClass="!absolute !left-0 !top-0 !h-10 !w-12 !border-0 !bg-transparent !flex !items-center !justify-center !rounded-l-md hover:!bg-accent/50"
//                  dropdownClass="!bg-background !border !border-border !rounded-md !shadow-lg"
//                  enableSearch
//                  searchPlaceholder="Search country..."
//                  preferredCountries={["ae", "in"]}
//                />
//                {staffErrors.contactNumber && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.contactNumber}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Select Branch <span className="text-red-500">*</span>
//                </Label>

//                <Select
//                  value={staffForm.branchId}
//                  onValueChange={(value) => {
//                    setStaffForm({ ...staffForm, branchId: value });
//                    clearStaffError("branchId");
//                  }}
//                >
//                  <SelectTrigger>
//                    <SelectValue
//                      placeholder={
//                        branchLoading ? "Loading branches..." : "Select Branch"
//                      }
//                    />
//                  </SelectTrigger>

//                  <SelectContent>
//                    {branchList.map((branch) => (
//                      <SelectItem
//                        key={branch.branchId}
//                        value={String(branch.branchId)}
//                      >
//                        {branch.name}
//                      </SelectItem>
//                    ))}
//                  </SelectContent>
//                </Select>
//                {staffErrors.branchId && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.branchId}
//                  </p>
//                )}
//              </div>

//              <div>
//                <Label>
//                  Staff Role <span className="text-red-500">*</span>
//                </Label>
//                <Select
//                  value={staffForm.roleId}
//                  onValueChange={(value) => {
//                    setStaffForm({ ...staffForm, roleId: value });
//                    clearStaffError("roleId");
//                  }}
//                >
//                  <SelectTrigger>
//                    <SelectValue placeholder="Select Role" />
//                  </SelectTrigger>

//                  <SelectContent>
//                    {ROLE_OPTIONS.map((role) => (
//                      <SelectItem key={role.id} value={String(role.id)}>
//                        {role.label}
//                      </SelectItem>
//                    ))}
//                  </SelectContent>
//                </Select>
//                {staffErrors.roleId && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {staffErrors.roleId}
//                  </p>
//                )}
//              </div>
//            </div>

//            <DialogFooter>
//              <Button
//                variant="outline"
//                onClick={() => {
//                  setIsEditStaffModalOpen(false);
//                  setEditableStaffData({});
//                  setStaffUUID("");
//                  setStaffErrors({});
//                }}
//              >
//                Cancel
//              </Button>
//              <Button variant="business" onClick={EditStaff} disabled={loading}>
//                Edit Staff
//              </Button>
//            </DialogFooter>
//          </DialogContent>
//        </Dialog>

//        {/* Search and Filters */}
//        <Card className="shadow-card">
//          <CardContent className="p-6">
//            <div className="flex flex-col sm:flex-row gap-4">
//              <div className="flex-1">
//                <Label htmlFor="search">
//                  Search Staff <span className="text-red-500">*</span>
//                </Label>
//                <div className="relative">
//                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                  <Input
//                    id="search"
//                    placeholder="Search by name, role, or branch..."
//                    className="pl-9"
//                    onChange={(e) => setSearchQuery(e.target.value)}
//                  />
//                </div>
//              </div>
//              <div className="flex gap-2">
//                <Button variant="outline" onClick={() => setFilterByRole("")}>
//                  All Staff
//                </Button>
//                <Button
//                  variant="outline"
//                  onClick={() => setFilterByRole("BRANCH_MANAGER")}
//                >
//                  Branch Managers
//                </Button>
//                <Button
//                  variant="outline"
//                  onClick={() => setFilterByRole("KYB_OFFICER")}
//                >
//                  KYB Officers
//                </Button>
//                <Button
//                  variant="outline"
//                  onClick={() => setFilterByRole("SENIOR_KYB_OFFICER")}
//                >
//                  Senior KYB Officer
//                </Button>
//                {/* <Button variant="outline">High Performers</Button> */}
//              </div>
//            </div>
//          </CardContent>
//        </Card>
//        {/* Branch Staff */}
//        {loading ? (
//          <div className="flex justify-center items-center py-12">
//            <div className="text-center">
//              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//              <p className="text-muted-foreground">
//                Loading branches and staff...
//              </p>
//            </div>
//          </div>
//        ) : (
//          <div className="space-y-8">
//            {branches.length === 0 ? (
//              <div className="text-center py-12">
//                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//                <h3 className="text-lg font-medium mb-2">No branches found</h3>
//                <p className="text-muted-foreground">
//                  Create your first branch to get started
//                </p>
//              </div>
//            ) : (
//              branches.map((branch) => {
//                // Map API status to UI status
//                const mapStatus = (apiStatus: string) => {
//                  const statusMap: Record<string, string> = {
//                    ACTIVE: "active",
//                    INACTIVE: "inactive",
//                    PENDING: "training",
//                  };
//                  return statusMap[apiStatus] || "inactive";
//                };

//                // Map roleName to display label
//                const getRoleLabel = (roleName: string) => {
//                  const roleMap: Record<string, string> = {
//                    ROLE_BRANCH_MANAGER: "Branch Manager",
//                    ROLE_SENIOR_KYB_OFFICER: "Senior KYB Officer",
//                    ROLE_KYB_OFFICER: "KYB Officer",
//                  };
//                  return roleMap[roleName] || roleName;
//                };

//                return (
//                  <Card
//                    key={branch.branchId || branch.uuid}
//                    className="shadow-card"
//                  >
//                    <CardHeader>
//                      <div className="flex items-center justify-between">
//                        <div className="flex items-center gap-4">
//                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
//                            <MapPin className="h-6 w-6 text-primary" />
//                          </div>
//                          <div>
//                            <h3 className="text-xl font-semibold text-foreground">
//                              {branch.name}
//                            </h3>
//                            <div className="flex gap-2 text-sm text-muted-foreground">
//                              <span>{branch.location}</span>
//                              <span>•</span>
//                              <span>{branch.emirate}</span>
//                            </div>
//                            <p className="text-xs text-muted-foreground mt-1">
//                              {branch.address}
//                            </p>
//                          </div>
//                        </div>
//                        <Badge variant="outline" className="text-sm">
//                          {branch.staff?.length || 0} Staff Members
//                        </Badge>
//                      </div>
//                    </CardHeader>
//                    <CardContent>
//                      {branch.staff && branch.staff.length > 0 && (
//                        <div className="space-y-4">
//                          {branch.staff.map((staff: any) => {
//                            const status = getStatusBadge(
//                              mapStatus(staff.status),
//                            );
//                            const StatusIcon = status.icon;

//                            return (
//                              <Card
//                                key={staff.uuid}
//                                className="border-l-4 border-l-accent hover:shadow-md transition-smooth"
//                              >
//                                <CardContent className="p-6">
//                                  <div className="flex items-start justify-between">
//                                    <div className="space-y-4 flex-1">
//                                      {/* Staff Header */}
//                                      <div className="flex items-center space-x-4">
//                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
//                                          <span className="text-primary-foreground font-semibold">
//                                            {staff.fullName
//                                              ?.split(" ")
//                                              .map((n: string) => n[0])
//                                              .join("")}
//                                          </span>
//                                        </div>
//                                        <div className="flex-1">
//                                          <div className="flex items-center gap-3 mb-1">
//                                            <h4 className="font-semibold text-foreground">
//                                              {staff.fullName}
//                                            </h4>
//                                            <Badge
//                                              variant={status.variant}
//                                              className="flex items-center gap-1"
//                                            >
//                                              <StatusIcon className="h-3 w-3" />
//                                              {status.label}
//                                            </Badge>
//                                          </div>
//                                          <div className="flex items-center gap-2">
//                                            <span
//                                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
//                                                getRoleLabel(staff.roleName),
//                                              )}`}
//                                            >
//                                              {getRoleLabel(staff.roleName)}
//                                            </span>
//                                            <span className="text-sm text-muted-foreground">
//                                              ID: {staff.uuid?.slice(0, 8)}...
//                                            </span>
//                                          </div>
//                                        </div>
//                                      </div>

//                                      {/* Staff Details - Updated for API data */}
//                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
//                                        <div className="space-y-1">
//                                          <div className="flex items-center text-muted-foreground">
//                                            <Mail className="h-3 w-3 mr-1" />
//                                            Contact:
//                                          </div>
//                                          <p className="font-medium">
//                                            {staff.email}
//                                          </p>
//                                          <p className="text-xs">
//                                            {staff.contactNumber}
//                                          </p>
//                                        </div>

//                                        <div className="space-y-1">
//                                          <div className="flex items-center text-muted-foreground">
//                                            <Shield className="h-3 w-3 mr-1" />
//                                            Status:
//                                          </div>
//                                          <p className="font-medium">
//                                            {staff.active
//                                              ? "Active"
//                                              : "Inactive"}
//                                          </p>
//                                          <p className="text-xs">
//                                            {staff.status}
//                                          </p>
//                                        </div>

//                                        <div className="space-y-1">
//                                          <div className="flex items-center text-muted-foreground">
//                                            <Phone className="h-3 w-3 mr-1" />
//                                            Branch:
//                                          </div>
//                                          <p className="font-medium">
//                                            {branch.name}
//                                          </p>
//                                          <p className="text-xs">
//                                            {branch.emirate}
//                                          </p>
//                                        </div>
//                                      </div>
//                                    </div>

//                                    {/* Actions */}
//                                    <div className="flex flex-col space-y-2 ml-4">
//                                      <Button
//                                        variant="outline"
//                                        size="sm"
//                                        onClick={() => {
//                                          setIsEditStaffModalOpen(true);
//                                          setEditableStaffData(branch);
//                                          setStaffUUID(staff?.uuid);
//                                        }}
//                                      >
//                                        <Edit className="h-4 w-4 mr-1" />
//                                        Edit Details
//                                      </Button>
//                                      {/* <Button variant="outline" size="sm">
//                                        <Shield className="h-4 w-4 mr-1" />
//                                        Permissions
//                                      </Button>
//                                      <Button variant="business" size="sm">
//                                        Assign KYB
//                                      </Button> */}
//                                    </div>
//                                  </div>
//                                </CardContent>
//                              </Card>
//                            );
//                          })}
//                        </div>
//                      )}
//                    </CardContent>
//                  </Card>
//                );
//              })
//            )}
//          </div>
//        )}
//      </div>
//      {/* Pagination */}
//      {!loading && branches.length > 0 && totalPages > 1 && (
//        <div className="flex items-center justify-end mt-6">
//          <div className="flex items-center space-x-2">
//            <Button
//              variant="outline"
//              size="sm"
//              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//              disabled={currentPage === 0}
//            >
//              Previous
//            </Button>

//            {/* Page numbers */}
//            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//              let pageNum;
//              if (totalPages <= 5) {
//                pageNum = i;
//              } else if (currentPage < 3) {
//                pageNum = i;
//              } else if (currentPage > totalPages - 4) {
//                pageNum = totalPages - 5 + i;
//              } else {
//                pageNum = currentPage - 2 + i;
//              }

//              return (
//                <Button
//                  key={pageNum}
//                  variant={currentPage === pageNum ? "default" : "outline"}
//                  size="sm"
//                  onClick={() => setCurrentPage(pageNum)}
//                >
//                  {pageNum + 1}
//                </Button>
//              );
//            })}

//            <Button
//              variant="outline"
//              size="sm"
//              onClick={() =>
//                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
//              }
//              disabled={currentPage === totalPages - 1}
//            >
//              Next
//            </Button>
//          </div>
//        </div>
//      )}
//    </ExchangeLayout>
//  );
//};

//export default ExchangeStaffManagement;

import { useEffect, useMemo, useState } from "react";
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
  DialogDescription,
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
import { PermissionGate } from "@/contexts/PermissionGate";
import { Loader2 } from "lucide-react";
import PaginationSummary from "@/components/PaginationSummary";
import PaginationControl from "@/components/PaginationControl";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

const DASHBOARD_PERMISSION_CODE = "NAV_DASHBOARD";

const ExchangeStaffManagement = () => {
  const [cookies] = useCookies(["token", "email"]);
  const [dashboardStats, setDashboardStats] = useState<Record<string, number>>({
    totalStaff: 0,
    activeStaff: 0,
    totalStaffs: 0,
    activeMembers: 0,
  });
  const [branches, setBranches] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(4);
  const token = cookies.token;

  const { toast } = useToast();
  const navigate = useNavigate();
  const uuid = useParams();

  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [editableStaffData, setEditableStaffData] = useState<any>({});
  const [staffUUID, setStaffUUID] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceValue, setDebounceValue] = useState<string>("");
  const [filterByRole, setFilterByRole] = useState("");
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    branchId: "",
    roleId: "",
  });
  const [staffErrors, setStaffErrors] = useState<Record<string, string>>({});

  // ---------- Permission state ----------
  const [dashboardPermissionId, setDashboardPermissionId] = useState<
    string | null
  >(null);
  const [permissionTree, setPermissionTree] = useState<any[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, string | null>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Read-only permission view (tree with disabled checkboxes)
  const [isViewPermissionsModalOpen, setIsViewPermissionsModalOpen] =
    useState(false);
  const [viewingStaffPermissions, setViewingStaffPermissions] =
    useState<any>(null);
  const [viewingPermissionsTree, setViewingPermissionsTree] = useState<any[]>(
    [],
  );
  const [viewingAssignedIds, setViewingAssignedIds] = useState<string[]>([]);
  const [loadingViewTree, setLoadingViewTree] = useState(false);

  // Permission selection during create
  const [isPermissionSelectionModalOpen, setIsPermissionSelectionModalOpen] =
    useState(false);
  const [newStaffPermissionIds, setNewStaffPermissionIds] = useState<string[]>(
    [],
  );
  // Permission selection during edit
  const [editStaffPermissionIds, setEditStaffPermissionIds] = useState<
    string[]
  >([]);
  const [permissionSelectionTarget, setPermissionSelectionTarget] = useState<
    "create" | "edit"
  >("create");
  const [rawSelectedIds, setRawSelectedIds] = useState<string[]>([]);
  // ---------- End permission state ----------

  const [resendInvitationloading, setResendInvitationLoading] =
    useState<boolean>(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const clearStaffError = (field: string) => {
    setStaffErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateAllStaff = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!staffForm?.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (staffForm.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!staffForm.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staffForm.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    const digits = staffForm.contactNumber
      ? staffForm.contactNumber.replace(/\D/g, "")
      : "";
    if (!digits) {
      newErrors.contactNumber = "Contact number is required";
    } else if (digits.length < 5) {
      newErrors.contactNumber = "Contact number must be at least 5 digits";
    }

    if (!staffForm.branchId) {
      newErrors.branchId = "Branch is required";
    }

    if (!staffForm.roleId) {
      newErrors.roleId = "Role is required";
    }

    setStaffErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ROLE_OPTIONS = [
    { id: 2, label: "Branch Manager", value: "ROLE_BRANCH_MANAGER" },
    { id: 3, label: "Senior KYB Officer", value: "ROLE_SENIOR_KYB_OFFICER" },
    { id: 4, label: "KYB Officer", value: "ROLE_KYB_OFFICER" },
  ];

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceValue(searchQuery);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);

  const fetchBranchWithStaff = async (page = 0) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v3/branch/branch-staff`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          size: pageSize,
          query: debounceValue,
          role: filterByRole,
        },
      });
      if (!res?.data?.status) {
        toast({
          title: "Error",
          description:
            res?.data?.message || "Failed to load branches with staff",
          variant: "destructive",
        });
      }
      setBranches(res?.data?.data?.content || []);
      setTotalPages(res?.data?.data?.totalPages || 0);
      setCurrentPage(res?.data?.data?.page || 0);
      setTotalElements(res?.data?.data?.totalElements || 0);
      setDashboardStats({
        totalBranches: res?.data?.data?.dashboardStats?.totalBranches || 0,
        activeBranches: res?.data?.data?.dashboardStats?.activeBranches || 0,
        totalStaffs: res?.data?.data?.dashboardStats?.totalStaffs || 0,
        activeMembers: res?.data?.data?.dashboardStats?.activeMembers || 0,
      });
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
    if (token) fetchBranchWithStaff(currentPage);
  }, [token, currentPage, debounceValue, filterByRole]);

  const handleSubmit = async () => {
    setResendInvitationLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v3/admin/staff/${staffEmail}/resend-invitation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        setShowConfirmation(false);
        setStaffEmail(null);
        toast({
          title: "Success",
          description: res?.data?.message,
        });
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          err?.response?.data?.message ||
          "Something went wrong while resend email",
      });
    } finally {
      setResendInvitationLoading(false);
    }
  };

  const createStaff = async () => {
    if (!validateAllStaff()) {
      return;
    }

    try {
      setLoading(true);
      let permissionIds = newStaffPermissionIds.map(Number);
      if (
        dashboardPermissionId &&
        !permissionIds.includes(Number(dashboardPermissionId))
      ) {
        permissionIds.push(Number(dashboardPermissionId));
      }

      const response = await axios.post(
        `${BASE_URL}/api/v3/admin/staff/create`,
        {
          fullName: staffForm.fullName,
          email: staffForm.email,
          contactNumber: staffForm.contactNumber,
          branchId: Number(staffForm.branchId),
          roleId: Number(staffForm.roleId),
          permissionIds,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response?.data?.status) {
        toast({
          title: "Success",
          description:
            response?.data?.message || "Staff member created successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.data?.message || "Failed to create staff member",
          variant: "destructive",
        });
      }

      setIsCreateModalOpen(false);
      setStaffForm({
        fullName: "",
        email: "",
        contactNumber: "",
        branchId: "",
        roleId: "",
      });
      setNewStaffPermissionIds([]);
      setStaffErrors({});
      setCurrentPage(0);
      fetchBranchWithStaff(0);
    } catch (error: any) {
      console.error("Create Staff Error:", error?.response?.data || error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // EditStaff sends permissionIds inside the main request
  const EditStaff = async () => {
    if (!validateAllStaff()) {
      return;
    }

    try {
      setLoading(true);
      let permissionIds = editStaffPermissionIds.map(Number);
      if (
        dashboardPermissionId &&
        !permissionIds.includes(Number(dashboardPermissionId))
      ) {
        permissionIds.push(Number(dashboardPermissionId));
      }

      const response = await axios.put(
        `${BASE_URL}/api/v3/admin/staff/${staffUUID}/edit`,
        {
          fullName: staffForm.fullName,
          email: staffForm.email,
          contactNumber: staffForm.contactNumber,
          branchId: Number(staffForm.branchId),
          roleId: Number(staffForm.roleId),
          permissionIds,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response?.data?.status) {
        toast({
          title: "Success",
          description:
            response?.data?.message || "Staff member updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.data?.message || "Failed to edit staff",
          variant: "destructive",
        });
      }

      setIsEditStaffModalOpen(false);
      setStaffUUID("");
      setStaffForm({
        fullName: "",
        email: "",
        contactNumber: "",
        branchId: "",
        roleId: "",
      });
      setEditStaffPermissionIds([]);
      setStaffErrors({});
      setCurrentPage(0);
      fetchBranchWithStaff(0);
    } catch (error: any) {
      console.error("Update Staff Error:", error?.response?.data || error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    if (!cookies.token) return;
    try {
      setBranchLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
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
    if (isCreateModalOpen || (isEditStaffModalOpen && cookies.token)) {
      fetchBranches();
    }
  }, [isCreateModalOpen, cookies.token, isEditStaffModalOpen]);

  // ---------- Permission helper functions ----------
  const filterOutDashboard = (
    nodes: any[],
  ): { filtered: any[]; dashboardId: string | null } => {
    let dashboardId: string | null = null;
    const filterNodes = (items: any[]): any[] => {
      return items.reduce((acc, node) => {
        if (node.code === DASHBOARD_PERMISSION_CODE) {
          dashboardId = String(node.id);
          return acc;
        }
        const newNode = { ...node };
        if (node.children?.length) {
          newNode.children = filterNodes(node.children);
        }
        acc.push(newNode);
        return acc;
      }, []);
    };
    const filtered = filterNodes(nodes);
    return { filtered, dashboardId };
  };

  const fetchAllPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const res = await axios.get(
        `${BASE_URL}/api/v3/permissions/all?portalType=STAFF`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const treeData = res.data?.data || [];
      const { filtered: treeDataFiltered, dashboardId } =
        filterOutDashboard(treeData);
      setPermissionTree(treeDataFiltered);
      setViewingPermissionsTree(treeDataFiltered);
      setDashboardPermissionId(dashboardId);

      const buildParentMap = (
        nodes: any[],
        parentId: string | null = null,
      ): Record<string, string | null> => {
        let map: Record<string, string | null> = {};
        nodes.forEach((node) => {
          map[String(node.id)] = parentId ? String(parentId) : null;
          if (node.children?.length) {
            map = { ...map, ...buildParentMap(node.children, node.id) };
          }
        });
        return map;
      };
      const parentMapData = buildParentMap(treeData);
      setParentMap(parentMapData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoadingPermissions(false);
    }
  };

  const fetchStaffPermissions = async (
    staffUuid: string,
  ): Promise<string[]> => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/staff/${staffUuid}/permissions`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const perms = res.data?.data || [];
      return perms.map((p: any) => String(p.id || p));
    } catch (error) {
      console.error("Failed to fetch staff permissions", error);
      return [];
    }
  };

  const handleToggleNode = (nodeId: string) => {
    setRawSelectedIds((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId],
    );
  };

  const computeEffectiveIds = (
    rawIds: string[],
    parentMap: Record<string, string | null>,
  ) => {
    const effective = new Set(rawIds);
    rawIds.forEach((id) => {
      let parentId = parentMap[id];
      while (parentId) {
        effective.add(parentId);
        parentId = parentMap[parentId];
      }
    });
    return Array.from(effective);
  };

  const effectiveSelectedIds = useMemo(
    () => computeEffectiveIds(rawSelectedIds, parentMap),
    [rawSelectedIds, parentMap],
  );

  const getAllPermissionIds = (perms: any[]): string[] => {
    let ids: string[] = [];
    perms.forEach((perm) => {
      ids.push(String(perm.id));
      if (perm.children?.length) {
        ids.push(...getAllPermissionIds(perm.children));
      }
    });
    return ids;
  };

  // Collects this node's id + every descendant id
  const getNodeAndDescendantIds = (node: any): string[] => {
    const ids = [String(node.id)];
    if (node.children?.length) {
      node.children.forEach((child: any) => {
        ids.push(...getNodeAndDescendantIds(child));
      });
    }
    return ids;
  };

  // True if every id in this node's subtree is selected
  // const isNodeFullySelected = (node: any, selectedIds: string[]): boolean => {
  //   const ids = getNodeAndDescendantIds(node);
  //   return ids.every((id) => selectedIds.includes(id));
  // };

  // const isNodePartiallySelected = (
  //   node: any,
  //   selectedIds: string[],
  // ): boolean => {
  //   const ids = getNodeAndDescendantIds(node);
  //   const selectedCount = ids.filter((id) => selectedIds.includes(id)).length;
  //   return selectedCount > 0 && selectedCount < ids.length;
  // };

  // const handleToggleNode = (node: any) => {
  //   setRawSelectedIds((prev) => {
  //     const idsInSubtree = getNodeAndDescendantIds(node);
  //     const isCurrentlyFullySelected = idsInSubtree.every((id) =>
  //       prev.includes(id),
  //     );

  //     if (isCurrentlyFullySelected) {
  //       // Was fully selected -> deselect node + all children
  //       return prev.filter((id) => !idsInSubtree.includes(id));
  //     } else {
  //       // Was not fully selected -> select node + all children
  //       return Array.from(new Set([...prev, ...idsInSubtree]));
  //     }
  //   });
  // };

  // const renderPermissionNode = (
  //   node: any,
  //   level: number,
  //   effectiveSelectedIds: string[],
  //   onToggle: (node: any) => void,
  //   isReadOnly: boolean = false,
  // ) => {
  //   const nodeId = String(node.id);
  //   const hasChildren = node.children?.length > 0;

  //   const isChecked = hasChildren
  //     ? isNodeFullySelected(node, effectiveSelectedIds)
  //     : effectiveSelectedIds.includes(nodeId);

  //   const isIndeterminate = hasChildren
  //     ? isNodePartiallySelected(node, effectiveSelectedIds)
  //     : false;

  //   return (
  //     <div key={nodeId} className="flex flex-col">
  //       <div
  //         style={{ marginLeft: `${level * 20}px` }}
  //         className="flex items-start space-x-2"
  //       >
  //         <input
  //           ref={(el) => {
  //             if (el) el.indeterminate = isIndeterminate;
  //           }}
  //           disabled={isEditStaffModalOpen && node?.name == "Dashboard"}
  //           type="checkbox"
  //           id={`perm-${nodeId}`}
  //           checked={isChecked}
  //           onChange={() => !isReadOnly && onToggle(node)}
  //           className="mt-1 h-4 w-4 accent-primary disabled:opacity-60"
  //         />
  //         <Label
  //           htmlFor={`perm-${nodeId}`}
  //           className={`text-lg ${isReadOnly ? "text-muted-foreground" : ""}`}
  //         >
  //           {node.name}
  //         </Label>
  //       </div>
  //       {hasChildren && (
  //         <div className="ml-4">
  //           {node.children.map((child: any) =>
  //             renderPermissionNode(
  //               child,
  //               level + 1,
  //               effectiveSelectedIds,
  //               onToggle,
  //               isReadOnly,
  //             ),
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderPermissionNode = (
    node: any,
    level: number,
    effectiveSelectedIds: string[],
    onToggle: (id: string) => void,
    isReadOnly: boolean = false,
  ) => {
    const nodeId = String(node.id);
    const hasChildren = node.children?.length > 0;
    const isChecked = effectiveSelectedIds.includes(nodeId);
    return (
      <div key={nodeId} className="flex flex-col">
        <div
          style={{ marginLeft: `${level * 20}px` }}
          className="flex items-start space-x-2"
        >
          <input
            disabled={isEditStaffModalOpen && node?.name == "Dashboard"}
            type="checkbox"
            id={`perm-${nodeId}`}
            checked={isChecked}
            onChange={() => !isReadOnly && onToggle(nodeId)}
            className="mt-1 h-4 w-4 accent-primary disabled:opacity-60"
          />
          <Label
            htmlFor={`perm-${nodeId}`}
            className={`text-lg ${isReadOnly ? "text-muted-foreground" : ""}`}
          >
            {node.name}
          </Label>
        </div>
        {hasChildren && (
          <div className="ml-4">
            {node.children.map((child: any) =>
              renderPermissionNode(
                child,
                level + 1,
                effectiveSelectedIds,
                onToggle,
                isReadOnly,
              ),
            )}
          </div>
        )}
      </div>
    );
  };

  // Open read-only permissions dialog with tree view (disabled checkboxes)
  const openViewPermissionsModal = async (staff: any) => {
    setViewingStaffPermissions(staff);
    setLoadingViewTree(true);
    // Load the permission tree (this sets permissionTree and dashboardPermissionId)
    await fetchAllPermissions();
    // Use the permissions directly from the staff object (already in the response)
    const perms = staff.permissions?.map((id: number) => String(id)) || [];
    setViewingAssignedIds(perms);
    // setViewingPermissionsTree(permissionTree);
    setLoadingViewTree(false);
    setIsViewPermissionsModalOpen(true);
  };

  // Open editable permission selection modal (for edit)
  const openEditPermissionsModal = async () => {
    await fetchAllPermissions();
    setRawSelectedIds(editStaffPermissionIds);
    setPermissionSelectionTarget("edit");
    setIsPermissionSelectionModalOpen(true);
  };
  // ---------- End permission helpers ----------

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

  const getRoleColor = (role: string) => {
    const colors = {
      "Branch Manager": "bg-purple-100 text-purple-800",
      "Senior KYB Officer": "bg-blue-100 text-blue-800",
      "KYB Officer": "bg-green-100 text-green-800",
      "Compliance Officer": "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalStaff = branches.reduce(
    (acc, branch) => acc + (branch.staff?.length || 0),
    0,
  );
  const activeStaff = branches.reduce(
    (acc, branch) =>
      acc + (branch.staff?.filter((s: any) => s.active)?.length || 0),
    0,
  );
  // const totalBranches = branches.length;
  const individualStaffData = editableStaffData?.staff?.find(
    (staff: any) => staff?.uuid == staffUUID,
  );

  // Pre-fill form fields and permissions when editing (using staff.permissions)
  useEffect(() => {
    if (isEditStaffModalOpen && individualStaffData) {
      setStaffForm({
        fullName: individualStaffData?.fullName ?? "",
        email: individualStaffData?.email ?? "",
        contactNumber: individualStaffData?.contactNumber ?? "",
        branchId: String(editableStaffData?.branchId) ?? "",
        roleId: String(individualStaffData?.roleId) ?? "",
      });
      const perms =
        individualStaffData.permissions?.map((id: number) => String(id)) || [];
      setEditStaffPermissionIds(perms);
    }
  }, [isEditStaffModalOpen, individualStaffData]);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        {/* <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground">
              Manage branch staff and workload distribution
            </p>
          </div>
          <div className="flex space-x-3">
            <PermissionGate permission="BTN_CREATE_STAFF">
              <Button
                variant="business"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </PermissionGate>
          </div>
        </div> */}
        <div className="flex  justify-end">
          <div className="flex space-x-3">
            <PermissionGate permission="BTN_CREATE_STAFF">
              <Button
                variant="business"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </PermissionGate>
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
              <div className="text-2xl font-bold">
                {dashboardStats?.totalStaffs}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {dashboardStats?.totalBranches} branches
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
                {dashboardStats?.activeMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats?.totalStaffs > 0
                  ? `${Math.round((dashboardStats?.activeMembers / dashboardStats?.totalStaffs) * 100)}% availability`
                  : "No staff"}
              </p>
            </CardContent>
          </Card>
          {/* <Card className="shadow-card">
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
          </Card> */}
        </div>

        {/* ----------------- Create Staff Modal ----------------- */}
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            setIsCreateModalOpen(open);
            if (!open) {
              setStaffForm({
                fullName: "",
                email: "",
                contactNumber: "",
                branchId: "",
                roleId: "",
              });
              setStaffErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Staff Member</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pl-2">
              <div className="grid grid-cols-1 gap-4 py-4">
                <div>
                  <Label>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={staffForm.fullName}
                    onChange={(e) => {
                      setStaffForm({
                        ...staffForm,
                        fullName: e.target.value,
                      });
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            branchLoading
                              ? "Loading branches..."
                              : "Select Branch"
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
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                      country={"ae"}
                      value={staffForm.contactNumber}
                      onChange={(value) => {
                        setStaffForm({ ...staffForm, contactNumber: value });
                        clearStaffError("contactNumber");
                      }}
                      inputProps={{ name: "phone", id: "phone" }}
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
                <div className="flex flex-col items-start">
                  <Label className="text-lg pr-4 mt-2">
                    Permissions <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    onClick={async () => {
                      await fetchAllPermissions();
                      setRawSelectedIds(newStaffPermissionIds);
                      setPermissionSelectionTarget("create");
                      setIsPermissionSelectionModalOpen(true);
                    }}
                  >
                    Choose Permission
                  </Button>
                  {newStaffPermissionIds.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {newStaffPermissionIds.length} permission(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setStaffForm({
                    fullName: "",
                    email: "",
                    contactNumber: "",
                    branchId: "",
                    roleId: "",
                  });
                  setIsCreateModalOpen(false);
                  setStaffErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={createStaff}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Staff"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ----------------- Edit Staff Modal (with editable permissions) ----------------- */}
        <Dialog
          open={isEditStaffModalOpen}
          onOpenChange={(open) => {
            setIsEditStaffModalOpen(open);
            if (!open) {
              setEditableStaffData({});
              setStaffUUID("");
              if (!open) {
                setStaffForm({
                  fullName: "",
                  email: "",
                  contactNumber: "",
                  branchId: "",
                  roleId: "",
                });
                setStaffErrors({});
              }
              setStaffErrors({});
              setEditStaffPermissionIds([]);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pl-2">
              <div className="grid grid-cols-1 gap-4 py-4">
                <div>
                  <Label>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={staffForm.fullName}
                    onChange={(e) => {
                      setStaffForm({
                        ...staffForm,
                        fullName: e.target.value,
                      });
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
                    disabled={!!staffUUID}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            branchLoading
                              ? "Loading branches..."
                              : "Select Branch"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {branchList.map((branch) => (
                          <SelectItem
                            key={branch?.branchId}
                            value={String(branch?.branchId)}
                          >
                            {branch?.name}
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
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                      country={"ae"}
                      value={staffForm.contactNumber}
                      onChange={(value) => {
                        setStaffForm({ ...staffForm, contactNumber: value });
                        clearStaffError("contactNumber");
                      }}
                      inputProps={{ name: "phone", id: "phone" }}
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
                <div className="flex flex-col items-start">
                  <Label className="text-lg pr-4 mt-2">
                    Permissions <span className="text-red-500">*</span>
                  </Label>
                  <Button onClick={openEditPermissionsModal}>
                    Choose Permission
                  </Button>
                  {editStaffPermissionIds.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {editStaffPermissionIds.length} permission(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditStaffModalOpen(false);
                  setStaffForm({
                    fullName: "",
                    email: "",
                    contactNumber: "",
                    branchId: "",
                    roleId: "",
                  });
                  setEditableStaffData({});
                  setStaffUUID("");
                  setStaffErrors({});
                }}
              >
                Cancel
              </Button>
              <Button variant="business" onClick={EditStaff} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ----------------- Permission Selection Modal (shared, editable) ----------------- */}
        {/* <Dialog
          open={isPermissionSelectionModalOpen}
          onOpenChange={(open) => {
            if (!open) setIsPermissionSelectionModalOpen(false);
          }}
        >
          <DialogContent className="sm:max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Select Permissions
              </DialogTitle>
            </DialogHeader>
            <div className="py-1 max-h-96 overflow-y-auto">
              {loadingPermissions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setRawSelectedIds(getAllPermissionIds(permissionTree))
                      }
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawSelectedIds([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {permissionTree.map((node) =>
                      renderPermissionNode(
                        node,
                        0,
                        effectiveSelectedIds,
                        handleToggleNode,
                        false,
                      ),
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mt-4">
                    {rawSelectedIds.length} menu(s) selected
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPermissionSelectionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={() => {
                  const selected = effectiveSelectedIds as string[];
                  if (permissionSelectionTarget === "create") {
                    setNewStaffPermissionIds(selected);
                  } else {
                    setEditStaffPermissionIds(selected);
                  }
                  setIsPermissionSelectionModalOpen(false);
                }}
              >
                Save Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <Dialog
          open={isPermissionSelectionModalOpen}
          onOpenChange={(open) => {
            if (!open) setIsPermissionSelectionModalOpen(false);
          }}
        >
          <DialogContent className="sm:max-w-2xl bg-white p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-xl font-bold">
                Select Permissions
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Choose which menus this staff member can access.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 pt-4 pb-2">
              {loadingPermissions ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Bulk actions + live count */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRawSelectedIds(getAllPermissionIds(permissionTree))
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRawSelectedIds([])}
                      >
                        Clear all
                      </Button>
                    </div>
                    <Badge variant="secondary" className="font-normal">
                      {rawSelectedIds.length} selected
                    </Badge>
                  </div>

                  {/* Tree list */}
                  <div className="max-h-96 overflow-y-auto rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-2">
                      {permissionTree.map((node) =>
                        renderPermissionNode(
                          node,
                          0,
                          effectiveSelectedIds,
                          handleToggleNode,
                          false,
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="px-6 py-4 mt-2 border-t bg-muted/20">
              <Button
                variant="outline"
                onClick={() => setIsPermissionSelectionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={() => {
                  const selected = effectiveSelectedIds as string[];
                  if (permissionSelectionTarget === "create") {
                    setNewStaffPermissionIds(selected);
                  } else {
                    setEditStaffPermissionIds(selected);
                  }
                  setIsPermissionSelectionModalOpen(false);
                }}
              >
                Save selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ----------------- Read-only Permissions Dialog (tree view, disabled checkboxes) ----------------- */}
        <Dialog
          open={isViewPermissionsModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsViewPermissionsModalOpen(false);
              setViewingStaffPermissions(null);
              setViewingPermissionsTree([]);
              setViewingAssignedIds([]);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Permissions – {viewingStaffPermissions?.fullName}
              </DialogTitle>
            </DialogHeader>
            <div className="py-1 max-h-96 overflow-y-auto">
              {loadingViewTree ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : viewingPermissionsTree.length === 0 ? (
                <div>
                  <p className="text-muted-foreground text-center mb-2">
                    No permission tree available.
                  </p>
                  {viewingAssignedIds.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Assigned permission IDs:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {viewingAssignedIds.map((id) => (
                          <Badge key={id} variant="outline">
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {viewingPermissionsTree.map((node) =>
                      renderPermissionNode(
                        node,
                        0,
                        viewingAssignedIds,
                        () => {},
                        true,
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewPermissionsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 item-center flex-wrap">
              <div className="flex-1">
                <Label htmlFor="search">Search Staff</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, role, or branch..."
                    className="pl-9"
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(0);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterByRole("");
                    setCurrentPage(0);
                  }}
                >
                  All Staff
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterByRole("BRANCH_MANAGER");
                    setCurrentPage(0);
                  }}
                >
                  Branch Managers
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterByRole("KYB_OFFICER");
                    setCurrentPage(0);
                  }}
                >
                  KYB Officers
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterByRole("SENIOR_KYB_OFFICER");
                    setCurrentPage(0);
                  }}
                >
                  Senior KYB Officer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
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
            {branches?.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No branches found</h3>
                <p className="text-muted-foreground">
                  Create your first branch to get started
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-2">
                  <PaginationSummary
                    totalElements={totalElements}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    itemCount={branches?.length}
                    itemLabel="Staff Member"
                  />
                </div>

                <div>
                  {branches?.map((branch) => {
                    const mapStatus = (apiStatus: string) => {
                      const statusMap: Record<string, string> = {
                        ACTIVE: "active",
                        INACTIVE: "inactive",
                        PENDING: "training",
                      };
                      return statusMap[apiStatus] || "inactive";
                    };
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
                                      <div className="flex items-start justify-between flex-wrap gap-2">
                                        <div className="space-y-4 flex-1">
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
                                                  <StatusIcon className="h-3 w-3" />{" "}
                                                  {status.label}
                                                </Badge>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(getRoleLabel(staff.roleName))}`}
                                                >
                                                  {getRoleLabel(staff.roleName)}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                  ID: {staff.uuid?.slice(0, 8)}
                                                  ...
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                                            <div className="space-y-1">
                                              <div className="flex items-center text-muted-foreground">
                                                <Mail className="h-3 w-3 mr-1" />{" "}
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
                                                <Shield className="h-3 w-3 mr-1" />{" "}
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
                                                <Phone className="h-3 w-3 mr-1" />{" "}
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
                                        <div className="flex flex-col space-y-2 ml-4">
                                          {staff?.canResendInvitation && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setShowConfirmation(true);
                                                setStaffEmail(staff?.email);
                                              }}
                                            >
                                              Resend Onboard Email
                                            </Button>
                                          )}

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setIsEditStaffModalOpen(true);
                                              setEditableStaffData(branch);
                                              setStaffUUID(staff?.uuid);
                                            }}
                                          >
                                            <Edit className="h-4 w-4 mr-1" />{" "}
                                            Edit Details
                                          </Button>
                                          {/* Read-only permissions button with tree view */}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              openViewPermissionsModal(staff)
                                            }
                                          >
                                            <Shield className="h-4 w-4 mr-1" />{" "}
                                            View Permissions
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
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Pagination */}
      {!loading && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      <ConfirmationDialog
        isConfirming={resendInvitationloading}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleSubmit}
        title="Confirm Resend Email"
        description={`Are you sure you want to resend this email?`}
        confirmText="Submit Request"
      />
    </>
  );
};

export default ExchangeStaffManagement;
