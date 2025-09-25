import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  FileCheck, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Business Users",
      value: "24",
      change: "+3 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending KYB Applications",
      value: "3",
      change: "2 due today",
      icon: FileCheck,
      color: "text-orange-600"
    },
    {
      title: "Active Beneficiaries",
      value: "127",
      change: "+12 this week",
      icon: Building,
      color: "text-green-600"
    },
    {
      title: "Approval Rules",
      value: "8",
      change: "Last updated 2d ago",
      icon: Settings,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      type: "user_created",
      message: "New business user created: Michael Johnson",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "kyb_pending",
      message: "KYB application requires review: TechCorp LLC",
      time: "4 hours ago",
      status: "pending"
    },
    {
      type: "rule_updated",
      message: "Approval threshold updated for USD transactions",
      time: "1 day ago",
      status: "info"
    },
    {
      type: "beneficiary_approved",
      message: "Beneficiary approved: Global Suppliers Inc",
      time: "1 day ago",
      status: "success"
    }
  ];

  const pendingTasks = [
    {
      task: "Review TechCorp LLC KYB Documentation",
      priority: "high",
      dueDate: "Today"
    },
    {
      task: "Approve new beneficiary registrations (3)",
      priority: "medium",
      dueDate: "Tomorrow"
    },
    {
      task: "Update transaction limits for Q1",
      priority: "low",
      dueDate: "This week"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your business operations and compliance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="business">
              <Plus className="h-4 w-4 mr-2" />
              Add Business User
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
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Activities</span>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.status === "success" && <CheckCircle className="h-5 w-5 text-success" />}
                      {activity.status === "pending" && <Clock className="h-5 w-5 text-warning" />}
                      {activity.status === "info" && <AlertCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {task.task}
                      </h4>
                      <Badge 
                        variant={task.priority === "high" ? "destructive" : 
                               task.priority === "medium" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                    {index < pendingTasks.length - 1 && <div className="border-b" />}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Tasks
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
                <FileCheck className="h-6 w-6 mb-2" />
                <span className="text-sm">Review KYB</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">Update Rules</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;