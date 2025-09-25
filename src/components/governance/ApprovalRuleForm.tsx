import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Shield, 
  Users, 
  DollarSign,
  Trash2,
  ArrowRight,
  Info
} from "lucide-react";

interface ApprovalRuleFormProps {
  trigger?: React.ReactNode;
  editRule?: any;
}

const ApprovalRuleForm = ({ trigger, editRule }: ApprovalRuleFormProps) => {
  const [formData, setFormData] = useState({
    name: editRule?.name || "",
    description: editRule?.description || "",
    currency: editRule?.currency || "USD",
    minAmount: editRule?.minAmount || "",
    maxAmount: editRule?.maxAmount || "",
    department: editRule?.department || "All",
    transactionTypes: editRule?.transactionTypes || [],
    tiers: editRule?.tiers || [
      { level: 1, threshold: "", approvers: 1, roles: [] }
    ]
  });

  const currencies = ["USD", "AED", "EUR", "GBP", "INR", "PKR", "PHP", "ANY"];
  const departments = ["All", "Finance", "Treasury", "Operations", "HR", "Procurement"];
  const transactionTypes = ["Single Transfer", "Bulk Transfer", "Salary Payment", "Supplier Payment", "Invoice Payment"];
  const approverRoles = ["Senior Manager", "Finance Manager", "Treasury Officer", "Operations Manager", "CEO", "CFO"];

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { 
        level: prev.tiers.length + 1, 
        threshold: "", 
        approvers: 1, 
        roles: [] 
      }]
    }));
  };

  const removeTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index).map((tier, i) => ({
        ...tier,
        level: i + 1
      }))
    }));
  };

  const updateTier = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const handleTransactionTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      transactionTypes: checked 
        ? [...prev.transactionTypes, type]
        : prev.transactionTypes.filter(t => t !== type)
    }));
  };

  const handleRoleChange = (tierIndex: number, role: string, checked: boolean) => {
    updateTier(tierIndex, 'roles', 
      checked 
        ? [...formData.tiers[tierIndex].roles, role]
        : formData.tiers[tierIndex].roles.filter(r => r !== role)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Approval Rule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editRule ? "Edit Approval Rule" : "Create Multi-Tier Approval Rule"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rule Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruleName">Rule Name *</Label>
                  <Input
                    id="ruleName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., High Value USD Transactions"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe when this approval rule applies..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minAmount">Minimum Amount</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">Maximum Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: e.target.value }))}
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Applicable Transaction Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {transactionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={formData.transactionTypes.includes(type)}
                      onCheckedChange={(checked) => handleTransactionTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approval Tiers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Approval Tiers
                </CardTitle>
                <Button variant="outline" size="sm" onClick={addTier}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-accent-muted/20 rounded-lg">
                  <Info className="h-4 w-4 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Define approval tiers based on transaction amounts. Higher tiers require more approvers.
                  </p>
                </div>
                
                {formData.tiers.map((tier, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Tier {tier.level}</Badge>
                          {index > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        {formData.tiers.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTier(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`threshold-${index}`}>Amount Threshold</Label>
                          <Input
                            id={`threshold-${index}`}
                            type="number"
                            value={tier.threshold}
                            onChange={(e) => updateTier(index, 'threshold', e.target.value)}
                            placeholder="Enter threshold amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`approvers-${index}`}>Number of Approvers Required</Label>
                          <Select 
                            value={tier.approvers.toString()} 
                            onValueChange={(value) => updateTier(index, 'approvers', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select approvers" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border z-50">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>{num} Approver{num > 1 ? 's' : ''}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Eligible Approver Roles</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {approverRoles.map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox
                                id={`tier-${index}-role-${role}`}
                                checked={tier.roles.includes(role)}
                                onCheckedChange={(checked) => handleRoleChange(index, role, checked as boolean)}
                              />
                              <Label htmlFor={`tier-${index}-role-${role}`} className="text-xs">{role}</Label>
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

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline">Cancel</Button>
            <Button variant="business">
              {editRule ? "Update Rule" : "Create Approval Rule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalRuleForm;