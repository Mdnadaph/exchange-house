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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { PermissionGate } from "@/contexts/PermissionGate";

type Discount = {
  id: number;
  name: string;
  discountCode: string;
  description: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  status: string;
  expiryDate: string;
  startDate: string;
  createdAt: string;
  limit: number;
  usageCount?: number;
};

type Stats = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  expiredCount: number;
  percentageCount: number;
  fixedAmountCount: number;
  pendingCount: number;
};

const ExchangeDiscount = () => {
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies.token;
  const currencyCode = cookies.currencyCode;
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

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
    limit: "",
    startDate: "",
    expiryDate: "",
  });

  const discountTypes = ["PERCENTAGE", "FIXED_AMOUNT"];

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceValue(searchQuery);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      params.append("search", debounceValue);
      params.append("status", statusFilter);

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
        description:
          error?.response?.data?.message || "Failed to fetch discounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [page, debounceValue, statusFilter]);

  const openAddModal = () => {
    setForm({
      name: "",
      description: "",
      type: "FIXED_AMOUNT",
      discountValue: "",
      limit: "",
      startDate: "",
      expiryDate: "",
    });
    setIsModalOpen(true);
  };

  const createDiscount = async () => {
    const limitNum = form.limit === "" ? 0 : Number(form.limit);

    try {
      await axios.post(
        `${BASE_URL}/api/v1/discount/add`,
        {
          name: form.name,
          description: form.description,
          type: form.type,
          discountValue: Number(form.discountValue),
          limit: limitNum,
          startDate: form.startDate,
          expiryDate: form.expiryDate,
          status: "ACTIVE",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast({ title: "Success", description: "Discount created successfully" });
      setIsModalOpen(false);
      setSearchQuery("");
      setPage(0);
      await fetchDiscounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create discount",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.discountValue ||
      !form.startDate ||
      !form.expiryDate
    ) {
      toast({
        title: "Error",
        description:
          "Please fill required fields (name, value, start date, expiry)",
        variant: "destructive",
      });
      return;
    }

    const valueNum = Number(form.discountValue);
    const limitNum = form.limit === "" ? 0 : Number(form.limit);

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

    if (form.limit !== "" && (isNaN(limitNum) || limitNum < 0)) {
      toast({
        title: "Error",
        description: "Limit must be 0 or a positive number",
        variant: "destructive",
      });
      return;
    }

    if (form.startDate > form.expiryDate) {
      toast({
        title: "Error",
        description: "Start date must be before expiry date",
        variant: "destructive",
      });
      return;
    }

    await createDiscount();
  };

  const getTypeLabel = (type: string, value: number) => {
    return type === "PERCENTAGE"
      ? `${value}% off`
      : `${currencyCode} ${value} off`;
  };

  // Determine current status based on dates
  // const getStatus = (discount: Discount): "ACTIVE" | "INACTIVE" => {
  //   const now = new Date();
  //   const start = new Date(discount.startDate);
  //   const expiry = new Date(discount.expiryDate);

  //   if (now >= start && now <= expiry) {
  //     return "ACTIVE";
  //   }
  //   return "INACTIVE";
  // };

  // Combined filtering: search + status
  // const filteredDiscounts = discounts
  //   .filter(
  //     (d) =>
  //       d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (d.description || "")
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       (d.discountCode || "")
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()),
  //   )
  //   .filter((d) => {
  //     if (statusFilter === "ALL") return true;
  //     return getStatus(d) === statusFilter;
  //   });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-600 hover:bg-green-600 text-white";
      case "INACTIVE":
        return "bg-gray-500 hover:bg-gray-500 text-white";
      case "EXPIRED":
        return "bg-red-600 hover:bg-red-600 text-white";
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-500 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-500 text-white";
    }
  };

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
            <PermissionGate permission="BTN_CREATE_DISCOUNT">
              <DialogTrigger asChild>
                <Button variant="business" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discount
                </Button>
              </DialogTrigger>
            </PermissionGate>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  New Discount
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">
                    Discount Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Welcome Bonus 2026"
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
                    <Label htmlFor="type">
                      Discount Type <span className="text-red-500">*</span>
                    </Label>
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
                      Value{" "}
                      {form.type === "PERCENTAGE" ? "(%)" : `(${currencyCode})`}{" "}
                      *
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
                      placeholder={form.type === "PERCENTAGE" ? "25" : "50"}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="limit">
                    Usage Limit (0 = unlimited){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    min="0"
                    value={form.limit}
                    onChange={(e) =>
                      setForm({ ...form, limit: e.target.value })
                    }
                    placeholder="e.g. 100, 500, 0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">
                      Expiry Date <span className="text-red-500">*</span>
                    </Label>
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
          <div className="grid grid-flow-col auto-cols-fr gap-4 md:gap-6 w-full">
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
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {stats.pendingCount}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search + Status Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <Label htmlFor="search">Search Discounts</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Name, code or description..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Status:</Label>
                <div className="flex border rounded-md overflow-hidden shadow-sm">
                  <Button
                    variant={statusFilter === "ALL" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-r"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(0);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "ACTIVE" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-r"
                    onClick={() => {
                      setPage(0);
                      setStatusFilter("ACTIVE");
                    }}
                  >
                    Active
                  </Button>
                  <Button
                    variant={statusFilter === "INACTIVE" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => {
                      setStatusFilter("INACTIVE");
                      setPage(0);
                    }}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discounts List */}
        <div className="space-y-5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading Discount...
                </p>
              </div>
            </div>
          ) : discounts?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Tag className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No discounts found</p>
                <p className="mt-1">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try changing search or filter"
                    : "Create your first discount to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            discounts?.map((discount) => {
              // const status = getStatus(discount);
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
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold">
                                {discount.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={getStatusBadgeClass(
                                  discount?.status,
                                )}
                              >
                                {discount?.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                              <div>
                                Type:
                                <span className="font-mono ml-1">
                                  {discount.type.replace(/_/g, " ")}
                                </span>
                              </div>
                              <div>
                                Code:
                                <span className="font-mono ml-1">
                                  {discount.discountCode || "—"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-base font-medium text-foreground">
                            {getTypeLabel(
                              discount.type,
                              discount.discountValue,
                            )}
                          </div>
                        </div>

                        <div className="text-sm bg-muted/40 rounded-md p-3">
                          {discount.description || "No description provided."}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-4 w-4" />
                            <span>
                              Limit:{" "}
                              {discount.limit === 0
                                ? "Unlimited"
                                : discount.limit}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Starts: {discount.startDate || "—"}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Expires: {discount.expiryDate}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>
                              Created:{" "}
                              {new Date(
                                discount.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {discount.usageCount !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Tag className="h-4 w-4" />
                              <span>Used: {discount.usageCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {/* {totalPages > 1 && (
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
        )} */}

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
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeDiscount;
