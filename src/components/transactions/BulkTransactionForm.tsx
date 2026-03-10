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

const BulkTransactionForm = ({
  trigger,
  refetch,
}: {
  trigger?: React.ReactNode;
  refetch?: () => void;
}) => {
  const { toast } = useToast();
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;

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

  // Per-beneficiary inputs
  const [beneficiaryAmounts, setBeneficiaryAmounts] = useState<Record<number, string>>({});
  const [beneficiaryDiscounts, setBeneficiaryDiscounts] = useState<Record<number, string>>({});

  // Mock sources (replace with real fetch if needed)
  const transactionSources = [
    {
      id: "1",
      name: "Emirates NBD Business Account",
      accountNumber: "AE070331234567890123456",
      balance: "245,000",
      currency: "AED",
    },
    {
      id: "2",
      name: "FAB USD Account",
      accountNumber: "AE070331987654321098765",
      balance: "85,000",
      currency: "USD",
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

  // ─── Fetch data ────────────────────────────────────────
  const getCurrency = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/exchange_rate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      (g: any) => g.id.toString() === selectedGroup
    ) ?? null;

  const getSelectedSourceDetails = () =>
    transactionSources.find((s) => s.id === selectedSource);

  // Change handlers
  const handleAmountChange = (id: number, value: string) => {
    setBeneficiaryAmounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleDiscountChange = (id: number, value: string) => {
    setBeneficiaryDiscounts((prev) => ({ ...prev, [id]: value.trim() }));
  };

  // Submit
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
        if (!amountStr || isNaN(amount) || amount <= 0) return null;

        return {
          beneficiaryId: Number(ben.id),
          amount,
          discountCode: beneficiaryDiscounts[ben.id] || "",
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
      currencyId: Number(currency),
      sourceAccountId: Number(selectedSource),
      beneficiaries: validBeneficiaries,
      discountCode: "", // global one – can be removed or kept
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
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
        description: `Submitted ${validBeneficiaries.length} payments for approval`,
      });

      setOpen(false);
      refetch?.();

      // Reset form
      setSelectedSource("");
      setTransactionPurpose("");
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
            <Label>Purpose of Transaction *</Label>
            <Select value={transactionPurpose} onValueChange={setTransactionPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposeOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      {p.label}
                      {p.requiresDoc && (
                        <Badge variant="outline" className="text-xs ml-2">
                          Doc
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Source of Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Source Account *</Label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {transactionSources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.currency} {s.balance}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {getSelectedSourceDetails() && (
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Account Number:</span>
                    <p className="font-medium font-mono">
                      {getSelectedSourceDetails()?.accountNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available Balance:</span>
                    <p className="font-medium text-green-600">
                      {getSelectedSourceDetails()?.currency}{" "}
                      {getSelectedSourceDetails()?.balance}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                  <span className="text-muted-foreground">No group selected</span>
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

            {selectedGroup && selectedGroup !== "none" && getSelectedGroup() && (
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
                        <TableHead>Value (Amount)</TableHead>
                        <TableHead>Discount Code</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSelectedGroup().beneficiaries.map((ben: any) => (
                        <TableRow key={ben.id}>
                          <TableCell>
                            <Badge variant="outline" className="flex w-fit items-center gap-1">
                              {ben.type === "BUSINESS" ? (
                                <Building className="h-3 w-3" />
                              ) : (
                                <Users className="h-3 w-3" />
                              )}
                              {ben.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{ben.type?.toLowerCase()}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="max-w-[160px]"
                              value={beneficiaryAmounts[ben.id] ?? ""}
                              onChange={(e) => handleAmountChange(ben.id, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="e.g. VKLXPD57"
                              className="max-w-[160px] font-mono"
                              value={beneficiaryDiscounts[ben.id] ?? ""}
                              onChange={(e) => handleDiscountChange(ben.id, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
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
                    <span className="text-sm truncate max-w-[220px]">{document.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDocument(null)}>
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
                    Transactions will be routed for approval. Expected processing time: 24-48 hours.
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
      <Dialog open={open} onOpenChange={setOpen}>
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
            <DialogTitle className="text-xl">Create Bulk Transaction</DialogTitle>
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
                  onClick={() => setCurrentStep(2)}
                  disabled={
                    !selectedGroup ||
                    selectedGroup === "none" ||
                    !transactionPurpose ||
                    !currency ||
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
                    disabled={loading || !document}
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

export default BulkTransactionForm;