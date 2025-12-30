//import ExchangeLayout from "@/components/layout/ExchangeLayout";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import { Switch } from "@/components/ui/switch";
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import { Textarea } from "@/components/ui/textarea";
//import {
//  Settings,
//  Shield,
//  FileCheck,
//  AlertTriangle,
//  Clock,
//  Building,
//  Users,
//  Plus,
//  Edit,
//  Trash2,
//  Save,
//} from "lucide-react";

//const ExchangeKYBConfig = () => {
//  const kybRules = [
//    {
//      id: 1,
//      name: "Standard Business KYB",
//      businessType: "all",
//      requiredDocs: [
//        "Trade License",
//        "Emirates ID",
//        "Passport",
//        "MOA",
//        "Bank Statement",
//      ],
//      autoApprovalLimit: 50000,
//      reviewTiers: 2,
//      maxProcessingTime: 48,
//      status: "active",
//      compliance: "standard",
//    },
//    {
//      id: 2,
//      name: "High-Risk Business KYB",
//      businessType: "money_services",
//      requiredDocs: [
//        "Trade License",
//        "Emirates ID",
//        "Passport",
//        "MOA",
//        "Bank Statement",
//        "Source of Funds",
//        "Business Plan",
//        "Compliance Certificate",
//      ],
//      autoApprovalLimit: 10000,
//      reviewTiers: 3,
//      maxProcessingTime: 72,
//      status: "active",
//      compliance: "enhanced",
//    },
//    {
//      id: 3,
//      name: "Import/Export Business KYB",
//      businessType: "import_export",
//      requiredDocs: [
//        "Trade License",
//        "Emirates ID",
//        "Passport",
//        "MOA",
//        "Import/Export License",
//        "Customs Registration",
//      ],
//      autoApprovalLimit: 100000,
//      reviewTiers: 2,
//      maxProcessingTime: 48,
//      status: "active",
//      compliance: "standard",
//    },
//  ];

//  const documentTypes = [
//    {
//      id: "trade_license",
//      name: "Trade License",
//      required: true,
//      category: "business",
//    },
//    {
//      id: "emirates_id",
//      name: "Emirates ID Copy",
//      required: true,
//      category: "identity",
//    },
//    {
//      id: "passport",
//      name: "Passport Copy",
//      required: true,
//      category: "identity",
//    },
//    {
//      id: "moa",
//      name: "Memorandum of Association",
//      required: true,
//      category: "business",
//    },
//    {
//      id: "bank_statement",
//      name: "Bank Statement (3 months)",
//      required: true,
//      category: "financial",
//    },
//    {
//      id: "source_funds",
//      name: "Source of Funds Declaration",
//      required: false,
//      category: "financial",
//    },
//    {
//      id: "business_plan",
//      name: "Business Plan",
//      required: false,
//      category: "business",
//    },
//    {
//      id: "compliance_cert",
//      name: "Compliance Certificate",
//      required: false,
//      category: "regulatory",
//    },
//    {
//      id: "import_export",
//      name: "Import/Export License",
//      required: false,
//      category: "regulatory",
//    },
//    {
//      id: "customs_reg",
//      name: "Customs Registration",
//      required: false,
//      category: "regulatory",
//    },
//  ];

//  const getComplianceBadge = (compliance: string) => {
//    const badges = {
//      standard: {
//        variant: "default" as const,
//        label: "Standard",
//        icon: FileCheck,
//      },
//      enhanced: {
//        variant: "secondary" as const,
//        label: "Enhanced",
//        icon: Shield,
//      },
//      strict: {
//        variant: "destructive" as const,
//        label: "Strict",
//        icon: AlertTriangle,
//      },
//    };
//    return badges[compliance as keyof typeof badges] || badges.standard;
//  };

//  const getStatusBadge = (status: string) => {
//    const badges = {
//      active: { variant: "default" as const, label: "Active" },
//      inactive: { variant: "secondary" as const, label: "Inactive" },
//      draft: { variant: "outline" as const, label: "Draft" },
//    };
//    return badges[status as keyof typeof badges] || badges.draft;
//  };

//  return (
//    <ExchangeLayout>
//      <div className="space-y-8">
//        {/* Header */}
//        <div className="flex items-center justify-between">
//          <div>
//            <h1 className="text-3xl font-bold text-foreground">
//              KYB Rules Configuration
//            </h1>
//            <p className="text-muted-foreground">
//              Configure business verification rules, document requirements, and
//              approval workflows
//            </p>
//          </div>
//          <div className="flex space-x-3">
//            <Button variant="outline">
//              <FileCheck className="h-4 w-4 mr-2" />
//              Import Template
//            </Button>
//            <Button variant="business">
//              <Plus className="h-4 w-4 mr-2" />
//              Create New Rule
//            </Button>
//          </div>
//        </div>

//        {/* Global KYB Settings */}
//        <Card className="shadow-card">
//          <CardHeader>
//            <CardTitle className="flex items-center gap-2">
//              <Settings className="h-5 w-5 text-primary" />
//              Global KYB Settings
//            </CardTitle>
//          </CardHeader>
//          <CardContent className="space-y-6">
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//              <div className="space-y-2">
//                <Label htmlFor="default-processing">
//                  Default Processing Time (hours)
//                </Label>
//                <Input
//                  id="default-processing"
//                  type="number"
//                  defaultValue="48"
//                />
//              </div>
//              <div className="space-y-2">
//                <Label htmlFor="auto-assignment">Auto Assignment</Label>
//                <Switch id="auto-assignment" defaultChecked />
//              </div>
//              <div className="space-y-2">
//                <Label htmlFor="notification-alerts">Notification Alerts</Label>
//                <Switch id="notification-alerts" defaultChecked />
//              </div>
//            </div>

//            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//              <div className="space-y-2">
//                <Label htmlFor="quality-threshold">
//                  Quality Review Threshold (%)
//                </Label>
//                <Input
//                  id="quality-threshold"
//                  type="number"
//                  defaultValue="95"
//                  min="0"
//                  max="100"
//                />
//              </div>
//              <div className="space-y-2">
//                <Label htmlFor="escalation-timeout">
//                  Escalation Timeout (hours)
//                </Label>
//                <Input
//                  id="escalation-timeout"
//                  type="number"
//                  defaultValue="24"
//                />
//              </div>
//            </div>
//          </CardContent>
//        </Card>

//        {/* Business Type Rules */}
//        <Card className="shadow-card">
//          <CardHeader>
//            <CardTitle>Business Type KYB Rules</CardTitle>
//          </CardHeader>
//          <CardContent className="space-y-6">
//            {kybRules.map((rule) => {
//              const complianceBadge = getComplianceBadge(rule.compliance);
//              const statusBadge = getStatusBadge(rule.status);
//              const ComplianceIcon = complianceBadge.icon;

//              return (
//                <Card key={rule.id} className="border-l-4 border-l-primary">
//                  <CardHeader>
//                    <div className="flex items-center justify-between">
//                      <div className="flex items-center gap-3">
//                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                          <Building className="h-5 w-5 text-primary" />
//                        </div>
//                        <div>
//                          <h4 className="text-lg font-semibold text-foreground">
//                            {rule.name}
//                          </h4>
//                          <p className="text-sm text-muted-foreground capitalize">
//                            Business Type: {rule.businessType.replace("_", " ")}
//                          </p>
//                        </div>
//                      </div>
//                      <div className="flex items-center gap-2">
//                        <Badge
//                          variant={complianceBadge.variant}
//                          className="flex items-center gap-1"
//                        >
//                          <ComplianceIcon className="h-3 w-3" />
//                          {complianceBadge.label}
//                        </Badge>
//                        <Badge variant={statusBadge.variant}>
//                          {statusBadge.label}
//                        </Badge>
//                      </div>
//                    </div>
//                  </CardHeader>

//                  <CardContent className="space-y-4">
//                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
//                      <div className="space-y-1">
//                        <div className="flex items-center text-muted-foreground text-sm">
//                          <Shield className="h-3 w-3 mr-1" />
//                          Auto-Approval Limit:
//                        </div>
//                        <p className="font-medium">
//                          ${rule.autoApprovalLimit.toLocaleString()}
//                        </p>
//                      </div>
//                      <div className="space-y-1">
//                        <div className="flex items-center text-muted-foreground text-sm">
//                          <Users className="h-3 w-3 mr-1" />
//                          Review Tiers:
//                        </div>
//                        <p className="font-medium">{rule.reviewTiers} levels</p>
//                      </div>
//                      <div className="space-y-1">
//                        <div className="flex items-center text-muted-foreground text-sm">
//                          <Clock className="h-3 w-3 mr-1" />
//                          Max Processing:
//                        </div>
//                        <p className="font-medium">
//                          {rule.maxProcessingTime} hours
//                        </p>
//                      </div>
//                    </div>

//                    <div>
//                      <h5 className="font-semibold text-foreground mb-2">
//                        Required Documents
//                      </h5>
//                      <div className="flex flex-wrap gap-2">
//                        {rule.requiredDocs.map((doc, index) => (
//                          <Badge
//                            key={index}
//                            variant="outline"
//                            className="text-xs"
//                          >
//                            {doc}
//                          </Badge>
//                        ))}
//                      </div>
//                    </div>

//                    <div className="flex justify-end space-x-2">
//                      <Button variant="outline" size="sm">
//                        <Edit className="h-3 w-3 mr-1" />
//                        Edit
//                      </Button>
//                      <Button variant="outline" size="sm">
//                        <Trash2 className="h-3 w-3 mr-1" />
//                        Delete
//                      </Button>
//                    </div>
//                  </CardContent>
//                </Card>
//              );
//            })}
//          </CardContent>
//        </Card>

//        {/* Document Configuration */}
//        <Card className="shadow-card">
//          <CardHeader>
//            <CardTitle>Document Type Configuration</CardTitle>
//          </CardHeader>
//          <CardContent className="space-y-4">
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//              {documentTypes.map((doc) => (
//                <Card key={doc.id} className="p-4">
//                  <div className="flex items-center justify-between mb-2">
//                    <h5 className="font-medium text-foreground">{doc.name}</h5>
//                    <Switch defaultChecked={doc.required} />
//                  </div>
//                  <p className="text-xs text-muted-foreground capitalize mb-2">
//                    Category: {doc.category}
//                  </p>
//                  <Badge
//                    variant={doc.required ? "default" : "outline"}
//                    className="text-xs"
//                  >
//                    {doc.required ? "Required" : "Optional"}
//                  </Badge>
//                </Card>
//              ))}
//            </div>
//          </CardContent>
//        </Card>

//        {/* Risk Assessment Rules */}
//        <Card className="shadow-card">
//          <CardHeader>
//            <CardTitle className="flex items-center gap-2">
//              <AlertTriangle className="h-5 w-5 text-warning" />
//              Risk Assessment Rules
//            </CardTitle>
//          </CardHeader>
//          <CardContent className="space-y-6">
//            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//              <div className="space-y-4">
//                <h4 className="font-semibold text-foreground">
//                  High-Risk Indicators
//                </h4>
//                <div className="space-y-3">
//                  <div className="flex items-center justify-between p-3 border rounded-lg">
//                    <span className="text-sm">Shell company indicators</span>
//                    <Switch defaultChecked />
//                  </div>
//                  <div className="flex items-center justify-between p-3 border rounded-lg">
//                    <span className="text-sm">
//                      PEP (Politically Exposed Person)
//                    </span>
//                    <Switch defaultChecked />
//                  </div>
//                  <div className="flex items-center justify-between p-3 border rounded-lg">
//                    <span className="text-sm">
//                      High-risk country operations
//                    </span>
//                    <Switch defaultChecked />
//                  </div>
//                  <div className="flex items-center justify-between p-3 border rounded-lg">
//                    <span className="text-sm">Cash-intensive business</span>
//                    <Switch defaultChecked />
//                  </div>
//                </div>
//              </div>

//              <div className="space-y-4">
//                <h4 className="font-semibold text-foreground">
//                  Auto-Escalation Rules
//                </h4>
//                <div className="space-y-3">
//                  <div className="space-y-2">
//                    <Label htmlFor="high-risk-threshold">
//                      High Risk Threshold ($)
//                    </Label>
//                    <Input
//                      id="high-risk-threshold"
//                      type="number"
//                      defaultValue="500000"
//                    />
//                  </div>
//                  <div className="space-y-2">
//                    <Label htmlFor="enhanced-dd">
//                      Enhanced Due Diligence Threshold ($)
//                    </Label>
//                    <Input
//                      id="enhanced-dd"
//                      type="number"
//                      defaultValue="1000000"
//                    />
//                  </div>
//                  <div className="space-y-2">
//                    <Label htmlFor="manual-review">
//                      Manual Review Required Above ($)
//                    </Label>
//                    <Input
//                      id="manual-review"
//                      type="number"
//                      defaultValue="250000"
//                    />
//                  </div>
//                </div>
//              </div>
//            </div>
//          </CardContent>
//        </Card>

//        {/* Action Buttons */}
//        <div className="flex justify-end space-x-3">
//          <Button variant="outline">Reset to Defaults</Button>
//          <Button variant="business">
//            <Save className="h-4 w-4 mr-2" />
//            Save Configuration
//          </Button>
//        </div>
//      </div>
//    </ExchangeLayout>
//  );
//};

//export default ExchangeKYBConfig;

import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import CreateKybRule from "@/components/kyb/CreateKybRule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Shield,
  FileCheck,
  AlertTriangle,
  Clock,
  Building,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const ExchangeKYBConfig = () => {
  const navigate = useNavigate();
  const kybRules = [
    {
      id: 1,
      name: "Standard Business KYB",
      businessType: "all",
      requiredDocs: [
        "Trade License",
        "Emirates ID",
        "Passport",
        "MOA",
        "Bank Statement",
      ],
      autoApprovalLimit: 50000,
      reviewTiers: 2,
      maxProcessingTime: 48,
      status: "active",
      compliance: "standard",
    },
    {
      id: 2,
      name: "High-Risk Business KYB",
      businessType: "money_services",
      requiredDocs: [
        "Trade License",
        "Emirates ID",
        "Passport",
        "MOA",
        "Bank Statement",
        "Source of Funds",
        "Business Plan",
        "Compliance Certificate",
      ],
      autoApprovalLimit: 10000,
      reviewTiers: 3,
      maxProcessingTime: 72,
      status: "active",
      compliance: "enhanced",
    },
    {
      id: 3,
      name: "Import/Export Business KYB",
      businessType: "import_export",
      requiredDocs: [
        "Trade License",
        "Emirates ID",
        "Passport",
        "MOA",
        "Import/Export License",
        "Customs Registration",
      ],
      autoApprovalLimit: 100000,
      reviewTiers: 2,
      maxProcessingTime: 48,
      status: "active",
      compliance: "standard",
    },
  ];

  const documentTypes = [
    {
      id: "trade_license",
      name: "Trade License",
      required: true,
      category: "business",
    },
    {
      id: "emirates_id",
      name: "Emirates ID Copy",
      required: true,
      category: "identity",
    },
    {
      id: "passport",
      name: "Passport Copy",
      required: true,
      category: "identity",
    },
    {
      id: "moa",
      name: "Memorandum of Association",
      required: true,
      category: "business",
    },
    {
      id: "bank_statement",
      name: "Bank Statement (3 months)",
      required: true,
      category: "financial",
    },
    {
      id: "source_funds",
      name: "Source of Funds Declaration",
      required: false,
      category: "financial",
    },
    {
      id: "business_plan",
      name: "Business Plan",
      required: false,
      category: "business",
    },
    {
      id: "compliance_cert",
      name: "Compliance Certificate",
      required: false,
      category: "regulatory",
    },
    {
      id: "import_export",
      name: "Import/Export License",
      required: false,
      category: "regulatory",
    },
    {
      id: "customs_reg",
      name: "Customs Registration",
      required: false,
      category: "regulatory",
    },
  ];

  const getComplianceBadge = (compliance: string) => {
    const badges = {
      standard: {
        variant: "default" as const,
        label: "Standard",
        icon: FileCheck,
      },
      enhanced: {
        variant: "secondary" as const,
        label: "Enhanced",
        icon: Shield,
      },
      strict: {
        variant: "destructive" as const,
        label: "Strict",
        icon: AlertTriangle,
      },
    };
    return badges[compliance as keyof typeof badges] || badges.standard;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { variant: "default" as const, label: "Active" },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      draft: { variant: "outline" as const, label: "Draft" },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYB Rules Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure business verification rules, document requirements, and
              approval workflows
            </p>
          </div>
          {/*<div className="flex space-x-3">
            <Button variant="outline">
              <FileCheck className="h-4 w-4 mr-2" />
              Import Template
            </Button>
            <Button
              variant="business"
              onClick={() => navigate("/exchange/create-kyb-rule")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Rule
            </Button>
          </div>*/}
          <div className="flex space-x-3">
            <Button variant="outline">
              <FileCheck className="h-4 w-4 mr-2" />
              Import Template
            </Button>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="business">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                      <DialogTitle className="text-xl">
                        Create KYB Rule
                      </DialogTitle>
                      <DialogDescription>
                        Configure a new Know Your Business rule for different
                        business types
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <CreateKybRule
                      isModal={true}
                      onClose={() => setIsCreateModalOpen(false)}
                      onSuccess={() => {
                        // Refresh logic here
                        console.log("KYB Rule created successfully!");
                        setIsCreateModalOpen(false);
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Global KYB Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Global KYB Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default-processing">
                  Default Processing Time (hours)
                </Label>
                <Input
                  id="default-processing"
                  type="number"
                  defaultValue="48"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-assignment">Auto Assignment</Label>
                <Switch id="auto-assignment" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-alerts">Notification Alerts</Label>
                <Switch id="notification-alerts" defaultChecked />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quality-threshold">
                  Quality Review Threshold (%)
                </Label>
                <Input
                  id="quality-threshold"
                  type="number"
                  defaultValue="95"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalation-timeout">
                  Escalation Timeout (hours)
                </Label>
                <Input
                  id="escalation-timeout"
                  type="number"
                  defaultValue="24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Type Rules */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Business Type KYB Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {kybRules.map((rule) => {
              const complianceBadge = getComplianceBadge(rule.compliance);
              const statusBadge = getStatusBadge(rule.status);
              const ComplianceIcon = complianceBadge.icon;

              return (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">
                            {rule.name}
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            Business Type: {rule.businessType.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={complianceBadge.variant}
                          className="flex items-center gap-1"
                        >
                          <ComplianceIcon className="h-3 w-3" />
                          {complianceBadge.label}
                        </Badge>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Shield className="h-3 w-3 mr-1" />
                          Auto-Approval Limit:
                        </div>
                        <p className="font-medium">
                          ${rule.autoApprovalLimit.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          Review Tiers:
                        </div>
                        <p className="font-medium">{rule.reviewTiers} levels</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          Max Processing:
                        </div>
                        <p className="font-medium">
                          {rule.maxProcessingTime} hours
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-foreground mb-2">
                        Required Documents
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {rule.requiredDocs.map((doc, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Document Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Document Type Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentTypes.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{doc.name}</h5>
                    <Switch defaultChecked={doc.required} />
                  </div>
                  <p className="text-xs text-muted-foreground capitalize mb-2">
                    Category: {doc.category}
                  </p>
                  <Badge
                    variant={doc.required ? "default" : "outline"}
                    className="text-xs"
                  >
                    {doc.required ? "Required" : "Optional"}
                  </Badge>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Rules */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Assessment Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  High-Risk Indicators
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Shell company indicators</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">
                      PEP (Politically Exposed Person)
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">
                      High-risk country operations
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Cash-intensive business</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Auto-Escalation Rules
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="high-risk-threshold">
                      High Risk Threshold ($)
                    </Label>
                    <Input
                      id="high-risk-threshold"
                      type="number"
                      defaultValue="500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enhanced-dd">
                      Enhanced Due Diligence Threshold ($)
                    </Label>
                    <Input
                      id="enhanced-dd"
                      type="number"
                      defaultValue="1000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-review">
                      Manual Review Required Above ($)
                    </Label>
                    <Input
                      id="manual-review"
                      type="number"
                      defaultValue="250000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button variant="business">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeKYBConfig;
