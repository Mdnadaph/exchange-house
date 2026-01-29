import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Calculator,
  TrendingUp,
  Globe,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";

// --- Types ---
interface FeeRule {
  id: string | number;
  transactionType: string;
  payoutCountry: string;
  minAmount: number;
  maxAmount: number;
  feeType: string;
  feeValue: number | string;
  feeResponsibility: string;
  status: boolean | string;
}

const ExchangeFeeManagement = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  // --- States ---
  const [rules, setRules] = useState<FeeRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog Controls
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false); // Combined Create/Edit Dialog
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<number | string | null>(null);

  // Filter States
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);

  const [newFeeRule, setNewFeeRule] = useState({
    transactionType: "SINGLE",
    payoutCountry: "",
    minAmount: "",
    maxAmount: "",
    feeType: "FLAT",
    feeValue: "",
    feeResponsibility: "BUSINESS",
  });

  // --- Constants ---
  const countries = [
    { label: "India", value: "IN" },
    { label: "Philippines", value: "PH" },
    { label: "Bangladesh", value: "BD" },
    { label: "Pakistan", value: "PK" },
    { label: "Nepal", value: "NP" },
    { label: "Sri Lanka", value: "LK" },
  ];

  const transactionTypes = [
    { label: "Single Transaction", value: "SINGLE" },
    { label: "Bulk Transaction", value: "BULK" },
  ];

  const countryLabel = (code: string) =>
    countries.find((c) => c.value === code)?.label || code;

  // --- API Actions ---
  const fetchFeeRules = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCountry !== "all") params.country = selectedCountry;
      if (selectedType !== "all") params.transactionType = selectedType;

      const res = await axios.get(`${BASE_URL}/api/v3/fees`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const fetchedData = res.data?.data?.rules || res.data?.data || [];
      setRules(fetchedData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch fee rules",
        description: "Could not sync with the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async () => {
    if (!newFeeRule.payoutCountry || !newFeeRule.feeValue || !newFeeRule.transactionType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required (*) fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...newFeeRule,
        minAmount: Number(newFeeRule.minAmount) || 0,
        maxAmount: Number(newFeeRule.maxAmount) || 999999,
        feeValue: Number(newFeeRule.feeValue),
      };

      if (isEditing && editId) {
        await axios.put(`${BASE_URL}/api/v3/fees/update/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: "Success", description: "Fee rule updated successfully" });
      } else {
        await axios.post(`${BASE_URL}/api/v3/fees/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: "Success", description: "Fee rule created successfully" });
      }

      handleCloseFormDialog();
      fetchFeeRules();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: error.response?.data?.message || "Check your input and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedIdForDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/v3/fees/delete/${selectedIdForDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Deleted", description: "Fee rule disabled successfully" });
      fetchFeeRules();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    } finally {
      setIsConfirmDeleteDialogOpen(false);
      setSelectedIdForDelete(null);
    }
  };

  // --- Handlers ---
  const handleAddClick = () => {
    setIsEditing(false);
    setEditId(null);
    setNewFeeRule({
      transactionType: "SINGLE",
      payoutCountry: "",
      minAmount: "",
      maxAmount: "",
      feeType: "FLAT",
      feeValue: "",
      feeResponsibility: "BUSINESS",
    });
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (rule: FeeRule) => {
    setIsEditing(true);
    setEditId(rule.id);
    setNewFeeRule({
      transactionType: rule.transactionType,
      payoutCountry: rule.payoutCountry,
      minAmount: rule.minAmount.toString(),
      maxAmount: rule.maxAmount.toString(),
      feeType: rule.feeType,
      feeValue: rule.feeValue.toString(),
      feeResponsibility: rule.feeResponsibility,
    });
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
  };

  useEffect(() => {
    fetchFeeRules();
  }, [selectedCountry, selectedType]);

  // --- UI Helpers ---
  // const getStatusBadge = (status: boolean | string) => {
  //   const isActive = status === true || status === "ACTIVE" || status === "Active";
  //   return isActive ? (
  //     <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
  //       Active
  //     </Badge>
  //   ) : (
  //     <Badge variant="secondary">Inactive</Badge>
  //   );
  // };

   // ✅ ONLY ACTIVE RULES (LOGIC ONLY)
  const activeRules = rules.filter(
    (rule) => rule.status === "ACTIVE" || rule.status === true || rule.status === "Active"
  );

  const getStatusBadge = (status: boolean | string) => {
    const isActive = status === true || status === "ACTIVE" || status === "Active";
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const stats = [
    {
      title: "Total Fee Rules",
      value: rules.length.toString(),
      description: "Active configurations",
      icon: Calculator,
      color: "text-blue-600",
    },
    {
      title: "Countries Covered",
      value: new Set(rules.map((rule) => rule.payoutCountry)).size.toString(),
      description: "Fee structures defined",
      icon: Globe,
      color: "text-green-600",
    },
    {
      title: "Average Fee(Single)",
      value: rules.filter((r) => r.feeType === "FLAT").length.toString(),
      description: "Across All countries",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Active Rules",
      value: rules.filter((r) => r.status === true || r.status === "ACTIVE" || r.status === "Active").length.toString(),
      description: "Currently live",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* --- Header Section --- */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure transaction fees and charges for different countries and transaction types
            </p>
          </div>

          <Button className="shadow-sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" /> Add Fee Rule
          </Button>
        </div>

        {/* --- Create/Edit Dialog --- */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Update Fee Rule" : "Create New Fee Rule"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Transaction Type *</Label>
                <Select
                  value={newFeeRule.transactionType}
                  onValueChange={(v) => setNewFeeRule({ ...newFeeRule, transactionType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payout Country *</Label>
                <Select
                  value={newFeeRule.payoutCountry}
                  onValueChange={(v) => setNewFeeRule({ ...newFeeRule, payoutCountry: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Amount (AED)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFeeRule.minAmount}
                  onChange={(e) => setNewFeeRule({ ...newFeeRule, minAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Amount (AED)</Label>
                <Input
                  type="number"
                  placeholder="999999"
                  value={newFeeRule.maxAmount}
                  onChange={(e) => setNewFeeRule({ ...newFeeRule, maxAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fee Structure *</Label>
                <Select
                  value={newFeeRule.feeType}
                  onValueChange={(v) => setNewFeeRule({ ...newFeeRule, feeType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAT">Flat Fee (AED)</SelectItem>
                    <SelectItem value="BPS">BPS (Basis Points %)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Fee Value * {newFeeRule.feeType === "BPS" ? "(in basis points)" : "(in AED)"}
                </Label>
                <Input
                  type="number"
                  placeholder={newFeeRule.feeType === "BPS" ? "50" : "25"}
                  value={newFeeRule.feeValue}
                  onChange={(e) => setNewFeeRule({ ...newFeeRule, feeValue: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Fee Responsibility *</Label>
                <Select
                  value={newFeeRule.feeResponsibility}
                  onValueChange={(v) => setNewFeeRule({ ...newFeeRule, feeResponsibility: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUSINESS">Business Pays (Markup)</SelectItem>
                    <SelectItem value="BENEFICIARY">Beneficiary Pays (Deduction)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Business Pays: Fee added to transaction cost | Beneficiary Pays: Fee deducted from
                  payout
                </p>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleCloseFormDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveRule} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Fee Rule" : "Create Fee Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Statistics Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-sm bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted/50`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- Main Configuration Table --- */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Fee Rules Configuration
            </CardTitle>

            <div className="flex gap-4 mt-4">
              <div className="w-44">
                <Label>Filter by Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Label>Filter by Transaction Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {transactionTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Transaction Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Amount Range (AED)</TableHead>
                  <TableHead>Fee Structure</TableHead>
                  <TableHead>Fee Value</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

               <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : activeRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No active configurations found.
                  </TableCell>
                </TableRow>
              ) : (
                activeRules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-6 font-medium capitalize">
                      {rule.transactionType.toLowerCase().replace("_", " ")}
                    </TableCell>
                    <TableCell>{countryLabel(rule.payoutCountry)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {rule.minAmount?.toLocaleString()} – {rule.maxAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {rule.feeType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-primary">
                      {rule.feeType === "BPS"
                        ? `${rule.feeValue} BPS`
                        : `AED ${rule.feeValue}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={rule.feeResponsibility === "BUSINESS" ? "default" : "secondary"}
                        className="capitalize text-[10px]"
                      >
                        {rule.feeResponsibility.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(rule.status)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:text-primary"
                          onClick={() => handleEditClick(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedIdForDelete(rule.id);
                            setIsConfirmDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* --- Delete Confirmation Dialog --- */}
        <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600 h-6 w-6" />
              </div>
              <DialogTitle className="text-center">Are you sure want to delete it?</DialogTitle>
              <DialogDescription className="text-center">
                This action will permanently remove this fee rule configuration from the system.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-3 sm:justify-center mt-2">
              <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRule}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeFeeManagement;