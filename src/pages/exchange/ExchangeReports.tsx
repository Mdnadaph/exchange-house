import ExchangeLayout from "@/components/layout/ExchangeLayout";
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
  LineChart,
  Line,
} from "recharts";
import BASE_URL from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Card, CardContent } from "@/components/ui/card";

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

export default function ExchangeReports() {
  const { toast } = useToast();
  const [countryIsoCode, setCountryIsoCode] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [currencyData, setCurrencyData] = useState<any>([]);
  const [countryData, setCountryData] = useState<any>([]);
  const [branchList, setBranchList] = useState<any>([]);
  const [branchId, setBranchId] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const getReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/dashboard/exchange/analytics?branchId=${branchId}&countryIsoCode=${countryIsoCode}&currency=${currency}&transactionStatus=${transactionStatus}&fromDate=${fromDate}&toDate=${toDate}&transactionType=${transactionType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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

  const getBranchList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v3/branch/all-branches`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response?.data?.status) {
        toast({
          title: "Error",
          variant: "destructive",
          description: response?.data?.message,
        });
      }
      setBranchList(response?.data?.data);
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
    getBranchList();
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
    branchId,
  ]);

  // colors for Pie
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];
  const getColor = (index: number) => {
    const hue = (index * 60) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const EmptyChart = () => (
    <Card>
      <CardContent className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg">No Data Available</p>
      </CardContent>
    </Card>
  );

  const DynamicChart = ({ data }: { data: ReportData }) => {
    if (!data) return <EmptyChart />;

    const renderBarChart = (points) => {
      if (!points || points?.length === 0) return <EmptyChart />;

      return (
        <Card>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={points}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={-9}
                  textAnchor="end"
                />

                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="value" fill="#8884d8" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    };
    const renderPieChart = (points) => {
      if (!points || points?.length === 0) return <EmptyChart />;

      return (
        <Card>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={points}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={100}
                  label
                >
                  {points?.map((_, index) => (
                    <Cell key={index} fill={getColor(index)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    };

    const renderLineChart = (points) => {
      if (!points || points?.length === 0) return <EmptyChart />;

      return (
        <Card>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    };

    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(data).map(([key, chart]) => (
          <div key={key} style={{ marginBottom: 40 }}>
            <h3>{chart.title}</h3>

            {chart.chartType === "BAR" && renderBarChart(chart.points)}

            {chart.chartType === "PIE" && renderPieChart(chart.points)}

            {chart.chartType === "LINE" && renderLineChart(chart.points)}
          </div>
        ))}
      </div>
    );
  };
  return (
    <ExchangeLayout>
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
          <div>
            <Select
              value={branchId}
              onValueChange={(val) => setBranchId(val == "All" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>

                {branchList?.map((c) => (
                  <SelectItem key={c?.branchId} value={c?.branchId}>
                    {c?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={countryIsoCode}
              onValueChange={(val) =>
                setCountryIsoCode(val == "All" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>

                {countryData?.map((c) => (
                  <SelectItem key={c?.id} value={c?.currencyCode}>
                    {c?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={currency}
              onValueChange={(val) => setCurrency(val == "All" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {currencyData?.map((c) => (
                  <SelectItem key={c?.id} value={c?.code}>
                    {c?.code}
                  </SelectItem>
                ))}
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
            <DynamicChart data={reportData} />
          )}
        </div>
      </div>
    </ExchangeLayout>
  );
}
