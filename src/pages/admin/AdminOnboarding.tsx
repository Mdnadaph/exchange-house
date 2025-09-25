import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileCheck, 
  Building, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye,
  Download,
  Plus,
  Search
} from "lucide-react";

const AdminOnboarding = () => {
  const kybApplications = [
    {
      id: "KYB-001",
      businessName: "TechCorp LLC",
      submissionDate: "2024-01-15",
      status: "pending_review",
      documents: 8,
      completeness: 95,
      assignedTo: "Sarah Wilson",
      priority: "high"
    },
    {
      id: "KYB-002", 
      businessName: "Global Solutions Inc",
      submissionDate: "2024-01-14",
      status: "under_review",
      documents: 6,
      completeness: 100,
      assignedTo: "Mike Johnson",
      priority: "medium"
    },
    {
      id: "KYB-003",
      businessName: "Trading Partners Ltd",
      submissionDate: "2024-01-12",
      status: "approved",
      documents: 7,
      completeness: 100,
      assignedTo: "Sarah Wilson", 
      priority: "low"
    },
    {
      id: "KYB-004",
      businessName: "Innovation Hub DMCC",
      submissionDate: "2024-01-10",
      status: "requires_documents",
      documents: 4,
      completeness: 60,
      assignedTo: "Mike Johnson",
      priority: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending_review: { variant: "secondary" as const, label: "Pending Review", icon: Clock },
      under_review: { variant: "secondary" as const, label: "Under Review", icon: Eye },
      approved: { variant: "default" as const, label: "Approved", icon: CheckCircle },
      requires_documents: { variant: "destructive" as const, label: "Requires Documents", icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending_review;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "border-l-red-500",
      medium: "border-l-orange-500",
      low: "border-l-green-500"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">KYB Onboarding Management</h1>
            <p className="text-muted-foreground">Review and manage business verification applications</p>
          </div>
          <Button variant="business">
            <Plus className="h-4 w-4 mr-2" />
            Initiate KYB
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <FileCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">2 due today</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">18</div>
              <p className="text-xs text-muted-foreground">75% approval rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Requires Action</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">Missing documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Applications</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by business name or ID..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">High Priority</Button>
                <Button variant="outline">Due Today</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYB Applications Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>KYB Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kybApplications.map((application) => {
                const status = getStatusBadge(application.status);
                const StatusIcon = status.icon;
                
                return (
                  <Card 
                    key={application.id} 
                    className={`border-l-4 ${getPriorityColor(application.priority)} hover:shadow-md transition-smooth`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{application.businessName}</h3>
                              <p className="text-sm text-muted-foreground">ID: {application.id}</p>
                            </div>
                            <Badge variant={status.variant} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {application.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Submitted:</span>
                              <p className="font-medium">{application.submissionDate}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Documents:</span>
                              <p className="font-medium">{application.documents} uploaded</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Completeness:</span>
                              <p className="font-medium">{application.completeness}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Assigned to:</span>
                              <p className="font-medium">{application.assignedTo}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Documents
                          </Button>
                          {application.status === "requires_documents" && (
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-1" />
                              Request Docs
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Completion Progress</span>
                          <span className="text-xs font-medium">{application.completeness}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${application.completeness}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOnboarding;