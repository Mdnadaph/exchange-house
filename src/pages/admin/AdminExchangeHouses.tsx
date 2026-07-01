import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Landmark,
  Plus,
  Search,
  Building2,
  Users,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Ban,
  Power,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import PaginationSummary from "@/components/PaginationSummary";
import PaginationControl from "@/components/PaginationControl";

// Types based on your API responses
interface Country {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  branchLimit: number;
}

interface ExchangeAdmin {
  id: number;
  uuid: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  primaryContactMail: string | null; // Corrected from primaryContactMail
  active: boolean;
  legalBusinessName: string | null;
  tradingName: string | null;
  registrationNumber: string | null;
  centralBankLicense: string | null;
  licenseExpiryDate: string | null;
  businessAddress: string | null;
  city: string | null;
  country: string;
  countryId: number;
  postalCode: string | null;
  subscriptionPlan: Plan | null;
  subscriptionStartDate: string | null;
  subscriptionStatus: string | null;
  exchangeStatus: string | null;
}

interface ListData {
  exchangeAdminResponse: ExchangeAdmin[];
  exchangeHouseStats: {
    totalExchangeHouse: number;
    activeExchangeHouse: number;
    pendingApproval: number;
    suspended: number;
  };
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}

const AdminExchangeHouses = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<ExchangeAdmin | null>(
    null,
  );

  // Data from APIs
  const [countries, setCountries] = useState<Country[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [exchangeAdmins, setExchangeAdmins] = useState<ExchangeAdmin[]>([]);
  const [stats, setStats] = useState<ListData["exchangeHouseStats"]>({
    totalExchangeHouse: 0,
    activeExchangeHouse: 0,
    pendingApproval: 0,
    suspended: 0,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 10;

  // Form state - aligned with API payload
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    primaryContactEmail: "",
    phoneNumber: "",
    legalBusinessName: "",
    tradingName: "",
    registrationNumber: "",
    centralBankLicense: "",
    licenseExpiryDate: "",
    businessAddress: "",
    city: "",
    countryId: 1, // default UAE
    postalCode: "",
    subscriptionPlanId: 2, // default Professional
  });

  // Fetch countries and plans once
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [countriesRes, plansRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v3/config/countries`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v3/super/exchange-admins/plans`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (countriesRes.data.status) {
          setCountries(countriesRes.data.data);
        }

        if (plansRes.data.status) {
          setPlans(plansRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load countries/plans", err);
        toast({
          title: "Error",
          description: "Failed to load required data",
          variant: "destructive",
        });
      }
    };

    if (token) fetchStaticData();
  }, [token, toast]);

  // Fetch exchange admins list
  const fetchExchangeAdmins = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/super/exchange-admins?page=${currentPage}&size=${pageSize}&query=${encodeURIComponent(debouncedSearch)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.status) {
        const data: ListData = res.data.data;
        setExchangeAdmins(data.exchangeAdminResponse || []);
        setStats(
          data.exchangeHouseStats || {
            totalExchangeHouse: 0,
            activeExchangeHouse: 0,
            pendingApproval: 0,
            suspended: 0,
          },
        );
        setTotalPages(data.totalPages || 0);
        setTotalElements(data?.totalElements || 0);
        setCurrentPage(data?.currentPage || 0);
      }
    } catch (err) {
      console.error("Failed to fetch exchange admins", err);
      // toast({
      //   title: "Error",
      //   description: "Failed to load exchange houses",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Reset page when debounced search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  // 3. THE FIX: depend on BOTH currentPage AND debouncedSearch
  useEffect(() => {
    if (token) fetchExchangeAdmins();
  }, [token, currentPage, debouncedSearch]);

  const handleSubmitOnboarding = async () => {
    setFormSubmitting(true);
    setErrors({}); // clear previous errors

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        primaryContactEmail: formData.primaryContactEmail?.trim() || null,
        phoneNumber: formData.phoneNumber?.trim() || null,
        legalBusinessName: formData.legalBusinessName.trim(),
        tradingName: formData.tradingName?.trim() || null,
        registrationNumber: formData.registrationNumber?.trim() || null,
        centralBankLicense: formData.centralBankLicense.trim(),
        licenseExpiryDate: formData.licenseExpiryDate || null,
        businessAddress: formData.businessAddress?.trim() || null,
        city: formData.city?.trim() || null,
        countryId: formData.countryId,
        postalCode: formData.postalCode?.trim() || null,
        subscriptionPlanId: formData.subscriptionPlanId,
      };

      let res;
      if (isEdit && selectedAdmin) {
        res = await axios.put(
          `${BASE_URL}/api/v3/super/exchange-admins/${selectedAdmin.id}/edit`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        res = await axios.post(
          `${BASE_URL}/api/v3/super/exchange-admins`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      }

      if (res.data.status) {
        toast({
          title: "Success",
          description: res.data.message || (isEdit ? "Updated" : "Created"),
        });
        setIsOnboardingOpen(false);
        setSearchQuery(""); // ← added
        setCurrentPage(0);
        fetchExchangeAdmins();

        // Reset everything
        setFormData({
          /* your reset object */
          fullName: "",
          email: "",
          primaryContactEmail: "",
          phoneNumber: "",
          legalBusinessName: "",
          tradingName: "",
          registrationNumber: "",
          centralBankLicense: "",
          licenseExpiryDate: "",
          businessAddress: "",
          city: "",
          countryId: 1,
          postalCode: "",
          subscriptionPlanId: 2,
        });
        setErrors({});
        setIsEdit(false);
        setSelectedAdmin(null);
      } else {
        toast({
          title: "Error",
          description: res.data.message || "Operation failed",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      if (
        err.response?.data?.data &&
        typeof err.response.data.data === "object"
      ) {
        const backendErrors = err.response.data.data;
        const formattedErrors: Record<string, string[]> = {};

        Object.entries(backendErrors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages
            : [messages];
        });

        setErrors(formattedErrors);

        // Optional: show a brief validation summary toast
        // toast({
        //   title: "Validation Error",
        //   description: "Please check the highlighted fields",
        //   variant: "destructive",
        // });
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedHouseId) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/super/exchange-admins/toggle-status/suspend`,
        {
          id: selectedHouseId,
          exchangeStatus: "SUSPENDED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.status) {
        toast({
          title: t("suspendExchangeHouse"),
          description: res.data.message || "Exchange house has been suspended.",
        });
        fetchExchangeAdmins();
      }
    } catch (err: any) {
      console.error("Suspend error:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to suspend exchange house",
        variant: "destructive",
      });
    } finally {
      setSuspendDialogOpen(false);
      setSelectedHouseId(null);
    }
  };

  const handleActivate = async () => {
    if (!selectedHouseId) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/super/exchange-admins/toggle-status/suspend`,
        {
          id: selectedHouseId,
          exchangeStatus: "ACTIVE",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.status) {
        toast({
          title: t("activateExchangeHouse"),
          description: res.data.message || "Exchange house has been activated.",
        });
        fetchExchangeAdmins();
      }
    } catch (err: any) {
      console.error("Activate error:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to activate exchange house",
        variant: "destructive",
      });
    } finally {
      setActivateDialogOpen(false);
      setSelectedHouseId(null);
    }
  };

  const handleDeactive = async () => {
    if (!selectedHouseId) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/super/exchange-admins/toggle-status/suspend`,
        {
          id: selectedHouseId,
          exchangeStatus: "DEACTIVATED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.status) {
        toast({
          title: "Deactive Exchange House",
          description:
            res.data.message || "Exchange house has been Deactivated.",
        });
        fetchExchangeAdmins();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to deactivate exchange house",
        variant: "destructive",
      });
    } finally {
      setDeactivateDialogOpen(false);
      setSelectedHouseId(null);
    }
  };

  // Status badge logic
  const getStatusBadge = (status: string | null) => {
    const lower = (status || "").toLowerCase();
    if (lower === "active") {
      return {
        variant: "default" as const,
        label: t("active"),
        icon: CheckCircle,
      };
    }
    if (lower === "pending") {
      return {
        variant: "secondary" as const,
        label: t("pending"),
        icon: Clock,
      };
    }
    if (lower === "suspended") {
      return {
        variant: "destructive" as const,
        label: t("suspended"),
        icon: XCircle,
      };
    }
    return { variant: "secondary" as const, label: t("pending"), icon: Clock };
  };

  // Plan badge logic
  const getPlanBadge = (plan: Plan | null) => {
    if (!plan) return { variant: "outline" as const, label: "Unknown" };

    const nameLower = plan.name.toLowerCase();
    if (nameLower.includes("basic")) {
      return { variant: "outline" as const, label: t("basic") };
    }
    if (nameLower.includes("professional")) {
      return { variant: "secondary" as const, label: t("professional") };
    }
    if (nameLower.includes("enterprise")) {
      return { variant: "default" as const, label: t("enterprise") };
    }
    return { variant: "outline" as const, label: plan.name };
  };
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
        >
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("exchangeHouseManagement")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("manageExchangeHouses")}
            </p>
          </div>

          <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
            <DialogTrigger asChild>
              <Button
                variant="business"
                className={isRTL ? "flex-row-reverse" : ""}
                onClick={() => {
                  // Reset form when opening in CREATE mode
                  setIsEdit(false);
                  setSelectedAdmin(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    primaryContactEmail: "",
                    phoneNumber: "",
                    legalBusinessName: "",
                    tradingName: "",
                    registrationNumber: "",
                    centralBankLicense: "",
                    licenseExpiryDate: "",
                    businessAddress: "",
                    city: "",
                    countryId: 1,
                    postalCode: "",
                    subscriptionPlanId: 2,
                  });
                  setErrors({});
                }}
              >
                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("onboardExchangeHouse")}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEdit
                    ? "Edit Exchange House"
                    : t("exchangeHouseOnboardingForm")}
                </DialogTitle>
                <DialogDescription>
                  {isEdit
                    ? "Update the details of the exchange house"
                    : "Enter details to onboard new exchange house"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Admin / Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    {"Admin Details"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t("fullName")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          });
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.fullName;
                            return next;
                          });
                        }}
                        placeholder="Hamdan Al Nahyan"
                      />
                      {errors.fullName?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("adminEmail")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.email;
                            return next;
                          });
                        }}
                        placeholder="admin@uaeexchange.com"
                      />
                      {errors.email?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">
                        {/* {t("phoneNumber")} * */}
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <PhoneInput
                        country={"ae"} // Defaulting to UAE based on your preferredCountries
                        value={formData.phoneNumber}
                        onChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumber: value,
                          }));

                          // Clear validation errors when user types
                          if (errors.phoneNumber) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.phoneNumber;
                              return next;
                            });
                          }
                        }}
                        inputProps={{
                          name: "phoneNumber",
                          id: "phoneNumber",
                          required: true,
                        }}
                        containerClass="phone-input-container"
                        inputClass={`!w-full !h-10 !bg-transparent !border-input !text-sm !transition-smooth ${
                          errors.phoneNumber ? "!border-destructive" : ""
                        }`}
                        buttonClass="phone-flag-button"
                        dropdownClass="phone-dropdown-custom"
                        enableSearch={true}
                        // searchPlaceholder={t("searchCountry") || "Search..."}
                        searchPlaceholder="search Counrty"
                        preferredCountries={["ae", "in"]}
                      />

                      {errors.phoneNumber?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryContactEmail">
                        {t("primaryContactEmail")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="primaryContactEmail"
                        type="email"
                        value={formData.primaryContactEmail}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            primaryContactEmail: e.target.value,
                          });
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.primaryContactEmail;
                            return next;
                          });
                        }}
                        placeholder="contact@uaeexchange.com"
                      />
                      {errors.primaryContactEmail?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    {t("exchangeHouseDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalBusinessName">
                        {t("legalBusinessName")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="legalBusinessName"
                        value={formData.legalBusinessName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            legalBusinessName: e.target.value,
                          });
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.legalBusinessName;
                            return next;
                          });
                        }}
                        placeholder="UAE Exchange Centre LLC"
                      />
                      {errors.legalBusinessName?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tradingName">{t("tradingName")}</Label>
                      <Input
                        id="tradingName"
                        value={formData.tradingName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tradingName: e.target.value,
                          })
                        }
                        placeholder="UAE Exchange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">
                        {/* {t("registrationNumber")} */}
                        Company Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationNumber: e.target.value,
                          })
                        }
                        placeholder="REG-998877"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="centralBankLicense">
                        {t("centralBankLicense")}
                      </Label>
                      <Input
                        id="centralBankLicense"
                        value={formData.centralBankLicense}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centralBankLicense: e.target.value,
                          })
                        }
                        placeholder="CB-UAE-2024-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiryDate">
                        {t("licenseExpiryDate")}
                      </Label>
                      <Input
                        id="licenseExpiryDate"
                        type="date"
                        value={formData.licenseExpiryDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            licenseExpiryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    {t("businessAddress")}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">
                      {t("businessAddress")}
                    </Label>
                    <Textarea
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessAddress: e.target.value,
                        })
                      }
                      placeholder="Level 12, Al Sayegh Officers Tower..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("city")}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                        }}
                        placeholder="Abu Dhabi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryId">
                        {t("country")} <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.countryId.toString()}
                        onValueChange={(val) => {
                          setFormData({ ...formData, countryId: Number(val) });
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.countryId;
                            return next;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCountry")} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.countryId?.map((msg, i) => (
                        <p key={i} className="text-sm text-destructive mt-1">
                          {msg}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t("postalCode")}</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="17001"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan - using dynamic plans */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    {t("subscriptionPlan")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                      const isSelected =
                        formData.subscriptionPlanId === plan.id;
                      const nameLower = plan.name.toLowerCase();
                      let descKey = "basicPlanDesc";
                      if (nameLower.includes("professional"))
                        descKey = "professionalPlanDesc";
                      if (nameLower.includes("enterprise"))
                        descKey = "enterprisePlanDesc";

                      const priceDisplay =
                        plan.price === 0
                          ? "Custom"
                          : `$${plan.price.toFixed(0)}/mo`;

                      return (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "ring-2 ring-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              subscriptionPlanId: plan.id,
                            })
                          }
                        >
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t(descKey as any)}
                            </p>
                            <p className="text-lg font-bold mt-2">
                              {priceDisplay}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOnboardingOpen(false);
                      setIsEdit(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        primaryContactEmail: "",
                        phoneNumber: "",
                        legalBusinessName: "",
                        tradingName: "",
                        registrationNumber: "",
                        centralBankLicense: "",
                        licenseExpiryDate: "",
                        businessAddress: "",
                        city: "",
                        countryId: 1, // default UAE
                        postalCode: "",
                        subscriptionPlanId: 2, // default Professional
                      });
                      setSelectedAdmin(null);
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleSubmitOnboarding}
                    disabled={formSubmitting}
                  >
                    {formSubmitting
                      ? "Submitting..."
                      : isEdit
                        ? "Update Exchange House"
                        : "Submit Onboarding"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalExchangeHouses")}
              </CardTitle>
              <Landmark className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">
                {stats.totalExchangeHouse}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("activeExchangeHouses")}
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">
                {stats.activeExchangeHouse}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {/* {t("pendingApprovalHouses")} */}
                Pending Exchange Houses
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {/* {t("suspendedHouses")} */}
                Suspended Exchange House
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.suspended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
          />
          <Input
            placeholder="Search exchange houses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className={isRTL ? "pr-10" : "pl-10"}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {exchangeAdmins.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {searchQuery ? "No results found" : "No exchange houses found"}
              </div>
            ) : (
              <div>
                <div className="flex justify-end my-1">
                  <PaginationSummary
                    totalElements={totalElements}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    itemCount={exchangeAdmins?.length}
                    itemLabel="Exchange Admin"
                  />
                </div>
                {exchangeAdmins?.map((admin) => {
                  // console.log(
                  //   `Admin ID: ${admin.id}, Status: ${admin.exchangeStatus}`,
                  // ); // Debug log - remove after testing
                  const status = getStatusBadge(admin.exchangeStatus);
                  const plan = getPlanBadge(admin.subscriptionPlan);
                  const StatusIcon = status.icon;

                  const displayName =
                    admin.legalBusinessName ||
                    admin.tradingName ||
                    admin.fullName ||
                    "Unnamed Exchange";

                  return (
                    <Card key={admin.id} className="shadow-card">
                      <CardContent className="p-6">
                        <div
                          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                            isRTL ? "lg:flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Landmark className="h-6 w-6 text-primary" />
                            </div>
                            <div className={isRTL ? "text-right" : ""}>
                              <div
                                className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
                              >
                                <h3 className="font-semibold text-lg">
                                  {displayName}
                                </h3>
                                <Badge
                                  variant={status.variant}
                                  className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                                <Badge variant={plan.variant}>
                                  {plan.label}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mt-1">
                                {admin.tradingName ||
                                  admin.legalBusinessName ||
                                  admin.fullName}
                              </p>

                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <span
                                  className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                                >
                                  <Building2 className="h-3.5 w-3.5" />
                                  {admin.city}, {admin?.country}
                                </span>
                                {/* <span
                                className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                              >
                                <GitBranch className="h-3.5 w-3.5" />
                                {admin.subscriptionPlan?.branchLimit ??
                                  "N/A"}{" "}
                                Branches
                              </span> */}
                                <span
                                  className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                                >
                                  <Users className="h-3.5 w-3.5" />
                                  {admin.fullName}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                                <span>
                                  {t("centralBankLicense")}:{" "}
                                  {admin.centralBankLicense}
                                </span>
                                <span>
                                  {t("dateOnboarded")}:{" "}
                                  {admin.subscriptionStartDate}
                                </span>
                                <span>Email: {admin?.email}</span>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/exchange-houses/${admin.id}`)
                              }
                            >
                              <Eye
                                className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                              />
                              {t("viewDetails")}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align={isRTL ? "start" : "end"}
                              >
                                {admin.exchangeStatus?.toLowerCase() ===
                                "active" ? (
                                  <DropdownMenuItem
                                    className={`text-orange-600 ${isRTL ? "flex-row-reverse" : ""}`}
                                    onClick={() => {
                                      setSelectedHouseId(admin.id);
                                      setSuspendDialogOpen(true);
                                    }}
                                  >
                                    <Ban
                                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                                    />
                                    {t("suspendExchangeHouse")}
                                  </DropdownMenuItem>
                                ) : admin.exchangeStatus?.toLowerCase() ===
                                  "suspended" ? (
                                  <div>
                                    <DropdownMenuItem
                                      className={`text-green-600 ${isRTL ? "flex-row-reverse" : ""}`}
                                      onClick={() => {
                                        setSelectedHouseId(admin.id);
                                        setActivateDialogOpen(true);
                                      }}
                                    >
                                      <Power
                                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                                      />
                                      {t("activateExchangeHouse")}
                                    </DropdownMenuItem>
                                  </div>
                                ) : null}
                                <DropdownMenuItem
                                  className={isRTL ? "flex-row-reverse" : ""}
                                  onClick={() => {
                                    setSelectedAdmin(admin);
                                    setFormData({
                                      fullName: admin.fullName || "",
                                      email: admin.email || "",
                                      primaryContactEmail:
                                        admin.primaryContactMail || "",
                                      phoneNumber: admin.phoneNumber || "",
                                      legalBusinessName:
                                        admin.legalBusinessName || "",
                                      tradingName: admin.tradingName || "",
                                      registrationNumber:
                                        admin.registrationNumber || "",
                                      centralBankLicense:
                                        admin.centralBankLicense || "",
                                      licenseExpiryDate:
                                        admin.licenseExpiryDate || "",
                                      businessAddress:
                                        admin.businessAddress || "",
                                      city: admin.city || "",
                                      countryId: admin.countryId || 1,
                                      postalCode: admin.postalCode || "",
                                      subscriptionPlanId:
                                        admin.subscriptionPlan?.id || 2,
                                    });
                                    setIsEdit(true);
                                    setIsOnboardingOpen(true);
                                    setErrors({});
                                  }}
                                >
                                  <Edit
                                    className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                                  />
                                  {t("editExchangeHouse")}
                                </DropdownMenuItem>

                                {/* <DropdownMenuItem
                                className={`text-destructive ${isRTL ? "flex-row-reverse" : ""}`}
                                onClick={() => {
                                  setSelectedHouseId(admin.id);
                                  setDeactivateDialogOpen(true);
                                }}
                              >
                                <Trash2
                                  className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                                />
                                {t("deleteExchangeHouse")}
                              </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <PaginationControl
          className="mt-6"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* Dialogs */}
        <ConfirmationDialog
          open={suspendDialogOpen}
          onOpenChange={setSuspendDialogOpen}
          title={t("confirmSuspend")}
          description={t("confirmSuspendDesc")}
          confirmText={t("suspendExchangeHouse")}
          onConfirm={handleSuspend}
          variant="destructive"
        />

        <ConfirmationDialog
          open={deactivateDialogOpen}
          onOpenChange={setDeactivateDialogOpen}
          title="Confirm Deactive"
          description="Are you sure you want to deactivate this exchange house?"
          confirmText="Deactive Action House"
          onConfirm={handleDeactive}
          variant="destructive"
        />

        <ConfirmationDialog
          open={activateDialogOpen}
          onOpenChange={setActivateDialogOpen}
          title={t("confirmActivate")}
          description={t("confirmActivateDesc")}
          confirmText={t("activateExchangeHouse")}
          onConfirm={handleActivate}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminExchangeHouses;
