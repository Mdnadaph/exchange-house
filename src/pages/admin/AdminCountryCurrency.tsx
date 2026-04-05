import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Currency = {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
};

type Country = {
  id: number;
  name: string;
  active: boolean;
  currencies: Currency[];
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_COUNTRIES: Country[] = [
  {
    id: 1,
    name: "United Arab Emirates",
    active: true,
    currencies: [
      { code: "AED", name: "UAE Dirham", symbol: "د.إ", exchangeRate: 1, isDefault: true },
      { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 0.272, isDefault: false },
    ],
  },
  {
    id: 2,
    name: "India",
    active: true,
    currencies: [
      { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 22.5, isDefault: true },
    ],
  },
  {
    id: 3,
    name: "United Kingdom",
    active: false,
    currencies: [
      { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.215, isDefault: true },
      { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.252, isDefault: false },
    ],
  },
];

// ─── Empty Helpers ────────────────────────────────────────────────────────────

const emptyCurrency = (): Currency => ({
  code: "",
  name: "",
  symbol: "",
  exchangeRate: 0,
  isDefault: false,
});

const emptyCountry = (): Omit<Country, "id"> => ({
  name: "",
  active: true,
  currencies: [{ ...emptyCurrency(), isDefault: true }],
});

// ─── Currency Row ─────────────────────────────────────────────────────────────

type CurrencyRowProps = {
  currency: Currency;
  index: number;
  onChange: (index: number, field: keyof Currency, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  errors: { [key: string]: string };
};

const CurrencyRow: React.FC<CurrencyRowProps> = ({
  currency,
  index,
  onChange,
  onRemove,
  canRemove,
  errors,
}) => (
  <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-muted-foreground">
        Currency #{index + 1}
      </span>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive h-7 w-7 p-0"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-xs">
          Currency Code <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="e.g. AED"
          value={currency.code}
          onChange={(e) => onChange(index, "code", e.target.value.toUpperCase())}
          maxLength={5}
          className="uppercase"
        />
        {errors[`currencies.${index}.code`] && (
          <p className="text-xs text-destructive mt-1">{errors[`currencies.${index}.code`]}</p>
        )}
      </div>

      <div>
        <Label className="text-xs">
          Currency Name <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="e.g. UAE Dirham"
          value={currency.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
        {errors[`currencies.${index}.name`] && (
          <p className="text-xs text-destructive mt-1">{errors[`currencies.${index}.name`]}</p>
        )}
      </div>

      <div>
        <Label className="text-xs">
          Symbol <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="e.g. $"
          value={currency.symbol}
          onChange={(e) => onChange(index, "symbol", e.target.value)}
          maxLength={5}
        />
        {errors[`currencies.${index}.symbol`] && (
          <p className="text-xs text-destructive mt-1">{errors[`currencies.${index}.symbol`]}</p>
        )}
      </div>

      <div>
        <Label className="text-xs">
          Exchange Rate <span className="text-destructive">*</span>
        </Label>
        <Input
          type="number"
          placeholder="e.g. 1.0"
          value={currency.exchangeRate || ""}
          onChange={(e) => onChange(index, "exchangeRate", parseFloat(e.target.value) || 0)}
          onWheel={(e) => e.currentTarget.blur()}
          step="0.0001"
          min="0"
        />
        {errors[`currencies.${index}.exchangeRate`] && (
          <p className="text-xs text-destructive mt-1">
            {errors[`currencies.${index}.exchangeRate`]}
          </p>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2 pt-1">
      <Switch
        checked={currency.isDefault}
        onCheckedChange={(v) => onChange(index, "isDefault", v)}
        id={`default-${index}`}
      />
      <Label htmlFor={`default-${index}`} className="text-xs cursor-pointer">
        Set as default currency
      </Label>
    </div>
  </div>
);

// ─── Country Form (shared for Create & Edit) ──────────────────────────────────

type CountryFormProps = {
  form: Omit<Country, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Country, "id">>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

const CountryForm: React.FC<CountryFormProps> = ({ form, setForm, errors, setErrors }) => {
  const clearError = (key: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  const handleCurrencyChange = (index: number, field: keyof Currency, value: any) => {
    setForm((prev) => {
      const currencies = [...prev.currencies];
      if (field === "isDefault" && value === true) {
        currencies.forEach((_, i) => {
          currencies[i] = { ...currencies[i], isDefault: i === index };
        });
      } else {
        currencies[index] = { ...currencies[index], [field]: value };
      }
      return { ...prev, currencies };
    });
    clearError(`currencies.${index}.${field}`);
  };

  const addCurrency = () =>
    setForm((prev) => ({ ...prev, currencies: [...prev.currencies, emptyCurrency()] }));

  const removeCurrency = (index: number) =>
    setForm((prev) => {
      const currencies = prev.currencies.filter((_, i) => i !== index);
      if (!currencies.some((c) => c.isDefault) && currencies.length > 0) {
        currencies[0] = { ...currencies[0], isDefault: true };
      }
      return { ...prev, currencies };
    });

  return (
    <div className="space-y-5">
      {/* Country Name */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground border-b pb-2">Country Details</h4>
        <div>
          <Label>
            Country Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. United Arab Emirates"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              clearError("name");
            }}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={form.active}
            onCheckedChange={(v) => setForm((prev) => ({ ...prev, active: v }))}
            id="country-active"
          />
          <Label htmlFor="country-active" className="cursor-pointer text-sm">Active</Label>
        </div>
      </div>

      {/* Currencies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="text-sm font-semibold text-foreground">
            Currencies{" "}
            <span className="text-muted-foreground font-normal">({form.currencies.length})</span>
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addCurrency} className="h-8 text-xs gap-1">
            <Plus className="h-3 w-3" />
            Add Currency
          </Button>
        </div>
        {errors.currencies && <p className="text-xs text-destructive">{errors.currencies}</p>}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {form.currencies.map((currency, index) => (
            <CurrencyRow
              key={index}
              currency={currency}
              index={index}
              onChange={handleCurrencyChange}
              onRemove={removeCurrency}
              canRemove={form.currencies.length > 1}
              errors={errors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminCountryCurrency() {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>(DUMMY_COUNTRIES);
  const [search, setSearch] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null);

  const [createForm, setCreateForm] = useState<Omit<Country, "id">>(emptyCountry());
  const [editForm, setEditForm] = useState<Omit<Country, "id">>(emptyCountry());
  const [editId, setEditId] = useState<number | null>(null);
  const [createErrors, setCreateErrors] = useState<{ [key: string]: string }>({});
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  // ── Stat Cards ─────────────────────────────────────────────────────────────

  const totalCurrencies = countries.reduce((acc, c) => acc + c.currencies.length, 0);
  const activeCount = countries.filter((c) => c.active).length;
  const inactiveCount = countries.length - activeCount;

  const statCards = [
    {
      title: "Total Countries",
      value: countries.length,
      icon: Globe,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      valueColor: "text-foreground",
    },
    {
      title: "Total Currencies",
      value: totalCurrencies,
      icon: DollarSign,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      valueColor: "text-foreground",
    },
    {
      title: "Active Countries",
      value: activeCount,
      icon: CheckCircle,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      valueColor: "text-success",
    },
    {
      title: "Inactive Countries",
      value: inactiveCount,
      icon: XCircle,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      valueColor: "text-destructive",
    },
  ];

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (form: Omit<Country, "id">) => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = "Country name is required";
    if (!form.currencies.length) errors.currencies = "At least one currency is required";
    form.currencies.forEach((c, i) => {
      if (!c.code.trim()) errors[`currencies.${i}.code`] = "Code is required";
      if (!c.name.trim()) errors[`currencies.${i}.name`] = "Name is required";
      if (!c.symbol.trim()) errors[`currencies.${i}.symbol`] = "Symbol is required";
      if (!c.exchangeRate || c.exchangeRate <= 0)
        errors[`currencies.${i}.exchangeRate`] = "Exchange rate must be > 0";
    });
    return errors;
  };

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  const handleCreate = () => {
    const errors = validate(createForm);
    if (Object.keys(errors).length > 0) { setCreateErrors(errors); return; }
    setCountries((prev) => [...prev, { ...createForm, id: Date.now() }]);
    toast({ title: "Success", description: "Country created successfully" });
    setIsCreateOpen(false);
    setCreateForm(emptyCountry());
    setCreateErrors({});
  };

  const openEdit = (country: Country) => {
    const { id, ...rest } = country;
    setEditId(id);
    setEditForm(JSON.parse(JSON.stringify(rest)));
    setEditErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    const errors = validate(editForm);
    if (Object.keys(errors).length > 0) { setEditErrors(errors); return; }
    setCountries((prev) => prev.map((c) => (c.id === editId ? { ...editForm, id: editId! } : c)));
    toast({ title: "Success", description: "Country updated successfully" });
    setIsEditOpen(false);
    setEditId(null);
  };

  const openDelete = (country: Country) => { setDeleteTarget(country); setIsDeleteOpen(true); };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCountries((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast({ title: "Deleted", description: `${deleteTarget.name} removed` });
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleToggleActive = (id: number, active: boolean) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
    toast({ title: "Updated", description: `Country ${active ? "activated" : "deactivated"}` });
  };

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.currencies.some((cur) => cur.code.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Country &amp; Currency</h1>
            <p className="text-muted-foreground">
              Manage countries and their associated currencies
            </p>
          </div>
          <Button
            variant="business"
            onClick={() => {
              setCreateForm(emptyCountry());
              setCreateErrors({});
              setIsCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${card.valueColor}`}>{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Country List Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Countries ({filtered.length})
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
          <CardContent className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No countries found.</div>
            ) : (
              filtered.map((country) => (
                <Card key={country.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">
                              {country.name}
                            </h4>
                            <Badge variant={country.active ? "default" : "secondary"} className="text-xs">
                              {country.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {/* Currency chips */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {country.currencies.map((cur) => (
                              <div
                                key={cur.code}
                                className="flex items-center gap-1.5 bg-muted/40 rounded-md px-2.5 py-1"
                              >
                                <DollarSign className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-semibold">{cur.code}</span>
                                <span className="text-xs text-muted-foreground">
                                  · {cur.symbol} · {cur.name} · {cur.exchangeRate}x
                                </span>
                                {cur.isDefault && (
                                  <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={country.active}
                          onCheckedChange={(v) => handleToggleActive(country.id, v)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(country)}
                          className="gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/5"
                          onClick={() => openDelete(country)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Create Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(o) => {
          setIsCreateOpen(o);
          if (!o) { setCreateErrors({}); setCreateForm(emptyCountry()); }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <CountryForm
              form={createForm}
              setForm={setCreateForm}
              errors={createErrors}
              setErrors={setCreateErrors}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Country</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ───────────────────────────────────────────────────────── */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(o) => {
          setIsEditOpen(o);
          if (!o) setEditErrors({});
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <CountryForm
              form={editForm}
              setForm={setEditForm}
              errors={editErrors}
              setErrors={setEditErrors}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Country</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Country</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This
            action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}