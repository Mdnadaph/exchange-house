import ExchangeLayout from "@/components/layout/ExchangeLayout";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Check,
  ChevronsUpDown,
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
import { PermissionGate } from "@/contexts/PermissionGate";

export default function ExchangePayoutMechanism() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [payoutList, setPayoutList] = useState([]);
  const { toast } = useToast();
  const [countries, setCountries] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [allPayoutMechanism, setAllPayoutMechanism] = useState([]);
  const [editablePayoutMechanismData, setEditablePayoutMechanism] =
    useState<any>({});
  const [formData, setFormData] = useState({
    countryId: "",
    mechanisms: [] as {
      mechanismId?: number;
      payoutTypeId: number;
      currencyIds: number[];
    }[],
  });
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 10;
  const [errors, setErrors] = useState<{
    countryId?: string;
    mechanisms?: [];
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

  const getPayout = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/payout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res?.data?.status) {
        setPayoutList(res?.data?.data);
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const getCurrencyByCountry = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout-mechanism/currency/${formData?.countryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCurrencyList(res?.data?.data);
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const getAllPayoutMechanism = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout-mechanism?page=${currentPage}&size=${pageSize}&query=${encodeURIComponent(debouncedSearch)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAllPayoutMechanism(res?.data?.data?.content);
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountriesData();
    getPayout();
  }, []);

  useEffect(() => {
    getAllPayoutMechanism();
  }, [currentPage, debouncedSearch]);

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
    if (!formData?.countryId) return;
    getCurrencyByCountry();
  }, [formData?.countryId]);

  const handleCountryChange = (country: string) => {
    const countryData = countries.find((c) => c?.id === country);
    setFormData((prev) => ({ ...prev, countryId: country }));
    setSelectedCurrencies((prev) => [...prev, countryData?.currencyCode]);
    clearError("countryId");
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData?.countryId) {
      newErrors.countryId = "Country is required";
    }

    if (!formData?.mechanisms?.length) {
      newErrors.mechanisms = "Select at least one  mechanism";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const clearError = (field: "countryId" | "mechanisms") => {
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
  };

  const handleCreatePayoutMechanism = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/payout-mechanism`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        toast({ title: "Success", description: res?.data?.message });
        setIsCreateOpen(false);
        getAllPayoutMechanism();
        setFormData({
          countryId: "",
          mechanisms: [] as {
            payoutTypeId: number;
            currencyIds: number[];
          }[],
        });
        setCurrencyList([]);
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayoutMechanism = async () => {
    if (!validateForm()) return;
    // const payload = {
    //   mechanims: formData?.mechanisms?.map((m: any) => ({
    //     ...(m?.mechanismId ? { mechanismId: m.mechanismId } : {}), // ✅ correct
    //     payoutTypeId: m?.payoutTypeId,
    //     currencyIds: m?.currencyIds,
    //   })),
    // };
    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/payout-mechanism/country/${editablePayoutMechanismData?.countryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        toast({ title: "Success", description: res?.data?.message });
        setIsEditOpen(false);
        getAllPayoutMechanism();
        setEditablePayoutMechanism({});
        setFormData({
          countryId: "",
          mechanisms: [] as {
            payoutTypeId: number;
            currencyIds: number[];
          }[],
        });
        setCurrencyList([]);
      } else {
        toast({
          title: "Error",
          description: res?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setFormData({
      countryId: editablePayoutMechanismData?.country?.id,
      mechanisms: editablePayoutMechanismData?.mechanisms?.map((mec) => ({
        mechanismId: mec?.id,
        payoutTypeId: mec?.payoutType?.id,
        currencyIds: mec?.supportedCurrencies?.map((sc) => sc?.id),
      })),
    });
  }, [editablePayoutMechanismData]);

  const getDefaultCurrencyIds = () => {
    const selectedCountry = countries?.find(
      (c) => c?.id === formData?.countryId,
    );

    if (!selectedCountry) return [];

    return (
      currencyList
        ?.filter((c) => c?.code === selectedCountry?.currencyCode)
        ?.map((c) => c?.id) || []
    );
  };

  return (
    <ExchangeLayout>
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
          <PermissionGate permission="BTN_ADD_PAYOUT_MECHANISM">
            <Button variant="business" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payout Mechanism
            </Button>
          </PermissionGate>
        </div>
      </div>
      <div className="relative w-64 my-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by country or currency…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="space-y-3">
        {loading ? (
          <p className="text-xl text-gray-500 font-medium text-center">
            Loading...
          </p>
        ) : allPayoutMechanism?.length == 0 ? (
          <p className="text-center text-gray-500 font-medium ">
            No Data Found
          </p>
        ) : (
          <div className="space-y-5">
            {allPayoutMechanism?.map((payout) => (
              <Card
                key={payout?.countryId}
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
                            {payout?.country?.name}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <div>
                              {payout?.mechanisms?.map((pm) => (
                                <div className="space-y-3 mb-4" key={pm?.id}>
                                  <div className="flex gap-2">
                                    <h4>Payout:</h4>
                                    <p>{pm?.payoutType?.name}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <h4>Currencies:</h4>
                                    <div className="flex gap-2 items-center">
                                      {pm?.supportedCurrencies?.map((c) => (
                                        <div
                                          className="px-2 py-1 bg-blue-900 rounded-md"
                                          key={c?.id}
                                        >
                                          <span className="text-white">
                                            {c?.code}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      <PermissionGate permission="BTN_EDIT_PAYOUT_MECHANISM">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditOpen(true);
                            setEditablePayoutMechanism(payout);
                          }}
                        >
                          <Edit className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </PermissionGate>

                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
          </div>
        )}
      </div>

      {/* ── Create Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(o) => {
          setIsCreateOpen(o);
          setErrors({});
          setFormData({
            countryId: "",
            mechanisms: [],
          });
          setSelectedCurrencies([]);
          setCurrencyList([]);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Payout Mechanism</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            {/* COUNTRY */}
            <div className="space-y-2">
              <Label>Country *</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData?.countryId
                      ? countries?.find((c) => c?.id === formData?.countryId)
                          ?.name
                      : "Select country"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* 🔍 Search Input */}
                    <CommandInput placeholder="Search country..." />

                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>

                      <CommandGroup>
                        {countries?.map((country) => (
                          <CommandItem
                            key={country?.id}
                            value={country?.name}
                            onSelect={() => handleCountryChange(country?.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData?.countryId === country?.id
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

            {/* MECHANISMS */}
            <div className="mt-6">
              <Label>Payout Mechanisms *</Label>

              <div className="grid grid-cols-2 gap-2 border rounded-lg p-4 mt-2">
                {payoutList?.map((m) => (
                  <div key={m?.id}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formData?.mechanisms?.some(
                          (mec) => mec.payoutTypeId === m.id,
                        )}
                        onCheckedChange={() => {
                          clearError("mechanisms");
                          setFormData((prev) => {
                            const exists = prev?.mechanisms?.find(
                              (mec) => mec?.payoutTypeId === m.id,
                            );

                            if (exists) {
                              return {
                                ...prev,
                                mechanisms: prev?.mechanisms?.filter(
                                  (mec) => mec.payoutTypeId !== m.id,
                                ),
                              };
                            }

                            return {
                              ...prev,
                              mechanisms: [
                                ...(prev.mechanisms || []),
                                {
                                  payoutTypeId: m?.id,
                                  currencyIds: getDefaultCurrencyIds(),
                                },
                              ],
                            };
                          });
                        }}
                      />
                      <span>{m?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors?.mechanisms && (
                <p className="text-red-500 text-xs mt-2">
                  {errors?.mechanisms}
                </p>
              )}
            </div>

            {/* ✅ DYNAMIC CURRENCY SELECTION */}
            {formData?.mechanisms?.map((mechanism) => {
              const payout = payoutList?.find(
                (p) => p.id === mechanism.payoutTypeId,
              );

              if (!payout) return null;

              return (
                <div key={mechanism?.payoutTypeId} className="space-y-2 mt-6">
                  <Label>{payout.name} Currency</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Globe className="mr-2 h-4 w-4" />

                        {mechanism?.currencyIds?.length
                          ? currencyList
                              .filter((c) =>
                                mechanism?.currencyIds?.includes(c?.id),
                              )
                              .map((c) => c?.code)
                              .join(", ")
                          : "Select currencies..."}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-2">
                      <Command>
                        <CommandInput placeholder="Search currencies..." />

                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>No currency found.</CommandEmpty>

                          <CommandGroup>
                            {currencyList?.map((currency) => {
                              const isSelected =
                                mechanism?.currencyIds?.includes(currency?.id);

                              return (
                                <CommandItem
                                  key={currency?.id}
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      mechanisms: prev.mechanisms.map((m) => {
                                        if (
                                          m?.payoutTypeId !==
                                          mechanism?.payoutTypeId
                                        )
                                          return m;

                                        const exists = m?.currencyIds?.includes(
                                          currency?.id,
                                        );

                                        return {
                                          ...m,
                                          currencyIds: exists
                                            ? m?.currencyIds?.filter(
                                                (id) => id !== currency?.id,
                                              )
                                            : [...m?.currencyIds, currency?.id],
                                        };
                                      }),
                                    }));
                                  }}
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
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setFormData({
                  countryId: "",
                  mechanisms: [],
                });
                setSelectedCurrencies([]);
                setErrors({});
                setCurrencyList([]);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayoutMechanism} disabled={loading}>
              Create
            </Button>
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
            mechanisms: [],
          });
          setSelectedCurrencies([]);
          setCurrencyList([]);
          setEditablePayoutMechanism(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Payout Mechansim</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {/* COUNTRY */}
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
                    {formData?.countryId
                      ? countries?.find((c) => c?.id === formData?.countryId)
                          ?.name
                      : "Select country"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* 🔍 Search Input */}
                    <CommandInput placeholder="Search country..." />

                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>

                      <CommandGroup>
                        {countries?.map((country) => (
                          <CommandItem
                            key={country?.id}
                            value={country?.name}
                            onSelect={() => handleCountryChange(country?.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData?.countryId === country?.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {country.name}
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
            {/* MECHANISMS */}
            <div className="mt-6">
              <Label>Payout Mechanisms *</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-lg p-4 mt-2">
                {payoutList?.map((m) => (
                  <div key={m?.id}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formData?.mechanisms?.some(
                          (mec) => mec?.payoutTypeId === m?.id,
                        )}
                        onCheckedChange={() => {
                          clearError("mechanisms");
                          setFormData((prev) => {
                            const exists = prev?.mechanisms?.find(
                              (mec) => mec?.payoutTypeId === m?.id,
                            );

                            if (exists) {
                              return {
                                ...prev,
                                mechanisms: prev?.mechanisms?.filter(
                                  (mec) => mec?.payoutTypeId !== m?.id,
                                ),
                              };
                            }

                            return {
                              ...prev,
                              mechanisms: [
                                ...(prev?.mechanisms || []),
                                {
                                  payoutTypeId: m?.id,
                                  currencyIds: getDefaultCurrencyIds(),
                                },
                              ],
                            };
                          });
                        }}
                      />
                      <span>{m?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors?.mechanisms && (
                <p className="text-red-500 text-xs mt-2">
                  {errors?.mechanisms}
                </p>
              )}
            </div>

            {/* ✅ DYNAMIC CURRENCY SELECTION */}
            {formData?.mechanisms?.map((mechanism) => {
              const payout = payoutList?.find(
                (p) => p?.id === mechanism?.payoutTypeId,
              );

              if (!payout) return null;

              return (
                <div key={mechanism?.payoutTypeId} className="space-y-2 mt-6">
                  <Label>{payout?.name} Currency</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Globe className="mr-2 h-4 w-4" />

                        {mechanism?.currencyIds?.length
                          ? currencyList
                              .filter((c) =>
                                mechanism?.currencyIds?.includes(c?.id),
                              )
                              .map((c) => c?.code)
                              .join(", ")
                          : "Select currencies..."}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-2">
                      <Command>
                        <CommandInput placeholder="Search currencies..." />

                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>No currency found.</CommandEmpty>
                          <CommandGroup>
                            {currencyList?.map((currency) => {
                              const isSelected =
                                mechanism?.currencyIds?.includes(currency?.id);

                              return (
                                <CommandItem
                                  key={currency?.id}
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      mechanisms: prev.mechanisms.map((m) => {
                                        if (
                                          m.payoutTypeId !==
                                          mechanism.payoutTypeId
                                        )
                                          return m;

                                        const exists = m.currencyIds.includes(
                                          currency.id,
                                        );

                                        return {
                                          ...m,
                                          currencyIds: exists
                                            ? m?.currencyIds.filter(
                                                (id) => id !== currency.id,
                                              )
                                            : [...m.currencyIds, currency.id],
                                        };
                                      }),
                                    }));
                                  }}
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
                </div>
              );
            })}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setFormData({
                  countryId: "",
                  mechanisms: [],
                });
                setSelectedCurrencies([]);
                setErrors({});
                setCurrencyList([]);
                setEditablePayoutMechanism(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePayoutMechanism} disabled={loading}>
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
