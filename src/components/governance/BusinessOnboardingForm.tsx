import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust path as needed
const BusinessOnboardingForm = ({
  trigger,
  onSuccess,
}: BusinessOnboardingFormProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies.token;
  const currencyCode = cookies.currencyCode;

  const navigate = useNavigate();
  const uuid = useParams();
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocuments, setIdDocuments] = useState<IDDocument[]>([]);

  // const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
  //   "AED",
  // ]);

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    currencyCode ? [currencyCode] : [],
  );

  const [businessTypeData, setBusinessTypeData] = useState([]);
  const [countryOptions, setCountryOptions] = useState<
    { id: number; name: string; currencyCode: string }[]
  >([]);
  const [tab, setTab] = useState("INDIVIDUAL");
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [infoOpen, setInfoOpen] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [kybTypeMappings, setKybTypeMappings] = useState<any[]>([]);
  const [kybLoading, setKybLoading] = useState(false);
  const [uboData, setUboData] = useState([
    {
      uboType: "",
      ownershipPercentage: "",
      fullName: "",
      dateOfBirth: "",
      contactNumber: "",
      address: "",
      email: "",
      organizationName: "",
      phoneNumber: "",
      registrationNumber: "",
      documentData: [
        {
          id: "",
          idType: "",
          expireDate: "",
          issuedCountry: "",
          docs: null,
        },
      ],
    },
  ]);
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
  const [apiErrors, setApiErrors] = useState<any>({});
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
    sendCredential: true,
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
        businessTypeId: Number(formData.businessType),
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
        sendCredential: formData?.sendCredential,
      };

      const admin = {
        firstName: formData.adminFirstName,
        lastName: formData.adminLastName,
        email: formData.adminEmail,
        phoneNumber: formData.adminPhone,
        designation: formData.adminDesignation,
      };
      const uboPayload = uboData?.map((uboItem) => {
        const { documentData, ...rest } = uboItem;
        return {
          ...rest,
          documents: documentData?.map((doc) => ({
            fileKey: doc?.docs?.name,
            documentType: doc?.idType,
            documentNumber: doc?.id,
            issuedCountry: doc?.issuedCountry,
            expiryDate: doc?.expireDate,
          })),
        };
      });
      const apiFormData = new FormData();
      apiFormData.append(
        "business",
        new Blob([JSON.stringify(business)], { type: "application/json" }),
      );
      apiFormData.append(
        "admin",
        new Blob([JSON.stringify(admin)], { type: "application/json" }),
      );

      apiFormData.append(
        "ubos",
        new Blob([JSON.stringify(uboPayload)], { type: "application/json" }),
      );
      uboData?.forEach((uboItem, uboIndex) => {
        uboItem?.documentData?.forEach((doc, docIndex) => {
          if (doc?.docs instanceof File) {
            apiFormData.append("documents", doc?.docs);
          }
        });
      });

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
        onSuccess?.();
        setOpen(false);
        setCurrentStep(1);
        setIdDocuments([]);
        // setSelectedCurrencies(["AED"]);
        setSelectedCurrencies(currencyCode ? [currencyCode] : []);
        setUboData([
          {
            uboType: "",
            ownershipPercentage: "",
            fullName: "",
            dateOfBirth: "",
            contactNumber: "",
            address: "",
            email: "",
            organizationName: "",
            phoneNumber: "",
            registrationNumber: "",
            documentData: [
              {
                id: "",
                idType: "",
                expireDate: "",
                issuedCountry: "",
                docs: null,
              },
            ],
          },
        ]);
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
          sendCredential: true,
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
      setApiErrors(error?.response?.data?.data);
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
  const fetchKybTypeMappings = async () => {
    setKybLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/kyb-type-mappings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // The response is an array directly
      setKybTypeMappings(res.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load KYB type mappings",
        variant: "destructive",
      });
    } finally {
      setKybLoading(false);
    }
  };

  const getBusinessType = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/kyb/master/business-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBusinessTypeData(res?.data?.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch business type",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (infoOpen) {
      fetchKybTypeMappings();
    }
  }, [infoOpen]);

  const fetchCountries = async () => {
    setCountriesLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v3/config/countries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.status === true && Array.isArray(res.data.data)) {
        setCountryOptions(res.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load countries",
        variant: "destructive",
      });
    } finally {
      setCountriesLoading(false);
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
      fetchCountries();
      getBusinessType();
      setErrors({});
      // setSelectedCurrencies(["AED"]);
      setSelectedCurrencies(currencyCode ? [currencyCode] : []);
      setUboData([
        {
          uboType: "",
          ownershipPercentage: "",
          fullName: "",
          dateOfBirth: "",
          contactNumber: "",
          address: "",
          email: "",
          organizationName: "",
          phoneNumber: "",
          registrationNumber: "",
          documentData: [
            {
              id: "",
              idType: "",
              expireDate: "",
              issuedCountry: "",
              docs: null,
            },
          ],
        },
      ]);
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
        sendCredential: true,
      });
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

    uboData.forEach((ubo, uboIndex) => {
      // ================= COMMON =================
      if (!ubo.uboType) {
        newErrors[`ubo_${uboIndex}_uboType`] = "UBO Type is required";
      }

      if (!ubo.ownershipPercentage) {
        newErrors[`ubo_${uboIndex}_ownershipPercentage`] =
          "Ownership % is required";
      } else if (
        +ubo.ownershipPercentage <= 0 ||
        +ubo.ownershipPercentage > 100
      ) {
        newErrors[`ubo_${uboIndex}_ownershipPercentage`] =
          "Must be between 1 and 100";
      }

      if (!ubo.address) {
        newErrors[`ubo_${uboIndex}_address`] = "Address is required";
      }

      // ================= INDIVIDUAL =================
      if (ubo.uboType === "INDIVIDUAL") {
        if (!ubo.fullName) {
          newErrors[`ubo_${uboIndex}_fullName`] = "Full Name is required";
        }

        if (!ubo.dateOfBirth) {
          newErrors[`ubo_${uboIndex}_dateOfBirth`] =
            "Date of Birth is required";
        }

        if (!ubo.contactNumber) {
          newErrors[`ubo_${uboIndex}_contactNumber`] =
            "Contact Number is required";
        }

        if (!ubo.email) {
          newErrors[`ubo_${uboIndex}_email`] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(ubo.email)) {
          newErrors[`ubo_${uboIndex}_email`] = "Invalid email format";
        }
      }

      // ================= ORGANIZATION =================
      if (ubo.uboType === "ORGANIZATION") {
        if (!ubo.organizationName) {
          newErrors[`ubo_${uboIndex}_organizationName`] =
            "Organization Name is required";
        }

        if (!ubo.phoneNumber) {
          newErrors[`ubo_${uboIndex}_phoneNumber`] = "Phone Number is required";
        }

        if (!ubo.registrationNumber) {
          newErrors[`ubo_${uboIndex}_registrationNumber`] =
            "Registration Number is required";
        }
      }

      // ================= DOCUMENT VALIDATION =================
      ubo.documentData.forEach((doc, docIndex) => {
        if (!doc.id) {
          newErrors[`ubo_${uboIndex}_doc_${docIndex}_id`] =
            "Document ID is required";
        }

        if (!doc.idType) {
          newErrors[`ubo_${uboIndex}_doc_${docIndex}_idType`] =
            "ID Type is required";
        }

        if (!doc.expireDate) {
          newErrors[`ubo_${uboIndex}_doc_${docIndex}_expireDate`] =
            "Expire Date is required";
        }

        if (!doc.issuedCountry) {
          newErrors[`ubo_${uboIndex}_doc_${docIndex}_issuedCountry`] =
            "Issued Country is required";
        }

        if (!doc.docs) {
          newErrors[`ubo_${uboIndex}_doc_${docIndex}_docs`] =
            "Document file is required";
        }
      });
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.monthlyLimit) {
      newErrors.monthlyLimit = "Monthly limit is required";
    } else if (Number(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
    }

    if (!formData.dealValidityDays) {
      newErrors.dealValidityDays = "Deal validity hours is required";
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
      {[1, 2, 3, 4].map((step) => (
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
          {step < 4 && (
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

  // ================= UBO HANDLERS =================

  const handleUboChange = (index, field, value) => {
    const updated = structuredClone(uboData);
    updated[index][field] = value;
    setUboData(updated);
    clearError(`ubo_${index}_${field}`);
  };

  const handleTypeChange = (index, value) => {
    const updated = structuredClone(uboData);
    clearError(`ubo_${index}_uboType`);
    updated[index] = {
      ...updated[index],
      uboType: value,
      fullName: "",
      dateOfBirth: "",
      contactNumber: "",
      email: "",
      organizationName: "",
      phoneNumber: "",
      registrationNumber: "",
      documentData: [
        {
          id: "",
          idType: "",
          expireDate: "",
          issuedCountry: "",
          docs: null,
        },
      ],
    };

    setUboData(updated);
  };

  const addUbo = () => {
    setUboData((prev) => [
      ...prev,
      {
        uboType: "",
        ownershipPercentage: "",
        fullName: "",
        dateOfBirth: "",
        contactNumber: "",
        address: "",
        email: "",
        organizationName: "",
        phoneNumber: "",
        registrationNumber: "",
        documentData: [
          {
            id: "",
            idType: "",
            expireDate: "",
            issuedCountry: "",
            docs: null,
          },
        ],
      },
    ]);
  };

  const removeUbo = (index) => {
    const updated = [...uboData];
    updated.splice(index, 1);
    setUboData(updated);
  };

  // ================= DOCUMENT HANDLERS =================

  const handleDocumentChange = (uboIndex, docIndex, field, value) => {
    const updated = structuredClone(uboData);
    updated[uboIndex].documentData[docIndex][field] = value;
    setUboData(updated);
    clearError(`ubo_${uboIndex}_doc_${docIndex}_${field}`);
  };

  const addDocument = (uboIndex) => {
    const updated = structuredClone(uboData);

    updated[uboIndex].documentData.push({
      id: "",
      idType: "",
      expireDate: "",
      issuedCountry: "",
      docs: null,
    });
    setUboData(updated);
  };

  const removeDocument = (uboIndex, docIndex) => {
    const updated = structuredClone(uboData);
    updated[uboIndex].documentData.splice(docIndex, 1);
    setUboData(updated);
  };

  const mappedBusinessType = businessTypeData?.filter(
    (b) => b?.mapped === true,
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    companyName: "",
                  }));
                }}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.companyName}
                </p>
              )}
              {apiErrors?.companyName && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.companyName}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    legalForm: "",
                  }));
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
              {apiErrors?.legalForm && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors.legalForm}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="businessType" className="mb-0">
                  Type of Business <span className="text-red-500">*</span>
                </Label>
                {/*<Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full"
                  onClick={() => setInfoOpen(true)}
                >
                  <Info className="h-4 w-4 text-green-600" />
                </Button>*/}
              </div>
              <Select
                value={formData.businessType}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, businessType: value }));
                  clearError("businessType");
                  setApiErrors((prev: any) => ({
                    ...prev,
                    businessTypeId: "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {mappedBusinessType?.map((type) => (
                    <SelectItem key={type?.id} value={type?.id}>
                      {type?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.businessType}
                </p>
              )}
              {apiErrors?.businessTypeId && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.businessTypeId}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    tradeLicense: "",
                  }));
                }}
                placeholder="TL-XXXXXX"
              />
              {errors.tradeLicense && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tradeLicense}
                </p>
              )}
              {apiErrors?.tradeLicense && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.tradeLicense}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    taxNumber: "",
                  }));
                }}
                placeholder="TAX-XXXXXX"
              />
              {errors.taxNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.taxNumber}</p>
              )}
              {apiErrors?.taxNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.taxNumber}
                </p>
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
                        {countryOptions.map((country) => {
                          const isSelected = formData.countryName.includes(
                            country.name,
                          );
                          return (
                            <CommandItem
                              key={country.id}
                              onSelect={() => {
                                setFormData((prev) => {
                                  const newCountries = isSelected
                                    ? prev.countryName.filter(
                                        (c) => c !== country.name,
                                      )
                                    : [...prev.countryName, country.name];
                                  return { ...prev, countryName: newCountries };
                                });
                                clearError("countryName");
                                setApiErrors((prev) => ({
                                  ...prev,
                                  countryName: "",
                                }));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {country.name}
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
              {apiErrors?.countryName && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.countryName}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    branchId: "",
                  }));
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
              {apiErrors?.branchId && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors.branchId}
                </p>
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
                    setApiErrors((prev: any) => ({
                      ...prev,
                      businessEmail: "",
                    }));
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
              {apiErrors?.businessEmail && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.businessEmail}
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
                    setApiErrors((prev: any) => ({
                      ...prev,
                      businessPhone: "",
                    }));
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
              {apiErrors?.businessPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.businessPhone}
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
                    clearError("alternatePhone");
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
                    setApiErrors((prev: any) => ({
                      ...prev,
                      businessAddress: "",
                    }));
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
              {apiErrors?.businessAddress && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.businessAddress}
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
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData?.sendCredential}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      sendCredential: checked === true,
                    }))
                  }
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Send Credentail to Business Email
                </Label>
              </div>
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    adminFirstName: "",
                  }));
                }}
                placeholder="Enter first name"
              />
              {errors.adminFirstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminFirstName}
                </p>
              )}
              {apiErrors?.adminFirstName && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.adminFirstName}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    adminLastName: "",
                  }));
                }}
                placeholder="Enter last name"
              />
              {errors.adminLastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminLastName}
                </p>
              )}
              {apiErrors?.adminLastName && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.adminLastName}
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
                    setApiErrors((prev: any) => ({
                      ...prev,
                      adminEmail: "",
                    }));
                  }}
                  placeholder="admin@company.ae"
                  className="pl-9"
                />
              </div>
              {errors.adminEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.adminEmail}</p>
              )}
              {apiErrors?.adminEmail && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.adminEmail}
                </p>
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
                    setApiErrors((prev: any) => ({
                      ...prev,
                      adminPhone: "",
                    }));
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
              {apiErrors?.adminPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.adminPhone}
                </p>
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    adminDesignation: "",
                  }));
                }}
                placeholder="e.g., Finance Manager, CEO"
              />
              {errors.adminDesignation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.adminDesignation}
                </p>
              )}
              {apiErrors?.adminDesignation && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.adminDesignation}
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
      {uboData.map((item, index) => (
        <div key={index} className="border p-5 rounded-xl space-y-4 shadow-sm">
          {/* UBO TYPE */}
          <div className="space-y-1">
            <Label htmlFor="uboType">
              UBO Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={item.uboType}
              onValueChange={(val) => handleTypeChange(index, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
              </SelectContent>
            </Select>
            {errors[`ubo_${index}_uboType`] && (
              <p className="text-red-500 text-xs">
                {errors[`ubo_${index}_uboType`]}
              </p>
            )}
          </div>

          {/* COMMON */}
          <div className="space-y-1">
            <Label htmlFor="ownershipPercentage">
              Ownership Percentage <span className="text-red-500">*</span>
            </Label>
            <Input
              onWheel={(e) => e.currentTarget.blur()}
              id="ownershipPercentage"
              placeholder="Ownership Percentage"
              type="number"
              value={item.ownershipPercentage}
              onChange={(e) =>
                handleUboChange(index, "ownershipPercentage", e.target.value)
              }
            />
            {errors[`ubo_${index}_ownershipPercentage`] && (
              <p className="text-red-500 text-xs">
                {errors[`ubo_${index}_ownershipPercentage`]}
              </p>
            )}
          </div>

          {/* INDIVIDUAL */}
          {item.uboType === "INDIVIDUAL" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  value={item.fullName}
                  onChange={(e) =>
                    handleUboChange(index, "fullName", e.target.value)
                  }
                />
                {errors[`ubo_${index}_fullName`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_fullName`]}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth">
                  Date Of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={item.dateOfBirth}
                  onChange={(e) =>
                    handleUboChange(index, "dateOfBirth", e.target.value)
                  }
                />

                {errors[`ubo_${index}_dateOfBirth`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_dateOfBirth`]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactNumber">
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <PhoneInput
                    country={"us"}
                    value={item.contactNumber}
                    onChange={(value) => {
                      handleUboChange(index, "contactNumber", value);
                      clearError("adminPhone");
                      setApiErrors((prev: any) => ({
                        ...prev,
                        adminPhone: "",
                      }));
                      // Optionally store country data if needed later
                    }}
                    inputProps={{
                      name: "contactNumber",
                      id: "contactNumber",
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
                {errors[`ubo_${index}_contactNumber`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_contactNumber`]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Email"
                  value={item.email}
                  onChange={(e) =>
                    handleUboChange(index, "email", e.target.value)
                  }
                />
                {errors[`ubo_${index}_email`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_email`]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ORGANIZATION */}
          {item.uboType === "ORGANIZATION" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="organizationName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="organizationName"
                  placeholder="Organization Name"
                  value={item.organizationName}
                  onChange={(e) =>
                    handleUboChange(index, "organizationName", e.target.value)
                  }
                />
                {errors[`ubo_${index}_organizationName`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_organizationName`]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <PhoneInput
                    country={"us"}
                    value={item.phoneNumber}
                    onChange={(value) => {
                      handleUboChange(index, "phoneNumber", value);
                      // Optionally store country data if needed later
                    }}
                    inputProps={{
                      name: "phoneNumber",
                      id: "phoneNumber",
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

                {errors[`ubo_${index}_phoneNumber`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_phoneNumber`]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="registrationNumber">
                  Registration Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registrationNumber"
                  placeholder="Registration Number"
                  value={item.registrationNumber}
                  onChange={(e) =>
                    handleUboChange(index, "registrationNumber", e.target.value)
                  }
                />
                {errors[`ubo_${index}_registrationNumber`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ubo_${index}_registrationNumber`]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ADDRESS */}
          <div className="space-y-1">
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Address"
              value={item.address}
              onChange={(e) =>
                handleUboChange(index, "address", e.target.value)
              }
            />
            {errors[`ubo_${index}_address`] && (
              <p className="text-red-500 text-xs">
                {errors[`ubo_${index}_address`]}
              </p>
            )}
          </div>

          {/* ================= DOCUMENT SECTION ================= */}
          <div>
            <Label className="text-base font-semibold">Documents</Label>

            {item.documentData.map((doc, docIndex) => (
              <div
                key={docIndex}
                className="border p-3 rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <Label htmlFor="id">
                    Document Id <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="id"
                    placeholder="Document ID"
                    value={doc.id}
                    onChange={(e) =>
                      handleDocumentChange(
                        index,
                        docIndex,
                        "id",
                        e.target.value,
                      )
                    }
                  />
                  {errors[`ubo_${index}_doc_${docIndex}_id`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_${index}_doc_${docIndex}_id`]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="idType">
                    Document Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={doc.idType}
                    onValueChange={(value) =>
                      handleDocumentChange(index, docIndex, "idType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="ID_COPY">Id Copy</SelectItem>
                      <SelectItem value=" ADDRESS_PROOF">
                        Address Proof
                      </SelectItem>
                      <SelectItem value="SOURCE_OF_FUNDS">
                        Source Of Funds
                      </SelectItem>
                      <SelectItem value=" TRADE_LICENSE">
                        Trade License
                      </SelectItem>
                      <SelectItem value="COMPANY_REGISTRATION">
                        Company Registration
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`ubo_${index}_doc_${docIndex}_idType`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_${index}_doc_${docIndex}_idType`]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="expireDate">
                    Expire Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expireDate"
                    type="date"
                    value={doc.expireDate}
                    onChange={(e) =>
                      handleDocumentChange(
                        index,
                        docIndex,
                        "expireDate",
                        e.target.value,
                      )
                    }
                  />
                  {errors[`ubo_${index}_doc_${docIndex}_expireDate`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_${index}_doc_${docIndex}_expireDate`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="issuedCountry">
                    Issued Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="issuedCountry"
                    placeholder="Issued Country"
                    value={doc.issuedCountry}
                    onChange={(e) =>
                      handleDocumentChange(
                        index,
                        docIndex,
                        "issuedCountry",
                        e.target.value,
                      )
                    }
                  />
                  {errors[`ubo_${index}_doc_${docIndex}_issuedCountry`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_${index}_doc_${docIndex}_issuedCountry`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="docs">
                    Upload Documents <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="docs"
                    type="file"
                    onChange={(e) =>
                      handleDocumentChange(
                        index,
                        docIndex,
                        "docs",
                        e.target.files?.[0],
                      )
                    }
                  />
                  {errors[`ubo_${index}_doc_${docIndex}_docs`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_${index}_doc_${docIndex}_docs`]}
                    </p>
                  )}
                </div>

                {item.documentData.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeDocument(index, docIndex)}
                  >
                    Remove Doc
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => addDocument(index)}
            >
              + Add Document
            </Button>
          </div>

          {/* REMOVE UBO */}
          {uboData.length > 1 && (
            <Button variant="destructive" onClick={() => removeUbo(index)}>
              Remove UBO
            </Button>
          )}
        </div>
      ))}

      {/* ADD UBO */}
      <Button onClick={addUbo}>+ Add UBO</Button>
    </div>
  );

  const renderStep4 = () => (
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    monthlyLimit: "",
                  }));
                }}
                placeholder="Enter limit amount"
              />
              {errors.monthlyLimit && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.monthlyLimit}
                </p>
              )}
              {apiErrors?.monthlyLimit && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.monthlyLimit}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dealValidityDays">
                Deal Validity Period (Hours){" "}
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
                  setApiErrors((prev: any) => ({
                    ...prev,
                    dealValidityDays: "",
                  }));
                }}
                placeholder="7"
              />
              {errors.dealValidityDays && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.dealValidityDays}
                </p>
              )}
              {apiErrors?.dealValidityDays && (
                <p className="text-sm text-red-500 mt-1">
                  {apiErrors?.dealValidityDays}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Number of hours a negotiated deal remains valid before
                expiration
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
                {businessTypeData?.find((t) => t?.id === formData.businessType)
                  ?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Country of Trade</p>
              <p className="font-medium">{formData.countryName || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Branch</p>
              <p className="font-medium">
                {branchList?.find(
                  (branch) => branch?.branchId == formData?.branchId,
                )?.name || "-"}
              </p>
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
          {currentStep === 4 && renderStep4()}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={() => {
                  let isValid = false;
                  if (currentStep === 1) isValid = validateStep1();
                  else if (currentStep === 2) isValid = validateStep2();
                  else if (currentStep === 3) isValid = validateStep3();
                  else if (currentStep === 4) isValid = validateStep4();

                  if (isValid) {
                    setCurrentStep((prev) => Math.min(4, prev + 1));
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
                  const step4Valid = validateStep4();
                  if (
                    step1Valid &&
                    step2Valid &&
                    step3Valid &&
                    step3Valid &&
                    step4Valid
                  ) {
                    handleSubmit();
                  } else {
                    if (!step1Valid) setCurrentStep(1);
                    else if (!step2Valid) setCurrentStep(2);
                    else if (!step3Valid) setCurrentStep(3);
                    else if (!step4Valid) setCurrentStep(4);
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

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Business Type Descriptions</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            {kybLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Type</TableHead>
                    <TableHead>KYB Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kybTypeMappings
                    .slice() // create a copy to avoid mutating state
                    .sort((a, b) =>
                      a.businessType.localeCompare(b.businessType),
                    )
                    .map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell className="font-medium">
                          {mapping.businessType}
                        </TableCell>
                        <TableCell>{mapping.kybType}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessOnboardingForm;
