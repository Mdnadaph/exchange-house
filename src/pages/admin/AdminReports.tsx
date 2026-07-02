import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import Tree, { RawNodeDatum } from "react-d3-tree";
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
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
  const [exchangeAdminData, setExchangeAdminData] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [exchangeAdminId, setExchnageAdminId] = useState<string>("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [currencyData, setCurrencyData] = useState<any>([]);
  const [countryData, setCountryData] = useState<any>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 10;
  const [exchangeAdminLoading, setExchangeAdminLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  });

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setFromDate(range?.from ? format(range.from, "yyyy-MM-dd") : "");
    setToDate(range?.to ? format(range.to, "yyyy-MM-dd") : "");
  };
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
    if (exchangeAdminId) {
      params.append("exchangeAdminId", exchangeAdminId);
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

  const getExchangeAdminList = async () => {
    // IMPORTANT
    if (exchangeAdminLoading || !hasMore) return;

    try {
      setExchangeAdminLoading(true);

      const currentPage = page;

      const res = await axios.get(
        `${BASE_URL}/api/v3/super/exchange-admins?page=${currentPage}&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        const newData = res?.data?.data?.exchangeAdminResponse || [];

        // No more data
        if (newData.length < 10) {
          setHasMore(false);
        }

        // Prevent duplicate data
        setExchangeAdminData((prev) => {
          const merged = [...prev, ...newData];

          const uniqueData = merged.filter(
            (item, index, self) =>
              index === self.findIndex((x) => x.id === item.id),
          );

          return uniqueData;
        });

        // NEXT PAGE
        setPage((prev) => prev + 1);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setExchangeAdminLoading(false);
    }
  };

  // OBSERVER
  // useEffect(() => {
  //   if (!hasMore) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const target = entries[0];

  //       if (target.isIntersecting && !exchangeAdminLoading) {
  //         getExchangeAdminList();
  //       }
  //     },
  //     {
  //       rootMargin: "200px",
  //     },
  //   );

  //   const current = sentinelRef.current;

  //   if (current) {
  //     observer.observe(current);
  //   }

  //   return () => {
  //     if (current) {
  //       observer.unobserve(current);
  //     }
  //   };
  // }, [exchangeAdminLoading, hasMore]);
  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isBottom && !exchangeAdminLoading && hasMore) {
      getExchangeAdminList();
    }
  };

  useEffect(() => {
    getCurrency();
    getCountries();
    getExchangeAdminList();
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
    exchangeAdminId,
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
      const currency = item.currency; // or item.currency

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
    const baseHue = 210; // blue tone

    const lightness = 35 + index * (40 / Math.max(total - 1, 1));
    const saturation = 70;

    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  };
  const rowHeight = 45; // space per bar (adjust)
  const baseHeight = 120; // header + padding

  const chartHeight = (chartData?.length || 0) * rowHeight + baseHeight;
  const businessPoints = reportData?.transactionVolumeByBusiness?.points || [];

  const businessChartHeight = businessPoints.length * 45 + 120; // row height + padding
  const orgChart = {
    name: "CEO",
    children: [
      {
        name: "Manager",
        attributes: {
          department: "Production",
        },
        children: [
          {
            name: "Foreman",
            attributes: {
              department: "Fabrication",
            },
            children: [
              {
                name: "Worker",
              },
            ],
          },
          {
            name: "Foreman",
            attributes: {
              department: "Assembly",
            },
            children: [
              {
                name: "Worker",
              },
            ],
          },
        ],
      },
    ],
  };
  // const transformTree = (node) => {
  //   return {
  //     name: `${node.label}`, // show label + type
  //     attributes: {
  //       type: node.type
  //         ?.toLowerCase()
  //         ?.split("_")
  //         ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //         ?.join(" "),
  //     },
  //     children: node.children?.map(transformTree) || [],
  //   };
  // };
  const transformTree = (node: any): RawNodeDatum | null => {
    if (!node) return null;

    const children = node.children?.map(transformTree)?.filter(Boolean) || [];

    return {
      name: `${node.label}`,
      attributes: {
        type: node.type
          ?.toLowerCase()
          ?.split("_")
          ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          ?.join(" "),
      },
      children,
    };
  };
  const treeData = reportData?.onboardingTreeMap
    ? transformTree(reportData?.onboardingTreeMap)
    : null;

  const getIcon = (type) => {
    switch (type) {
      case "EXCHANGE_ADMIN":
        return "🏦";
      case "BUSINESS_ADMIN":
        return "👨‍💼";
      case "BUSINESS_USER":
        return "👤";
      case "BRANCH":
        return "🏢";
      case "ROOT":
        return "🌳";
      default:
        return "📦";
    }
  };

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
          <div className="w-[200px] space-y-1">
            <h2 className="text-base font-normal text-gray-700">Country</h2>
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
          <div className="w-[200px] space-y-1">
            <h2 className="text-base font-normal text-gray-700">Currency</h2>
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
          {/*<div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">From Date</h2>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">To Date</h2>
            <Input
              type="date"
              placeholder="Select To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>*/}
          <div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">Date Range</h2>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative w-[260px]">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                  {dateRange?.from && (
                    <X
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDateRange(undefined);
                        setFromDate("");
                        setToDate("");
                      }}
                    />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setFromDate(
                      range?.from ? format(range.from, "yyyy-MM-dd") : "",
                    );
                    setToDate(range?.to ? format(range.to, "yyyy-MM-dd") : "");
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">
              Transaction Status
            </h2>
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
          <div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">
              Transaction Type
            </h2>
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
          <div className="space-y-1">
            <h2 className="text-base font-normal text-gray-700">
              Exchange Admin
            </h2>
            <Select
              value={exchangeAdminId}
              onValueChange={(val) =>
                setExchnageAdminId(val == "all" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exchnage Admin" />
              </SelectTrigger>
              <SelectContent>
                <div
                  ref={listRef}
                  onScroll={handleScroll}
                  className="max-h-60 overflow-y-auto"
                >
                  {exchangeAdminData?.length > 0 && (
                    <SelectItem value="all">All</SelectItem>
                  )}
                  {exchangeAdminData?.map((c, index) => (
                    <SelectItem key={index} value={c?.id}>
                      {c?.fullName}
                    </SelectItem>
                  ))}
                  {/* OBSERVER TARGET */}
                  {exchangeAdminLoading && (
                    <div className="py-2 text-center text-sm text-gray-500">
                      Loading...
                    </div>
                  )}
                  {/* {!hasMore && (
                    <div className="py-2 text-center text-sm text-gray-400">
                      No More Data
                    </div>
                  )} */}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-center font-normal text-base text-gray-700">
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
                        {d.label
                          ?.toLowerCase()
                          ?.split("_")
                          ?.map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          ?.join(" ")}
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
              <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                          {d.label
                            ?.toLowerCase()
                            ?.split("_")
                            ?.map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            ?.join(" ")}
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
                    <Bar dataKey="value" fill="#6366F1" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {reportData?.onboardingTreeMap && (
                <div className="bg-white p-4 rounded-xl shadow h-[70vh] overflow-hidden">
                  <h2 className="font-semibold mb-4">On Boarding Tree</h2>
                  <div
                    id="treeWrapper"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Tree
                      data={treeData}
                      pathFunc="step"
                      orientation="vertical"
                      translate={{ x: 500, y: 10 }}
                      zoom={0.7}
                      nodeSize={{ x: 220, y: 140 }}
                      separation={{ siblings: 1.2, nonSiblings: 1.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
