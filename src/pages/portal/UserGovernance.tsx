import UserLayout from "@/components/layout/UserLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApprovalRuleForm from "@/components/governance/ApprovalRuleForm";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Settings,
  Users,
  DollarSign,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Plus,
  XCircle,
  Power,
  Search,
  Loader2,
  FileText,
  FileTextIcon,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationSummary from "@/components/PaginationSummary";
import PaginationControl from "@/components/PaginationControl";

const UserGovernance = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [debounceValue, setDebouncedValue] = useState("");
  const [filterByApprovalTire, setFilterByApprovalTire] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const tiers = [
    { label: "All", value: "ALL" },
    { label: "Tier 1", value: "TIER_1" },
    { label: "Tier 2", value: "TIER_2" },
    { label: "Tier 3", value: "TIER_3" },
  ];
  const [dashboard, setDashboard] = useState({
    totalRules: 0,
    activeRules: 0,
    draftRules: 0,
    currencies: 0,
  });
  const [rules, setRules] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingStatusChange, setLoadingStatusChange] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, debounceValue, filterByApprovalTire]);
  const refreshRules = () => {
    fetchData(currentPage);
  };
  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchValue]);
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/business/governance-rules?page=${page}&size=10&search=${debounceValue}&approvalTier=${filterByApprovalTire}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.status) {
        setDashboard(data.data.dashboard);
        setRules(
          data.data.rules.map((r: any) => ({
            id: r.id,
            name: r.ruleName,
            description: r.description,
            currency: r.currency,
            currencyId: r.currencyId,
            minAmount: r.minAmount,
            maxAmount: r.maxAmount,
            department: r.department
              .split("_")
              .map(
                (w: string) =>
                  w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
              )
              .join(" "),
            // ────────────────────────────────────────
            // IMPORTANT: no .toLowerCase() anymore
            status: r.status, // keep exactly as backend sends: DRAFT / ACTIVE / DISABLED
            // ────────────────────────────────────────
            transactionTypes: r.transactionTypes.map((t: string) =>
              t
                .split("_")
                .map(
                  (w: string) =>
                    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                )
                .join(" "),
            ),
            tiers: r.approvalTiers.map((t: any) => ({
              level: t.tierOrder,
              threshold: t.thresholdAmount,
              approvers: t.approversRequired,
              roles: t.eligibleRoles.map((role: string) =>
                role
                  .split("_")
                  .map(
                    (w: string) =>
                      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                  )
                  .join(" "),
              ),
            })),
          })),
        );
        setPagination(data.data.pagination);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load rules",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch governance rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeRuleStatus = async (
    ruleId: number,
    newStatus: "DRAFT" | "ACTIVE" | "DISABLED",
  ) => {
    setLoadingStatusChange(ruleId);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/business/governance-rules/${ruleId}/status?status=${newStatus}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const result = await response.json();
      if (result.status) {
        toast({
          title: "Success",
          description: `Rule status updated to ${newStatus}`,
        });

        // Optimistic update
        setRules((prev) =>
          prev.map((rule) =>
            rule.id === ruleId ? { ...rule, status: newStatus } : rule,
          ),
        );

        // Refresh list after short delay
        setTimeout(() => fetchData(currentPage), 800);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    } finally {
      setLoadingStatusChange(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            ACTIVE
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            DRAFT
          </Badge>
        );
      case "DISABLED":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            DISABLED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "active") return "text-green-600 hover:bg-green-50";
    if (lower === "draft") return "text-yellow-600 hover:bg-yellow-50";
    if (lower === "disabled") return "text-red-600 hover:bg-red-50";
    return "";
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold">Governance Rules</h1>
            <p className="text-muted-foreground mt-2">
              Configure multi-tier approval rules for your business transactions
            </p>
          </div>

          <ApprovalRuleForm
            onSuccess={refreshRules} // <-- add this line
            trigger={
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Create New Rule
              </Button>
            }
          />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalRules}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Rules
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.activeRules}</div>
              <p className="text-xs text-muted-foreground">
                Currently enforced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Rules</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.draftRules}</div>
              <p className="text-xs text-muted-foreground">
                Pending activation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currencies</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.currencies}</div>
              <p className="text-xs text-muted-foreground">
                Configured currencies
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Governance</Label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, account, bank, or country..."
                      className="pl-9"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Filter By Approval Tier</Label>
                  <Select
                    value={filterByApprovalTire}
                    onValueChange={(value) => {
                      setFilterByApprovalTire(value == "ALL" ? "" : value);
                      setCurrentPage(0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tiers" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {tiers.map((t, index) => (
                        <SelectItem key={index} value={t?.value}>
                          {t?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Rules List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Approval Rules Configuration
            </CardTitle>
            <CardDescription>
              Manage your business approval workflows and governance rules
            </CardDescription>
            <div className="flex justify-end">
              <PaginationSummary
                totalElements={pagination?.totalItems}
                pageSize={pagination?.size}
                currentPage={currentPage}
                itemCount={rules?.length}
                itemLabel="Governance"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Loading Governance rule...
                    </p>
                  </div>
                </div>
              ) : rules?.length === 0 ? (
                <div className="text-center py-12">
                  <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {rules?.length === 0
                      ? "No Governance rule found"
                      : "No matching governance rule"}
                  </h3>
                </div>
              ) : (
                <>
                  {rules?.map((rule) => (
                    <Card key={rule.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">
                                {rule.name}
                              </h3>
                              {getStatusBadge(rule.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {rule.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status Dropdown Button */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`min-w-[110px] ${getStatusColor(rule.status)}`}
                                  disabled={loadingStatusChange === rule.id}
                                >
                                  {loadingStatusChange === rule.id ? (
                                    "Updating..."
                                  ) : (
                                    <>
                                      <Power className="h-4 w-4 mr-1" />
                                      {rule.status}
                                    </>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    changeRuleStatus(rule.id, "ACTIVE")
                                  }
                                  className="text-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  ACTIVE
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    changeRuleStatus(rule.id, "DRAFT")
                                  }
                                  className="text-yellow-700"
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  DRAFT
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    changeRuleStatus(rule.id, "DISABLED")
                                  }
                                  className="text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  DISABLED
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <ApprovalRuleForm
                              editRule={rule}
                              onSuccess={refreshRules} // <-- add this line
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              }
                            />
                            {/*<Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>*/}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Currency & Amount
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {rule.currency} {rule.minAmount.toLocaleString()}{" "}
                              -{" "}
                              {rule.maxAmount
                                ? rule.maxAmount.toLocaleString()
                                : "Unlimited"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Department</p>
                            <p className="text-sm text-muted-foreground">
                              {rule.department}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Transaction Types
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rule.transactionTypes.map((type: string) => (
                                <Badge
                                  key={type}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Approval Tiers ({rule.tiers.length})
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rule.tiers.map((tier: any) => (
                              <div
                                key={tier.level}
                                className="p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    Tier {tier.level}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {tier.approvers} approver
                                    {tier.approvers > 1 ? "s" : ""} required
                                  </span>
                                </div>
                                <p className="text-sm mb-1">
                                  Threshold: {rule.currency}{" "}
                                  {tier.threshold.toLocaleString()}+
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {tier.roles.map((role: string) => (
                                    <Badge
                                      key={role}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
            <PaginationControl
              className="mt-6"
              currentPage={currentPage}
              totalPages={pagination?.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserGovernance;
