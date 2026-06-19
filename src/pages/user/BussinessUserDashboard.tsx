import BusinessUserLayout from "@/components/layout/BusinnessUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  XCircle,
  Wallet,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BussinessUserDashboard = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies.token;
  const sourceCurrency = cookies?.currencyCode;
  // Mock KYB status - in real implementation this would come from backend
  const kybStatus = "pending_kyb" as
    | "verified"
    | "pending_review"
    | "pending_kyb"
    | "rejected";
  const kybSubmitted = false;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/dashboard/business-user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status) {
          setDashboardData(result.data);
        } else {
          throw new Error(
            result.message || "Failed to retrieve dashboard data",
          );
        }
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const stats = dashboardData
    ? [
        {
          title: "Total Transactions",
          value: dashboardData.stats.totalTransactions.toString(),
          change: "",
          icon: CreditCard,
          color: "text-green-600",
        },
        {
          title: "Approved Transactions",
          value: dashboardData.stats.approvedTransactions.toString(),
          change: "",
          icon: CheckCircle,
          color: "text-blue-600",
        },
        {
          title: "Rejected Transactions",
          value: dashboardData.stats.rejectedTransactions.toString(),
          change: "",
          icon: XCircle,
          color: "text-red-600",
        },
        {
          title: "Pending Transactions",
          value: dashboardData.stats.pendingTransactions.toString(),
          change: "",
          icon: Clock,
          color: "text-orange-600",
        },
      ]
    : [];

  const recentActivities = dashboardData ? dashboardData.recentActivities : [];

  const pendingActions = [
    {
      type: "approval_required",
      message: "Transaction TXN-2024-002 requires your approval",
      priority: "high",
      time: "2 hours ago",
    },
    {
      type: "document_needed",
      message: "Upload invoice for TXN-2024-005",
      priority: "medium",
      time: "4 hours ago",
    },
    {
      type: "beneficiary_expiring",
      message: "Beneficiary verification expires in 3 days",
      priority: "low",
      time: "1 day ago",
    },
  ];

  // const getStatusBadge = (status: string) => {
  //   const statusMap = {
  //     APPROVED: { variant: "default" as const, label: "Approved" },
  //     PENDING: { variant: "secondary" as const, label: "Pending" },
  //     REJECTED: { variant: "destructive" as const, label: "Rejected" },
  //     PROCESSING: { variant: "outline" as const, label: "Processing" },
  //     COMPLETED: { variant: "default" as const, label: "Completed" },
  //   };
  //   return (
  //     statusMap[status as keyof typeof statusMap] || {
  //       variant: "secondary" as const,
  //       label: status,
  //     }
  //   );
  // };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      COMPLETED: {
        variant: "default" as const,
        label: "Completed",
        icon: CheckCircle,
      },
      PENDING_APPROVAL: {
        variant: "secondary" as const,
        label: "Pending Approval",
        icon: Clock,
      },
      PAYMENT_PENDING: {
        variant: "destructive" as const,
        label: "Pending Payment",
        icon: Wallet,
      },
      APPROVED: {
        variant: "secondary" as const,
        label: "Approved",
        icon: Clock,
      },
      PROCESSING: {
        variant: "destructive" as const,
        label: "Proof of Payment Sent",
        icon: Clock,
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        icon: AlertCircle,
      },
      REJECTED: {
        variant: "outline" as const,
        label: "Rejected",
        icon: AlertCircle,
      },
      COMPLIANCE_REVIEW: {
        variant: "outline" as const,
        label: "Compliance Review",
        icon: AlertCircle,
      },
      INTERNAL_REVIEW_PENDING: {
        variant: "outline" as const,
        label: "Internal Review Pending",
        icon: AlertCircle,
      },
      PAYMENT_VERIFICATION_PENDING: {
        variant: "outline" as const,
        label: "Payment Verification Pending",
        icon: AlertCircle,
      },
      PROOF_OF_PAYMENT_PENDING: {
        variant: "outline" as const,
        label: "Proof Of Payment Pending",
        icon: AlertCircle,
      },
      RATE_DEAL_PENDING: {
        variant: "outline" as const,
        label: "Rate Deal Pending",
        icon: AlertCircle,
      },
      RATE_DEAL_APPROVED: {
        variant: "outline" as const,
        label: "Rate Deal Approved",
        icon: AlertCircle,
      },
      RATE_DEAL_REJECTED: {
        variant: "outline" as const,
        label: "Rate Deal Rejected",
        icon: AlertCircle,
      },
      RATE_DEAL_COUNTER_PROPOSAL: {
        variant: "outline" as const,
        label: "Rate Deal Counter Proposal",
        icon: AlertCircle,
      },
      RATE_DEAL_EXPIRED: {
        variant: "outline" as const,
        label: "Rate Deal Expired",
        icon: AlertCircle,
      },
      DRAFT: {
        variant: "outline" as const,
        label: "Draft",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.PROCESSING;
  };

  if (loading) {
    return (
      <BusinessUserLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </BusinessUserLayout>
    );
  }

  if (error) {
    return (
      <BusinessUserLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-destructive">Error: {error}</p>
        </div>
      </BusinessUserLayout>
    );
  }

  return (
    <BusinessUserLayout>
      <div className="space-y-8">
        {/* KYB Verification Status Banner */}
        {kybStatus === "verified" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Business Verified
                  </h3>
                  <p className="text-sm text-green-800">
                    Your business has been successfully verified and approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {kybStatus === "pending_review" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Verification Pending
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Your KYB application is under review. This typically takes
                    1-2 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {kybStatus === "rejected" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">
                    Verification Rejected
                  </h3>
                  <p className="text-sm text-red-800 mb-3">
                    Your KYB application was not approved. Please review the
                    feedback and resubmit with updated documentation.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/portal/profile")}
                  >
                    Review & Resubmit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Business User Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your transaction overview
            </p>
          </div>
          {/* <div className="flex space-x-3">
            <Button
              onClick={() => navigate("/user/transactions")}
              variant="business"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div> */}
        </div>

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
                  {stat.change && (
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/user/transactions")}
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto overscroll-contain">
                {recentActivities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No recent activities
                  </p>
                ) : (
                  recentActivities.map((activity) => {
                    const status = getStatusBadge(activity.status);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {activity.reference}
                            </p>
                            <Badge variant={status.variant} className="text-xs">
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {activity.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {activity.sourceCurrency.toUpperCase()}{" "}
                            {activity.sourceAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pending Actions */}
          {/* <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <p className="text-center pb-3">No data available</p>
            </Card>
          </div> */}
        </div>

        {/* Quick Actions */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => navigate("/user/transactions")}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm">Single Payment</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => navigate("/user/transactions")}
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Bulk Payment</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => navigate("/user/transactions")}
              >
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Beneficiary</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => navigate("/user/transactions")}
              >
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Rate Deals</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Sent</span>
                <span className="font-semibold">
                  {sourceCurrency}{" "}
                  {dashboardData?.monthlySummary?.totalSent || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transactions</span>
                <span className="font-semibold">
                  {dashboardData?.monthlySummary?.transactionCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-success">
                  {dashboardData?.monthlySummary?.successRate || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Amount</span>
                <span className="font-semibold">
                  {sourceCurrency} {dashboardData?.monthlyLimit?.avgAmount || 0}
                </span>
              </div>
            </CardContent>
            {/* <p className="text-center pb-5">No data found</p> */}
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily Limit</span>
                  <span className="font-semibold">
                    {sourceCurrency}{" "}
                    {dashboardData?.transactionLimits?.dailyLimit || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${dashboardData?.transactionLimits?.dailyUsedPercent || 0}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used: {sourceCurrency}{" "}
                  {dashboardData?.transactionLimits?.dailyUsed || 0} (
                  {dashboardData?.transactionLimits?.dailyUsedPercent} %)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Limit</span>
                  <span className="font-semibold">
                    {sourceCurrency}{" "}
                    {dashboardData?.transactionLimits?.monthlyLimit || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${dashboardData?.transactionLimits?.monthlyUsedPercent || 0}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used: USD {dashboardData?.transactionLimits?.monthlyUsed} (
                  {dashboardData?.transactionLimits?.monthlyUsedPercent}%)
                </p>
              </div>
            </CardContent>
            {/* <p className="text-center pb-5">No data found</p> */}
          </Card>
        </div>
      </div>
    </BusinessUserLayout>
  );
};

export default BussinessUserDashboard;
