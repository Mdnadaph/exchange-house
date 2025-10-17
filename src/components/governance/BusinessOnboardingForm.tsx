import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Building2, 
  User, 
  Mail,
  Phone,
  MapPin,
  FileText,
  Key,
  CheckCircle
} from "lucide-react";

interface BusinessOnboardingFormProps {
  trigger?: React.ReactNode;
}

const BusinessOnboardingForm = ({ trigger }: BusinessOnboardingFormProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    companyName: "",
    tradeLicense: "",
    taxNumber: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    registeredBranch: "",
    
    // Admin User Details
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
    adminDesignation: "",
    
    // Account Settings
    monthlyLimit: "",
    currency: "USD",
    dealValidityDays: "7"
  });

  const branches = ["Dubai Mall Branch", "Abu Dhabi Branch", "Sharjah Branch", "Al Ain Branch"];
  const currencies = ["USD", "AED", "EUR", "GBP"];

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmOnboarding = () => {
    toast({
      title: "Business Onboarded Successfully",
      description: `${formData.companyName} has been onboarded. Login credentials sent to ${formData.adminEmail}`,
    });
    setOpen(false);
    setCurrentStep(1);
    setFormData({
      companyName: "",
      tradeLicense: "",
      taxNumber: "",
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      registeredBranch: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminPhone: "",
      adminDesignation: "",
      monthlyLimit: "",
      currency: "USD",
      dealValidityDays: "7"
    });
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="tradeLicense">Trade License Number *</Label>
              <Input
                id="tradeLicense"
                value={formData.tradeLicense}
                onChange={(e) => setFormData(prev => ({ ...prev, tradeLicense: e.target.value }))}
                placeholder="TL-XXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="taxNumber">Tax Registration Number *</Label>
              <Input
                id="taxNumber"
                value={formData.taxNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
                placeholder="TAX-XXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="businessEmail">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                  placeholder="info@company.ae"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessPhone">Business Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessPhone"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                  placeholder="+971 4 XXX XXXX"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="businessAddress">Business Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                  placeholder="Office address, Dubai, UAE"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="registeredBranch">Registered Branch *</Label>
              <Select value={formData.registeredBranch} onValueChange={(value) => setFormData(prev => ({ ...prev, registeredBranch: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Business Admin User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adminFirstName">First Name *</Label>
              <Input
                id="adminFirstName"
                value={formData.adminFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="adminLastName">Last Name *</Label>
              <Input
                id="adminLastName"
                value={formData.adminLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, adminLastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                  placeholder="admin@company.ae"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="adminPhone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminPhone: e.target.value }))}
                  placeholder="+971 5X XXX XXXX"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="adminDesignation">Designation *</Label>
              <Input
                id="adminDesignation"
                value={formData.adminDesignation}
                onChange={(e) => setFormData(prev => ({ ...prev, adminDesignation: e.target.value }))}
                placeholder="e.g., Finance Manager, CEO"
              />
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-accent-muted/20 rounded-lg">
            <Key className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Auto-Generated Credentials</p>
              <p className="text-xs text-muted-foreground">
                Login credentials will be automatically generated and sent to the admin email address.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Account Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyLimit">Monthly Transaction Limit *</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                placeholder="Enter limit amount"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dealValidityDays">Deal Validity Period (Days) *</Label>
              <Input
                id="dealValidityDays"
                type="number"
                value={formData.dealValidityDays}
                onChange={(e) => setFormData(prev => ({ ...prev, dealValidityDays: e.target.value }))}
                placeholder="7"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of days a negotiated deal remains valid before expiration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent-muted/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            Onboarding Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">Company</p>
              <p className="font-medium">{formData.companyName || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Branch</p>
              <p className="font-medium">{formData.registeredBranch || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admin User</p>
              <p className="font-medium">{`${formData.adminFirstName} ${formData.adminLastName}` || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admin Email</p>
              <p className="font-medium">{formData.adminEmail || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Limit</p>
              <p className="font-medium">{formData.monthlyLimit ? `${formData.currency} ${Number(formData.monthlyLimit).toLocaleString()}` : "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Deal Validity</p>
              <p className="font-medium">{formData.dealValidityDays ? `${formData.dealValidityDays} days` : "-"}</p>
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
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Onboard Business
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Onboarding
            </DialogTitle>
          </DialogHeader>

          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-4">
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
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Business Account
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmOnboarding}
        title="Confirm Business Onboarding"
        description={`Are you sure you want to onboard ${formData.companyName}? An admin account will be created and credentials will be sent to ${formData.adminEmail}.`}
        confirmText="Onboard Business"
      />
    </>
  );
};

export default BusinessOnboardingForm;
