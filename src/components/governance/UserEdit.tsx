import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Key,
  Info,
  Loader2,
} from "lucide-react";

interface UserEditFormProps {
  userId: string;
  trigger?: React.ReactNode;
  onUserUpdated?: () => void;
}

const roles = [
  { value: "senior_manager", label: "Senior Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "treasury_officer", label: "Treasury Officer" },
  { value: "operations_manager", label: "Operation Manager" },
  { value: "ceo", label: "CEO" },
  { value: "cfo", label: "CFO" },
  { value: "transaction_manager", label: "Transaction Manager" },
  { value: "senior_approver", label: "Senior Approver" },
  { value: "finance_clerk", label: "Finance Clerk" },
  { value: "compliance_officer", label: "Compliance Officer" },
];

const departments = ["Finance", "Treasury", "Operations", "HR", "Procurement", "Compliance", "IT"];
const currencies = ["USD", "AED", "EUR", "GBP"];
const tiers = ["TIER_1", "TIER_2", "TIER_3"];

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
  { id: "treasury_operations", label: "Treasury Operations", category: "Treasury" },
];

const UserEditForm = ({ userId, trigger, onUserUpdated }: UserEditFormProps) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
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
    permissions: [] as string[],
    requireTwoFactor: false,
    emailNotifications: true,
    mobileAccess: false,
    temporaryAccess: false,
    accessExpiryDate: "",
  });

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset step and errors when opening
      setCurrentStep(1);
      setErrors({});
      setFetchError(null);
    }
  };

  // Fetch user data when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/business-users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const response = await res.json();
      const userData = response.data;

      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        employeeId: userData.employeeId || "",
        role: userData.role?.toLowerCase() || "",
        department: userData.department || "",
        reportingManager: userData.reportingManager || "",
        tier: userData.tier || "",
        transactionLimit: userData.singleTransactionLimit?.toString() || "",
        currency: userData.currency || "USD",
        dailyLimit: userData.dailyLimit?.toString() || "",
        monthlyLimit: userData.monthlyLimit?.toString() || "",
        permissions: (userData.permissions || []).map((p: string) => p.toLowerCase()),
        requireTwoFactor: false,
        emailNotifications: true,
        mobileAccess: false,
        temporaryAccess: false,
        accessExpiryDate: "",
      });

      setErrors({});
    } catch (error: any) {
      setFetchError(error.message || "Could not load user data");
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = ["First name is required"];
      if (!formData.lastName.trim()) newErrors.lastName = ["Last name is required"];
      if (!formData.email.trim()) {
        newErrors.email = ["Email is required"];
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = ["Invalid email format"];
      }
      if (!formData.phone.trim()) newErrors.phoneNumber = ["Phone number is required"];
      if (!formData.employeeId.trim()) newErrors.employeeId = ["Employee ID is required"];
    } else if (step === 2) {
      if (!formData.role) newErrors.role = ["Role is required"];
      if (!formData.department) newErrors.department = ["Department is required"];
      if (!formData.tier) newErrors.tier = ["Tier is required"];
      if (!formData.transactionLimit) {
        newErrors.singleTransactionLimit = ["Single transaction limit is required"];
      } else if (Number(formData.transactionLimit) <= 0) {
        newErrors.singleTransactionLimit = ["Limit must be greater than 0"];
      }
      if (!formData.currency) newErrors.currency = ["Currency is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleRoleChange = (roleValue: string) => {
    setFormData((prev) => ({ ...prev, role: roleValue }));
    clearFieldError("role");
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p) => p !== permissionId),
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      const stepOneKeys = ["firstName", "lastName", "email", "phoneNumber", "employeeId"];
      setCurrentStep(Object.keys(errors).some((k) => stepOneKeys.includes(k)) ? 1 : 2);
      return;
    }

    setSubmitting(true);

    const body = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone,
      employeeId: formData.employeeId,
      department: formData.department,
      reportingManager: formData.reportingManager,
      role: formData.role.toUpperCase(),
      tier: formData.tier,
      singleTransactionLimit: Number(formData.transactionLimit),
      dailyLimit: formData.dailyLimit ? Number(formData.dailyLimit) : undefined,
      monthlyLimit: formData.monthlyLimit ? Number(formData.monthlyLimit) : undefined,
      currency: formData.currency,
      permissions: formData.permissions.map((p) => p.toUpperCase()),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/v1/business-users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        toast({ title: "Success", description: data.message || "User updated successfully" });
        onUserUpdated?.(); // <-- triggers list refresh in parent
        setIsOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast({ title: "Error", description: errorData.message || "Error updating user", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Request failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />
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
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => { setFormData((prev) => ({ ...prev, firstName: e.target.value })); clearFieldError("firstName"); }}
                placeholder="Enter first name"
              />
              {errors.firstName?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => { setFormData((prev) => ({ ...prev, lastName: e.target.value })); clearFieldError("lastName"); }}
                placeholder="Enter last name"
              />
              {errors.lastName?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-9 bg-muted"
                  placeholder="user@company.ae"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={(value) => { setFormData((prev) => ({ ...prev, phone: value })); clearFieldError("phoneNumber"); }}
                inputProps={{ name: "phone", id: "phone", required: true }}
                containerClass="phone-input-container"
                buttonClass="phone-flag-button"
                enableSearch={true}
                searchPlaceholder="Search country"
                preferredCountries={["ae", "in"]}
              />
              {errors.phoneNumber?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="employeeId">Employee ID <span className="text-red-500">*</span></Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => { setFormData((prev) => ({ ...prev, employeeId: e.target.value })); clearFieldError("employeeId"); }}
                placeholder="Enter employee ID"
              />
              {errors.employeeId?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
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
              <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select value={formData.department} onValueChange={(value) => { setFormData((prev) => ({ ...prev, department: value })); clearFieldError("department"); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="reportingManager">Reporting Manager</Label>
              <Input
                id="reportingManager"
                value={formData.reportingManager}
                onChange={(e) => setFormData((prev) => ({ ...prev, reportingManager: e.target.value }))}
                placeholder="Enter reporting manager name"
              />
            </div>
            <div>
              <Label htmlFor="tier">Select Tiers <span className="text-red-500">*</span></Label>
              <Select value={formData.tier} onValueChange={(value) => { setFormData((prev) => ({ ...prev, tier: value })); clearFieldError("tier"); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tiers" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {tiers.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tier?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
          </div>
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
              <Label htmlFor="transactionLimit">Single Transaction Limit <span className="text-red-500">*</span></Label>
              <Input
                id="transactionLimit"
                type="number"
                value={formData.transactionLimit}
                onChange={(e) => { setFormData((prev) => ({ ...prev, transactionLimit: e.target.value })); clearFieldError("singleTransactionLimit"); }}
                placeholder="Enter limit amount"
              />
              {errors.singleTransactionLimit?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="currency">Currency <span className="text-red-500">*</span></Label>
              <Select value={formData.currency} onValueChange={(value) => { setFormData((prev) => ({ ...prev, currency: value })); clearFieldError("currency"); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency?.map((msg, i) => <p key={i} className="text-sm text-destructive mt-1">{msg}</p>)}
            </div>
            <div>
              <Label htmlFor="dailyLimit">Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData((prev) => ({ ...prev, dailyLimit: e.target.value }))}
                placeholder="Enter daily limit"
              />
            </div>
            <div>
              <Label htmlFor="monthlyLimit">Monthly Limit</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData((prev) => ({ ...prev, monthlyLimit: e.target.value }))}
                placeholder="Enter monthly limit"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => {
    const groupedPermissions = allPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) acc[permission.category] = [];
        acc[permission.category].push(permission);
        return acc;
      },
      {} as Record<string, typeof allPermissions>,
    );

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
                        id={`edit-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <Label htmlFor={`edit-${permission.id}`} className="text-sm">{permission.label}</Label>
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
                <Checkbox id="twoFactor" checked={formData.requireTwoFactor} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requireTwoFactor: checked as boolean }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive transaction and system notifications</p>
                </div>
                <Checkbox id="emailNotifications" checked={formData.emailNotifications} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emailNotifications: checked as boolean }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mobileAccess">Mobile App Access</Label>
                  <p className="text-sm text-muted-foreground">Allow access via mobile application</p>
                </div>
                <Checkbox id="mobileAccess" checked={formData.mobileAccess} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, mobileAccess: checked as boolean }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="temporaryAccess">Temporary Access</Label>
                  <p className="text-sm text-muted-foreground">Set expiry date for user access</p>
                </div>
                <Checkbox id="temporaryAccess" checked={formData.temporaryAccess} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, temporaryAccess: checked as boolean }))} />
              </div>
              {formData.temporaryAccess && (
                <div>
                  <Label htmlFor="accessExpiryDate">Access Expiry Date</Label>
                  <Input
                    id="accessExpiryDate"
                    type="date"
                    value={formData.accessExpiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accessExpiryDate: e.target.value }))}
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Edit User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business User</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="py-12 text-center text-destructive">{fetchError}</div>
        ) : (
          <div className="mt-6">
            {renderStepIndicator()}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1 || submitting}
              >
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext} disabled={submitting} variant="business">Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} variant="business">
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
                  ) : (
                    "Update User"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserEditForm;