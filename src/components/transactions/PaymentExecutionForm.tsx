//import { useRef, useState } from "react";
//import {
//  Dialog,
//  DialogContent,
//  DialogHeader,
//  DialogTitle,
//  DialogTrigger,
//} from "@/components/ui/dialog";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Badge } from "@/components/ui/badge";
//import { Separator } from "@/components/ui/separator";
//import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
//import { useToast } from "@/hooks/use-toast";
//import {
//  CreditCard,
//  Upload,
//  AlertCircle,
//  Info,
//  CheckCircle,
//  Smartphone,
//  FileText,
//  Trash2,
//  Building2,
//  QrCode,
//  DollarSign,
//  Camera,
//} from "lucide-react";
//import axios from "axios";
//import BASE_URL from "@/config/config";
//import { useCookies } from "react-cookie";
//interface PaymentExecutionFormProps {
//  transaction: {
//    id: string;
//    beneficiary: string;
//    amount: string;
//    currency: string;
//    localAmount: string;
//    localCurrency: string;
//    purpose: string;
//  };
//  trigger?: React.ReactNode;
//  onSuccess?: () => void;
//}

//const PaymentExecutionForm = ({
//  transaction,
//  trigger,
//  onSuccess,
//}: PaymentExecutionFormProps) => {
//  const { toast } = useToast();
//  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//  const [bankName, setBankName] = useState("");
//  const [accountNumber, setAccountNumber] = useState("");
//  const [transferReference, setTransferReference] = useState("");
//  const [cardNumber, setCardNumber] = useState("");
//  const [cardExpiry, setCardExpiry] = useState("");
//  const [cardCVC, setCardCVC] = useState("");
//  const [paymentDescription, setPaymentDescription] = useState("");
//  const [uploadedProofs, setUploadedProofs] = useState<string[]>([]);
//  const [ziinaConfirmation, setZiinaConfirmation] = useState("");
//  const [showConfirmation, setShowConfirmation] = useState(false);
//  const [open, setOpen] = useState(false);
//  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
//  const [isSubmitting, setIsSubmitting] = useState(false);
//  const fileInputRef = useRef<HTMLInputElement>(null);
//  const [cookies] = useCookies([
//    "token",
//    "email",
//    "fullName",
//    "firstName",
//    "lastName",
//    "currencyCode",
//  ]);
//  const token = cookies.token;
//  const paymentMethods = [
//    {
//      id: "bank_transfer",
//      name: "Bank Transfer",
//      description: "Direct transfer to Exchange House's designated account",
//      icon: Building2,
//      requiresProof: true,
//      autoConfirmed: false,
//    },
//    {
//      id: "ziina",
//      name: "Ziina",
//      description: "UAE-based payment gateway with QR and link-based payments",
//      icon: QrCode,
//      requiresProof: true,
//      autoConfirmed: false,
//    },
//    {
//      id: "card_payment",
//      name: "Card Payment",
//      description: "Debit/Credit card via secure portal integration",
//      icon: CreditCard,
//      requiresProof: false,
//      autoConfirmed: true,
//    },
//    {
//      id: "manual_payment",
//      name: "Manual Payment",
//      description: "Cheque deposit, cash handover, or other offline methods",
//      icon: FileText,
//      requiresProof: true,
//      autoConfirmed: false,
//    },
//  ];
//  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//    const file = e.target.files?.[0];
//    if (!file) return;
//    if (file.size > 10 * 1024 * 1024) {
//      toast({
//        title: "File too large",
//        description: "Maximum file size is 10MB",
//        variant: "destructive",
//      });
//      return;
//    }
//    setUploadedDocument(file);
//  };

//  const removeDocument = () => {
//    setUploadedDocument(null);
//    if (fileInputRef.current) fileInputRef.current.value = "";
//  };
//  const getSelectedPaymentMethod = () => {
//    return paymentMethods.find((m) => m.id === selectedPaymentMethod);
//  };

//  const handleProofUpload = (fileName: string) => {
//    setUploadedProofs([...uploadedProofs, fileName]);
//  };

//  const removeProof = (index: number) => {
//    setUploadedProofs(uploadedProofs.filter((_, i) => i !== index));
//  };

//  //const confirmSubmitPayment = () => {
//  //  const method = getSelectedPaymentMethod();
//  //  if (!method) return;

//  //  toast({
//  //    title: "Payment Submitted",
//  //    description: `Payment execution initiated via ${method.name}. Transaction status updated to "Payment Verification".`,
//  //  });
//  //  setOpen(false);
//  //};

//  const executePayment = async () => {
//    const method = getSelectedPaymentMethod();
//    if (!method) {
//      toast({
//        title: "Error",
//        description: "Please select a payment method",
//        variant: "destructive",
//      });
//      return;
//    }

//    if (!uploadedDocument) {
//      toast({
//        title: "Document Required",
//        description: "Please upload a supporting document.",
//        variant: "destructive",
//      });
//      return;
//    }

//    setIsSubmitting(true);
//    try {
//      const formData = new FormData();
//      //formData.append("paymentMethod", method.name);
//      //formData.append("transactionId", transaction.id);

//      //// Add payment method specific fields
//      //if (method.id === "bank_transfer") {
//      //  formData.append("bankName", bankName);
//      //  formData.append("accountNumber", accountNumber);
//      //  formData.append("transferReference", transferReference);
//      //} else if (method.id === "ziina") {
//      //  formData.append("confirmationId", ziinaConfirmation);
//      //} else if (method.id === "card_payment") {
//      //  formData.append("cardLast4", cardNumber.slice(-4));
//      //} else if (method.id === "manual_payment") {
//      //  formData.append("description", paymentDescription);
//      //}

//      formData.append("receipt", uploadedDocument);

//      const response = await axios.post(
//        `${BASE_URL}/api/v1/transactions/${transaction.id}/execute-payment`,
//        formData,
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//            "Content-Type": "multipart/form-data",
//          },
//        },
//      );

//      if (response.data?.status === true) {
//        toast({
//          title: "Success",
//          description: "Payment executed successfully.",
//        });
//        setOpen(false);
//        onSuccess?.();
//        // Reset form
//        setSelectedPaymentMethod("");
//        setUploadedDocument(null);
//        setUploadedProofs([]);
//      } else {
//        throw new Error(response.data?.message || "Payment execution failed");
//      }
//    } catch (err: any) {
//      toast({
//        title: "Error",
//        description:
//          err?.response?.data?.message ||
//          err.message ||
//          "Payment execution failed",
//        variant: "destructive",
//      });
//    } finally {
//      setIsSubmitting(false);
//    }
//  };

//  const confirmSubmitPayment = () => {
//    executePayment();
//  };

//  const handleSubmitPayment = () => {
//    const method = getSelectedPaymentMethod();
//    if (!method) {
//      toast({
//        title: "Error",
//        description: "Please select a payment method",
//        variant: "destructive",
//      });
//      return;
//    }

//    if (!uploadedDocument) {
//      toast({
//        title: "Document Required",
//        description: "Please upload a supporting document.",
//        variant: "destructive",
//      });
//      return;
//    }

//    setShowConfirmation(true);
//  };

//  return (
//    <>
//      <Dialog open={open} onOpenChange={setOpen}>
//        <DialogTrigger asChild>
//          {trigger || (
//            <Button variant="business" size="sm">
//              <DollarSign className="h-4 w-4 mr-1" />
//              Execute Payment
//            </Button>
//          )}
//        </DialogTrigger>
//        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//          <DialogHeader>
//            <DialogTitle className="text-xl">Execute Payment</DialogTitle>
//            <p className="text-sm text-muted-foreground">
//              Transaction {transaction.id} has been approved and requires
//              payment execution
//            </p>
//          </DialogHeader>

//          <div className="space-y-6 mt-6">
//            {/* Transaction Summary */}
//            <Card className="bg-accent-muted/10 border-accent/20">
//              <CardHeader>
//                <CardTitle className="text-lg">Transaction Summary</CardTitle>
//              </CardHeader>
//              <CardContent className="space-y-3">
//                <div className="grid grid-cols-2 gap-4 text-sm">
//                  <div>
//                    <span className="text-muted-foreground">Beneficiary:</span>
//                    <p className="font-medium">{transaction.beneficiary}</p>
//                  </div>
//                  <div>
//                    <span className="text-muted-foreground">Purpose:</span>
//                    <p className="font-medium">{transaction.purpose}</p>
//                  </div>
//                  <div>
//                    <span className="text-muted-foreground">Amount:</span>
//                    <p className="font-medium">
//                      {transaction.currency} {transaction.amount}
//                    </p>
//                  </div>
//                  <div>
//                    <span className="text-muted-foreground">Total Debit:</span>
//                    <p className="font-medium text-primary">
//                      {transaction.localCurrency} {transaction.localAmount}
//                    </p>
//                  </div>
//                </div>
//              </CardContent>
//            </Card>

