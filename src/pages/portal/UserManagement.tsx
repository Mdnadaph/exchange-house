import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserCreationForm from "@/components/governance/UserCreationForm";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  Key,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [dashboard, setDashboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/business-users?page=${currentPage}&size=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const json = await response.json();
        if (json.status) {
          setDashboard(json.data.dashboard);
          setUsers(json.data.users);
          setPagination(json.data.pagination);
        }
      } catch (error) {
        toast({
          title: "Failed to Counter Proposal Declined",
          description: error?.message || "Please try again",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [currentPage, token]);

  const totalUsers = dashboard.find((d) => d.key === "TOTAL_USERS") || {
    value: 0,
    subValue: "",
  };
  const activeUsers = dashboard.find((d) => d.key === "ACTIVE_USERS") || {
    value: 0,
    subValue: "",
  };
  const pendingApproval = dashboard.find(
    (d) => d.key === "PENDING_APPROVAL",
  ) || { value: 0, subValue: "" };
  const approvers = dashboard.find((d) => d.key === "APPROVERS") || {
    value: 0,
    subValue: "",
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "default" as const, label: "Active", icon: UserCheck },
      inactive: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: UserX,
      },
      pending: {
        variant: "destructive" as const,
        label: "Pending",
        icon: UserCheck,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Transaction Manager": "bg-blue-100 text-blue-800",
      "Senior Approver": "bg-purple-100 text-purple-800",
      "Finance Clerk": "bg-green-100 text-green-800",
      "Operations Manager": "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management & Governance
            </h1>
            <p className="text-muted-foreground">
              Manage business users, roles, permissions, and approval
              hierarchies
            </p>
          </div>
          <UserCreationForm />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.value}</div>
              <p className="text-xs text-muted-foreground">
                {totalUsers.subValue}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
              <UserCheck className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {activeUsers.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeUsers.subValue}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <UserX className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {pendingApproval.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingApproval.subValue}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approvers
              </CardTitle>
              <Key className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {approvers.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {approvers.subValue}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or role..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">Active Only</Button>
                <Button variant="outline">Finance Dept</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Business Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => {
                const status = getStatusBadge(user.status);
                const StatusIcon = status.icon;

                return (
                  <Card
                    key={user.id}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          {/* User Header */}
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold">
                                {user.fullName
                                  ? user.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : ""}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                {user.fullName || "N/A"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                ID: {user.id}
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
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                              >
                                {user.role}
                              </span>
                            </div>
                          </div>

                          {/* User Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                Email:
                              </div>
                              <p className="font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Shield className="h-3 w-3 mr-1" />
                                Department:
                              </div>
                              <p className="font-medium">{user.department}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Transaction Limit:
                              </span>
                              <p className="font-medium">
                                {user.currency}{" "}
                                {Number(user.transactionLimit).toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">
                                Approval Limit:
                              </span>
                              <p className="font-medium">
                                {user.currency}{" "}
                                {Number(user.approvalLimit).toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                Last Login:
                              </div>
                              <p className="font-medium">{user.lastLogin}</p>
                            </div>
                          </div>

                          {/* Permissions and Approval Authority */}
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-muted-foreground mb-2 block">
                                Permissions:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.map((permission, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {permission
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {user.canApprove && (
                              <div className="flex items-center space-x-2 p-2 bg-accent-muted/20 rounded-lg">
                                <Key className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-accent">
                                  Approval Authority
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Up to {user.currency}{" "}
                                  {Number(user.approvalLimit).toLocaleString()}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
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
                Showing {users.length} of {pagination.totalItems} users
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pagination.totalPages - 1}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
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

export default UserManagement;
