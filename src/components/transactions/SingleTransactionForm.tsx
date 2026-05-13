// import { useEffect, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
//   Trash2,
// } from "lucide-react";
// import axios from "axios";
// //import { METHODS } from "http";

// interface SingleTransactionFormProps {
//   trigger?: React.ReactNode;
//   refetch?: () => void;
// }

// const SingleTransactionForm = ({
//   trigger,
//   refetch,
// }: SingleTransactionFormProps) => {
//   const { toast } = useToast();
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
//   const [selectedSource, setSelectedSource] = useState("");
//   const [transactionPurpose, setTransactionPurpose] = useState("");
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("");
//   const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
//   const [notes, setNotes] = useState("");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [currencyListData, setCurrencyListData] = useState(null);
//   const [beneficiariesList, setBeneficiariesList] = useState([]);
//   const [feeManagementData, setFeeManagementData] = useState([]);
//   const [discountCode, setDiscountCode] = useState("");
//   const [feeRule, setFeeRule] = useState<any>({});
//   const [receiverAmount, setReceiverAmount] = useState("");
//   const [feeResponsibility, setFeeResponsibility] = useState("");
//   const [selectedBeneficiaryFee, setSelectedBeneficiaryFee] =
//     useState<any>(null);
//   const [cookie] = useCookies(["token"]);
//   const [transectionSummeryData, setTransectionSummeryData] =
//     useState<any>(null);

//   //payoutdetails
//   const [payoutDetails, setPayoutDetails] = useState<any>(null);
//   const [loadingPayout, setLoadingPayout] = useState(false);
//   const [payoutError, setPayoutError] = useState<string | null>(null);
//   const [selectedPayoutDetailId, setSelectedPayoutDetailId] = useState<
//     number | null
//   >(null);
//   const [selectedPayoutCurrencyCode, setSelectedPayoutCurrencyCode] =
//     useState<string>("");
//   const [selectedPayoutCurrencyRate, setSelectedPayoutCurrencyRate] =
//     useState<number>(1);

//   const token = cookie.token;
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // const transactionSources = [
//   //   {
//   //     id: "1",
//   //     name: "Emirates NBD Business Account",
//   //     accountNumber: "AE070331234567890123456",
//   //     balance: "245,000",
//   //     currency: "AED",
//   //     type: "current_account",
//   //   },
//   //   {
//   //     id: "2",
//   //     name: "FAB USD Account",
//   //     accountNumber: "AE070331987654321098765",
//   //     balance: "85,000",
//   //     currency: "USD",
//   //     type: "foreign_currency",
//   //   },
//   // ];

//   const transactionSources = [
//     {
//       id: "1",
//       name: "Cheque",
//     },
//     {
//       id: "2",
//       name: "Online Transfer",
//     },
//     {
//       id: "3",
//       name: "Cash",
//     },
//   ];

//   const feeResponsibilityList = [
//     {
//       value: "BUSINESS",
//       label: "Business",
//     },
//     {
//       value: "BENEFICIARY",
//       label: "Beneficiary",
//     },
//     {
//       value: "SHARED",
//       label: "Shared",
//     },
//   ];

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
//   // Reset form fields when beneficiary changes
//   useEffect(() => {
//     if (selectedBeneficiary) {
//       setAmount("");
//       setReceiverAmount("");
//       setFeeResponsibility("");
//       setDiscountCode("");
//       setNotes("");
//       setTransectionSummeryData(null);
//       // Payout selection is already reset in the fetchPayoutDetails useEffect
//     }
//   }, [selectedBeneficiary]);
//   //beneficiaries payout details
//   useEffect(() => {
//     //if (!selectedBeneficiary) {
//     //  setPayoutDetails(null);
//     //  setPayoutError(null);
//     //  setSelectedPayoutDetailId(null);
//     //  return;
//     //}
//     if (!selectedBeneficiary) {
//       setPayoutDetails(null);
//       setPayoutError(null);
//       setSelectedPayoutDetailId(null);
//       setSelectedPayoutCurrencyCode("");
//       setSelectedPayoutCurrencyRate(1);
//       return;
//     }
//     const fetchPayoutDetails = async () => {
//       setLoadingPayout(true);
//       setPayoutError(null);
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/api/v1/beneficiaries/${selectedBeneficiary}/payout-details`,
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         if (res?.data?.status === true) {
//           setPayoutDetails(res?.data?.data);
//         } else {
//           setPayoutError(res.data?.message || "Failed to load payout details");
//         }
//       } catch (err: any) {
//         setPayoutError(err?.response?.data?.message || err.message);
//       } finally {
//         setLoadingPayout(false);
//       }
//     };

//     fetchPayoutDetails();
//   }, [selectedBeneficiary, token]);

//   const selectedBeneficiaryData = beneficiariesList?.find(
//     (b: any) => String(b.id) === selectedBeneficiary,
//   );

//   const getSelectedSourceDetails = () => {
//     return transactionSources.find((s) => s.id === selectedSource);
//   };

//   const getSelectedPurposeDetails = () => {
//     return purposeOptions.find((p) => p.value === transactionPurpose);
//   };

//   const calculateTotalAmount = () => {
//     if (!amount || !currency) return null;

//     const amountNum = parseFloat(amount);
//     // const exchangeRate = parseFloat(
//     //   exchangeRates[currency as keyof typeof exchangeRates]?.rate || "1",
//     // );
//     const exchangeRate = parseFloat(
//       currencyListData?.data?.find(
//         (currencyList: any) => currencyList?.id == currency,
//       )?.rate || "1",
//     );
//     // const fees = parseFloat(
//     //   exchangeRates[currency as keyof typeof exchangeRates]?.fees || "0",
//     // );
//     const fees = parseFloat(
//       currencyListData?.data?.find(
//         (currencyList: any) => currencyList?.id == currency,
//       )?.processingFee || "0",
//     );
//     return {
//       originalAmount: amountNum,
//       aedAmount: amountNum * exchangeRate,
//       fees: fees,
//       total: amountNum * exchangeRate + fees,
//     };
//   };

//   // const handleDocumentUpload = (file: string) => {
//   //   setUploadedDocuments([...uploadedDocuments, file]);
//   // };

//   // const removeDocument = (index: number) => {
//   //   setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
//   // };

//   const totals = calculateTotalAmount();

//   useEffect(() => {
//     if (!open) return;

//     axios
//       .get(`${BASE_URL}/api/v1/beneficiaries`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setBeneficiariesList(res?.data?.data?.beneficiaries))
//       .catch(() =>
//         toast({
//           variant: "destructive",
//           title: "Failed to load beneficiaries",
//         }),
//       );
//   }, [open]);
//   const submitTransaction = async () => {
//     // if (selectedPurpose?.doc && documents.length === 0) {
//     //   toast({
//     //     variant: "destructive",
//     //     title: "Supporting documents are required",
//     //   });
//     //   return;
//     // }

//     // ✅ This matches Postman "data"
//     const payload = {
//       purposeCode: transactionPurpose,
//       sourceAccountId: selectedSource,
//       beneficiaryId: selectedBeneficiary,
//       amount: Number(receiverAmount),
//       feeResponsibility,
//       // discountCode: "",
//       currencyId: currency,
//       notes,
//       discountCode: discountCode.trim() || "",
//       beneficiaryPayoutDetailId: selectedPayoutDetailId,
//     };

//     const formData = new FormData();

//     // ✅ REQUIRED: data as JSON blob
//     formData.append(
//       "data",
//       new Blob([JSON.stringify(payload)], {
//         type: "application/json",
//       }),
//     );

//     // ✅ documents
//     uploadedDocuments?.forEach((file) => {
//       formData.append("documents", file);
//     });
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/v1/transactions/single`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // ❌ DO NOT SET Content-Type
//           },
//         },
//       );
//       if (res?.data?.status === false) {
//         toast({
//           variant: "destructive",
//           title: res?.data?.message || "Transaction failed",
//         });
//       } else {
//         toast({ title: "Transaction created successfully" });
//       }
//       refetch?.();
//       setOpen(false);
//       setShowConfirmation(false);
//       setSelectedBeneficiary("");
//       setSelectedSource("");
//       setTransactionPurpose("");
//       setAmount("");
//       setReceiverAmount("");
//       setCurrency("");
//       setUploadedDocuments([]);
//       setNotes("");
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: err?.response?.data?.message || "Transaction failed",
//       });
//     }
//   };
//   const fetchFeeRulesForTransaction = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/v3/fees/${selectedBeneficiary}/get-fee-rules-for-transaction`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       setFeeRule(res?.data?.data);
//     } catch (err) {
//       console.log("error", err);
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const getCurrency = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/exchange_rate`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();
//       if (json?.status !== true || !json.data) {
//         throw new Error("Unexpected response format");
//       }
//       setCurrencyListData(json);
//     } catch (error) {
//       const msg = error.message || "Failed to load rate-deals";
//       toast({ title: "Error", description: msg, variant: "destructive" });
//     }
//   };
//   const getFeeManagement = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/v3/fees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const json = await res.json();
//       if (json?.status !== true || !json.data) {
//         throw new Error("Unexpected response format");
//       }
//       setFeeManagementData(json?.data?.rules);
//     } catch (error) {
//       console.error("Error", error);
//     }
//   };
//   const handleTransationSummary = async () => {
//     const payload = {
//       purposeCode: transactionPurpose,
//       sourceAccountId: selectedSource,
//       beneficiaryId: selectedBeneficiary,
//       amount: Number(receiverAmount),
//       // discountCode: "",
//       currencyId: currency,
//       notes,
//       discountCode: discountCode.trim() || "",
//     };

//     const formData = new FormData();

//     // ✅ REQUIRED: data as JSON blob
//     formData.append(
//       "data",
//       new Blob([JSON.stringify(payload)], {
//         type: "application/json",
//       }),
//     );

//     // ✅ documents
//     uploadedDocuments?.forEach((file) => {
//       formData.append("documents", file);
//     });
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/v1/business/transactions/single/preview`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // ❌ DO NOT SET Content-Type
//           },
//         },
//       );
//       if (!res?.status) {
//         toast({
//           variant: "destructive",
//           title: res?.data?.message || "Transaction failed",
//         });
//       }
//       setTransectionSummeryData(res?.data?.data);
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: err?.response?.data?.message || "Transaction failed",
//       });
//     }
//   };
//   useEffect(() => {
//     getCurrency();
//     getFeeManagement();
//   }, []);
//   const getCurrencyName = () => {
//     const currencyName = currencyListData?.data
//       ?.find((currencyList: any) => currencyList?.id == currency)
//       ?.name.toUpperCase();
//     return currencyName;
//   };
//   const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // optional size check (10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       alert("File size must be less than 10MB");
//       return;
//     }

//     setUploadedDocuments((prev: any) => [...prev, file]);

//     // reset input so same file can be uploaded again
//     e.target.value = "";
//   };

//   const removeDocument = (index: number) => {
//     setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
//   };
//   const getSelectedBeneficiriesData = beneficiariesList?.find(
//     (beneficiaries: any) => beneficiaries?.id == selectedBeneficiary,
//   );

//   const singleTransationFeeManagementData = feeManagementData?.filter(
//     (fee: any) => fee?.transactionType == "SINGLE",
//   );

//   // Get the first payout method's currency code, fallback to
//   const beneficiaryCurrencyCode =
//     getSelectedBeneficiriesData?.payoutDetails?.[0]?.currencyCode || "AED";

//   const beneficiariyCurrency = currencyListData?.data?.find(
//     (currency: any) =>
//       currency?.name?.toLowerCase() === beneficiaryCurrencyCode.toLowerCase(),
//   );

//   useEffect(() => {
//     setCurrency(beneficiariyCurrency?.id);
//   }, [beneficiariyCurrency]);

//   useEffect(() => {
//     if (!selectedBeneficiary) return;
//     fetchFeeRulesForTransaction();
//   }, [selectedBeneficiary]);
//   // useEffect(() => {
//   //   setReceiverAmount(String(Number(amount) * beneficiariyCurrency?.rate));
//   // }, [amount, beneficiariyCurrency?.rate]);
//   useEffect(() => {
//     const fee = singleTransationFeeManagementData?.filter(
//       (fee: any) => fee?.countryId === getSelectedBeneficiriesData?.countryId,
//     );
//     const range = fee?.find(
//       (fee: any) =>
//         Number(amount) >= fee?.minAmount && Number(amount) <= fee?.maxAmount,
//     );
//     setSelectedBeneficiaryFee(range);
//     if (amount == "" || fee?.length == 0) {
//       setSelectedBeneficiaryFee(null);
//     }
//   }, [amount]);

//   const fee = singleTransationFeeManagementData?.filter(
//     (fee: any) => fee?.countryId === getSelectedBeneficiriesData?.countryId,
//   );
//   const range = fee?.find(
//     (fee: any) =>
//       Number(amount) >= fee?.minAmount && Number(amount) <= fee?.maxAmount,
//   );
//   console.log("selectedBeneficiary", selectedBeneficiary);
//   return (
//     <>
//       <Dialog
//         open={open}
//         onOpenChange={(open) => {
//           setOpen(open);
//           if (!open) {
//             setTransectionSummeryData(null);
//             setSelectedBeneficiary("");
//             setSelectedSource("");
//             setTransactionPurpose("");
//             setAmount("");
//             setReceiverAmount("");
//             setCurrency("");
//             setUploadedDocuments([]);
//             setNotes("");
//             setSelectedPayoutDetailId(null);
//             setSelectedPayoutCurrencyCode(""); // <-- ADD
//             setSelectedPayoutCurrencyRate(1); // <-- ADD
//           }
//         }}
//       >
//         <DialogTrigger asChild>
//           {trigger || (
//             <Button variant="business">
//               <Plus className="h-4 w-4 mr-2" />
//               Single Payment
//             </Button>
//           )}
//         </DialogTrigger>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl">
//               Create Single Transaction
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-6 mt-6">
//             {/* Transaction Purpose */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <FileText className="h-5 w-5" />
//                   Transaction Purpose
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="purpose">
//                     Purpose of Transaction{" "}
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={transactionPurpose}
//                     onValueChange={setTransactionPurpose}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select transaction purpose" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background border border-border z-50">
//                       {purposeOptions?.map((purpose) => (
//                         <SelectItem key={purpose.value} value={purpose.value}>
//                           <div className="flex items-center justify-between w-full">
//                             <span>{purpose.label}</span>
//                             {purpose.requiresDoc && (
//                               <Badge variant="outline" className="ml-2 text-xs">
//                                 Doc Required
//                               </Badge>
//                             )}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {getSelectedPurposeDetails()?.requiresDoc && (
//                   <div className="bg-accent-muted/20 rounded-lg p-3">
//                     <div className="flex items-start space-x-2">
//                       <Info className="h-4 w-4 text-accent mt-0.5" />
//                       <div className="text-sm">
//                         <p className="font-medium text-foreground">
//                           Supporting Documents Required
//                         </p>
//                         <p className="text-muted-foreground">
//                           Please upload relevant documents for{" "}
//                           {getSelectedPurposeDetails()?.label?.toLowerCase()}{" "}
//                           verification.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Source of Transaction */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <CreditCard className="h-5 w-5" />
//                   Mode of Transaction
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="source">
//                     Select Source Account{" "}
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={selectedSource}
//                     onValueChange={setSelectedSource}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose source account" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background border border-border z-50">
//                       {transactionSources?.map((source) => (
//                         <SelectItem key={source.id} value={source.id}>
//                           <div className="flex flex-col">
//                             <span className="font-medium">{source.name}</span>
//                             {/* <span className="text-xs text-muted-foreground">
//                               Balance: {source.currency}{" "}
//                               {Number(source.balance).toLocaleString()}
//                             </span> */}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* {getSelectedSourceDetails() && (
//                   <Card className="border-l-4 border-l-primary">
//                     <CardContent className="p-3">
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="text-muted-foreground">
//                             Account Number:
//                           </span>
//                           <p className="font-medium font-mono">
//                             {getSelectedSourceDetails()?.accountNumber}
//                           </p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">
//                             Available Balance:
//                           </span>
//                           <p className="font-medium text-success">
//                             {getSelectedSourceDetails()?.currency}{" "}
//                             {Number(
//                               getSelectedSourceDetails()?.balance,
//                             ).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )} */}
//               </CardContent>
//             </Card>

//             {/* Beneficiary Selection */}
//             {/* Beneficiary Selection */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Beneficiary Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="beneficiary">
//                     Select Beneficiary <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={selectedBeneficiary}
//                     onValueChange={setSelectedBeneficiary}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose beneficiary" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background border border-border z-50">
//                       {beneficiariesList?.map((beneficiary: any) => (
//                         <SelectItem
//                           key={beneficiary.id}
//                           value={String(beneficiary.id)}
//                         >
//                           <div className="flex items-center space-x-2">
//                             {beneficiary.type === "BUSINESS" ? (
//                               <Building className="h-4 w-4" />
//                             ) : (
//                               <User className="h-4 w-4" />
//                             )}
//                             <div className="flex flex-col">
//                               <span className="font-medium">
//                                 {beneficiary.name}
//                               </span>
//                               <span className="text-xs text-muted-foreground">
//                                 {beneficiary.bankName ||
//                                   beneficiary.countryName}{" "}
//                                 • {beneficiary.countryName}
//                               </span>
//                             </div>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Show selected beneficiary details (outside dropdown) */}
//                 {selectedBeneficiaryData && (
//                   <Card className="border-l-4 border-l-accent">
//                     <CardContent className="p-3">
//                       {/*<div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="text-muted-foreground">
//                             Account Number:
//                           </span>
//                           <p className="font-medium font-mono">
//                             {selectedBeneficiaryData.accountNumber ||
//                               selectedBeneficiaryData.payoutDetails?.[0]
//                                 ?.fieldValues?.["account number1"] ||
//                               "-"}
//                           </p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">Bank:</span>
//                           <p className="font-medium">
//                             {selectedBeneficiaryData.bankName ||
//                               selectedBeneficiaryData.payoutDetails?.[0]
//                                 ?.providerName ||
//                               "-"}
//                           </p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">IBAN:</span>
//                           <p className="font-mono text-sm">
//                             {selectedBeneficiaryData.iban || "-"}
//                           </p>
//                         </div>
//                       </div>*/}

//                       {/* Payout Details Section */}
//                       {loadingPayout && (
//                         <div className="mt-3 text-sm text-muted-foreground">
//                           Loading payout details...
//                         </div>
//                       )}
//                       {payoutError && (
//                         <div className="mt-3 text-sm text-destructive">
//                           Error: {payoutError}
//                         </div>
//                       )}
//                       {payoutDetails && payoutDetails.length > 0 && (
//                         <div className="mt-3 pt-3 border-t">
//                           <h4 className="text-sm font-semibold mb-2">
//                             Select Payout Method
//                           </h4>
//                           <div className="space-y-2">
//                             {payoutDetails.map((method: any, idx: number) => (
//                               <label
//                                 key={idx}
//                                 className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
//                               >
//                                 <input
//                                   type="radio"
//                                   name="payoutMethod"
//                                   value={method.payoutDetailId}
//                                   checked={
//                                     selectedPayoutDetailId ===
//                                     method.payoutDetailId
//                                   }
//                                   onChange={() => {
//                                     setSelectedPayoutDetailId(
//                                       method.payoutDetailId,
//                                     );
//                                     setSelectedPayoutCurrencyCode(
//                                       method.currencyCode,
//                                     );
//                                     // Find exchange rate for this currency from currencyListData
//                                     const currencyRate =
//                                       currencyListData?.data?.find(
//                                         (c: any) =>
//                                           c.name?.toLowerCase() ===
//                                           method.currencyCode.toLowerCase(),
//                                       )?.rate || 1;
//                                     setSelectedPayoutCurrencyRate(currencyRate);
//                                     // Also update the currency state to the selected currency's ID (for payload)
//                                     const currencyObj =
//                                       currencyListData?.data?.find(
//                                         (c: any) =>
//                                           c.name?.toLowerCase() ===
//                                           method.currencyCode.toLowerCase(),
//                                       );
//                                     if (currencyObj?.id)
//                                       setCurrency(String(currencyObj.id));
//                                     // Reset amounts when currency changes
//                                     setAmount("");
//                                     setReceiverAmount("");
//                                     setTransectionSummeryData(null);
//                                   }}
//                                   className="h-4 w-4"
//                                 />
//                                 <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
//                                   <span className="font-medium">
//                                     {method.payoutMechanismType}
//                                   </span>
//                                   <span>{method.currencyCode}</span>
//                                   <span className="text-muted-foreground">
//                                     {method.providerName || "Not specified"}
//                                   </span>
//                                 </div>
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </CardContent>
//             </Card>

//             {/*{feeRule?.id && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <DollarSign className="h-5 w-5" />
//                     Fee Rule
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

//                     <div className="p-4 border rounded-2xl shadow-sm bg-white">
//                       <h2 className="text-lg font-semibold mb-3">Business</h2>
//                       <div className="space-y-1 text-sm text-gray-700">
//                         <p>
//                           <span className="font-medium">Fee Type:</span>{" "}
//                           {feeRule?.businessFee?.businessFeeType || "-"}
//                         </p>
//                         <p>
//                           <span className="font-medium">Fee Value:</span>{" "}
//                           {feeRule?.businessFee?.businessFeeValue || "-"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="p-4 border rounded-2xl shadow-sm bg-white">
//                       <h2 className="text-lg font-semibold mb-3">
//                         Beneficiary
//                       </h2>
//                       <div className="space-y-1 text-sm text-gray-700">
//                         <p>
//                           <span className="font-medium">Fee Type:</span>{" "}
//                           {feeRule?.beneficiaryFee?.beneficiaryFeeType || "-"}
//                         </p>
//                         <p>
//                           <span className="font-medium">Fee Value:</span>{" "}
//                           {feeRule?.beneficiaryFee?.beneficiaryFeeValue || "-"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="p-4 border rounded-2xl shadow-sm bg-white">
//                       <h2 className="text-lg font-semibold mb-3">Shared</h2>
//                       <div className="space-y-1 text-sm text-gray-700">
//                         <p>
//                           <span className="font-medium">
//                             Business Fee Type:
//                           </span>{" "}
//                           {feeRule?.shareFee?.sharedBusinessFeeType || "-"}
//                         </p>
//                         <p>
//                           <span className="font-medium">
//                             Business Fee Value:
//                           </span>{" "}
//                           {feeRule?.shareFee?.sharedBusinessFeeValue || "-"}
//                         </p>
//                         <p>
//                           <span className="font-medium">
//                             Beneficiary Fee Type:
//                           </span>{" "}
//                           {feeRule?.shareFee?.sharedBeneficiaryFeeType || "-"}
//                         </p>
//                         <p>
//                           <span className="font-medium">
//                             Beneficiary Fee Value:
//                           </span>{" "}
//                           {feeRule?.shareFee?.sharedBeneficiaryFeeValue || "-"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
// */}

//             {/* Transaction Amount */}
//             {selectedBeneficiary && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <DollarSign className="h-5 w-5" />
//                     Transaction Amount
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h5 className="text-center font-bold mb-4 text-xl">
//                           Sender
//                         </h5>
//                         <Label htmlFor="amount">
//                           Amount(AED) <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                           id="amount"
//                           type="number"
//                           value={amount}
//                           //onChange={(e) => {
//                           //  const value = e.target.value;
//                           //  setAmount(value);
//                           //  setTransectionSummeryData(null);
//                           //  if (beneficiariyCurrency?.rate) {
//                           //    const result =
//                           //      Number(value) / beneficiariyCurrency.rate;
//                           //    setReceiverAmount(String(result.toFixed(2)));
//                           //  }
//                           //}}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setAmount(value);
//                             setTransectionSummeryData(null);
//                             if (selectedPayoutCurrencyRate) {
//                               const result =
//                                 Number(value) / selectedPayoutCurrencyRate;
//                               setReceiverAmount(String(result.toFixed(2)));
//                             }
//                           }}
//                           placeholder="0.00"
//                           step="0.01"
//                           onWheel={(e) => e.currentTarget.blur()}
//                         />
//                       </div>
//                       <div>
//                         <h5 className="text-center font-bold mb-4 text-xl">
//                           Receiver
//                         </h5>
//                         <Label htmlFor="receiverAmount">
//                           Amount ({selectedPayoutCurrencyCode})
//                         </Label>
//                         <Input
//                           id="receiverAmount"
//                           type="number"
//                           value={receiverAmount}
//                           //onChange={(e) => {
//                           //  const value = e.target.value;
//                           //  setReceiverAmount(value);
//                           //  setTransectionSummeryData(null);
//                           //  setAmount(
//                           //    String(
//                           //      Number(value) * beneficiariyCurrency?.rate,
//                           //    ),
//                           //  );
//                           //}}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setReceiverAmount(value);
//                             setTransectionSummeryData(null);
//                             setAmount(
//                               String(
//                                 Number(value) * selectedPayoutCurrencyRate,
//                               ),
//                             );
//                           }}
//                           placeholder="0.00"
//                           step="0.01"
//                           onWheel={(e) => e.currentTarget.blur()}
//                         />
//                       </div>
//                     </div>

//                     {/* ← New: Discount Code */}
//                     <div>
//                       <Label htmlFor="discountCode">Discount Code</Label>
//                       <Input
//                         id="discountCode"
//                         value={discountCode}
//                         onChange={(e) => setDiscountCode(e.target.value.trim())}
//                         placeholder="e.g. S43U3ZSC"
//                         maxLength={12}
//                       />
//                     </div>
//                     <div>
//                       <CardContent className="space-y-4">
//                         <div>
//                           <Label htmlFor="source">
//                             Select Fee Responsibility{" "}
//                             <span className="text-red-500">*</span>
//                           </Label>
//                           <Select
//                             value={feeResponsibility}
//                             onValueChange={setFeeResponsibility}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Choose fee responsibility" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-background border border-border z-50">
//                               {feeResponsibilityList?.map(
//                                 (feeResponsibility, index) => (
//                                   <SelectItem
//                                     key={index}
//                                     value={feeResponsibility.value}
//                                   >
//                                     <div className="flex flex-col">
//                                       <span className="font-medium">
//                                         {feeResponsibility.label}
//                                       </span>
//                                     </div>
//                                   </SelectItem>
//                                 ),
//                               )}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </CardContent>
//                     </div>
//                     {/*<div>
//                       <Label htmlFor="currency">Currency *</Label>
//                       <Select
//                         value={currency}
//                         onValueChange={setCurrency}
//                         disabled
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select currency" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-background border border-border z-50">
//                           {/* {Object.keys(exchangeRates).map((curr) => (
//                           <SelectItem key={curr} value={curr}>
//                             {curr}
//                           </SelectItem>
//                         ))}
//                           {currencyListData?.data?.map((curr: any) => (
//                             <SelectItem key={curr?.id} value={curr?.id}>
//                               {curr?.name?.toUpperCase()}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>*/}
//                   </div>
//                   {/*<Button
//                     variant="outline"
//                     onClick={() => handleTransationSummary()}
//                   >
//                     View Transaction Summary
//                   </Button>*/}
//                   {transectionSummeryData && amount && (
//                     <Card className="bg-accent-muted/10 border-accent/20">
//                       <CardContent className="p-4">
//                         <div className="flex items-center space-x-2 mb-3">
//                           <TrendingUp className="h-4 w-4 text-accent" />
//                           <span className="font-medium text-foreground">
//                             Transaction Summary
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div>
//                             <span className="text-muted-foreground">
//                               PayIn Amount
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.baseAedAmount?.toFixed(
//                                 2,
//                               )}
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">
//                               Exchange Rate
//                             </span>
//                             <p className="font-medium">
//                               1 AED ={" "}
//                               {(
//                                 1 / transectionSummeryData?.exchangeRate
//                               )?.toFixed(2)}{" "}
//                               {transectionSummeryData?.currency}
//                             </p>
//                           </div>
//                           {transectionSummeryData?.businessFee >= 1 && (
//                             <div>
//                               <span className="text-muted-foreground">
//                                 businessFee
//                               </span>
//                               <p className="font-medium">
//                                 {transectionSummeryData?.businessFee?.toLocaleString()}{" "}
//                                 AED
//                               </p>
//                             </div>
//                           )}
//                           {transectionSummeryData?.beneficiaryFee >= 1 && (
//                             <div>
//                               <span className="text-muted-foreground">
//                                 Beneficiary Fee
//                               </span>
//                               <p className="font-medium">
//                                 {transectionSummeryData?.beneficiaryFee?.toLocaleString()}{" "}
//                                 AED
//                               </p>
//                             </div>
//                           )}

//                           <div>
//                             <span className="text-muted-foreground">
//                               Discount Amount
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.discountAmountAed} AED
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">
//                               Total Payable
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.totalDebit?.toFixed(2)}{" "}
//                               AED
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">
//                               Monthly Limit
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.monthlyLimit?.toFixed(2)}{" "}
//                               AED
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">
//                               Used Limit
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.currentMonthSpend?.toFixed(
//                                 2,
//                               )}{" "}
//                               AED
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">
//                               Remaining Limit
//                             </span>
//                             <p className="font-medium">
//                               {transectionSummeryData?.monthlyLimit?.toFixed(
//                                 2,
//                               ) -
//                                 transectionSummeryData?.currentMonthSpend?.toFixed(
//                                   2,
//                                 )}{" "}
//                               AED
//                             </p>
//                           </div>
//                           {/* <div>
//                           <span className="text-muted-foreground">
//                             Processing Fee:
//                           </span>
//                           <p className="font-medium">AED {totals.fees}</p>
//                         </div> */}
//                         </div>
//                         {/* <Separator className="my-3" /> */}
//                         {/* <div className="flex justify-between items-center">
//                         <span className="font-medium text-foreground">
//                           Total Debit from Source:
//                         </span>
//                         <span className="text-lg font-bold text-primary">
//                           AED {totals.total.toLocaleString()}
//                         </span>
//                       </div> */}
//                       </CardContent>
//                     </Card>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/*Fee Management */}
//             {range && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <DollarSign className="h-5 w-5" />
//                     Fee Management
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>Country: {selectedBeneficiaryFee?.countryName}</div>
//                     <div>
//                       Fee Type:{" "}
//                       {selectedBeneficiaryFee?.feeType
//                         ?.charAt(0)
//                         .toUpperCase() +
//                         selectedBeneficiaryFee?.feeType
//                           ?.slice(1)
//                           ?.toLowerCase()}
//                     </div>
//                     <div>Fee Amount: {selectedBeneficiaryFee?.feeValue}</div>
//                     <div>
//                       Status:{" "}
//                       {selectedBeneficiaryFee?.status?.charAt(0).toUpperCase() +
//                         selectedBeneficiaryFee?.status
//                           ?.slice(1)
//                           ?.toLowerCase()}{" "}
//                     </div>
//                     <div>Min Amount: {selectedBeneficiaryFee?.minAmount} </div>
//                     <div>Max Amount: {selectedBeneficiaryFee?.maxAmount} </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Document Upload */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Upload className="h-5 w-5" />
//                   Supporting Documents
//                   {getSelectedPurposeDetails()?.requiresDoc && (
//                     <Badge variant="destructive" className="text-xs">
//                       Required
//                     </Badge>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Hidden file input */}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".pdf,.jpg,.png"
//                   className="hidden"
//                   onChange={handleDocumentUpload}
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
//                     <CardContent
//                       className="p-6 text-center"
//                       onClick={() => fileInputRef.current?.click()}
//                     >
//                       <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                       <p className="text-sm font-medium">Upload Documents</p>
//                       <p className="text-xs text-muted-foreground">
//                         PDF, JPG, PNG (Max 10MB)
//                       </p>
//                     </CardContent>
//                   </Card>

//                   <div className="space-y-2">
//                     <h4 className="font-medium text-foreground">
//                       Uploaded Documents
//                     </h4>
//                     {uploadedDocuments.length === 0 ? (
//                       <p className="text-sm text-muted-foreground">
//                         No documents uploaded
//                       </p>
//                     ) : (
//                       <div className="space-y-2">
//                         {uploadedDocuments.map((doc: any, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center justify-between p-2 bg-muted rounded-lg"
//                           >
//                             <div className="flex items-center space-x-2">
//                               <FileText className="h-4 w-4 text-primary" />
//                               <span className="text-sm">{doc?.name}</span>
//                             </div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => removeDocument(index)}
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {getSelectedPurposeDetails()?.requiresDoc &&
//                   uploadedDocuments.length === 0 && (
//                     <div className="bg-warning-muted/20 rounded-lg p-3">
//                       <div className="flex items-start space-x-2">
//                         <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
//                         <div className="text-sm">
//                           <p className="font-medium text-foreground">
//                             Documents Required
//                           </p>
//                           <p className="text-muted-foreground">
//                             Please upload supporting documents for this
//                             transaction type.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//               </CardContent>
//             </Card>

//             {/* Fee Calculator */}
//             {selectedBeneficiary && amount && (
//               <FeeCalculator
//                 amount={parseFloat(amount)}
//                 currency={currency}
//                 country={selectedBeneficiaryData?.countryName || ""}
//                 transactionType="Single Transaction"
//               />
//             )}

//             {/* Additional Notes */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Additional Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div>
//                   <Label htmlFor="notes">Transaction Notes (Optional)</Label>
//                   <Textarea
//                     id="notes"
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="Add any additional information about this transaction..."
//                     rows={3}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Approval Workflow Info */}
//             <Card className="border-accent/20 bg-accent-muted/10">
//               <CardContent className="p-4">
//                 <div className="flex items-start space-x-3">
//                   <Info className="h-5 w-5 text-accent mt-0.5" />
//                   <div className="text-sm">
//                     <p className="font-medium text-foreground">
//                       Approval Workflow
//                     </p>
//                     <p className="text-muted-foreground">
//                       {totals && totals.originalAmount > 50000
//                         ? "This transaction will require multi-tier approval (Treasury + CFO approval required)."
//                         : "This transaction will be routed through standard approval process."}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between pt-6 border-t">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setTransectionSummeryData(null);
//                   setSelectedBeneficiary("");
//                   setSelectedSource("");
//                   setTransactionPurpose("");
//                   setAmount("");
//                   setReceiverAmount("");
//                   setCurrency("");
//                   setUploadedDocuments([]);
//                   setNotes("");
//                   setOpen(false);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <div className="space-x-3">
//                 <Button variant="outline">Save as Draft</Button>
//                 <Button
//                   variant="business"
//                   disabled={
//                     !selectedBeneficiary ||
//                     !selectedSource ||
//                     !amount ||
//                     !transactionPurpose ||
//                     !selectedPayoutDetailId ||
//                     !feeResponsibility
//                   }
//                   onClick={() => setShowConfirmation(true)}
//                 >
//                   Submit for Processing
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <ConfirmationDialog
//         open={showConfirmation}
//         onOpenChange={setShowConfirmation}
//         onConfirm={submitTransaction}
//         title="Confirm Transaction Submission"
//         description={`Are you sure you want to submit this transaction ? This will route the transaction through the approval workflow.`}
//         // description={`Are you sure you want to submit this transaction for ${totals?.originalAmount.toLocaleString()} ${getCurrencyName()}? This will route the transaction through the approval workflow.`}
//         confirmText="Submit Transaction"
//       />
//     </>
//   );
// };

// export default SingleTransactionForm;

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
  trigger?: React.ReactNode;
  refetch?: () => void;
}

const SingleTransactionForm = ({
  trigger,
  refetch,
}: SingleTransactionFormProps) => {
  const { toast } = useToast();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [transactionPurpose, setTransactionPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingRateDeal, setLoadingRateDeal] = useState(false);
  const [currencyListData, setCurrencyListData] = useState(null);
  const [beneficiariesList, setBeneficiariesList] = useState([]);
  const [feeManagementData, setFeeManagementData] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [feeRule, setFeeRule] = useState<any>({});
  const [receiverAmount, setReceiverAmount] = useState("");
  const [feeResponsibility, setFeeResponsibility] = useState("");
  const [selectedBeneficiaryFee, setSelectedBeneficiaryFee] =
    useState<any>(null);
  const [rateDealData, setRateDealData] = useState<any>({});
  const [cookie] = useCookies(["token", "currencyCode"]);
  const [transectionSummeryData, setTransectionSummeryData] =
    useState<any>(null);

  //payoutdetails
  const [payoutDetails, setPayoutDetails] = useState<any>(null);
  const [transactionPurposeList, setTransactionPurposeList] = useState<any>([]);
  const [loadingPayout, setLoadingPayout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [selectedPayoutDetailId, setSelectedPayoutDetailId] = useState<
    number | null
  >(null);
  const [activeField, setActiveField] = useState<"sender" | "receiver" | null>(
    null,
  );
  const [selectedPayoutCurrencyCode, setSelectedPayoutCurrencyCode] =
    useState<string>("");
  const [selectedPayoutCurrencyRate, setSelectedPayoutCurrencyRate] =
    useState<number>(1);

  // New fields added
  const [currentExchangeRate, setCurrentExchangeRate] = useState("");
  const [requestedExchangeRate, setRequestedExchangeRate] = useState("");

  const token = cookie?.token;
  const currencyCode = cookie?.currencyCode;
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Reset form fields when beneficiary changes
  useEffect(() => {
    if (selectedBeneficiary) {
      setAmount("");
      setReceiverAmount("");
      setFeeResponsibility("");
      setDiscountCode("");
      setNotes("");
      setTransectionSummeryData(null);
      // Payout selection is already reset in the fetchPayoutDetails useEffect
    }
  }, [selectedBeneficiary]);

  //beneficiaries payout details
  useEffect(() => {
    if (!selectedBeneficiary) {
      setPayoutDetails(null);
      setPayoutError(null);
      setSelectedPayoutDetailId(null);
      setSelectedPayoutCurrencyCode("");
      setSelectedPayoutCurrencyRate(1);
      return;
    }
    const fetchPayoutDetails = async () => {
      setLoadingPayout(true);
      setPayoutError(null);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/beneficiaries/${selectedBeneficiary}/payout-details`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res?.data?.status === true) {
          setPayoutDetails(res?.data?.data);
        } else {
          setPayoutError(res.data?.message || "Failed to load payout details");
        }
      } catch (err: any) {
        setPayoutError(err?.response?.data?.message || err.message);
      } finally {
        setLoadingPayout(false);
      }
    };

    fetchPayoutDetails();
  }, [selectedBeneficiary, token]);

  const selectedBeneficiaryData = beneficiariesList?.find(
    (b: any) => String(b.id) === selectedBeneficiary,
  );

  const getSelectedSourceDetails = () => {
    return transactionSources.find((s) => s.id === selectedSource);
  };

  const getSelectedPurposeDetails = () => {
    return transactionPurposeList?.find((p) => p?.code === transactionPurpose);
  };

  const calculateTotalAmount = () => {
    if (!amount || !currency) return null;

    const amountNum = parseFloat(amount);
    const exchangeRate = parseFloat(
      currencyListData?.data?.find(
        (currencyList: any) => currencyList?.id == currency,
      )?.rate || "1",
    );
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

  const submitTransaction = async () => {
    const payload = {
      purposeCode: transactionPurpose,
      sourceAccountId: selectedSource,
      beneficiaryId: selectedBeneficiary,
      amount: Number(receiverAmount),
      feeResponsibility,
      currencyId: currency,
      notes,
      discountCode: discountCode.trim() || "",
      beneficiaryPayoutDetailId: selectedPayoutDetailId,
      // currentExchangeRate: currentExchangeRate
      //   ? Number(currentExchangeRate)
      //   : null,
      // requestedExchangeRate: requestedExchangeRate
      //   ? Number(requestedExchangeRate)
      //   : null,
    };

    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

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
      setReceiverAmount("");
      setCurrency("");
      setUploadedDocuments([]);
      setNotes("");
      setDiscountCode("");
      setFeeResponsibility("");
      setCurrentExchangeRate("");
      setRequestedExchangeRate("");
      setSelectedPayoutDetailId(null);
      setSelectedPayoutCurrencyCode("");
      setSelectedPayoutCurrencyRate(1);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.response?.data?.message || "Transaction failed",
      });
    }
  };

  const fetchFeeRulesForTransaction = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/fees/${selectedBeneficiary}/get-fee-rules-for-transaction`,
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
        description: err?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleTransationSummary = async () => {
    setLoading(true);
    const payload = {
      purposeCode: transactionPurpose,
      sourceAccountId: selectedSource,
      beneficiaryId: selectedBeneficiary,
      amount: Number(receiverAmount),
      feeResponsibility,
      currencyId: currency,
      notes,
      discountCode: discountCode.trim() || "",
      beneficiaryPayoutDetailId: selectedPayoutDetailId,
      // currentExchangeRate: currentExchangeRate
      //   ? Number(currentExchangeRate)
      //   : null,
      // requestedExchangeRate: requestedExchangeRate
      //   ? Number(requestedExchangeRate)
      //   : null,
    };

    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

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
    } finally {
      setLoading(false);
    }
  };

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
    getCurrency();
    getFeeManagement();
  }, []);

  useEffect(() => {
    if (!open) return;
    getTransactionPurpose();
  }, [open]);

  const getCurrencyName = () => {
    const currencyName = currencyListData?.data
      ?.find((currencyList: any) => currencyList?.id == currency)
      ?.name.toUpperCase();
    return currencyName;
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadedDocuments((prev: any) => [...prev, file]);

    e.target.value = "";
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const getSelectedBeneficiriesData = beneficiariesList?.find(
    (beneficiaries: any) => beneficiaries?.id == selectedBeneficiary,
  );

  const singleTransationFeeManagementData = feeManagementData?.filter(
    (fee: any) => fee?.transactionType == "SINGLE",
  );

  const beneficiaryCurrencyCode =
    getSelectedBeneficiriesData?.payoutDetails?.[0]?.currencyCode || "AED";

  const beneficiariyCurrency = currencyListData?.data?.find(
    (currency: any) =>
      currency?.name?.toLowerCase() === beneficiaryCurrencyCode?.toLowerCase(),
  );

  const getCustomRateDeal = async () => {
    setLoadingRateDeal(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/transactions/applicable-deal?beneficiaryPayoutDetailId=${selectedPayoutDetailId}&amount=${receiverAmount}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRateDealData(res?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Transaction failed",
      });
    } finally {
      setLoadingRateDeal(false);
    }
  };

  useEffect(() => {
    getCustomRateDeal();
  }, [receiverAmount]);
  useEffect(() => {
    setCurrency(beneficiariyCurrency?.id);
  }, [beneficiariyCurrency]);

  // useEffect(() => {
  //   if (!selectedBeneficiary) return;
  //   fetchFeeRulesForTransaction();
  // }, [selectedBeneficiary]);

  useEffect(() => {
    const fee = singleTransationFeeManagementData?.filter(
      (fee: any) => fee?.countryId === getSelectedBeneficiriesData?.countryId,
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
    (fee: any) => fee?.countryId === getSelectedBeneficiriesData?.countryId,
  );
  const range = fee?.find(
    (fee: any) =>
      Number(amount) >= fee?.minAmount && Number(amount) <= fee?.maxAmount,
  );
  const isFormValid = amount && receiverAmount && feeResponsibility;
  useEffect(() => {
    if (!amount && !receiverAmount) return;

    const sender = Number(amount);
    const receiver = Number(receiverAmount);

    // ✅ Sender → Receiver
    if (activeField === "sender") {
      if (!sender) {
        setReceiverAmount("");
        return;
      }

      if (rateDealData?.appliedRate) {
        const result = sender * rateDealData.appliedRate;
        setReceiverAmount(result.toFixed(2));
      } else {
        const result = sender / selectedPayoutCurrencyRate;
        setReceiverAmount(result.toFixed(2));
      }
    }

    // ✅ Receiver → Sender
    if (activeField === "receiver") {
      if (!receiver) {
        setAmount("");
        return;
      }

      if (rateDealData?.appliedRate) {
        const result = receiver / rateDealData.appliedRate;
        setAmount(result.toFixed(2));
      } else {
        const result = receiver * selectedPayoutCurrencyRate;
        setAmount(result.toFixed(2));
      }
    }
  }, [
    amount,
    receiverAmount,
    rateDealData?.appliedRate,
    selectedPayoutCurrencyRate,
    activeField,
  ]);
  console.log("xyxy", transectionSummeryData);
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setTransectionSummeryData(null);
            setSelectedBeneficiary("");
            setSelectedSource("");
            setTransactionPurpose("");
            setAmount("");
            setReceiverAmount("");
            setCurrency("");
            setUploadedDocuments([]);
            setNotes("");
            setSelectedPayoutDetailId(null);
            setSelectedPayoutCurrencyCode("");
            setSelectedPayoutCurrencyRate(1);
            setCurrentExchangeRate("");
            setRequestedExchangeRate("");
            setFeeRule({});
            setRateDealData({});
          }
        }}
      >
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="business">
              <Plus className="h-4 w-4 mr-2" />
              Single Payment
            </Button>
          )}
        </DialogTrigger>
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
                  <Label htmlFor="purpose">
                    Purpose of Transaction{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={transactionPurpose}
                    onValueChange={setTransactionPurpose}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {transactionPurposeList?.map((purpose) => (
                        <SelectItem key={purpose?.id} value={purpose?.code}>
                          <div className="flex items-center justify-between w-full">
                            <span>{purpose?.name}</span>
                            {purpose?.documentRequired && (
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

                {getSelectedPurposeDetails()?.documentRequired && (
                  <div className="bg-accent-muted/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          Supporting Documents Required
                        </p>
                        <p className="text-muted-foreground">
                          Please upload relevant documents for{" "}
                          {getSelectedPurposeDetails()?.name?.toLowerCase()}{" "}
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
                  Mode of Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="source">
                    Select Source Account{" "}
                    <span className="text-red-500">*</span>
                  </Label>
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
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label htmlFor="beneficiary">
                    Select Beneficiary <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedBeneficiary}
                    onValueChange={setSelectedBeneficiary}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose beneficiary" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {beneficiariesList?.map((beneficiary: any) => (
                        <SelectItem
                          key={beneficiary.id}
                          value={String(beneficiary.id)}
                        >
                          <div className="flex items-center space-x-2">
                            {beneficiary.type === "BUSINESS" ? (
                              <Building className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {beneficiary.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {beneficiary.bankName ||
                                  beneficiary.countryName}{" "}
                                • {beneficiary.countryName}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* {loading ? (
                  <div>Fee Data Loading...</div>
                ) : feeRule?.id ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Fee Rule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-2xl shadow-sm bg-white">
                          <h2 className="text-lg font-semibold mb-3">
                            {feeRule?.businessFee?.businessFeeResponsibility?.charAt(
                              0,
                            )}
                            {feeRule?.businessFee?.businessFeeResponsibility
                              ?.slice(1)
                              ?.toLowerCase()}
                          </h2>
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
                        <div className="p-4 border rounded-2xl shadow-sm bg-white">
                          <h2 className="text-lg font-semibold mb-3">
                            {feeRule?.beneficiaryFee?.beneficiaryFeeResponsibility?.charAt(
                              0,
                            )}
                            {feeRule?.beneficiaryFee?.beneficiaryFeeResponsibility
                              ?.slice(1)
                              ?.toLowerCase()}
                          </h2>{" "}
                          <div className="space-y-1 text-sm text-gray-700">
                            <p>
                              <span className="font-medium">Fee Type:</span>{" "}
                              {feeRule?.beneficiaryFee?.beneficiaryFeeType ||
                                "-"}
                            </p>
                            <p>
                              <span className="font-medium">Fee Value:</span>{" "}
                              {feeRule?.beneficiaryFee?.beneficiaryFeeValue ||
                                "-"}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 border rounded-2xl shadow-sm bg-white">
                          <h2 className="text-lg font-semibold mb-3">
                            {feeRule?.shareFee?.sharedFeeResponsibility?.charAt(
                              0,
                            )}
                            {feeRule?.shareFee?.sharedFeeResponsibility
                              ?.slice(1)
                              ?.toLowerCase()}
                          </h2>
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
                                {" "}
                                Beneficiary Fee Type:
                              </span>{" "}
                              {feeRule?.shareFee?.sharedBeneficiaryFeeType ||
                                "-"}{" "}
                            </p>
                            <p>
                              <span className="font-medium">
                                Beneficiary Fee Value:
                              </span>{" "}
                              {feeRule?.shareFee?.sharedBeneficiaryFeeValue ||
                                "-"}
                            </p>
                          </div>
                        </div>
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>
                ) : null} */}

                {selectedBeneficiaryData && (
                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-3">
                      {loadingPayout && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          Loading payout details...
                        </div>
                      )}
                      {payoutError && (
                        <div className="mt-3 text-sm text-destructive">
                          Error: {payoutError}
                        </div>
                      )}
                      {payoutDetails && payoutDetails.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-semibold mb-2">
                            Select Payout Method
                          </h4>
                          <div className="space-y-2">
                            {payoutDetails.map((method: any, idx: number) => (
                              <label
                                key={idx}
                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="payoutMethod"
                                  value={method.payoutDetailId}
                                  checked={
                                    selectedPayoutDetailId ===
                                    method.payoutDetailId
                                  }
                                  onChange={() => {
                                    setSelectedPayoutDetailId(
                                      method.payoutDetailId,
                                    );
                                    setSelectedPayoutCurrencyCode(
                                      method.currencyCode,
                                    );
                                    const currencyRate =
                                      currencyListData?.data?.find(
                                        (c: any) =>
                                          c.name?.toLowerCase() ===
                                          method.currencyCode.toLowerCase(),
                                      )?.rate || 1;
                                    setSelectedPayoutCurrencyRate(currencyRate);
                                    const currencyObj =
                                      currencyListData?.data?.find(
                                        (c: any) =>
                                          c.name?.toLowerCase() ===
                                          method.currencyCode.toLowerCase(),
                                      );
                                    if (currencyObj?.id)
                                      setCurrency(String(currencyObj.id));
                                    setAmount("");
                                    setReceiverAmount("");
                                    setTransectionSummeryData(null);
                                  }}
                                  className="h-4 w-4"
                                />
                                <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                                  <span className="font-medium">
                                    {method.payoutMechanismType}
                                  </span>
                                  <span>{method.currencyCode}</span>
                                  <span className="text-muted-foreground">
                                    {method.providerName || "Not specified"}
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Transaction Amount Section - New fields added here */}
            {selectedBeneficiary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Transaction Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-center font-bold mb-4 text-xl">
                          Sender
                        </h5>
                        <Label htmlFor="amount">
                          Amount({currencyCode}){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const value = e.target.value;
                            setActiveField("sender");
                            setAmount(value);
                            setTransectionSummeryData(null);
                          }}
                          // onChange={(e) => {
                          //   const value = e.target.value;
                          //   setAmount(value);
                          //   setTransectionSummeryData(null);
                          //   // if (rateDealData?.appliedRate) {
                          //   //   const result =
                          //   //     Number(value) * rateDealData?.appliedRate;
                          //   //   setReceiverAmount(String(result?.toFixed(2)));
                          //   // } else {
                          //   //   const result =
                          //   //     Number(value) / selectedPayoutCurrencyRate;
                          //   //   setReceiverAmount(String(result.toFixed(2)));
                          //   // }
                          // }}
                          placeholder="0.00"
                          step="0.01"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                      <div>
                        <h5 className="text-center font-bold mb-4 text-xl">
                          Receiver
                        </h5>
                        <Label htmlFor="receiverAmount">
                          Amount ({selectedPayoutCurrencyCode}){" "}
                          {rateDealData?.appliedRate && "Applied Rate "}
                        </Label>
                        <Input
                          id="receiverAmount"
                          type="number"
                          value={receiverAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            setActiveField("receiver");
                            ``;
                            setReceiverAmount(value);
                            setTransectionSummeryData(null);
                          }}
                          // onChange={(e) => {
                          //   const value = e.target.value;
                          //   setReceiverAmount(value);
                          //   setTransectionSummeryData(null);

                          //   if (!value) return;

                          //   if (rateDealData?.appliedRate) {
                          //     setAmount(
                          //       String(
                          //         Number(value) / rateDealData.appliedRate,
                          //       ),
                          //     );
                          //   } else {
                          //     setAmount(
                          //       String(
                          //         Number(value) * selectedPayoutCurrencyRate,
                          //       ),
                          //     );
                          //   }
                          // }}
                          placeholder="0.00"
                          step="0.01"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                    </div>

                    {/* Newly Added Fields */}
                    {/* <div>
                      <Label htmlFor="currentExchangeRate">
                        Current Exchange Rate
                      </Label>
                      <Input
                        id="currentExchangeRate"
                        type="number"
                        value={currentExchangeRate}
                        onChange={(e) => setCurrentExchangeRate(e.target.value)}
                        placeholder="123"
                        step="0.0001"
                      />
                    </div> */}

                    {/* <div>
                      <Label htmlFor="requestedExchangeRate">
                        Requested Exchange Rate
                      </Label>
                      <Input
                        id="requestedExchangeRate"
                        type="number"
                        value={requestedExchangeRate}
                        onChange={(e) =>
                          setRequestedExchangeRate(e.target.value)
                        }
                        placeholder="125"
                        step="0.0001"
                      />
                    </div> */}
                    <div>
                      <Label htmlFor="source">
                        Select Fee Responsibility{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={feeResponsibility}
                        onValueChange={(value) => {
                          setFeeResponsibility(value);
                          setTransectionSummeryData(null);
                        }}
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
                    {feeResponsibility !== "BENEFICIARY" && (
                      <div>
                        <Label htmlFor="discountCode">Discount Code</Label>
                        <Input
                          id="discountCode"
                          value={discountCode}
                          onChange={(e) =>
                            setDiscountCode(e.target.value.trim())
                          }
                          placeholder="e.g. S43U3ZSC"
                          maxLength={12}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleTransationSummary}
                    disabled={!isFormValid}
                    variant="outline"
                  >
                    Transaction Summary
                  </Button>
                  {loading ? (
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-accent animate-pulse" />
                      <span className="font-medium text-foreground">
                        Loading Transaction Summary...
                      </span>
                    </div>
                  ) : (
                    transectionSummeryData &&
                    amount && (
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
                                {currencyCode}{" "}
                                {transectionSummeryData?.baseAedAmount?.toFixed(
                                  2,
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Exchange Rate
                              </span>
                              <p className="font-medium">
                                1 {currencyCode} ={" "}
                                {transectionSummeryData?.exchangeRate?.toFixed(
                                  2,
                                )}{" "}
                                {selectedPayoutCurrencyCode}
                              </p>
                            </div>
                            {["BUSINESS", "SHARED"].includes(
                              transectionSummeryData?.feeResponsibility,
                            ) && (
                              <div>
                                <span className="text-muted-foreground">
                                  businessFee
                                </span>
                                <p className="font-medium">
                                  {transectionSummeryData?.businessFee?.toLocaleString()}{" "}
                                  {currencyCode}
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
                                  {currencyCode}
                                </p>
                              </div>
                            )}
                            {["BUSINESS", "SHARED"].includes(
                              transectionSummeryData?.feeResponsibility,
                            ) && (
                              <div>
                                <span className="text-muted-foreground">
                                  Discount Amount
                                </span>
                                <p className="font-medium">
                                  {transectionSummeryData?.discountAmountAed}{" "}
                                  {currencyCode}
                                </p>
                              </div>
                            )}

                            {transectionSummeryData?.vatAmount > 0 &&
                              ["BUSINESS", "SHARED"].includes(
                                transectionSummeryData?.feeResponsibility,
                              ) && (
                                <div>
                                  <span>Vat Amount</span>
                                  <p className="font-medium">
                                    {transectionSummeryData?.vatAmount}
                                    {currencyCode}
                                  </p>
                                </div>
                              )}
                            {transectionSummeryData?.vatAmount > 0 &&
                              ["BUSINESS", "SHARED"].includes(
                                transectionSummeryData?.feeResponsibility,
                              ) && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Final Processing Fee
                                  </span>
                                  <p className="font-medium">
                                    {transectionSummeryData?.finalProcessingFee?.toFixed(
                                      2,
                                    )}{" "}
                                    {currencyCode}
                                  </p>
                                </div>
                              )}

                            {transectionSummeryData?.feeResponsibility ==
                              "BUSINESS" && (
                              <div>
                                <span className="text-muted-foreground">
                                  Total Payout
                                </span>
                                <p className="font-medium">
                                  {transectionSummeryData?.netPayout?.toFixed(
                                    2,
                                  )}{" "}
                                  {transectionSummeryData?.currency}
                                </p>
                              </div>
                            )}

                            {transectionSummeryData?.feeResponsibility ==
                              "BUSINESS" && (
                              <div>
                                <span className="text-muted-foreground">
                                  Total Payable
                                </span>
                                <p className="font-medium">
                                  {transectionSummeryData?.totalDebit?.toFixed(
                                    2,
                                  )}{" "}
                                  {currencyCode}
                                </p>
                              </div>
                            )}

                            <div>
                              <span className="text-muted-foreground">
                                Monthly Limit
                              </span>
                              <p className="font-medium">
                                {transectionSummeryData?.monthlyLimit?.toFixed(
                                  2,
                                )}{" "}
                                {currencyCode}
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
                                {currencyCode}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Remaining Limit
                              </span>
                              <p className="font-medium">
                                {transectionSummeryData?.remainingLimit?.toFixed(
                                  2,
                                )}{" "}
                                {currencyCode}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </CardContent>
              </Card>
            )}
            {loadingRateDeal ? (
              <div className="text-gray-400 p-4">Loading...</div>
            ) : rateDealData?.proposedRate && receiverAmount ? (
              <Card className="bg-accent-muted/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground">
                      Applied Rate Deal
                    </span>
                  </div>
                  <div className="flex gap-7 text-base font-normal text-gray-600">
                    <div className="flex gap-1">
                      <p>
                        Applied Rate: {rateDealData.appliedRate}{" "}
                        {rateDealData?.payoutCurrency}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <p>
                        Remaining Amount: {rateDealData.remainingAmount}{" "}
                        {rateDealData?.payoutCurrency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-gray-400 p-4">
                {receiverAmount && <p> No rate deal data available</p>}
              </div>
            )}
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
                        selectedBeneficiaryFee?.feeType
                          ?.slice(1)
                          ?.toLowerCase()}
                    </div>
                    <div>Fee Amount: {selectedBeneficiaryFee?.feeValue}</div>
                    <div>
                      Status:{" "}
                      {selectedBeneficiaryFee?.status?.charAt(0).toUpperCase() +
                        selectedBeneficiaryFee?.status
                          ?.slice(1)
                          ?.toLowerCase()}{" "}
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

            {/* {selectedBeneficiary && amount && (
              <FeeCalculator
                amount={parseFloat(amount)}
                currency={currency}
                country={selectedBeneficiaryData?.countryName || ""}
                transactionType="Single Transaction"
              />
            )} */}

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

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setTransectionSummeryData(null);
                  setSelectedBeneficiary("");
                  setSelectedSource("");
                  setTransactionPurpose("");
                  setAmount("");
                  setReceiverAmount("");
                  setCurrency("");
                  setUploadedDocuments([]);
                  setNotes("");
                  setCurrentExchangeRate("");
                  setRequestedExchangeRate("");
                  setOpen(false);
                }}
              >
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
                    !transactionPurpose ||
                    !selectedPayoutDetailId ||
                    !feeResponsibility
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
        description={`Are you sure you want to submit this transaction ? This will route the transaction through the approval workflow.`}
        confirmText="Submit Transaction"
      />
    </>
  );
};

export default SingleTransactionForm;
