import React, { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Upload,
  Users,
  Building,
  CreditCard,
  TrendingUp,
  Info,
  Trash2,
  Download,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";
import { previousDay } from "date-fns";

const BranchBulkTransactionForm = ({
  trigger,
  refetch,
}: {
  trigger?: React.ReactNode;
  refetch?: () => void;
}) => {
  const { toast } = useToast();
  const [cookie] = useCookies(["token", "currencyCode"]);
  const token = cookie.token;
  const currencyCode = cookie?.currencyCode;
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form fields
  const [selectedSource, setSelectedSource] = useState("");
  const [transactionPurpose, setTransactionPurpose] = useState("");
  const [currency, setCurrency] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  // Data
  const [currencyListData, setCurrencyListData] = useState<any>(null);
  const [beneficiaryGroupsList, setBeneficiaryGroupList] = useState<any>(null);
  const [payoutDetail, setPayoutDetail] = useState([]);
  const [transactionPurposeList, setTransactionPurposeList] = useState<any>([]);
  // Per-beneficiary inputs
  const [beneficiaryAmounts, setBeneficiaryAmounts] = useState<
    Record<number, string>
  >({});
  const [beneficiaryDiscounts, setBeneficiaryDiscounts] = useState<
    Record<number, string>
  >({});
  const [selectedPayouts, setSelectedPayouts] = useState<
    Record<number, number>
  >({});
  const [applicableRate, setApplicableRate] = useState([]);

  const [payoutErrors, setPayoutErrors] = useState<Record<string, boolean>>({});
  const [amountErrors, setAmountErrors] = useState<Record<string, boolean>>({});
  const [fileName, setFileName] = useState(null);
  // Mock sources (replace with real fetch if needed)
  const transactionSources = [
    {
      id: "1",
      name: "Cheque",
    },
    {
      id: "2",
      name: "Online Transfer",
    },
    {
      id: "3",
      name: "Cash",
    },
  ];

  //   const purposeOptions = [
  //     { value: "INVOICE_PAYMENT", label: "Invoice Payment", requiresDoc: true },
  //     { value: "SALARY_PAYMENT", label: "Salary Payment", requiresDoc: false },
  //     { value: "VENDOR_PAYMENT", label: "Vendor Payment", requiresDoc: true },
  //     { value: "SUPPLIER_PAYMENT", label: "Supplier Payment", requiresDoc: true },
  //     { value: "SERVICE_PAYMENT", label: "Service Payment", requiresDoc: true },
  //     { value: "RENT_PAYMENT", label: "Rent Payment", requiresDoc: true },
  //     { value: "UTILITY_PAYMENT", label: "Utility Payment", requiresDoc: false },
  //     { value: "LOAN_REPAYMENT", label: "Loan Repayment", requiresDoc: false },
  //     { value: "OTHER", label: "Other", requiresDoc: false },
  //   ];

  // ─── Fetch data ────────────────────────────────────────
  const getCurrency = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/exchange_rate/${currencyCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error();
      const json = await res.json();
      setCurrencyListData(json);
    } catch {
      toast({ variant: "destructive", title: "Failed to load currencies" });
    }
  };

  const getBeneficiaryGroups = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/beneficiary-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setBeneficiaryGroupList(json);
    } catch {
      toast({ variant: "destructive", title: "Failed to load groups" });
    }
  };

  useEffect(() => {
    getBeneficiaryGroups();
    getCurrency();
  }, []);

  // Helpers
  const getSelectedGroup = () =>
    beneficiaryGroupsList?.data?.groups?.find(
      (g: any) => g.id.toString() === selectedGroup,
    ) ?? null;

  const getSelectedSourceDetails = () =>
    transactionSources.find((s) => s.id === selectedSource);

  // Change handlers
  const handleAmountChange = (id: number, value: string) => {
    setBeneficiaryAmounts((prev) => ({ ...prev, [id]: value }));
    if (value !== "" && Number(value) > 0) {
      setAmountErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleDiscountChange = (id: number, value: string) => {
    setBeneficiaryDiscounts((prev) => ({ ...prev, [id]: value.trim() }));
  };

  const handlePayoutChange = (id: number, value: number) => {
    setSelectedPayouts((prev) => ({
      ...prev,
      [id]: prev[id] === value ? undefined : value,
    }));
    setPayoutErrors((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const requiredDocForPorpose = transactionPurposeList?.find(
    (purpose) => purpose?.code == transactionPurpose,
  )?.documentRequired;
  // Submit

  // Get selected payout currency for a beneficiary
  const getSelectedCurrency = (ben) => {
    const selectedPayoutId = selectedPayouts?.[ben?.id];

    const payout = ben?.payoutDetails?.find(
      (p) => p?.payoutDetailId === selectedPayoutId,
    );

    return payout?.currencyCode; // e.g. "QAR"
  };
  const getExchangeRate = (currencyCode) => {
    if (!currencyCode) return null;

    return currencyListData?.data?.find(
      (c) => c?.name === currencyCode?.toLowerCase(),
    );
  };

  const getConvertedAmount = (ben) => {
    const amount = beneficiaryAmounts[ben.id];
    const currency = getSelectedCurrency(ben);
    const rateObj = getExchangeRate(currency);

    if (!amount || !rateObj) return "";

    return (Number(amount) * Number(1 / rateObj.rate)).toFixed(4);
  };

  const disableButtonForDocd = requiredDocForPorpose ? !document : false;
  const handleSubmit = async () => {
    setLoading(true);

    const group = getSelectedGroup();
    if (!group) {
      toast({ variant: "destructive", title: "No group selected" });
      setLoading(false);
      return;
    }

    const validBeneficiaries = group.beneficiaries
      .map((ben: any) => {
        const amountStr = beneficiaryAmounts[ben.id];
        const amount = amountStr ? Number(amountStr) : NaN;
        const beneficiaryPayoutDetailId = selectedPayouts[ben.id];
        if (!amountStr || isNaN(amount) || amount <= 0) return null;
        return {
          beneficiaryId: Number(ben.id),
          amount,
          discountCode: beneficiaryDiscounts[ben.id] || "",
          beneficiaryPayoutDetailId,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item);

    if (validBeneficiaries.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Enter valid amount for at least one beneficiary",
      });
      setLoading(false);
      return;
    }

    const payload = {
      groupId: Number(selectedGroup),
      purposeCode: transactionPurpose,
      // currencyId: Number(currency),
      sourceAccountId: Number(selectedSource),
      beneficiaries: validBeneficiaries,
      feeResponsibility: "BUSINESS",
      // discountCode: "", // global one – can be removed or kept
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    if (document) formData.append("documents", document);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/bulk-transactions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.status === false) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: data?.message || "Please try again",
        });
        return;
      }

      toast({
        title: "Success",
        description:
          data?.message ||
          `Submitted ${validBeneficiaries.length} payments for approval`,
      });

      setOpen(false);
      refetch?.();

      // Reset form
      setSelectedSource("");
      setTransactionPurpose("");
      setSelectedPayouts({});
      setCurrency("");
      setSelectedGroup("");
      setBeneficiaryAmounts({});
      setBeneficiaryDiscounts({});
      setDocument(null);
      setCurrentStep(1);
    } catch (err) {
      toast({ variant: "destructive", title: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const isPayloadReady = () => {
    const group = getSelectedGroup();
    if (!group || !group.beneficiaries?.length) return false;

    return group?.beneficiaries?.every((ben: any) => {
      const amountStr = beneficiaryAmounts[ben.id];
      const amount = amountStr ? Number(amountStr) : NaN;
      const payoutId = selectedPayouts[ben.id];

      return amountStr && !isNaN(amount) && amount > 0 && payoutId;
    });
  };

  const getApplicableDeals = async () => {
    const group = getSelectedGroup();
    if (!group) {
      toast({ variant: "destructive", title: "No group selected" });
      setLoading(false);
      return;
    }

    const dealPayload = group.beneficiaries
      ?.map((ben: any) => {
        const amountStr = beneficiaryAmounts[ben.id];
        const amount = amountStr ? Number(amountStr) : NaN;
        const beneficiaryPayoutDetailId = selectedPayouts[ben.id];
        if (!amountStr || isNaN(amount) || amount <= 0) return null;
        return {
          beneficiaryId: Number(ben.id),
          amount,
          beneficiaryPayoutDetailId,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/bulk-transactions/applicable-deals`,
        dealPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setApplicableRate(res?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    if (isPayloadReady()) {
      getApplicableDeals();
    }
  }, [beneficiaryAmounts, selectedPayouts]);

  const applicableRateDealsData = applicableRate?.filter(
    (item: any) => item?.rateDeal?.isApplicable === true,
  );

  const getBeneficiaryPayout = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/beneficiary-groups/${selectedGroup}/payout-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPayoutDetail(res?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.respose?.data?.message ||
          "Something went wrong fecting payout mechanisms",
      });
    }
  };

  useEffect(() => {
    if (!selectedGroup) return;
    getBeneficiaryPayout();
  }, [selectedGroup]);

  const getTransactionPurpose = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/business/transactions/purpose`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response?.data?.status) {
        toast({
          title: "Error",
          description:
            response?.data?.message ||
            "Something went wrong while fetching transaction purpose data",
          variant: "destructive",
        });
      }
      setTransactionPurposeList(response?.data?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong while fetching transaction purpose ",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    getTransactionPurpose();
  }, [open]);

  const isStep1Valid = () => {
    if (!selectedGroup || selectedGroup === "none") return false;
    if (!transactionPurpose || !selectedSource) return false;

    const group = getSelectedGroup();
    if (!group?.beneficiaries?.length) return false;

    return group.beneficiaries.every((ben: any) => {
      const hasPayout = !!selectedPayouts?.[ben.id];
      const amount = beneficiaryAmounts?.[ben.id];
      const hasValidAmount =
        amount !== undefined && amount !== "" && Number(amount) > 0;

      return hasPayout && hasValidAmount;
    });
  };

  const validateStep1Beneficiaries = () => {
    const group = getSelectedGroup();
    if (!group?.beneficiaries?.length) return true; // nothing to validate

    const newPayoutErrors: Record<string, boolean> = {};
    const newAmountErrors: Record<string, boolean> = {};
    let isValid = true;

    group.beneficiaries.forEach((ben: any) => {
      const hasPayout = !!selectedPayouts?.[ben.id];
      const amount = beneficiaryAmounts?.[ben.id];
      const hasValidAmount =
        amount !== undefined && amount !== "" && Number(amount) > 0;

      if (!hasPayout) {
        newPayoutErrors[ben.id] = true;
        isValid = false;
      }
      if (!hasValidAmount) {
        newAmountErrors[ben.id] = true;
        isValid = false;
      }
    });

    setPayoutErrors(newPayoutErrors);
    setAmountErrors(newAmountErrors);
    return isValid;
  };

  // ─── UI ─────────────────────────────────────────────
  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
          {step < 2 && (
            <div
              className={`w-16 h-0.5 ${
                currentStep > step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const handleDownloadTemplate = () => {
    // Wire this up to your actual template file download
    console.log("Download template");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bulk Transaction Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>
              Purpose of Transaction <span className="text-red-500">*</span>
            </Label>
            <Select
              value={transactionPurpose}
              onValueChange={setTransactionPurpose}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {transactionPurposeList?.map((p) => (
                  <SelectItem key={p?.id} value={p?.code}>
                    <div className="flex items-center gap-2">
                      {p?.name}
                      {p.documentRequired && (
                        <Badge variant="outline" className="text-xs ml-2">
                          Doc Required
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>
              Fee Responsibility <span className="text-red-500">*</span>
            </Label>
            <Input disabled defaultValue="BUSINESS" />
          </div>

          {/* <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Currency *</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyListData?.data?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Mode of Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>
              Select Mode Of Transaction <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {transactionSources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{s.name}</span>
                      {/* <span className="text-xs text-muted-foreground">
                        {s.currency} {s.balance}
                      </span> */}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* {getSelectedSourceDetails() && (
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Account Number:
                    </span>
                    <p className="font-medium font-mono">
                      {getSelectedSourceDetails()?.accountNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Available Balance:
                    </span>
                    <p className="font-medium text-green-600">
                      {getSelectedSourceDetails()?.currency}{" "}
                      {getSelectedSourceDetails()?.balance}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </CardContent>
      </Card>

      {/* Group + Amounts */}
      {transactionPurpose && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Beneficiary Group
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a beneficiary group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">
                    No group selected
                  </span>
                </SelectItem>
                {beneficiaryGroupsList?.data?.groups?.map((g: any) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{g.groupName}</span>
                      <span className="text-xs text-muted-foreground">
                        {g.beneficiaries?.length || 0} beneficiaries
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Card className="p-6 ">
              <div className="max-w-3xl mx-auto p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Upload size={18} className="text-gray-900" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Upload Beneficiary Data
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="rounded-xl border-2 border-dashed border-[#1B2A6B] bg-[#EEF0FA] px-6 py-8 flex flex-col items-center text-center">
                    <button
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Download size={16} />
                      Download Template
                    </button>
                    <p className="mt-4 text-sm font-semibold text-gray-900">
                      Step 1: Download Template
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Get the Vendor Payment template
                    </p>
                  </div>
                  <label
                    htmlFor="beneficiary-upload"
                    className="rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 flex flex-col items-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      id="beneficiary-upload"
                      type="file"
                      accept=".xlsx,.csv"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Upload size={22} className="text-gray-400" />
                    <p className="mt-4 text-sm font-semibold text-gray-900">
                      Step 2: Upload Filled Template
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {fileName ? fileName : "Excel (.xlsx) or CSV files"}
                    </p>
                  </label>
                </div>

                <div className="mt-4 rounded-xl bg-[#FBF8F1] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-amber-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      Required Information
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5 pl-1">
                    {[
                      "Beneficiary Name and Account Details",
                      "Individual Transaction Amounts",
                      "Purpose/Description for each payment",
                      "Employee ID (for salary payments)",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-500"
                      >
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card> */}

            {selectedGroup &&
              selectedGroup !== "none" &&
              getSelectedGroup() && (
                <Card className="border-l-4 border-l-primary bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {getSelectedGroup().groupName}
                      </h4>
                      <Badge variant="secondary">
                        {getSelectedGroup().beneficiaries.length} members
                      </Badge>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Beneficiary</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>
                            Beneficiary Payout{" "}
                            <span className="text-red-500">*</span>
                          </TableHead>
                          <TableHead>
                            Value (Amount)
                            <span className="text-red-500">*</span>
                          </TableHead>
                          <TableHead>Exchnage Rate</TableHead>
                          <TableHead>Currency Code</TableHead>
                          <TableHead>Converted Amount</TableHead>
                          <TableHead>Discount Code</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSelectedGroup()?.beneficiaries?.map((ben: any) => {
                          const currency = getSelectedCurrency(ben);
                          const rateObj = getExchangeRate(currency);
                          return (
                            <TableRow key={ben.id}>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="flex w-fit items-center gap-1"
                                >
                                  {ben.type === "BUSINESS" ? (
                                    <Building className="h-3 w-3" />
                                  ) : (
                                    <Users className="h-3 w-3" />
                                  )}
                                  {ben.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="capitalize">
                                {ben.type?.toLowerCase()}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {ben?.payoutDetails?.map((vv: any) => (
                                    <div
                                      key={vv.payoutDetailId}
                                      className="space-y-1"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={
                                            selectedPayouts?.[ben.id] ===
                                            vv.payoutDetailId
                                          }
                                          onCheckedChange={() =>
                                            handlePayoutChange(
                                              ben.id,
                                              vv.payoutDetailId,
                                            )
                                          }
                                        />
                                        <span className="text-xs">
                                          {vv.payoutMechanismType}
                                        </span>
                                      </div>
                                      {payoutErrors[ben.id] && (
                                        <p className="text-xs text-red-500 mt-1">
                                          This field is required
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="max-w-[160px]"
                                  value={beneficiaryAmounts[ben.id] ?? ""}
                                  onChange={(e) =>
                                    handleAmountChange(ben.id, e.target.value)
                                  }
                                />
                                {amountErrors[ben.id] && (
                                  <p className="text-xs text-red-500 mt-1">
                                    This field is required
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="text-xs">
                                  {rateObj
                                    ? Number(1 / rateObj?.rate)?.toFixed(4)
                                    : "-"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <p>{currency ?? "-"}</p>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-green-600">
                                  {getConvertedAmount(ben) || "-"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="e.g. VKLXPD57"
                                  className="max-w-[160px] font-mono"
                                  value={beneficiaryDiscounts[ben.id] ?? ""}
                                  onChange={(e) =>
                                    handleDiscountChange(ben.id, e.target.value)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
          </CardContent>
        </Card>
      )}
      {applicableRateDealsData?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Applicable Rate deal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicableRateDealsData?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Proposed Rate</p>
                  <p className="text-base font-semibold">
                    {item?.rateDeal?.proposedRate ?? "-"}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Remaining Amount
                  </p>
                  <p className="text-base font-semibold">
                    {item?.rateDeal?.remainingAmount ?? "-"}{" "}
                    {item?.rateDeal?.payoutCurrency}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Supporting Documents
            <Badge variant="destructive" className="text-xs ml-2">
              Required for some purposes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <label htmlFor="doc-upload" className="cursor-pointer block">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <p className="font-medium">Click to upload or drag & drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </label>
                <input
                  id="doc-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocument(file);
                  }}
                />
              </CardContent>
            </Card>

            {document && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Document</h4>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm truncate max-w-[220px]">
                      {document.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDocument(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Approval & Processing</p>
                  <p className="text-muted-foreground">
                    Transactions will be routed for approval. Expected
                    processing time: 24-48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setSelectedSource("");
            setTransactionPurpose("");
            setCurrency("");
            setSelectedGroup("");
            setBeneficiaryAmounts({});
            setBeneficiaryDiscounts({});
            setSelectedPayouts({});
            setDocument(null);
            setCurrentStep(1);
            setApplicableRate([]);
            setPayoutErrors({});
            setAmountErrors({});
          }
        }}
      >
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Bulk Payment
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Create Bulk Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {renderStepIndicator()}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}

            <div className="flex justify-between pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep === 1 ? (
                <Button
                  onClick={() => {
                    if (validateStep1Beneficiaries()) {
                      setCurrentStep(2);
                    }
                  }}
                  disabled={
                    !selectedGroup ||
                    selectedGroup === "none" ||
                    !transactionPurpose ||
                    !selectedSource
                  }
                >
                  Next – Documents & Submit
                </Button>
              ) : (
                <div className="space-x-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Setup
                  </Button>
                  <Button
                    disabled={loading || disableButtonForDocd}
                    onClick={() => setShowConfirmation(true)}
                  >
                    {loading ? "Submitting…" : "Submit for Approval"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isConfirming={loading}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleSubmit}
        title="Confirm Bulk Transaction"
        description="This will submit the payments for approval. Continue?"
        confirmText="Yes, Submit"
      />
    </>
  );
};

export default BranchBulkTransactionForm;
