import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserCreationForm from "@/components/governance/UserCreationForm";
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
  Settings
} from "lucide-react";

const AdminUserManagement = () => {
  const businessUsers = [
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.ae",
      role: "Transaction Manager",
      department: "Finance",
      status: "active",
      transactionLimit: "50000",
      currency: "USD",
      lastLogin: "2024-01-16 14:30",
      joinDate: "2023-08-15",
      permissions: ["create_transactions", "manage_beneficiaries", "view_reports"],
      approvalLimit: "25000",
      canApprove: false
    },
    {
      id: "USR-002", 
      name: "Michael Chen",
      email: "m.chen@techcorp.ae",
      role: "Senior Approver",
      department: "Treasury",
      status: "active", 
      transactionLimit: "100000",
      currency: "USD",
      lastLogin: "2024-01-16 09:15",
      joinDate: "2023-03-22",
      permissions: ["approve_transactions", "manage_limits", "create_transactions", "view_reports"]
    },
    {
      id: "USR-003",
      name: "Emma Wilson",
      email: "emma.w@techcorp.ae", 
      role: "Finance Clerk",
      department: "Finance",
      status: "inactive",
      transactionLimit: "25000",
      currency: "USD",
      lastLogin: "2024-01-12 16:45",
      joinDate: "2023-11-10",
      permissions: ["create_transactions", "view_reports"],
      approvalLimit: "10000",
      canApprove: false
    },
    {
      id: "USR-004",
      name: "Ahmad Al-Rashid", 
      email: "ahmad.r@techcorp.ae",
      role: "Operations Manager",
      department: "Operations", 
      status: "pending",
      transactionLimit: "75000",
      currency: "USD",
      lastLogin: "Never",
      joinDate: "2024-01-15",
      permissions: ["create_transactions", "manage_beneficiaries", "approve_transactions"],
      approvalLimit: "75000",
      canApprove: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "default" as const, label: "Active", icon: UserCheck },
      inactive: { variant: "secondary" as const, label: "Inactive", icon: UserX },
      pending: { variant: "destructive" as const, label: "Pending", icon: UserCheck }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Transaction Manager": "bg-blue-100 text-blue-800",
      "Senior Approver": "bg-purple-100 text-purple-800", 
      "Finance Clerk": "bg-green-100 text-green-800",
      "Operations Manager": "bg-orange-100 text-orange-800"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management & Governance</h1>
            <p className="text-muted-foreground">Manage business users, roles, permissions, and approval hierarchies</p>
          </div>
          <UserCreationForm />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <UserCheck className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">20</div>
              <p className="text-xs text-muted-foreground">83% active rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
              <UserX className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-xs text-muted-foreground">Awaiting activation</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approvers</CardTitle>
              <Key className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {businessUsers.filter(user => user.canApprove).length}
              </div>
              <p className="text-xs text-muted-foreground">With approval authority</p>
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
              {businessUsers.map((user) => {
                const status = getStatusBadge(user.status);
                const StatusIcon = status.icon;
                
                return (
                  <Card key={user.id} className="hover:shadow-md transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          {/* User Header */}
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={status.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
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
                              <span className="text-muted-foreground">Transaction Limit:</span>
                              <p className="font-medium">{user.currency} {Number(user.transactionLimit).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Approval Limit:</span>
                              <p className="font-medium">{user.currency} {Number(user.approvalLimit).toLocaleString()}</p>
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
                              <span className="text-sm text-muted-foreground mb-2 block">Permissions:</span>
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.map((permission, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {user.canApprove && (
                              <div className="flex items-center space-x-2 p-2 bg-accent-muted/20 rounded-lg">
                                <Key className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-accent">Approval Authority</span>
                                <Badge variant="outline" className="text-xs">
                                  Up to {user.currency} {Number(user.approvalLimit).toLocaleString()}
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
                Showing 4 of 24 users
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
    </AdminLayout>
  );
};

export default AdminUserManagement;