//            {/* Payment Method Selection */}
//            {/*<Card>
//              <CardHeader>
//                <CardTitle className="text-lg flex items-center gap-2">
//                  <CreditCard className="h-5 w-5" />
//                  Payment Method Selection
//                </CardTitle>
//              </CardHeader>
//              <CardContent className="space-y-4">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {paymentMethods.map((method) => {
//                    const IconComponent = method.icon;
//                    return (
//                      <Card
//                        key={method.id}
//                        className={`cursor-pointer transition-all ${
//                          selectedPaymentMethod === method.id
//                            ? "ring-2 ring-primary border-primary bg-primary/5"
//                            : "hover:border-primary/50"
//                        }`}
//                        onClick={() => setSelectedPaymentMethod(method.id)}
//                      >
//                        <CardContent className="p-4">
//                          <div className="flex items-start space-x-3">
//                            <IconComponent className="h-5 w-5 text-primary mt-1" />
//                            <div className="flex-1">
//                              <div className="flex items-center justify-between">
//                                <h3 className="font-medium text-foreground">
//                                  {method.name}
//                                </h3>
//                                <div className="flex gap-1">
//                                  {method.autoConfirmed && (
//                                    <Badge
//                                      variant="default"
//                                      className="text-xs"
//                                    >
//                                      Auto-confirmed
//                                    </Badge>
//                                  )}
//                                  {method.requiresProof && (
//                                    <Badge
//                                      variant="outline"
//                                      className="text-xs"
//                                    >
//                                      Proof Required
//                                    </Badge>
//                                  )}
//                                </div>
//                              </div>
//                              <p className="text-sm text-muted-foreground mt-1">
//                                {method.description}
//                              </p>
//                            </div>
//                          </div>
//                        </CardContent>
//                      </Card>
//                    );
//                  })}
//                </div>
//              </CardContent>
//            </Card>*/}

//            {/* Payment Details Form */}
//            {/*{selectedPaymentMethod && (
//              <Card>
//                <CardHeader>
//                  <CardTitle className="text-lg">Payment Details</CardTitle>
//                </CardHeader>
//                <CardContent className="space-y-4">
//                  {selectedPaymentMethod === "bank_transfer" && (
//                    <div className="space-y-4">
//                      <div className="bg-accent-muted/20 rounded-lg p-3">
//                        <div className="flex items-start space-x-2">
//                          <Info className="h-4 w-4 text-accent mt-0.5" />
//                          <div className="text-sm">
//                            <p className="font-medium text-foreground">
//                              Exchange House Bank Details
//                            </p>
//                            <p className="text-muted-foreground">
//                              Emirates NBD - Account: AE070331000000000000001
//                            </p>
//                            <p className="text-muted-foreground">
//                              SWIFT: EBILAEAD - Reference: {transaction.id}
//                            </p>
//                          </div>
//                        </div>
//                      </div>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                        <div>
//                          <Label htmlFor="bank_name">Your Bank Name *</Label>
//                          <Input
//                            id="bank_name"
//                            value={bankName}
//                            onChange={(e) => setBankName(e.target.value)}
//                            placeholder="e.g., Emirates NBD"
//                          />
//                        </div>
//                        <div>
//                          <Label htmlFor="account_number">
//                            Your Account Number *
//                          </Label>
//                          <Input
//                            id="account_number"
//                            value={accountNumber}
//                            onChange={(e) => setAccountNumber(e.target.value)}
//                            placeholder="Account used for transfer"
//                          />
//                        </div>
//                      </div>
//                      <div>
//                        <Label htmlFor="transfer_reference">
//                          Transfer Reference *
//                        </Label>
//                        <Input
//                          id="transfer_reference"
//                          value={transferReference}
//                          onChange={(e) => setTransferReference(e.target.value)}
//                          placeholder="Reference number from your bank"
//                        />
//                      </div>
//                    </div>
//                  )}

//                  {selectedPaymentMethod === "ziina" && (
//                    <div className="space-y-4">
//                      <div className="bg-accent-muted/20 rounded-lg p-4 text-center">
//                        <QrCode className="h-16 w-16 text-primary mx-auto mb-3" />
//                        <p className="font-medium text-foreground">
//                          Scan QR Code or Use Payment Link
//                        </p>
//                        <p className="text-sm text-muted-foreground">
//                          Amount: {transaction.localCurrency}{" "}
//                          {transaction.localAmount}
//                        </p>
//                        <Button variant="outline" className="mt-3">
//                          <Smartphone className="h-4 w-4 mr-2" />
//                          Open Ziina Link
//                        </Button>
//                      </div>
//                      <div>
//                        <Label htmlFor="ziina_confirmation">
//                          Ziina Confirmation ID *
//                        </Label>
//                        <Input
//                          id="ziina_confirmation"
//                          value={ziinaConfirmation}
//                          onChange={(e) => setZiinaConfirmation(e.target.value)}
//                          placeholder="Enter confirmation ID from Ziina"
//                        />
//                      </div>
//                    </div>
//                  )}

