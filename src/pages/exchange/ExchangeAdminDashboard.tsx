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
} from "lucide-react";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

interface ApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    stats: Stats;
    recentKYBApplications: RecentKYBApplication[];
  };
}

const ExchangeAdminDashboard = () => {
  const [cookies] = useCookies(["token", "email", "fullName"]);
  const token = cookies.token;

  const [statsData, setStatsData] = useState<any[]>([]);
  const [recentKYBApplications, setRecentKYBApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      },
      under_review: { variant: "destructive" as const, label: "Under Review" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    };
    return (
      statusMap[status as keyof typeof statusMap] || statusMap.pending_review
    );
  };

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent KYB Applications */}
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
                            <Badge variant={status.variant} className="text-xs">
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
            <p className="text-center pb-3 text-muted-foreground">
              No Data Available
            </p>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <p className="text-center pb-3 text-muted-foreground">
              No Data Available
            </p>
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