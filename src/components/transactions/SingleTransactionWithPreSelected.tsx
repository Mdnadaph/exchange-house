import { useEffect, useRef, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import FeeCalculator from "@/components/fees/FeeCalculator";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

import {
  Plus,
  DollarSign,
  FileText,
  Upload,
  User,
  Building,
  AlertCircle,
  Info,
  CheckCircle,
  CreditCard,
  TrendingUp,
  Calendar,
  Trash2,
} from "lucide-react";
import axios from "axios";

interface SingleTransactionFormProps {
  refetch?: () => void;
  open: boolean;
  setOpen: (arg: boolean) => void;
  beneficiaryId: number | null;
  setBeneficiaryId: (arg: number | null) => void;
}

const SingleTransactionWithPreselected = ({
  refetch,
  open,
  setOpen,
  beneficiaryId,
  setBeneficiaryId,
}: SingleTransactionFormProps) => {
  const { toast } = useToast();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [transactionPurpose, setTransactionPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currencyListData, setCurrencyListData] = useState(null);
  const [beneficiariesList, setBeneficiariesList] = useState([]);
  const [feeManagementData, setFeeManagementData] = useState([]);
  const [receiverAmount, setReceiverAmount] = useState("");
  const [feeResponsibility, setFeeResponsibility] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [feeRule, setFeeRule] = useState<any>({});
  const [selectedBeneficiaryFee, setSelectedBeneficiaryFee] =
    useState<any>(null);
  const [transectionSummeryData, setTransectionSummeryData] =
    useState<any>(null);
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mock data - would come from backend
  const beneficiaries = [
    {
      id: "BEN-001",
      name: "Global Suppliers Inc",
      type: "business",
      accountNumber: "1234567890",
      bankName: "Emirates NBD",
      country: "UAE",
    },
    {
      id: "BEN-002",
      name: "Tech Solutions Ltd",
      type: "business",
      accountNumber: "9876543210",
      bankName: "ADCB Bank",
      country: "UAE",
    },
    {
      id: "BEN-003",
      name: "John Smith",
      type: "individual",
      accountNumber: "5555666677",
      bankName: "State Bank of India",
      country: "India",
    },
  ];

  // const transactionSources = [
  //   {
  //     id: "1",
  //     name: "Emirates NBD Business Account",
  //     accountNumber: "AE070331234567890123456",
  //     balance: "245,000",
  //     currency: "AED",
  //     type: "current_account",
  //   },
  //   {
  //     id: "2",
  //     name: "FAB USD Account",
  //     accountNumber: "AE070331987654321098765",
  //     balance: "85,000",
  //     currency: "USD",
  //     type: "foreign_currency",
  //   },
  // ];

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

  const feeResponsibilityList = [
    {
      value: "BUSINESS",
      label: "Business",
    },
    {
      value: "BENEFICIARY",
      label: "Beneficiary",
    },
    {
      value: "SHARED",
      label: "Shared",
    },
  ];

  const purposeOptions = [
    { value: "INVOICE_PAYMENT", label: "Invoice Payment", requiresDoc: true },
    { value: "SALARY_PAYMENT", label: "Salary Payment", requiresDoc: false },
    { value: "VENDOR_PAYMENT", label: "Vendor Payment", requiresDoc: true },
    { value: "SUPPLIER_PAYMENT", label: "Supplier Payment", requiresDoc: true },
    { value: "SERVICE_PAYMENT", label: "Service Payment", requiresDoc: true },
    { value: "RENT_PAYMENT", label: "Rent Payment", requiresDoc: true },
    { value: "UTILITY_PAYMENT", label: "Utility Payment", requiresDoc: false },
    { value: "LOAN_REPAYMENT", label: "Loan Repayment", requiresDoc: false },
    { value: "OTHER", label: "Other", requiresDoc: false },
  ];

  const getSelectedBeneficiaryDetails = () => {
    return beneficiaries.find((b) => b.id === selectedBeneficiary);
  };

  const getSelectedSourceDetails = () => {
    return transactionSources.find((s) => s.id === selectedSource);
  };

  const getSelectedPurposeDetails = () => {
    return purposeOptions.find((p) => p.value === transactionPurpose);
  };

  const calculateTotalAmount = () => {
    if (!amount || !currency) return null;

    const amountNum = parseFloat(amount);
    // const exchangeRate = parseFloat(
    //   exchangeRates[currency as keyof typeof exchangeRates]?.rate || "1",
    // );
    const exchangeRate = parseFloat(
      currencyListData?.data?.find(
        (currencyList: any) => currencyList?.id == currency,
      )?.rate || "1",
    );
    // const fees = parseFloat(
    //   exchangeRates[currency as keyof typeof exchangeRates]?.fees || "0",
    // );
    const fees = parseFloat(
      currencyListData?.data?.find(
        (currencyList: any) => currencyList?.id == currency,
      )?.processingFee || "0",
    );
    return {
      originalAmount: amountNum,
      aedAmount: amountNum * exchangeRate,
      fees: fees,
      total: amountNum * exchangeRate + fees,
    };
  };

  // const handleDocumentUpload = (file: string) => {
  //   setUploadedDocuments([...uploadedDocuments, file]);
  // };

  // const removeDocument = (index: number) => {
  //   setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  // };

  const totals = calculateTotalAmount();

  useEffect(() => {
    if (!open) return;

    axios
      .get(`${BASE_URL}/api/v1/beneficiaries`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBeneficiariesList(res?.data?.data?.beneficiaries))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Failed to load beneficiaries",
        }),
      );
  }, [open]);
  const getSelectedBeneficiary = beneficiariesList?.find(
    (beneficiaries: { id: number }) => beneficiaries?.id == beneficiaryId,
  );
  const beneficiariyCurrency = currencyListData?.data?.find(
    (currency: any) =>
      currency?.name == getSelectedBeneficiary?.currency.toLowerCase(),
  );
  useEffect(() => {
    setSelectedBeneficiary(beneficiaryId?.toString());
  }, [beneficiaryId]);
  const submitTransaction = async () => {
    // if (selectedPurpose?.doc && documents.length === 0) {
    //   toast({
    //     variant: "destructive",
    //     title: "Supporting documents are required",
    //   });
    //   return;
    // }

    // ✅ This matches Postman "data"
    const payload = {
      purposeCode: transactionPurpose,
      sourceAccountId: selectedSource,
      beneficiaryId: selectedBeneficiary,
      amount: Number(receiverAmount),
      feeResponsibility,
      // discountCode: "",
      currencyId: currency,
      notes,
      discountCode: discountCode.trim() || "",
    };

    const formData = new FormData();

    // ✅ REQUIRED: data as JSON blob
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    // ✅ documents
    uploadedDocuments?.forEach((file) => {
      formData.append("documents", file);
    });
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/transactions/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ DO NOT SET Content-Type
          },
        },
      );
      if (res?.data?.status === false) {
        toast({
          variant: "destructive",
          title: res?.data?.message || "Transaction failed",
        });
      } else {
        toast({ title: "Transaction created successfully" });
      }
      refetch?.();

      setOpen(false);
      setShowConfirmation(false);
      setSelectedBeneficiary("");
      setSelectedSource("");
      setTransactionPurpose("");
      setAmount("");
      setCurrency("");
      setUploadedDocuments([]);
      setNotes("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.response?.data?.message || "Transaction failed",
      });
    }
  };

  const getCurrency = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/exchange_rate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setCurrencyListData(json);
    } catch (error) {
      const msg = error.message || "Failed to load rate-deals";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };
  const getFeeManagement = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/fees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setFeeManagementData(json?.data?.rules);
    } catch (error) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    getFeeManagement();
    getCurrency();
  }, []);
  const getCurrencyName = () => {
    const currencyName = currencyListData?.data
      ?.find((currencyList: any) => currencyList?.id == currency)
      ?.name.toUpperCase();
    return currencyName;
  };
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadedDocuments((prev: any) => [...prev, file]);

    // reset input so same file can be uploaded again
    e.target.value = "";
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    setCurrency(beneficiariyCurrency?.id);
  }, [beneficiariyCurrency]);

  const singleTransationFeeManagementData = feeManagementData?.filter(
    (fee: any) => fee?.transactionType == "SINGLE",
  );
  useEffect(() => {
    const fee = singleTransationFeeManagementData?.filter(
      (fee: any) => fee?.countryId === getSelectedBeneficiary?.countryId,
    );
    const range = fee?.find(
      (fee: any) =>
        Number(amount) >= fee?.minAmount && Number(amount) <= fee?.maxAmount,
    );
    setSelectedBeneficiaryFee(range);
    if (amount == "" || fee?.length == 0) {
      setSelectedBeneficiaryFee(null);
    }
  }, [amount]);
  const fee = singleTransationFeeManagementData?.filter(
    (fee: any) => fee?.countryId === getSelectedBeneficiary?.countryId,
  );
  const range = fee?.find(
    (fee: any) =>
      Number(amount) >= fee?.minAmount && Number(amount) <= fee?.maxAmount,
  );
  const handleTransationSummary = async () => {
    const payload = {
      purposeCode: transactionPurpose,
      sourceAccountId: selectedSource,
      beneficiaryId: selectedBeneficiary,
      amount: Number(receiverAmount),
      // discountCode: "",
      currencyId: currency,
      notes,
      discountCode: discountCode.trim() || "",
    };

    const formData = new FormData();

    // ✅ REQUIRED: data as JSON blob
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    // ✅ documents
    uploadedDocuments?.forEach((file) => {
      formData.append("documents", file);
    });
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/business/transactions/single/preview`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ DO NOT SET Content-Type
          },
        },
      );
      if (!res?.status) {
        toast({
          variant: "destructive",
          title: res?.data?.message || "Transaction failed",
        });
      }
      setTransectionSummeryData(res?.data?.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.response?.data?.message || "Transaction failed",
      });
    }
  };

  const fetchFeeRulesForTransaction = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/fees/${beneficiaryId}/get-fee-rules-for-transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFeeRule(res?.data?.data);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (!beneficiaryId) return;
    fetchFeeRulesForTransaction();
  }, [beneficiaryId]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="business">
            <Plus className="h-4 w-4 mr-2" />
            Single Payment
          </Button>
        </DialogTrigger> */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Create Single Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Transaction Purpose */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transaction Purpose
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Purpose of Transaction *</Label>
                  <Select
                    value={transactionPurpose}
                    onValueChange={setTransactionPurpose}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {purposeOptions?.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{purpose.label}</span>
                            {purpose.requiresDoc && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Doc Required
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getSelectedPurposeDetails()?.requiresDoc && (
                  <div className="bg-accent-muted/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          Supporting Documents Required
                        </p>
                        <p className="text-muted-foreground">
                          Please upload relevant documents for{" "}
                          {getSelectedPurposeDetails()?.label.toLowerCase()}{" "}
                          verification.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Source of Transaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Source of Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="source">Select Source Account *</Label>
                  <Select
                    value={selectedSource}
                    onValueChange={setSelectedSource}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose source account" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {transactionSources?.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{source.name}</span>
                            {/* <span className="text-xs text-muted-foreground">
                              Balance: {source.currency}{" "}
                              {Number(source.balance).toLocaleString()}
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
                          <p className="font-medium text-success">
                            {getSelectedSourceDetails()?.currency}{" "}
                            {Number(
                              getSelectedSourceDetails()?.balance,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )} */}
              </CardContent>
            </Card>

            {/* Beneficiary Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Beneficiary Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="beneficiary">Select Beneficiary *</Label>
                  <Select
                    value={Number(selectedBeneficiary)}
                    onValueChange={setSelectedBeneficiary}
                    disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose beneficiary" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {beneficiariesList?.map((beneficiary: any) => (
                        <SelectItem key={beneficiary.id} value={beneficiary.id}>
                          <div className="flex items-center space-x-2">
                            {beneficiary.type === "BUSINESS" ? (
                              <Building className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {beneficiary?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {beneficiary?.bankName} •{" "}
                                {beneficiary?.countryName}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getSelectedBeneficiaryDetails() && (
                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Account Number:
                          </span>
                          <p className="font-medium font-mono">
                            {getSelectedBeneficiaryDetails()?.accountNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bank:</span>
                          <p className="font-medium">
                            {getSelectedBeneficiaryDetails()?.bankName}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
            {/* Fee Rule */}
            {feeRule?.id && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Fee Rule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Business */}
                    <div className="p-4 border rounded-2xl shadow-sm bg-white">
                      <h2 className="text-lg font-semibold mb-3">Business</h2>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Fee Type:</span>{" "}
                          {feeRule?.businessFee?.businessFeeType || "-"}
                        </p>
                        <p>
                          <span className="font-medium">Fee Value:</span>{" "}
                          {feeRule?.businessFee?.businessFeeValue || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Beneficiary */}
                    <div className="p-4 border rounded-2xl shadow-sm bg-white">
                      <h2 className="text-lg font-semibold mb-3">
                        Beneficiary
                      </h2>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Fee Type:</span>{" "}
                          {feeRule?.beneficiaryFee?.beneficiaryFeeType || "-"}
                        </p>
                        <p>
                          <span className="font-medium">Fee Value:</span>{" "}
                          {feeRule?.beneficiaryFee?.beneficiaryFeeValue || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Shared */}
                    <div className="p-4 border rounded-2xl shadow-sm bg-white">
                      <h2 className="text-lg font-semibold mb-3">Shared</h2>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">
                            Business Fee Type:
                          </span>{" "}
                          {feeRule?.shareFee?.sharedBusinessFeeType || "-"}
                        </p>
                        <p>
                          <span className="font-medium">
                            Business Fee Value:
                          </span>{" "}
                          {feeRule?.shareFee?.sharedBusinessFeeValue || "-"}
                        </p>
                        <p>
                          <span className="font-medium">
                            Beneficiary Fee Type:
                          </span>{" "}
                          {feeRule?.shareFee?.sharedBeneficiaryFeeType || "-"}
                        </p>
                        <p>
                          <span className="font-medium">
                            Beneficiary Fee Value:
                          </span>{" "}
                          {feeRule?.shareFee?.sharedBeneficiaryFeeValue || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Transaction Amount */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transaction Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                    <div>
                      <h4 className="text-center">Sender</h4>
                      <Label htmlFor="amount">Amount(AED) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAmount(value);
                          if (beneficiariyCurrency?.rate) {
                            const result =
                              Number(value) / beneficiariyCurrency?.rate;
                            setReceiverAmount(String(result.toFixed(2)));
                          }
                          setTransectionSummeryData(null);
                        }}
                        placeholder="0.00"
                        step="0.01"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div>
                      <h4 className="text-center">Receiver</h4>
                      <Label htmlFor="receiverAmount">
                        Amount {getSelectedBeneficiary?.currency} *
                      </Label>
                      <Input
                        id="receiverAmount"
                        type="number"
                        value={receiverAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setReceiverAmount(value);
                          setTransectionSummeryData(null);
                          if (beneficiariyCurrency?.rate) {
                            const result =
                              Number(value) * beneficiariyCurrency?.rate;
                            setAmount(String(result?.toFixed(2)));
                          }
                        }}
                        placeholder="0.00"
                        step="0.01"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  {/* ← New: Discount Code */}
                  <div>
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <Input
                      id="discountCode"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.trim())}
                      placeholder="e.g. S43U3ZSC"
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={currency}
                      onValueChange={setCurrency}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {/* {Object.keys(exchangeRates).map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))} */}
                        {currencyListData?.data?.map((curr: any) => (
                          <SelectItem key={curr?.id} value={curr?.id}>
                            {curr?.name?.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="source">
                        Select Fee Responsibility *
                      </Label>
                      <Select
                        value={feeResponsibility}
                        onValueChange={setFeeResponsibility}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose fee responsibility" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          {feeResponsibilityList?.map(
                            (feeResponsibility, index) => (
                              <SelectItem
                                key={index}
                                value={feeResponsibility.value}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {feeResponsibility.label}
                                  </span>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleTransationSummary()}
                >
                  View Transaction Summary
                </Button>
                {transectionSummeryData && amount && (
                  <Card className="bg-accent-muted/10 border-accent/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">
                          Transaction Summary
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            PayIn Amount
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.baseAedAmount?.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Exchange Rate
                          </span>
                          <p className="font-medium">
                            1 AED ={" "}
                            {(
                              1 / transectionSummeryData?.exchangeRate
                            )?.toFixed(2)}{" "}
                            {transectionSummeryData?.currency}
                          </p>
                        </div>
                        {transectionSummeryData?.businessFee >= 1 && (
                          <div>
                            <span className="text-muted-foreground">
                              businessFee
                            </span>
                            <p className="font-medium">
                              {transectionSummeryData?.businessFee?.toLocaleString()}{" "}
                              AED
                            </p>
                          </div>
                        )}
                        {transectionSummeryData?.beneficiaryFee >= 1 && (
                          <div>
                            <span className="text-muted-foreground">
                              Beneficiary Fee
                            </span>
                            <p className="font-medium">
                              {transectionSummeryData?.beneficiaryFee?.toLocaleString()}{" "}
                              AED
                            </p>
                          </div>
                        )}

                        <div>
                          <span className="text-muted-foreground">
                            Discount Amount
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.discountAmountAed} AED
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Total Payable
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.totalDebit?.toFixed(2)} AED
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Monthly Limit
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.monthlyLimit?.toFixed(2)}{" "}
                            AED
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Used Limit
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.currentMonthSpend?.toFixed(
                              2,
                            )}{" "}
                            AED
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Remaining Limit
                          </span>
                          <p className="font-medium">
                            {transectionSummeryData?.monthlyLimit?.toFixed(2) -
                              transectionSummeryData?.currentMonthSpend?.toFixed(
                                2,
                              )}{" "}
                            AED
                          </p>
                        </div>
                        {/* <div>
                          <span className="text-muted-foreground">
                            Processing Fee:
                          </span>
                          <p className="font-medium">AED {totals.fees}</p>
                        </div> */}
                      </div>
                      {/* <Separator className="my-3" /> */}
                      {/* <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">
                          Total Debit from Source:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          AED {totals.total.toLocaleString()}
                        </span>
                      </div> */}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/*Fee Management */}
            {range && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Fee Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>Country: {selectedBeneficiaryFee?.countryName}</div>
                    <div>
                      Fee Type:{" "}
                      {selectedBeneficiaryFee?.feeType
                        ?.charAt(0)
                        .toUpperCase() +
                        selectedBeneficiaryFee?.feeType?.slice(1).toLowerCase()}
                    </div>
                    <div>Fee Amount: {selectedBeneficiaryFee?.feeValue}</div>
                    <div>
                      Status:{" "}
                      {selectedBeneficiaryFee?.status?.charAt(0).toUpperCase() +
                        selectedBeneficiaryFee?.status
                          ?.slice(1)
                          .toLowerCase()}{" "}
                    </div>
                    <div>Min Amount: {selectedBeneficiaryFee?.minAmount} </div>
                    <div>Max Amount: {selectedBeneficiaryFee?.maxAmount} </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Supporting Documents
                  {getSelectedPurposeDetails()?.requiresDoc && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  onChange={handleDocumentUpload}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                    <CardContent
                      className="p-6 text-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload Documents</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG (Max 10MB)
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Uploaded Documents
                    </h4>
                    {uploadedDocuments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No documents uploaded
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {uploadedDocuments.map((doc: any, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{doc?.name}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {getSelectedPurposeDetails()?.requiresDoc &&
                  uploadedDocuments.length === 0 && (
                    <div className="bg-warning-muted/20 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            Documents Required
                          </p>
                          <p className="text-muted-foreground">
                            Please upload supporting documents for this
                            transaction type.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Fee Calculator */}
            {selectedBeneficiary && amount && (
              <FeeCalculator
                amount={parseFloat(amount)}
                currency={currency}
                country={
                  beneficiaries.find((b) => b.id === selectedBeneficiary)
                    ?.country || ""
                }
                transactionType="Single Transaction"
              />
            )}

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="notes">Transaction Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information about this transaction..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Approval Workflow Info */}
            <Card className="border-accent/20 bg-accent-muted/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      Approval Workflow
                    </p>
                    <p className="text-muted-foreground">
                      {totals && totals.originalAmount > 50000
                        ? "This transaction will require multi-tier approval (Treasury + CFO approval required)."
                        : "This transaction will be routed through standard approval process."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <div className="space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button
                  variant="business"
                  disabled={
                    !selectedBeneficiary ||
                    !selectedSource ||
                    !amount ||
                    !transactionPurpose
                  }
                  onClick={() => setShowConfirmation(true)}
                >
                  Submit for Processing
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={submitTransaction}
        title="Confirm Transaction Submission"
        description={`Are you sure you want to submit this transaction for ${totals?.originalAmount.toLocaleString()} ${getCurrencyName()}? This will route the transaction through the approval workflow.`}
        confirmText="Submit Transaction"
      />
    </>
  );
};

export default SingleTransactionWithPreselected;
