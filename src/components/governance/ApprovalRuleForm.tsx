import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Shield,
  Users,
  DollarSign,
  Trash2,
  ArrowRight,
  Info,
  Loader2,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import axios from "axios";

interface ApprovalRuleFormProps {
  trigger?: React.ReactNode;
  editRule?: any;
  onSuccess?: () => void;
}

const ApprovalRuleForm = ({
  trigger,
  editRule,
  onSuccess,
}: ApprovalRuleFormProps) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: editRule?.name || "",
    currencyCode: editRule?.currency || "",
    currencyId: editRule?.currencyId ? String(editRule.currencyId) : "",
    description: editRule?.description || "",
    minAmount: editRule?.minAmount || "",
    maxAmount: editRule?.maxAmount || "",
    department: editRule?.department || "All",
    transactionTypes: editRule?.transactionTypes || [],
    tiers: editRule?.tiers || [
      { level: 1, threshold: "", approvers: 1, roles: [] },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [currencies, setCurrencies] = useState<
    { currencyId: number; currencyCode: string }[]
  >([]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.name.trim()) {
      newErrors.ruleName = ["Rule name is required"];
    }

    if (!formData.currencyCode) {
      newErrors.currencyCode = ["Currency is required"];
    }

    if (formData.transactionTypes.length === 0) {
      newErrors.transactionTypes = ["Select at least one transaction type"];
    }

    formData.tiers.forEach((tier, index) => {
      if (!tier.threshold || Number(tier.threshold) <= 0) {
        newErrors[`tier-${index}-threshold`] = [
          "Threshold must be greater than 0",
        ];
      }
      if (tier.roles.length === 0) {
        newErrors[`tier-${index}-roles`] = [
          "Select at least one approver role",
        ];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCurrency = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout/config/governance-currencies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCurrencies(res?.data?.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, []);

  const departments = [
    "All",
    "Finance",
    "Treasury",
    "Operations",
    "HR",
    "Procurement",
  ];

  const transactionTypes = [
    "Single Transfer",
    "Bulk Transfer",
    // "Salary Payment",
    // "Supplier Payment",
    // "Invoice Payment",
  ];

  const approverRoles = [
    "Senior Manager",
    "Finance Manager",
    "Treasury Officer",
    "Operation Manager",
    "CEO",
    "CFO",
    "Transaction Manager",
    "Senior Approver",
    "Finance Clerk",
    "Compliance Officer",
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      currencyCode: "",
      currencyId: "",
      minAmount: "",
      maxAmount: "",
      department: "All",
      transactionTypes: [],
      tiers: [{ level: 1, threshold: "", approvers: 1, roles: [] }],
    });
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      tiers: [
        ...prev.tiers,
        {
          level: prev.tiers.length + 1,
          threshold: "",
          approvers: 1,
          roles: [],
        },
      ],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers
        .filter((_, i) => i !== index)
        .map((tier, i) => ({
          ...tier,
          level: i + 1,
        })),
    }));
  };

  const updateTier = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier,
      ),
    }));
  };

  const handleTransactionTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      transactionTypes: checked
        ? [...prev.transactionTypes, type]
        : prev.transactionTypes.filter((t) => t !== type),
    }));
    clearFieldError("transactionTypes");
  };

  const handleRoleChange = (
    tierIndex: number,
    role: string,
    checked: boolean,
  ) => {
    updateTier(
      tierIndex,
      "roles",
      checked
        ? [...formData.tiers[tierIndex].roles, role]
        : formData.tiers[tierIndex].roles.filter((r) => r !== role),
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    setError(null);
    setSuccess(false);
    setLoading(true);

    const payload = {
      ruleName: formData.name.trim(),
      currencyId: Number(formData.currencyId),
      currencyCode: formData.currencyCode,
      description: formData.description.trim(),
      minAmount: formData.minAmount ? Number(formData.minAmount) : 0,
      maxAmount: formData.maxAmount ? Number(formData.maxAmount) : 1000000,
      department:
        formData.department === "All"
          ? "ALL"
          : formData.department.toUpperCase(),
      transactionTypes: formData.transactionTypes.map((t) =>
        t
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/_TRANSFER$/, ""),
      ),
      approvalTiers: formData.tiers.map((tier) => ({
        tierOrder: tier.level,
        userTier: `TIER_${tier.level}`,
        thresholdAmount: Number(tier.threshold) || 0,
        approversRequired: Number(tier.approvers),
        eligibleRoles: tier.roles.map((r) =>
          r.toUpperCase().replace(/\s+/g, "_"),
        ),
      })),
    };

    if (!payload.ruleName) {
      setError("Rule name is required");
      setLoading(false);
      return;
    }
    if (
      payload.approvalTiers.some(
        (t) => !t.thresholdAmount || t.thresholdAmount <= 0,
      )
    ) {
      setError("All tiers must have a valid threshold amount");
      setLoading(false);
      return;
    }

    const method = editRule ? "PUT" : "POST";
    const url = editRule
      ? `${BASE_URL}/api/v1/business/governance-rules/${editRule.id}`
      : `${BASE_URL}/api/v1/business/governance-rules`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(true);

      setTimeout(() => {
        setOpen(false);
        resetForm();
        onSuccess?.();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create approval rule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && editRule) {
      setFormData({
        name: editRule.name || "",
        description: editRule.description || "",
        currencyId: editRule.currencyId ? String(editRule.currencyId) : "",
        currencyCode: editRule?.currency || "",
        minAmount: editRule.minAmount?.toString() || "",
        maxAmount: editRule.maxAmount?.toString() || "",
        department: editRule.department || "All",
        transactionTypes: (editRule.transactionTypes || [])?.map((t: string) =>
          t == "Single" || t == "Bulk" ? `${t} Transfer` : t,
        ),
        tiers: editRule.tiers?.map((tier: any) => ({
          level: tier.level,
          threshold: tier.threshold?.toString() || "",
          approvers: tier.approvers || 1,
          roles: tier.roles || [],
        })) || [{ level: 1, threshold: "", approvers: 1, roles: [] }],
      });
      setError(null);
      setSuccess(false);
    } else if (open && !editRule) {
      resetForm();
      setError(null);
      setSuccess(false);
    }
  }, [open, editRule]);

  useEffect(() => {
    if (!open) {
      resetForm();
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Approval Rule
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editRule
              ? "Edit Approval Rule"
              : "Create Multi-Tier Approval Rule"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rule Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruleName">
                    Rule Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={editRule?.id}
                    id="ruleName"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      clearFieldError("ruleName");
                    }}
                    placeholder="e.g., High Value USD Transactions"
                  />
                  {errors.ruleName?.map((msg, i) => (
                    <p key={i} className="text-sm text-destructive mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
                <div>
                  <Label htmlFor="currency">
                    Currency <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    disabled={editRule?.id}
                    value={formData.currencyCode}
                    onValueChange={(value) => {
                      const selected = currencies.find(
                        (c) => c.currencyCode === value,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        currencyCode: value,
                        currencyId: selected ? String(selected.currencyId) : "",
                      }));
                      clearFieldError("currencyCode");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.currencyCode} value={c.currencyCode}>
                          {c.currencyCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currencyCode?.map((msg, i) => (
                    <p key={i} className="text-sm text-destructive mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe when this approval rule applies..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Minimum Amount</Label>
                  <Input
                    type="number"
                    value={formData.minAmount}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minAmount: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Maximum Amount</Label>
                  <Input
                    type="number"
                    value={formData.maxAmount}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxAmount: e.target.value,
                      }))
                    }
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, department: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Applicable Transaction Types{" "}
                <span className="text-red-500">*</span>
              </CardTitle>
              {errors.transactionTypes && (
                <p className="text-sm text-destructive mt-2">
                  {errors.transactionTypes[0]}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {transactionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={formData?.transactionTypes?.includes(type)}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(type, !!checked)
                      }
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approval Tiers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Approval Tiers
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTier}
                  disabled={formData?.tiers?.length == 3}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-accent-muted/20 rounded-lg">
                  <Info className="h-4 w-4 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Define approval tiers based on transaction amounts. Higher
                    tiers require more approvers.
                  </p>
                </div>

                {formData.tiers.map((tier, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Tier {tier.level}</Badge>
                          {index > 0 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {formData.tiers.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTier(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>
                            Amount Threshold{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            value={tier.threshold}
                            onChange={(e) => {
                              updateTier(index, "threshold", e.target.value);
                              clearFieldError(`tier-${index}-threshold`);
                            }}
                            className={
                              errors[`tier-${index}-threshold`]
                                ? "border-destructive"
                                : ""
                            }
                            placeholder="Enter threshold amount"
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                          {errors[`tier-${index}-threshold`]?.map((msg, i) => (
                            <p
                              key={i}
                              className="text-sm text-destructive mt-1"
                            >
                              {msg}
                            </p>
                          ))}
                        </div>
                        <div>
                          <Label>Number of Approvers Required</Label>
                          <Select
                            value={tier.approvers.toString()}
                            onValueChange={(v) =>
                              updateTier(index, "approvers", parseInt(v))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                  {n} Approver{n > 1 ? "s" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Eligible Approver Roles
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {approverRoles.map((role) => (
                            <div
                              key={role}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`tier-${index}-role-${role}`}
                                checked={tier.roles.includes(role)}
                                onCheckedChange={(checked) => {
                                  handleRoleChange(index, role, !!checked);
                                }}
                              />
                              <Label
                                htmlFor={`tier-${index}-role-${role}`}
                                className="text-xs"
                              >
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors[`tier-${index}-roles`] && (
                          <p className="text-sm text-destructive mt-2">
                            {errors[`tier-${index}-roles`][0]}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm font-medium">
              Approval rule created successfully!
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="business"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editRule ? "Update Rule" : "Create Approval Rule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalRuleForm;
