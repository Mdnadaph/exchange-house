import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Building,
  User,
  MapPin,
  Mail,
  Banknote,
  FileText,
  Upload,
  CalendarIcon,
  Globe,
  CreditCard,
  Wallet,
  DollarSign,
  Loader2,
  Plus,
  Minus,
  UserCheck2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SupportedCurrency {
  countryCurrencyId: number;
  currencyCode: string;
}

interface Mechanism {
  payoutMechanismId: number;
  payoutTypeName: string;
  providers: string[];
  supportedCurrencies: SupportedCurrency[];
  requiredFields: string[];
}

interface CountryFormFields {
  countryId: number;
  countryName: string;
  countryCode: string;
  mechanisms: Mechanism[];
}

/** One filled-in entry for the selected mechanism */
interface MechanismEntry {
  id: string;
  payoutMechanismId?: number;
  provider: string;
  currency: string;
  countryCurrencyId?: number;
  fieldValues: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const humanizeField = (field: string) =>
  field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const mechanismIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wallet"))
    return <Wallet className="h-8 w-8 text-primary" />;
  if (lower.includes("bank") || lower.includes("transfer"))
    return <Banknote className="h-8 w-8 text-primary" />;
  return <CreditCard className="h-8 w-8 text-primary" />;
};

const emptyEntry = (): MechanismEntry => ({
  id: uid(),
  provider: "",
  currency: "",
  fieldValues: {},
});

// ─── Component ────────────────────────────────────────────

const BranchBeneficiaryRegistrationForm = ({
  onSuccess,
  setView,
  editData,
}: {
  onSuccess: () => void;
  setView: (arg: "list" | "profile" | "register") => void;
  editData?: any; // pre-populated beneficiary data for edit mode
}) => {
  const isEditMode = !!editData;
  console.log("isEditMode", isEditMode);
  console.log("editData", editData);
  const [cookie] = useCookies(["token", "currencyCode"]);
  const token = cookie.token;
  const currencyCode = cookie?.currencyCode;

  // ── UI / selection states ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<
    "individual" | "business"
  >(editData?.type === "BUSINESS" ? "business" : "individual");
  const [residencyType, setResidencyType] = useState<"uae" | "foreign">(
    "foreign",
  );
  const [beneficiaryCountry, setBeneficiaryCountry] = useState(
    editData?.countryId ? String(editData.countryId) : "",
  );
  const [businessList, setBusinessList] = useState([]);
  const [beneficiariesCountries, setBeneficiariesCountries] =
    useState<any>(null);

  // ── Dynamic form-fields from API ───────────────────────────────────────────
  const [countryFormFields, setCountryFormFields] =
    useState<CountryFormFields | null>(null);
  const [formFieldsLoading, setFormFieldsLoading] = useState(false);

  // ── Mechanism selection + multi-entry state ────────────────────────────────
  const [selectedMechanism, setSelectedMechanism] = useState<Mechanism | null>(
    null,
  );
  const [mechanismEntries, setMechanismEntries] = useState<MechanismEntry[]>([
    emptyEntry(),
  ]);

  // ── Dates ──────────────────────────────────────────────────────────────────
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    editData?.dateOfBirth ? parseISO(editData.dateOfBirth) : undefined,
  );
  const [incorporationDate, setIncorporationDate] = useState<Date | undefined>(
    editData?.incorporationDate
      ? parseISO(editData.incorporationDate)
      : undefined,
  );

  // ── Documents ─────────────────────────────────────────────────────────────
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);
  const addressFileInputRef = useRef<HTMLInputElement>(null);

  // ── Validation errors ──────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // ── Static form fields ─────────────────────────────────────────────────────

  const [formData, setFormData] = useState({
    firstName: editData?.firstName || "",
    lastName: editData?.lastName || "",
    companyName: editData?.companyName || "",
    registrationNumber: editData?.registrationNumber || "",
    businessType: editData?.businessType || "",
    nationality: editData?.nationality || "",
    email: editData?.email || "",
    phoneNumber: editData?.phoneNumber || "",
    addressLine1: editData?.addressLine1 || "",
    addressLine2: editData?.addressLine2 || "",
    city: editData?.city || "",
    state: editData?.state || "",
    postalCode: editData?.postalCode || "",
    dateOfBirth: editData?.dateOfBirth || "",
    incorporationDate: editData?.incorporationDate || "",
    relationshipType: editData?.relationshipType
      ? editData.relationshipType.toLowerCase()
      : "",
    purpose: editData?.purpose || "",
    expectedMonthlyVolume: editData?.expectedMonthlyVolume
      ? String(editData.expectedMonthlyVolume)
      : "",
    expectedFrequency: editData?.expectedFrequency
      ? editData.expectedFrequency.toLowerCase()
      : "",
    businessId: editData?.businessId ? String(editData?.businessId) : "",
  });

  console.log("transa", editData?.businessId);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    clearFieldError(e.target.id);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  // ─── Entry helpers ─────────────────────────────────────────────────────────

  const addEntry = () => setMechanismEntries((prev) => [...prev, emptyEntry()]);

  const removeEntry = (id: string) =>
    setMechanismEntries((prev) => prev.filter((e) => e.id !== id));

  const updateEntry = (id: string, patch: Partial<MechanismEntry>) =>
    setMechanismEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );

  const updateEntryField = (id: string, fieldKey: string, value: string) =>
    setMechanismEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, fieldValues: { ...e.fieldValues, [fieldKey]: value } }
          : e,
      ),
    );

  // Helper: Get countryCurrencyId from currency code for currently selected mechanism
  const getCountryCurrencyId = (currencyCode: string): number | null => {
    if (!selectedMechanism) return null;
    const found = selectedMechanism.supportedCurrencies.find(
      (c) => c.currencyCode === currencyCode,
    );
    return found ? found.countryCurrencyId : null;
  };

  // ─── API: fetch enabled beneficiary countries ──────────────────────────────

  const getBeneficiaryCountry = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config/beneficiary/enabled`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.status !== true || !json.data)
        throw new Error("Unexpected response format");
      setBeneficiariesCountries(json);
    } catch (error: any) {
      toast.error(error.message || "Failed to load payout config");
    }
  };

  // ─── API: fetch form-fields for selected country ───────────────────────────

  const getCountryFormFields = async (countryId: string) => {
    setFormFieldsLoading(true);
    setCountryFormFields(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/beneficiaries/form-fields/${countryId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.status !== true || !json.data)
        throw new Error("Unexpected response");
      const fields: CountryFormFields = json.data;
      setCountryFormFields(fields);

      // ── In edit mode: restore mechanism selection and entries from editData ──
      if (isEditMode && editData?.payoutDetails?.length > 0) {
        // Group payoutDetails by payoutMechanismId — pick the first group's mechanismId
        // to set the selected mechanism (UI supports one mechanism type at a time)
        const firstDetail = editData.payoutDetails[0];
        const matchedMechanism = fields.mechanisms.find(
          (m) => m.payoutMechanismId === firstDetail.payoutMechanismId,
        );
        if (matchedMechanism) {
          setSelectedMechanism(matchedMechanism);
          // Build entries from ALL payoutDetails belonging to this mechanism
          const detailsForMechanism = editData.payoutDetails.filter(
            (d: any) =>
              d.payoutMechanismId === matchedMechanism.payoutMechanismId,
          );
          const restoredEntries: MechanismEntry[] = detailsForMechanism.map(
            (d: any) => ({
              id: uid(),
              payoutMechanismId: d.payoutMechanismId,
              provider: d.providerName || "",
              currency: d.currencyCode || "",
              countryCurrencyId: d.countryCurrencyId,
              fieldValues: d.fieldValues || {},
            }),
          );
          setMechanismEntries(
            restoredEntries.length > 0 ? restoredEntries : [emptyEntry()],
          );
        } else {
          setMechanismEntries([emptyEntry()]);
        }
      } else if (!isEditMode) {
        setSelectedMechanism(null);
        setMechanismEntries([emptyEntry()]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load country form fields");
    } finally {
      setFormFieldsLoading(false);
    }
  };

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    getBeneficiaryCountry();
  }, []);

  useEffect(() => {
    if (beneficiaryCountry) getCountryFormFields(beneficiaryCountry);
  }, [beneficiaryCountry]);

  // ─── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.email.trim()) newErrors.email = ["Email is required"];
    if (!formData?.businessId) newErrors.businessId = ["Business is required"];
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = ["Phone number is required"];
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = ["Address line 1 is required"];
    if (!formData.city.trim()) newErrors.city = ["City is required"];

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

    if (residencyType === "foreign" && !beneficiaryCountry)
      newErrors.beneficiaryCountry = ["Beneficiary country is required"];

    if (!selectedMechanism) {
      newErrors.selectedMechanism = ["Please select a payout mechanism"];
    } else {
      mechanismEntries.forEach((entry, idx) => {
        if (!entry.provider)
          newErrors[`entry_${idx}_provider`] = ["Provider is required"];
        if (!entry.currency)
          newErrors[`entry_${idx}_currency`] = ["Currency is required"];
        selectedMechanism.requiredFields.forEach((field) => {
          if (!entry.fieldValues[field]?.trim())
            newErrors[`entry_${idx}_field_${field}`] = [
              `${humanizeField(field)} is required`,
            ];
        });
      });
    }

    if (!formData.relationshipType)
      newErrors.relationshipType = ["Relationship type is required"];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    // Build payoutDetails — each entry keeps its own payoutMechanismId
    // (which may differ across entries if the user switches mechanisms between entries,
    //  but in normal flow all entries share the selectedMechanism)
    const payoutDetails = mechanismEntries.map((entry) => {
      // Prefer stored countryCurrencyId (edit restore); else derive from currency code
      const countryCurrencyId =
        entry.countryCurrencyId ?? getCountryCurrencyId(entry.currency) ?? 0;

      return {
        payoutMechanismId:
          entry.payoutMechanismId ?? selectedMechanism!.payoutMechanismId,
        providerName: entry.provider,
        countryCurrencyId,
        fieldValues: entry.fieldValues,
      };
    });

    // Convert payoutTypeName to valid enum value
    const payoutMethodEnum = selectedMechanism?.payoutTypeName
      ? selectedMechanism.payoutTypeName.toUpperCase().replace(/\s+/g, "_")
      : "BANK_TRANSFER";

    const payload: any = {
      name:
        beneficiaryType === "individual"
          ? `${formData.firstName} ${formData.lastName}`
          : formData.companyName,
      type: beneficiaryType.toUpperCase(),
      countryId: Number(beneficiaryCountry),
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      incorporationDate: formData.incorporationDate,
      businessType: formData?.businessType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      addressCountryId: Number(beneficiaryCountry),
      relationshipType: formData.relationshipType.toUpperCase() || "OTHER",
      purpose: formData.purpose,
      expectedMonthlyVolume: Number(formData.expectedMonthlyVolume) || 0,
      expectedFrequency: formData.expectedFrequency.toUpperCase() || "MONTHLY",
      payoutMethod: payoutMethodEnum,
      payoutDetails,
      businessId: Number(formData?.businessId),
    };

    // Determine URL and HTTP method based on mode
    const baseUrl = BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/";
    const url = isEditMode
      ? `${baseUrl}api/v1/beneficiaries/${editData.id}`
      : `${baseUrl}api/v1/beneficiaries`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server responded with ${response.status}`,
        );
      }

      const result = await response.json();
      if (result.status || response.ok) {
        toast.success(
          result.message ||
            (isEditMode
              ? "Beneficiary updated successfully!"
              : "Beneficiary registered successfully!"),
        );
      } else {
        toast.error(result.message || "Operation failed");
      }
      onSuccess();
      setView("list");
    } catch (error: any) {
      console.log("ddd", error);
      toast.error(
        error.message === "Failed to fetch"
          ? "Network error: Cannot reach server. Check CORS or URL."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const getBusinessList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v3/business`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res?.data?.status) {
        toast.error(res?.data?.message || "Failed to fetch business");
      }
      setBusinessList(res?.data?.data?.businesses?.items);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch business");
    }
  };

  useEffect(() => {
    getBusinessList();
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {isEditMode ? "Edit Beneficiary" : "Register New Beneficiary"}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the beneficiary information below"
            : "Complete all required information for beneficiary registration and verification"}
        </p>
      </div>

      {/* Beneficiary Type & Residency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Beneficiary Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(["individual", "business"] as const).map((type) => (
                <Card
                  key={type}
                  className={`transition-all ${
                    isEditMode && editData?.type !== type
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer hover:shadow-md"
                  } ${
                    beneficiaryType === type
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => {
                    if (isEditMode && editData?.type !== type) return;
                    setBeneficiaryType(type);
                  }}
                >
                  <CardContent className="p-4 flex items-center space-x-3">
                    {type === "individual" ? (
                      <User className="h-8 w-8 text-primary" />
                    ) : (
                      <Building className="h-8 w-8 text-primary" />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground capitalize">
                        {type}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type === "individual"
                          ? "Personal recipient"
                          : "Corporate entity"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Residency Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                residencyType === "foreign"
                  ? "ring-2 ring-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => {
                setResidencyType("foreign");
                if (!isEditMode) setBeneficiaryCountry("");
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
          </CardContent>
        </Card>
      </div>

      {/* Country Selection */}
      {residencyType === "foreign" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
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
                  {beneficiariesCountries?.data.map((country: any) => (
                    <SelectItem key={country.id} value={String(country.id)}>
                      {country.countryName}
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
          </CardContent>
        </Card>
      )}

      {/* Payout Mechanism */}
      {beneficiaryCountry && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payout Mechanism
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formFieldsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading available payout options…</span>
              </div>
            ) : countryFormFields ? (
              <>
                <div>
                  <p className="text-sm font-medium mb-3">
                    Select Payout Type <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {countryFormFields.mechanisms.map((mechanism) => (
                      <Card
                        key={mechanism.payoutMechanismId}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMechanism?.payoutMechanismId ===
                          mechanism.payoutMechanismId
                            ? "ring-2 ring-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedMechanism(mechanism);
                          // Only reset entries when user manually changes mechanism
                          // (not during edit restore — restore happens in getCountryFormFields)
                          if (
                            !isEditMode ||
                            mechanism.payoutMechanismId !==
                              editData?.payoutDetails?.[0]?.payoutMechanismId
                          ) {
                            setMechanismEntries([emptyEntry()]);
                          }
                          clearFieldError("selectedMechanism");
                        }}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          {mechanismIcon(mechanism.payoutTypeName)}
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {mechanism.payoutTypeName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {mechanism.providers.length} provider
                              {mechanism.providers.length !== 1 ? "s" : ""}{" "}
                              available
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {errors.selectedMechanism?.map((msg, i) => (
                    <p key={i} className="text-sm text-destructive mt-1">
                      {msg}
                    </p>
                  ))}
                </div>

                {selectedMechanism && (
                  <div className="space-y-4">
                    {mechanismEntries.map((entry, idx) => (
                      <Card
                        key={entry.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">
                              {selectedMechanism.payoutTypeName} Details
                              {mechanismEntries.length > 1 && (
                                <span className="ml-2 text-sm text-muted-foreground font-normal">
                                  #{idx + 1}
                                </span>
                              )}
                            </h4>
                            {mechanismEntries.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeEntry(entry.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>
                                Provider <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={entry.provider}
                                onValueChange={(v) => {
                                  updateEntry(entry.id, { provider: v });
                                  clearFieldError(`entry_${idx}_provider`);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border z-50">
                                  {selectedMechanism.providers.map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {p}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`entry_${idx}_provider`]?.map(
                                (msg, i) => (
                                  <p
                                    key={i}
                                    className="text-sm text-destructive mt-1"
                                  >
                                    {msg}
                                  </p>
                                ),
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>
                                Payout Currency{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={entry.currency}
                                onValueChange={(v) => {
                                  // Derive and store countryCurrencyId when currency changes
                                  const found =
                                    selectedMechanism.supportedCurrencies.find(
                                      (c) => c.currencyCode === v,
                                    );
                                  updateEntry(entry.id, {
                                    currency: v,
                                    countryCurrencyId: found?.countryCurrencyId,
                                  });
                                  clearFieldError(`entry_${idx}_currency`);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border z-50">
                                  {selectedMechanism.supportedCurrencies.map(
                                    (c) => (
                                      <SelectItem
                                        key={c.countryCurrencyId}
                                        value={c.currencyCode}
                                      >
                                        {c.currencyCode}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              {errors[`entry_${idx}_currency`]?.map(
                                (msg, i) => (
                                  <p
                                    key={i}
                                    className="text-sm text-destructive mt-1"
                                  >
                                    {msg}
                                  </p>
                                ),
                              )}
                            </div>
                          </div>

                          {selectedMechanism.requiredFields.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-3 text-muted-foreground">
                                Required Fields
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedMechanism.requiredFields.map(
                                  (field) => (
                                    <div key={field} className="space-y-2">
                                      <Label
                                        htmlFor={`entry_${entry.id}_${field}`}
                                      >
                                        {humanizeField(field)}{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id={`entry_${entry.id}_${field}`}
                                        value={entry.fieldValues[field] ?? ""}
                                        onChange={(e) => {
                                          updateEntryField(
                                            entry.id,
                                            field,
                                            e.target.value,
                                          );
                                          clearFieldError(
                                            `entry_${idx}_field_${field}`,
                                          );
                                        }}
                                        placeholder={`Enter ${humanizeField(field).toLowerCase()}`}
                                      />
                                      {errors[
                                        `entry_${idx}_field_${field}`
                                      ]?.map((msg, i) => (
                                        <p
                                          key={i}
                                          className="text-sm text-destructive mt-1"
                                        >
                                          {msg}
                                        </p>
                                      ))}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Show free-form fieldValues from edit data when requiredFields is empty */}
                          {selectedMechanism.requiredFields.length === 0 &&
                            Object.keys(entry.fieldValues).length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-3 text-muted-foreground">
                                  Additional Fields
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.entries(entry.fieldValues).map(
                                    ([key, val]) => (
                                      <div key={key} className="space-y-2">
                                        <Label
                                          htmlFor={`entry_${entry.id}_extra_${key}`}
                                        >
                                          {humanizeField(key)}
                                        </Label>
                                        <Input
                                          id={`entry_${entry.id}_extra_${key}`}
                                          value={val}
                                          onChange={(e) =>
                                            updateEntryField(
                                              entry.id,
                                              key,
                                              e.target.value,
                                            )
                                          }
                                          placeholder={`Enter ${humanizeField(key).toLowerCase()}`}
                                        />
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-primary text-primary hover:bg-primary/5 gap-2"
                      onClick={addEntry}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another {selectedMechanism.payoutTypeName} Account
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payout options found for this country.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck2 className="h-5 w-5 text-primary" />
            Business
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="businessId">
              Business <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData?.businessId || ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  businessId: value,
                });
                clearFieldError("businessId");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {businessList?.map((businessItem: any) => (
                  <SelectItem
                    key={businessItem.id}
                    value={String(businessItem?.id)}
                  >
                    {businessItem?.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.businessId?.map((msg, i) => (
              <p key={i} className="text-sm text-destructive mt-1">
                {msg}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

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

                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData?.dateOfBirth || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      dateOfBirth: e.target.value,
                    });
                    clearFieldError("dateOfBirth");
                  }}
                  min="1900-01-01"
                  max={new Date().toISOString().split("T")[0]}
                />

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
                {errors.registrationNumber?.map((msg, i) => (
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
                <Input
                  id="incorporationDate"
                  type="date"
                  value={formData?.incorporationDate || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      incorporationDate: value,
                    });
                    setIncorporationDate(value ? new Date(value) : undefined);
                  }}
                  min="1900-01-01"
                  max={new Date().toISOString().split("T")[0]}
                />
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
              </div>
              {errors.email?.map((msg, i) => (
                <p key={i} className="text-sm text-destructive mt-1">
                  {msg}
                </p>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <PhoneInput
                country={"us"}
                value={formData.phoneNumber}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, phoneNumber: value }));
                  clearFieldError("phoneNumber");
                }}
                inputProps={{ name: "phone", id: "phone", required: true }}
                enableSearch
                searchPlaceholder="Search country"
                preferredCountries={["ae", "in"]}
              />
              {errors.phoneNumber?.map((msg, i) => (
                <p key={i} className="text-sm text-destructive mt-1">
                  {msg}
                </p>
              ))}
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
              <Label>Country</Label>
              <Input
                value={
                  countryFormFields?.countryName ??
                  (beneficiaryCountry
                    ? `Country ID: ${beneficiaryCountry}`
                    : "")
                }
                disabled
                placeholder="Auto-filled from country selection"
              />
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

      {/* Business Relationship */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Business Relationship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Relationship Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.relationshipType}
              onValueChange={(v) => {
                setFormData({ ...formData, relationshipType: v });
                clearFieldError("relationshipType");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {[
                  "supplier",
                  "employee",
                  "contractor",
                  "vendor",
                  "family",
                  "client",
                  "partner",
                  "other",
                ].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1).replace("_", " ")}
                  </SelectItem>
                ))}
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
                Expected Monthly Volume ({currencyCode})
              </Label>
              <div className="relative">
                {/* <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
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
              <Label>Expected Frequency</Label>
              <Select
                value={formData.expectedFrequency}
                onValueChange={(v) =>
                  setFormData({ ...formData, expectedFrequency: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {["weekly", "monthly", "quarterly"].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supportive Documents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Supportive Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating…" : "Registering…"}
            </>
          ) : isEditMode ? (
            "Update Beneficiary"
          ) : (
            "Register Beneficiary"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BranchBeneficiaryRegistrationForm;
