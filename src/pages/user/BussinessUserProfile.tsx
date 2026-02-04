import { useEffect, useState } from "react";
import BusinessUserLayout from '@/components/layout/BusinnessUserLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import BASE_URL from "@/config/config";
import {
  Building2,
  Mail,
  Phone,
  Users,
  ShieldCheck,
  DollarSign,
  Lock,
  Calendar,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useCookies } from "react-cookie";

interface BasicInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeId: string;
  status: string;
  lastLoginAt: string;
}

interface Organization {
  businessName: string;
  department: string;
  reportingManager: string;
}

interface Role {
  roleName: string;
  tier: string;
  permissions: string[];
}

interface Limits {
  singleTransactionLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
}

interface Security {
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  passwordSet: boolean;
  accountLocked: boolean;
  last2faVerifiedAt: string;
}

interface UserProfile {
  basicInfo: BasicInfo;
  organization: Organization;
  role: Role;
  limits: Limits;
  security: Security;
}

const BussinessUserProfile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [cookie] = useCookies(["token"]);
  const token = cookie.token;

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/v1/business-users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data?.data;
        if (!data) {
          toast({
            title: "Error",
            description: "No data received from server",
            variant: "destructive",
          });
          return;
        }

        setUserProfile(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <UserCheck className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <BusinessUserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading user profile...</p>
        </div>
      </BusinessUserLayout>
    );
  }

  if (!userProfile) {
    return (
      <BusinessUserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">No profile data available.</p>
        </div>
      </BusinessUserLayout>
    );
  }

  return (
    <BusinessUserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Business User Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="text-foreground font-medium">
                    {userProfile.basicInfo.fullName}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    Email
                  </Label>
                  <p className="text-foreground font-medium">
                    {userProfile.basicInfo.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <p className="text-foreground font-medium">
                    {userProfile.basicInfo.phoneNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Employee ID</Label>
                  <p className="text-foreground font-medium">
                    {userProfile.basicInfo.employeeId}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  {getStatusBadge(userProfile.basicInfo.status)}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Last Login
                  </Label>
                  <p className="text-foreground font-medium">
                    {new Date(
                      userProfile.basicInfo.lastLoginAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Business Name
                  </Label>
                  <p className="font-medium">
                    {userProfile.organization.businessName}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">
                    {userProfile.organization.department}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Reporting Manager
                  </Label>
                  <p className="font-medium">
                    {userProfile.organization.reportingManager}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5" />
                  Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Role Name</Label>
                  <p className="font-medium">
                    {userProfile.role.roleName}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tier</Label>
                  <p className="font-medium">{userProfile.role.tier}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.role.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Limits and Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Transaction Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Single Transaction Limit
                </span>
                <span className="font-medium">
                  {userProfile.limits.singleTransactionLimit.toLocaleString()}{" "}
                  {userProfile.limits.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Daily Limit</span>
                <span className="font-medium">
                  {userProfile.limits.dailyLimit.toLocaleString()}{" "}
                  {userProfile.limits.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly Limit</span>
                <span className="font-medium">
                  {userProfile.limits.monthlyLimit.toLocaleString()}{" "}
                  {userProfile.limits.currency}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">2FA Enabled</span>
                <Badge
                  variant={
                    userProfile.security.twoFactorEnabled
                      ? "default"
                      : "destructive"
                  }
                >
                  {userProfile.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">2FA Method</span>
                <span className="font-medium">
                  {userProfile.security.twoFactorMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Password Set</span>
                <Badge
                  variant={
                    userProfile.security.passwordSet ? "default" : "destructive"
                  }
                >
                  {userProfile.security.passwordSet ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Locked</span>
                <Badge
                  variant={
                    userProfile.security.accountLocked
                      ? "destructive"
                      : "default"
                  }
                >
                  {userProfile.security.accountLocked ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Last 2FA Verified
                </span>
                <span className="font-medium">
                  {new Date(
                    userProfile.security.last2faVerifiedAt
                  ).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BusinessUserLayout>
  );
};

export default BussinessUserProfile;