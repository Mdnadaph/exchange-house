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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import BulkTransactionFeeDisplay from "./BulkTransactionFeeDisplay";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  DollarSign, 
  FileText, 
  Upload, 
  Users, 
  Building,
  AlertCircle,
  Info,
  CheckCircle,
  CreditCard,
  TrendingUp,
  Calendar,
  Trash2,
  Download,
  Eye,
  Edit
} from "lucide-react";

interface BulkTransactionFormProps {
  trigger?: React.ReactNode;
}

const BulkTransactionForm = ({ trigger }: BulkTransactionFormProps) => {
  const { toast } = useToast();
  const [selectedSource, setSelectedSource] = useState("");
  const [transactionPurpose, setTransactionPurpose] = useState("");  
  const [currency, setCurrency] = useState("USD");
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [open, setOpen] = useState(false);

  // Mock data
  const transactionSources = [
    {
      id: "SRC-001",
      name: "Emirates NBD Business Account",
      accountNumber: "AE070331234567890123456",
      balance: "245,000",
      currency: "AED",
      type: "current_account"
    },
    {
      id: "SRC-002",
      name: "FAB USD Account", 
      accountNumber: "AE070331987654321098765",
      balance: "85,000",
      currency: "USD",
      type: "foreign_currency"
    }
  ];

  const purposeOptions = [
    { value: "salary_payment", label: "Salary Payment", requiresDoc: true, template: "payroll" },
    { value: "vendor_payment", label: "Vendor Payment", requiresDoc: true, template: "vendor" },
    { value: "supplier_payment", label: "Supplier Payment", requiresDoc: true, template: "supplier" },
    { value: "bonus_payment", label: "Bonus Payment", requiresDoc: true, template: "payroll" },
    { value: "commission_payment", label: "Commission Payment", requiresDoc: false, template: "commission" },
    { value: "refund_payment", label: "Refund Payment", requiresDoc: true, template: "refund" }
  ];

  const exchangeRates = {
    "USD": { rate: "3.673", fees: "15.00" },
    "EUR": { rate: "3.985", fees: "18.00" },
    "GBP": { rate: "4.651", fees: "20.00" },
    "INR": { rate: "0.044", fees: "12.00" }
  };

  // Sample bulk data structure
  const sampleBulkData = [
    {
      beneficiaryName: "John Smith",
      beneficiaryId: "BEN-001",
      accountNumber: "1234567890",
      bankName: "Emirates NBD",
      amount: "2500.00",
      purpose: "Monthly Salary",
      employeeId: "EMP-001"
    },
    {
      beneficiaryName: "Sarah Johnson", 
      beneficiaryId: "BEN-002",
      accountNumber: "9876543210",
      bankName: "ADCB Bank",
      amount: "3200.00",
      purpose: "Monthly Salary",
      employeeId: "EMP-002"
    },
    {
      beneficiaryName: "Ahmed Al-Rashid",
      beneficiaryId: "BEN-003", 
      accountNumber: "5555666677",
      bankName: "FAB Bank",
      amount: "2800.00",
      purpose: "Monthly Salary",
      employeeId: "EMP-003"
    }
  ];

  const getSelectedSourceDetails = () => {
    return transactionSources.find(s => s.id === selectedSource);
  };

  const getSelectedPurposeDetails = () => {
    return purposeOptions.find(p => p.value === transactionPurpose);
  };

  const calculateTotalAmount = () => {
    if (bulkData.length === 0) return null;
    
    const totalAmount = bulkData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const exchangeRate = parseFloat(exchangeRates[currency as keyof typeof exchangeRates]?.rate || "1");
    const baseFees = parseFloat(exchangeRates[currency as keyof typeof exchangeRates]?.fees || "0");
    const bulkFees = baseFees * bulkData.length;
    
    return {
      originalAmount: totalAmount,
      aedAmount: totalAmount * exchangeRate,
      fees: bulkFees,
      total: (totalAmount * exchangeRate) + bulkFees,
      count: bulkData.length
    };
  };

  const handleDocumentUpload = (file: string) => {
    setUploadedDocuments([...uploadedDocuments, file]);
  };

  const handleTemplateUpload = () => {
    // Simulate uploading CSV/Excel file
    setBulkData(sampleBulkData);
    setCurrentStep(2);
  };

  const downloadTemplate = () => {
    // This would trigger template download
    console.log("Downloading template for:", getSelectedPurposeDetails()?.template);
  };

  const totals = calculateTotalAmount();

  const handleSubmit = () => {
    toast({
      title: "Bulk Transaction Submitted",
      description: `Your bulk transaction with ${bulkData.length} recipients has been submitted for processing.`,
    });
    setOpen(false);
    // Reset form
    setSelectedSource("");
    setTransactionPurpose("");
    setCurrency("USD");
    setUploadedDocuments([]);
    setBulkData([]);
    setNotes("");
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {step}
          </div>
          {step < 3 && (
            <div className={`
              w-16 h-0.5 mx-2
              ${currentStep > step ? 'bg-primary' : 'bg-muted'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Transaction Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bulk Transaction Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="purpose">Purpose of Transaction *</Label>
            <Select value={transactionPurpose} onValueChange={setTransactionPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction purpose" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {purposeOptions.map((purpose) => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{purpose.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        Bulk
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {Object.keys(exchangeRates).map((curr) => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Choose source account" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {transactionSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{source.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Balance: {source.currency} {Number(source.balance).toLocaleString()}
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
                    <p className="font-medium font-mono">{getSelectedSourceDetails()?.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available Balance:</span>
                    <p className="font-medium text-success">
                      {getSelectedSourceDetails()?.currency} {Number(getSelectedSourceDetails()?.balance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Bulk Data Upload */}
      {transactionPurpose && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Beneficiary Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-dashed border-primary bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Button 
                    variant="outline" 
                    className="mb-3"
                    onClick={downloadTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <p className="text-sm font-medium">Step 1: Download Template</p>
                  <p className="text-xs text-muted-foreground">
                    Get the {getSelectedPurposeDetails()?.label} template
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                <CardContent 
                  className="p-6 text-center"
                  onClick={handleTemplateUpload}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Step 2: Upload Filled Template</p>
                  <p className="text-xs text-muted-foreground">Excel (.xlsx) or CSV files</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-accent-muted/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Required Information</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• Beneficiary Name and Account Details</li>
                    <li>• Individual Transaction Amounts</li>
                    <li>• Purpose/Description for each payment</li>
                    <li>• Employee ID (for salary payments)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
          {/* Fee Display */}
          {bulkData.length > 0 && (
            <BulkTransactionFeeDisplay
              bulkData={bulkData}
              currency={currency}
            />
          )}

          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Review Bulk Transaction Data
            </CardTitle>
            <Badge variant="secondary">
              {bulkData.length} Recipients
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <div className="grid grid-cols-5 gap-2 p-3 bg-muted font-medium text-sm border-b">
                <div>Beneficiary</div>
                <div>Account Number</div>
                <div>Bank</div>
                <div>Amount</div>
                <div>Actions</div>
              </div>
              {bulkData.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-3 border-b text-sm hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{item.beneficiaryName}</p>
                    {item.employeeId && (
                      <p className="text-xs text-muted-foreground">{item.employeeId}</p>
                    )}
                  </div>
                  <div className="font-mono text-xs">{item.accountNumber}</div>
                  <div>{item.bankName}</div>
                  <div className="font-medium">{currency} {Number(item.amount).toLocaleString()}</div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totals && (
              <Card className="bg-accent-muted/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground">Bulk Transaction Summary</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Recipients:</span>
                      <p className="font-medium">{totals.count}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Amount:</span>
                      <p className="font-medium">{currency} {totals.originalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Exchange Rate:</span>
                      <p className="font-medium">1 {currency} = {exchangeRates[currency as keyof typeof exchangeRates]?.rate} AED</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Processing Fees:</span>
                      <p className="font-medium">AED {totals.fees.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Debit:</span>
                      <p className="font-medium text-lg">AED {totals.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Supporting Documents
            <Badge variant="destructive" className="text-xs">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
              <CardContent 
                className="p-6 text-center"
                onClick={() => handleDocumentUpload("payroll_summary.pdf")}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Upload Documents</p>
                <p className="text-xs text-muted-foreground">
                  {transactionPurpose === "salary_payment" 
                    ? "Payroll reports, HR approvals" 
                    : "Vendor invoices, purchase orders"
                  }
                </p>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Uploaded Documents</h4>
              {uploadedDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {uploadedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Bulk Transaction Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about this bulk transaction..."
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
              <p className="font-medium text-foreground">Bulk Transaction Approval</p>
              <p className="text-muted-foreground">
                {totals && totals.originalAmount > 100000 
                  ? "This bulk transaction requires executive approval (CEO + CFO approval required)."
                  : "This bulk transaction will require senior management approval."
                }
              </p>
              <p className="text-muted-foreground mt-1">
                Expected processing time: 24-48 hours after approval.
              </p>
            </div>
          </div>
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
            <TrendingUp className="h-4 w-4 mr-2" />
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
          {currentStep === 3 && renderStep3()}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                variant="business"
                disabled={currentStep === 1 && (!transactionPurpose || !selectedSource || bulkData.length === 0)}
              >
                Next
              </Button>
            ) : (
              <div className="space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button 
                  variant="business"
                  disabled={uploadedDocuments.length === 0}
                  onClick={() => setShowConfirmation(true)}
                >
                  Submit for Processing
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmationDialog
      open={showConfirmation}
      onOpenChange={setShowConfirmation}
      onConfirm={handleSubmit}
      title="Confirm Bulk Transaction Submission"
      description={`Are you sure you want to submit this bulk transaction with ${bulkData.length} recipients for a total of ${currency} ${totals?.originalAmount.toLocaleString()}? This will route through the executive approval workflow.`}
      confirmText="Submit Transaction"
    />
    </>
  );
};

export default BulkTransactionForm;