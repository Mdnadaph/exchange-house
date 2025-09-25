import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileCheck, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Download,
  MessageSquare,
  User,
  Building,
  MapPin,
  Calendar
} from "lucide-react";

const ExchangeKYBReview = () => {
  const kybApplications = [
    {
      id: "KYB-2024-089",
      businessName: "Tech Innovations LLC",
      businessType: "Technology Services",
      submittedDate: "2024-01-16 14:30",
      priority: "high",
      status: "pending_review",
      completeness: 95,
      riskScore: "Medium",
      branch: "Dubai Mall",
      assignedStaff: "Ahmed Hassan",
      contactPerson: "Sarah Johnson",
      email: "sarah@techinnovations.ae",
      phone: "+971 4 123 4567",
      address: "DIFC, Level 15, Building 3, Dubai, UAE",
      documents: [
        { name: "Trade License", status: "approved", uploadDate: "2024-01-16" },
        { name: "Emirates ID Copy", status: "pending", uploadDate: "2024-01-16" },
        { name: "Passport Copy", status: "approved", uploadDate: "2024-01-16" },
        { name: "Memorandum of Association", status: "requires_attention", uploadDate: "2024-01-16" },
        { name: "Proof of Address", status: "approved", uploadDate: "2024-01-16" },
        { name: "Source of Funds Declaration", status: "pending", uploadDate: "2024-01-16" },
        { name: "Bank Statement", status: "approved", uploadDate: "2024-01-16" }
      ],
      transactionProfile: {
        expectedVolume: "50,000 USD/month",
        expectedFrequency: "Weekly", 
        sourceOfFunds: "Business Operations",
        destinations: ["India", "Philippines", "Pakistan"]
      }
    },
    {
      id: "KYB-2024-088", 
      businessName: "Global Trading Co",
      businessType: "Import/Export",
      submittedDate: "2024-01-15 09:15",
      priority: "medium",
      status: "under_review",
      completeness: 100,
      riskScore: "Low",
      branch: "Abu Dhabi ADGM",
      assignedStaff: "Fatima Al-Zahra",
      contactPerson: "Michael Chen",
      email: "m.chen@globaltrading.ae",
      phone: "+971 2 987 6543",
      address: "ADGM Square, Abu Dhabi Global Market, Abu Dhabi, UAE",
      documents: [
        { name: "Trade License", status: "approved", uploadDate: "2024-01-15" },
        { name: "Emirates ID Copy", status: "approved", uploadDate: "2024-01-15" },
        { name: "Passport Copy", status: "approved", uploadDate: "2024-01-15" },
        { name: "Memorandum of Association", status: "approved", uploadDate: "2024-01-15" },
        { name: "VAT Certificate", status: "approved", uploadDate: "2024-01-15" },
        { name: "Proof of Address", status: "approved", uploadDate: "2024-01-15" },
        { name: "Source of Funds Declaration", status: "approved", uploadDate: "2024-01-15" }
      ],
      transactionProfile: {
        expectedVolume: "100,000 USD/month",
        expectedFrequency: "Daily",
        sourceOfFunds: "Export Proceeds",
        destinations: ["China", "India", "Bangladesh"]
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending_review: { variant: "secondary" as const, label: "Pending Review", icon: Clock },
      under_review: { variant: "destructive" as const, label: "Under Review", icon: Eye },
      approved: { variant: "default" as const, label: "Approved", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: XCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending_review;
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusMap = {
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "secondary" as const, label: "Pending" },
      requires_attention: { variant: "destructive" as const, label: "Requires Attention" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      "Low": "bg-green-100 text-green-800",
      "Medium": "bg-yellow-100 text-yellow-800", 
      "High": "bg-red-100 text-red-800"
    };
    return colors[risk as keyof typeof colors] || colors.Medium;
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">KYB Review & Approval</h1>
            <p className="text-muted-foreground">Review and process business verification applications</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button variant="business">
              Assign Reviewer
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Applications</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by business name, ID, or contact person..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">High Priority</Button>
                <Button variant="outline">Pending Review</Button>
                <Button variant="outline">Under Review</Button>
                <Button variant="outline">This Week</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYB Applications */}
        <div className="space-y-6">
          {kybApplications.map((application) => {
            const status = getStatusBadge(application.status);
            const StatusIcon = status.icon;
            
            return (
              <Card key={application.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{application.businessName}</h3>
                        <p className="text-sm text-muted-foreground">{application.id} • {application.businessType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {application.priority.toUpperCase()}
                      </Badge>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(application.riskScore)}`}>
                        {application.riskScore.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 rounded-lg p-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <User className="h-3 w-3 mr-1" />
                        Contact Person:
                      </div>
                      <p className="font-medium">{application.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">{application.email}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        Location:
                      </div>
                      <p className="font-medium">{application.address}</p>
                      <p className="text-xs text-muted-foreground">{application.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Submitted:
                      </div>
                      <p className="font-medium">{application.submittedDate}</p>
                      <p className="text-xs text-muted-foreground">Assigned: {application.assignedStaff}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-sm">Completeness:</span>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${application.completeness}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium">{application.completeness}% Complete</p>
                    </div>
                  </div>

                  {/* Transaction Profile */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Transaction Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Expected Volume:</span>
                        <p className="font-medium">{application.transactionProfile.expectedVolume}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <p className="font-medium">{application.transactionProfile.expectedFrequency}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Source of Funds:</span>
                        <p className="font-medium">{application.transactionProfile.sourceOfFunds}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Destinations:</span>
                        <p className="font-medium">{application.transactionProfile.destinations.join(", ")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Review */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Documents Review</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {application.documents.map((doc, index) => {
                        const docStatus = getDocumentStatusBadge(doc.status);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileCheck className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={docStatus.variant} className="text-xs">
                                {docStatus.label}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Review Comments */}
                      <div className="space-y-4">
                        <Label htmlFor={`comments-${application.id}`}>Review Comments</Label>
                        <Textarea 
                          id={`comments-${application.id}`}
                          placeholder="Add review comments, questions, or requirements..."
                          rows={4}
                        />
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <Label>Review Actions</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="default" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="destructive" className="w-full">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button variant="outline" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Info
                          </Button>
                          <Button variant="outline" className="w-full">
                            <User className="h-4 w-4 mr-2" />
                            Assign Reviewer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeKYBReview;