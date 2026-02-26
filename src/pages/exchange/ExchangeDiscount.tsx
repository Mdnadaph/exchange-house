import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCookies } from "react-cookie";
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
  Plus,
  Search,
  Tag,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Discount = {
  id: number;
  name: string;
  discountCode: string;
  description: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  status: "ACTIVE" | "INACTIVE";
  expiryDate: string;
  createdAt: string;
};

type Stats = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  expiredCount: number;
  percentageCount: number;
  fixedAmountCount: number;
};

const ExchangeDiscount = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "FIXED_AMOUNT" as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    expiryDate: "",
  });

  const discountTypes = ["PERCENTAGE", "FIXED_AMOUNT"];
  const discountStatuses = ["ACTIVE", "INACTIVE"];

  const fetchDiscounts = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      params.append("page", page.toString());
      params.append("size", size.toString());

      const res = await axios.get(`${BASE_URL}/api/v1/discount/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData = res.data.data?.discounts || {};
      const content = apiData.content || [];
      const fetchedStats = res.data.data?.stats || null;

      setDiscounts(content);
      setStats(fetchedStats);
      setTotalPages(apiData.totalPages || 1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch discounts",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [page, filterStatus]);

  const openAddModal = () => {
    setForm({
      name: "",
      description: "",
      type: "FIXED_AMOUNT",
      discountValue: "",
      status: "ACTIVE",
      expiryDate: "",
    });
    setIsModalOpen(true);
  };

  const createDiscount = async () => {
    const tempId = Date.now();
    const newDiscount: Discount = {
      id: tempId,
      name: form.name,
      discountCode: "NEW", // temporary
      description: form.description,
      type: form.type,
      discountValue: parseFloat(form.discountValue),
      status: form.status,
      expiryDate: form.expiryDate,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setDiscounts((prev) => [newDiscount, ...prev]);
    setStats((prev) =>
      prev
        ? {
            ...prev,
            totalCount: prev.totalCount + 1,
            activeCount:
              form.status === "ACTIVE" ? prev.activeCount + 1 : prev.activeCount,
            inactiveCount:
              form.status === "INACTIVE" ? prev.inactiveCount + 1 : prev.inactiveCount,
            percentageCount:
              form.type === "PERCENTAGE"
                ? prev.percentageCount + 1
                : prev.percentageCount,
            fixedAmountCount:
              form.type === "FIXED_AMOUNT"
                ? prev.fixedAmountCount + 1
                : prev.fixedAmountCount,
            // expiredCount usually unchanged on create
          }
        : null
    );

    try {
      await axios.post(
        `${BASE_URL}/api/v1/discount/add`,
        {
          name: form.name,
          description: form.description,
          type: form.type,
          discountValue: parseFloat(form.discountValue),
          status: form.status,
          expiryDate: form.expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({ title: "Success", description: "Discount created successfully" });
      setIsModalOpen(false);

      // Reset to page 0 → triggers useEffect → shows fresh list (including real code)
      setPage(0);

    } catch (error: any) {
      // Rollback on error
      setDiscounts((prev) => prev.filter((d) => d.id !== tempId));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalCount: prev.totalCount - 1,
              activeCount:
                form.status === "ACTIVE" ? prev.activeCount - 1 : prev.activeCount,
              inactiveCount:
                form.status === "INACTIVE" ? prev.inactiveCount - 1 : prev.inactiveCount,
              percentageCount:
                form.type === "PERCENTAGE"
                  ? prev.percentageCount - 1
                  : prev.percentageCount,
              fixedAmountCount:
                form.type === "FIXED_AMOUNT"
                  ? prev.fixedAmountCount - 1
                  : prev.fixedAmountCount,
            }
          : null
      );

      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create discount",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.discountValue || !form.expiryDate) {
      toast({
        title: "Error",
        description: "Please fill required fields (name, value, expiry)",
        variant: "destructive",
      });
      return;
    }

    const valueNum = parseFloat(form.discountValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      toast({
        title: "Error",
        description: "Discount value must be a positive number",
        variant: "destructive",
      });
      return;
    }

    if (form.type === "PERCENTAGE" && valueNum > 100) {
      toast({
        title: "Error",
        description: "Percentage discount cannot exceed 100%",
        variant: "destructive",
      });
      return;
    }

    await createDiscount();
  };

  const getStatusBadge = (status: string) => {
    const map = {
      ACTIVE: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      INACTIVE: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: XCircle,
      },
    };
    return (
      map[status as keyof typeof map] || {
        variant: "outline",
        label: status,
        icon: Clock,
      }
    );
  };

  const getTypeLabel = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}% off` : `AED ${value} off`;
  };

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.discountCode || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Discount Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage promotional offers
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="business" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  New Discount
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Discount Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Winter Sale 2026"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Who it's for, conditions, exclusions..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Discount Type *</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) =>
                        setForm({
                          ...form,
                          type: v as "PERCENTAGE" | "FIXED_AMOUNT",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {discountTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discountValue">
                      Value {form.type === "PERCENTAGE" ? "(%)" : "(AED)"} *
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={form.discountValue}
                      onChange={(e) =>
                        setForm({ ...form, discountValue: e.target.value })
                      }
                      placeholder={form.type === "PERCENTAGE" ? "25" : "150"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        setForm({ ...form, status: v as "ACTIVE" | "INACTIVE" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {discountStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) =>
                        setForm({ ...form, expiryDate: e.target.value })
                      }
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
                  <Button onClick={handleSubmit}>Create Discount</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {stats.activeCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inactive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.inactiveCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expired
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {stats.expiredCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Percentage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.percentageCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Fixed Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fixedAmountCount}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Search Discounts</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Name, code or description..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "ACTIVE" ? "default" : "outline"}
                  onClick={() => setFilterStatus("ACTIVE")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "INACTIVE" ? "default" : "outline"}
                  onClick={() => setFilterStatus("INACTIVE")}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discounts List */}
        <div className="space-y-5">
          {filteredDiscounts.map((discount) => {
            const status = getStatusBadge(discount.status);
            const StatusIcon = status.icon;

            return (
              <Card
                key={discount.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {discount.name}
                            </h3>
                            <Badge
                              variant={status.variant}
                              className="flex items-center gap-1"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                            <div>
                              Type:{" "}
                              <span className="font-mono">
                                {discount.type?.replace(/_/g, " ") || "—"}
                              </span>
                            </div>
                            <div>
                              Discount Code:{" "}
                              <span className="font-mono">
                                {discount.discountCode || "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-2 text-base font-medium text-foreground">
                          <span>
                            {getTypeLabel(discount.type, discount.discountValue)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm bg-muted/40 rounded-md p-3">
                        {discount.description || "No description provided."}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            Created:{" "}
                            {new Date(discount.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {discount.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center border-t pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground mx-2">
              Page {page + 1} of {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {discounts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Tag className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No discounts found</p>
              <p className="mt-1">Try adjusting your filters or search term</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeDiscount;