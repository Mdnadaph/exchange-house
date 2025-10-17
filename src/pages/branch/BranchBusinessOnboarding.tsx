import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessOnboardingForm from "@/components/governance/BusinessOnboardingForm";
import { 
  Building2, 
  CheckCircle, 
  Clock,
  Users,
  TrendingUp
} from "lucide-react";

const BranchBusinessOnboarding = () => {
  // Mock data for branch's onboarded businesses
  const recentBusinesses = [
    {
      id: "BIZ-008",
      companyName: "Retail Solutions LLC",
      tradeLicense: "TL-890123",
      registeredBranch: "Dubai Mall Branch",
      adminName: "Fatima Ali",
      adminEmail: "fatima@retailsolutions.ae",
      onboardedDate: "2024-01-22",
      status: "active",
      kybStatus: "pending_review"
    },
    {
      id: "BIZ-007",
      companyName: "Digital Services FZ",
      tradeLicense: "TL-789012",
      registeredBranch: "Dubai Mall Branch",
      adminName: "Omar Khalid",
      adminEmail: "omar@digitalservices.ae",
      onboardedDate: "2024-01-20",
      status: "active",
      kybStatus: "verified"
    }
  ];

  const stats = [
    {
      title: "Branch Businesses",
      value: "34",
      change: "+3 this month",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Pending KYB",
      value: "4",
      change: "Awaiting verification",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Verified",
      value: "30",
      change: "Active accounts",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "This Month",
      value: "3",
      change: "+1 from last month",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const getKYBStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending_review":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "pending_kyb":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />KYB Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge variant="default">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Onboarding</h1>
            <p className="text-muted-foreground">Register businesses for Dubai Mall Branch</p>
          </div>
          <BusinessOnboardingForm />
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

        {/* Recently Onboarded Businesses */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recently Onboarded by This Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-md transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{business.companyName}</h3>
                            {getStatusBadge(business.status)}
                            {getKYBStatusBadge(business.kybStatus)}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Business ID:</span>
                              <span className="ml-2 font-medium">{business.id}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Trade License:</span>
                              <span className="ml-2 font-medium">{business.tradeLicense}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Branch:</span>
                              <span className="ml-2 font-medium">{business.registeredBranch}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Onboarded:</span>
                              <span className="ml-2 font-medium">{business.onboardedDate}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Admin:</span>
                              <span className="ml-2 font-medium">{business.adminName}</span>
                              <span className="text-muted-foreground ml-2">({business.adminEmail})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </BranchLayout>
  );
};

export default BranchBusinessOnboarding;
