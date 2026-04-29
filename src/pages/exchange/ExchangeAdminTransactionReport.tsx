import React, { useEffect, useState } from "react";
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
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// ─── TYPES ─────────────────────────────

interface CountryCurrency {
  countryName: string;
  currencyCode: string;
}

// ─── CONSTANTS ─────────────────────────

export const statusList = [
  { value: "All", label: "All" },
  { value: "INTERNAL_REVIEW_PENDING", label: "Internal Review Pending" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  {
    value: "PAYMENT_VERIFICATION_PENDING",
    label: "Payment Verification Pending",
  },
  { value: "COMPLIANCE_REVIEW", label: "Compliance Review" },
  { value: "PROOF_OF_PAYMENT_PENDING", label: "Proof Of Payment Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "FAILED", label: "Failed" },
  { value: "RATE_DEAL_PENDING", label: "Rate Deal Pending" },
  { value: "RATE_DEAL_APPROVED", label: "Rate Deal Approved" },
  { value: "RATE_DEAL_REJECTED", label: "Rate Deal Rejected" },
  { value: "RATE_DEAL_COUNTER_PROPOSAL", label: "Rate Deal Counter Proposal" },
  { value: "RATE_DEAL_EXPIRED", label: "Rate Deal Expired" },
];

const transactionTypes = ["BOTH", "SINGLE", "BULK"];

// ─── COMPONENT ─────────────────────────

function ExchangeAdminTransactionReport() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();
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
        { headers: getHeaders() },
      );

      const data: CountryCurrency[] = res.data?.data || [];

      setCountryData(data);

      // ✅ Unique countries (typed)
      const uniqueCountries = Array.from(
        new Set<string>(data.map((item) => item.countryName)),
      );

      setCountries(uniqueCountries);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: err?.response?.data?.message || "Something went wrong",
      });
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
          .map((item) => item.currencyCode),
      ),
    );

    setCurrencies(filteredCurrencies);
  };

  // ─── SEARCH API ───────────────────────

  const handleSearch = async () => {
    setLoading(true);

    try {
      // const payload = {
      //   ...filters,
      //   minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
      //   maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      // };

      const payload = Object.fromEntries(
        Object.entries({
          ...filters,
          minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
          maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
        }).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const res = await axios.post(
        `${BASE_URL}/api/v1/transaction-reports/search?page=0&size=10`,
        payload,
        { headers: getHeaders() },
      );

      console.log("res", res);

      if (!res?.data?.status) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: res?.data?.message || "Something went wrong",
        });
      }

      setReports(res.data?.data || []);
    } catch (err) {
      console.error("Search API Error:", err);
      toast({
        variant: "destructive",
        title: "Failed",
        description: err?.response?.data?.message || "Something went wrong",
      });
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
  const getStatusBadge = (status: string) => {
    const statusMap = {
      COMPLETED: {
        variant: "default" as const,
        label: "Completed",
        icon: CheckCircle,
      },
      INTERNAL_REVIEW_PENDING: {
        variant: "secondary" as const,
        label: "Internal Review Pending",
        icon: Clock,
      },
      PENDING_APPROVAL: {
        variant: "secondary" as const,
        label: "Pending Approval",
        icon: Clock,
      },
      PAYMENT_PENDING: {
        variant: "secondary" as const,
        label: "Pending Payment",
        icon: Clock,
      },
      PAYMENT_VERIFICATION_PENDING: {
        variant: "secondary" as const,
        label: "Payment Verification Pending",
        icon: Clock,
      },
      PROOF_OF_PAYMENT_PENDING: {
        variant: "secondary" as const,
        label: "Proof Of Payment Pending",
        icon: Clock,
      },
      RATE_DEAL_PENDING: {
        variant: "secondary" as const,
        label: "Rate Deal Pending",
        icon: Clock,
      },
      RATE_DEAL_APPROVED: {
        variant: "secondary" as const,
        label: "Rate Deal Approved",
        icon: CheckCircle,
      },
      RATE_DEAL_REJECTED: {
        variant: "destructive" as const,
        label: "Rate Deal Rejected",
        icon: CheckCircle,
      },
      RATE_DEAL_COUNTER_PROPOSAL: {
        variant: "outline" as const,
        label: "Rate Deal Counter Proposal",
        icon: CheckCircle,
      },
      RATE_DEAL_EXPIRED: {
        variant: "outline" as const,
        label: "Rate Deal Expired",
        icon: CheckCircle,
      },
      APPROVED: {
        variant: "secondary" as const,
        label: "Approved",
        icon: Clock,
      },
      PROCESSING: {
        variant: "destructive" as const,
        label: "Processing",
        icon: Clock,
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        icon: AlertCircle,
      },
      REJECTED: {
        variant: "destructive" as const,
        label: "Rejetced",
        icon: AlertCircle,
      },
      DRAFT: {
        variant: "outline" as const,
        label: "Draft",
        icon: AlertCircle,
      },
      COMPLIANCE_REVIEW: {
        variant: "outline" as const,
        label: "Compliance Review",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap?.PROCESSING;
  };

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Transaction Report</h1>
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
                setFilters({ ...filters, status: val == "All" ? "" : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusList?.map((s, index) => (
                  <SelectItem key={index} value={s?.value}>
                    {s?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) =>
                setFilters({
                  ...filters,
                  transactionType: val == "BOTH" ? "" : val,
                })
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
              onValueChange={(val) => setFilters({ ...filters, currency: val })}
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
          <CardContent className="p-4 space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">
                Loading...
              </div>
            ) : reports?.length === 0 ? (
              <p className="text-center text-muted-foreground">No data found</p>
            ) : (
              reports?.map((txn) => (
                <div
                  key={txn.id + txn.reference}
                  className="border rounded-lg p-4 space-y-2"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{txn?.reference}</h3>

                    <Badge variant={getStatusBadge(txn?.status)?.variant}>
                      <span className="flex items-center gap-1">
                        {React.createElement(
                          getStatusBadge(txn?.status)?.icon,
                          { className: "w-3 h-3" },
                        )}
                        {getStatusBadge(txn?.status)?.label}
                      </span>
                    </Badge>
                  </div>

                  {/* Main Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Type:</span>{" "}
                      {txn?.transactionType}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Amount:
                      </span>{" "}
                      {txn?.sourceAmount} {txn?.destinationCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Net Payout:
                      </span>{" "}
                      {txn?.netPayoutAmount} {txn?.destinationCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Gross Payout:
                      </span>{" "}
                      {txn?.grossPayoutAmount} {txn?.destinationCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">Fee:</span>{" "}
                      {txn?.feeAmount} {txn?.sourceCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Vat Amount:
                      </span>{" "}
                      {txn?.vatAmount} {txn?.sourceCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Total Debit:
                      </span>{" "}
                      {txn?.totalDebit} {txn?.destinationCurrency}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Fee Responsibility:
                      </span>{" "}
                      {txn?.feeResponsibility}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>
                      Created: {new Date(txn.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
}

export default ExchangeAdminTransactionReport;
