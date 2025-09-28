import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApprovalRuleForm from "@/components/governance/ApprovalRuleForm";
import { 
  Shield, 
  Settings, 
  Users, 
  DollarSign, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Plus
} from "lucide-react";

const UserGovernance = () => {
  // Mock data for existing approval rules
  const approvalRules = [
    {
      id: 1,
      name: "High Value USD Transactions",
      description: "Approval rules for USD transactions above $10,000",
      currency: "USD",
      minAmount: 10000,
      maxAmount: 100000,
      department: "All",
      status: "active",
      transactionTypes: ["Single Transfer", "Bulk Transfer"],
      tiers: [
        { level: 1, threshold: 10000, approvers: 1, roles: ["Finance Manager"] },
        { level: 2, threshold: 50000, approvers: 2, roles: ["CFO", "CEO"] }
      ]
    },
    {
      id: 2,
      name: "AED Salary Payments",
      description: "Approval workflow for salary payments in AED",
      currency: "AED",
      minAmount: 5000,
      maxAmount: 50000,
      department: "HR",
      status: "active",
      transactionTypes: ["Salary Payment"],
      tiers: [
        { level: 1, threshold: 5000, approvers: 1, roles: ["HR Manager"] }
      ]
    },
    {
      id: 3,
      name: "Supplier Payments EUR",
      description: "Multi-tier approval for EUR supplier payments",
      currency: "EUR",
      minAmount: 1000,
      maxAmount: null,
      department: "Procurement",
      status: "draft",
      transactionTypes: ["Supplier Payment", "Invoice Payment"],
      tiers: [
        { level: 1, threshold: 1000, approvers: 1, roles: ["Operations Manager"] },
        { level: 2, threshold: 25000, approvers: 2, roles: ["CFO", "Senior Manager"] }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case "draft":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Governance Rules</h1>
            <p className="text-muted-foreground mt-2">
              Configure multi-tier approval rules for your business transactions
            </p>
          </div>
          <ApprovalRuleForm 
            trigger={
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Create New Rule
              </Button>
            }
          />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRules.length}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRules.filter(r => r.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                Currently enforced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Rules</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRules.filter(r => r.status === 'draft').length}</div>
              <p className="text-xs text-muted-foreground">
                Pending activation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currencies</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(approvalRules.map(r => r.currency)).size}</div>
              <p className="text-xs text-muted-foreground">
                Configured currencies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Approval Rules List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Approval Rules Configuration
            </CardTitle>
            <CardDescription>
              Manage your business approval workflows and governance rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalRules.map((rule) => (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{rule.name}</h3>
                          {getStatusBadge(rule.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApprovalRuleForm 
                          editRule={rule}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          }
                        />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Currency & Amount</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.currency} {rule.minAmount.toLocaleString()} - {rule.maxAmount ? rule.maxAmount.toLocaleString() : 'Unlimited'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">{rule.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Transaction Types</p>
                        <div className="flex flex-wrap gap-1">
                          {rule.transactionTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Approval Tiers ({rule.tiers.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rule.tiers.map((tier) => (
                          <div key={tier.level} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                Tier {tier.level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {tier.approvers} approver{tier.approvers > 1 ? 's' : ''} required
                              </span>
                            </div>
                            <p className="text-sm mb-1">
                              Threshold: {rule.currency} {tier.threshold.toLocaleString()}+
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {tier.roles.map((role) => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
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
      </div>
    </UserLayout>
  );
};

export default UserGovernance;