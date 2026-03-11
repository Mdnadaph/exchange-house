import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Globe,
  Banknote,
  MapPin,
  Plus,
  Edit,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone,
  Building,
  Trash2,
  X,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

interface PayoutDestination {
  id: string;
  country: string;
  currency: string;
  status: "active" | "maintenance" | "inactive";
  mechanisms: string[];
  volume: string;
  partners: number;
  fees: string;
  processingTime: string;
}

interface GlobalSettings {
  autoRouting: boolean;
  defaultFeeMarkup: string;
  complianceCheck: boolean;
  maxRetryAttempts: string;
  rateRefreshInterval: string;
  marginThreshold: string;
  weekendRates: boolean;
  highVolumeDiscount: string;
}
type MechanismConfig = {
  feeMin: string;
  feeMax: string;
  processingMin: string;
  processingMax: string;
};

type DestinationForm = {
  country: string;
  currency: string;
  status: "active" | "maintenance" | "inactive";
  partners: string;
  volume: string;
  mechanisms: string[];
  mechanismConfigs: Record<string, MechanismConfig>;
};
const AVAILABLE_MECHANISMS = [
  "BANK_TRANSFER",
  "MOBILE_WALLET",
  "UPI",
  "CASH_PICKUP",
  "GCASH",
  "JAZZCASH",
  "EASYPaisa",
  "BKASH",
  "NAGAD",
  // "Remitly",
];

const COUNTRIES = [
  { name: "India", currency: "INR" },
  { name: "Philippines", currency: "PHP" },
  { name: "Pakistan", currency: "PKR" },
  { name: "Bangladesh", currency: "BDT" },
  { name: "Nepal", currency: "NPR" },
  { name: "Sri Lanka", currency: "LKR" },
  { name: "Egypt", currency: "EGP" },
  { name: "Indonesia", currency: "IDR" },
  { name: "Vietnam", currency: "VND" },
  { name: "Thailand", currency: "THB" },
];

const ExchangePayoutConfig = () => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState<number>(0);
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  //  const [destinations, setDestinations] = useState<PayoutDestination[]>([
  //   {
  //     id: "1",
  //     country: "India",
  //     currency: "INR",
  //     status: "active",
  //     mechanisms: ["Bank Transfer", "UPI", "Mobile Wallet", "Cash Pickup"],
  //     volume: "2.4M USD",
  //     partners: 12,
  //     fees: "0.5-2.5%",
  //     processingTime: "5-30 minutes",
  //   },
  //   {
  //     id: "2",
  //     country: "Philippines",
  //     currency: "PHP",
  //     status: "active",
  //     mechanisms: ["Bank Transfer", "GCash", "Remitly", "Cash Pickup"],
  //     volume: "1.8M USD",
  //     partners: 8,
  //     fees: "0.8-3.0%",
  //     processingTime: "15-60 minutes",
  //   },
  //   {
  //     id: "3",
  //     country: "Pakistan",
  //     currency: "PKR",
  //     status: "active",
  //     mechanisms: ["Bank Transfer", "JazzCash", "EasyPaisa", "Cash Pickup"],
  //     volume: "1.2M USD",
  //     partners: 6,
  //     fees: "1.0-3.5%",
  //     processingTime: "10-45 minutes",
  //   },
  //   {
  //     id: "4",
  //     country: "Bangladesh",
  //     currency: "BDT",
  //     status: "maintenance",
  //     mechanisms: ["Bank Transfer", "bKash", "Nagad"],
  //     volume: "800K USD",
  //     partners: 4,
  //     fees: "1.2-4.0%",
  //     processingTime: "30-120 minutes",
  //   },
  // ]);
  const [destinations, setDestinations] = useState(null);
  const [id, setId] = useState<number | null>(null);
  const getCountriesData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v3/config/countries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setCountries(json?.data);
    } catch (error) {
      const msg = error.message || "Failed to load countries";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };
  // State for destinations
  useEffect(() => {
    getCountriesData();
  }, []);

  const getPayOutConfig = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config?page=${page}&size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setDestinations(json?.data);
    } catch (error) {
      const msg = error.message || "Failed to load payout config";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => {
    getPayOutConfig();
  }, [page]);
  const summaryData = destinations?.summary;
  const totalPayOutConfigDataList = destinations?.totalElements;
  function formatEnumText(value?: string): string {
    if (typeof value !== "string") return "-";
    return value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // State for global settings
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    autoRouting: true,
    defaultFeeMarkup: "1.5",
    complianceCheck: true,
    maxRetryAttempts: "3",
    rateRefreshInterval: "30",
    marginThreshold: "0.1",
    weekendRates: false,
    highVolumeDiscount: "0.25",
  });

  // Dialog states
  const [addDestinationOpen, setAddDestinationOpen] = useState(false);
  const [editDestinationOpen, setEditDestinationOpen] = useState(false);
  const [globalSettingsOpen, setGlobalSettingsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<PayoutDestination | null>(null);

  // Form state for add/edit destination
  // const [destinationForm, setDestinationForm] = useState({
  //   country: "",
  //   currency: "",
  //   status: "active" as "active" | "maintenance" | "inactive",
  //   mechanisms: [] as string[],
  //   feeMin: "",
  //   feeMax: "",
  //   processingMin: "",
  //   processingMax: "",
  //   partners: "",
  //   volume: "",
  // });

  const [destinationForm, setDestinationForm] = useState<DestinationForm>({
    country: "",
    currency: "",
    status: "active",
    partners: "",
    volume: "",
    mechanisms: [],
    mechanismConfigs: {},
  });

  const payoutMechanisms = [
    {
      type: "Bank Transfer",
      description: t("bankTransferDesc") || "Direct bank account transfers",
      countries: 47,
      averageFee: "1.2%",
      status: "active",
      icon: Building,
    },
    {
      type: "Mobile Wallets",
      description: t("mobileWalletDesc") || "Digital wallet transfers",
      countries: 23,
      averageFee: "1.8%",
      status: "active",
      icon: Smartphone,
    },
    {
      type: "Cash Pickup",
      description: t("cashPickupDesc") || "Physical cash collection points",
      countries: 35,
      averageFee: "3.2%",
      status: "active",
      icon: MapPin,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ACTIVE: {
        variant: "default" as const,
        label: t("active") || "Active",
        icon: CheckCircle,
      },
      MAINTENANCE: {
        variant: "secondary" as const,
        label: t("maintenance") || "Maintenance",
        icon: Clock,
      },
      INACTIVE: {
        variant: "destructive" as const,
        label: t("inactive") || "Inactive",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap?.ACTIVE;
  };

  const resetForm = () => {
    // setDestinationForm({
    //   country: "",
    //   currency: "",
    //   status: "active",
    //   mechanisms: [],
    //   feeMin: "",
    //   feeMax: "",
    //   processingMin: "",
    //   processingMax: "",
    //   partners: "",
    //   volume: "",
    // });
    setDestinationForm({
      country: "",
      currency: "",
      status: "active",
      partners: "",
      volume: "",
      mechanisms: [],
      mechanismConfigs: {},
    });
  };

  const buildPayload = () => {
    return {
      countryId: Number(destinationForm.country),
      payoutCurrency: destinationForm.currency,
      status: destinationForm.status.toUpperCase(),
      partnersCount: Number(destinationForm.partners),
      monthlyVolumeUsd: Number(destinationForm.volume),
      mechanisms: destinationForm.mechanisms.map((m) => {
        const c = destinationForm.mechanismConfigs[m];
        return {
          mechanism: m,
          enabled: true,
          feeMinPercent: Number(c.feeMin),
          feeMaxPercent: Number(c.feeMax),
          processingMinMinutes: Number(c.processingMin),
          processingMaxMinutes: Number(c.processingMax),
        };
      }),
    };
  };

  const handleAddDestination = async () => {
    if (!destinationForm.country || destinationForm.mechanisms.length === 0) {
      toast({
        title: t("validationError") || "Validation Error",
        description:
          t("fillRequiredFields") || "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const payload = buildPayload();
    try {
      const res = await fetch(`${BASE_URL}/api/v1/payout/config/country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }
      setAddDestinationOpen(false);
      resetForm();
      getPayOutConfig();
      toast({
        title: t("destinationAdded") || "Destination Added",
        description:
          t("destinationAddedDesc") ||
          `${destinationForm?.country} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Create Global Settting",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
    // const newDestination: PayoutDestination = {
    //   id: Date.now().toString(),
    //   country: destinationForm.country,
    //   currency:
    //     destinationForm.currency ||
    //     COUNTRIES.find((c) => c.name === destinationForm.country)?.currency ||
    //     "USD",
    //   status: destinationForm.status,
    //   mechanisms: destinationForm.mechanisms,
    //   volume: destinationForm.volume || "0 USD",
    //   partners: parseInt(destinationForm.partners) || 0,
    //   fees: `${destinationForm.feeMin || "0"}-${destinationForm.feeMax || "0"}%`,
    //   processingTime: `${destinationForm.processingMin || "0"}-${destinationForm.processingMax || "0"} minutes`,
    // };

    // setDestinations([...destinations, newDestination]);

    // toast({
    //   title: t("destinationAdded") || "Destination Added",
    //   description:
    //     t("destinationAddedDesc") ||
    //     `${newDestination.country} has been added successfully.`,
    // });
  };

  const handleEditDestination = async () => {
    // if (!selectedDestination) return;

    // const updatedDestinations = destinations.map((d) =>
    //   d.id === selectedDestination.id
    //     ? {
    //         ...d,
    //         country: destinationForm.country,
    //         currency: destinationForm.currency,
    //         status: destinationForm.status,
    //         mechanisms: destinationForm.mechanisms,
    //         volume: destinationForm.volume,
    //         partners: parseInt(destinationForm.partners) || d.partners,
    //         fees: `${destinationForm.feeMin}-${destinationForm.feeMax}%`,
    //         processingTime: `${destinationForm.processingMin}-${destinationForm.processingMax} minutes`,
    //       }
    //     : d,
    // );

    // setDestinations(updatedDestinations);
    const payload = buildPayload();
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config/country/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }

      resetForm();
      getPayOutConfig();
      setEditDestinationOpen(false);
      setSelectedDestination(null);
      setId(null);
      toast({
        title: t("destinationUpdated") || "Destination Updated",
        description:
          t("destinationUpdatedDesc") ||
          "Destination configuration has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Global Settting",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDestination = async () => {
    if (!selectedDestination) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config/country/${selectedDestination?.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }
      setDeleteConfirmOpen(false);
      setSelectedDestination(null);
      getPayOutConfig();
      toast({
        title: t("destinationDeleted") || "Destination Deleted",
        description:
          t("destinationDeletedDesc") || "Destination has been removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Global Settting",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };
  const buildMechanismConfigs = (data: any) => {
    const configs: Record<string, any> = {};

    data?.mechanisms?.forEach((item: any) => {
      configs[item?.name] = {
        feeMin: item?.feeMinPercent?.toString() ?? "",
        feeMax: item?.feeMaxPercent?.toString() ?? "",
        processingMin: item?.processingMinMinutes?.toString() ?? "",
        processingMax: item?.processingMaxMinutes?.toString() ?? "",
      };
    });

    return configs;
  };
  const openEditDialog = (destinationEditableData: any) => {
    setId(destinationEditableData?.id);
    setDestinationForm({
      country: destinationEditableData?.countryId,
      currency: destinationEditableData?.currency,
      status: destinationEditableData?.status.toLowerCase(),
      mechanisms: destinationEditableData?.mechanisms?.map(
        (item: any) => item?.name,
      ),
      mechanismConfigs: buildMechanismConfigs(destinationEditableData),
      partners: destinationEditableData.partners.toString(),
      volume: destinationEditableData?.volumeUsd,
    });
    setEditDestinationOpen(true);
  };

  const openDeleteConfirm = (destination: PayoutDestination) => {
    setSelectedDestination(destination);
    setDeleteConfirmOpen(true);
  };

  const handleSaveGlobalSettings = async () => {
    const formDTO = {
      ...globalSettings,
      defaultFeeMarkup: Number(globalSettings?.defaultFeeMarkup),
      highVolumeDiscount: Number(globalSettings?.highVolumeDiscount),
      marginThreshold: Number(globalSettings?.marginThreshold),
      maxRetryAttempts: Number(globalSettings?.maxRetryAttempts),
      rateRefreshInterval: Number(globalSettings?.rateRefreshInterval),
    };
    try {
      const res = await fetch(`${BASE_URL}/api/v1/payout/config/global`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formDTO),
      });
      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }
      setGlobalSettingsOpen(false);
      toast({
        title: t("settingsSaved") || "Settings Saved",
        description:
          t("globalSettingsSavedDesc") ||
          "Global settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Global Settting",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  // const handleMechanismToggle = (mechanism: string) => {
  //   setDestinationForm((prev) => ({
  //     ...prev,
  //     mechanisms: prev.mechanisms.includes(mechanism)
  //       ? prev.mechanisms.filter((m) => m !== mechanism)
  //       : [...prev.mechanisms, mechanism],
  //   }));
  // };

  const handleCountryChange = (country: string) => {
    const countryData = countries.find((c) => c?.id === country);
    setDestinationForm((prev) => ({
      ...prev,
      country,
      currency: countryData?.isoCode,
    }));
  };
  const handleMechanismToggle = (mechanism: string) => {
    setDestinationForm((prev) => {
      const exists = prev.mechanisms.includes(mechanism);

      if (exists) {
        const { [mechanism]: _, ...rest } = prev.mechanismConfigs;

        return {
          ...prev,
          mechanisms: prev.mechanisms.filter((m) => m !== mechanism),
          mechanismConfigs: rest,
        };
      }

      return {
        ...prev,
        mechanisms: [...prev.mechanisms, mechanism],
        mechanismConfigs: {
          ...prev.mechanismConfigs,
          [mechanism]: {
            feeMin: "",
            feeMax: "",
            processingMin: "",
            processingMax: "",
          },
        },
      };
    });
  };

  return (
    <ExchangeLayout>
      <div className={`space-y-8 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("payoutConfiguration") || "Payout Configuration"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("payoutConfigDesc") ||
                "Manage payout destinations, mechanisms, and partner integrations"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* <Button
              variant="outline"
              size="sm"
              className="sm:size-default"
              onClick={() => setGlobalSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {t("globalSettings") || "Global Settings"}
              </span>
            </Button> */}
            <Button
              variant="business"
              size="sm"
              className="sm:size-default"
              onClick={() => {
                resetForm();
                setAddDestinationOpen(true);
              }}
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {t("addDestination") || "Add Destination"}
              </span>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("activeCountries") || "Active Countries"}
              </CardTitle>
              <Globe className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData?.activeCountries}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("configurableDestinations") || "Configurable destinations"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalPartners") || "Total Partners"}
              </CardTitle>
              <Building className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {destinations.reduce((sum, d) => sum + d.partners, 0)} */}
                {summaryData?.totalPartners}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("banksAndInstitutions") || "Banks & financial institutions"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("monthlyVolume") || "Monthly Volume"}
              </CardTitle>
              <Banknote className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{`$ ${summaryData?.totalMonthlyVolumeUsd} M`}</div>
              <p className="text-xs text-muted-foreground">
                +18% {t("fromLastMonth") || "from last month"}
              </p>
            </CardContent>
          </Card>

          {/* <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("successRate") || "Success Rate"}
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground">
                {t("allDestinations") || "All destinations"}
              </p>
            </CardContent>
          </Card> */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mantainance Country
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData?.maintenanceCountries}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("allDestinations") || "All destinations"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Destinations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t("payoutDestinations") || "Payout Destinations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {destinations?.countries?.length > 0 ? (
                destinations?.countries?.map((destination: any) => {
                  const status = getStatusBadge(destination?.status);
                  const StatusIcon = status.icon;
                  return (
                    <Card
                      key={destination?.id}
                      className="border-l-4 border-l-primary"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="space-y-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-foreground">
                                  {destination?.countryName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {t("currency") || "Currency"}:{" "}
                                  {destination.currency}
                                </p>
                              </div>
                              <Badge
                                variant={status?.variant}
                                className="flex items-center gap-1 self-start sm:self-auto"
                              >
                                <StatusIcon className="h-3 w-3" />
                                {status?.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm bg-muted/30 rounded-lg p-3 sm:p-4">
                              <div>
                                <span className="text-muted-foreground text-xs sm:text-sm">
                                  {t("monthlyVolume") || "Monthly Volume"}:
                                </span>
                                <p className="font-medium text-sm">
                                  {destination?.volumeUsd}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs sm:text-sm">
                                  {t("partners") || "Partners"}:
                                </span>
                                <p className="font-medium text-sm">
                                  {destination?.partners}{" "}
                                  {t("active") || "active"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <span className="text-sm text-muted-foreground mb-2 block">
                                {t("availableMechanisms") ||
                                  "Available Mechanisms"}
                                :
                              </span>
                              <div className="space-y-4">
                                {destination?.mechanisms.map(
                                  (mechanism: any, mechIndex: number) => (
                                    <div
                                      key={mechIndex}
                                      className="rounded-xl border bg-background p-4 sm:p-5 space-y-4"
                                    >
                                      {/* Header */}
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {formatEnumText(mechanism?.name)}
                                        </Badge>
                                      </div>

                                      {/* Details */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Fee Range */}
                                        <div className="space-y-1">
                                          <p className="text-xs text-muted-foreground">
                                            {t("feeRange") || "Fee Range"}
                                          </p>
                                          <p className="font-medium text-sm sm:text-base">
                                            {mechanism?.feeMinPercent} –{" "}
                                            {mechanism?.feeMaxPercent} %
                                          </p>
                                        </div>

                                        {/* Processing Time */}
                                        <div className="space-y-1">
                                          <p className="text-xs text-muted-foreground">
                                            {t("processingTime") ||
                                              "Processing Time"}
                                          </p>
                                          <p className="font-medium text-sm sm:text-base">
                                            {mechanism?.processingMinMinutes} –{" "}
                                            {mechanism?.processingMaxMinutes}{" "}
                                            min
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(destination)}
                            >
                              <Edit className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">
                                {t("configure") || "Configure"}
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteConfirm(destination)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400">
                  No Data Found
                </p>
              )}
            </div>
            {totalPayOutConfigDataList > 10 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {destinations?.countries?.length} of{" "}
                  {totalPayOutConfigDataList} beneficiaries
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(page + 1) * 10 >= totalPayOutConfigDataList}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout Mechanisms */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              {t("payoutMechanisms") || "Payout Mechanisms"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {payoutMechanisms.map((mechanism, index) => {
                const Icon = mechanism.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {mechanism.type}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {mechanism.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("countries") || "Countries"}:
                          </span>
                          <span className="font-medium">
                            {mechanism.countries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("avgFee") || "Avg. Fee"}:
                          </span>
                          <span className="font-medium">
                            {mechanism.averageFee}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card> */}

        {/* Add Destination Dialog */}
        {/* <Dialog open={addDestinationOpen} onOpenChange={setAddDestinationOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t("addDestination") || "Add Destination"}
              </DialogTitle>
              <DialogDescription>
                {t("addDestinationDesc") ||
                  "Configure a new payout destination with mechanisms and fee settings."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("country") || "Country"} *</Label>
                  <Select
                    value={destinationForm.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectCountry") || "Select country"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem key={country?.id} value={country?.id}>
                          {country?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("currency") || "Currency"}</Label>
                  <Input
                    value={destinationForm.currency}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    placeholder="e.g., INR"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("status") || "Status"}</Label>
                <Select
                  value={destinationForm.status}
                  onValueChange={(
                    value: "active" | "maintenance" | "inactive",
                  ) =>
                    setDestinationForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("active") || "Active"}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {t("maintenance") || "Maintenance"}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("inactive") || "Inactive"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {t("availableMechanisms") || "Available Mechanisms"} *
                </Label>
                <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg max-h-40 overflow-y-auto">
                  {AVAILABLE_MECHANISMS.map((mechanism) => (
                    <div
                      key={mechanism}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={mechanism}
                        checked={destinationForm.mechanisms.includes(mechanism)}
                        onCheckedChange={() => handleMechanismToggle(mechanism)}
                      />
                      <label
                        htmlFor={mechanism}
                        className="text-sm cursor-pointer"
                      >
                        {mechanism}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("feeRangeMin") || "Fee Range Min (%)"}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={destinationForm.feeMin}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        feeMin: e.target.value,
                      }))
                    }
                    placeholder="0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("feeRangeMax") || "Fee Range Max (%)"}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={destinationForm.feeMax}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        feeMax: e.target.value,
                      }))
                    }
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("processingMin") || "Processing Min (minutes)"}
                  </Label>
                  <Input
                    type="number"
                    value={destinationForm.processingMin}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        processingMin: e.target.value,
                      }))
                    }
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("processingMax") || "Processing Max (minutes)"}
                  </Label>
                  <Input
                    type="number"
                    value={destinationForm.processingMax}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        processingMax: e.target.value,
                      }))
                    }
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("partnerCount") || "Partner Count"}</Label>
                  <Input
                    type="number"
                    value={destinationForm.partners}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        partners: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("initialVolume") || "Initial Volume"}</Label>
                  <Input
                    value={destinationForm.volume}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        volume: e.target.value,
                      }))
                    }
                    placeholder="e.g., 0 USD"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddDestinationOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button variant="business" onClick={handleAddDestination}>
                {t("addDestination") || "Add Destination"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <Dialog open={addDestinationOpen} onOpenChange={setAddDestinationOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t("addDestination") || "Add Destination"}
              </DialogTitle>
              <DialogDescription>
                {t("addDestinationDesc") ||
                  "Configure a new payout destination with mechanisms and fee settings."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("country") || "Country"} *</Label>
                  <Select
                    value={destinationForm.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectCountry") || "Select country"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem key={country?.id} value={country?.id}>
                          {country?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("currency") || "Currency"}</Label>
                  <Input
                    disabled
                    value={destinationForm?.currency}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    placeholder="e.g., INR"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("status") || "Status"}</Label>
                <Select
                  value={destinationForm.status}
                  onValueChange={(
                    value: "active" | "maintenance" | "inactive",
                  ) =>
                    setDestinationForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("active") || "Active"}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {t("maintenance") || "Maintenance"}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("inactive") || "Inactive"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("partnerCount") || "Partner Count"}</Label>
                  <Input
                    type="number"
                    value={destinationForm.partners}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        partners: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("initialVolume") || "Initial Volume"}</Label>
                  <Input
                    value={destinationForm.volume}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        volume: e.target.value,
                      }))
                    }
                    placeholder="e.g., 0 USD"
                  />
                </div>
              </div>
              {/* MECHANISMS */}
              <div className="mt-6">
                <Label>Available Mechanisms *</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-4 mt-2">
                  {AVAILABLE_MECHANISMS.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <Checkbox
                        checked={destinationForm.mechanisms.includes(m)}
                        onCheckedChange={() => handleMechanismToggle(m)}
                      />
                      <span>{formatEnumText(m)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {destinationForm.mechanisms.map((m) => {
                const c = destinationForm?.mechanismConfigs[m];

                return (
                  <div key={m} className="border rounded-lg p-4 mt-4 space-y-4">
                    <h4 className="font-semibold">
                      {formatEnumText(m)} Configuration
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Fee Min %"
                        value={c?.feeMin}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                feeMin: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Fee Max %"
                        value={c?.feeMax}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                feeMax: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Processing Min (minutes)"
                        value={c?.processingMin}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                processingMin: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Processing Max (minutes)"
                        value={c?.processingMax}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                processingMax: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddDestinationOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button variant="business" onClick={handleAddDestination}>
                {t("addDestination") || "Add Destination"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Destination Dialog */}
        <Dialog
          open={editDestinationOpen}
          onOpenChange={setEditDestinationOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t("editDestination") || "Edit Destination"}
              </DialogTitle>
              <DialogDescription>
                {t("editDestinationDesc") ||
                  "Update the configuration for this payout destination."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("country") || "Country"}</Label>
                  <Select
                    value={destinationForm.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("currency") || "Currency"}</Label>
                  <Input
                    value={destinationForm.currency}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("status") || "Status"}</Label>
                <Select
                  value={destinationForm.status}
                  onValueChange={(
                    value: "active" | "maintenance" | "inactive",
                  ) =>
                    setDestinationForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("active") || "Active"}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {t("maintenance") || "Maintenance"}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("inactive") || "Inactive"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {t("availableMechanisms") || "Available Mechanisms"}
                </Label>
                <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg max-h-40 overflow-y-auto">
                  {AVAILABLE_MECHANISMS.map((mechanism) => (
                    <div
                      key={mechanism}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-${mechanism}`}
                        checked={destinationForm?.mechanisms?.includes(
                          mechanism,
                        )}
                        onCheckedChange={() => handleMechanismToggle(mechanism)}
                      />
                      <label
                        htmlFor={`edit-${mechanism}`}
                        className="text-sm cursor-pointer"
                      >
                        {mechanism}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("feeRangeMin") || "Fee Range Min (%)"}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={destinationForm.feeMin}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        feeMin: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("feeRangeMax") || "Fee Range Max (%)"}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={destinationForm.feeMax}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        feeMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("processingMin") || "Processing Min (minutes)"}
                  </Label>
                  <Input
                    type="number"
                    value={destinationForm.processingMin}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        processingMin: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("processingMax") || "Processing Max (minutes)"}
                  </Label>
                  <Input
                    type="number"
                    value={destinationForm.processingMax}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        processingMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div> */}
              {destinationForm?.mechanisms?.map((m) => {
                const c = destinationForm?.mechanismConfigs[m];

                return (
                  <div key={m} className="border rounded-lg p-4 mt-4 space-y-4">
                    <h4 className="font-semibold">
                      {formatEnumText(m)} Configuration
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Fee Min %"
                        value={c?.feeMin}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                feeMin: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Fee Max %"
                        value={c?.feeMax}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                feeMax: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Processing Min (minutes)"
                        value={c?.processingMin}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                processingMin: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Processing Max (minutes)"
                        value={c?.processingMax}
                        onChange={(e) =>
                          setDestinationForm((p) => ({
                            ...p,
                            mechanismConfigs: {
                              ...p?.mechanismConfigs,
                              [m]: {
                                ...p?.mechanismConfigs[m],
                                processingMax: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("partnerCount") || "Partner Count"}</Label>
                  <Input
                    type="number"
                    value={destinationForm?.partners}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        partners: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("volume") || "Volume"}</Label>
                  <Input
                    value={destinationForm.volume}
                    onChange={(e) =>
                      setDestinationForm((prev) => ({
                        ...prev,
                        volume: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDestinationOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button variant="business" onClick={handleEditDestination}>
                {t("saveChanges") || "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Global Settings Dialog */}
        <Dialog open={globalSettingsOpen} onOpenChange={setGlobalSettingsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t("globalSettings") || "Global Settings"}
              </DialogTitle>
              <DialogDescription>
                {t("globalSettingsDesc") ||
                  "Configure global payout settings and rate configurations."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-4">
              {/* General Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  {t("generalSettings") || "General Settings"}
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-routing">
                      {t("autoRouteOptimization") || "Auto Route Optimization"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("autoRouteOptimizationDesc") ||
                        "Automatically select best route based on cost and speed"}
                    </p>
                  </div>
                  <Switch
                    id="auto-routing"
                    checked={globalSettings.autoRouting}
                    onCheckedChange={(checked) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        autoRouting: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-fee">
                    {t("defaultFeeMarkup") || "Default Fee Markup (%)"}
                  </Label>
                  <Input
                    id="default-fee"
                    type="number"
                    step="0.1"
                    value={globalSettings.defaultFeeMarkup}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        defaultFeeMarkup: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compliance-check">
                      {t("enhancedComplianceScreening") ||
                        "Enhanced Compliance Screening"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("enhancedComplianceScreeningDesc") ||
                        "Additional AML checks for high-risk destinations"}
                    </p>
                  </div>
                  <Switch
                    id="compliance-check"
                    checked={globalSettings.complianceCheck}
                    onCheckedChange={(checked) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        complianceCheck: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">
                    {t("maxRetryAttempts") || "Max Retry Attempts"}
                  </Label>
                  <Input
                    id="retry-attempts"
                    type="number"
                    value={globalSettings.maxRetryAttempts}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        maxRetryAttempts: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>
              </div>

              {/* Rate Configuration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  {t("rateConfiguration") || "Rate Configuration"}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">
                    {t("rateRefreshInterval") ||
                      "Rate Refresh Interval (seconds)"}
                  </Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    value={globalSettings.rateRefreshInterval}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        rateRefreshInterval: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin-threshold">
                    {t("marginAlertThreshold") || "Margin Alert Threshold (%)"}
                  </Label>
                  <Input
                    id="margin-threshold"
                    type="number"
                    step="0.01"
                    value={globalSettings.marginThreshold}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        marginThreshold: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekend-rates">
                      {t("weekendRateAdjustment") || "Weekend Rate Adjustment"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("weekendRateAdjustmentDesc") ||
                        "Apply different rates during weekends"}
                    </p>
                  </div>
                  <Switch
                    id="weekend-rates"
                    checked={globalSettings.weekendRates}
                    onCheckedChange={(checked) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        weekendRates: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="high-volume-discount">
                    {t("highVolumeDiscount") || "High Volume Discount (%)"}
                  </Label>
                  <Input
                    id="high-volume-discount"
                    type="number"
                    step="0.01"
                    value={globalSettings.highVolumeDiscount}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        highVolumeDiscount: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGlobalSettingsOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button variant="business" onClick={handleSaveGlobalSettings}>
                {t("saveSettings") || "Save Settings"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("confirmDelete") || "Confirm Delete"}
              </DialogTitle>
              <DialogDescription>
                {t("confirmDeleteDestinationDesc") ||
                  `Are you sure you want to delete ${selectedDestination?.country}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button variant="destructive" onClick={handleDeleteDestination}>
                {t("delete") || "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangePayoutConfig;
