import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Check,
  Currency,
  Edit,
  Globe,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Label } from "recharts";
const payoutMechansimData = [
  {
    id: 1,
    name: "Bank Transfer",
  },
  {
    id: 2,
    name: "Wallet",
  },
];

const data = [
  {
    id: 1,
    countryName: "India",
    currencies: ["AED", "IND"],
    payoutMechanism: "Bank Transfer",
  },
  {
    id: 2,
    countryName: "Nepal",
    currencies: ["AED", "NPR"],
    payoutMechanism: "Wallet",
  },
];

export default function AdminPayoutMechanism() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    countryId: "",
    payoutMechanism: "",
  });
  const [search, setSearch] = useState("");
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [errors, setErrors] = useState<{
    countryId?: string;
    currencies?: string;
    payoutMechanism?: string;
  }>({});

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

  useEffect(() => {
    getCountriesData();
  }, []);
  const handleCountryChange = (country: string) => {
    const countryData = countries.find((c) => c?.id === country);
    setFormData((prev) => ({ ...prev, countryId: country }));
    setSelectedCurrencies((prev) => [...prev, countryData?.currencyCode]);
    clearError("countryId");
  };
  const handlePayoutMechanismChange = (value: string) => {
    setFormData((prev) => ({ ...prev, payoutMechanism: value }));
    clearError("payoutMechanism");
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData?.countryId) {
      newErrors.countryId = "Country is required";
    }

    if (!formData?.payoutMechanism) {
      newErrors.payoutMechanism = "Payout mechanism is required";
    }

    if (selectedCurrencies.length === 0) {
      newErrors.currencies = "Select at least one currency";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const clearError = (
    field: "countryId" | "currencies" | "payoutMechanism",
  ) => {
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
  };

  const handleCreatePayoutMechanism = async () => {
    if (!validateForm()) return;
    const payload = {
      currencies: selectedCurrencies,
      ...formData,
    };
    console.log("payload", payload);
  };

  const handleUpdatePayoutMechanism = async () => {
    if (!validateForm()) return;
    const payload = {
      currencies: selectedCurrencies,
      ...formData,
    };
    console.log("payload", payload);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Payout Mechanism
            </h1>
            <p className="text-muted-foreground">
              Manage payout methods by configuring countries and their supported
              currencies.
            </p>
          </div>
          <Button variant="business" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payout Mechanism
          </Button>
        </div>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Countries 3
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by country or currency…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.map((payout) => (
              <Card key={payout?.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground">
                            {payout?.countryName}
                          </h4>
                          <div className="text-sm text-muted-foreground w-full flex items-center gap-3">
                            <div> Currencies: </div>
                            <div className="flex gap-2 items-center">
                              {payout?.currencies?.map((currency: string) => (
                                <div className="px-2 py-1 bg-blue-900 rounded-md">
                                  <span className="text-white">{currency}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground w-full flex items-center gap-3">
                            <div>Payout Mechanism: </div>
                            <div className="flex gap-2 items-center">
                              <p>{payout?.payoutMechanism}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* ── Create Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(o) => {
          setIsCreateOpen(o);
          setErrors({});
          setFormData({
            countryId: "",
            payoutMechanism: "",
          });
          setSelectedCurrencies([]);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Payout Mechansim</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{"Country"} *</Label>
              <Select
                value={formData?.countryId}
                onValueChange={(value) => handleCountryChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country?.id} value={country?.id}>
                      {country?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryId && (
                <p className="text-red-500 text-xs">{errors.countryId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Globe className="mr-2 h-4 w-4 shrink-0" />

                    {selectedCurrencies.length > 0
                      ? selectedCurrencies.join(", ")
                      : "Select currencies..."}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-2" align="start">
                  <Command className="w-full">
                    <CommandInput placeholder="Search currencies..." />
                    <CommandList
                      className="w-full max-h-60 overflow-y-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <CommandGroup className="w-full">
                        {countries?.map((country) => {
                          const isSelected = selectedCurrencies.includes(
                            country.currencyCode,
                          );

                          return (
                            <CommandItem
                              key={country.id}
                              onSelect={() => {
                                clearError("currencies");
                                setSelectedCurrencies((prev) => {
                                  const exists = prev.includes(
                                    country.currencyCode,
                                  );

                                  return exists
                                    ? prev.filter(
                                        (c) => c !== country.currencyCode,
                                      )
                                    : [...prev, country.currencyCode];
                                });
                              }}
                              className="flex items-center gap-2"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {country.currencyCode}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors.currencies && (
                <p className="text-red-500 text-xs">{errors.currencies}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{"Payout Mechanism"} *</Label>
              <Select
                value={formData?.payoutMechanism}
                onValueChange={(value) => handlePayoutMechanismChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select Payout Mechanism"} />
                </SelectTrigger>
                <SelectContent>
                  {payoutMechansimData?.map((payout) => (
                    <SelectItem key={payout?.id} value={payout?.name}>
                      {payout?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payoutMechanism && (
                <p className="text-red-500 text-xs">{errors.payoutMechanism}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setFormData({
                  countryId: "",
                  payoutMechanism: "",
                });
                setSelectedCurrencies([]);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayoutMechanism}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ── Update Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(o) => {
          setIsEditOpen(o);
          setErrors({});
          setFormData({
            countryId: "",
            payoutMechanism: "",
          });
          setSelectedCurrencies([]);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Payout Mechansim</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{"Country"} *</Label>
              <Select
                value={formData?.countryId}
                onValueChange={(value) => handleCountryChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country?.id} value={country?.id}>
                      {country?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryId && (
                <p className="text-red-500 text-xs">{errors.countryId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Globe className="mr-2 h-4 w-4 shrink-0" />

                    {selectedCurrencies.length > 0
                      ? selectedCurrencies.join(", ")
                      : "Select currencies..."}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-2" align="start">
                  <Command className="w-full">
                    <CommandInput placeholder="Search currencies..." />
                    <CommandList
                      className="w-full max-h-60 overflow-y-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <CommandGroup className="w-full">
                        {countries?.map((country) => {
                          const isSelected = selectedCurrencies.includes(
                            country.currencyCode,
                          );

                          return (
                            <CommandItem
                              key={country.id}
                              onSelect={() => {
                                clearError("currencies");
                                setSelectedCurrencies((prev) => {
                                  const exists = prev.includes(
                                    country.currencyCode,
                                  );

                                  return exists
                                    ? prev.filter(
                                        (c) => c !== country.currencyCode,
                                      )
                                    : [...prev, country.currencyCode];
                                });
                              }}
                              className="flex items-center gap-2"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {country.currencyCode}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors.currencies && (
                <p className="text-red-500 text-xs">{errors.currencies}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{"Payout Mechanism"} *</Label>
              <Select
                value={formData?.payoutMechanism}
                onValueChange={(value) => handlePayoutMechanismChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select Payout Mechanism"} />
                </SelectTrigger>
                <SelectContent>
                  {payoutMechansimData?.map((payout) => (
                    <SelectItem key={payout?.id} value={payout?.name}>
                      {payout?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payoutMechanism && (
                <p className="text-red-500 text-xs">{errors.payoutMechanism}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setFormData({
                  countryId: "",
                  payoutMechanism: "",
                });
                setSelectedCurrencies([]);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePayoutMechanism}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Country and Currency</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete.{" "}
            {/* <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? */}
            This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {}}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
