//import { useState, useEffect } from "react";
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
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Badge } from "@/components/ui/badge";
//import { Checkbox } from "@/components/ui/checkbox";
//import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
//import { useToast } from "@/hooks/use-toast";
//import IDDocumentForm, { IDDocument } from "@/components/kyb/IDDocumentForm";
//import {
//  Plus,
//  Building2,
//  User,
//  Mail,
//  Phone,
//  MapPin,
//  FileText,
//  Key,
//  CheckCircle,
//  Globe,
//} from "lucide-react";

//interface BusinessOnboardingFormProps {
//  trigger?: React.ReactNode;
//}

//import BASE_URL from "@/config/config";
//import axios from "axios";
//import { useCookies } from "react-cookie";
//import { useNavigate, useParams } from "react-router-dom";

//const BusinessOnboardingForm = ({ trigger }: BusinessOnboardingFormProps) => {
//  const { toast } = useToast();
//  const [cookies] = useCookies(["token"]);
//  const token = cookies.token;
//  const navigate = useNavigate();
//  const uuid = useParams();
//  const [open, setOpen] = useState(false);
//  const [showConfirmation, setShowConfirmation] = useState(false);
//  const [currentStep, setCurrentStep] = useState(1);
//  const [idDocuments, setIdDocuments] = useState<IDDocument[]>([]);
//  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
//    "AED",
//  ]);
//  const [errors, setErrors] = useState<Record<string, string>>({});

//  const [branchLoading, setBranchLoading] = useState(false);

//  interface Branch {
//    branchId: string;
//    uuid: string;
//    name: string;
//    address: string;
//    emirate: string;
//    location: string;
//    email: string;
//    contactNumber: string;
//    active: boolean;
//  }

//  const [branchList, setBranchList] = useState<Branch[]>([]);
//  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//  const [loading, setLoading] = useState<boolean>(false);
//  const [error, setError] = useState<String>("");
//  const [formData, setFormData] = useState({
//    // Business Information
//    companyName: "",
//    tradeLicense: "",
//    taxNumber: "",
//    businessEmail: "",
//    businessPhone: "",
//    businessAddress: "",
//    addressLine2: "",
//    branchId: "",

//    // WorkerAppz API Fields
//    legalForm: "",
//    businessType: "",
//    countryName: "",
//    alternatePhone: "",

//    // Admin User Details
//    adminFirstName: "",
//    adminLastName: "",
//    adminEmail: "",
//    adminPhone: "",
//    adminDesignation: "",

//    // Account Settings
//    monthlyLimit: "",
//    dealValidityDays: "7",
//  });

//  const currencies = [
//    "USD",
//    "AED",
//    "EUR",
//    "GBP",
//    "INR",
//    "PKR",
//    "PHP",
//    "BDT",
//    "LKR",
//    "NPR",
//  ];

//  const legalForms = [
//    { value: "llc", label: "Limited Liability Company (LLC)" },
//    { value: "freezone", label: "Free Zone Company" },
//    { value: "sole", label: "Sole Establishment" },
//    { value: "partnership", label: "Partnership" },
//    { value: "branch", label: "Branch of Foreign Company" },
//    { value: "pjsc", label: "Public Joint Stock Company (PJSC)" },
//    { value: "prjsc", label: "Private Joint Stock Company (PrJSC)" },
//  ];

//  const businessTypes = [
//    { value: "trading", label: "Trading" },
//    { value: "manufacturing", label: "Manufacturing" },
//    { value: "services", label: "Services" },
//    { value: "construction", label: "Construction" },
//    { value: "real_estate", label: "Real Estate" },
//    { value: "technology", label: "Technology" },
//    { value: "healthcare", label: "Healthcare" },
//    { value: "hospitality", label: "Hospitality" },
//    { value: "transport", label: "Transport & Logistics" },
//    { value: "retail", label: "Retail" },
//    { value: "wholesale", label: "Wholesale" },
//    { value: "other", label: "Other" },
//  ];

//  const countries = [
//    "United Arab Emirates",
//    "India",
//    "Pakistan",
//    "Philippines",
//    "Bangladesh",
//    "Sri Lanka",
//    "Nepal",
//    "Egypt",
//    "United Kingdom",
//    "United States",
//    "China",
//    "Saudi Arabia",
//    "Qatar",
//    "Kuwait",
//    "Bahrain",
//    "Oman",
//    "Jordan",
//  ];

//  const toggleCurrency = (currency: string) => {
//    setSelectedCurrencies((prev) =>
//      prev.includes(currency)
//        ? prev.filter((c) => c !== currency)
//        : [...prev, currency],
//    );
//  };

//  const handleSubmit = () => {
//    setShowConfirmation(true);
//  };

//  const confirmOnboarding = async () => {
//    setLoading(true);
//    try {
//      const business = {
//        companyName: formData.companyName,
//        legalForm: formData.legalForm.toUpperCase(),
//        businessType: formData.businessType.toUpperCase(),
//        tradeLicense: formData.tradeLicense,
//        taxNumber: formData.taxNumber,
//        countryName: formData.countryName,
//        branchId: formData.branchId,
//        businessEmail: formData.businessEmail,
//        businessPhone: formData.businessPhone,
//        monthlyLimit: Number(formData.monthlyLimit),
//        dealValidityDays: Number(formData.dealValidityDays),
//        supportedCurrencies: selectedCurrencies,
//        // Optional fields if API supports them
//        alternatePhone: formData.alternatePhone,
//        businessAddress: formData.businessAddress,
//        addressLine2: formData.addressLine2,
//      };

//      const admin = {
//        firstName: formData.adminFirstName,
//        lastName: formData.adminLastName,
//        email: formData.adminEmail,
//        phoneNumber: formData.adminPhone,
//        designation: formData.adminDesignation,
//      };

//      const apiFormData = new FormData();
//      apiFormData.append(
//        "business",
//        new Blob([JSON.stringify(business)], {
//          type: "application/json",
//        }),
//      );
//      apiFormData.append(
//        "admin",
//        new Blob([JSON.stringify(admin)], {
//          type: "application/json",
//        }),
//      );

//      // idDocuments.forEach((doc) => {
//      //   if (doc.file) {
//      //     apiFormData.append("documents", doc.file);
//      //     apiFormData.append("documentTypes", doc.type); // Assuming IDDocument has 'type' property
//      //     apiFormData.append("documentNumbers", doc.number); // Assuming IDDocument has 'number' property
//      //   }
//      // });

//      const response = await axios.post(
//        `${BASE_URL}/api/v3/business/create`,
//        apiFormData,
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//            "Content-Type": "multipart/form-data",
//          },
//        },
//      );
//      if (response.data.status) {
//        toast({
//          title: "Business Onboarded Successfully",
//          description: `${formData.companyName} has been onboarded. Login credentials sent to ${formData.adminEmail}`,
//        });
//        setOpen(false);
//        setCurrentStep(1);
//        setIdDocuments([]);
//        setSelectedCurrencies(["AED"]);
//        setFormData({
//          companyName: "",
//          tradeLicense: "",
//          taxNumber: "",
//          businessEmail: "",
//          businessPhone: "",
//          businessAddress: "",
//          addressLine2: "",
//          branchId: "",
//          legalForm: "",
//          businessType: "",
//          countryName: "",
//          alternatePhone: "",
//          adminFirstName: "",
//          adminLastName: "",
//          adminEmail: "",
//          adminPhone: "",
//          adminDesignation: "",
//          monthlyLimit: "",
//          dealValidityDays: "7",
//        });

//        // Optionally navigate or reload if needed
//      } else {
//        toast({
//          title: "Onboarding Failed",
//          description:
//            response.data.message || "An error occurred during onboarding.",
//          variant: "destructive",
//        });
//      }
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: "Failed to onboard business. Please try again.",
//        variant: "destructive",
//      });
//    } finally {
//      setShowConfirmation(false);
//      setLoading(false);
//    }
//  };

//  const fetchBranches = async () => {
//    try {
//      setBranchLoading(true);
//      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
//        headers: {
//          Authorization: `Bearer ${token}`,
//        },
//      });

//      setBranchList(res.data?.data || []);
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: "Failed to load branches",
//        variant: "destructive",
//      });
//    } finally {
//      setBranchLoading(false);
//    }
//  };

//  useEffect(() => {
//    if (open) {
//      fetchBranches();
//    }
//  }, [open]);

//  // Helper to clear a specific field error when user types
//  const clearError = (field: string) => {
//    setErrors((prev) => {
//      const newErrors = { ...prev };
//      delete newErrors[field];
//      return newErrors;
//    });
//  };

//  const validateStep1 = (): boolean => {
//    const newErrors: Record<string, string> = {};

//    // Required fields
//    if (!formData.companyName.trim())
//      newErrors.companyName = "Company Name is required";
//    if (!formData.legalForm) newErrors.legalForm = "Legal Form is required";
//    if (!formData.businessType)
//      newErrors.businessType = "Business Type is required";
//    if (!formData.tradeLicense.trim())
//      newErrors.tradeLicense = "Trade License Number is required";
//    if (!formData.taxNumber.trim())
//      newErrors.taxNumber = "Tax Registration Number is required";

//    if (!formData.countryName)
//      newErrors.countryName = "Country of Trade is required";
//    if (!formData.branchId)
//      newErrors.branchId = "Registered Branch is required";
//    if (!formData.businessEmail.trim())
//      newErrors.businessEmail = "Business Email is required";
//    if (!formData.businessPhone.trim())
//      newErrors.businessPhone = "Business Phone is required";
//    if (!formData.businessAddress.trim())
//      newErrors.businessAddress = "Business Address Line 1 is required";

//    // Format validations
//    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//    if (formData.businessEmail && !emailRegex.test(formData.businessEmail)) {
//      newErrors.businessEmail = "Enter a valid email address";
//    }

//    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
//    if (formData.businessPhone && !phoneRegex.test(formData.businessPhone)) {
//      newErrors.businessPhone = "Enter a valid phone number";
//    }

//    setErrors(newErrors);
//    return Object.keys(newErrors).length === 0;
//  };

//  const validateStep2 = (): boolean => {
//    const newErrors: Record<string, string> = {};

//    if (!formData.adminFirstName.trim())
//      newErrors.adminFirstName = "First Name is required";
//    if (!formData.adminLastName.trim())
//      newErrors.adminLastName = "Last Name is required";
//    if (!formData.adminEmail.trim())
//      newErrors.adminEmail = "Email Address is required";
//    if (!formData.adminPhone.trim())
//      newErrors.adminPhone = "Phone Number is required";
//    if (!formData.adminDesignation.trim())
//      newErrors.adminDesignation = "Designation is required";

//    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
//      newErrors.adminEmail = "Enter a valid email address";
//    }

//    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
//    if (formData.adminPhone && !phoneRegex.test(formData.adminPhone)) {
//      newErrors.adminPhone = "Enter a valid phone number";
//    }

//    setErrors(newErrors);
//    return Object.keys(newErrors).length === 0;
//  };

//  const validateStep3 = (): boolean => {
//    const newErrors: Record<string, string> = {};

//    if (!formData.monthlyLimit) {
//      newErrors.monthlyLimit = "Monthly limit is required";
//    } else if (Number(formData.monthlyLimit) <= 0) {
//      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
//    }

//    if (!formData.dealValidityDays) {
//      newErrors.dealValidityDays = "Deal validity days is required";
//    } else if (Number(formData.dealValidityDays) <= 0) {
//      newErrors.dealValidityDays = "Deal validity must be greater than 0";
//    }

