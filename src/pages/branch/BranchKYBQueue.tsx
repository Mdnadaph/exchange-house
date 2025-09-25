import BranchLayout from "@/components/layout/BranchLayout";
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
  Calendar,
  Timer
} from "lucide-react";

const BranchKYBQueue = () => {
  const kybQueue = [
    {
      id: "KYB-2024-089",
      businessName: "Tech Innovations LLC",
      businessType: "Technology Services", 
      assignedDate: "2024-01-16 10:30",
      dueDate: "2024-01-18",
      priority: "high",
      status: "in_progress",
      completeness: 85,
      timeSpent: "2.5 hours",
      contactPerson: "Sarah Johnson",
      email: "sarah@techinnovations.ae",
      phone: "+971 4 123 4567",
      documents: [
        { name: "Trade License", status: "approved", reviewDate: "2024-01-16" },
        { name: "Bank Statement", status: "pending", reviewDate: null },
        { name: "Memorandum", status: "requires_attention", reviewDate: "2024-01-16" },
        { name: "Passport Copy", status: "approved", reviewDate: "2024-01-16" }
      ],
      notes: "Memorandum requires updated signatures from all directors. Bank statement needs to be more recent (within 3 months)."
    },
    {
      id: "KYB-2024-085",
      businessName: "Emirates Logistics",
      businessType: "Logistics & Transportation",
      assignedDate: "2024-01-15 14:20",
      dueDate: "2024-01-19", 
      priority: "medium",
      status: "pending_documents",
      completeness: 70,
      timeSpent: "1.8 hours",
      contactPerson: "Mohammed Al-Rashid",
      email: "m.alrashid@emirateslogistics.ae",
      phone: "+971 4 567 8901",
      documents: [
        { name: "Trade License", status: "approved", reviewDate: "2024-01-15" },
        { name: "Bank Statement", status: "missing", reviewDate: null },
        { name: "Insurance Certificate", status: "pending", reviewDate: null },
        { name: "Passport Copy", status: "approved", reviewDate: "2024-01-15" }
      ],
      notes: "Waiting for bank statement and insurance certificate. Client confirmed documents will be submitted by EOD tomorrow."
    },
    {
      id: "KYB-2024-082",
      businessName: "Al Salam Trading",
      businessType: "Import/Export",
      assignedDate: "2024-01-14 09:15",
      dueDate: "2024-01-20",
      priority: "low", 
      status: "ready_for_review",
      completeness: 100,
      timeSpent: "3.2 hours",
      contactPerson: "Fatima Al-Zahra",
      email: "fatima@alsalamtrading.ae", 
      phone: "+971 2 234 5678",
      documents: [
        { name: "Trade License", status: "approved", reviewDate: "2024-01-14" },
        { name: "Bank Statement", status: "approved", reviewDate: "2024-01-14" },
        { name: "Import/Export License", status: "approved", reviewDate: "2024-01-14" },
        { name: "Passport Copy", status: "approved", reviewDate: "2024-01-14" }
      ],
      notes: "All documents verified and approved. Application ready for final approval decision."
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      in_progress: { variant: "secondary" as const, label: "In Progress", icon: Clock },
      pending_documents: { variant: "destructive" as const, label: "Pending Documents", icon: AlertCircle },
      ready_for_review: { variant: "default" as const, label: "Ready for Review", icon: Eye },
      completed: { variant: "default" as const, label: "Completed", icon: CheckCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.in_progress;
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusMap = {
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "secondary" as const, label: "Pending Review" },
      requires_attention: { variant: "destructive" as const, label: "Requires Attention" },
      missing: { variant: "destructive" as const, label: "Missing" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "border-l-red-500",
      medium: "border-l-orange-500", 
      low: "border-l-green-500"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTimeUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: "text-destructive" };
    if (diffDays === 0) return { text: "Due today", color: "text-warning" };
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-warning" };
    return { text: `${diffDays} days remaining`, color: "text-muted-foreground" };
  };

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">KYB Review Queue</h1>
            <p className="text-muted-foreground">Process assigned KYB applications and manage your workload</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Queue
            </Button>
            <Button variant="business">
              <Timer className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>
        </div>

        {/* Queue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned</CardTitle>
              <FileCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kybQueue.length}</div>
              <p className="text-xs text-muted-foreground">Applications in queue</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {kybQueue.filter(app => app.priority === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent applications</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready for Review</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {kybQueue.filter(app => app.status === "ready_for_review").length}
              </div>
              <p className="text-xs text-muted-foreground">Can be finalized</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Review Time</CardTitle>
              <Timer className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">Per application</p>
            </CardContent>
          </Card>
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
                <Button variant="outline">Due Today</Button>
                <Button variant="outline">Ready to Review</Button>
                <Button variant="outline">In Progress</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYB Queue */}
        <div className="space-y-6">
          {kybQueue.map((application) => {
            const status = getStatusBadge(application.status);
            const StatusIcon = status.icon;
            const timeUntilDue = getTimeUntilDue(application.dueDate);
            
            return (
              <Card key={application.id} className={`shadow-card border-l-4 ${getPriorityColor(application.priority)}`}>
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
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Application Details */}
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
                        <Calendar className="h-3 w-3 mr-1" />
                        Timeline:
                      </div>
                      <p className="font-medium">Due: {application.dueDate}</p>
                      <p className={`text-xs ${timeUntilDue.color}`}>{timeUntilDue.text}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Timer className="h-3 w-3 mr-1" />
                        Progress:
                      </div>
                      <p className="font-medium">{application.completeness}% Complete</p>
                      <p className="text-xs text-muted-foreground">Time spent: {application.timeSpent}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-sm">Assigned:</span>
                      <p className="font-medium">{application.assignedDate}</p>
                      <p className="text-xs text-muted-foreground">Phone: {application.phone}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Review Progress</span>
                      <span className="text-sm text-muted-foreground">{application.completeness}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${application.completeness}%` }}
                      />
                    </div>
                  </div>

                  {/* Documents Review */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Documents Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {application.documents.map((doc, index) => {
                        const docStatus = getDocumentStatusBadge(doc.status);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileCheck className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                {doc.reviewDate && (
                                  <p className="text-xs text-muted-foreground">Reviewed: {doc.reviewDate}</p>
                                )}
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

                  {/* Review Notes */}
                  {application.notes && (
                    <div className="bg-accent-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Review Notes</h4>
                      <p className="text-sm text-muted-foreground">{application.notes}</p>
                    </div>
                  )}

                  {/* Action Section */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Add Notes */}
                      <div className="space-y-4">
                        <Label htmlFor={`notes-${application.id}`}>Add Review Notes</Label>
                        <Textarea 
                          id={`notes-${application.id}`}
                          placeholder="Add notes about this application review..."
                          rows={3}
                        />
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <Label>Review Actions</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {application.status === "ready_for_review" ? (
                            <>
                              <Button variant="default" className="w-full">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button variant="destructive" className="w-full">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="business" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                Continue Review
                              </Button>
                              <Button variant="outline" className="w-full">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Client
                              </Button>
                            </>
                          )}
                          <Button variant="outline" className="w-full">
                            <Timer className="h-4 w-4 mr-2" />
                            Log Time
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Docs
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
    </BranchLayout>
  );
};

export default BranchKYBQueue;