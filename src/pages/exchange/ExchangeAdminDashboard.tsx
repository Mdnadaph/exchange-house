// import ExchangeLayout from "@/components/layout/ExchangeLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   FileCheck,
//   Building,
//   Users,
//   Settings,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   ArrowUpRight,
//   MapPin,
//   DollarSign
// } from "lucide-react";

// const ExchangeAdminDashboard = () => {
//   const stats = [
//     {
//       title: "Total KYB Applications",
//       value: "156",
//       change: "+23 this week",
//       icon: FileCheck,
//       color: "text-blue-600"
//     },
//     {
//       title: "Pending Review",
//       value: "12",
//       change: "8 high priority",
//       icon: Clock,
//       color: "text-orange-600"
//     },
//     {
//       title: "Active Businesses",
//       value: "89",
//       change: "+7 this month",
//       icon: Building,
//       color: "text-green-600"
//     },
//     {
//       title: "Branch Locations",
//       value: "15",
//       change: "2 new this quarter",
//       icon: MapPin,
//       color: "text-purple-600"
//     }
//   ];

//   const branchWorkload = [
//     {
//       branch: "Dubai Mall Branch",
//       manager: "Ahmed Hassan",
//       pendingKYB: 4,
//       completed: 18,
//       efficiency: 95,
//       status: "optimal"
//     },
//     {
//       branch: "Abu Dhabi ADGM Branch",
//       manager: "Fatima Al-Zahra",
//       pendingKYB: 7,
//       completed: 22,
//       efficiency: 88,
//       status: "busy"
//     },
//     {
//       branch: "Sharjah City Centre Branch",
//       manager: "Omar Abdullah",
//       pendingKYB: 2,
//       completed: 12,
//       efficiency: 92,
//       status: "optimal"
//     },
//     {
//       branch: "Dubai International City Branch",
//       manager: "Priya Sharma",
//       pendingKYB: 1,
//       completed: 8,
//       efficiency: 100,
//       status: "available"
//     }
//   ];

//   const recentKYBApplications = [
//     {
//       id: "KYB-2024-089",
//       businessName: "Tech Innovations LLC",
//       submittedDate: "2024-01-16",
//       branch: "Dubai Mall",
//       priority: "high",
//       status: "pending_review",
//       assignedTo: "Ahmed Hassan"
//     },
//     {
//       id: "KYB-2024-088",
//       businessName: "Global Trading Co",
//       submittedDate: "2024-01-16",
//       branch: "Abu Dhabi ADGM",
//       priority: "medium",
//       status: "under_review",
//       assignedTo: "Fatima Al-Zahra"
//     },
//     {
//       id: "KYB-2024-087",
//       businessName: "Emirates Logistics",
//       submittedDate: "2024-01-15",
//       branch: "Dubai Mall",
//       priority: "low",
//       status: "approved",
//       assignedTo: "Ahmed Hassan"
//     }
//   ];

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       pending_review: { variant: "secondary" as const, label: "Pending Review" },
//       under_review: { variant: "destructive" as const, label: "Under Review" },
//       approved: { variant: "default" as const, label: "Approved" },
//       rejected: { variant: "destructive" as const, label: "Rejected" }
//     };
//     return statusMap[status as keyof typeof statusMap] || statusMap.pending_review;
//   };

//   const getBranchStatusColor = (status: string) => {
//     const colors = {
//       optimal: "border-l-green-500",
//       busy: "border-l-orange-500",
//       available: "border-l-blue-500",
//       overloaded: "border-l-red-500"
//     };
//     return colors[status as keyof typeof colors] || colors.optimal;
//   };

//   return (
//     <ExchangeLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Exchange House Dashboard</h1>
//             <p className="text-muted-foreground">Manage KYB applications and branch operations across all locations</p>
//           </div>
//           {/* <div className="flex space-x-3">
//             <Button variant="outline">
//               <Settings className="h-4 w-4 mr-2" />
//               System Settings
//             </Button>
//             <Button variant="business">
//               <TrendingUp className="h-4 w-4 mr-2" />
//               View Reports
//             </Button>
//           </div> */}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">
//                     {stat.title}
//                   </CardTitle>
//                   <Icon className={`h-5 w-5 ${stat.color}`} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-foreground">{stat.value}</div>
//                   <p className="text-xs text-muted-foreground">{stat.change}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Recent KYB Applications */}
//           <div className="lg:col-span-2">
//             <Card className="shadow-card">
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Recent KYB Applications</CardTitle>
//                   <Button variant="ghost" size="sm">
//                     View All
//                     <ArrowUpRight className="h-4 w-4 ml-1" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {recentKYBApplications.map((application) => {
//                   const status = getStatusBadge(application.status);
//                   return (
//                     <div key={application.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <p className="font-medium text-foreground">{application.businessName}</p>
//                           <Badge variant={status.variant} className="text-xs">
//                             {status.label}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs">
//                             {application.priority.toUpperCase()}
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {application.id} • {application.branch}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           Assigned to: {application.assignedTo} • {application.submittedDate}
//                         </p>
//                       </div>
//                       <Button variant="outline" size="sm">
//                         Review
//                       </Button>
//                     </div>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Branch Workload */}
//           <div>
//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle>Branch Workload Distribution</CardTitle>
//               </CardHeader>
//               {/* <CardContent className="space-y-4">
//                 {branchWorkload.map((branch, index) => (
//                   <Card key={index} className={`border-l-4 ${getBranchStatusColor(branch.status)}`}>
//                     <CardContent className="p-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <h4 className="font-semibold text-foreground">{branch.branch}</h4>
//                           <Badge variant={branch.status === "optimal" ? "default" :
//                                         branch.status === "busy" ? "secondary" :
//                                         branch.status === "available" ? "outline" : "destructive"}>
//                             {branch.status}
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">Manager: {branch.manager}</p>
//                         <div className="grid grid-cols-2 gap-2 text-xs">
//                           <div>
//                             <span className="text-muted-foreground">Pending:</span>
//                             <span className="font-medium ml-1">{branch.pendingKYB}</span>
//                           </div>
//                           <div>
//                             <span className="text-muted-foreground">Completed:</span>
//                             <span className="font-medium ml-1">{branch.completed}</span>
//                           </div>
//                         </div>
//                         <div className="w-full bg-muted rounded-full h-2">
//                           <div
//                             className="bg-primary h-2 rounded-full transition-all"
//                             style={{ width: `${branch.efficiency}%` }}
//                           />
//                         </div>
//                         <p className="text-xs text-muted-foreground">Efficiency: {branch.efficiency}%</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </CardContent> */}
//               <p className="text-center pb-3">No Data Available</p>
//             </Card>
//           </div>
//         </div>

//         {/* System Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           <Card className="shadow-card">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <DollarSign className="h-5 w-5 text-primary" />
//                 Payout Mechanisms
//               </CardTitle>
//             </CardHeader>
//             {/* <CardContent className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Active Corridors</span>
//                 <span className="font-semibold">47</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Bank Partners</span>
//                 <span className="font-semibold">23</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Mobile Money</span>
//                 <span className="font-semibold">12</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Cash Pickup</span>
//                 <span className="font-semibold">156 locations</span>
//               </div>
//             </CardContent> */}
//             <p className="text-center pb-3">No Data Available</p>
//           </Card>

//           <Card className="shadow-card">
//             <CardHeader>
//               <CardTitle>System Health</CardTitle>
//             </CardHeader>
//             {/* <CardContent className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">API Uptime</span>
//                 <span className="font-semibold text-success">99.9%</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Response Time</span>
//                 <span className="font-semibold">145ms</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Failed Transactions</span>
//                 <span className="font-semibold text-destructive">0.3%</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Security Alerts</span>
//                 <span className="font-semibold text-success">0</span>
//               </div>
//             </CardContent> */}
//             <p className="text-center pb-3">No Data Available</p>
//           </Card>

//           <Card className="shadow-card">
//             <CardHeader>
//               <CardTitle>Compliance Status</CardTitle>
//             </CardHeader>
//             {/* <CardContent className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">AML Checks</span>
//                 <span className="font-semibold text-success">All Clear</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Regulatory Reports</span>
//                 <span className="font-semibold text-success">Up to date</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">License Status</span>
//                 <span className="font-semibold text-success">Active</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Audit Score</span>
//                 <span className="font-semibold">A+</span>
//               </div>
//             </CardContent> */}
//             <p className="text-center pb-3">No Data Available</p>
//           </Card>
//         </div>
//       </div>
//     </ExchangeLayout>
//   );
// };

// export default ExchangeAdminDashboard;

import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  Building,
  Users,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
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
  const fullName = cookies?.fullName;
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
          // Map stats to the UI format
          const mappedStats = [
            {
              title: "Total KYB Applications",
              value: data.data.stats.totalKYBApplications.toString(),
              change: "", // No change data in API, leave empty or add logic if needed
              icon: FileCheck,
              color: "text-blue-600",
            },
            {
              title: "Pending Review",
              value: data.data.stats.totalPendingReview.toString(),
              change: "", // No change data in API
              icon: Clock,
              color: "text-orange-600",
            },
            {
              title: "Active Businesses",
              value: data.data.stats.totalActiveBusiness.toString(),
              change: "", // No change data in API
              icon: Building,
              color: "text-green-600",
            },
            {
              title: "Branch Locations",
              value: data.data.stats.totalBranchLocations.toString(),
              change: "", // No change data in API
              icon: MapPin,
              color: "text-purple-600",
            },
          ];
          setStatsData(mappedStats);

          // Map recent KYB applications to UI format (adapt fields)
          const mappedRecent = data.data.recentKYBApplications.map((app) => ({
            id: app.id.toString(),
            businessName: app.companyName,
            submittedDate: "", // Not in API, default empty
            branch: app.branchName,
            priority: "", // Not in API, default empty
            status:
              app.kybStatus === "NOT_STARTED"
                ? "pending_review"
                : app.kybStatus.toLowerCase(), // Map status
            assignedTo: "", // Not in API, default empty
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

  const branchWorkload = [
    {
      branch: "Dubai Mall Branch",
      manager: "Ahmed Hassan",
      pendingKYB: 4,
      completed: 18,
      efficiency: 95,
      status: "optimal",
    },
    {
      branch: "Abu Dhabi ADGM Branch",
      manager: "Fatima Al-Zahra",
      pendingKYB: 7,
      completed: 22,
      efficiency: 88,
      status: "busy",
    },
    {
      branch: "Sharjah City Centre Branch",
      manager: "Omar Abdullah",
      pendingKYB: 2,
      completed: 12,
      efficiency: 92,
      status: "optimal",
    },
    {
      branch: "Dubai International City Branch",
      manager: "Priya Sharma",
      pendingKYB: 1,
      completed: 8,
      efficiency: 100,
      status: "available",
    },
  ];

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

  const getBranchStatusColor = (status: string) => {
    const colors = {
      optimal: "border-l-green-500",
      busy: "border-l-orange-500",
      available: "border-l-blue-500",
      overloaded: "border-l-red-500",
    };
    return colors[status as keyof typeof colors] || colors.optimal;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading branches data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
            <p className="text-muted-foreground">
              Manage KYB applications and branch operations across all locations
            </p>
          </div>
          {/* <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="business">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div> */}
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
                {recentKYBApplications.map((application) => {
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
                          {/* <Badge variant="outline" className="text-xs">
                            {application.priority.toUpperCase()}
                          </Badge> */}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {application.id} • {application.branch}
                        </p>
                        {/* <p className="text-xs text-muted-foreground">
                          Assigned to: {application.assignedTo} • {application.submittedDate}
                        </p> */}
                      </div>
                      {/*<Button variant="outline" size="sm">
                        Review
                      </Button>*/}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Branch Workload */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Branch Workload Distribution</CardTitle>
              </CardHeader>
              {/* <CardContent className="space-y-4">
                {branchWorkload.map((branch, index) => (
                  <Card key={index} className={`border-l-4 ${getBranchStatusColor(branch.status)}`}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">{branch.branch}</h4>
                          <Badge variant={branch.status === "optimal" ? "default" : 
                                        branch.status === "busy" ? "secondary" :
                                        branch.status === "available" ? "outline" : "destructive"}>
                            {branch.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Manager: {branch.manager}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Pending:</span>
                            <span className="font-medium ml-1">{branch.pendingKYB}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium ml-1">{branch.completed}</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${branch.efficiency}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Efficiency: {branch.efficiency}%</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent> */}
              <p className="text-center pb-3">No Data Available</p>
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
            {/* <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Corridors</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank Partners</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mobile Money</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cash Pickup</span>
                <span className="font-semibold">156 locations</span>
              </div>
            </CardContent> */}
            <p className="text-center pb-3">No Data Available</p>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Uptime</span>
                <span className="font-semibold text-success">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-semibold">145ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Failed Transactions</span>
                <span className="font-semibold text-destructive">0.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Security Alerts</span>
                <span className="font-semibold text-success">0</span>
              </div>
            </CardContent> */}
            <p className="text-center pb-3">No Data Available</p>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AML Checks</span>
                <span className="font-semibold text-success">All Clear</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Regulatory Reports</span>
                <span className="font-semibold text-success">Up to date</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">License Status</span>
                <span className="font-semibold text-success">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Audit Score</span>
                <span className="font-semibold">A+</span>
              </div>
            </CardContent> */}
            <p className="text-center pb-3">No Data Available</p>
          </Card>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeAdminDashboard;
