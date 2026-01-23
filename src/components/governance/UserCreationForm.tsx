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
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";

import {
  Plus,
  User,
  Shield,
  DollarSign,
  Mail,
  Phone,
  Building,
  Key,
  Info
} from "lucide-react";

interface UserCreationFormProps {
  trigger?: React.ReactNode;
}

const UserCreationForm = ({ trigger }: UserCreationFormProps) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeId: "",

    // Role & Department
    role: "",
    department: "",
    reportingManager: "",
    tier: "",

    // Access & Limits
    transactionLimit: "",
    currency: "USD",
    dailyLimit: "",
    monthlyLimit: "",

    // Permissions
    permissions: [] as string[],

    // Additional Settings
    requireTwoFactor: false,
    emailNotifications: true,
    mobileAccess: false,
    temporaryAccess: false,
    accessExpiryDate: ""
  });

  const roles = [
    {
      value: "transaction_manager",
      label: "Transaction Manager",
      description: "Can create and manage transactions, beneficiaries",
      permissions: ["create_transactions", "manage_beneficiaries", "view_reports"]
    },
    {
      value: "senior_approver",
      label: "Senior Approver",
      description: "Can approve high-value transactions and manage limits",
      permissions: ["approve_transactions", "manage_limits", "create_transactions", "view_reports", "manage_users"]
    },
    {
      value: "finance_clerk",
      label: "Finance Clerk",
      description: "Basic transaction creation and beneficiary management",
      permissions: ["create_transactions", "view_reports"]
    },
    {
      value: "operations_manager",
      label: "Operations Manager",
      description: "Operational oversight and approval capabilities",
      permissions: ["create_transactions", "manage_beneficiaries", "approve_transactions", "view_reports"]
    },
    {
      value: "compliance_officer",
      label: "Compliance Officer",
      description: "Compliance monitoring and reporting access",
      permissions: ["view_reports", "manage_compliance", "audit_transactions"]
    },
    {
      value: "treasury_officer",
      label: "Treasury Officer",
      description: "Treasury management and high-value approvals",
      permissions: ["approve_transactions", "manage_limits", "treasury_operations", "view_reports"]
    }
  ];

  const departments = ["Finance", "Treasury", "Operations", "HR", "Procurement", "Compliance", "IT"];
  const currencies = ["USD", "AED", "EUR", "GBP"];

  const tiers = ["TIER_1", "TIER_2","TIER_3"]

  const allPermissions = [
    { id: "create_transactions", label: "Create Transactions", category: "Transactions" },
    { id: "approve_transactions", label: "Approve Transactions", category: "Transactions" },
    { id: "manage_beneficiaries", label: "Manage Beneficiaries", category: "Beneficiaries" },
    { id: "approve_beneficiaries", label: "Approve Beneficiaries", category: "Beneficiaries" },
    { id: "view_reports", label: "View Reports", category: "Reports" },
    { id: "export_reports", label: "Export Reports", category: "Reports" },
    { id: "manage_users", label: "Manage Users", category: "Administration" },
    { id: "manage_limits", label: "Manage Limits", category: "Administration" },
    { id: "manage_compliance", label: "Manage Compliance", category: "Compliance" },
    { id: "audit_transactions", label: "Audit Transactions", category: "Compliance" },
    { id: "treasury_operations", label: "Treasury Operations", category: "Treasury" }
  ];

  const handleRoleChange = (roleValue: string) => {
    const selectedRole = roles.find(role => role.value === roleValue);
    setFormData(prev => ({
      ...prev,
      role: roleValue,
      permissions: selectedRole ? selectedRole.permissions : []
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = async () => {
    const body = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      employeeId: formData.employeeId,
      department: formData.department,
      reportingManager: formData.reportingManager,
      role: formData.role.toUpperCase(),
      tier: formData.tier,
      singleTransactionLimit: Number(formData.transactionLimit),
      dailyLimit: Number(formData.dailyLimit),
      monthlyLimit: Number(formData.monthlyLimit),
      currency: formData.currency,
      permissions: formData.permissions.map(p => p.toUpperCase()),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/v1/business-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Success:', data);
        toast({
          title: "Success",
          description: data.message,
        });
        // Reset form and go back to step 1
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          employeeId: "",
          role: "",
          department: "",
          reportingManager: "",
          tier: "",
          transactionLimit: "",
          currency: "USD",
          dailyLimit: "",
          monthlyLimit: "",
          permissions: [],
          requireTwoFactor: false,
          emailNotifications: true,
          mobileAccess: false,
          temporaryAccess: false,
          accessExpiryDate: ""
        });
        setCurrentStep(1);
        setIsOpen(false); // Close the modal
      } else {
        console.error('Error creating user:', res.statusText);
        toast({
          title: "Error",
          description: 'Error creating user',
          variant: "destructive"
        });
      }
    } catch (e) {
      console.error('Request failed:', e);
      toast({
        title: "Error",
        description: 'Request failed',
        variant: "destructive"
      });
    }
  };

  const getSelectedRole = () => roles.find(role => role.value === formData.role);

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {step}
          </div>
          {step < 3 && (
            <div className={`
              w-16 h-0.5 mx-2
              ${currentStep > step ? 'bg-primary' : 'bg-muted'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@company.ae"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+971 X XXX XXXX"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                placeholder="Enter employee ID"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role & Department Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
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
            <div >
              <Label htmlFor="reportingManager">Reporting Manager</Label>
              <Input
                id="reportingManager"
                value={formData.reportingManager}
                onChange={(e) => setFormData(prev => ({ ...prev, reportingManager: e.target.value }))}
                placeholder="Enter reporting manager name"
              />
            </div>
            <div >
              <Label htmlFor="tier">Select Tiers</Label>
              <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tiers" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {tiers.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {getSelectedRole() && (
            <Card className="border-accent/20 bg-accent-muted/10">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">{getSelectedRole()?.label}</h4>
                <p className="text-sm text-muted-foreground mb-3">{getSelectedRole()?.description}</p>
                <div className="flex flex-wrap gap-1">
                  {getSelectedRole()?.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Transaction Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transactionLimit">Single Transaction Limit *</Label>
              <Input
                id="transactionLimit"
                type="number"
                value={formData.transactionLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, transactionLimit: e.target.value }))}
                placeholder="Enter limit amount"
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
            <div>
              <Label htmlFor="dailyLimit">Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyLimit: e.target.value }))}
                placeholder="Enter daily limit"
              />
            </div>
            <div>
              <Label htmlFor="monthlyLimit">Monthly Limit</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                placeholder="Enter monthly limit"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => {
    const groupedPermissions = allPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, typeof allPermissions>);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permissions & Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-accent-muted/20 rounded-lg">
              <Info className="h-4 w-4 text-accent" />
              <p className="text-sm text-muted-foreground">
                Permissions are pre-configured based on the selected role. You can customize them as needed.
              </p>
            </div>

            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category}>
                <h4 className="font-medium text-foreground mb-3">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <Label htmlFor={permission.id} className="text-sm">{permission.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enhanced security for sensitive operations</p>
                </div>
                <Checkbox
                  id="twoFactor"
                  checked={formData.requireTwoFactor}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requireTwoFactor: checked as boolean }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive transaction and system notifications</p>
                </div>
                <Checkbox
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked as boolean }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mobileAccess">Mobile App Access</Label>
                  <p className="text-sm text-muted-foreground">Allow access via mobile application</p>
                </div>
                <Checkbox
                  id="mobileAccess"
                  checked={formData.mobileAccess}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mobileAccess: checked as boolean }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="temporaryAccess">Temporary Access</Label>
                  <p className="text-sm text-muted-foreground">Set expiry date for user access</p>
                </div>
                <Checkbox
                  id="temporaryAccess"
                  checked={formData.temporaryAccess}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, temporaryAccess: checked as boolean }))}
                />
              </div>

              {formData.temporaryAccess && (
                <div>
                  <Label htmlFor="accessExpiryDate">Access Expiry Date</Label>
                  <Input
                    id="accessExpiryDate"
                    type="date"
                    value={formData.accessExpiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessExpiryDate: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="business">
            <Plus className="h-4 w-4 mr-2" />
            Add Business User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Business User with Governance Controls</DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                variant="business"
              >
                Next
              </Button>
            ) : (
              <Button variant="business" onClick={handleSubmit}>
                Create User Account
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreationForm;