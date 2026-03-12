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
} from "lucide-react";

import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { PermissionGate } from "@/contexts/PermissionGate";

const ExchangeComplianceConfig = () => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [rules, setRules] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [countryMap, setCountryMap] = useState<{ [key: string]: string }>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  const actions = [
    "FLAG",
    "MANUAL_REVIEW",
    "ENHANCED_SCREENING",
    "AUTO_REPORT_CBUAE",
    "BLOCK",
  ];
  const categories = ["REGULATORY", "AML", "SANCTIONS", "RISK_MANAGEMENT"];
  const frequencies = ["IMMEDIATE", "REALTIME", "DAILY", "WEEKLY"];
  const transactionTypes = ["SINGLE", "BULK"];

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
    try {
      const res = await fetch(`${BASE_URL}/api/v1/compliance/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
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

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
                    <Label>Name</Label>
                    <Input
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transaction Type</Label>
                      <Select
                        value={createForm.transactionType}
                        onValueChange={(v) =>
                          setCreateForm({ ...createForm, transactionType: v })
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
                      <Label>Payout Country</Label>
                      <Select
                        value={createForm.payoutCountry}
                        onValueChange={(v) =>
                          setCreateForm({ ...createForm, payoutCountry: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Threshold Amount</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={createForm.thresholdAmount}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            thresholdAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Input
                        placeholder="AED"
                        value={createForm.currency}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            currency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Action</Label>
                      <Select
                        value={createForm.action}
                        onValueChange={(v) =>
                          setCreateForm({ ...createForm, action: v })
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
                        value={createForm.frequency}
                        onValueChange={(v) =>
                          setCreateForm({ ...createForm, frequency: v })
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
                      value={createForm.category}
                      onValueChange={(v) =>
                        setCreateForm({ ...createForm, category: v })
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

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="shadow-card hover:shadow-lg transition-smooth"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon
                    className={`h-5 w-5 ${getStatusColor(metric.status)}`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getStatusColor(metric.status)}`}
                  >
                    {metric.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {metric.threshold}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regulatory Thresholds */}
        <Card className="shadow-card">
          <div className="flex p-6">
            <div className="flex-1">
              {/* <CardHeader> */}
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Transaction Monitoring Thresholds
              </CardTitle>
              {/* </CardHeader> */}
            </div>

            <div className="flex gap-2 items-end">
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
                            setEditForm(rule);
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
                <div className="grid grid-cols-2 gap-4">
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
                    <Label>Payout Country</Label>
                    <Select
                      value={editForm.payoutCountry}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, payoutCountry: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label>Currency</Label>
                    <Input
                      placeholder="AED"
                      value={editForm.currency || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, currency: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AML & Sanctions Screening
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Screening Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Real-time Sanctions Check</span>
                      <p className="text-xs text-muted-foreground">Screen against global sanctions lists</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">PEP Database Screening</span>
                      <p className="text-xs text-muted-foreground">Check politically exposed persons</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Adverse Media Monitoring</span>
                      <p className="text-xs text-muted-foreground">Monitor negative news and events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Enhanced Due Diligence</span>
                      <p className="text-xs text-muted-foreground">Additional checks for high-risk entities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Monitoring Intervals</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="sanctions-frequency">Sanctions List Update</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pep-frequency">PEP Database Refresh</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-frequency">Adverse Media Check</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Country Risk Configuration */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Country Risk Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">High Risk Countries</h4>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter country codes (e.g., AF, IR, KP)"
                    rows={4}
                    defaultValue="AF, IR, KP, MM, SY"
                  />
                  <p className="text-xs text-muted-foreground">Additional screening required</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Prohibited Countries</h4>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter country codes for blocked countries"
                    rows={4}
                    defaultValue="CU, IR, KP"
                  />
                  <p className="text-xs text-muted-foreground">Complete transaction blocking</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Enhanced Monitoring</h4>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Countries requiring enhanced monitoring"
                    rows={4}
                    defaultValue="BD, LK, PH, PK"
                  />
                  <p className="text-xs text-muted-foreground">Lower thresholds applied</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Reporting Configuration */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Regulatory Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">CBUAE Reporting</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="large-transaction">Large Transaction Threshold (AED)</Label>
                    <Input id="large-transaction" type="number" defaultValue="55000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suspicious-activity">Suspicious Activity Reports</Label>
                    <Switch id="suspicious-activity" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-returns">Monthly Statistical Returns</Label>
                    <Switch id="monthly-returns" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Internal Reporting</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="compliance-officer">Compliance Officer Alerts</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit-trail">Audit Trail Retention (years)</Label>
                    <Input id="audit-trail" type="number" defaultValue="7" min="5" max="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="management-reports">Management Reports</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        {/* <div className="flex justify-end space-x-3">
          <Button variant="outline">Test Configuration</Button>
          <Button variant="outline">Reset to Defaults</Button>
          <Button variant="business">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div> */}
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeComplianceConfig;
