import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
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
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
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

  // const createStaff = async () => {
  //   try {
  //     await axios.post(
  //       `${BASE_URL}/api/v3/admin/staff/create`,
  //       {
  //         fullName: staffForm.fullName,
  //         email: staffForm.email,
  //         contactNumber: staffForm.contactNumber,
  //         branchId: Number(staffForm.branchId),
  //         roleId: Number(staffForm.roleId),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Staff Create API Response:", response.data);

  //     toast({
  //       title: "Success",
  //       description: "Staff member created successfully",
  //     });

  //     setIsCreateModalOpen(false);
  //     setStaffForm({
  //       fullName: "",
  //       email: "",
  //       contactNumber: "",
  //       branchId: "",
  //       roleId: "",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error?.response?.data?.message || "Failed to create staff",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const createStaff = async () => {
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
        }
      );

      // ✅ Now response EXISTS
      console.log("Staff Create API Response:", response.data);

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
    try {
      setBranchLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBranchList(res.data?.data || []);
    } catch (error) {
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
    if (isCreateModalOpen) {
      fetchBranches();
    }
  }, [isCreateModalOpen]);

  const branches = [
    {
      id: "BR-001",
      name: "Dubai Mall Branch",
      location: "Dubai Mall, Downtown Dubai",
      manager: "Ahmed Hassan",
      staff: [
        {
          id: "ST-001",
          name: "Ahmed Hassan",
          role: "Branch Manager",
          email: "ahmed.hassan@bizpayaxis.ae",
          phone: "+971 50 123 4567",
          status: "active",
          kybAssigned: 4,
          kybCompleted: 18,
          efficiency: 95,
          joinDate: "2023-01-15",
        },
        {
          id: "ST-002",
          name: "Priya Sharma",
          role: "KYB Officer",
          email: "priya.sharma@bizpayaxis.ae",
          phone: "+971 55 234 5678",
          status: "active",
          kybAssigned: 6,
          kybCompleted: 22,
          efficiency: 92,
          joinDate: "2023-03-20",
        },
      ],
    },
    {
      id: "BR-002",
      name: "Abu Dhabi ADGM Branch",
      location: "ADGM Square, Abu Dhabi",
      manager: "Fatima Al-Zahra",
      staff: [
        {
          id: "ST-003",
          name: "Fatima Al-Zahra",
          role: "Branch Manager",
          email: "fatima.alzahra@bizpayaxis.ae",
          phone: "+971 50 345 6789",
          status: "active",
          kybAssigned: 7,
          kybCompleted: 25,
          efficiency: 89,
          joinDate: "2022-11-10",
        },
        {
          id: "ST-004",
          name: "Omar Abdullah",
          role: "Senior KYB Officer",
          email: "omar.abdullah@bizpayaxis.ae",
          phone: "+971 55 456 7890",
          status: "active",
          kybAssigned: 5,
          kybCompleted: 15,
          efficiency: 88,
          joinDate: "2023-05-08",
        },
      ],
    },
    {
      id: "BR-003",
      name: "Sharjah City Centre Branch",
      location: "City Centre Sharjah",
      manager: "Raj Patel",
      staff: [
        {
          id: "ST-005",
          name: "Raj Patel",
          role: "Branch Manager",
          email: "raj.patel@bizpayaxis.ae",
          phone: "+971 50 567 8901",
          status: "active",
          kybAssigned: 2,
          kybCompleted: 12,
          efficiency: 96,
          joinDate: "2023-07-12",
        },
      ],
    },
  ];

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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Across 15 branches
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
              <div className="text-2xl font-bold text-success">22</div>
              <p className="text-xs text-muted-foreground">92% availability</p>
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
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">
                +3% from last month
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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Distributed across teams
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
                <Label>Full Name</Label>
                <Input
                  value={staffForm.fullName}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, fullName: e.target.value })
                  }
                  placeholder="full name"
                />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, email: e.target.value })
                  }
                  placeholder="example@gmail.com"
                />
              </div>

              <div>
                <Label>Contact Number</Label>
                <Input
                  value={staffForm.contactNumber}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      contactNumber: e.target.value,
                    })
                  }
                  placeholder="9800000002"
                />
              </div>

              {/* <div>
                <Label>Select Branch</Label>
                <Input
                  value={staffForm.branchId}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, branchId: e.target.value })
                  }
                  placeholder="3"
                />
              </div> */}

              <div>
                <Label>Select Branch</Label>

                <Select
                  value={staffForm.branchId}
                  onValueChange={(value) =>
                    setStaffForm({ ...staffForm, branchId: value })
                  }
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
              </div>

              <div>
                <Label>Staff Role</Label>
                <Select
                  value={staffForm.roleId}
                  onValueChange={(value) =>
                    setStaffForm({ ...staffForm, roleId: value })
                  }
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
                <Label htmlFor="search">Search Staff</Label>
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
        <div className="space-y-8">
          {branches.map((branch) => (
            <Card key={branch.id} className="shadow-card">
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
                      <p className="text-sm text-muted-foreground">
                        {branch.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {branch.staff.length} Staff Members
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branch.staff.map((staff) => {
                    const status = getStatusBadge(staff.status);
                    const StatusIcon = status.icon;

                    return (
                      <Card
                        key={staff.id}
                        className="border-l-4 border-l-accent hover:shadow-md transition-smooth"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-4 flex-1">
                              {/* Staff Header */}
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-primary-foreground font-semibold">
                                    {staff.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold text-foreground">
                                      {staff.name}
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
                                        staff.role
                                      )}`}
                                    >
                                      {staff.role}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ID: {staff.id}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Staff Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                                <div className="space-y-1">
                                  <div className="flex items-center text-muted-foreground">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Contact:
                                  </div>
                                  <p className="font-medium">{staff.email}</p>
                                  <p className="text-xs">{staff.phone}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Join Date:
                                  </div>
                                  <p className="font-medium">
                                    {staff.joinDate}
                                  </p>
                                  <p className="text-xs">
                                    {Math.round(
                                      (new Date().getTime() -
                                        new Date(staff.joinDate).getTime()) /
                                        (1000 * 60 * 60 * 24 * 30)
                                    )}{" "}
                                    months
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-muted-foreground">
                                    KYB Workload:
                                  </span>
                                  <p className="font-medium">
                                    {staff.kybAssigned} assigned
                                  </p>
                                  <p className="text-xs">
                                    {staff.kybCompleted} completed total
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-muted-foreground">
                                    Efficiency:
                                  </span>
                                  <p
                                    className={`font-medium ${getEfficiencyColor(
                                      staff.efficiency
                                    )}`}
                                  >
                                    {staff.efficiency}%
                                  </p>
                                  <div className="w-full bg-muted rounded-full h-1">
                                    <div
                                      className="bg-primary h-1 rounded-full transition-all"
                                      style={{ width: `${staff.efficiency}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Performance Metrics */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-success/10 rounded-lg">
                                  <p className="font-semibold text-success text-lg">
                                    {staff.kybCompleted}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Total KYB Completed
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-warning/10 rounded-lg">
                                  <p className="font-semibold text-warning text-lg">
                                    {staff.kybAssigned}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Currently Assigned
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-primary/10 rounded-lg">
                                  <p
                                    className={`font-semibold text-lg ${getEfficiencyColor(
                                      staff.efficiency
                                    )}`}
                                  >
                                    {staff.efficiency}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Efficiency Score
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeStaffManagement;
