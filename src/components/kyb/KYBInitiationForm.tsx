import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  FileText, 
  Building, 
  User, 
  MapPin, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface KYBInitiationFormProps {
  trigger?: React.ReactNode;
  onSubmit?: () => void;
}

const KYBInitiationForm = ({ trigger, onSubmit }: KYBInitiationFormProps) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    tradeLicenseNumber: "",
    establishmentDate: "",
    registrationEmirate: "",
    
    // Contact Information
    authorizedSignatory: "",
    position: "",
    emiratesId: "",
    email: "",
    phone: "",
    address: "",
    
    // Business Profile
    businessActivity: "",
    expectedVolume: "",
    expectedFrequency: "",
    sourceOfFunds: "",
    destinationCountries: [],
    
    // Compliance
    vatRegistered: false,
    vatNumber: "",
    hasCorpBankAccount: false,
    bankAccountDetails: ""
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: boolean}>({
    tradeLicense: false,
    emiratesId: false,
    memorandum: false,
    vatCertificate: false,
    proofOfAddress: false,
    sourceOfFunds: false,
    bankStatement: false
  });

  const requiredDocuments = [
    {
      key: "tradeLicense",
      name: "Trade License Copy",
      description: "Valid UAE Trade License issued by DED/DDA",
      required: true,
      icon: FileText
    },
    {
      key: "emiratesId",
      name: "Emirates ID / Passport of Authorized Signatory",
      description: "Valid identification document of signing authority",
      required: true,
      icon: User
    },
    {
      key: "memorandum",
      name: "Memorandum of Association (MOA)",
      description: "Company incorporation documents",
      required: true,
      icon: Building
    },
    {
      key: "proofOfAddress",
      name: "Proof of Address",
      description: "Recent utility bill or tenancy contract",
      required: true,
      icon: MapPin
    },
    {
      key: "sourceOfFunds",
      name: "Source of Funds Declaration",
      description: "Declaration of business funds origin",
      required: true,
      icon: DollarSign
    },
    {
      key: "bankStatement",
      name: "Corporate Bank Statement",
      description: "Recent bank statement (within 3 months)",
      required: true,
      icon: FileText
    },
    {
      key: "vatCertificate",
      name: "VAT Certificate",
      description: "If VAT registered (annual turnover > AED 375,000)",
      required: false,
      icon: FileText
    }
  ];

  const emirates = [
    "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"
  ];

  const businessTypes = [
    "Trading Company", "Services Company", "Manufacturing", "Construction", 
    "Real Estate", "Technology", "Healthcare", "Education", "Hospitality", "Other"
  ];

  const handleDocumentUpload = (docKey: string) => {
    // Simulate document upload
    setUploadedDocuments(prev => ({ ...prev, [docKey]: true }));
  };

  const getCompletionPercentage = () => {
    const totalRequired = requiredDocuments.filter(doc => doc.required).length;
    const uploadedRequired = requiredDocuments
      .filter(doc => doc.required && uploadedDocuments[doc.key])
      .length;
    return Math.round((uploadedRequired / totalRequired) * 100);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-8">
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
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Enter business name as per trade license"
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tradeLicenseNumber">Trade License Number *</Label>
            <Input
              id="tradeLicenseNumber"
              value={formData.tradeLicenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, tradeLicenseNumber: e.target.value }))}
              placeholder="Enter trade license number"
            />
          </div>
          <div>
            <Label htmlFor="registrationEmirate">Registration Emirate *</Label>
            <Select value={formData.registrationEmirate} onValueChange={(value) => setFormData(prev => ({ ...prev, registrationEmirate: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select emirate" />
              </SelectTrigger>
              <SelectContent>
                {emirates.map((emirate) => (
                  <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="establishmentDate">Establishment Date *</Label>
            <Input
              id="establishmentDate"
              type="date"
              value={formData.establishmentDate}
              onChange={(e) => setFormData(prev => ({ ...prev, establishmentDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Authorized Signatory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="authorizedSignatory">Full Name *</Label>
            <Input
              id="authorizedSignatory"
              value={formData.authorizedSignatory}
              onChange={(e) => setFormData(prev => ({ ...prev, authorizedSignatory: e.target.value }))}
              placeholder="Enter authorized signatory name"
            />
          </div>
          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="e.g., Managing Director, CEO"
            />
          </div>
          <div>
            <Label htmlFor="emiratesId">Emirates ID *</Label>
            <Input
              id="emiratesId"
              value={formData.emiratesId}
              onChange={(e) => setFormData(prev => ({ ...prev, emiratesId: e.target.value }))}
              placeholder="784-YYYY-XXXXXXX-X"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@company.ae"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+971 X XXX XXXX"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="address">Business Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter complete business address"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expectedVolume">Expected Monthly Volume *</Label>
            <Select value={formData.expectedVolume} onValueChange={(value) => setFormData(prev => ({ ...prev, expectedVolume: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select volume range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-10000">AED 0 - 10,000</SelectItem>
                <SelectItem value="10000-50000">AED 10,000 - 50,000</SelectItem>
                <SelectItem value="50000-100000">AED 50,000 - 100,000</SelectItem>
                <SelectItem value="100000-500000">AED 100,000 - 500,000</SelectItem>
                <SelectItem value="500000+">AED 500,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expectedFrequency">Transaction Frequency *</Label>
            <Select value={formData.expectedFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, expectedFrequency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="sourceOfFunds">Source of Funds *</Label>
          <Textarea
            id="sourceOfFunds"
            value={formData.sourceOfFunds}
            onChange={(e) => setFormData(prev => ({ ...prev, sourceOfFunds: e.target.value }))}
            placeholder="Describe the source of funds (e.g., business operations, export proceeds, service fees)"
            rows={3}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">VAT Registration</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vatRegistered"
              checked={formData.vatRegistered}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vatRegistered: checked as boolean }))}
            />
            <Label htmlFor="vatRegistered">Business is VAT registered</Label>
          </div>
          {formData.vatRegistered && (
            <div>
              <Label htmlFor="vatNumber">VAT Registration Number *</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                placeholder="100XXXXXXXXX003"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Banking Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCorpBankAccount"
              checked={formData.hasCorpBankAccount}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasCorpBankAccount: checked as boolean }))}
            />
            <Label htmlFor="hasCorpBankAccount">Has UAE corporate bank account</Label>
          </div>
          {formData.hasCorpBankAccount && (
            <div>
              <Label htmlFor="bankAccountDetails">Bank Account Details *</Label>
              <Textarea
                id="bankAccountDetails"
                value={formData.bankAccountDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, bankAccountDetails: e.target.value }))}
                placeholder="Bank name, account number, IBAN (for source of transaction registration)"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Document Upload</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>

      <Card className="border-accent/20 bg-accent-muted/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">UAE Central Bank Compliance</p>
              <p className="text-muted-foreground">All documents must be clear, valid, and issued within the last 3 months (where applicable).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredDocuments.map((doc) => {
          const Icon = doc.icon;
          const isUploaded = uploadedDocuments[doc.key];
          
          return (
            <Card key={doc.key} className={`border transition-all ${isUploaded ? 'border-success bg-success/5' : 'border-border'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUploaded ? 'bg-success/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${isUploaded ? 'text-success' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        {doc.required ? (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Optional</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUploaded ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDocumentUpload(doc.key)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-warning/20 bg-warning-muted/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Verification Process</p>
              <p className="text-muted-foreground">
                Documents will be verified through automated systems where possible. 
                Manual review may be required for complex cases or additional documentation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="business">
            <Plus className="h-4 w-4 mr-2" />
            Initiate KYB
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KYB Application - UAE Regulatory Compliance</DialogTitle>
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
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="business"
                onClick={() => {
                  setOpen(false);
                  setCurrentStep(1);
                  if (onSubmit) onSubmit();
                }}
              >
                Submit KYB Application
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYBInitiationForm;