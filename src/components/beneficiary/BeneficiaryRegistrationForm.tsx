import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  Banknote,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  CalendarIcon,
  Globe,
  CreditCard,
  Wallet,
  Info,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner"; // Assuming sonner for notifications
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

const BeneficiaryRegistrationForm = ({
  onSuccess,
  setView,
}: {
  onSuccess: () => void;
  setView: (arg: "list" | "profile" | "register") => void;
}) => {
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;
  // Form & UI States
  const [loading, setLoading] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<
    "individual" | "business"
  >("individual");
  const [residencyType, setResidencyType] = useState<"uae" | "foreign">(
    "foreign",
  );
  const [beneficiaryCountry, setBeneficiaryCountry] = useState("");
  const [payoutMechanism, setPayoutMechanism] = useState<
    "bank_account" | "wallet"
  >("bank_account");
  const [selectedBank, setSelectedBank] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [beneficiariesCountries, setBeneficiariesCountries] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [incorporationDate, setIncorporationDate] = useState<Date | undefined>(
    undefined,
  );
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const idFileInputRef = useRef<HTMLInputElement>(null);
  const addressFileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      // Optional: upload immediately or store for later
    }
  };
  // Input States for API
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    registrationNumber: "",
    businessType: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    accountNumber: "",
    iban: "",
    accountHolderName: "",
    bankAddress: "",
    walletId: "",
    dateOfBirth: "",
    incorporationDate: "",
    relationshipType: "",
    purpose: "",
    expectedMonthlyVolume: "",
    expectedFrequency: "",

    correspondentBankName: "",
    correspondentSwift: "",
    correspondentAccountNumber: "",
    correspondentBankAddress: "",
  });
  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    // Basic common fields
    if (!formData.email.trim()) newErrors.email = ["Email is required"];
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = ["Phone number is required"];
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = ["Address line 1 is required"];
    if (!formData.city.trim()) newErrors.city = ["City is required"];

    // Beneficiary type specific
    if (beneficiaryType === "individual") {
      if (!formData.firstName.trim())
        newErrors.firstName = ["First name is required"];
      if (!formData.lastName.trim())
        newErrors.lastName = ["Last name is required"];
      if (!formData.nationality.trim())
        newErrors.nationality = ["Nationality is required"];
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = ["Date of birth is required"];
    } else {
      if (!formData.companyName.trim())
        newErrors.companyName = ["Company name is required"];
      if (!formData.registrationNumber.trim())
        newErrors.registrationNumber = ["Registration number is required"];
      if (!formData.businessType.trim())
        newErrors.businessType = ["Business type is required"];
    }

    // Residency / country
    if (residencyType === "foreign") {
      if (!beneficiaryCountry)
        newErrors.beneficiaryCountry = ["Beneficiary country is required"];
    }

    // Payout mechanism
    if (!beneficiaryCountry && residencyType !== "uae") {
      // wait until country is selected
    } else {
      if (!payoutMechanism) {
        newErrors.payoutMechanism = ["Please select a payout mechanism"];
      } else {
        if (payoutMechanism === "bank_account") {
          if (!selectedBank) newErrors.selectedBank = ["Bank is required"];
          if (!formData.accountNumber.trim())
            newErrors.accountNumber = ["Account number is required"];
          if (!formData.accountHolderName.trim())
            newErrors.accountHolderName = ["Account holder name is required"];
          if (!formData.bankAddress.trim())
            newErrors.bankAddress = ["Bank address is required"];
        } else if (payoutMechanism === "wallet") {
          if (!walletProvider)
            newErrors.walletProvider = ["Wallet provider is required"];
          if (!formData.walletId.trim())
            newErrors.walletId = ["Wallet ID is required"];
        }
      }
    }

    // Relationship
    if (!formData.relationshipType)
      newErrors.relationshipType = ["Relationship type is required"];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    clearFieldError(e.target.id);
  };

  // Mock data - would come from Core API
  const payoutDestinations = [
    {
      country: "India",
      code: "IN",
      id: 2,
      supported: true,
      exchangeRate: "22.45",
      fees: "5.00",
      currency: "INR",
    },
    {
      country: "Philippines",
      code: "PH",
      id: 3,
      supported: true,
      exchangeRate: "3.67",
      fees: "3.50",
      currency: "PHP",
    },
    {
      country: "Pakistan",
      code: "PK",
      id: 4,
      supported: true,
      exchangeRate: "84.50",
      fees: "4.00",
      currency: "PKR",
    },
    {
      country: "Bangladesh",
      code: "BD",
      id: 5,
      supported: true,
      exchangeRate: "29.75",
      fees: "3.00",
      currency: "BDT",
    },
    {
      country: "Sri Lanka",
      code: "LK",
      id: 6,
      supported: true,
      exchangeRate: "109.25",
      fees: "6.00",
      currency: "LKR",
    },
    {
      country: "Nepal",
      code: "NP",
      id: 7,
      supported: true,
      exchangeRate: "36.15",
      fees: "4.50",
      currency: "NPR",
    },
    {
      country: "United Arab Emirates",
      code: "AE",
      id: 1,
      supported: true,
      exchangeRate: "1.00",
      fees: "2.00",
      currency: "AED",
    },
  ];

  const uaeBanks = [
    { name: "Emirates NBD", code: "EBILAEAD", country: "AE" },
    { name: "First Abu Dhabi Bank (FAB)", code: "NBADAEAD", country: "AE" },
    {
      name: "Abu Dhabi Commercial Bank (ADCB)",
      code: "ADCBAEAD",
      country: "AE",
    },
    { name: "Dubai Islamic Bank", code: "DUIBAEAD", country: "AE" },
    { name: "Mashreq Bank", code: "BOMLAEAD", country: "AE" },
    { name: "HSBC UAE", code: "BBMEAEAD", country: "AE" },
  ];

  const internationalBanks = [
    { name: "State Bank of India", code: "SBININBB", country: "IN" },
    { name: "HDFC Bank", code: "HDFCINBB", country: "IN" },
    { name: "Bank of the Philippine Islands", code: "BOPIPHMM", country: "PH" },
    { name: "Metrobank", code: "MBTCPHMM", country: "PH" },
    { name: "Habib Bank Limited", code: "HABBPKKA", country: "PK" },
    { name: "MCB Bank", code: "MCBLPKKA", country: "PK" },
  ];

  const walletProviders = [
    { name: "Paymi UAE", country: "AE", type: "Digital Wallet" },
    { name: "Paymi India", country: "IN", type: "Digital Wallet" },
    { name: "GCash", country: "PH", type: "Mobile Wallet" },
    { name: "PayMaya", country: "PH", type: "Digital Wallet" },
    { name: "bKash", country: "BD", type: "Mobile Banking" },
    { name: "Nagad", country: "BD", type: "Digital Payment" },
  ];

  // const getAvailableBanks = () => {
  //   if (!beneficiaryCountry) return [];
  //   if (beneficiaryCountry === "AE") return uaeBanks;
  //   return internationalBanks.filter(
  //     (bank) => bank?.country === beneficiaryCountry,
  //   );
  // };

  const getAvailableBanks = () => {
    if (!beneficiaryCountry) return [];
    if (beneficiaryCountry === "AE") return uaeBanks;
    return internationalBanks;
  };

  const getAvailableWallets = () => {
    if (!beneficiaryCountry) return [];
    return walletProviders.filter(
      (wallet) => wallet.country === beneficiaryCountry,
    );
  };

  const getExchangeInfo = () => {
    return payoutDestinations.find((dest) => dest.code === beneficiaryCountry);
  };

  const getSelectedBankDetails = () => {
    return [...uaeBanks, ...internationalBanks].find(
      (bank) => bank.name === selectedBank,
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    // 1. Log the final URL to ensure it's correct
    const fullUrl = `${BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/"}api/v1/beneficiaries`;

    // const countryObj = payoutDestinations.find(
    //   (d) => d.code === (residencyType === "uae" ? "AE" : beneficiaryCountry),
    // );

    const payload: any = {
      name:
        beneficiaryType === "individual"
          ? `${formData.firstName} ${formData.lastName}`
          : formData.companyName,
      type: beneficiaryType.toUpperCase(),
      countryId: beneficiaryCountry == "AE" ? 1 : beneficiaryCountry,
      relationshipType: formData.relationshipType.toUpperCase() || "OTHER",
      purpose: formData.purpose,
      expectedMonthlyVolume: Number(formData.expectedMonthlyVolume) || 0,
      expectedFrequency: formData.expectedFrequency.toUpperCase() || "MONTHLY",
      payoutMethod:
        payoutMechanism === "bank_account" ? "BANK_TRANSFER" : "WALLET",
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      addressCountryId: beneficiaryCountry == "AE" ? 1 : beneficiaryCountry,
    };

    if (beneficiaryType === "individual") {
      payload.firstName = formData.firstName;
      payload.lastName = formData.lastName;
      payload.nationality = formData.nationality;
      payload.dateOfBirth = formData.dateOfBirth;
    } else {
      payload.companyName = formData.companyName;
      payload.registrationNumber = formData.registrationNumber;
      payload.businessType = formData.businessType;
      payload.incorporationDate = formData.incorporationDate;
    }

    if (payoutMechanism === "bank_account") {
      payload.bankName = selectedBank;
      payload.accountNumber = formData.accountNumber;
      payload.iban = formData.iban;
      payload.swiftCode = getSelectedBankDetails()?.code || "";
      payload.accountHolderName = formData.accountHolderName;
      payload.bankAddress = formData.bankAddress;
      payload.correspondentBankName = formData.correspondentBankName;
      payload.correspondentSwift = formData.correspondentSwift;
      payload.correspondentAccountNumber = formData.correspondentAccountNumber;
      payload.correspondentBankAddress = formData.correspondentBankAddress;
    } else {
      payload.bankName = walletProvider;
      payload.accountNumber = formData.walletId;
      payload.iban = "";
      payload.swiftCode = "";
      payload.accountHolderName = formData.accountHolderName;
      payload.bankAddress = "";
    }

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is actually okay (200-299)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server responded with ${response.status}`,
        );
      }

      const result = await response.json();
      if (result.status || response.ok) {
        toast.success(result.message || "Beneficiary registered successfully!");
      } else {
        toast.error(result.message || "Failed to register beneficiary");
      }
      onSuccess();
      setView("list");
    } catch (error: any) {
      // This will now show the actual error message in the toast
      toast.error(
        error.message === "Failed to fetch"
          ? "Network error: Cannot reach server. Check CORS or URL."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const getBeneficiaryCountry = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config/beneficiary/enabled`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setBeneficiariesCountries(json);
    } catch (error) {
      const msg = error.message || "Failed to load payout config";
      toast.error(msg);
    }
  };
  useEffect(() => {
    getBeneficiaryCountry();
  }, []);
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Register New Beneficiary
        </h2>
        <p className="text-muted-foreground">
          Complete all required information for beneficiary registration and
          verification
        </p>
      </div>

      {/* Beneficiary Type & Residency Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiary Type */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Beneficiary Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  beneficiaryType === "individual"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setBeneficiaryType("individual")}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Individual
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Personal recipient
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  beneficiaryType === "business"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setBeneficiaryType("business")}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Building className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Business</h3>
                    <p className="text-sm text-muted-foreground">
                      Corporate entity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Residency Type */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Residency Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  residencyType === "uae"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setResidencyType("uae");
                  setBeneficiaryCountry("AE");
                }}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">UAE</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      UAE Resident
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Local transfers
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  residencyType === "foreign"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setResidencyType("foreign");
                  setBeneficiaryCountry("");
                }}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Foreign Country
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      International transfers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Selection & Exchange Rate Info */}
      {residencyType === "foreign" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Country & Exchange Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="country">
                  Beneficiary Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={beneficiaryCountry}
                  onValueChange={(value) => {
                    setBeneficiaryCountry(value);
                    clearFieldError("beneficiaryCountry");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {beneficiariesCountries?.data
                      .filter((dest: any) => dest?.payoutCurrency !== "AED")
                      .map((country: any) => (
                        <SelectItem key={country?.id} value={country?.id}>
                          {country?.countryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.beneficiaryCountry?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>

              {beneficiaryCountry && getExchangeInfo() && (
                <div className="md:col-span-2">
                  <div className="bg-accent-muted/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-medium text-foreground">
                        Current Exchange Rate & Fees
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Exchange Rate:
                        </span>
                        <p className="font-medium">
                          1 AED = {getExchangeInfo()?.exchangeRate}{" "}
                          {getExchangeInfo()?.currency}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Transfer Fee:
                        </span>
                        <p className="font-medium">
                          AED {getExchangeInfo()?.fees}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      *Rates are indicative and may vary at the time of
                      transaction
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {beneficiaryType === "individual" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />

                {errors.firstName?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
                {errors.lastName?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                {/*<Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        setDateOfBirth(date);
                        if (date) {
                          setFormData({
                            ...formData,
                            dateOfBirth: format(date, "yyyy-MM-dd"),
                          });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>*/}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        setDateOfBirth(date);
                        if (date) {
                          setFormData({
                            ...formData,
                            dateOfBirth: format(date, "yyyy-MM-dd"),
                          });
                        }
                        clearFieldError("dateOfBirth");
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">
                  Nationality <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Enter nationality"
                />
                {errors.nationality?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
                {errors.companyName?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Enter registration number"
                />
                {errors.registration?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Business Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="e.g., Trading, Manufacturing, Services"
                />
                {errors.businessType?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">Incorporation Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !incorporationDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {incorporationDate ? (
                        format(incorporationDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={incorporationDate}
                      onSelect={(date) => {
                        setIncorporationDate(date);
                        if (date) {
                          setFormData({
                            ...formData,
                            incorporationDate: format(date, "yyyy-MM-dd"),
                          });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter email address"
                />
                {errors.email?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive mt-1">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <PhoneInput
                    country={"us"}
                    value={formData.phoneNumber}
                    onChange={(value, country) => {
                      setFormData((prev) => ({ ...prev, phoneNumber: value }));
                      clearFieldError("phoneNumber");

                      // Optionally store country data if needed later
                    }}
                    inputProps={{
                      name: "phone",
                      id: "phone",
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
                  {errors.phoneNumber?.map((msg, i) => (
                    <p key={i} className="text-sm text-destructive mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="Street address, building name, etc."
            />
            {errors.addressLine1?.map((msg, i) => (
              <p key={i} className="text-sm text-destructive mt-1">
                {msg}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              {errors.city?.map((msg, i) => (
                <p key={i} className="text-sm text-destructive mt-1">
                  {msg}
                </p>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state/province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                value={
                  residencyType === "uae"
                    ? "United Arab Emirates"
                    : beneficiaryCountry
                      ? payoutDestinations.find(
                          (d) => d.code === beneficiaryCountry,
                        )?.country
                      : ""
                }
                disabled
                placeholder="Select country from residency section above"
              />
              {errors.country?.map((msg, i) => (
                <p key={i} className="text-sm text-destructive mt-1">
                  {msg}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Mechanism Selection */}
      {(beneficiaryCountry || residencyType === "uae") && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payout Mechanism
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  payoutMechanism === "bank_account"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                } ${getAvailableBanks().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  getAvailableBanks().length > 0 &&
                  setPayoutMechanism("bank_account")
                }
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Banknote className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Bank Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getAvailableBanks().length > 0
                        ? "Direct bank transfer"
                        : "Not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  payoutMechanism === "wallet"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                } ${getAvailableWallets().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  getAvailableWallets().length > 0 &&
                  setPayoutMechanism("wallet")
                }
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Wallet className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Digital Wallet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getAvailableWallets().length > 0
                        ? "Mobile/digital wallet"
                        : "Not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bank Account Details */}
            {payoutMechanism === "bank_account" && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-foreground">
                    Bank Account Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Select Bank <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedBank}
                        onValueChange={(value) => {
                          setSelectedBank(value);
                          clearFieldError("selectedBank");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          {getAvailableBanks()?.map((bank) => (
                            <SelectItem key={bank?.name} value={bank?.name}>
                              {bank?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.selectedBank?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>

                    {selectedBank && getSelectedBankDetails() && (
                      <div className="space-y-2">
                        <Label>SWIFT/BIC Code</Label>
                        <Input
                          value={getSelectedBankDetails()?.code || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">
                        Account Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder={
                          beneficiaryCountry === "AE"
                            ? "033123456789"
                            : "Enter account number"
                        }
                      />
                      {errors.accountNumber?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">
                        Account Holder Name{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                      />
                      {errors.accountHolderName?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                  </div>

                  {(beneficiaryCountry === "AE" || residencyType === "uae") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          value={formData.iban}
                          onChange={handleInputChange}
                          placeholder="AE070331234567890123456"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bankAddress">
                      Bank Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bankAddress"
                      value={formData.bankAddress}
                      onChange={handleInputChange}
                      placeholder="Enter bank branch address"
                    />
                    {errors.bankAddress?.map((msg, i) => (
                      <p key={i} className="text-sm text-destructive mt-1">
                        {msg}
                      </p>
                    ))}
                  </div>

                  {residencyType === "foreign" && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <h5 className="font-medium text-foreground">
                          Correspondent Bank (Optional)
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Required for some international transfers when an
                        intermediary bank is used
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="correspondentBankName">
                            Correspondent Bank Name
                          </Label>
                          <Input
                            id="correspondentBankName"
                            value={formData.correspondentBankName}
                            onChange={handleInputChange}
                            placeholder="Enter correspondent bank name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentSwift">
                            Correspondent SWIFT/BIC
                          </Label>
                          <Input
                            id="correspondentSwift"
                            value={formData.correspondentSwift}
                            onChange={handleInputChange}
                            placeholder="e.g., CITIUS33"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentAccountNumber">
                            Correspondent Account Number
                          </Label>
                          <Input
                            id="correspondentAccountNumber"
                            value={formData.correspondentAccountNumber}
                            onChange={handleInputChange}
                            placeholder="Enter correspondent account number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentBankAddress">
                            Correspondent Bank Address
                          </Label>
                          <Input
                            id="correspondentBankAddress"
                            value={formData.correspondentBankAddress}
                            onChange={handleInputChange}
                            placeholder="Enter correspondent bank address"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Wallet Details */}
            {payoutMechanism === "wallet" && (
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-foreground">
                    Digital Wallet Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Wallet Provider <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={walletProvider}
                        onValueChange={setWalletProvider}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          {getAvailableWallets().map((wallet) => (
                            <SelectItem key={wallet.name} value={wallet.name}>
                              {wallet.name} ({wallet.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.wallet?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletId">
                        Wallet ID/Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="walletId"
                        value={formData.walletId}
                        onChange={handleInputChange}
                        placeholder="Enter wallet ID or phone number"
                      />
                      {errors.walletId?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Purpose and Relationship */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Business Relationship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="relationshipType">
              Relationship Type <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(v) => {
                setFormData({ ...formData, relationshipType: v });
                clearFieldError("relationshipType");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="partner">Business Partner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationshipType?.map((msg, i) => (
              <p key={i} className="text-sm text-destructive mt-1">
                {msg}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Expected Transaction Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the typical purpose of payments to this beneficiary"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedMonthlyVolume">
                Expected Monthly Volume (AED)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedMonthlyVolume"
                  type="number"
                  value={formData.expectedMonthlyVolume}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedFrequency">Expected Frequency</Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, expectedFrequency: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supportive Documents Section (Design Only) */}
      {/* Supportive Documents Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Supportive Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* National ID / Passport */}
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">National ID / Passport</p>
              <p className="text-xs text-muted-foreground text-center">
                Upload a clear copy for verification
              </p>
              <input
                type="file"
                ref={idFileInputRef}
                onChange={(e) => handleFileChange(e, setIdDocument)}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => idFileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              {idDocument && (
                <p className="text-xs text-success truncate max-w-full">
                  Selected: {idDocument.name}
                </p>
              )}
            </div>

            {/* Proof of Address */}
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Proof of Address</p>
              <p className="text-xs text-muted-foreground text-center">
                Utility bill or bank statement
              </p>
              <input
                type="file"
                ref={addressFileInputRef}
                onChange={(e) => handleFileChange(e, setProofOfAddress)}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => addressFileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              {proofOfAddress && (
                <p className="text-xs text-success truncate max-w-full">
                  Selected: {proofOfAddress.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Action */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          {/* <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            I confirm that the information provided is accurate
          </Label> */}
        </div>
        <div className="space-x-4">
          <Button onClick={() => setView("list")} variant="ghost">
            Cancel
          </Button>
          <Button
            className="min-w-[150px]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              "Register Beneficiary"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryRegistrationForm;
