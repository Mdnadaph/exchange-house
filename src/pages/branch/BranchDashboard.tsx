import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BranchDashboard = () => {
  const [cookies] = useCookies(["token", "email", "fullName"]);
  const token = cookies.token;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/v1/dashboard/branch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.status) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);
  const stats = [
    {
      title: "Assigned KYB Applications",
      value: dashboardData ? dashboardData.stats.assignedKybApplications : "0",
      change: "3 high priority",
      icon: FileCheck,
      color: "text-blue-600",
    },
    {
      title: "Completed This Week",
      value: dashboardData ? dashboardData.stats.completedThisWeek : "0",
      change: "+5 from last week",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Review",
      value: dashboardData ? dashboardData.stats.pendingReview : "0",
      change: "2 due today",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Efficiency Score",
      value: "95%",
      change: "+3% this month",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const myKYBQueue = dashboardData ? dashboardData.kybQueues : [];
  const recentActivities = dashboardData ? dashboardData?.recentActivities : [];
  const thisWeeksPerformance = dashboardData
    ? dashboardData?.thisWeeksPerformance
    : {};
  const monthlyTarget = dashboardData ? dashboardData?.monthlyTarget : {};
  const kybReviews = monthlyTarget?.kybReviews || 0;
  const totalApprovedKybs = monthlyTarget?.totalApprovedKybs || 0;

  const percentage =
    totalApprovedKybs > 0
      ? ((kybReviews / totalApprovedKybs) * 100).toFixed(0)
      : 0;
  // const recentActivities = [
  //   {
  //     type: "kyb_approved",
  //     message: "Approved KYB application for Global Suppliers Inc",
  //     time: "2 hours ago",
  //     status: "success",
  //   },
  //   {
  //     type: "document_requested",
  //     message: "Requested additional documents for Tech Solutions Ltd",
  //     time: "4 hours ago",
  //     status: "pending",
  //   },
  //   {
  //     type: "kyb_completed",
  //     message: "Completed KYB review for Dubai Trading Co",
  //     time: "1 day ago",
  //     status: "success",
  //   },
  // ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      APPROVED: {
        variant: "default" as const,
        label: "Approved",
        color: "text-green-600",
      },
      in_progress: {
        variant: "secondary" as const,
        label: "In Progress",
        color: "text-blue-600",
      },
      pending_documents: {
        variant: "destructive" as const,
        label: "Pending Documents",
        color: "text-orange-600",
      },
      ready_for_review: {
        variant: "default" as const,
        label: "Ready for Review",
        color: "text-green-600",
      },
      completed: {
        variant: "default" as const,
        label: "Completed",
        color: "text-success",
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        variant: "secondary" as const,
        label: status,
        color: "text-blue-600",
      }
    );
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "border-l-gray-500";

    const colors = {
      high: "border-l-red-500",
      medium: "border-l-orange-500",
      low: "border-l-green-500",
    };
    return (
      colors[priority.toLowerCase() as keyof typeof colors] ||
      "border-l-orange-500"
    );
  };

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {dashboardData?.branchInfo?.name}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {cookies.fullName}! Here's your KYB workload
              overview
            </p>
          </div>
          {/* <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="business">
              <FileCheck className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          </div> */}
        </div>

        {/* Branch Information */}
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {dashboardData?.branchInfo?.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {dashboardData?.branchInfo?.address},
                    {dashboardData?.branchInfo?.location}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Branch Manager: {cookies.fullName}
                  </p>
                </div>
              </div>
              {/* <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">Monthly Target: 95%</span>
                </div>
                <div className="text-2xl font-bold text-success">95.2%</div>
                <p className="text-xs text-muted-foreground">Current Performance</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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
          {/* My KYB Queue */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My KYB Queue</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/branch/kyb-queue")}
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <p className="text-center font-normal text-base text-gray-700">
                    Loading...
                  </p>
                ) : myKYBQueue?.length > 0 ? (
                  <div className="w-full">
                    {myKYBQueue?.map((application) => {
                      const status = getStatusBadge(application.kybStatus);
                      return (
                        <Card
                          key={application.id}
                          className={`border-l-4 ${getPriorityColor(application.priority)}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">
                                    {application.companyName}
                                  </h4>
                                  <Badge
                                    variant={status.variant}
                                    className="text-xs"
                                  >
                                    {status.label}
                                  </Badge>
                                  {application.priority && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {application.priority?.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {application.id} • {application.businessType}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Created:
                                    </span>
                                    <p className="font-medium">
                                      {new Date(
                                        application.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="outline" size="sm">
                                  Continue
                                </Button>
                                {application.kybStatus ===
                                  "READY_FOR_REVIEW" && (
                                  <Button variant="business" size="sm">
                                    Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p>No KYB Que is available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <p className="text-center text-base font-normal text-gray-700">
                    Loading
                  </p>
                ) : recentActivities?.length > 0 ? (
                  <div>
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {activity?.kybStatus === "APPROVED" && (
                            <CheckCircle className="h-5 w-5 text-success" />
                          )}
                          {activity.kybStatus === "NOT_STARTED" && (
                            <Clock className="h-5 w-5 text-warning" />
                          )}
                          {activity.kybStatus === "REJECTED" && (
                            <AlertCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity?.kybStatus == "APPROVED"
                              ? "Approved"
                              : activity?.kybStatus == "NOT_STARTED"
                                ? "Pending"
                                : "Rejected"}{" "}
                            KYB Application for {activity?.companyName}
                          </p>
                          {/* <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center font-normal text-base text-gray-700">
                    No Recent Activities
                  </p>
                )}
              </CardContent>
              {/* <p className="text-center pb-3">No Data Available</p> */}
            </Card>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>This Week's Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Applications Reviewed
                </span>
                <span className="font-semibold">12</span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Approved KYBs</span>
                <span className="font-semibold">
                  {thisWeeksPerformance?.approvedKybs || 0}
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Review Time</span>
                <span className="font-semibold">2.3 hours</span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reviewed KYBs</span>
                <span className="font-semibold">
                  {thisWeeksPerformance?.reviewedKybs || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Approval Rate</span>
                <span className="font-semibold text-success">
                  {thisWeeksPerformance?.approvalRate || 0}%
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-semibold">A+</span>
              </div> */}
            </CardContent>
            {/* <p className="text-center pb-3">No Data Available</p> */}
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Target Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">KYB Reviews</span>
                  <span className="font-semibold">
                    {monthlyTarget?.kybReviews || 0}/
                    {monthlyTarget?.totalApprovedKybs || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Quality Score Target
                  </span>
                  <span className="font-semibold">
                    {monthlyTarget?.qualityScoreTarget || 0}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{
                      width: `${monthlyTarget?.qualityScoreTarget || 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
            {/* <p className="text-center pb-3">No Data Available</p> */}
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Team Rankings</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">#2</div>
                <p className="text-sm text-muted-foreground">
                  Branch Performance Ranking
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1st Place:</span>
                  <span className="font-medium">ADGM Branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">2nd Place:</span>
                  <span className="font-medium text-success">
                    Dubai Mall (You)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3rd Place:</span>
                  <span className="font-medium">Sharjah Branch</span>
                </div>
              </div>
            </CardContent> */}
            <p className="text-center pb-3">No Data Available</p>
          </Card>
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchDashboard;
