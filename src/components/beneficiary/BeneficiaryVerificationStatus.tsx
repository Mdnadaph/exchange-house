import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  User, 
  Banknote, 
  MapPin,
  Upload,
  Eye,
  RefreshCw
} from "lucide-react";

interface VerificationStep {
  id: string;
  name: string;
  status: "completed" | "pending" | "failed" | "not_started";
  description: string;
  icon: any;
  documents?: string[];
}

interface BeneficiaryVerificationStatusProps {
  beneficiaryId: string;
  beneficiaryName: string;
  overallStatus: "verified" | "pending" | "rejected" | "incomplete";
  completionPercentage: number;
  steps: VerificationStep[];
  lastUpdated: string;
}

const BeneficiaryVerificationStatus = ({
  beneficiaryId,
  beneficiaryName,
  overallStatus,
  completionPercentage,
  steps,
  lastUpdated
}: BeneficiaryVerificationStatusProps) => {
  
  const getStatusColor = (status: string) => {
    const colors = {
      verified: "text-success",
      pending: "text-warning", 
      rejected: "text-destructive",
      incomplete: "text-muted-foreground"
    };
    return colors[status as keyof typeof colors] || colors.incomplete;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      verified: { variant: "default" as const, label: "Verified", icon: CheckCircle },
      pending: { variant: "secondary" as const, label: "Under Review", icon: Clock },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: AlertCircle },
      incomplete: { variant: "outline" as const, label: "Incomplete", icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.incomplete;
  };

  const getStepStatusIcon = (status: string) => {
    const iconMap = {
      completed: { icon: CheckCircle, color: "text-success" },
      pending: { icon: Clock, color: "text-warning" },
      failed: { icon: AlertCircle, color: "text-destructive" },
      not_started: { icon: AlertCircle, color: "text-muted-foreground" }
    };
    return iconMap[status as keyof typeof iconMap] || iconMap.not_started;
  };

  const overallStatusInfo = getStatusBadge(overallStatus);
  const StatusIcon = overallStatusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${getStatusColor(overallStatus)}`} />
                Beneficiary Verification Status
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {beneficiaryName} • ID: {beneficiaryId}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={overallStatusInfo.variant} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {overallStatusInfo.label}
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Verification Progress</span>
                <span className="text-sm text-muted-foreground">{completionPercentage}% Complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Verification Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const stepStatus = getStepStatusIcon(step.status);
              const StepIcon = step.icon;
              const StepStatusIcon = stepStatus.icon;
              
              return (
                <Card key={step.id} className={`border-l-4 ${
                  step.status === "completed" ? "border-l-success" :
                  step.status === "pending" ? "border-l-warning" :
                  step.status === "failed" ? "border-l-destructive" : 
                  "border-l-muted"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Step Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === "completed" ? "bg-success/10" :
                        step.status === "pending" ? "bg-warning/10" :
                        step.status === "failed" ? "bg-destructive/10" :
                        "bg-muted"
                      }`}>
                        <StepIcon className={`h-5 w-5 ${
                          step.status === "completed" ? "text-success" :
                          step.status === "pending" ? "text-warning" :
                          step.status === "failed" ? "text-destructive" :
                          "text-muted-foreground"
                        }`} />
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-foreground">{step.name}</h4>
                            <div className="flex items-center gap-1">
                              <StepStatusIcon className={`h-4 w-4 ${stepStatus.color}`} />
                              <span className={`text-sm font-medium ${stepStatus.color}`}>
                                {step.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        
                        {/* Documents if applicable */}
                        {step.documents && step.documents.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">Required Documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {step.documents.map((doc, docIndex) => (
                                <Badge key={docIndex} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-3">
                          {step.status === "not_started" && (
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Documents
                            </Button>
                          )}
                          {step.status === "pending" && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Submission
                            </Button>
                          )}
                          {step.status === "failed" && (
                            <Button variant="destructive" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Re-submit
                            </Button>
                          )}
                          {step.status === "completed" && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Approved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {overallStatus !== "verified" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overallStatus === "incomplete" && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Complete Missing Information</p>
                  <p className="text-sm text-muted-foreground">
                    Please complete all required verification steps to activate this beneficiary for payments.
                  </p>
                </div>
              )}
              
              {overallStatus === "pending" && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Under Review</p>
                  <p className="text-sm text-muted-foreground">
                    Your beneficiary verification is currently being reviewed by our compliance team. 
                    This typically takes 1-2 business days.
                  </p>
                </div>
              )}
              
              {overallStatus === "rejected" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Verification Rejected</p>
                  <p className="text-sm text-muted-foreground">
                    Some documents or information were rejected. Please review the failed steps above 
                    and re-submit the required documentation.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BeneficiaryVerificationStatus;