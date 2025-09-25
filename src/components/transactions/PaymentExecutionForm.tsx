import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Upload, 
  AlertCircle,
  Info,
  CheckCircle,
  Smartphone,
  FileText,
  Trash2,
  Building2,
  QrCode,
  DollarSign,
  Camera
} from "lucide-react";

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
}

const PaymentExecutionForm = ({ transaction, trigger }: PaymentExecutionFormProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [uploadedProofs, setUploadedProofs] = useState<string[]>([]);
  const [ziinaConfirmation, setZiinaConfirmation] = useState("");
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct transfer to Exchange House's designated account",
      icon: Building2,
      requiresProof: true,
      autoConfirmed: false
    },
    {
      id: "ziina",
      name: "Ziina",
      description: "UAE-based payment gateway with QR and link-based payments",
      icon: QrCode,
      requiresProof: true,
      autoConfirmed: false
    },
    {
      id: "card_payment",
      name: "Card Payment",
      description: "Debit/Credit card via secure portal integration",
      icon: CreditCard,
      requiresProof: false,
      autoConfirmed: true
    },
    {
      id: "manual_payment",
      name: "Manual Payment",
      description: "Cheque deposit, cash handover, or other offline methods",
      icon: FileText,
      requiresProof: true,
      autoConfirmed: false
    }
  ];

  const getSelectedPaymentMethod = () => {
    return paymentMethods.find(m => m.id === selectedPaymentMethod);
  };

  const handleProofUpload = (fileName: string) => {
    setUploadedProofs([...uploadedProofs, fileName]);
  };

  const removeProof = (index: number) => {
    setUploadedProofs(uploadedProofs.filter((_, i) => i !== index));
  };

  const handleSubmitPayment = () => {
    const method = getSelectedPaymentMethod();
    if (!method) return;

    if (method.requiresProof && uploadedProofs.length === 0) {
      toast({
        title: "Proof Required",
        description: "Please upload proof of payment for this method.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment Submitted",
      description: `Payment execution initiated via ${method.name}. Transaction status updated to "Payment Verification".`
    });
  };

  return (
    <Dialog>
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
            Transaction {transaction.id} has been approved and requires payment execution
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
                  <span className="text-muted-foreground">Beneficiary:</span>
                  <p className="font-medium">{transaction.beneficiary}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purpose:</span>
                  <p className="font-medium">{transaction.purpose}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">{transaction.currency} {transaction.amount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Debit:</span>
                  <p className="font-medium text-primary">{transaction.localCurrency} {transaction.localAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <Card 
                      key={method.id}
                      className={`cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id 
                          ? 'ring-2 ring-primary border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-5 w-5 text-primary mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-foreground">{method.name}</h3>
                              <div className="flex gap-1">
                                {method.autoConfirmed && (
                                  <Badge variant="default" className="text-xs">Auto-confirmed</Badge>
                                )}
                                {method.requiresProof && (
                                  <Badge variant="outline" className="text-xs">Proof Required</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          {selectedPaymentMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPaymentMethod === "bank_transfer" && (
                  <div className="space-y-4">
                    <div className="bg-accent-muted/20 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-accent mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">Exchange House Bank Details</p>
                          <p className="text-muted-foreground">Emirates NBD - Account: AE070331000000000000001</p>
                          <p className="text-muted-foreground">SWIFT: EBILAEAD - Reference: {transaction.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank_name">Your Bank Name *</Label>
                        <Input
                          id="bank_name"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g., Emirates NBD"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account_number">Your Account Number *</Label>
                        <Input
                          id="account_number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Account used for transfer"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="transfer_reference">Transfer Reference *</Label>
                      <Input
                        id="transfer_reference"
                        value={transferReference}
                        onChange={(e) => setTransferReference(e.target.value)}
                        placeholder="Reference number from your bank"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "ziina" && (
                  <div className="space-y-4">
                    <div className="bg-accent-muted/20 rounded-lg p-4 text-center">
                      <QrCode className="h-16 w-16 text-primary mx-auto mb-3" />
                      <p className="font-medium text-foreground">Scan QR Code or Use Payment Link</p>
                      <p className="text-sm text-muted-foreground">Amount: {transaction.localCurrency} {transaction.localAmount}</p>
                      <Button variant="outline" className="mt-3">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Open Ziina Link
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="ziina_confirmation">Ziina Confirmation ID *</Label>
                      <Input
                        id="ziina_confirmation"
                        value={ziinaConfirmation}
                        onChange={(e) => setZiinaConfirmation(e.target.value)}
                        placeholder="Enter confirmation ID from Ziina"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "card_payment" && (
                  <div className="space-y-4">
                    <div className="bg-success/10 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">Secure Card Payment</p>
                          <p className="text-muted-foreground">Payment will be processed immediately and auto-confirmed</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="card_number">Card Number *</Label>
                        <Input
                          id="card_number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card_expiry">Expiry Date *</Label>
                        <Input
                          id="card_expiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card_cvc">CVC *</Label>
                        <Input
                          id="card_cvc"
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "manual_payment" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment_description">Payment Method Description *</Label>
                      <Textarea
                        id="payment_description"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        placeholder="Describe your payment method (e.g., Cheque deposit at Emirates NBD branch, Cash handover at office)"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Proof of Payment Upload */}
          {selectedPaymentMethod && getSelectedPaymentMethod()?.requiresProof && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Proof of Payment Upload
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                    <CardContent 
                      className="p-6 text-center"
                      onClick={() => handleProofUpload(`payment_proof_${Date.now()}.jpg`)}
                    >
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload Proof</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, PDF (Max 10MB)</p>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Uploaded Proofs</h4>
                    {uploadedProofs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No proofs uploaded</p>
                    ) : (
                      <div className="space-y-2">
                        {uploadedProofs.map((proof, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{proof}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeProof(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-accent-muted/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Accepted Proof Documents</p>
                      <ul className="text-muted-foreground mt-1 space-y-1">
                        <li>• Bank transfer receipt/confirmation</li>
                        <li>• Screenshot of Ziina payment confirmation</li>
                        <li>• Cheque image or stamped deposit slip</li>
                        <li>• Cash receipt or acknowledgment letter</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline">
              Cancel
            </Button>
            <Button 
              variant="business" 
              onClick={handleSubmitPayment}
              disabled={!selectedPaymentMethod}
            >
              {getSelectedPaymentMethod()?.autoConfirmed ? "Process Payment" : "Submit for Verification"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentExecutionForm;