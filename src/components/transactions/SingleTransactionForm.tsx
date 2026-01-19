// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
// import FeeCalculator from "@/components/fees/FeeCalculator";
// import { useToast } from "@/hooks/use-toast";
// import BASE_URL from "@/config/config";
// import { useCookies } from "react-cookie";

// import { 
//   Plus, 
//   DollarSign, 
//   FileText, 
//   Upload, 
//   User, 
//   Building,
//   AlertCircle,
//   Info,
//   CheckCircle,
//   CreditCard,
//   TrendingUp,
//   Calendar,
//   Trash2
// } from "lucide-react";

// interface SingleTransactionFormProps {
//   trigger?: React.ReactNode;
// }

// const SingleTransactionForm = ({ trigger }: SingleTransactionFormProps) => {
//   const { toast } = useToast();
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
//   const [selectedSource, setSelectedSource] = useState("");
//   const [transactionPurpose, setTransactionPurpose] = useState("");
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
//   const [notes, setNotes] = useState("");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [open, setOpen] = useState(false);


//   const [cookie] = useCookies(["token"]);
//     const token = cookie.token;

//   // Mock data - would come from backend
//   const beneficiaries = [
//     {
//       id: "BEN-001",
//       name: "Global Suppliers Inc",
//       type: "business",
//       accountNumber: "1234567890",
//       bankName: "Emirates NBD",
//       country: "UAE"
//     },
//     {
//       id: "BEN-002", 
//       name: "Tech Solutions Ltd",
//       type: "business",
//       accountNumber: "9876543210",
//       bankName: "ADCB Bank",
//       country: "UAE"
//     },
//     {
//       id: "BEN-003",
//       name: "John Smith",
//       type: "individual",
//       accountNumber: "5555666677",
//       bankName: "State Bank of India",
//       country: "India"
//     }
//   ];

//   const transactionSources = [
//     {
//       id: "SRC-001",
//       name: "Emirates NBD Business Account",
//       accountNumber: "AE070331234567890123456",
//       balance: "245,000",
//       currency: "AED",
//       type: "current_account"
//     },
//     {
//       id: "SRC-002",
//       name: "FAB USD Account", 
//       accountNumber: "AE070331987654321098765",
//       balance: "85,000",
//       currency: "USD",
//       type: "foreign_currency"
//     }
//   ];

//   const purposeOptions = [
//     { value: "invoice_payment", label: "Invoice Payment", requiresDoc: true },
//     { value: "salary", label: "Salary Payment", requiresDoc: false },
//     { value: "vendor_payment", label: "Vendor Payment", requiresDoc: true },
//     { value: "supplier_payment", label: "Supplier Payment", requiresDoc: true },
//     { value: "service_payment", label: "Service Payment", requiresDoc: true },
//     { value: "rent_payment", label: "Rent Payment", requiresDoc: true },
//     { value: "utility_payment", label: "Utility Payment", requiresDoc: false },
//     { value: "loan_repayment", label: "Loan Repayment", requiresDoc: false },
//     { value: "other", label: "Other", requiresDoc: false }
//   ];

//   const exchangeRates = {
//     "USD": { rate: "3.673", fees: "15.00" },
//     "EUR": { rate: "3.985", fees: "18.00" },
//     "GBP": { rate: "4.651", fees: "20.00" },
//     "INR": { rate: "0.044", fees: "12.00" }
//   };

//   const getSelectedBeneficiaryDetails = () => {
//     return beneficiaries.find(b => b.id === selectedBeneficiary);
//   };

//   const getSelectedSourceDetails = () => {
//     return transactionSources.find(s => s.id === selectedSource);
//   };

//   const getSelectedPurposeDetails = () => {
//     return purposeOptions.find(p => p.value === transactionPurpose);
//   };

//   const calculateTotalAmount = () => {
//     if (!amount || !currency) return null;
    
//     const amountNum = parseFloat(amount);
//     const exchangeRate = parseFloat(exchangeRates[currency as keyof typeof exchangeRates]?.rate || "1");
//     const fees = parseFloat(exchangeRates[currency as keyof typeof exchangeRates]?.fees || "0");
    
//     return {
//       originalAmount: amountNum,
//       aedAmount: amountNum * exchangeRate,
//       fees: fees,
//       total: (amountNum * exchangeRate) + fees
//     };
//   };

//   const handleDocumentUpload = (file: string) => {
//     setUploadedDocuments([...uploadedDocuments, file]);
//   };

//   const removeDocument = (index: number) => {
//     setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
//   };

//   const totals = calculateTotalAmount();

//   const handleSubmit = () => {
//     toast({
//       title: "Transaction Submitted",
//       description: "Your transaction has been submitted for processing and approval.",
//     });
//     setOpen(false);
//     // Reset form
//     setSelectedBeneficiary("");
//     setSelectedSource("");
//     setTransactionPurpose("");
//     setAmount("");
//     setCurrency("USD");
//     setUploadedDocuments([]);
//     setNotes("");
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="business">
//             <Plus className="h-4 w-4 mr-2" />
//             Single Payment
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl">Create Single Transaction</DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-6 mt-6">
//           {/* Transaction Purpose */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <FileText className="h-5 w-5" />
//                 Transaction Purpose
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="purpose">Purpose of Transaction *</Label>
//                 <Select value={transactionPurpose} onValueChange={setTransactionPurpose}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select transaction purpose" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border border-border z-50">
//                     {purposeOptions.map((purpose) => (
//                       <SelectItem key={purpose.value} value={purpose.value}>
//                         <div className="flex items-center justify-between w-full">
//                           <span>{purpose.label}</span>
//                           {purpose.requiresDoc && (
//                             <Badge variant="outline" className="ml-2 text-xs">
//                               Doc Required
//                             </Badge>
//                           )}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {getSelectedPurposeDetails()?.requiresDoc && (
//                 <div className="bg-accent-muted/20 rounded-lg p-3">
//                   <div className="flex items-start space-x-2">
//                     <Info className="h-4 w-4 text-accent mt-0.5" />
//                     <div className="text-sm">
//                       <p className="font-medium text-foreground">Supporting Documents Required</p>
//                       <p className="text-muted-foreground">
//                         Please upload relevant documents for {getSelectedPurposeDetails()?.label.toLowerCase()} verification.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Source of Transaction */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Source of Transaction
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="source">Select Source Account *</Label>
//                 <Select value={selectedSource} onValueChange={setSelectedSource}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose source account" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border border-border z-50">
//                     {transactionSources.map((source) => (
//                       <SelectItem key={source.id} value={source.id}>
//                         <div className="flex flex-col">
//                           <span className="font-medium">{source.name}</span>
//                           <span className="text-xs text-muted-foreground">
//                             Balance: {source.currency} {Number(source.balance).toLocaleString()}
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {getSelectedSourceDetails() && (
//                 <Card className="border-l-4 border-l-primary">
//                   <CardContent className="p-3">
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Account Number:</span>
//                         <p className="font-medium font-mono">{getSelectedSourceDetails()?.accountNumber}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Available Balance:</span>
//                         <p className="font-medium text-success">
//                           {getSelectedSourceDetails()?.currency} {Number(getSelectedSourceDetails()?.balance).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </CardContent>
//           </Card>

//           {/* Beneficiary Selection */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Beneficiary Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="beneficiary">Select Beneficiary *</Label>
//                 <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose beneficiary" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border border-border z-50">
//                     {beneficiaries.map((beneficiary) => (
//                       <SelectItem key={beneficiary.id} value={beneficiary.id}>
//                         <div className="flex items-center space-x-2">
//                           {beneficiary.type === "business" ? (
//                             <Building className="h-4 w-4" />
//                           ) : (
//                             <User className="h-4 w-4" />
//                           )}
//                           <div className="flex flex-col">
//                             <span className="font-medium">{beneficiary.name}</span>
//                             <span className="text-xs text-muted-foreground">
//                               {beneficiary.bankName} • {beneficiary.country}
//                             </span>
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {getSelectedBeneficiaryDetails() && (
//                 <Card className="border-l-4 border-l-accent">
//                   <CardContent className="p-3">
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Account Number:</span>
//                         <p className="font-medium font-mono">{getSelectedBeneficiaryDetails()?.accountNumber}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Bank:</span>
//                         <p className="font-medium">{getSelectedBeneficiaryDetails()?.bankName}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </CardContent>
//           </Card>

//           {/* Transaction Amount */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <DollarSign className="h-5 w-5" />
//                 Transaction Amount
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="amount">Amount *</Label>
//                   <Input
//                     id="amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="0.00"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="currency">Currency *</Label>
//                   <Select value={currency} onValueChange={setCurrency}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select currency" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background border border-border z-50">
//                       {Object.keys(exchangeRates).map((curr) => (
//                         <SelectItem key={curr} value={curr}>{curr}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {totals && (
//                 <Card className="bg-accent-muted/10 border-accent/20">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-2 mb-3">
//                       <TrendingUp className="h-4 w-4 text-accent" />
//                       <span className="font-medium text-foreground">Transaction Summary</span>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Amount:</span>
//                         <p className="font-medium">{currency} {totals.originalAmount.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Exchange Rate:</span>
//                         <p className="font-medium">1 {currency} = {exchangeRates[currency as keyof typeof exchangeRates]?.rate} AED</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">AED Amount:</span>
//                         <p className="font-medium">AED {totals.aedAmount.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Processing Fee:</span>
//                         <p className="font-medium">AED {totals.fees}</p>
//                       </div>
//                     </div>
//                     <Separator className="my-3" />
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-foreground">Total Debit from Source:</span>
//                       <span className="text-lg font-bold text-primary">AED {totals.total.toLocaleString()}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </CardContent>
//           </Card>

//           {/* Document Upload */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Upload className="h-5 w-5" />
//                 Supporting Documents
//                 {getSelectedPurposeDetails()?.requiresDoc && (
//                   <Badge variant="destructive" className="text-xs">Required</Badge>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
//                   <CardContent 
//                     className="p-6 text-center"
//                     onClick={() => handleDocumentUpload("invoice_001.pdf")}
//                   >
//                     <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                     <p className="text-sm font-medium">Upload Documents</p>
//                     <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
//                   </CardContent>
//                 </Card>
                
//                 <div className="space-y-2">
//                   <h4 className="font-medium text-foreground">Uploaded Documents</h4>
//                   {uploadedDocuments.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">No documents uploaded</p>
//                   ) : (
//                     <div className="space-y-2">
//                       {uploadedDocuments.map((doc, index) => (
//                         <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <FileText className="h-4 w-4 text-primary" />
//                             <span className="text-sm">{doc}</span>
//                           </div>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => removeDocument(index)}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {getSelectedPurposeDetails()?.requiresDoc && uploadedDocuments.length === 0 && (
//                 <div className="bg-warning-muted/20 rounded-lg p-3">
//                   <div className="flex items-start space-x-2">
//                     <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
//                     <div className="text-sm">
//                       <p className="font-medium text-foreground">Documents Required</p>
//                       <p className="text-muted-foreground">
//                         Please upload supporting documents for this transaction type.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Fee Calculator */}
//           {selectedBeneficiary && amount && (
//             <FeeCalculator
//               amount={parseFloat(amount)}
//               currency={currency}
//               country={beneficiaries.find(b => b.id === selectedBeneficiary)?.country || ""}
//               transactionType="Single Transaction"
//             />
//           )}

//           {/* Additional Notes */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Additional Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div>
//                 <Label htmlFor="notes">Transaction Notes (Optional)</Label>
//                 <Textarea
//                   id="notes"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Add any additional information about this transaction..."
//                   rows={3}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Approval Workflow Info */}
//           <Card className="border-accent/20 bg-accent-muted/10">
//             <CardContent className="p-4">
//               <div className="flex items-start space-x-3">
//                 <Info className="h-5 w-5 text-accent mt-0.5" />
//                 <div className="text-sm">
//                   <p className="font-medium text-foreground">Approval Workflow</p>
//                   <p className="text-muted-foreground">
//                     {totals && totals.originalAmount > 50000 
//                       ? "This transaction will require multi-tier approval (Treasury + CFO approval required)."
//                       : "This transaction will be routed through standard approval process."
//                     }
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="flex justify-between pt-6 border-t">
//             <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//             <div className="space-x-3">
//               <Button variant="outline">Save as Draft</Button>
//               <Button 
//                 variant="business" 
//                 disabled={!selectedBeneficiary || !selectedSource || !amount || !transactionPurpose}
//                 onClick={() => setShowConfirmation(true)}
//               >
//                 Submit for Processing
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>

//     <ConfirmationDialog
//       open={showConfirmation}
//       onOpenChange={setShowConfirmation}
//       onConfirm={handleSubmit}
//       title="Confirm Transaction Submission"
//       description={`Are you sure you want to submit this transaction for ${totals?.originalAmount.toLocaleString()} ${currency}? This will route the transaction through the approval workflow.`}
//       confirmText="Submit Transaction"
//     />
//     </>
//   );
// };

// export default SingleTransactionForm;




import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Plus, FileText, Upload, User, DollarSign, CreditCard, Trash2
} from "lucide-react";

/* ---------------- PURPOSE CONFIG ---------------- */
const PURPOSES = [
  { code: "INVOICE_PAYMENT", label: "Invoice Payment", doc: true },
  { code: "SALARY_PAYMENT", label: "Salary Payment", doc: false },
  { code: "VENDOR_PAYMENT", label: "Vendor Payment", doc: true },
  { code: "SUPPLIER_PAYMENT", label: "Supplier Payment", doc: true },
  { code: "SERVICE_PAYMENT", label: "Service Payment", doc: true },
  { code: "RENT_PAYMENT", label: "Rent Payment", doc: true },
  { code: "UTILITY_PAYMENT", label: "Utility Payment", doc: false },
  { code: "LOAN_REPAYMENT", label: "Loan Repayment", doc: false },
  { code: "OTHER", label: "Other", doc: false },
];

/* ---------------- SOURCE ACCOUNTS ---------------- */
const transactionSources = [
  { id: 1, name: "Emirates NBD Business Account", currency: "AED" },
  { id: 2, name: "FAB USD Account", currency: "USD" },
];

const SingleTransactionForm = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [beneficiaryId, setBeneficiaryId] = useState("");

  const [purpose, setPurpose] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState<number | null>(null);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [notes, setNotes] = useState("");

  const [documents, setDocuments] = useState<File[]>([]);

  /* ---------------- FETCH BENEFICIARIES ---------------- */
  useEffect(() => {
    if (!open) return;

    axios.get(`${BASE_URL}/api/v1/beneficiaries`, {
      headers: { Authorization: `Bearer ${cookies.token}` },
    })
      .then(res => setBeneficiaries(res.data.data))
      .catch(() =>
        toast({ variant: "destructive", title: "Failed to load beneficiaries" })
      );
  }, [open]);

  /* ---------------- SOURCE → CURRENCY ---------------- */
  useEffect(() => {
    const src = transactionSources.find(s => s.id === sourceAccountId);
    if (src) setCurrency(src.currency);
  }, [sourceAccountId]);

  const selectedPurpose = PURPOSES.find(p => p.code === purpose);

  /* ---------------- DOCUMENT HANDLING ---------------- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setDocuments(Array.from(e.target.files));
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- SUBMIT (🔥 FIXED) ---------------- */
  const submitTransaction = async () => {
    if (selectedPurpose?.doc && documents.length === 0) {
      toast({
        variant: "destructive",
        title: "Supporting documents are required",
      });
      return;
    }

    // ✅ This matches Postman "data"
    const payload = {
      purposeCode: purpose,
      sourceAccountId,
      beneficiaryId,
      amount: Number(amount),
      currency,
      notes,
    };

    const formData = new FormData();

    // ✅ REQUIRED: data as JSON blob
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );

    // ✅ documents
    documents.forEach(file => {
      formData.append("documents", file);
    });

    try {
      await axios.post(
        `${BASE_URL}/api/v1/transactions/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            // ❌ DO NOT SET Content-Type
          },
        }
      );

      toast({ title: "Transaction created successfully" });
      setOpen(false);
      setConfirm(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.response?.data?.message || "Transaction failed",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Single Payment
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Single Transaction</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            {/* PURPOSE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Purpose *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                  <SelectContent>
                    {PURPOSES.map(p => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.label}
                        {p.doc && <Badge className="ml-2">Doc Required</Badge>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* SOURCE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Source Account *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={sourceAccountId?.toString()}
                  onValueChange={v => setSourceAccountId(Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {transactionSources.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name} — {s.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* BENEFICIARY */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Beneficiary *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={beneficiaryId} onValueChange={setBeneficiaryId}>
                  <SelectTrigger><SelectValue placeholder="Select beneficiary" /></SelectTrigger>
                  <SelectContent>
                    {beneficiaries.map(b => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* AMOUNT */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Amount *
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <Input value={currency} disabled />
              </CardContent>
            </Card>

            {/* DOCUMENTS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input type="file" multiple onChange={handleFileUpload} />
                <div className="mt-3 space-y-2">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{doc.name}</span>
                      <Button size="sm" variant="outline" onClick={() => removeDocument(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NOTES */}
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setConfirm(true)}>Submit</Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Confirm Transaction"
        description="Submit this transaction?"
        confirmText="Submit"
        onConfirm={submitTransaction}
      />
    </>
  );
};

export default SingleTransactionForm;
