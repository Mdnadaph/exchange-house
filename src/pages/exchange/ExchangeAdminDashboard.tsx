import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  Building,
  Clock,
  ArrowUpRight,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalKYBApplications: number;
  totalPendingReview: number;
  totalActiveBusiness: number;
  totalBranchLocations: number;
}

interface RecentKYBApplication {
  id: number;
  companyName: string;
  kybStatus: string;
  branchName: string;
}

interface PayoutMechanisms {
  payoutMechanism: string;
  count: number;
}

type SystemHealthStatus = "UP" | "DOWN" | "UNKNOWN";

type SystemHealth = {
  status?: string;
  components?: Record<string, SystemHealthStatus>;
};

interface ApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    stats: Stats;
    recentKYBApplications: RecentKYBApplication[];
    payoutMechanisms: PayoutMechanisms[];
    systemHealth: SystemHealth;
  };
}

const ExchangeAdminDashboard = () => {
  const [cookies] = useCookies(["token", "email", "fullName"]);
  const token = cookies.token;
  const { toast } = useToast();
  const [payoutMechanisms, setPayoutMechanisms] = useState([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({});
  console.log("systemHealth", systemHealth);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [recentKYBApplications, setRecentKYBApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeSetupConfigurationList, setExchangeSetupConfigurationList] =
    useState([]);
  const navigate = useNavigate();
  const unCompletedExchangeSetupConfigurationList =
    exchangeSetupConfigurationList?.filter((item) => item?.completed === false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/v1/dashboard/exchange`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.status && data.data) {
          const mappedStats = [
            {
              title: "Total KYB Applications",
              value: data.data.stats.totalKYBApplications.toString(),
              change: "",
              icon: FileCheck,
              color: "text-blue-600",
            },
            {
              title: "Pending Review",
              value: data.data.stats.totalPendingReview.toString(),
              change: "",
              icon: Clock,
              color: "text-orange-600",
            },
            {
              title: "Active Businesses",
              value: data.data.stats.totalActiveBusiness.toString(),
              change: "",
              icon: Building,
              color: "text-green-600",
            },
            {
              title: "Branch Locations",
              value: data.data.stats.totalBranchLocations.toString(),
              change: "",
              icon: MapPin,
              color: "text-purple-600",
            },
          ];
          setStatsData(mappedStats);

          const mappedRecent = data.data.recentKYBApplications.map((app) => ({
            id: app.id.toString(),
            businessName: app.companyName,
            submittedDate: "",
            branch: app.branchName,
            priority: "",
            status:
              app.kybStatus === "NOT_STARTED"
                ? "pending_review"
                : app.kybStatus.toLowerCase(),
            assignedTo: "",
          }));
          setRecentKYBApplications(mappedRecent);
          setPayoutMechanisms(data?.data?.payoutMechanisms);
          setSystemHealth(data?.data?.systemHealth);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending_review: {
        variant: "secondary" as const,
        label: "Pending Review",
        className: "bg-gray-200 border-gray-200 text-xs",
      },
      under_review: {
        variant: "destructive" as const,
        label: "Under Review",
        className: "text-xs",
      },
      approved: {
        variant: "default" as const,
        label: "Approved",
        className: "text-xs",
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        className: "text-xs",
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || statusMap.pending_review
    );
  };

  const exchangeSetupConfiguration = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/exchange/setup/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res?.data?.status) {
        toast({
          title: "Error",
          description: res?.data?.message || "Failed to load setup data",
        });
      }
      setExchangeSetupConfigurationList(res?.data?.data?.steps);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to load setup",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    exchangeSetupConfiguration();
  }, []);
  // ✅ Loading state — shown before layout renders
  if (loading) {
    return (
      <ExchangeLayout>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </ExchangeLayout>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <ExchangeLayout>
        <div className="flex justify-center items-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </ExchangeLayout>
    );
  }

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Exchange Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage KYB applications and branch operations across all locations
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="shadow-card hover:shadow-lg transition-smooth"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {" "}
          <Card className="shadow-card">
            {" "}
            <CardHeader>
              {" "}
              <div className="space-y-2">
                {" "}
                <CardTitle>Exchange Setup Configuration</CardTitle>{" "}
                <p className="text-muted-foreground text-sm">
                  {" "}
                  Complete all setup steps to configure your exchange platform
                  successfully.{" "}
                </p>{" "}
              </div>{" "}
            </CardHeader>{" "}
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {" "}
              {exchangeSetupConfigurationList?.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No exchange setup configuration data available.
                </p>
              ) : unCompletedExchangeSetupConfigurationList?.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  {" "}
                  All exchange setup configurations have been completed.{" "}
                </p>
              ) : (
                <div className="space-y-3">
                  {" "}
                  {unCompletedExchangeSetupConfigurationList?.map(
                    (item: any) => {
                      const isCompleted = item?.completed;
                      const isAvailable = item?.available;
                      return (
                        <div
                          key={item?.step}
                          className={`rounded-xl border p-3 shadow-sm transition-all                  ${isCompleted ? "border-green-500 bg-green-50" : isAvailable ? "border-primary bg-background" : "border-gray-200 bg-gray-100 opacity-80"}                `}
                        >
                          {" "}
                          {/* Top Section */}{" "}
                          <div className="flex items-center justify-between">
                            {" "}
                            <div>
                              {" "}
                              <p className="text-xs text-muted-foreground">
                                {" "}
                                Step {item?.step}{" "}
                              </p>{" "}
                              <h2 className="text-sm font-semibold mt-1">
                                {" "}
                                {item?.title}{" "}
                              </h2>{" "}
                            </div>{" "}
                            {isCompleted ? (
                              <CheckCircle className="text-green-600 w-5 h-5" />
                            ) : !isAvailable ? (
                              <Lock className="text-gray-400 w-4 h-4" />
                            ) : null}{" "}
                          </div>{" "}
                          {/* Count */}{" "}
                          <div className="mt-2">
                            {" "}
                            <p className="text-xs text-muted-foreground">
                              {" "}
                              Configured Items{" "}
                            </p>{" "}
                            <h3 className="text-lg font-bold">
                              {" "}
                              {item?.count}{" "}
                            </h3>{" "}
                          </div>{" "}
                          {/* Action */}{" "}
                          <div className="mt-3">
                            {" "}
                            {isCompleted ? (
                              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                {" "}
                                <CheckCircle className="w-4 h-4" />{" "}
                                Completed{" "}
                              </div>
                            ) : isAvailable ? (
                              <button
                                onClick={() => navigate(item?.path)}
                                className="w-full bg-primary text-white rounded-lg px-3 py-2 text-sm flex items-center justify-center gap-1 hover:opacity-90 transition-all"
                              >
                                {" "}
                                Setup <ArrowRight className="w-4 h-4" />{" "}
                              </button>
                            ) : (
                              <div className="text-xs text-gray-500">
                                {" "}
                                Complete previous step first{" "}
                              </div>
                            )}{" "}
                          </div>{" "}
                        </div>
                      );
                    },
                  )}{" "}
                </div>
              )}{" "}
            </CardContent>{" "}
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent KYB Applications</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/exchange/kyb-review")}
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                {recentKYBApplications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No KYB applications found.
                  </p>
                ) : (
                  recentKYBApplications.map((application) => {
                    const status = getStatusBadge(application.status);
                    return (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {application.businessName}
                            </p>
                            <Badge
                              variant={status.variant}
                              className={status?.className}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {application.id} • {application.branch}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Branch Workload */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Branch Workload Distribution</CardTitle>
              </CardHeader>
              <p className="text-center pb-3 text-muted-foreground">
                No Data Available
              </p>
            </Card>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Payout Mechanisms
              </CardTitle>
            </CardHeader>
            <div className="space-y-4 p-5">
              {payoutMechanisms?.length > 0 ? (
                payoutMechanisms?.map((m, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <span className="text-muted-foreground">
                      {m?.payoutMechanism}
                    </span>
                    <span className="font-semibold text-lg">{m?.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-center pb-3 text-muted-foreground">
                  No Data Available
                </p>
              )}
            </div>
            {/* <p className="text-center pb-3 text-muted-foreground">
              No Data Available
            </p> */}
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>

            <div className="space-y-4 p-5">
              {/* System Status */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Overall Status</span>
                <span className="font-semibold text-green-600">
                  {systemHealth?.status}
                </span>
              </div>

              {/* Components */}
              {systemHealth?.components &&
                Object.entries(systemHealth?.components).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key}
                    </span>
                    <span
                      className={`font-semibold ${
                        value === "UP" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <p className="text-center pb-3 text-muted-foreground">
              No Data Available
            </p>
          </Card>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeAdminDashboard;