//    if (selectedCurrencies.length === 0) {
//      newErrors.currencies = "Select at least one currency";
//    }

//    setErrors(newErrors);
//    return Object.keys(newErrors).length === 0;
//  };

//  const renderStepIndicator = () => (
//    <div className="flex items-center space-x-4 mb-6">
//      {[1, 2, 3].map((step) => (
//        <div key={step} className="flex items-center">
//          <div
//            className={`
//            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
//            ${
//              currentStep >= step
//                ? "bg-primary text-primary-foreground"
//                : "bg-muted text-muted-foreground"
//            }
//          `}
//          >
//            {step}
//          </div>
//          {step < 3 && (
//            <div
//              className={`
//              w-16 h-0.5 mx-2
//              ${currentStep > step ? "bg-primary" : "bg-muted"}
//            `}
//            />
//          )}
//        </div>
//      ))}
//    </div>
//  );

//  const renderStep1 = () => (
//    <div className="space-y-6">
//      <Card>
//        <CardHeader>
//          <CardTitle className="text-lg flex items-center gap-2">
//            <Building2 className="h-5 w-5" />
//            Business Information
//          </CardTitle>
//        </CardHeader>
//        <CardContent className="space-y-4">
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//            <div className="md:col-span-2">
//              <Label htmlFor="companyName">Company Name *</Label>
//              <Input
//                id="companyName"
//                value={formData.companyName}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    companyName: e.target.value,
//                  }))
//                }
//                placeholder="Enter company name"
//              />
//              {errors.companyName && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.companyName}
//                </p>
//              )}
//            </div>

//            {/* Legal Form - WorkerAppz API Field */}
//            <div>
//              <Label htmlFor="legalForm">Legal Form *</Label>
//              <Select
//                value={formData.legalForm}
//                onValueChange={(value) =>
//                  setFormData((prev) => ({ ...prev, legalForm: value }))
//                }
//              >
//                <SelectTrigger>
//                  <SelectValue placeholder="Select legal form" />
//                </SelectTrigger>
//                <SelectContent className="bg-background border border-border z-50">
//                  {legalForms.map((form) => (
//                    <SelectItem key={form.value} value={form.value}>
//                      {form.label}
//                    </SelectItem>
//                  ))}
//                </SelectContent>
//              </Select>
//              {errors.legalForm && (
//                <p className="text-sm text-red-500 mt-1">{errors.legalForm}</p>
//              )}
//            </div>

//            {/* Business Type - WorkerAppz API Field */}
//            <div>
//              <Label htmlFor="businessType">Type of Business *</Label>
//              <Select
//                value={formData.businessType}
//                onValueChange={(value) =>
//                  setFormData((prev) => ({ ...prev, businessType: value }))
//                }
//              >
//                <SelectTrigger>
//                  <SelectValue placeholder="Select business type" />
//                </SelectTrigger>
//                <SelectContent className="bg-background border border-border z-50">
//                  {businessTypes.map((type) => (
//                    <SelectItem key={type.value} value={type.value}>
//                      {type.label}
//                    </SelectItem>
//                  ))}
//                </SelectContent>
//              </Select>
//              {errors.businessType && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.businessType}
//                </p>
//              )}
//            </div>

//            <div>
//              <Label htmlFor="tradeLicense">Trade License Number *</Label>
//              <Input
//                id="tradeLicense"
//                value={formData.tradeLicense}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    tradeLicense: e.target.value,
//                  }))
//                }
//                placeholder="TL-XXXXXX"
//              />
//              {errors.tradeLicense && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.tradeLicense}
//                </p>
//              )}
//            </div>
//            <div>
//              <Label htmlFor="taxNumber">Tax Registration Number *</Label>
//              <Input
//                id="taxNumber"
//                value={formData.taxNumber}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    taxNumber: e.target.value,
//                  }))
//                }
//                placeholder="TAX-XXXXXX"
//              />
//              {errors.taxNumber && (
//                <p className="text-sm text-red-500 mt-1">{errors.taxNumber}</p>
//              )}
//            </div>

//            {/* Country of Trade - WorkerAppz API Field */}
//            <div>
//              <Label htmlFor="countryOfTrade">Country of Trade *</Label>
//              <Select
//                value={formData.countryName}
//                onValueChange={(value) =>
//                  setFormData((prev) => ({ ...prev, countryName: value }))
//                }
//              >
//                <SelectTrigger>
//                  <SelectValue placeholder="Select country" />
//                </SelectTrigger>
//                <SelectContent className="bg-background border border-border z-50">
//                  {countries.map((country) => (
//                    <SelectItem key={country} value={country}>
//                      {country}
//                    </SelectItem>
//                  ))}
//                </SelectContent>
//              </Select>
//              {errors.countryOfTrade && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.countryOfTrade}
//                </p>
//              )}
//            </div>

//            <div>
//              <Label htmlFor="branchId">Registered Branch *</Label>
//              <Select
//                value={formData.branchId}
//                onValueChange={(value) =>
//                  setFormData((prev) => ({ ...prev, branchId: value }))
//                }
//              >
//                <SelectTrigger>
//                  <SelectValue
//                    placeholder={
//                      branchLoading ? "Loading branches..." : "Select branch"
//                    }
//                  />
//                </SelectTrigger>
//                <SelectContent className="bg-background border border-border z-50">
//                  {branchList.map((branch) => (
//                    <SelectItem
//                      key={branch.uuid}
//                      value={branch.branchId.toString()}
//                    >
//                      {branch.name}
//                    </SelectItem>
//                  ))}
//                </SelectContent>
//              </Select>
//              {errors.branchId && (
//                <p className="text-sm text-red-500 mt-1">{errors.branchId}</p>
//              )}
//            </div>

//            <div>
//              <Label htmlFor="businessEmail">Business Email *</Label>
//              <div className="relative">
//                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="businessEmail"
//                  type="email"
//                  value={formData.businessEmail}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      businessEmail: e.target.value,
//                    }))
//                  }
//                  placeholder="info@company.ae"
//                  className="pl-9"
//                />
//                {errors.businessEmail && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.businessEmail}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div>
//              <Label htmlFor="businessPhone">Business Phone *</Label>
//              <div className="relative">
//                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="businessPhone"
//                  value={formData.businessPhone}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      businessPhone: e.target.value,
//                    }))
//                  }
//                  placeholder="+971 4 XXX XXXX"
//                  className="pl-9"
//                />
//                {errors.businessPhone && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.businessPhone}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div>
//              <Label htmlFor="alternatePhone">Alternate Phone</Label>
//              <div className="relative">
//                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="alternatePhone"
//                  value={formData.alternatePhone}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      alternatePhone: e.target.value,
//                    }))
//                  }
//                  placeholder="+971 5X XXX XXXX"
//                  className="pl-9"
//                />
//                {errors.alternatePhone && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.alternatePhone}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div className="md:col-span-2">
//              <Label htmlFor="businessAddress">Business Address Line 1 *</Label>
//              <div className="relative">
//                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="businessAddress"
//                  value={formData.businessAddress}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      businessAddress: e.target.value,
//                    }))
//                  }
//                  placeholder="Office address, building name, street"
//                  className="pl-9"
//                />
//                {errors.businessAddress && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.businessAddress}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div className="md:col-span-2">
//              <Label htmlFor="addressLine2">Address Line 2</Label>
//              <Input
//                id="addressLine2"
//                value={formData.addressLine2}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    addressLine2: e.target.value,
//                  }))
//                }
//                placeholder="Area, landmark (optional)"
//              />
//            </div>
//          </div>
//        </CardContent>
//      </Card>

//      {/* ID Documents Section */}
//      {/* <Card>
//        <CardHeader>
//          <CardTitle className="text-lg flex items-center gap-2">
//            <FileText className="h-5 w-5" />
//            Business Documents
//          </CardTitle>
//        </CardHeader>
//        <CardContent>
//          <IDDocumentForm
//            documents={idDocuments}
//            onChange={setIdDocuments}
//            showHeader={false}
//          />
//        </CardContent>
//      </Card> */}
//    </div>
//  );

//  const renderStep2 = () => (
//    <div className="space-y-6">
//      <Card>
//        <CardHeader>
//          <CardTitle className="text-lg flex items-center gap-2">
//            <User className="h-5 w-5" />
//            Business Admin User
//          </CardTitle>
//        </CardHeader>
//        <CardContent className="space-y-4">
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//            <div>
//              <Label htmlFor="adminFirstName">First Name *</Label>
//              <Input
//                id="adminFirstName"
//                value={formData.adminFirstName}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    adminFirstName: e.target.value,
//                  }))
//                }
//                placeholder="Enter first name"
//              />
//              {errors.adminFirstName && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.adminFirstName}
//                </p>
//              )}
//            </div>
//            <div>
//              <Label htmlFor="adminLastName">Last Name *</Label>
//              <Input
//                id="adminLastName"
//                value={formData.adminLastName}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    adminLastName: e.target.value,
//                  }))
//                }
//                placeholder="Enter last name"
//              />
//              {errors.adminLastName && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.adminLastName}
//                </p>
//              )}
//            </div>
//            <div>
//              <Label htmlFor="adminEmail">Email Address *</Label>
//              <div className="relative">
//                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="adminEmail"
//                  type="email"
//                  value={formData.adminEmail}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      adminEmail: e.target.value,
//                    }))
//                  }
//                  placeholder="admin@company.ae"
//                  className="pl-9"
//                />
//                {errors.adminEmail && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.adminEmail}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div>
//              <Label htmlFor="adminPhone">Phone Number *</Label>
//              <div className="relative">
//                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                  id="adminPhone"
//                  value={formData.adminPhone}
//                  onChange={(e) =>
//                    setFormData((prev) => ({
//                      ...prev,
//                      adminPhone: e.target.value,
//                    }))
//                  }
//                  placeholder="+971 5X XXX XXXX"
//                  className="pl-9"
//                />
//                {errors.adminPhone && (
//                  <p className="text-sm text-red-500 mt-1">
//                    {errors.adminPhone}
//                  </p>
//                )}
//              </div>
//            </div>
//            <div className="md:col-span-2">
//              <Label htmlFor="adminDesignation">Designation *</Label>
//              <Input
//                id="adminDesignation"
//                value={formData.adminDesignation}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    adminDesignation: e.target.value,
//                  }))
//                }
//                placeholder="e.g., Finance Manager, CEO"
//              />
//              {errors.adminDesignation && (
//                <p className="text-sm text-red-500 mt-1">
//                  {errors.adminDesignation}
//                </p>
//              )}
//            </div>
//          </div>

//          <div className="flex items-start gap-2 p-3 bg-accent-muted/20 rounded-lg">
//            <Key className="h-4 w-4 text-accent mt-0.5" />
//            <div>
//              <p className="text-sm font-medium">Auto-Generated Credentials</p>
//              <p className="text-xs text-muted-foreground">
//                Login credentials will be automatically generated and sent to
//                the admin email address.
//              </p>
//            </div>
//          </div>
//        </CardContent>
//      </Card>
//    </div>
//  );

//  const renderStep3 = () => (
//    <div className="space-y-6">
//      <Card>
//        <CardHeader>
//          <CardTitle className="text-lg flex items-center gap-2">
//            <FileText className="h-5 w-5" />
//            Account Configuration
//          </CardTitle>
//        </CardHeader>
//        <CardContent className="space-y-4">
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//            <div>
//              <Label htmlFor="monthlyLimit">Monthly Transaction Limit *</Label>
//              <Input
//                id="monthlyLimit"
//                type="number"
//                value={formData.monthlyLimit}
//                onChange={(e) => {
//                  const value = e.target.value;
//                  if (!value) {
//                    setError("Monthly limit is required");
//                  } else if (Number(value) <= 0) {
//                    setError("Monthly limit must be greater than 0");
//                  } else {
//                    setError("");
//                  }
//                  setFormData((prev) => ({
//                    ...prev,
//                    monthlyLimit: value,
//                  }));
//                }}
//                placeholder="Enter limit amount"
//              />
//              {error && (
//                <p className="text-red-500 font-normal text-sm pt-3">{error}</p>
//              )}
//            </div>
//            <div className="md:col-span-2">
//              <Label htmlFor="dealValidityDays">
//                Deal Validity Period (Days) *
//              </Label>
//              <Input
//                id="dealValidityDays"
//                type="number"
//                value={formData.dealValidityDays}
//                onChange={(e) =>
//                  setFormData((prev) => ({
//                    ...prev,
//                    dealValidityDays: e.target.value,
//                  }))
//                }
//                placeholder="7"
//              />
//              <p className="text-xs text-muted-foreground mt-1">
//                Number of days a negotiated deal remains valid before expiration
//              </p>
//            </div>
//          </div>

//          {/* Multi-Currency Selection - WorkerAppz API Field */}
//          <div className="space-y-3">
//            <Label className="flex items-center gap-2">
//              <Globe className="h-4 w-4" />
//              Supported Currencies *
//            </Label>
//            <p className="text-xs text-muted-foreground">
//              Select all currencies this business will transact in
//            </p>
//            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//              {currencies.map((currency) => (
//                <div key={currency} className="flex items-center space-x-2">
//                  <Checkbox
//                    id={`currency-${currency}`}
//                    checked={selectedCurrencies.includes(currency)}
//                    onCheckedChange={() => toggleCurrency(currency)}
//                  />
//                  <Label
//                    htmlFor={`currency-${currency}`}
//                    className="text-sm font-normal cursor-pointer"
//                  >
//                    {currency}
//                  </Label>
//                </div>
//              ))}
//            </div>
//            {selectedCurrencies.length > 0 && (
//              <div className="flex flex-wrap gap-1 mt-2">
//                {selectedCurrencies.map((curr) => (
//                  <Badge key={curr} variant="secondary" className="text-xs">
//                    {curr}
//                  </Badge>
//                ))}
//              </div>
//            )}
//          </div>
//        </CardContent>
//      </Card>

//      <Card className="border-accent/20 bg-accent-muted/10">
//        <CardHeader>
//          <CardTitle className="text-base flex items-center gap-2">
//            <CheckCircle className="h-4 w-4 text-accent" />
//            Onboarding Summary
//          </CardTitle>
//        </CardHeader>
//        <CardContent className="space-y-3 text-sm">
//          <div className="grid grid-cols-2 gap-3">
//            <div>
//              <p className="text-muted-foreground">Company</p>
//              <p className="font-medium">{formData.companyName || "-"}</p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Legal Form</p>
//              <p className="font-medium">
//                {legalForms.find((f) => f.value === formData.legalForm)
//                  ?.label || "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Business Type</p>
//              <p className="font-medium">
//                {businessTypes.find((t) => t.value === formData.businessType)
//                  ?.label || "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Country of Trade</p>
//              <p className="font-medium">{formData.countryName || "-"}</p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Branch</p>
//              <p className="font-medium">{formData.branchId || "-"}</p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Admin User</p>
//              <p className="font-medium">
//                {`${formData.adminFirstName} ${formData.adminLastName}`.trim() ||
//                  "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Admin Email</p>
//              <p className="font-medium">{formData.adminEmail || "-"}</p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Monthly Limit</p>
//              <p className="font-medium">
//                {formData.monthlyLimit
//                  ? `AED ${Number(formData.monthlyLimit).toLocaleString()}`
//                  : "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Supported Currencies</p>
//              <p className="font-medium">
//                {selectedCurrencies.length > 0
//                  ? selectedCurrencies.join(", ")
//                  : "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">ID Documents</p>
//              <p className="font-medium">
//                {idDocuments.length > 0
//                  ? `${idDocuments.length} document(s)`
//                  : "-"}
//              </p>
//            </div>
//            <div>
//              <p className="text-muted-foreground">Deal Validity</p>
//              <p className="font-medium">
//                {formData.dealValidityDays
//                  ? `${formData.dealValidityDays} days`
//                  : "-"}
//              </p>
//            </div>
//          </div>
//        </CardContent>
//      </Card>
//    </div>
//  );

//  return (
//    <>
//      <Dialog open={open} onOpenChange={setOpen}>
//        {/* <DialogTrigger asChild>
//          {trigger || (
//            <Button variant="default">
//              <Plus className="h-4 w-4 mr-2" />
//              Onboard Business
//            </Button>
//          )}
//        </DialogTrigger> */}
//        <DialogTrigger asChild>
//          {trigger || (
//            <Button type="button" variant="default">
//              <Plus className="h-4 w-4 mr-2" />
//              Onboard Business
//            </Button>
//          )}
//        </DialogTrigger>

//        <DialogContent
//          className="max-w-3xl max-h-[90vh] overflow-y-auto"
//          aria-describedby={undefined}
//        >
//          <DialogHeader>
//            <DialogTitle className="flex items-center gap-2">
//              <Building2 className="h-5 w-5" />
//              Business Onboarding
//            </DialogTitle>
//          </DialogHeader>

//          {renderStepIndicator()}

//          {currentStep === 1 && renderStep1()}
//          {currentStep === 2 && renderStep2()}
//          {currentStep === 3 && renderStep3()}

