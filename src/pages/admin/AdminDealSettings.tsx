import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  TrendingUp, 
  Save,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Building2,
  Info
} from "lucide-react";

const AdminDealSettings = () => {
  const { toast } = useToast();
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    dealNegotiationEnabled: true,
    defaultValidityDays: 7,
    maxRateDifferencePercent: 5,
    requireApprovalAbovePercent: 2,
    autoExpireDeals: true
  });

  const [businessSettings, setBusinessSettings] = useState([
    {
      id: "BIZ-001",
      businessName: "Tech Solutions LLC",
      validityDays: 7,
      maxRateDifference: 5,
      autoApprove: false,
      kybStatus: "approved"
    },
    {
      id: "BIZ-002",
      businessName: "Smart Trading Corp",
      validityDays: 10,
      maxRateDifference: 3,
      autoApprove: false,
      kybStatus: "approved"
    },
    {
      id: "BIZ-003",
      businessName: "Global Enterprises",
      validityDays: 14,
      maxRateDifference: 7,
      autoApprove: false,
      kybStatus: "approved"
    }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Deal negotiation settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deal Negotiation Settings</h1>
            <p className="text-muted-foreground">Configure deal validity periods and approval rules</p>
          </div>
          <Button variant="business" onClick={() => setShowSaveConfirmation(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        {/* Global Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Global Deal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dealEnabled">Enable Deal Negotiation</Label>
                <p className="text-sm text-muted-foreground">Allow businesses to request custom exchange rates</p>
              </div>
              <Switch 
                id="dealEnabled" 
                checked={globalSettings.dealNegotiationEnabled}
                onCheckedChange={(checked) => setGlobalSettings({...globalSettings, dealNegotiationEnabled: checked})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultValidity">Default Deal Validity (Days)</Label>
                <Input
                  id="defaultValidity"
                  type="number"
                  value={globalSettings.defaultValidityDays}
                  onChange={(e) => setGlobalSettings({...globalSettings, defaultValidityDays: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  How long approved deals remain valid for transactions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDifference">Maximum Rate Difference (%)</Label>
                <Input
                  id="maxDifference"
                  type="number"
                  value={globalSettings.maxRateDifferencePercent}
                  onChange={(e) => setGlobalSettings({...globalSettings, maxRateDifferencePercent: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum allowed deviation from market rate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalThreshold">Require Approval Above (%)</Label>
                <Input
                  id="approvalThreshold"
                  type="number"
                  value={globalSettings.requireApprovalAbovePercent}
                  onChange={(e) => setGlobalSettings({...globalSettings, requireApprovalAbovePercent: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Deals above this % difference require Exchange approval
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoExpire">Auto-Expire Deals</Label>
                <p className="text-sm text-muted-foreground">Automatically expire deals after validity period</p>
              </div>
              <Switch 
                id="autoExpire" 
                checked={globalSettings.autoExpireDeals}
                onCheckedChange={(checked) => setGlobalSettings({...globalSettings, autoExpireDeals: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Per-Business Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business-Specific Settings ({businessSettings.length})
              </CardTitle>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Business Override
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessSettings.map((business) => (
                <Card key={business.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{business.businessName}</h4>
                          <Badge variant="outline">{business.id}</Badge>
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                            KYB: {business.kybStatus}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Deal Validity:</span>
                            <p className="font-medium">{business.validityDays} days</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Rate Difference:</span>
                            <p className="font-medium">{business.maxRateDifference}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Auto-Approve:</span>
                            <p className="font-medium">{business.autoApprove ? "Enabled" : "Disabled"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
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

        {/* Info Card */}
        <Card className="bg-accent-muted/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Deal Validity Configuration</p>
                <p className="text-muted-foreground">
                  Business-specific settings override global defaults. Approved deals remain locked at the agreed rate for the configured validity period. After expiration, businesses must request a new deal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
        onConfirm={handleSaveSettings}
        title="Confirm Settings Update"
        description="Save all changes to deal negotiation settings? This will affect how deals are processed and validated across the platform."
        confirmText="Save Settings"
      />
    </AdminLayout>
  );
};

export default AdminDealSettings;
