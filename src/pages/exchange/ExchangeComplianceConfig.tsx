import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  Clock,
  DollarSign,
  Globe,
  Users,
  Save,
  Download,
  Settings,
  Check,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { PermissionGate } from "@/contexts/PermissionGate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import axios from "axios";
import { previousDay } from "date-fns";

type ComplianceFormData = {
  highRiskCountries: string[];
  prohibitedCountries: string[];
  enhancedMonitoringCountries: string[];
  realTimeSanctionsCheck: boolean;
  pepDatabaseScreening: boolean;
  adverseMediaMonitoring: boolean;
  enhancedDueDiligence: boolean;
  sanctionsListUpdate: string;
  pepDatabaseRefresh: string;
  adverseMediaCheck: string;
  largeTransactionThreshold?: number;
  suspiciousActivityReports: boolean;
  monthlyStatisticalReturns: boolean;
  complianceOfficerAlerts: string;
  auditTrailRetentionYears?: number;
  managementReports: string;
};

const ExchangeComplianceConfig = () => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [rules, setRules] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [countryMap, setCountryMap] = useState<{ [key: string]: string }>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createForm, setCreateForm] = useState({
    name: "",
    transactionType: "SINGLE",
    payoutCountry: "",
    thresholdAmount: 0,
    currency: "",
    action: "",
    frequency: "",
    category: "",
  });
  const [editForm, setEditForm] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [createErrors, setCreateErrors] = useState<{ [key: string]: string }>(
    {},
  );
  const [payoutCountryData, setPayoutCountryData] = useState([]);
  const [complianceFormData, setComplianceFormData] =
    useState<ComplianceFormData>({
      highRiskCountries: [],
      prohibitedCountries: [],
      enhancedMonitoringCountries: [],
      realTimeSanctionsCheck: false,
      pepDatabaseScreening: false,
      adverseMediaMonitoring: false,
      enhancedDueDiligence: false,
      sanctionsListUpdate: "",
      pepDatabaseRefresh: "",
      adverseMediaCheck: "",
      largeTransactionThreshold: undefined,
      suspiciousActivityReports: false,
      monthlyStatisticalReturns: false,
      complianceOfficerAlerts: "",
      auditTrailRetentionYears: undefined,
      managementReports: "",
    });
  const [countriesRiskData, setCountriesRiskData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const clearFormError = (field: string) => {
    setCreateErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const actions = [
    "MANUAL_REVIEW",
    "ENHANCED_SCREENING",
    "AUTO_REPORT_CBUAE",
    "BLOCK",
  ];
  const categories = ["REGULATORY", "AML", "SANCTIONS", "RISK_MANAGEMENT"];
  const frequencies = ["IMMEDIATE", "REALTIME", "DAILY", "WEEKLY"];
  const transactionTypes = ["SINGLE", "BULK"];

  const validateCreateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!createForm.name.trim()) errors.name = "Name is required";
    if (!createForm.transactionType)
      errors.transactionType = "Transaction type is required";
    if (!createForm.payoutCountry)
      errors.payoutCountry = "Payout country is required";
    if (!createForm.thresholdAmount || createForm.thresholdAmount <= 0)
      errors.thresholdAmount = "Threshold amount must be greater than 0";
    if (!createForm.currency) errors.currency = "Currency is required";
    if (!createForm.action) errors.action = "Action is required";
    if (!createForm.frequency) errors.frequency = "Frequency is required";
    if (!createForm.category) errors.category = "Category is required";
    return errors;
  };

  const getPayoutCountryList = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout/config/compliance-currencies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPayoutCountryData(res?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to payout country list",
        description: "Could not sync with the server.",
      });
    }
  };

  useEffect(() => {
    getPayoutCountryList();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/config/countries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCountries(data.data || []);
      const map: { [key: string]: string } = {};
      data.data.forEach((c: any) => {
        map[c.isoCode] = c.name;
      });
      setCountryMap(map);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch countries",
      });
    }
  };

  const fetchRules = async (
    page: number,
    activeFilter: "all" | "active" | "inactive",
  ) => {
    try {
      let url = `${BASE_URL}/api/v1/compliance/rules?page=${page}&size=${pageSize}`;
      if (activeFilter !== "all") {
        url += `&active=${activeFilter === "active"}`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRules(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch rules",
      });
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchRules(0, filter);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    fetchRules(0, filter);
  }, [filter]);

  const handleCreate = async () => {
    const errors = validateCreateForm();
    const selectedCountryCode = payoutCountryData?.find(
      (p) => p?.id == createForm?.payoutCountry,
    );
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }
    const payloadData = {
      ...createForm,
      payoutCountry: selectedCountryCode?.countryCode,
    };
    try {
      const res = await fetch(`${BASE_URL}/api/v1/compliance/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadData),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Rule created successfully" });
        fetchRules(currentPage, filter);
        setIsCreateOpen(false);
        setCreateForm({
          name: "",
          transactionType: "SINGLE",
          payoutCountry: "",
          thresholdAmount: 0,
          currency: "",
          action: "",
          frequency: "",
          category: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create rule",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create rule",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editForm) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/compliance/rules/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );
      if (res.ok) {
        toast({ title: "Success", description: "Rule updated successfully" });
        fetchRules(currentPage, filter);
        setIsEditOpen(false);
        setEditForm(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update rule",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update rule",
      });
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/compliance/rules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Rule status updated" });
        fetchRules(currentPage, filter);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update status",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  const complianceMetrics = [
    {
      title: "AML Compliance Score",
      value: "98.5%",
      status: "excellent",
      threshold: ">95%",
      icon: Shield,
    },
    {
      title: "Transaction Monitoring",
      value: "Active",
      status: "active",
      threshold: "24/7",
      icon: Eye,
    },
    {
      title: "Regulatory Reports",
      value: "Up to date",
      status: "current",
      threshold: "Monthly",
      icon: FileText,
    },
    {
      title: "Risk Assessment",
      value: "Low Risk",
      status: "low",
      threshold: "<5%",
      icon: AlertTriangle,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: "text-success",
      active: "text-primary",
      current: "text-success",
      low: "text-success",
      medium: "text-warning",
      high: "text-destructive",
    };
    return colors[status as keyof typeof colors] || "text-muted-foreground";
  };

  const getCategoryBadge = (category: string | null) => {
    if (!category) {
      return { variant: "outline" as const, label: "Uncategorized" };
    }
    const categories = {
      REGULATORY: { variant: "default" as const, label: "Regulatory" },
      AML: { variant: "destructive" as const, label: "AML" },
      SANCTIONS: { variant: "secondary" as const, label: "Sanctions" },
      RISK_MANAGEMENT: {
        variant: "outline" as const,
        label: "Risk Management",
      },
    };
    return (
      categories[category as keyof typeof categories] || {
        variant: "default" as const,
        label: "Regulatory",
      }
    );
  };

  const getComplianceData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/compliance/config`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res?.json();
      setCountriesRiskData(data?.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const validateComplianceForm = () => {
    const newErrors: Record<string, string> = {};
    if (!complianceFormData?.sanctionsListUpdate) {
      newErrors.sanctionsListUpdate = "Please select the sanctions list update";
    }
    if (!complianceFormData?.pepDatabaseRefresh) {
      newErrors.pepDatabaseRefresh = "Please select the pep database refresh";
    }
    if (!complianceFormData?.adverseMediaCheck) {
      newErrors.adverseMediaCheck = "Please select the adverse media check";
    }
    if (!complianceFormData?.highRiskCountries?.length) {
      newErrors.highRiskCountries = "Please select the high risk countries";
    }
    if (!complianceFormData?.prohibitedCountries?.length) {
      newErrors.prohibitedCountries = "Please select the prohibited countries";
    }
    if (!complianceFormData?.enhancedMonitoringCountries?.length) {
      newErrors.enhancedMonitoringCountries =
        "Please select the enhanced monitoring countries";
    }
    if (!complianceFormData?.complianceOfficerAlerts) {
      newErrors.complianceOfficerAlerts =
        "Please select the compliance officer alerts";
    }
    if (!complianceFormData?.managementReports) {
      newErrors.managementReports = "Please select the management reports";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplianceConfiguration = async () => {
    if (!validateComplianceForm()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/compliance/config${countriesRiskData?.id ? `/${countriesRiskData?.id}` : ""}`,
        {
          method: countriesRiskData?.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(complianceFormData),
        },
      );
      const responseData = await res.json();
      getComplianceData();
      if (responseData?.status) {
        toast({
          title: "Success",
          description:
            responseData?.message ||
            "Country Risk Configuration Created Successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            responseData?.message ||
            "Failed to create Country Risk Configuration",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create Country Risk Configuration",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplianceData();
  }, []);

  useEffect(() => {
    if (!countriesRiskData) return;
    const data = countriesRiskData as ComplianceFormData;
    setComplianceFormData((prev) => ({
      ...prev,
      highRiskCountries: data.highRiskCountries ?? [],
      prohibitedCountries: data.prohibitedCountries ?? [],
      enhancedMonitoringCountries: data.enhancedMonitoringCountries ?? [],
      realTimeSanctionsCheck: data.realTimeSanctionsCheck ?? false,
      pepDatabaseScreening: data.pepDatabaseScreening ?? false,
      adverseMediaMonitoring: data.adverseMediaMonitoring ?? false,
      enhancedDueDiligence: data.enhancedDueDiligence ?? false,
      sanctionsListUpdate: data.sanctionsListUpdate ?? "",
      pepDatabaseRefresh: data.pepDatabaseRefresh ?? "",
      adverseMediaCheck: data.adverseMediaCheck ?? "",
      largeTransactionThreshold: data.largeTransactionThreshold ?? undefined,
      suspiciousActivityReports: data.suspiciousActivityReports ?? false,
      monthlyStatisticalReturns: data.monthlyStatisticalReturns ?? false,
      complianceOfficerAlerts: data.complianceOfficerAlerts ?? "",
      auditTrailRetentionYears: data.auditTrailRetentionYears ?? undefined,
      managementReports: data.managementReports ?? "",
    }));
  }, [countriesRiskData]);

  // Add this inside ExchangeComplianceConfig component
  const getCountryName = (code: string): string => {
    const country = payoutCountryData.find(
      (c: any) => c?.countryCode === code || c?.isoCode === code,
    );
    return country ? country.countryName || country.name || code : code;
  };

  // Helper to get correct payout country id for pre-filling
  const getPayoutCountryId = (countryCode: string): string => {
    if (!countryCode) return "";
    const found = payoutCountryData.find(
      (c: any) => c?.countryCode === countryCode || c?.isoCode === countryCode,
    );
    return found ? found?.id : "";
  };

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Compliance Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure compliance thresholds, monitoring rules, and regulatory
              requirements
            </p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <PermissionGate permission="BTN_CREATE_COMPLIANCE_RULE">
                <DialogTrigger asChild>
                  <Button variant="business">
                    <Save className="h-4 w-4 mr-2" />
                    Create Compliance
                  </Button>
                </DialogTrigger>
              </PermissionGate>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Compliance Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={createForm.name}
                      onChange={(e) => {
                        setCreateForm({ ...createForm, name: e.target.value });
                        clearFormError("name");
                      }}
                    />
                    {createErrors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {createErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>
                        Transaction Type
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={createForm.transactionType}
                        onValueChange={(v) => {
                          setCreateForm({ ...createForm, transactionType: v });
                          clearFormError("transactionType");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {createErrors.transactionType && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.transactionType}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>
                        Threshold Amount
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={createForm.thresholdAmount}
                        onChange={(e) => {
                          setCreateForm({
                            ...createForm,
                            thresholdAmount: parseFloat(e.target.value),
                          });
                          clearFormError("thresholdAmount");
                        }}
                      />
                      {createErrors.thresholdAmount && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.thresholdAmount}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>
                        Payout Country <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={createForm.payoutCountry}
                        onValueChange={(v) => {
                          const selectedCountry = payoutCountryData.find(
                            (c: any) => c?.id === v,
                          );
                          const autoCurrency =
                            selectedCountry?.currencyCode || "";
                          setCreateForm({
                            ...createForm,
                            payoutCountry: v,
                            currency: autoCurrency,
                          });
                          clearFormError("payoutCountry");
                          if (autoCurrency) clearFormError("currency");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {payoutCountryData?.map((c: any) => {
                            const code = c?.countryCode || c?.isoCode || "";
                            const name =
                              c?.countryName || c?.name || "Unknown Country";
                            return (
                              <SelectItem key={c?.id} value={c?.id}>
                                {name} ({c?.currencyCode || ""})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {createErrors.payoutCountry && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.payoutCountry}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>
                        Currency <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        disabled
                        placeholder="AED"
                        value={createForm.currency}
                        onChange={(e) => {
                          setCreateForm({
                            ...createForm,
                            currency: e.target.value.toUpperCase(),
                          });
                          clearFormError("currency");
                        }}
                      />
                      {createErrors.currency && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.currency}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>
                        Action <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={createForm.action}
                        onValueChange={(v) => {
                          setCreateForm({ ...createForm, action: v });
                          clearFormError("action");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {actions.map((act) => (
                            <SelectItem key={act} value={act}>
                              {act.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {createErrors.action && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.action}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>
                        Frequency <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={createForm.frequency}
                        onValueChange={(v) => {
                          setCreateForm({ ...createForm, frequency: v });
                          clearFormError("frequency");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {freq}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {createErrors.frequency && (
                        <p className="text-sm text-destructive mt-1">
                          {createErrors.frequency}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={createForm.category}
                      onValueChange={(v) => {
                        setCreateForm({ ...createForm, category: v });
                        clearFormError("category");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {createErrors.category && (
                      <p className="text-sm text-destructive mt-1">
                        {createErrors.category}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Regulatory Thresholds */}
        <Card className="shadow-card">
          <div className="flex p-6  flex-wrap gap-3">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Transaction Monitoring Thresholds
              </CardTitle>
            </div>
            <div className="flex gap-2 items-end flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                All Compliance
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                onClick={() => setFilter("active")}
              >
                Active Compliance
              </Button>
              <Button
                variant={filter === "inactive" ? "default" : "outline"}
                onClick={() => setFilter("inactive")}
              >
                Inactive Compliance
              </Button>
            </div>
          </div>
          <CardContent className="space-y-6">
            {rules.map((rule) => {
              const categoryBadge = getCategoryBadge(rule.category);
              const ruleName = rule.name || "Unnamed Rule";
              const ruleStatus = rule.active ? "active" : "inactive";
              const countryName =
                countryMap[rule.payoutCountry] || rule.payoutCountry;
              return (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">
                            {ruleName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Threshold: {rule.thresholdAmount.toLocaleString()}{" "}
                            {rule.currency || "N/A"} for {rule.transactionType}{" "}
                            to {countryName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={categoryBadge.variant}>
                          {categoryBadge.label}
                        </Badge>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {ruleStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">
                          Action:
                        </div>
                        <p className="font-medium capitalize">
                          {(rule.action || "N/A").replace(/_/g, " ")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">
                          Frequency:
                        </div>
                        <p className="font-medium capitalize">
                          {rule.frequency || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">
                          Currency:
                        </div>
                        <p className="font-medium">{rule.currency || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <PermissionGate permission="BTN_EDIT_COMPLIANCE_RULE">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const payoutId = getPayoutCountryId(
                              rule.payoutCountry,
                            );
                            setEditForm({
                              ...rule,
                              payoutCountry: payoutId,
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </PermissionGate>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={(checked) =>
                          handleToggleActive(rule.id, checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  const prev = currentPage - 1;
                  setCurrentPage(prev);
                  fetchRules(prev, filter);
                }}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  const next = currentPage + 1;
                  setCurrentPage(next);
                  fetchRules(next, filter);
                }}
                disabled={currentPage + 1 >= totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Compliance Rule</DialogTitle>
            </DialogHeader>
            {editForm && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Transaction Type</Label>
                    <Select
                      value={editForm.transactionType}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, transactionType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Threshold Amount</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={editForm.thresholdAmount}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          thresholdAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Payout Country</Label>
                    <Select
                      value={editForm?.payoutCountry || ""}
                      onValueChange={(v) => {
                        const selectedCountry = payoutCountryData.find(
                          (c: any) => c?.id === v,
                        );
                        const newCurrency =
                          selectedCountry?.currencyCode ||
                          selectedCountry?.payoutCurrency ||
                          "";
                        setEditForm({
                          ...editForm,
                          payoutCountry: v,
                          currency: newCurrency,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {payoutCountryData?.map((c: any) => {
                          const name =
                            c?.countryName || c?.name || "Unknown Country";
                          return (
                            <SelectItem key={c?.id} value={c?.id}>
                              {name} ({c?.currencyCode || ""})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Input
                      disabled
                      placeholder="AED"
                      value={editForm?.currency || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          currency: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Action</Label>
                    <Select
                      value={editForm.action}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, action: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actions.map((act) => (
                          <SelectItem key={act} value={act}>
                            {act.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select
                      value={editForm.frequency || ""}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, frequency: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editForm.category || ""}
                    onValueChange={(v) =>
                      setEditForm({ ...editForm, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AML Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AML & Sanctions Screening
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Screening Settings
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">
                        Real-time Sanctions Check
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Screen against global sanctions lists
                      </p>
                    </div>
                    <Switch
                      checked={complianceFormData?.realTimeSanctionsCheck}
                      onCheckedChange={(checked) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          realTimeSanctionsCheck: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">
                        PEP Database Screening
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Check politically exposed persons
                      </p>
                    </div>
                    <Switch
                      checked={complianceFormData?.pepDatabaseScreening}
                      onCheckedChange={(value) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          pepDatabaseScreening: value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">
                        Adverse Media Monitoring
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Monitor negative news and events
                      </p>
                    </div>
                    <Switch
                      checked={complianceFormData?.adverseMediaMonitoring}
                      onCheckedChange={(value) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          adverseMediaMonitoring: value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">
                        Enhanced Due Diligence
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Additional checks for high-risk entities
                      </p>
                    </div>
                    <Switch
                      checked={complianceFormData?.enhancedDueDiligence}
                      onCheckedChange={(value) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          enhancedDueDiligence: value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Monitoring Intervals
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="sanctions-frequency">
                      Sanctions List Update
                    </Label>
                    <Select
                      value={complianceFormData?.sanctionsListUpdate}
                      onValueChange={(value) => {
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          sanctionsListUpdate: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          sanctionsListUpdate: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sanctions update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REAL_TIME">Real-time</SelectItem>
                        <SelectItem value="HOURLY">Hourly</SelectItem>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sanctionsListUpdate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.sanctionsListUpdate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pep-frequency">PEP Database Refresh</Label>
                    <Select
                      value={complianceFormData?.pepDatabaseRefresh}
                      onValueChange={(value) => {
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          pepDatabaseRefresh: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          pepDatabaseRefresh: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PEP Database Refresh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.pepDatabaseRefresh && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.pepDatabaseRefresh}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-frequency">Adverse Media Check</Label>
                    <Select
                      value={complianceFormData?.adverseMediaCheck}
                      onValueChange={(value) => {
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          adverseMediaCheck: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          adverseMediaCheck: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select adverse media check" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.adverseMediaCheck && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.adverseMediaCheck}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Country Risk Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Country Risk Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  High Risk Countries
                </h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Globe className="mr-2 h-4 w-4 shrink-0" />
                      {complianceFormData?.highRiskCountries?.length > 0
                        ? `${complianceFormData?.highRiskCountries?.length} country(s) selected`
                        : "Select high risk countries..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries?.map((country) => {
                            const isSelected =
                              complianceFormData?.highRiskCountries?.includes(
                                country?.isoCode,
                              );
                            return (
                              <CommandItem
                                key={country?.id}
                                onSelect={() => {
                                  setComplianceFormData((prev) => {
                                    const newCountries = isSelected
                                      ? prev.highRiskCountries.filter(
                                          (c) => c !== country?.isoCode,
                                        )
                                      : [
                                          ...(prev.highRiskCountries || []),
                                          country?.isoCode,
                                        ];
                                    return {
                                      ...prev,
                                      highRiskCountries: newCountries,
                                    };
                                  });
                                  setErrors((prev) => ({
                                    ...prev,
                                    highRiskCountries: "",
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {country?.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.highRiskCountries && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.highRiskCountries}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Prohibited Countries
                </h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Globe className="mr-2 h-4 w-4 shrink-0" />
                      {complianceFormData?.prohibitedCountries?.length > 0
                        ? `${complianceFormData?.prohibitedCountries?.length} country(s) selected`
                        : "Select prohibited countries..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => {
                            const isSelected =
                              complianceFormData?.prohibitedCountries?.includes(
                                country?.isoCode,
                              );
                            return (
                              <CommandItem
                                key={country?.id}
                                onSelect={() => {
                                  setComplianceFormData((prev) => {
                                    const newCountries = isSelected
                                      ? prev.prohibitedCountries.filter(
                                          (c) => c !== country?.isoCode,
                                        )
                                      : [
                                          ...(prev.prohibitedCountries || []),
                                          country?.isoCode,
                                        ];
                                    return {
                                      ...prev,
                                      prohibitedCountries: newCountries,
                                    };
                                  });
                                  setErrors((prev) => ({
                                    ...prev,
                                    prohibitedCountries: "",
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {country?.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.prohibitedCountries && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.prohibitedCountries}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Enhanced Monitoring
                </h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Globe className="mr-2 h-4 w-4 shrink-0" />
                      {complianceFormData?.enhancedMonitoringCountries?.length >
                      0
                        ? `${complianceFormData?.enhancedMonitoringCountries?.length} country(s) selected`
                        : "Select countries..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => {
                            const isSelected =
                              complianceFormData?.enhancedMonitoringCountries?.includes(
                                country?.isoCode,
                              );
                            return (
                              <CommandItem
                                key={country?.id}
                                onSelect={() => {
                                  setComplianceFormData((prev) => {
                                    const newCountries = isSelected
                                      ? prev.enhancedMonitoringCountries.filter(
                                          (c) => c !== country?.isoCode,
                                        )
                                      : [
                                          ...(prev.enhancedMonitoringCountries ||
                                            []),
                                          country?.isoCode,
                                        ];
                                    return {
                                      ...prev,
                                      enhancedMonitoringCountries: newCountries,
                                    };
                                  });
                                  setErrors((prev) => ({
                                    ...prev,
                                    enhancedMonitoringCountries: "",
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {country?.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.enhancedMonitoringCountries && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.enhancedMonitoringCountries}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Regulatory Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  CBUAE Reporting
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="large-transaction">
                      Large Transaction Threshold (AED)
                    </Label>
                    <Input
                      id="large-transaction"
                      type="number"
                      value={complianceFormData?.largeTransactionThreshold}
                      onChange={(e) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          largeTransactionThreshold: e.target.value,
                        }))
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suspicious-activity">
                      Suspicious Activity Reports
                    </Label>
                    <Switch
                      id="suspicious-activity"
                      checked={complianceFormData?.suspiciousActivityReports}
                      onCheckedChange={(value) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          suspiciousActivityReports: value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-returns">
                      Monthly Statistical Returns
                    </Label>
                    <Switch
                      id="monthly-returns"
                      checked={complianceFormData?.monthlyStatisticalReturns}
                      onCheckedChange={(value) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          monthlyStatisticalReturns: value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Internal Reporting
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="compliance-officer">
                      Compliance Officer Alerts
                    </Label>
                    <Select
                      value={complianceFormData?.complianceOfficerAlerts}
                      onValueChange={(value) => {
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          complianceOfficerAlerts: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          complianceOfficerAlerts: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select compliance officer alerts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                        <SelectItem value="DAILY_DIGEST">
                          Daily Digest
                        </SelectItem>
                        <SelectItem value="WEEKLY_SUMMARY">
                          Weekly Summary
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.complianceOfficerAlerts && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.complianceOfficerAlerts}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit-trail">
                      Audit Trail Retention (years)
                    </Label>
                    <Input
                      id="audit-trail"
                      type="number"
                      defaultValue="7"
                      min="5"
                      max="10"
                      value={complianceFormData?.auditTrailRetentionYears}
                      onChange={(e) =>
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          auditTrailRetentionYears: e.target.value,
                        }))
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="management-reports">
                      Management Reports
                    </Label>
                    <Select
                      value={complianceFormData?.managementReports}
                      onValueChange={(value) => {
                        setComplianceFormData((prev: any) => ({
                          ...prev,
                          managementReports: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          managementReports: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select management report" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.managementReports && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.managementReports}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 flex-wrap">
          <Button variant="outline">Test Configuration</Button>
          <Button variant="outline">Reset to Defaults</Button>
          <Button
            variant="business"
            onClick={() => handleComplianceConfiguration()}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeComplianceConfig;