//                  {selectedPaymentMethod === "card_payment" && (
//                    <div className="space-y-4">
//                      <div className="bg-success/10 rounded-lg p-3">
//                        <div className="flex items-start space-x-2">
//                          <CheckCircle className="h-4 w-4 text-success mt-0.5" />
//                          <div className="text-sm">
//                            <p className="font-medium text-foreground">
//                              Secure Card Payment
//                            </p>
//                            <p className="text-muted-foreground">
//                              Payment will be processed immediately and
//                              auto-confirmed
//                            </p>
//                          </div>
//                        </div>
//                      </div>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                        <div className="md:col-span-2">
//                          <Label htmlFor="card_number">Card Number *</Label>
//                          <Input
//                            id="card_number"
//                            value={cardNumber}
//                            onChange={(e) => setCardNumber(e.target.value)}
//                            placeholder="1234 5678 9012 3456"
//                            maxLength={19}
//                          />
//                        </div>
//                        <div>
//                          <Label htmlFor="card_expiry">Expiry Date *</Label>
//                          <Input
//                            id="card_expiry"
//                            value={cardExpiry}
//                            onChange={(e) => setCardExpiry(e.target.value)}
//                            placeholder="MM/YY"
//                            maxLength={5}
//                          />
//                        </div>
//                        <div>
//                          <Label htmlFor="card_cvc">CVC *</Label>
//                          <Input
//                            id="card_cvc"
//                            value={cardCVC}
//                            onChange={(e) => setCardCVC(e.target.value)}
//                            placeholder="123"
//                            maxLength={4}
//                          />
//                        </div>
//                      </div>
//                    </div>
//                  )}

//                  {selectedPaymentMethod === "manual_payment" && (
//                    <div className="space-y-4">
//                      <div>
//                        <Label htmlFor="payment_description">
//                          Payment Method Description *
//                        </Label>
//                        <Textarea
//                          id="payment_description"
//                          value={paymentDescription}
//                          onChange={(e) =>
//                            setPaymentDescription(e.target.value)
//                          }
//                          placeholder="Describe your payment method (e.g., Cheque deposit at Emirates NBD branch, Cash handover at office)"
//                          rows={3}
//                        />
//                      </div>
//                    </div>
//                  )}
//                </CardContent>
//              </Card>
//            )}*/}

//            {/* Document Upload (Required for all methods) */}
//            <Card>
//              <CardHeader>
//                <CardTitle className="text-lg flex items-center gap-2">
//                  <Upload className="h-5 w-5" />
//                  Upload Supporting Document
//                  <Badge variant="destructive" className="text-xs">
//                    Required
//                  </Badge>
//                </CardTitle>
//              </CardHeader>
//              <CardContent className="space-y-4">
//                <input
//                  ref={fileInputRef}
//                  type="file"
//                  accept=".pdf,.jpg,.png,.jpeg"
//                  className="hidden"
//                  onChange={handleDocumentUpload}
//                />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  <Card
//                    className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer"
//                    onClick={() => fileInputRef.current?.click()}
//                  >
//                    <CardContent className="p-6 text-center">
//                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                      <p className="text-sm font-medium">Click to Upload</p>
//                      <p className="text-xs text-muted-foreground">
//                        PDF, JPG, PNG (Max 10MB)
//                      </p>
//                    </CardContent>
//                  </Card>
//                  <div className="space-y-2">
//                    <h4 className="font-medium text-foreground">
//                      Selected File
//                    </h4>
//                    {!uploadedDocument ? (
//                      <p className="text-sm text-muted-foreground">
//                        No file chosen
//                      </p>
//                    ) : (
//                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
//                        <div className="flex items-center space-x-2">
//                          <FileText className="h-4 w-4 text-primary" />
//                          <span className="text-sm">
//                            {uploadedDocument.name}
//                          </span>
//                        </div>
//                        <Button
//                          variant="outline"
//                          size="sm"
//                          onClick={removeDocument}
//                        >
//                          <Trash2 className="h-3 w-3" />
//                        </Button>
//                      </div>
//                    )}
//                  </div>
//                </div>
//                <div className="bg-accent-muted/20 rounded-lg p-3">
//                  <div className="flex items-start space-x-2">
//                    <Info className="h-4 w-4 text-accent mt-0.5" />
//                    <div className="text-sm">
//                      <p className="font-medium text-foreground">
//                        Accepted document types
//                      </p>
//                      <p className="text-muted-foreground">
//                        Payment receipt, bank transfer confirmation, or any
//                        proof of payment.
//                      </p>
//                    </div>
//                  </div>
//                </div>
//              </CardContent>
//            </Card>
//            {/* Action Buttons */}
//            <div className="flex justify-end space-x-3 pt-4 border-t">
//              <Button variant="outline" onClick={() => setOpen(false)}>
//                Cancel
//              </Button>
//              <Button
//                variant="business"
//                onClick={handleSubmitPayment}
//                //disabled={!selectedPaymentMethod}
//              >
//                {getSelectedPaymentMethod()?.autoConfirmed
//                  ? "Process Payment"
//                  : "Submit for Verification"}
//              </Button>
//            </div>
//          </div>
//        </DialogContent>
//      </Dialog>

//      <ConfirmationDialog
//        open={showConfirmation}
//        onOpenChange={setShowConfirmation}
//        onConfirm={confirmSubmitPayment}
//        title="Confirm Payment Execution"
//        description={`Are you sure you want to execute payment of ${transaction.localCurrency} ${transaction.localAmount} via ${getSelectedPaymentMethod()?.name}? This action cannot be undone.`}
//        confirmText="Execute Payment"
//      />
//    </>
//  );
//};

//export default PaymentExecutionForm;

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Info,
  FileText,
  Trash2,
  DollarSign,
  Camera,
} from "lucide-react";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

interface PaymentExecutionFormProps {
  transaction: {
    id: string;
    beneficiary: string;
    amount: string;
    currency: string;
    localAmount: string;
    localCurrency: string;
    purpose: string;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  fetchTransactions?: () => void;
}

const PaymentExecutionForm = ({
  transaction,
  trigger,
  onSuccess,
  fetchTransactions,
}: PaymentExecutionFormProps) => {
  console.log("zzz", transaction);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    setUploadedDocument(file);
  };

  const removeDocument = () => {
    setUploadedDocument(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const executePayment = async () => {
    if (!uploadedDocument) {
      toast({
        title: "Document Required",
        description: "Please upload a receipt.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("receipt", uploadedDocument);

      const response = await axios.post(
        `${BASE_URL}/api/v1/transactions/${transaction.id}/execute-payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.status === true) {
        toast({
          title: "Success",
          description:
            response?.data?.message || "Payment executed successfully.",
        });
        setOpen(false);
        fetchTransactions();
        onSuccess?.();
        // Reset
        setUploadedDocument(null);
      } else {
        throw new Error(response.data?.message || "Payment execution failed");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err.message ||
          "Payment execution failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!uploadedDocument) {
      toast({
        title: "Document Required",
        description: "Please upload a receipt.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="business" size="sm">
              <DollarSign className="h-4 w-4 mr-1" />
              Execute Payment
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Execute Payment</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Transaction {transaction.id} requires payment execution
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Transaction Summary */}
            <Card className="bg-accent-muted/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Beneficiary Name:
                    </span>
                    <p className="font-medium">{transaction.beneficiary}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Purpose:</span>
                    <p className="font-medium">{transaction.purpose}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">
                      {transaction.currency} {transaction.amount}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Debit:</span>
                    <p className="font-medium text-primary">
                      {transaction.localCurrency} {transaction.localAmount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Payment Receipt
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.png,.jpeg"
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CardContent className="p-6 text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to Upload</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG (Max 10MB)
                      </p>
                    </CardContent>
                  </Card>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Selected File
                    </h4>
                    {!uploadedDocument ? (
                      <p className="text-sm text-muted-foreground">
                        No file chosen
                      </p>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {uploadedDocument.name}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={removeDocument}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-accent-muted/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        Accepted document types
                      </p>
                      <p className="text-muted-foreground">
                        Payment receipt, bank transfer confirmation, or any
                        proof of payment.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={handleSubmit}
                disabled={!uploadedDocument || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Receipt"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={executePayment}
        title="Confirm Payment Execution"
        description={`Are you sure you want to execute payment for transaction ${transaction.id}? This will upload the receipt and update the transaction status.`}
        confirmText="Execute Payment"
      />
    </>
  );
};

export default PaymentExecutionForm;
