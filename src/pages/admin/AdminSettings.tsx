import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Shield, 
  DollarSign, 
  Users, 
  FileCheck, 
  Bell, 
  Save,
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";

const AdminSettings = () => {
  const approvalRules = [
    {
      id: "RULE-001",
      name: "High Value USD Transactions",
      currency: "USD",
      threshold: 50000,
      approvers: 2,
      department: "All",
      status: "active",
      lastModified: "2024-01-15"
    },
    {
      id: "RULE-002", 
      name: "AED Bulk Payments",
      currency: "AED",
      threshold: 100000,
      approvers: 1,
      department: "Finance",
      status: "active",
      lastModified: "2024-01-10"
    },
    {
      id: "RULE-003",
      name: "International Wire Transfers",
      currency: "ANY",
      threshold: 25000,
      approvers: 3,
      department: "Treasury",
      status: "draft",
      lastModified: "2024-01-08"
    }
  ];

  const sourceTypes = [
    {
      id: "SRC-001",
      name: "Invoice Payments",
      description: "Payments for goods and services invoices",
      requiresDocuments: true,
      autoApproval: false,
      status: "active"
    },
    {
      id: "SRC-002",
      name: "Salary Disbursement", 
      description: "Monthly salary payments to employees",
      requiresDocuments: false,
      autoApproval: true,
      status: "active"
    },
    {
      id: "SRC-003",
      name: "Supplier Payments",
      description: "Payments to registered suppliers and vendors",
      requiresDocuments: true,
      autoApproval: false,
      status: "active"
    }
  ];

  const complianceSettings = {
    kybAutoApproval: false,
    documentRetention: 7,
    transactionReporting: true,
    amlScreening: true,
    beneficiaryVerification: true,
    dailyLimits: true
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings & Rules</h1>
            <p className="text-muted-foreground">Configure approval workflows, compliance rules, and system settings</p>
          </div>
          <Button variant="business">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        {/* Approval Rules Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Approval Rules
              </CardTitle>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalRules.map((rule) => (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-foreground">{rule.name}</h4>
                          <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                            {rule.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Currency:</span>
                            <p className="font-medium">{rule.currency}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Threshold:</span>
                            <p className="font-medium">{rule.threshold.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Approvers:</span>
                            <p className="font-medium">{rule.approvers} required</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Department:</span>
                            <p className="font-medium">{rule.department}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source of Transaction Types */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Source of Transaction Types
              </CardTitle>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Source Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceTypes.map((source) => (
                <Card key={source.id} className="border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-foreground">{source.name}</h4>
                          <Badge variant={source.status === "active" ? "default" : "secondary"}>
                            {source.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Requires Documents:</span>
                            <Badge variant={source.requiresDocuments ? "destructive" : "secondary"}>
                              {source.requiresDocuments ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Auto Approval:</span>
                            <Badge variant={source.autoApproval ? "default" : "outline"}>
                              {source.autoApproval ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Compliance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="kyb-auto">KYB Auto-Approval</Label>
                  <p className="text-sm text-muted-foreground">Automatically approve low-risk KYB applications</p>
                </div>
                <Switch id="kyb-auto" checked={complianceSettings.kybAutoApproval} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Document Retention (Years)</Label>
                <Input 
                  id="retention" 
                  type="number" 
                  value={complianceSettings.documentRetention}
                  className="w-24"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reporting">Transaction Reporting</Label>
                  <p className="text-sm text-muted-foreground">Enable regulatory transaction reporting</p>
                </div>
                <Switch id="reporting" checked={complianceSettings.transactionReporting} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aml">AML Screening</Label>
                  <p className="text-sm text-muted-foreground">Automatic anti-money laundering checks</p>
                </div>
                <Switch id="aml" checked={complianceSettings.amlScreening} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="verification">Beneficiary Verification</Label>
                  <p className="text-sm text-muted-foreground">Mandatory beneficiary identity verification</p>
                </div>
                <Switch id="verification" checked={complianceSettings.beneficiaryVerification} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Transaction Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="daily-usd">Daily Limit - USD</Label>
                <Input id="daily-usd" value="500,000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-aed">Daily Limit - AED</Label>
                <Input id="daily-aed" value="1,840,000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="single-transaction">Single Transaction Limit</Label>
                <Input id="single-transaction" value="100,000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-limit">Bulk Transaction Limit</Label>
                <Input id="bulk-limit" value="250,000" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-limits">Enforce Daily Limits</Label>
                  <p className="text-sm text-muted-foreground">Apply daily transaction limits per user</p>
                </div>
                <Switch id="daily-limits" checked={complianceSettings.dailyLimits} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Admin Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-kyb">New KYB Applications</Label>
                    <Switch id="new-kyb" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-value">High Value Transactions</Label>
                    <Switch id="high-value" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="failed-transactions">Failed Transactions</Label>
                    <Switch id="failed-transactions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compliance-alerts">Compliance Alerts</Label>
                    <Switch id="compliance-alerts" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">User Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transaction-status">Transaction Status Updates</Label>
                    <Switch id="transaction-status" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="approval-requests">Approval Requests</Label>
                    <Switch id="approval-requests" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="beneficiary-updates">Beneficiary Updates</Label>
                    <Switch id="beneficiary-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-maintenance">System Maintenance</Label>
                    <Switch id="system-maintenance" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;