import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ApprovalRuleForm from "@/components/governance/ApprovalRuleForm";
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
  AlertCircle,
  UserCheck,
  ArrowRight,
  Info
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
      lastModified: "2024-01-15",
      tiers: [
        { level: 1, minAmount: 10000, maxAmount: 50000, approvers: 1, roles: ["Finance Manager"] },
        { level: 2, minAmount: 50001, maxAmount: 100000, approvers: 2, roles: ["Finance Manager", "Treasury Officer"] },
        { level: 3, minAmount: 100001, maxAmount: null, approvers: 3, roles: ["Finance Manager", "Treasury Officer", "CEO"] }
      ]
    },
    {
      id: "RULE-002", 
      name: "AED Bulk Payments",
      currency: "AED",
      threshold: 100000,
      approvers: 1,
      department: "Finance",
      status: "active",
      lastModified: "2024-01-10",
      tiers: [
        { level: 1, minAmount: 50000, maxAmount: 100000, approvers: 1, roles: ["Operations Manager"] },
        { level: 2, minAmount: 100001, maxAmount: null, approvers: 2, roles: ["Operations Manager", "CFO"] }
      ]
    },
    {
      id: "RULE-003",
      name: "International Wire Transfers",
      currency: "ANY",
      threshold: 25000,
      approvers: 3,
      department: "Treasury",
      status: "draft",
      lastModified: "2024-01-08",
      tiers: [
        { level: 1, minAmount: 25000, maxAmount: 75000, approvers: 2, roles: ["Treasury Officer", "Finance Manager"] },
        { level: 2, minAmount: 75001, maxAmount: 150000, approvers: 3, roles: ["Treasury Officer", "Finance Manager", "CFO"] },
        { level: 3, minAmount: 150001, maxAmount: null, approvers: 4, roles: ["Treasury Officer", "Finance Manager", "CFO", "CEO"] }
      ]
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
    beneficiaryApprovalRequired: true,
    beneficiaryApprovalThreshold: 0,
    dailyLimits: true,
    roleBasedAccess: true,
    multiTierApproval: true
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

        {/* Multi-Tier Approval Rules Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Multi-Tier Approval Rules
              </CardTitle>
              <ApprovalRuleForm />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2 p-4 bg-accent-muted/20 rounded-lg">
                <Info className="h-5 w-5 text-accent" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Governance Framework</p>
                  <p className="text-muted-foreground">Configure multi-tier approval workflows based on transaction amounts, roles, and departments.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {approvalRules.map((rule) => (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
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
                            <span className="text-muted-foreground">Min Threshold:</span>
                            <p className="font-medium">{rule.threshold.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Approvers:</span>
                            <p className="font-medium">{Math.max(...rule.tiers.map(t => t.approvers))} required</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Department:</span>
                            <p className="font-medium">{rule.department}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <ApprovalRuleForm 
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          }
                          editRule={rule}
                        />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Approval Tiers Visualization */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-foreground mb-2">Approval Tiers</h5>
                      <div className="flex items-center space-x-2 overflow-x-auto">
                        {rule.tiers.map((tier, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="bg-background border rounded-lg p-2 min-w-[120px]">
                              <div className="text-xs font-medium text-primary">Tier {tier.level}</div>
                                <div className="text-xs text-muted-foreground">
                                  {rule.currency} {tier.minAmount?.toLocaleString()}{tier.maxAmount ? ` - ${tier.maxAmount.toLocaleString()}` : '+'}
                                </div>
                              <div className="text-xs font-medium">{tier.approvers} approver{tier.approvers > 1 ? 's' : ''}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {tier.roles.join(', ')}
                              </div>
                            </div>
                            {index < rule.tiers.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        ))}
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

        {/* Governance & Compliance Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Governance Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="role-based">Role-Based Access Control</Label>
                  <p className="text-sm text-muted-foreground">Enforce role-based permissions and access levels</p>
                </div>
                <Switch id="role-based" checked={complianceSettings.roleBasedAccess} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="multi-tier">Multi-Tier Approval</Label>
                  <p className="text-sm text-muted-foreground">Enable escalating approval workflows</p>
                </div>
                <Switch id="multi-tier" checked={complianceSettings.multiTierApproval} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="beneficiary-approval">Beneficiary Approval Required</Label>
                  <p className="text-sm text-muted-foreground">Require approval for new beneficiary registrations</p>
                </div>
                <Switch id="beneficiary-approval" checked={complianceSettings.beneficiaryApprovalRequired} />
              </div>

              {complianceSettings.beneficiaryApprovalRequired && (
                <div className="space-y-2 ml-4 p-3 bg-muted/30 rounded-lg">
                  <Label htmlFor="beneficiary-threshold">Beneficiary Approval Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="beneficiary-threshold" 
                      type="number" 
                      value={complianceSettings.beneficiaryApprovalThreshold}
                      className="w-32"
                      placeholder="0"
                    />
                    <span className="text-sm text-muted-foreground">USD (0 = All beneficiaries require approval)</span>
                  </div>
                </div>
              )}

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
            </CardContent>
          </Card>

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

        {/* Transaction Limits */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Transaction Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>

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