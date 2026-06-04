import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import dayjs from "@/utils/dayjs";
import {
  Users,
  Building,
  FileCheck,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import axios from "axios";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [exchangeAdmins, setExchangeAdmins] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalExchangeAdmin: 0,
    pendingApproval: 0,
    activeBusinesses: 0,
    totalBranch: 0,
  });
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [recentActivities, setRecentActivities] = useState([]);
  const { t, isRTL } = useLanguage();
  /* =========================
     AUTH / TOAST
  ========================= */
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  /* =========================
     Exchange Admins List
  ========================= */

  const fetchExchangeAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const res = await axios.get(`${BASE_URL}/api/v1/dashboard/super-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const admins = res.data.data.exchangeAdmins || [];
      setExchangeAdmins(admins);
      setRecentActivities(res?.data?.data?.recentActivities);
      setDashboardStats(
        res.data.data.stats || {
          totalExchangeAdmin: 0,
          pendingApproval: 0,
          activeBusinesses: 0,
          totalBranch: 0,
        },
      );
      setTotalElements(admins.length);
      setTotalPages(Math.ceil(admins.length / pageSize));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchExchangeAdmins();
  }, []);

  const paginatedAdmins = exchangeAdmins.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  /* =========================
     STATIC DASHBOARD DATA
  ========================= */
  const stats = [
    {
      title: "Total Exchange Admins",
      value: dashboardStats.totalExchangeAdmin.toString(),
      change: "+3 this month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Pending Exchange Admins",
      value: dashboardStats.pendingApproval.toString(),
      change: "2 due today",
      icon: FileCheck,
      color: "text-orange-600",
    },
    {
      title: "Total Active Businesses",
      value: dashboardStats.activeBusinesses.toString(),
      change: "+12 this week",
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Total Branches",
      value: dashboardStats.totalBranch.toString(),
      change: "Last updated 2d ago",
      icon: Settings,
      color: "text-purple-600",
    },
  ];

  // const recentActivities = [
  //   {
  //     type: "user_created",
  //     message: "New business user created: Michael Johnson",
  //     time: "2 hours ago",
  //     status: "success",
  //   },
  //   {
  //     type: "kyb_pending",
  //     message: "KYB application requires review: TechCorp LLC",
  //     time: "4 hours ago",
  //     status: "pending",
  //   },
  //   {
  //     type: "rule_updated",
  //     message: "Approval threshold updated for USD transactions",
  //     time: "1 day ago",
  //     status: "info",
  //   },
  //   {
  //     type: "beneficiary_approved",
  //     message: "Beneficiary approved: Global Suppliers Inc",
  //     time: "1 day ago",
  //     status: "success",
  //   },
  // ];

  const pendingTasks = [
    {
      task: "Review TechCorp LLC KYB Documentation",
      priority: "high",
      dueDate: "Today",
    },
    {
      task: "Approve new beneficiary registrations (3)",
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      task: "Update transaction limits for Q1",
      priority: "low",
      dueDate: "This week",
    },
  ];

  const getStatusBadge = (status: string | null) => {
    const lower = (status || "").toLowerCase();
    if (lower === "active") {
      return {
        variant: "default" as const,
        label: t("active"),
        icon: CheckCircle,
      };
    }
    if (lower === "pending") {
      return {
        variant: "secondary" as const,
        label: t("pending"),
        icon: Clock,
      };
    }
    if (lower === "suspended") {
      return {
        variant: "destructive" as const,
        label: t("suspended"),
        icon: XCircle,
      };
    }
    if (lower === "deactivated") {
      return {
        variant: "destructive" as const,
        label: "Deactivated",
        icon: XCircle,
      };
    }
    return { variant: "secondary" as const, label: t("pending"), icon: Clock };
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your business operations and compliance
            </p>
          </div>

          <div className="flex space-x-3">
            {/* <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button> */}

            {/* <Button
              onClick={() => navigate("/admin/exchange-houses")}
              variant="business"
            >
              <Plus className="h-4 w-4 mr-2" />
              Onboard Exchange House
            </Button> */}
          </div>
        </div>

        {/* ================= STATS ================= */}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Card
                key={index}
                className="shadow-card hover:shadow-lg transition-smooth"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p> */}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ===============Exchange Admin List ============= */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exchange Admins
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Legal Business Name</TableHead>
                  <TableHead>Trade Name</TableHead>
                  <TableHead>Admin Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loadingAdmins && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {!loadingAdmins && paginatedAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No exchange admins found
                    </TableCell>
                  </TableRow>
                )}

                {paginatedAdmins.map((admin) => {
                  const status = getStatusBadge(admin?.exchangeStatus);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.legalBusinessName}</TableCell>
                      <TableCell>{admin.tradingName}</TableCell>
                      <TableCell>{admin.fullName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phoneNumber || "—"}</TableCell>
                      <TableCell>
                        {/* <Badge variant={admin.active ? "default" : "destructive"}>
                        {admin.active ? "Active" : "Inactive"}
                      </Badge> */}
                        <Badge
                          variant={status.variant}
                          className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>

                      {/* <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {!loadingAdmins && totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 0) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={index === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index);
                        }}
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
                        if (currentPage < totalPages - 1) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Recent Activities
                  {/* <Button variant="ghost" size="sm">
                    View All <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button> */}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {loadingAdmins ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-muted/50 rounded-lg animate-pulse"
                      >
                        <div className="h-5 w-5 bg-gray-300 rounded-full" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 w-1/3 bg-gray-300 rounded" />
                          <div className="h-2 w-1/4 bg-gray-300 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities?.length > 0 ? (
                  <div>
                    {recentActivities.map((a, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm font-medium">{a?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {dayjs(a?.activityAt || "").fromNow()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 font-normal text-base">
                    No Recent Activities Data Found
                  </p>
                )}
              </CardContent>
              {/* <p className="text-center pb-2">No data found</p> */}
            </Card>
          </div>

          {/* Pending Tasks */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              {/* <CardContent className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {task.task}
                      </h4>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                    {index < pendingTasks.length - 1 && (
                      <div className="border-b" />
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Tasks
                </Button>
              </CardContent> */}
              <p className="text-center pb-2">No data found</p>
            </Card>
          </div>
        </div>
        {/* Quick Actions */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <FileCheck className="h-6 w-6 mb-2" />
                <span className="text-sm">Review KYB</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">Update Rules</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
