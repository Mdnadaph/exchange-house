import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import axios from "axios";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";

const AdminDashboard = () => {
  const [exchangeAdmins, setExchangeAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  /* =========================
     AUTH / TOAST
  ========================= */
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  /* =========================
     MODAL STATE
  ========================= */
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  /* =========================
     CREATE EXCHANGE ADMIN
  ========================= */
  const createExchangeAdmin = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/v3/super/exchange-admins`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Exchange admin created successfully",
      });

      setIsModalOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create exchange admin",
        variant: "destructive",
      });
    }
  };

  /* =========================
     Exchange Admins List
  ========================= */

  const fetchExchangeAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const res = await axios.get(
        `${BASE_URL}/api/v3/super/exchange-admins?page=0&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExchangeAdmins(res.data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exchange admins",
        variant: "destructive",
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchExchangeAdmins();
  }, []);

  /* =========================
     STATIC DASHBOARD DATA
  ========================= */
  const stats = [
    {
      title: "Total Business Users",
      value: "24",
      change: "+3 this month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Pending KYB Applications",
      value: "3",
      change: "2 due today",
      icon: FileCheck,
      color: "text-orange-600",
    },
    {
      title: "Active Beneficiaries",
      value: "127",
      change: "+12 this week",
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Approval Rules",
      value: "8",
      change: "Last updated 2d ago",
      icon: Settings,
      color: "text-purple-600",
    },
  ];

  const recentActivities = [
    {
      type: "user_created",
      message: "New business user created: Michael Johnson",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "kyb_pending",
      message: "KYB application requires review: TechCorp LLC",
      time: "4 hours ago",
      status: "pending",
    },
    {
      type: "rule_updated",
      message: "Approval threshold updated for USD transactions",
      time: "1 day ago",
      status: "info",
    },
    {
      type: "beneficiary_approved",
      message: "Beneficiary approved: Global Suppliers Inc",
      time: "1 day ago",
      status: "success",
    },
  ];

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

            <Button variant="business" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exchange Admin
            </Button>
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
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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

                {!loadingAdmins && exchangeAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No exchange admins found
                    </TableCell>
                  </TableRow>
                )}

                {exchangeAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.firstName || admin.lastName
                        ? `${admin.firstName} ${admin.lastName}`
                        : "—"}
                    </TableCell>

                    <TableCell>{admin.email}</TableCell>

                    <TableCell>{admin.phoneNumber || "—"}</TableCell>

                    <TableCell>
                      <Badge variant={admin.active ? "default" : "destructive"}>
                        {admin.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              {/* <CardContent className="space-y-4">
                {recentActivities.map((a, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {a.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {a.status === "pending" && (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                    {a.status === "info" && (
                      <AlertCircle className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent> */}
              <p className="text-center pb-2">No data found</p>
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

      {/* ================= ADD BUSINESS USER MODAL ================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Exchange Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createExchangeAdmin}>Create Admin</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