//          <div className="flex justify-between pt-4">
//            <Button
//              variant="outline"
//              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
//              disabled={currentStep === 1}
//            >
//              Previous
//            </Button>
//            {currentStep < 3 ? (
//              <Button
//                onClick={() => {
//                  let isValid = false;
//                  if (currentStep === 1) isValid = validateStep1();
//                  else if (currentStep === 2) isValid = validateStep2();
//                  else if (currentStep === 3) isValid = validateStep3();

//                  if (isValid) {
//                    setCurrentStep((prev) => Math.min(3, prev + 1));
//                    // Optionally clear errors when moving to next step
//                    setErrors({});
//                  }
//                }}
//              >
//                Next
//              </Button>
//            ) : (
//              <Button
//                onClick={() => {
//                  // Validate all steps
//                  const step1Valid = validateStep1();
//                  const step2Valid = validateStep2();
//                  const step3Valid = validateStep3();

//                  if (step1Valid && step2Valid && step3Valid) {
//                    handleSubmit();
//                  } else {
//                    // Navigate to the first step that has errors
//                    if (!step1Valid) setCurrentStep(1);
//                    else if (!step2Valid) setCurrentStep(2);
//                    else if (!step3Valid) setCurrentStep(3);
//                  }
//                }}
//                disabled={loading}
//              >
//                {loading ? "Creating...." : "Create Business Account"}
//              </Button>
//            )}
//          </div>
//        </DialogContent>
//      </Dialog>

//      <ConfirmationDialog
//        open={showConfirmation}
//        onOpenChange={setShowConfirmation}
//        onConfirm={confirmOnboarding}
//        title="Confirm Business Onboarding"
//        description={`Are you sure you want to onboard ${formData.companyName}? An admin account will be created and credentials will be sent to ${formData.adminEmail}.`}
//        confirmText="Onboard Business"
//      />
//    </>
//  );
//};

