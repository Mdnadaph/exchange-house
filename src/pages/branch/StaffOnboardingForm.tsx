import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import IDDocumentForm, { IDDocument } from "@/components/kyb/IDDocumentForm";
import {
  Plus,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Key,
  CheckCircle,
  Globe,
} from "lucide-react";

interface BusinessOnboardingFormProps {
  trigger?: React.ReactNode;
}

import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

const StaffOnboardingForm = ({ trigger }: BusinessOnboardingFormProps) => {
  const { toast } = useToast();

  const [cookies] = useCookies(["Token", "branchId", "role"]); // Added "role"
  const Token = cookies.Token;
  const branchId = cookies.branchId;
  const userRole = cookies.role;

//   console.log("Branch Id :-", branchId);
//   console.log("Staff Token:-", Token);
//   console.log("Current User Role:", userRole);

//   const [cookies] = useCookies(["Token", "branchId"]);
//   const Token = cookies.Token;
  
  

  const navigate = useNavigate();
  const uuid = useParams();
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocuments, setIdDocuments] = useState<IDDocument[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "AED",
  ]);

  const [formData, setFormData] = useState({
    // Business Information
    companyName: "",
    tradeLicense: "",
    taxNumber: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    addressLine2: "",
    branchId: branchId,

    // WorkerAppz API Fields
    legalForm: "",
    businessType: "",
    countryName: "",
    alternatePhone: "",

    // Admin User Details
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
    adminDesignation: "",

    // Account Settings
    monthlyLimit: "",
    dealValidityDays: "7",
  });

  const currencies = [
    "USD",
    "AED",
    "EUR",
    "GBP",
    "INR",
    "PKR",
    "PHP",
    "BDT",
    "LKR",
    "NPR",
  ];

  const legalForms = [
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "freezone", label: "Free Zone Company" },
    { value: "sole", label: "Sole Establishment" },
    { value: "partnership", label: "Partnership" },
    { value: "branch", label: "Branch of Foreign Company" },
    { value: "pjsc", label: "Public Joint Stock Company (PJSC)" },
    { value: "prjsc", label: "Private Joint Stock Company (PrJSC)" },
  ];

  const businessTypes = [
    { value: "trading", label: "Trading" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "services", label: "Services" },
    { value: "construction", label: "Construction" },
    { value: "real_estate", label: "Real Estate" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "hospitality", label: "Hospitality" },
    { value: "transport", label: "Transport & Logistics" },
    { value: "retail", label: "Retail" },
    { value: "wholesale", label: "Wholesale" },
    { value: "other", label: "Other" },
  ];

  const countries = [
    "United Arab Emirates",
    "India",
    "Pakistan",
    "Philippines",
    "Bangladesh",
    "Sri Lanka",
    "Nepal",
    "Egypt",
    "United Kingdom",
    "United States",
    "China",
    "Saudi Arabia",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Jordan",
  ];

  const toggleCurrency = (currency: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmOnboarding = async () => {

    console.log("DEBUG: Sending request with Token:", Token);
  console.log("DEBUG: User Role from cookies:", userRole);
  console.log("DEBUG: BranchId from cookies:", branchId);


    try {
      const business = {
        companyName: formData.companyName,
        legalForm: formData.legalForm.toUpperCase(),
        businessType: formData.businessType.toUpperCase(),
        tradeLicense: formData.tradeLicense,
        taxNumber: formData.taxNumber,
        countryName: formData.countryName,
        branchId: formData.branchId,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        monthlyLimit: Number(formData.monthlyLimit),
        dealValidityDays: Number(formData.dealValidityDays),
        supportedCurrencies: selectedCurrencies,
        // Optional fields if API supports them
        alternatePhone: formData.alternatePhone,
        businessAddress: formData.businessAddress,
        addressLine2: formData.addressLine2,
      };

      const admin = {
        firstName: formData.adminFirstName,
        lastName: formData.adminLastName,
        email: formData.adminEmail,
        phoneNumber: formData.adminPhone,
        designation: formData.adminDesignation,
      };

      const apiFormData = new FormData();
      apiFormData.append("business", JSON.stringify(business));
      apiFormData.append("admin", JSON.stringify(admin));

      // idDocuments.forEach((doc) => {
      //   if (doc.file) {
      //     apiFormData.append("documents", doc.file);
      //     apiFormData.append("documentTypes", doc.type); // Assuming IDDocument has 'type' property
      //     apiFormData.append("documentNumbers", doc.number); // Assuming IDDocument has 'number' property
      //   }
      // });

      const response = await axios.post(
        `${BASE_URL}/api/v3/business/create`,
        apiFormData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast({
          title: "Business Onboarded Successfully",
          description: `${formData.companyName} has been onboarded. Login credentials sent to ${formData.adminEmail}`,
        });
        setOpen(false);
        setCurrentStep(1);
        setIdDocuments([]);
        setSelectedCurrencies(["AED"]);
        setFormData({
          companyName: "",
          tradeLicense: "",
          taxNumber: "",
          businessEmail: "",
          businessPhone: "",
          businessAddress: "",
          addressLine2: "",
          branchId: "",
          legalForm: "",
          businessType: "",
          countryName: "",
          alternatePhone: "",
          adminFirstName: "",
          adminLastName: "",
          adminEmail: "",
          adminPhone: "",
          adminDesignation: "",
          monthlyLimit: "",
          dealValidityDays: "7",
        });

        // Optionally navigate or reload if needed
      } else {
        toast({
          title: "Onboarding Failed",
          description:
            response.data.message || "An error occurred during onboarding.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to onboard business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
  if (branchId) {
    setFormData(prev => ({ ...prev, branchId: branchId }));
  }
}, [branchId]);

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }
          `}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`
              w-16 h-0.5 mx-2
              ${currentStep > step ? "bg-primary" : "bg-muted"}
            `}
            />
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                placeholder="Enter company name"
              />
            </div>

            {/* Legal Form - WorkerAppz API Field */}
            <div>
              <Label htmlFor="legalForm">Legal Form *</Label>
              <Select
                value={formData.legalForm}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, legalForm: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select legal form" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {legalForms.map((form) => (
                    <SelectItem key={form.value} value={form.value}>
                      {form.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Type - WorkerAppz API Field */}
            <div>
              <Label htmlFor="businessType">Type of Business *</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, businessType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tradeLicense">Trade License Number *</Label>
              <Input
                id="tradeLicense"
                value={formData.tradeLicense}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tradeLicense: e.target.value,
                  }))
                }
                placeholder="TL-XXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="taxNumber">Tax Registration Number *</Label>
              <Input
                id="taxNumber"
                value={formData.taxNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    taxNumber: e.target.value,
                  }))
                }
                placeholder="TAX-XXXXXX"
              />
            </div>

            {/* Country of Trade - WorkerAppz API Field */}
            <div>
              <Label htmlFor="countryOfTrade">Country of Trade *</Label>
              <Select
                value={formData.countryName}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, countryName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="branchId">Registered Branch *</Label>
              <Input id="branchId" value={formData.branchId} disabled />
            </div>

            <div>
              <Label htmlFor="businessEmail">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessEmail: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessPhone: e.target.value,
                    }))
                  }
                  placeholder="+971 4 XXX XXXX"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alternatePhone: e.target.value,
                    }))
                  }
                  placeholder="+971 5X XXX XXXX"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="businessAddress">Business Address Line 1 *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessAddress: e.target.value,
                    }))
                  }
                  placeholder="Office address, building name, street"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    addressLine2: e.target.value,
                  }))
                }
                placeholder="Area, landmark (optional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Business Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IDDocumentForm
            documents={idDocuments}
            onChange={setIdDocuments}
            showHeader={false}
          />
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    adminFirstName: e.target.value,
                  }))
                }
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="adminLastName">Last Name *</Label>
              <Input
                id="adminLastName"
                value={formData.adminLastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    adminLastName: e.target.value,
                  }))
                }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminEmail: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminPhone: e.target.value,
                    }))
                  }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    adminDesignation: e.target.value,
                  }))
                }
                placeholder="e.g., Finance Manager, CEO"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-accent-muted/20 rounded-lg">
            <Key className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Auto-Generated Credentials</p>
              <p className="text-xs text-muted-foreground">
                Login credentials will be automatically generated and sent to
                the admin email address.
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monthlyLimit: e.target.value,
                  }))
                }
                placeholder="Enter limit amount"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dealValidityDays">
                Deal Validity Period (Days) *
              </Label>
              <Input
                id="dealValidityDays"
                type="number"
                value={formData.dealValidityDays}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dealValidityDays: e.target.value,
                  }))
                }
                placeholder="7"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of days a negotiated deal remains valid before expiration
              </p>
            </div>
          </div>

          {/* Multi-Currency Selection - WorkerAppz API Field */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Supported Currencies *
            </Label>
            <p className="text-xs text-muted-foreground">
              Select all currencies this business will transact in
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {currencies.map((currency) => (
                <div key={currency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`currency-${currency}`}
                    checked={selectedCurrencies.includes(currency)}
                    onCheckedChange={() => toggleCurrency(currency)}
                  />
                  <Label
                    htmlFor={`currency-${currency}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {currency}
                  </Label>
                </div>
              ))}
            </div>
            {selectedCurrencies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCurrencies.map((curr) => (
                  <Badge key={curr} variant="secondary" className="text-xs">
                    {curr}
                  </Badge>
                ))}
              </div>
            )}
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
              <p className="text-muted-foreground">Legal Form</p>
              <p className="font-medium">
                {legalForms.find((f) => f.value === formData.legalForm)
                  ?.label || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Business Type</p>
              <p className="font-medium">
                {businessTypes.find((t) => t.value === formData.businessType)
                  ?.label || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Country of Trade</p>
              <p className="font-medium">{formData.countryName || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Branch</p>
              <p className="font-medium">{formData.branchId || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admin User</p>
              <p className="font-medium">
                {`${formData.adminFirstName} ${formData.adminLastName}`.trim() ||
                  "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Admin Email</p>
              <p className="font-medium">{formData.adminEmail || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Limit</p>
              <p className="font-medium">
                {formData.monthlyLimit
                  ? `AED ${Number(formData.monthlyLimit).toLocaleString()}`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Supported Currencies</p>
              <p className="font-medium">
                {selectedCurrencies.length > 0
                  ? selectedCurrencies.join(", ")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">ID Documents</p>
              <p className="font-medium">
                {idDocuments.length > 0
                  ? `${idDocuments.length} document(s)`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Deal Validity</p>
              <p className="font-medium">
                {formData.dealValidityDays
                  ? `${formData.dealValidityDays} days`
                  : "-"}
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
        {/* <DialogTrigger asChild>
          {trigger || (
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Onboard Business
            </Button>
          )}
        </DialogTrigger> */}
        <DialogTrigger asChild>
          {trigger || (
            <Button
              type="button"
              variant="default"
              onClick={() => console.log("clicked")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Onboard Business
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          aria-describedby={undefined}
        >
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
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Create Business Account</Button>
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

export default StaffOnboardingForm;

