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
import { usePermission } from "@/hooks/usePermission";
import { PermissionGate } from "@/contexts/PermissionGate";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationSummary from "@/components/PaginationSummary";
import PaginationControl from "@/components/PaginationControl";

// --- Types ---
interface FeeRule {
  vat: number;
  id: string | number;
  transactionType: string;
  payoutCountry: string;
  minAmount: number;
  maxAmount: number;
  feeType: string | null;
  feeValue: number | null;
  countryName: string | null;
  feeResponsibility: string;
  status: boolean | string;
  businessFeeType: string | null;
  businessFeeValue: number | null;
  beneficiaryFeeType: string | null;
  beneficiaryFeeValue: number | null;
  sharedBusinessFeeType: string | null;
  sharedBusinessFeeValue: number | null;
  sharedBeneficiaryFeeType: string | null;
  sharedBeneficiaryFeeValue: string | null;
  bulkTotalBeneficiary: null | number;
  bulkTotalAmount: null | number;
}

const ExchangeFeeManagement = () => {
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies?.token;
  const currencyCode = cookies?.currencyCode;

  const { toast } = useToast();

  // --- States ---
  const [rules, setRules] = useState<FeeRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutCountryData, setPayoutCountryData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [apiValidatioError, setApiValidationError] = useState<any>({});

  // Dialog Controls
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false); // Combined Create/Edit Dialog
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<
    number | string | null
  >(null);

  // Filter States
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [newFeeRule, setNewFeeRule] = useState({
    transactionType: "SINGLE",
    payoutCountry: "",
    bulkTotalAmount: "",
    bulkTotalBeneficiary: "",
    vat: "",
    feeType: "FLAT",
    feeValue: "",
    businessFeeEnabled: true,
    beneficiaryFeeEnabled: true,
    sharedFeeEnabled: true,
    businessFeeType: "",
    businessFeeValue: "",
    beneficiaryFeeType: "",
    beneficiaryFeeValue: "",
    sharedBusinessFeeType: "",
    sharedBusinessFeeValue: "",
    sharedBeneficiaryFeeType: "",
    sharedBeneficiaryFeeValue: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const clearFormError = (field: string) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Transaction Type
    if (!newFeeRule.transactionType) {
      errors.transactionType = "Transaction type is required";
    }

    if (newFeeRule?.transactionType == "BULK") {
      if (!newFeeRule.bulkTotalAmount) {
        errors.bulkTotalAmount = "Bulk total amount  is required";
      } else if (Number(newFeeRule.bulkTotalAmount) < 0) {
        errors.bulkTotalAmount = "Bulk Total Amount is not negative";
      }

      if (!newFeeRule.bulkTotalBeneficiary) {
        errors.bulkTotalBeneficiary = "Bulk total beneficiary  is required";
      } else if (Number(newFeeRule.bulkTotalBeneficiary) < 0) {
        errors.bulkTotalBeneficiary = "Bulk total beneficiary is required";
      }
    }

    // Payout Country
    if (newFeeRule?.transactionType == "SINGLE") {
      if (!newFeeRule.payoutCountry) {
        errors.payoutCountry = "Payout country is required";
      }
    }

    // VAT
    if (!newFeeRule.vat) {
      errors.vat = "VAT is required"; // ✅ FIXED KEY
    } else if (Number(newFeeRule.vat) < 0) {
      errors.vat = "VAT cannot be negative";
    }

    // Business Fee
    if (!newFeeRule.businessFeeType) {
      errors.businessFeeType = "Business fee type is required";
    }

    if (!newFeeRule.businessFeeValue) {
      errors.businessFeeValue = "Business fee value is required";
    } else if (Number(newFeeRule.businessFeeValue) <= 0) {
      errors.businessFeeValue = "Must be greater than 0";
    }
    if (newFeeRule?.transactionType == "SINGLE") {
      // Beneficiary Fee
      if (!newFeeRule.beneficiaryFeeType) {
        errors.beneficiaryFeeType = "Beneficiary fee type is required";
      }

      if (!newFeeRule.transactionType) {
        errors.transactionType = "Transaction type is required";
      }

      if (!newFeeRule.beneficiaryFeeValue) {
        errors.beneficiaryFeeValue = "Beneficiary fee value is required";
      } else if (Number(newFeeRule.beneficiaryFeeValue) <= 0) {
        errors.beneficiaryFeeValue = "Must be greater than 0";
      }

      // Shared - Business
      if (!newFeeRule.sharedBusinessFeeType) {
        errors.sharedBusinessFeeType = "Shared Business Fee Type is Required";
      }

      if (!newFeeRule.sharedBusinessFeeValue) {
        errors.sharedBusinessFeeValue = "Shared Business Fee Value is Required";
      } else if (Number(newFeeRule.sharedBusinessFeeValue) <= 0) {
        errors.sharedBusinessFeeValue = "Must be greater than 0";
      }

      // Shared - Beneficiary
      if (!newFeeRule.sharedBeneficiaryFeeType) {
        errors.sharedBeneficiaryFeeType = "Shared Beneficiary Type is Required";
      }

      if (!newFeeRule.sharedBeneficiaryFeeValue) {
        errors.sharedBeneficiaryFeeValue =
          "Shared Beneficiary Fee Value is Required";
      } else if (Number(newFeeRule.sharedBeneficiaryFeeValue) <= 0) {
        errors.sharedBeneficiaryFeeValue = "Must be greater than 0";
      }
    }

    setFormErrors(errors);

    console.log("Validation Errors:", errors); // 🔍 debug

    return Object.keys(errors).length === 0;
  };

  // --- Constants ---
  // const countries = [
  //   { label: "India", value: "IN" },
  //   { label: "Philippines", value: "PH" },
  //   { label: "Bangladesh", value: "BD" },
  //   { label: "Pakistan", value: "PK" },
  //   { label: "Nepal", value: "NP" },
  //   { label: "Sri Lanka", value: "LK" },
  //   { label: "United Arab Emirates", value: "AE" },
  //   { label: "Qatar", value: "QA" },
  // ];

  const transactionTypes = [
    { label: "Single Transaction", value: "SINGLE" },
    { label: "Bulk Transaction", value: "BULK" },
  ];

  const countryLabel = (code: string) =>
    countries.find((c) => c.value === code)?.label || code;

  const transactionTypeLabel = (value: string) =>
    transactionTypes.find((t) => t.value === value)?.label || value;

  const formatFee = (
    type: string | null,
    value: number | null | string,
  ): string => {
    if (!type || value == null) return "";
    if (type === "FLAT") return `${currencyCode} ${value}`;
    if (type === "BPS") return `${value} BPS`;
    return `${value} ${type}`;
  };

  // --- API Actions ---
  const fetchFeeRules = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCountry !== "all") params.country = selectedCountry;
      if (selectedType !== "all") params.transactionType = selectedType;
      params.page = pagination.pageNumber;
      params.pageSize = pagination.pageSize;

      const res = await axios.get(`${BASE_URL}/api/v3/fees`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const fetchedData = res.data?.data?.rules || res.data?.data || [];
      setRules(fetchedData);
      setPagination((prev) => ({
        ...prev,
        pageNumber: res?.data?.data?.pagination?.page,
        totalPages: res?.data?.data?.pagination?.totalPages,
        totalElements: res?.data?.data?.pagination?.totalItems,
      }));
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

  const getPayoutCountryList = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout/config/beneficiary/enabled`,
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

  const getCountriesData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/config/countries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setCountries(json?.data);
    } catch (error) {
      const msg = error.message || "Failed to load countries";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };
  // State for destinations
  useEffect(() => {
    getCountriesData();
  }, []);

  const handleSaveRule = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let singlePayload: any = {
        transactionType: newFeeRule.transactionType,
        payoutCountry: newFeeRule.payoutCountry,
        vat: Number(newFeeRule.vat) || 0,
        bulkTotalAmount: Number(newFeeRule?.bulkTotalAmount) || 0,
        bulkTotalBeneficiary: Number(newFeeRule?.bulkTotalBeneficiary) || 0,
        // maxAmount: Number(newFeeRule.maxAmount) || 999999,
        businessFeeEnabled: newFeeRule.businessFeeEnabled,
        beneficiaryFeeEnabled: newFeeRule.beneficiaryFeeEnabled,
        sharedFeeEnabled: newFeeRule.sharedFeeEnabled,
        businessFeeType: newFeeRule.businessFeeType,
        businessFeeValue: Number(newFeeRule.businessFeeValue),
        beneficiaryFeeType: newFeeRule.beneficiaryFeeType,
        beneficiaryFeeValue: Number(newFeeRule.beneficiaryFeeValue),
        // feeType: newFeeRule.feeType,
        // feeValue: Number(newFeeRule.feeValue),
        sharedBusinessFeeType: newFeeRule?.sharedBusinessFeeType,
        sharedBusinessFeeValue: Number(newFeeRule?.sharedBusinessFeeValue),
        sharedBeneficiaryFeeType: newFeeRule?.sharedBeneficiaryFeeType,
        sharedBeneficiaryFeeValue: Number(
          newFeeRule?.sharedBeneficiaryFeeValue,
        ),
      };

      let bulkPayload = {
        transactionType: newFeeRule.transactionType,
        vat: Number(newFeeRule.vat) || 0,
        bulkTotalAmount: Number(newFeeRule?.bulkTotalAmount) || 0,
        bulkTotalBeneficiary: Number(newFeeRule?.bulkTotalBeneficiary) || 0,
        businessFeeEnabled: newFeeRule.businessFeeEnabled,
        businessFeeType: newFeeRule.businessFeeType,
        businessFeeValue: Number(newFeeRule.businessFeeValue),
      };

      // if (newFeeRule.feeResponsibility === "SHARED") {
      //   payload.businessFeeType = newFeeRule.businessFeeType;
      //   payload.businessFeeValue = Number(newFeeRule.businessFeeValue);
      //   payload.beneficiaryFeeType = newFeeRule.beneficiaryFeeType;
      //   payload.beneficiaryFeeValue = Number(newFeeRule.beneficiaryFeeValue);
      // } else {
      //   payload.feeType = newFeeRule.feeType;
      //   payload.feeValue = Number(newFeeRule.feeValue);
      // }
      const payload =
        newFeeRule?.transactionType == "SINGLE" ? singlePayload : bulkPayload;
      if (isEditing && editId) {
        const res = await axios.put(
          `${BASE_URL}/api/v3/fees/update/${editId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res?.data?.status) {
          toast({
            title: "Success",
            description: res?.data?.message || "Fee rule updated successfully",
          });
        } else {
          toast({
            title: "Action Failed",
            description: res?.data?.message || "Failed to update Fee rule.",
            variant: "destructive",
          });
        }
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/v3/fees/create`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res?.data?.status) {
          toast({
            title: "Success",
            description: res?.data?.message || "Fee rule created successfully",
          });
        } else {
          toast({
            title: "Action Failed",
            description: res?.data?.message || "Failed to create Fee rule.",
            variant: "destructive",
          });
        }
      }
      handleCloseFormDialog();
      fetchFeeRules();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description:
          error.response?.data?.message || "Check your input and try again.",
      });
      console.log("fdhdfjhfdj");
      setApiValidationError(error?.response?.data?.data);
      console.log("res", error?.response?.data?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedIdForDelete) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/v3/fees/delete/${selectedIdForDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast({
        title: "Deleted",
        description: "Fee rule disabled successfully",
      });
      fetchFeeRules();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    } finally {
      setIsConfirmDeleteDialogOpen(false);
      setSelectedIdForDelete(null);
    }
  };

  // --- Handlers ---
  // const handleAddClick = () => {
  //   setIsEditing(false);
  //   setEditId(null);
  //   setNewFeeRule({
  //     transactionType: "SINGLE",
  //     payoutCountry: "",
  //     vat: "",
  //     // maxAmount: "",
  //     feeType: "FLAT",
  //     feeValue: "",
  //     feeResponsibility: "BUSINESS",
  //     businessFeeType: "",
  //     businessFeeValue: "",
  //     beneficiaryFeeType: "",
  //     beneficiaryFeeValue: "",
  //   });
  //   setIsFormDialogOpen(true);
  // };
  const handleAddClick = () => {
    setIsEditing(false);
    setEditId(null);
    setNewFeeRule({
      transactionType: "SINGLE",
      bulkTotalAmount: "",
      bulkTotalBeneficiary: "",
      payoutCountry: "",
      vat: "",
      // maxAmount: "",
      feeType: "FLAT",
      feeValue: "",
      businessFeeEnabled: true,
      beneficiaryFeeEnabled: true,
      sharedFeeEnabled: true,
      businessFeeType: "",
      businessFeeValue: "",
      beneficiaryFeeType: "",
      beneficiaryFeeValue: "",
      sharedBusinessFeeType: "",
      sharedBusinessFeeValue: "",
      sharedBeneficiaryFeeType: "",
      sharedBeneficiaryFeeValue: "",
    });
    setIsFormDialogOpen(true);
  };

  // const handleEditClick = (rule: FeeRule) => {
  //   setIsEditing(true);
  //   setEditId(rule.id);
  //   setNewFeeRule({
  //     transactionType: rule?.transactionType,
  //     payoutCountry: rule?.payoutCountry,
  //     vat: rule?.vat?.toString(),
  //     feeType: rule?.feeType || "FLAT",
  //     feeValue: rule?.feeValue?.toString() || "",
  //     feeResponsibility: rule?.feeResponsibility,
  //     businessFeeType: rule?.businessFeeType || "",
  //     businessFeeValue: rule?.businessFeeValue?.toString() || "",
  //     beneficiaryFeeType: rule?.beneficiaryFeeType || "",
  //     beneficiaryFeeValue: rule?.beneficiaryFeeValue?.toString() || "",
  //   });
  //   setIsFormDialogOpen(true);
  // };
  const handleEditClick = (rule: FeeRule) => {
    setIsEditing(true);
    setEditId(rule.id);
    setNewFeeRule({
      transactionType: rule?.transactionType,
      payoutCountry: rule?.payoutCountry,
      bulkTotalAmount: rule?.bulkTotalAmount?.toString(),
      bulkTotalBeneficiary: rule?.bulkTotalBeneficiary?.toString(),
      vat: rule?.vat?.toString(),
      feeType: rule?.feeType || "FLAT",
      feeValue: rule?.feeValue?.toString() || "",
      businessFeeEnabled: true,
      beneficiaryFeeEnabled: true,
      sharedFeeEnabled: true,
      businessFeeType: rule?.businessFeeType || "",
      businessFeeValue: rule?.businessFeeValue?.toString() || "",
      beneficiaryFeeType: rule?.beneficiaryFeeType || "",
      beneficiaryFeeValue: rule?.beneficiaryFeeValue?.toString() || "",
      sharedBusinessFeeType: rule?.sharedBusinessFeeType || "",
      sharedBusinessFeeValue: rule?.sharedBusinessFeeValue?.toString() || "",
      sharedBeneficiaryFeeType: rule?.sharedBeneficiaryFeeType || "",
      sharedBeneficiaryFeeValue:
        rule?.sharedBeneficiaryFeeValue?.toString() || "",
    });
    setIsFormDialogOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination?.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setApiValidationError({});
    setFormErrors({});
  };

  useEffect(() => {
    fetchFeeRules();
  }, [selectedCountry, selectedType, pagination?.pageNumber]);

  // --- UI Helpers ---
  const activeRules = rules.filter((rule) => rule.status === "ACTIVE");

  const getStatusBadge = (status: boolean | string) => {
    const isActive =
      status === true || status === "ACTIVE" || status === "Active";
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
    //{
    //  title: "Average Fee (Single)",
    //  value: "AED 32",
    //  description: "Across all countries",
    //  icon: DollarSign,
    //  color: "text-purple-600",
    //},
    //{
    //  title: "Revenue This Month",
    //  value: "AED 45,280",
    //  description: "From transaction fees",
    //  icon: TrendingUp,
    //  color: "text-orange-600",
    //},
  ];

  const clearApiValidationError = (field: string) => {
    setApiValidationError((prev) => ({
      ...prev,
      [field]: [],
    }));
  };

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Fee Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Configure transaction fees and charges for different countries and
              transaction types
            </p>
          </div>
          {/*<Button className="shadow-sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" /> Add Fee Rule
          </Button>*/}
          <PermissionGate permission="BTN_CREATE_FEE_RULE">
            <Button className="shadow-sm" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Fee Rule
            </Button>
          </PermissionGate>
        </div>

        {/* --- Create/Edit Dialog --- */}
        <Dialog
          open={isFormDialogOpen}
          onOpenChange={(open) => {
            setIsFormDialogOpen(open);
            if (!open) {
              setApiValidationError({});
              setFormErrors({});
            }
          }}
        >
          <DialogContent
            className={`max-w-2xl ${newFeeRule?.transactionType == "SINGLE" ? "h-[90vh]" : ""}`}
          >
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Update Fee Rule" : "Create New Fee Rule"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    Transaction Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    disabled={!!editId}
                    value={newFeeRule?.transactionType}
                    onValueChange={(v) => {
                      setNewFeeRule({ ...newFeeRule, transactionType: v });
                      clearFormError("transactionType");
                      clearApiValidationError("transactionType");
                    }}
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
                  {formErrors.transactionType && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.transactionType}
                    </p>
                  )}
                  {apiValidatioError?.transactionType && (
                    <p className="text-sm text-red-500">
                      {apiValidatioError?.transactionType[0]}
                    </p>
                  )}
                </div>
                {newFeeRule?.transactionType == "SINGLE" && (
                  <div>
                    <Label>
                      Payout Country <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newFeeRule.payoutCountry}
                      onValueChange={(v) => {
                        setNewFeeRule({ ...newFeeRule, payoutCountry: v });
                        clearFormError("payoutCountry");
                        clearApiValidationError("payoutCountry");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {payoutCountryData?.map((c) => (
                          <SelectItem key={c?.id} value={c?.countryCode}>
                            {c?.countryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.payoutCountry && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.payoutCountry}
                      </p>
                    )}
                    {apiValidatioError?.payoutCountry && (
                      <p className="text-sm text-red-500">
                        {apiValidatioError?.payoutCountry[0]}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label>VAT</Label> <span className="text-red-500">*</span>
                <Input
                  type="number"
                  placeholder="Enter VAT"
                  value={newFeeRule.vat}
                  onChange={(e) => {
                    setNewFeeRule({
                      ...newFeeRule,
                      vat: e.target.value,
                    });
                    clearFormError("vat");
                    clearApiValidationError("vat");
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {formErrors.vat && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.vat}</p>
                )}
                {apiValidatioError?.vat && (
                  <p className="text-sm text-red-500">
                    {apiValidatioError?.vat[0]}
                  </p>
                )}
              </div>
              {newFeeRule?.transactionType == "BULK" && (
                <div>
                  <Label>Total Benefeciary</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="number"
                    placeholder="Enter Total Benefeciary"
                    value={newFeeRule.bulkTotalBeneficiary}
                    onChange={(e) => {
                      setNewFeeRule({
                        ...newFeeRule,
                        bulkTotalBeneficiary: e.target.value,
                      });
                      clearFormError("bulkTotalBeneficiary");
                      clearApiValidationError("bulkTotalBeneficiary");
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  {formErrors?.bulkTotalBeneficiary && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors?.bulkTotalBeneficiary}
                    </p>
                  )}
                  {apiValidatioError?.bulkTotalBeneficiary && (
                    <p className="text-sm text-red-500">
                      {apiValidatioError?.bulkTotalBeneficiary[0]}
                    </p>
                  )}
                </div>
              )}

              {newFeeRule?.transactionType == "BULK" && (
                <div>
                  <Label>Total Amount</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="number"
                    placeholder="Enter Total Amount"
                    value={newFeeRule.bulkTotalAmount}
                    onChange={(e) => {
                      setNewFeeRule({
                        ...newFeeRule,
                        bulkTotalAmount: e.target.value,
                      });
                      clearFormError("bulkTotalAmount");
                      clearApiValidationError("bulkTotalAmount");
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  {formErrors?.bulkTotalAmount && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors?.bulkTotalAmount}
                    </p>
                  )}
                  {apiValidatioError?.bulkTotalAmount && (
                    <p className="text-sm text-red-500">
                      {apiValidatioError?.bulkTotalAmount[0]}
                    </p>
                  )}
                </div>
              )}

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Amount (AED)</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newFeeRule.minAmount}
                    onChange={(e) => {
                      setNewFeeRule({
                        ...newFeeRule,
                        minAmount: e.target.value,
                      });
                      clearFormError("minAmount");
                    }}
                  />
                  {formErrors.minAmount && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.minAmount}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Max Amount (AED)</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={newFeeRule.maxAmount}
                    onChange={(e) => {
                      setNewFeeRule({
                        ...newFeeRule,
                        maxAmount: e.target.value,
                      });
                      clearFormError("maxAmount");
                    }}
                  />
                  {formErrors.maxAmount && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.maxAmount}
                    </p>
                  )}
                </div>
              </div> */}
              <div>
                <Label>
                  Fee Responsibility <span className="text-red-500">*</span>
                </Label>
                <Input value="BUSINESS" disabled onChange={() => {}} />

                {/* {formErrors.feeType && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.feeType}
                  </p>
                )} */}
                {/* <p className="text-xs text-muted-foreground mt-1">
                  "Fee added to transaction cost (visible to Business)
                  {!newFeeRule.feeResponsibility &&
                    "Select who is responsible for paying the fee"}
                </p> */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Fee Structure </Label>
                  <span className="text-red-500">*</span>
                  <Select
                    value={newFeeRule.businessFeeType}
                    onValueChange={(v) => {
                      setNewFeeRule({ ...newFeeRule, businessFeeType: v });
                      clearFormError("businessFeeType");
                      clearApiValidationError("businessFeeType");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Businss Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLAT">
                        Flat Fee {currencyCode}
                      </SelectItem>
                      <SelectItem value="BPS">BPS (Basis Points %)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.businessFeeType && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.businessFeeType}
                    </p>
                  )}
                  {apiValidatioError?.businessFeeType && (
                    <p className="text-sm text-red-500">
                      {apiValidatioError?.businessFeeType[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Business Fee Value <span className="text-red-500">*</span>
                    {newFeeRule.businessFeeType === "BPS"
                      ? "(in basis points)"
                      : `(in ${currencyCode})`}
                  </Label>
                  <Input
                    onWheel={(e) => e.currentTarget.blur()}
                    type="number"
                    placeholder={
                      newFeeRule.businessFeeType === "BPS" ? "50 (0.5%)" : "25"
                    }
                    value={newFeeRule.businessFeeValue}
                    onChange={(e) => {
                      setNewFeeRule({
                        ...newFeeRule,
                        businessFeeValue: e.target.value,
                      });
                      clearFormError("businessFeeValue");
                      clearApiValidationError("businessFeeValue");
                    }}
                  />
                  {formErrors.businessFeeValue && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.businessFeeValue}
                    </p>
                  )}
                  {apiValidatioError?.businessFeeValue && (
                    <p className="text-sm text-red-500">
                      {apiValidatioError?.businessFeeValue[0]}
                    </p>
                  )}
                </div>
              </div>
              {newFeeRule?.transactionType == "SINGLE" && (
                <div className="w-full">
                  <div>
                    <Label>
                      Fee Responsibility <span className="text-red-500">*</span>
                    </Label>
                    <Input value="BENEFICIARY" disabled onChange={() => {}} />

                    {/* {formErrors.feeType && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.feeType}
                  </p>
                )} */}
                    {/* <p className="text-xs text-muted-foreground mt-1">
                  {newFeeRule.feeResponsibility === "BENEFICIARY" &&
                    "Fee deducted from payout amount (not shown to Business)"}

                  {!newFeeRule.feeResponsibility &&
                    "Select who is responsible for paying the fee"}
                </p> */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Beneficiary Fee Structure </Label>
                      <span className="text-red-500">*</span>
                      <Select
                        value={newFeeRule?.beneficiaryFeeType}
                        onValueChange={(v) => {
                          setNewFeeRule({
                            ...newFeeRule,
                            beneficiaryFeeType: v,
                          });
                          clearFormError("beneficiaryFeeType");
                          clearApiValidationError("beneficiaryFeeType");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select beneficiary Fee Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FLAT">
                            Flat Fee ({currencyCode})
                          </SelectItem>
                          <SelectItem value="BPS">
                            BPS (Basis Points %)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.beneficiaryFeeType && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.beneficiaryFeeType}
                        </p>
                      )}
                      {apiValidatioError?.beneficiaryFeeType && (
                        <p className="text-sm text-red-500">
                          {apiValidatioError?.beneficiaryFeeType[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>
                        Beneficiary Fee Value{" "}
                        <span className="text-red-500">*</span>
                        {newFeeRule.beneficiaryFeeType === "BPS"
                          ? "(in basis points)"
                          : `(in ${currencyCode})`}
                      </Label>
                      <Input
                        onWheel={(e) => e.currentTarget.blur()}
                        type="number"
                        placeholder={
                          newFeeRule.beneficiaryFeeType === "BPS"
                            ? "50 (0.5%)"
                            : "25"
                        }
                        value={newFeeRule.beneficiaryFeeValue}
                        onChange={(e) => {
                          setNewFeeRule({
                            ...newFeeRule,
                            beneficiaryFeeValue: e.target.value,
                          });
                          clearFormError("beneficiaryFeeValue");
                          clearApiValidationError("beneficiaryFeeValue");
                        }}
                      />
                      {formErrors.beneficiaryFeeValue && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.beneficiaryFeeValue}
                        </p>
                      )}
                      {apiValidatioError?.beneficiaryFeeValue && (
                        <p className="text-sm text-red-500">
                          {apiValidatioError?.beneficiaryFeeValue[0]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>
                      Shared Fee Responsibility{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input value="SHARED" disabled onChange={() => {}} />

                    {/* <p className="text-xs text-muted-foreground mt-1">
                  {newFeeRule.feeResponsibility === "SHARED" &&
                    "Business pays known portion; Beneficiary portion deducted from payout (not shown to Business)"}
                  {!newFeeRule.feeResponsibility &&
                    "Select who is responsible for paying the fee"}
                </p> */}
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-medium text-sm">
                      Shared Fee Configuration
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>
                          Business Fee Type{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newFeeRule.sharedBusinessFeeType}
                          onValueChange={(v) => {
                            setNewFeeRule({
                              ...newFeeRule,
                              sharedBusinessFeeType: v,
                            });
                            clearFormError("sharedBusinessFeeType");
                            clearApiValidationError("sharedBusinessFeeType");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FLAT">
                              Flat Fee ({currencyCode})
                            </SelectItem>
                            <SelectItem value="BPS">
                              BPS (Basis Points %)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <p className="text-xs text-muted-foreground mt-1">
                      "Fee added to transaction cost (visible to Business)"
                    </p> */}
                        {formErrors.sharedBusinessFeeType && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.sharedBusinessFeeType}
                          </p>
                        )}
                        {apiValidatioError?.sharedBusinessFeeType && (
                          <p className="text-sm text-red-500">
                            {apiValidatioError?.sharedBusinessFeeType[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>
                          Business Fee Value{" "}
                          <span className="text-red-500">*</span>{" "}
                          {newFeeRule.sharedBusinessFeeType === "BPS"
                            ? "(BPS)"
                            : `(${currencyCode})`}
                        </Label>
                        <Input
                          type="number"
                          placeholder={
                            newFeeRule.sharedBusinessFeeType === "BPS"
                              ? "25 (0.25%)"
                              : "35"
                          }
                          value={newFeeRule.sharedBusinessFeeValue}
                          onChange={(e) => {
                            setNewFeeRule({
                              ...newFeeRule,
                              sharedBusinessFeeValue: e.target.value,
                            });
                            clearFormError("sharedBusinessFeeValue");
                            clearApiValidationError("sharedBusinessFeeValue");
                          }}
                        />
                        {formErrors.sharedBusinessFeeValue && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.sharedBusinessFeeValue}
                          </p>
                        )}
                        {apiValidatioError?.sharedBusinessFeeValue && (
                          <p className="text-sm text-red-500">
                            {apiValidatioError?.sharedBusinessFeeValue[0]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>
                          Beneficiary Fee Type{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={newFeeRule.sharedBeneficiaryFeeType}
                          onValueChange={(v) => {
                            setNewFeeRule({
                              ...newFeeRule,
                              sharedBeneficiaryFeeType: v,
                            });
                            clearFormError("sharedBeneficiaryFeeType");
                            clearApiValidationError("sharedBeneficiaryFeeType");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FLAT">
                              Flat Fee ({currencyCode})
                            </SelectItem>
                            <SelectItem value="BPS">
                              BPS (Basis Points %)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <p className="text-xs text-muted-foreground mt-1">
                      "Fee deducted from payout amount (not shown to Business)"
                    </p> */}
                        {formErrors.sharedBeneficiaryFeeType && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.sharedBeneficiaryFeeType}
                          </p>
                        )}
                        {apiValidatioError?.sharedBeneficiaryFeeType && (
                          <p className="text-sm text-red-500">
                            {apiValidatioError?.sharedBeneficiaryFeeType[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>
                          Beneficiary Fee Value{" "}
                          <span className="text-red-500">*</span>{" "}
                          {newFeeRule.sharedBeneficiaryFeeType === "BPS"
                            ? "(BPS)"
                            : `(${currencyCode})`}
                        </Label>
                        <Input
                          onWheel={(e) => e.currentTarget.blur()}
                          type="number"
                          placeholder={
                            newFeeRule.sharedBeneficiaryFeeType === "BPS"
                              ? "25 (0.25%)"
                              : "10"
                          }
                          value={newFeeRule.sharedBeneficiaryFeeValue}
                          onChange={(e) => {
                            setNewFeeRule({
                              ...newFeeRule,
                              sharedBeneficiaryFeeValue: e.target.value,
                            });
                            clearFormError("sharedBeneficiaryFeeValue");
                            clearApiValidationError(
                              "sharedBeneficiaryFeeValue",
                            );
                          }}
                        />
                        {formErrors.sharedBeneficiaryFeeValue && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.sharedBeneficiaryFeeValue}
                          </p>
                        )}
                        {apiValidatioError?.sharedBeneficiaryFeeValue && (
                          <p className="text-sm text-red-500">
                            {apiValidatioError?.sharedBeneficiaryFeeValue[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleCloseFormDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveRule} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update Fee Rule" : "Create Fee Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Statistics Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-sm bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
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
        <Card className="shadow-card mb-3">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-full md:w-[300px]">
                <Label className="mb-1 block">Filter by Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setSelectedCountry(value);
                    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c?.isoCode} value={c?.isoCode}>
                        {c?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[300px]">
                <Label className="mb-1 block">Filter by Transaction Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
                  }}
                >
                  <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* --- Main Configuration Table --- */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between flex-wrap">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fee Rules Configuration
              </div>
              <PaginationSummary
                totalElements={pagination?.totalElements}
                pageSize={pagination?.pageSize}
                currentPage={pagination?.pageNumber}
                itemCount={activeRules?.length}
                itemLabel="Fee"
              />
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {/* <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      VAT (%)
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Fee Structure
                    </TableHead>
                    <TableHead>Fee Value</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Paid By
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Business
                    </TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Shared
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : activeRules?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No active configurations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium text-sm">
                          {transactionTypeLabel(rule.transactionType)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {countryLabel(rule.payoutCountry)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {rule?.vat?.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {rule.feeResponsibility === "SHARED"
                            ? "Shared"
                            : rule.feeType}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {rule.feeResponsibility === "SHARED" ? (
                            <div className="space-y-1">
                              <div className="text-xs">
                                Business:{" "}
                                {formatFee(
                                  rule.businessFeeType,
                                  rule.businessFeeValue,
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Beneficiary:{" "}
                                {formatFee(
                                  rule.beneficiaryFeeType,
                                  rule.beneficiaryFeeValue,
                                )}
                              </div>
                            </div>
                          ) : (
                            formatFee(rule.feeType, rule.feeValue)
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              rule.feeResponsibility === "BUSINESS"
                                ? "default"
                                : rule.feeResponsibility === "SHARED"
                                  ? "outline"
                                  : "secondary"
                            }
                            className={
                              rule.feeResponsibility === "SHARED"
                                ? "bg-gradient-to-r from-primary/10 to-secondary/10"
                                : ""
                            }
                          >
                            {rule.feeResponsibility}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(rule.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <PermissionGate permission="BTN_EDIT_FEE_RULE">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(rule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGate>

                            <PermissionGate permission="BTN_DELETE_FEE_RULE">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedIdForDelete(rule.id);
                                  setIsConfirmDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table> */}
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      VAT (%)
                    </TableHead>
                    {/* <TableHead className="hidden md:table-cell">
                      Fee Structure
                    </TableHead>
                    <TableHead>Fee Value</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Paid By
                    </TableHead> */}
                    <TableHead className="hidden md:table-cell">
                      Business
                    </TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Total Beneficiary</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Shared
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">
                              Loading fee management...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : activeRules?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No active configurations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium text-sm">
                          {transactionTypeLabel(rule.transactionType)}
                        </TableCell>
                        {/* <TableCell className="text-sm">
                          {countryName(rule.countryName)}
                        </TableCell> */}
                        <TableCell className="text-sm">
                          {rule.countryName ?? "-"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {rule?.vat?.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          <div className="border rounded-md p-2 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Fee Type
                              </span>
                              <span>{rule.businessFeeType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Value
                              </span>
                              <span>
                                {formatFee(
                                  rule.businessFeeType,
                                  rule.businessFeeValue,
                                )}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {rule?.beneficiaryFeeType ? (
                            <div className="border rounded-md p-2 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Fee Type
                                </span>
                                <span>{rule?.beneficiaryFeeType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Value
                                </span>
                                <span>
                                  {formatFee(
                                    rule.beneficiaryFeeType,
                                    rule.beneficiaryFeeValue,
                                  )}
                                </span>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <p>
                            {rule?.bulkTotalAmount
                              ? rule?.bulkTotalAmount
                              : "-"}
                          </p>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <p>
                            {rule?.bulkTotalBeneficiary
                              ? rule?.bulkTotalBeneficiary
                              : "-"}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {rule?.sharedBeneficiaryFeeType ? (
                            <div className="border rounded-md p-2 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Business Fee Type
                                </span>
                                <span>{rule?.sharedBusinessFeeType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Business Value
                                </span>
                                <span>
                                  {formatFee(
                                    rule?.sharedBusinessFeeType,
                                    rule?.sharedBusinessFeeValue,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Beneficiary Fee Type
                                </span>
                                <span>{rule?.sharedBeneficiaryFeeType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Beneficiary Value
                                </span>
                                <span>
                                  {formatFee(
                                    rule?.sharedBeneficiaryFeeType,
                                    rule?.sharedBeneficiaryFeeValue,
                                  )}
                                </span>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(rule.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <PermissionGate permission="BTN_EDIT_FEE_RULE">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(rule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                            <PermissionGate permission="BTN_DELETE_FEE_RULE">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedIdForDelete(rule.id);
                                  setIsConfirmDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.pageNumber - 1);
                }}
                className={
                  pagination.pageNumber === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={pagination.pageNumber === index}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index);
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
                  handlePageChange(pagination.pageNumber + 1);
                }}
                className={
                  pagination.pageNumber === pagination.totalPages - 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
        <PaginationControl
          className="mt-6"
          currentPage={pagination?.pageNumber}
          totalPages={pagination?.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({
              ...prev,
              pageNumber: page,
            }))
          }
        />

        {/* --- Delete Confirmation Dialog --- */}
        <Dialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600 h-6 w-6" />
              </div>
              <DialogTitle className="text-center">
                Are you sure want to delete it?
              </DialogTitle>
              <DialogDescription className="text-center">
                This action will permanently remove this fee rule configuration
                from the system.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-3 sm:justify-center mt-2">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeleteDialogOpen(false)}
              >
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
