import ExchangeLayout from "@/components/layout/ExchangeLayout";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  X,
  Search,
  CheckCircle,
  XCircle,
  Currency,
  Check,
  MapPin,
  Edit,
  ChevronsUpDown,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { cn } from "@/lib/utils";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import axios from "axios";
import { PermissionGate } from "@/contexts/PermissionGate";

export default function ExchangeCountryCurrency() {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [countries, setCountries] = useState([]);
  const [currenciesData, setCurrenciesData] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [countryId, setCountryId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryAndCurrencyList, setCountryAndCurrencyList] = useState([]);
  const [editableCountryData, setEditableCountryData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 10;
  const [errors, setErrors] = useState<{
    countryId?: string;
    currencies?: string;
  }>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!countryId) {
      newErrors.countryId = "Country is required";
    }

    if (selectedCurrencies?.length === 0) {
      newErrors.currencies = "Select at least one currency";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: "countryId" | "currencies") => {
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
  };
  // ── Stat Cards ─────────────────────────────────────────────────────────────

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

  const getCurrenciesData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/currencies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setCurrenciesData(json.data);
    } catch (error) {
      const msg = error.message || "Failed to load countries";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const getCurrencyAndCountry = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/country-currency?page=${currentPage}&size=${pageSize}&query=${encodeURIComponent(debouncedSearch)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCountryAndCurrencyList(res?.data?.data?.content);
      setTotalPages(res?.data?.data?.totalPages);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to fetch currency and country",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountriesData();
    getCurrenciesData();
  }, []);

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

  useEffect(() => {
    getCurrencyAndCountry();
  }, [currentPage, debouncedSearch]);

  const handleCountryChange = (country: string) => {
    const countryData = countries?.find((c) => c?.id === country);
    const currency = currenciesData?.find(
      (cc) => cc?.code == countryData?.currencyCode,
    );
    setCountryId(country);
    if (currency?.id) {
      setSelectedCurrencies([currency.id]);
    } else {
      setSelectedCurrencies([]);
    }

    clearError("countryId");
  };

  const handleCreateCurrencyAndCountry = async () => {
    if (!validateForm()) return;
    const payload = {
      countryId,
      supportedCurrencies: selectedCurrencies,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/country-currency/create`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res?.data?.status) {
        setCountryId("");
        setSelectedCurrencies([]);
        setIsCreateOpen(false);
        getCurrencyAndCountry();
        toast({ title: "Success", description: res?.data?.message });
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCurrencyAndCountry = async () => {
    if (!validateForm()) return;
    const payload = {
      countryId,
      supportedCurrencies: selectedCurrencies,
    };
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/country-currency/country/${editableCountryData?.countryId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res?.data?.status) {
        setCountryId("");
        setSelectedCurrencies([]);
        setIsEditOpen(false);
        setEditableCountryData({});
        getCurrencyAndCountry();
        toast({ title: "Success", description: res?.data?.message });
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCountryId(editableCountryData?.country?.id);
    const currencyId = editableCountryData?.supportedCurrencies?.map(
      (sc: { id: number }) => sc?.id,
    );
    setSelectedCurrencies(currencyId);
  }, [editableCountryData]);
  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Country &amp; Currency
            </h1>
            <p className="text-muted-foreground">
              Manage countries and their associated currencies
            </p>
          </div>
          <PermissionGate permission="BTN_ADD_COUNTRY">
            <Button
              variant="business"
              onClick={() => {
                setIsCreateOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </PermissionGate>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-1">
            <Label htmlFor="search" className="mb-1 block">
              Search Currency or Country
            </Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by country or currency…"
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(0);
                  setSearchQuery(e.target.value);
                }}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Country List Card */}

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Loading Country and Currency...
                </p>
              </div>
            </div>
          ) : countryAndCurrencyList?.length == 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Country and Currency found
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {countryAndCurrencyList?.map((cc) => (
                <Card
                  key={cc?.countryId}
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
                              {cc?.country?.name}
                            </h4>
                            <div className="text-sm text-muted-foreground w-full flex items-center gap-3">
                              <div> Currencies: </div>
                              <div className="flex gap-2 items-center">
                                {cc?.supportedCurrencies?.map(
                                  (currency: { code: string; id: number }) => (
                                    <div
                                      className="px-2 py-1 bg-blue-900 rounded-md"
                                      key={currency?.id}
                                    >
                                      <span className="text-white">
                                        {currency?.code}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <PermissionGate permission="BTN_EDIT_COUNTRY">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditOpen(true);
                              setEditableCountryData(cc);
                            }}
                          >
                            <Edit className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </PermissionGate>

                        <PermissionGate permission="BTN_DELETE_COUNTRY">
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDeleteOpen(true)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </PermissionGate>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Pagination */}
              {/* {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 0) setCurrentPage(currentPage - 1);
                        }}
                        aria-disabled={currentPage <= 0}
                        className={
                          currentPage <= 0
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i);
                          }}
                          isActive={currentPage === i}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages - 1)
                            setCurrentPage(currentPage + 1);
                        }}
                        aria-disabled={currentPage >= totalPages - 1}
                        className={
                          currentPage >= totalPages - 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )} */}

              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 0) setCurrentPage(currentPage - 1);
                      }}
                      aria-disabled={currentPage <= 0}
                      className={
                        currentPage <= 0 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i);
                        }}
                        isActive={currentPage === i}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages - 1)
                          setCurrentPage(currentPage + 1);
                      }}
                      aria-disabled={currentPage >= totalPages - 1}
                      className={
                        currentPage >= totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(o) => {
          setIsCreateOpen(o);
          setErrors({});
          setCountryId("");
          setSelectedCurrencies([]);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Country and Currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <div className="space-y-2">
              <Label>Country *</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {countryId
                      ? countries?.find((c) => c?.id === countryId)?.name
                      : "Select country"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* 🔍 Search input */}
                    <CommandInput placeholder="Search country..." />

                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>

                      <CommandGroup>
                        {countries?.map((country) => (
                          <CommandItem
                            key={country?.id}
                            value={country?.name}
                            onSelect={() => {
                              handleCountryChange(country?.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                countryId === country?.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {country?.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors?.countryId && (
                <p className="text-red-500 text-xs">{errors?.countryId}</p>
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

                    {selectedCurrencies?.length > 0
                      ? currenciesData
                          ?.filter((currencyList) =>
                            selectedCurrencies?.includes(currencyList?.id),
                          )
                          ?.map((c) => c?.code)
                          .join(", ")
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
                        {currenciesData?.map((currency) => {
                          const isSelected = selectedCurrencies?.includes(
                            currency?.id,
                          );

                          return (
                            <CommandItem
                              key={currency?.id}
                              onSelect={() => {
                                clearError("currencies");
                                setSelectedCurrencies((prev) => {
                                  const exists = prev.includes(currency?.id);

                                  return exists
                                    ? prev.filter((c) => c !== currency?.id)
                                    : [...prev, currency?.id];
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
                              {currency?.code}
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
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setCountryId("");
                setSelectedCurrencies([]);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleCreateCurrencyAndCountry}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ───────────────────────────────────────────────────────── */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(o) => {
          setIsEditOpen(o);
          setCountryId("");
          setSelectedCurrencies([]);
          setErrors({});
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Country and Currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <div className="space-y-2">
              <Label>Country *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled
                  >
                    {countryId
                      ? countries?.find((c) => c?.id === countryId)?.name
                      : "Select country"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* 🔍 Search input */}
                    <CommandInput placeholder="Search country..." />

                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>

                      <CommandGroup>
                        {countries?.map((country) => (
                          <CommandItem
                            key={country?.id}
                            value={country?.name}
                            onSelect={() => {
                              handleCountryChange(country?.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                countryId === country?.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {country?.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors?.countryId && (
                <p className="text-red-500 text-xs">{errors?.countryId}</p>
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

                    {selectedCurrencies?.length > 0
                      ? currenciesData
                          ?.filter((currencyList) =>
                            selectedCurrencies?.includes(currencyList?.id),
                          )
                          ?.map((c) => c?.code)
                          .join(", ")
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
                        {currenciesData?.map((currency) => {
                          const isSelected = selectedCurrencies?.includes(
                            currency.id,
                          );

                          return (
                            <CommandItem
                              key={currency.id}
                              onSelect={() => {
                                clearError("currencies");
                                setSelectedCurrencies((prev) => {
                                  const exists = prev.includes(currency.id);

                                  return exists
                                    ? prev.filter((c) => c !== currency?.id)
                                    : [...prev, currency?.id];
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
                              {currency?.code}
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
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setCountryId("");
                setSelectedCurrencies([]);
                setErrors({});
                setEditableCountryData({});
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={() => handleUpdateCurrencyAndCountry()}
            >
              Update
            </Button>
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
    </ExchangeLayout>
  );
}