//export default BusinessOnboardingForm;

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
   onSuccess?: () => void;
}
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // choose a theme if desired
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust path as needed
const BusinessOnboardingForm = ({ trigger }: BusinessOnboardingFormProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const navigate = useNavigate();
  const uuid = useParams();
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocuments, setIdDocuments] = useState<IDDocument[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "AED",
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [branchLoading, setBranchLoading] = useState(false);

  interface Branch {
    branchId: string;
    uuid: string;
    name: string;
    address: string;
    emirate: string;
    location: string;
    email: string;
    contactNumber: string;
    active: boolean;
  }

  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    // Business Information
    companyName: "",
    tradeLicense: "",
    taxNumber: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    addressLine2: "",
    branchId: "",

    // WorkerAppz API Fields
    legalForm: "",
    businessType: "",
    countryName: [] as string[],
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

  // Helper to clear a specific field error when user types
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const fieldNameMapping: Record<string, string> = {
    addressLine2: "businessAddress",
    tradeLicense: "tradeLicense",
    taxNumber: "taxNumber",
    companyName: "companyName",
    legalForm: "legalForm",
    businessType: "businessType",
    countryName: "countryName",
    branchId: "branchId",
    businessEmail: "businessEmail",
    businessPhone: "businessPhone",
    alternatePhone: "alternatePhone",
    monthlyLimit: "monthlyLimit",
    dealValidityDays: "dealValidityDays",
    supportedCurrencies: "currencies",
    adminFirstName: "adminFirstName",
    adminLastName: "adminLastName",
    adminEmail: "adminEmail",
    adminPhone: "adminPhone",
    adminDesignation: "adminDesignation",
  };

  const parseBackendErrors = (message: string): Record<string, string> => {
    const errors: Record<string, string> = {};
    // Split by comma, but be careful not to split inside messages
    const parts = message.split(/(?<=[a-z]):\s*/i);

    // The message may be a single string without commas
    if (!message.includes(",")) {
      const match = message.match(/^([a-zA-Z]+):\s*(.+)$/);
      if (match) {
        const backendField = match[1];
        const errorMsg = match[2];
        const formField = fieldNameMapping[backendField] || backendField;
        errors[formField] = errorMsg;
      } else {
        errors.general = message;
      }
      return errors;
    }

    const errorItems = message.split(/\s*,\s*/);
    errorItems.forEach((item) => {
      const colonIndex = item.indexOf(":");
      if (colonIndex > 0) {
        const backendField = item.substring(0, colonIndex).trim();
        const errorMsg = item.substring(colonIndex + 1).trim();
        const formField = fieldNameMapping[backendField] || backendField;
        if (errors[formField]) {
          errors[formField] += " " + errorMsg;
        } else {
          errors[formField] = errorMsg;
        }
      }
    });
    return errors;
  };

  const getStepForField = (field: string): number => {
    const step1Fields = [
      "companyName",
      "legalForm",
      "businessType",
      "tradeLicense",
      "taxNumber",
      "countryName",
      "branchId",
      "businessEmail",
      "businessPhone",
      "businessAddress",
      "alternatePhone",
      "addressLine2",
    ];
    const step2Fields = [
      "adminFirstName",
      "adminLastName",
      "adminEmail",
      "adminPhone",
      "adminDesignation",
    ];
    if (step1Fields.includes(field)) return 1;
    if (step2Fields.includes(field)) return 2;
    return 3;
  };

  const toggleCurrency = (currency: string) => {
    setSelectedCurrencies((prev) => {
      const newSelection = prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency];
      return newSelection;
    });
    clearError("currencies");
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmOnboarding = async () => {
    setLoading(true);
    setErrors({});
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
      apiFormData.append(
        "business",
        new Blob([JSON.stringify(business)], { type: "application/json" }),
      );
      apiFormData.append(
        "admin",
        new Blob([JSON.stringify(admin)], { type: "application/json" }),
      );

      const response = await axios.post(
        `${BASE_URL}/api/v3/business/create`,
        apiFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.status) {
        toast({
          title: "Business Onboarded Successfully",
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
          countryName: [],
          alternatePhone: "",
          adminFirstName: "",
          adminLastName: "",
          adminEmail: "",
          adminPhone: "",
          adminDesignation: "",
          monthlyLimit: "",
          dealValidityDays: "7",
        });
      } else {
        const errorMessage = response.data.message || "";
        const backendErrors = parseBackendErrors(errorMessage);
        setErrors(backendErrors);

        const fieldsWithErrors = Object.keys(backendErrors);
        if (fieldsWithErrors.length > 0) {
          const firstField = fieldsWithErrors[0];
          const targetStep = getStepForField(firstField);
          setCurrentStep(targetStep);
        }

        toast({
          title: "Validation Failed",
          description:
            errorMessage || "Please correct the errors and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      let errorMsg = "Failed to onboard business. Please try again.";
      if (error.response?.data?.message) {
        const backendErrors = parseBackendErrors(error.response.data.message);
        setErrors(backendErrors);
        errorMsg = error.response.data.message; // show the actual backend message
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setBranchLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v3/branch/all-branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBranchList(res.data?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    } finally {
      setBranchLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBranches();
      setErrors({});
    }
  }, [open]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company Name is required";
    if (!formData.legalForm) newErrors.legalForm = "Legal Form is required";
    if (!formData.businessType)
      newErrors.businessType = "Business Type is required";
    if (!formData.tradeLicense.trim())
      newErrors.tradeLicense = "Trade License Number is required";
    if (!formData.taxNumber.trim())
      newErrors.taxNumber = "Tax Registration Number is required";
    if (!formData.countryName)
      newErrors.countryName = "Country of Trade is required";
    if (!formData.branchId)
      newErrors.branchId = "Registered Branch is required";
    if (!formData.businessEmail.trim())
      newErrors.businessEmail = "Business Email is required";
    if (!formData.businessPhone.trim())
      newErrors.businessPhone = "Business Phone is required";
    if (!formData.businessAddress.trim())
      newErrors.businessAddress = "Business Address Line 1 is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.businessEmail && !emailRegex.test(formData.businessEmail)) {
      newErrors.businessEmail = "Enter a valid email address";
    }

    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
    if (formData.businessPhone && !phoneRegex.test(formData.businessPhone)) {
      newErrors.businessPhone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.adminFirstName.trim())
      newErrors.adminFirstName = "First Name is required";
    if (!formData.adminLastName.trim())
      newErrors.adminLastName = "Last Name is required";
    if (!formData.adminEmail.trim())
      newErrors.adminEmail = "Email Address is required";
    if (!formData.adminPhone.trim())
      newErrors.adminPhone = "Phone Number is required";
    if (!formData.adminDesignation.trim())
      newErrors.adminDesignation = "Designation is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
      newErrors.adminEmail = "Enter a valid email address";
    }

    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
    if (formData.adminPhone && !phoneRegex.test(formData.adminPhone)) {
      newErrors.adminPhone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.monthlyLimit) {
      newErrors.monthlyLimit = "Monthly limit is required";
    } else if (Number(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
    }

    if (!formData.dealValidityDays) {
      newErrors.dealValidityDays = "Deal validity days is required";
    } else if (Number(formData.dealValidityDays) <= 0) {
      newErrors.dealValidityDays = "Deal validity must be greater than 0";
    }

    if (selectedCurrencies.length === 0) {
      newErrors.currencies = "Select at least one currency";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
              <Label htmlFor="companyName">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }));
                  clearError("companyName");
                }}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="legalForm">
                Legal Form <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.legalForm}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, legalForm: value }));
                  clearError("legalForm");
                }}
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
              {errors.legalForm && (
                <p className="text-sm text-red-500 mt-1">{errors.legalForm}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessType">
                Type of Business <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, businessType: value }));
                  clearError("businessType");
                }}
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
              {errors.businessType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.businessType}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tradeLicense">
                Trade License Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tradeLicense"
                value={formData.tradeLicense}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tradeLicense: e.target.value,
                  }));
                  clearError("tradeLicense");
                }}
                placeholder="TL-XXXXXX"
              />
              {errors.tradeLicense && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tradeLicense}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="taxNumber">
                Tax Registration Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="taxNumber"
                value={formData.taxNumber}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    taxNumber: e.target.value,
                  }));
                  clearError("taxNumber");
                }}
                placeholder="TAX-XXXXXX"
              />
              {errors.taxNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.taxNumber}</p>
              )}
            </div>

            {/*<div>
              <Label htmlFor="countryOfTrade">
                Country of Trade <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.countryName}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, countryName: value }));
                  clearError("countryName");
                }}
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
              {errors.countryName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.countryName}
                </p>
              )}
            </div>*/}
            {/* Country of Trade Multi-Select */}
            <div className="md:col-span-2">
              <Label htmlFor="countryOfTrade">
                Country of Trade <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Globe className="mr-2 h-4 w-4 shrink-0" />
                    {formData.countryName.length > 0
                      ? `${formData.countryName.length} country(s) selected`
                      : "Select countries..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => {
                          const isSelected =
                            formData.countryName.includes(country);
                          return (
                            <CommandItem
                              key={country}
                              onSelect={() => {
                                setFormData((prev) => {
                                  const newCountries = isSelected
                                    ? prev.countryName.filter(
                                        (c) => c !== country,
                                      )
                                    : [...prev.countryName, country];
                                  return { ...prev, countryName: newCountries };
                                });
                                clearError("countryName");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {country}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.countryName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.countryName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="branchId">
                Registered Branch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, branchId: value }));
                  clearError("branchId");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      branchLoading ? "Loading branches..." : "Select branch"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {branchList.map((branch) => (
                    <SelectItem
                      key={branch.uuid}
                      value={branch.branchId.toString()}
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchId && (
                <p className="text-sm text-red-500 mt-1">{errors.branchId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessEmail">
                Business Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      businessEmail: e.target.value,
                    }));
                    clearError("businessEmail");
                  }}
                  placeholder="info@company.ae"
                  className="pl-9"
                />
              </div>
              {errors.businessEmail && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.businessEmail}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="businessPhone">
                Business Phone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PhoneInput
                  country={"us"}
                  value={formData.businessPhone}
                  onChange={(value, country) => {
                    setFormData((prev) => ({ ...prev, businessPhone: value }));
                    clearError("businessPhone");
                    // Optionally store country data if needed later
                  }}
                  inputProps={{
                    name: "businessPhone",
                    id: "businessPhone",
                    required: true,
                  }}
                  containerClass="phone-input-container" // optional custom class
                  //inputClass="!pl-12" // adjust padding for the flag button
                  buttonClass="phone-flag-button"
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  //onlyCountries={['ae', 'in', 'us', 'gb', ...]}  // restrict to your allowed countries
                  preferredCountries={["ae", "in"]} // show these at top
                />
              </div>

              {errors.businessPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.businessPhone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PhoneInput
                  country={"us"}
                  value={formData.alternatePhone}
                  onChange={(value, country) => {
                    setFormData((prev) => ({ ...prev, alternatePhone: value }));
                    clearError("businessPhone");
                    // Optionally store country data if needed later
                  }}
                  inputProps={{
                    name: "alternatePhone",
                    id: "alternatePhone",
                    required: true,
                  }}
                  containerClass="phone-input-container" // optional custom class
                  //inputClass="!pl-12" // adjust padding for the flag button
                  buttonClass="phone-flag-button"
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  //onlyCountries={['ae', 'in', 'us', 'gb', ...]}  // restrict to your allowed countries
                  preferredCountries={["ae", "in"]} // show these at top
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="businessAddress">
                Business Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      businessAddress: e.target.value,
                    }));
                    clearError("businessAddress");
                  }}
                  placeholder="Office address, building name, street"
                  className="pl-9"
                />
              </div>
              {errors.businessAddress && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.businessAddress}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    addressLine2: e.target.value,
                  }));
                  clearError("addressLine2");
                }}
                placeholder="Area, landmark (optional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Documents Section - commented out */}
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
              <Label htmlFor="adminFirstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adminFirstName"
                value={formData.adminFirstName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    adminFirstName: e.target.value,
                  }));
                  clearError("adminFirstName");
                }}
                placeholder="Enter first name"
              />
              {errors.adminFirstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminFirstName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="adminLastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adminLastName"
                value={formData.adminLastName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    adminLastName: e.target.value,
                  }));
                  clearError("adminLastName");
                }}
                placeholder="Enter last name"
              />
              {errors.adminLastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminLastName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="adminEmail">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      adminEmail: e.target.value,
                    }));
                    clearError("adminEmail");
                  }}
                  placeholder="admin@company.ae"
                  className="pl-9"
                />
              </div>
              {errors.adminEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.adminEmail}</p>
              )}
            </div>
            <div>
              <Label htmlFor="adminPhone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PhoneInput
                  country={"us"}
                  value={formData.adminPhone}
                  onChange={(value, country) => {
                    setFormData((prev) => ({ ...prev, adminPhone: value }));
                    clearError("adminPhone");
                    // Optionally store country data if needed later
                  }}
                  inputProps={{
                    name: "adminPhone",
                    id: "adminPhone",
                    required: true,
                  }}
                  containerClass="phone-input-container" // optional custom class
                  //inputClass="!pl-12" // adjust padding for the flag button
                  buttonClass="phone-flag-button"
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  //onlyCountries={['ae', 'in', 'us', 'gb', ...]}  // restrict to your allowed countries
                  preferredCountries={["ae", "in"]} // show these at top
                />
              </div>
              {errors.adminPhone && (
                <p className="text-sm text-red-500 mt-1">{errors.adminPhone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="adminDesignation">
                Designation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adminDesignation"
                value={formData.adminDesignation}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    adminDesignation: e.target.value,
                  }));
                  clearError("adminDesignation");
                }}
                placeholder="e.g., Finance Manager, CEO"
              />
              {errors.adminDesignation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminDesignation}
                </p>
              )}
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
              <Label htmlFor="monthlyLimit">
                Monthly Transaction Limit{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, monthlyLimit: value }));
                  clearError("monthlyLimit");
                }}
                placeholder="Enter limit amount"
              />
              {errors.monthlyLimit && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.monthlyLimit}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dealValidityDays">
                Deal Validity Period (Days){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dealValidityDays"
                type="number"
                value={formData.dealValidityDays}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    dealValidityDays: e.target.value,
                  }));
                  clearError("dealValidityDays");
                }}
                placeholder="7"
              />
              {errors.dealValidityDays && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.dealValidityDays}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Number of days a negotiated deal remains valid before expiration
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Supported Currencies <span className="text-red-500">*</span>
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
            {errors.currencies && (
              <p className="text-sm text-red-500 mt-1">{errors.currencies}</p>
            )}
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
        <DialogTrigger asChild>
          {trigger || (
            <Button type="button" variant="default">
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
                onClick={() => {
                  let isValid = false;
                  if (currentStep === 1) isValid = validateStep1();
                  else if (currentStep === 2) isValid = validateStep2();
                  else if (currentStep === 3) isValid = validateStep3();

                  if (isValid) {
                    setCurrentStep((prev) => Math.min(3, prev + 1));
                    setErrors({});
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const step1Valid = validateStep1();
                  const step2Valid = validateStep2();
                  const step3Valid = validateStep3();

                  if (step1Valid && step2Valid && step3Valid) {
                    handleSubmit();
                  } else {
                    if (!step1Valid) setCurrentStep(1);
                    else if (!step2Valid) setCurrentStep(2);
                    else if (!step3Valid) setCurrentStep(3);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Creating...." : "Create Business Account"}
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
