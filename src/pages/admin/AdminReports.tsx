import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

type ChartPoint = {
  label: string;
  value: number;
};

type ChartItem = {
  title: string;
  chartType: "BAR" | "PIE" | "LINE";
  points: ChartPoint[];
};

type ReportData = Record<string, ChartItem>;

const transactionStatusOptions = [
  {
    label: "All",
    value: "ALL",
  },
  { label: "Draft", value: "DRAFT" },

  { label: "Internal Review Pending", value: "INTERNAL_REVIEW_PENDING" },
  { label: "Payment Pending", value: "PAYMENT_PENDING" },
  {
    label: "Payment Verification Pending",
    value: "PAYMENT_VERIFICATION_PENDING",
  },
  { label: "Compliance Review", value: "COMPLIANCE_REVIEW" },
  { label: "Proof of Payment Pending", value: "PROOF_OF_PAYMENT_PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Failed", value: "FAILED" },

  { label: "Rate Deal Pending", value: "RATE_DEAL_PENDING" },
  { label: "Rate Deal Approved", value: "RATE_DEAL_APPROVED" },
  { label: "Rate Deal Rejected", value: "RATE_DEAL_REJECTED" },
  { label: "Rate Deal Counter Proposal", value: "RATE_DEAL_COUNTER_PROPOSAL" },
  { label: "Rate Deal Expired", value: "RATE_DEAL_EXPIRED" },
];

const transactionTypeOptions = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Single",
    value: "SINGLE",
  },
  {
    label: "Bulk",
    value: "BULK",
  },
];

export default function AdminReports() {
  const { toast } = useToast();
  const [countryIsoCode, setCountryIsoCode] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [currencyData, setCurrencyData] = useState<any>([]);
  const [countryData, setCountryData] = useState<any>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;

  const buildAnalyticsUrl = () => {
    const params = new URLSearchParams();

    countryIsoCode.forEach((code) => {
      params.append("countryIsoCode", code);
    });

    currency.forEach((cur) => {
      params.append("currency", cur);
    });

    if (transactionStatus) {
      params.append("transactionStatus", transactionStatus);
    }

    if (fromDate) {
      params.append("fromDate", fromDate);
    }

    if (toDate) {
      params.append("toDate", toDate);
    }

    if (transactionType) {
      params.append("transactionType", transactionType);
    }

    return `${BASE_URL}/api/v1/dashboard/super-admin/analytics?${params.toString()}`;
  };
  const getReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(buildAnalyticsUrl(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res?.data?.status) {
        toast({
          title: "Error",
          variant: "destructive",
          description: res?.data?.message,
        });
      }
      setReportData(res?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrency = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response?.data?.status) {
        toast({
          title: "Error",
          variant: "destructive",
          description: response?.data?.message,
        });
      }
      setCurrencyData(response?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const getCountries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v3/config/countries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response?.data?.status) {
        toast({
          title: "Error",
          variant: "destructive",
          description: response?.data?.message,
        });
      }
      setCountryData(response?.data?.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    getCurrency();
    getCountries();
  }, []);

  useEffect(() => {
    getReports();
  }, [
    countryIsoCode,
    currency,
    fromDate,
    toDate,
    transactionStatus,
    transactionType,
  ]);

  // const EmptyChart = () => (
  //   <Card>
  //     <CardContent className="flex justify-center items-center h-[300px]">
  //       <p className="text-gray-500 text-lg">No Data Available</p>
  //     </CardContent>
  //   </Card>
  // );

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "#22C55E", // green
    PENDING: "#FACC15", // yellow
    SUSPENDED: "#F97316", // orange
    DEACTIVATED: "#EF4444", // red
  };

  const STATUS_COLORSCODE: Record<string, string> = {
    INTERNAL_REVIEW_PENDING: "#F59E0B", // amber
    PAYMENT_PENDING: "#3B82F6", // blue
    PROOF_OF_PAYMENT_PENDING: "#8B5CF6", // purple
    COMPLIANCE_REVIEW: "#F97316", // orange
    PAYMENT_VERIFICATION_PENDING: "#06B6D4", // cyan
    PROCESSING: "#6366F1", // indigo
    COMPLETED: "#22C55E", // green
    CANCELLED: "#EF4444", // red
    CANCELLED_WITH_REFUND: "#FB7185", // pink/red
  };

  const transformStackedData = (points: any[]) => {
    const map: Record<string, any> = {};

    points?.forEach((item) => {
      const country = item.label;
      const currency = item.group; // or item.currency

      if (!map[country]) {
        map[country] = { label: country };
      }

      map[country][currency] = item.value;
    });

    return Object.values(map);
  };
  const rawPoints =
    reportData?.transactionVolumeByCountryAndCurrency?.points || [];
  const chartData = transformStackedData(rawPoints);
  const currencies = Array.from(new Set(rawPoints.map((p) => p?.group)));
  const getDynamicColor = (index: number, total: number) => {
    const hue = (index * 360) / total; // spread colors evenly
    return `hsl(${hue}, 70%, 55%)`;
  };
  const rowHeight = 45; // space per bar (adjust)
  const baseHeight = 120; // header + padding

  const chartHeight = (chartData?.length || 0) * rowHeight + baseHeight;
  const businessPoints = reportData?.transactionVolumeByBusiness?.points || [];

  const businessChartHeight = businessPoints.length * 45 + 120; // row height + padding
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Reports
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage all your reports in one place
          </p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="w-[200px]">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={countryIsoCode.length === 0}
                      onChange={() => setCountryIsoCode([])}
                    />
                    All
                  </label>

                  {countryData?.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={countryIsoCode.includes(c.currencyCode)}
                        onChange={() => {
                          setCountryIsoCode((prev) =>
                            prev.includes(c.currencyCode)
                              ? prev.filter((x) => x !== c.currencyCode)
                              : [...prev, c.currencyCode],
                          );
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[200px]">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currency.length === 0}
                      onChange={() => setCurrency([])}
                    />
                    All
                  </label>

                  {currencyData?.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={currency.includes(c.code)}
                        onChange={() => {
                          setCurrency((prev) =>
                            prev.includes(c.code)
                              ? prev.filter((x) => x !== c.code)
                              : [...prev, c.code],
                          );
                        }}
                      />
                      {c.code}
                    </label>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="date"
              placeholder="Select To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={transactionStatus}
              onValueChange={(val) =>
                setTransactionStatus(val == "ALL" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transaction Status" />
              </SelectTrigger>
              <SelectContent>
                {transactionStatusOptions?.map((c, index) => (
                  <SelectItem key={index} value={c?.value}>
                    {c?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={transactionType}
              onValueChange={(val) =>
                setTransactionType(val == "ALL" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypeOptions?.map((c, index) => (
                  <SelectItem key={index} value={c?.value}>
                    {c?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-center font-semibold text-xl text-gray-700">
              Loading...
            </div>
          ) : (
            // <DynamicChart data={reportData} />
            <div className="space-y-6">
              <div
                className="
            grid grid-cols-1 lg:grid-cols-3 gap-4
            "
              >
                <div className="bg-white p-4 rounded-xl shadow lg:col-span-2">
                  <h5 className="text-[#0B1437] text-base font-medium pb-2">
                    {reportData?.transactionVolumeTimeline?.title}
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={reportData?.transactionVolumeTimeline?.points}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                      {/* Gradient Fill */}
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4F46E5"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4F46E5"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="label" />
                      <YAxis />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4F46E5"
                        fill="url(#colorValue)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                  <h5 className="text-[#0B1437] text-base font-medium pb-2">
                    {reportData?.exchangeAdminsByStatus?.title}
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData?.exchangeAdminsByStatus?.points}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // doughnut effect
                        outerRadius={100}
                        dataKey="value"
                        nameKey="label"
                        label={false}
                      >
                        {reportData?.exchangeAdminsByStatus?.points?.map(
                          (entry, index) => (
                            <Cell
                              key={index}
                              fill={STATUS_COLORS[entry.label] || "#94A3B8"}
                            />
                          ),
                        )}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Custom Legend */}
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    {reportData?.exchangeAdminsByStatus?.points?.map((d, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[d?.label] || "#94A3B8",
                          }}
                        />
                        {d.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* STACKED COUNTRY CHART */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-semibold mb-4">
                  {reportData?.transactionVolumeByCountryAndCurrency?.title}
                </h2>
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis type="number" />
                    <YAxis dataKey="label" type="category" />

                    <Tooltip />
                    <Legend />

                    {currencies.map((cur, i) => (
                      <Bar
                        key={i}
                        dataKey={cur as string}
                        stackId="a"
                        fill={getDynamicColor(i, currencies.length)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className=" grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="font-semibold mb-4">
                    {reportData?.transactionVolumeByBusiness?.title}
                  </h2>
                  <ResponsiveContainer
                    width="100%"
                    height={businessChartHeight}
                  >
                    <BarChart
                      data={reportData?.transactionVolumeByBusiness?.points}
                      layout="vertical" // 👈 makes it horizontal
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      {/* Swap axes */}
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="label" />

                      <Tooltip />

                      <Bar dataKey="value" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                  <h5 className="text-[#0B1437] text-base font-medium pb-2">
                    {reportData?.transactionCountByStatus?.title}
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData?.transactionCountByStatus?.points}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // doughnut effect
                        outerRadius={100}
                        dataKey="value"
                        nameKey="label"
                        label={false}
                      >
                        {reportData?.transactionCountByStatus?.points?.map(
                          (entry, index) => (
                            <Cell
                              key={index}
                              fill={STATUS_COLORSCODE[entry.label] || "#94A3B8"}
                            />
                          ),
                        )}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Custom Legend */}
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    {reportData?.transactionCountByStatus?.points?.map(
                      (d, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORSCODE[d?.label] || "#94A3B8",
                            }}
                          />
                          {d.label}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-semibold mb-4">
                  {reportData?.transactionVolumeByBranch?.title}
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={reportData?.transactionVolumeByBranch?.points}
                  >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
