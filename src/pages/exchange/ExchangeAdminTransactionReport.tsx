import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

// ─── TYPES ─────────────────────────────

interface CountryCurrency {
  countryName: string;
  currencyCode: string;
}

// ─── CONSTANTS ─────────────────────────

const statusList = [
  "CLEAR",
  "FLAGGED",
  "MANUAL_REVIEW",
  "REVIEW_REQUIRED",
  "REPORTED",
  "BLOCKED",
];

const transactionTypes = ["SINGLE", "BULK"];

// ─── COMPONENT ─────────────────────────

function ExchangeAdminTransactionReport() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // ─── FILTER STATE ─────────────────────

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "",
    transactionType: "",
    payoutCountry: "",
    currency: "",
    minAmount: "",
    maxAmount: "",
    blocked: false,
    requiresReview: false,
    transactionReference: "",
  });

  // ─── COUNTRY + CURRENCY ───────────────

  const [countryData, setCountryData] = useState<CountryCurrency[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  // ─── REPORT DATA ──────────────────────

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ─── FETCH COUNTRY/CURRENCY ───────────

  const fetchCountryCurrency = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/payout/config/compliance-currencies`,
        { headers: getHeaders() }
      );

      const data: CountryCurrency[] = res.data?.data || [];

      setCountryData(data);

      // ✅ Unique countries (typed)
      const uniqueCountries = Array.from(
        new Set<string>(data.map((item) => item.countryName))
      );

      setCountries(uniqueCountries);
    } catch (err) {
      console.error("Country API Error:", err);
    }
  };

  // ─── HANDLE COUNTRY CHANGE ────────────

  const handleCountryChange = (country: string) => {
    setFilters((prev) => ({
      ...prev,
      payoutCountry: country,
      currency: "",
    }));

    // ✅ Unique currencies based on selected country
    const filteredCurrencies = Array.from(
      new Set(
        countryData
          .filter((item) => item.countryName === country)
          .map((item) => item.currencyCode)
      )
    );

    setCurrencies(filteredCurrencies);
  };

  // ─── SEARCH API ───────────────────────

  const handleSearch = async () => {
    setLoading(true);

    try {
      const payload = {
        ...filters,
        minAmount: filters.minAmount
          ? Number(filters.minAmount)
          : undefined,
        maxAmount: filters.maxAmount
          ? Number(filters.maxAmount)
          : undefined,
      };

      const res = await axios.post(
        `${BASE_URL}/api/v1/compliance/reports/search?page=0&size=10`,
        payload,
        { headers: getHeaders() }
      );

      setReports(res.data?.data?.content || []);
    } catch (err) {
      console.error("Search API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── EFFECT ───────────────────────────

  useEffect(() => {
    if (token) {
      fetchCountryCurrency();
    }
  }, [token]);

  // ─── UI ───────────────────────────────

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Transaction Report
          </h1>
          <p className="text-muted-foreground">
            Search and monitor compliance transactions
          </p>
        </div>

        {/* FILTER */}
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

            <Input
              type="date"
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />

            <Input
              type="date"
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />

            <Select
              onValueChange={(val) =>
                setFilters({ ...filters, status: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) =>
                setFilters({ ...filters, transactionType: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) =>
                setFilters({ ...filters, currency: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Min Amount"
              type="number"
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
            />

            <Input
              placeholder="Max Amount"
              type="number"
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
            />

            <Input
              placeholder="Transaction Ref"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  transactionReference: e.target.value,
                })
              }
            />

            <div className="flex justify-between items-center">
              <Label>Blocked</Label>
              <Switch
                checked={filters.blocked}
                onCheckedChange={(val) =>
                  setFilters({ ...filters, blocked: val })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <Label>Requires Review</Label>
              <Switch
                checked={filters.requiresReview}
                onCheckedChange={(val) =>
                  setFilters({ ...filters, requiresReview: val })
                }
              />
            </div>

            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>

          </CardContent>
        </Card>

        {/* RESULT */}
        <Card>
          <CardContent className="p-4">
            {reports.length === 0 ? (
              <p>No data found</p>
            ) : (
              <pre>{JSON.stringify(reports, null, 2)}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
}

export default ExchangeAdminTransactionReport;