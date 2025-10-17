import UserLayout from "@/components/layout/UserLayout";
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
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // Mock KYB status - in real implementation this would come from backend
  const kybStatus = "pending_kyb" as "verified" | "pending_review" | "pending_kyb" | "rejected";
  const kybSubmitted = false;

  const stats = [
    {
      title: "Monthly Transactions",
      value: "$45,230",
      change: "+12% from last month",
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "Registered Beneficiaries",
      value: "18",
      change: "+3 this week",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Approvals",
      value: "5",
      change: "2 require action",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Completed This Week",
      value: "12",
      change: "85% success rate",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-2024-001",
      beneficiary: "Global Suppliers Inc",
      amount: "15,000",
      currency: "USD",
      status: "completed",
      date: "2024-01-16",
      type: "Invoice Payment"
    },
    {
      id: "TXN-2024-002", 
      beneficiary: "Tech Solutions Ltd",
      amount: "8,500",
      currency: "USD", 
      status: "pending_approval",
      date: "2024-01-16",
      type: "Service Payment"
    },
    {
      id: "TXN-2024-003",
      beneficiary: "Office Supplies Co",
      amount: "2,340",
      currency: "USD",
      status: "processing", 
      date: "2024-01-15",
      type: "Purchase Order"
    },
    {
      id: "TXN-2024-004",
      beneficiary: "Marketing Agency",
      amount: "12,000",
      currency: "USD",
      status: "completed",
      date: "2024-01-15", 
      type: "Marketing Services"
    }
  ];

  const pendingActions = [
    {
      type: "approval_required",
      message: "Transaction TXN-2024-002 requires your approval",
      priority: "high",
      time: "2 hours ago"
    },
    {
      type: "document_needed",
      message: "Upload invoice for TXN-2024-005",
      priority: "medium",
      time: "4 hours ago"
    },
    {
      type: "beneficiary_expiring",
      message: "Beneficiary verification expires in 3 days",
      priority: "low",
      time: "1 day ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { variant: "default" as const, label: "Completed" },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval" },
      processing: { variant: "destructive" as const, label: "Processing" },
      failed: { variant: "destructive" as const, label: "Failed" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.processing;
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* KYB Verification Status Banner */}
        {kybStatus === "verified" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Business Verified</h3>
                  <p className="text-sm text-green-800">Your business has been successfully verified and approved.</p>
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
                  <h3 className="font-semibold text-yellow-900">Verification Pending</h3>
                  <p className="text-sm text-yellow-800">Your KYB application is under review. This typically takes 1-2 business days.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {kybStatus === "pending_kyb" && !kybSubmitted && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">KYB Verification Required</h3>
                  <p className="text-sm text-orange-800 mb-3">
                    Complete your KYB verification to unlock all platform features and start making transactions.
                  </p>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => navigate('/portal/profile')}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Complete Verification Now
                  </Button>
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
                  <h3 className="font-semibold text-red-900">Verification Rejected</h3>
                  <p className="text-sm text-red-800 mb-3">
                    Your KYB application was not approved. Please review the feedback and resubmit with updated documentation.
                  </p>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => navigate('/portal/profile')}
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
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your transaction overview</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button variant="business">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const status = getStatusBadge(transaction.status);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{transaction.beneficiary}</p>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.id} • {transaction.type}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {transaction.currency} {Number(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Pending Actions */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingActions.map((action, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {action.message}
                      </p>
                      <Badge 
                        variant={action.priority === "high" ? "destructive" : 
                               action.priority === "medium" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{action.time}</p>
                    {index < pendingActions.length - 1 && <div className="border-b" />}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Actions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm">Single Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Bulk Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Beneficiary</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload Document</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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
                <span className="font-semibold">USD 45,230</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transactions</span>
                <span className="font-semibold">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-success">96.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Amount</span>
                <span className="font-semibold">USD 1,615</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily Limit</span>
                  <span className="font-semibold">USD 50,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }} />
                </div>
                <p className="text-xs text-muted-foreground">Used: USD 15,000 (30%)</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Limit</span>
                  <span className="font-semibold">USD 500,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "9%" }} />
                </div>
                <p className="text-xs text-muted-foreground">Used: USD 45,230 (9%)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;