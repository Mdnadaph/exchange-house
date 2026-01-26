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
    Plus,
    Edit,
    Trash2,
    FileText,
    Eye,
    EyeOff,
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
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

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
    const [isEdit, setIsEdit] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* =========================
       FORM SUBMIT (CREATE/UPDATE)
    ========================= */
    const submitForm = async () => {
        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.phoneNumber
        ) {
            toast({
                title: "Error",
                description: "First name, last name, email, and phone number are required",
                variant: "destructive",
            });
            return;
        }

        let payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phoneNumber: form.phoneNumber,
        };

        if (form.password || form.confirmPassword) {
            if (!form.password || !form.confirmPassword) {
                toast({
                    title: "Error",
                    description: "Both password and confirm password are required if updating password",
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
            // payload = { ...payload, password: form.password };
        }

        try {
            if (isEdit && selectedAdmin) {
                await axios.put(
                    `${BASE_URL}/api/v3/super/exchange-admins/${selectedAdmin.id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast({
                    title: "Success",
                    description: "Exchange admin updated successfully",
                });
            } else {
                await axios.post(`${BASE_URL}/api/v3/super/exchange-admins`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast({
                    title: "Success",
                    description: "Exchange admin created successfully",
                });
            }

            setIsModalOpen(false);
            resetForm();
            fetchExchangeAdmins(currentPage, pageSize);
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    (isEdit ? "Failed to update exchange admin" : "Failed to create exchange admin"),
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setForm({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsEdit(false);
        setSelectedAdmin(null);
    };

    /* =========================
       HANDLE EDIT
    ========================= */
    const handleEdit = (admin: any) => {
        setForm({
            firstName: admin.firstName || "",
            lastName: admin.lastName || "",
            email: admin.email || "",
            phoneNumber: admin.phoneNumber || "",
            password: "",
            confirmPassword: "",
        });
        setIsEdit(true);
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    /* =========================
       HANDLE DELETE
    ========================= */
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this exchange admin?")) {
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/api/v3/super/exchange-admins/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast({
                title: "Success",
                description: "Exchange admin deleted successfully",
            });
            fetchExchangeAdmins(currentPage, pageSize);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete exchange admin",
                variant: "destructive",
            });
        }
    };

    /* =========================
       Exchange Admins List
    ========================= */

    const fetchExchangeAdmins = async (page: number, size: number) => {
        try {
            setLoadingAdmins(true);
            const res = await axios.get(
                `${BASE_URL}/api/v3/super/exchange-admins?page=${page}&size=${size}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setExchangeAdmins(res.data.data || []);
            setTotalElements(res.data.totalElements || 0);
            setTotalPages(res.data.totalPages || 1);
            setCurrentPage(res.data.currentPage || 0);
            setPageSize(res.data.pageSize || 10);
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
        fetchExchangeAdmins(0, 10);
    }, []);

    /* =========================
       STATIC DASHBOARD DATA
    ========================= */
    const stats = [
        {
            title: "Total Exchange Admins",
            value: totalElements.toString(),
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

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Exchange Admin Dashboard
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

                        <Button variant="business" onClick={() => { setIsModalOpen(true); setIsEdit(false); resetForm(); }}>
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
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(admin)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(admin.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                                                    fetchExchangeAdmins(currentPage - 1, pageSize);
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
                                                    fetchExchangeAdmins(index, pageSize);
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
                                                    fetchExchangeAdmins(currentPage + 1, pageSize);
                                                }
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>

                {/* ================= ADD/EDIT EXCHANGE ADMIN MODAL ================= */}
                <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm(); }}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{isEdit ? "Edit Exchange Admin" : "Add Exchange Admin"}</DialogTitle>
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
                                    <Label>{isEdit ? "New Password (optional)" : "Password"}</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={(e) =>
                                                setForm({ ...form, password: e.target.value })
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label>{isEdit ? "Confirm New Password" : "Confirm Password"}</Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={form.confirmPassword}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={submitForm}>{isEdit ? "Update Admin" : "Create Admin"}</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;