import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  Banknote,
  MapPin,
  Plus,
  Edit,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone,
  Building,
} from "lucide-react";

const ExchangePayoutConfig = () => {
  const payoutDestinations = [
    {
      country: "India",
      currency: "INR",
      status: "active",
      mechanisms: ["Bank Transfer", "UPI", "Mobile Wallet", "Cash Pickup"],
      volume: "2.4M USD",
      partners: 12,
      fees: "0.5-2.5%",
      processingTime: "5-30 minutes",
    },
    {
      country: "Philippines",
      currency: "PHP",
      status: "active",
      mechanisms: ["Bank Transfer", "GCash", "Remitly", "Cash Pickup"],
      volume: "1.8M USD",
      partners: 8,
      fees: "0.8-3.0%",
      processingTime: "15-60 minutes",
    },
    {
      country: "Pakistan",
      currency: "PKR",
      status: "active",
      mechanisms: ["Bank Transfer", "JazzCash", "EasyPaisa", "Cash Pickup"],
      volume: "1.2M USD",
      partners: 6,
      fees: "1.0-3.5%",
      processingTime: "10-45 minutes",
    },
    {
      country: "Bangladesh",
      currency: "BDT",
      status: "maintenance",
      mechanisms: ["Bank Transfer", "bKash", "Nagad"],
      volume: "800K USD",
      partners: 4,
      fees: "1.2-4.0%",
      processingTime: "30-120 minutes",
    },
  ];

  const payoutMechanisms = [
    {
      type: "Bank Transfer",
      description: "Direct bank account transfers",
      countries: 47,
      averageFee: "1.2%",
      status: "active",
      icon: Building,
    },
    {
      type: "Mobile Wallets",
      description: "Digital wallet transfers",
      countries: 23,
      averageFee: "1.8%",
      status: "active",
      icon: Smartphone,
    },
    {
      type: "Cash Pickup",
      description: "Physical cash collection points",
      countries: 35,
      averageFee: "3.2%",
      status: "active",
      icon: MapPin,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      maintenance: {
        variant: "secondary" as const,
        label: "Maintenance",
        icon: Clock,
      },
      inactive: {
        variant: "destructive" as const,
        label: "Inactive",
        icon: AlertCircle,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Payout Configuration
            </h1>
            <p className="text-muted-foreground">
              Manage payout destinations, mechanisms, and partner integrations
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Global Settings
            </Button>
            <Button variant="business">
              <Plus className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Countries
              </CardTitle>
              <Globe className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 this quarter</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Partners
              </CardTitle>
              <Building className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Banks & financial institutions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Volume
              </CardTitle>
              <Banknote className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.5M</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground">All destinations</p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Destinations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Payout Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payoutDestinations.map((destination, index) => {
                const status = getStatusBadge(destination.status);
                const StatusIcon = status.icon;

                return (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground">
                                {destination.country}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Currency: {destination.currency}
                              </p>
                            </div>
                            <Badge
                              variant={status.variant}
                              className="flex items-center gap-1"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div>
                              <span className="text-muted-foreground">
                                Monthly Volume:
                              </span>
                              <p className="font-medium">
                                {destination.volume}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Partners:
                              </span>
                              <p className="font-medium">
                                {destination.partners} active
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Fee Range:
                              </span>
                              <p className="font-medium">{destination.fees}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Processing:
                              </span>
                              <p className="font-medium">
                                {destination.processingTime}
                              </p>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-muted-foreground mb-2 block">
                              Available Mechanisms:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {destination.mechanisms.map(
                                (mechanism, mechIndex) => (
                                  <Badge
                                    key={mechIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {mechanism}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payout Mechanisms */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Payout Mechanisms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {payoutMechanisms.map((mechanism, index) => {
                const Icon = mechanism.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {mechanism.type}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {mechanism.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Countries:
                          </span>
                          <span className="font-medium">
                            {mechanism.countries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Avg. Fee:
                          </span>
                          <span className="font-medium">
                            {mechanism.averageFee}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                      >
                        Manage Partners
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Global Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-routing">Auto Route Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically select best route based on cost and speed
                  </p>
                </div>
                <Switch id="auto-routing" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-fee">Default Fee Markup (%)</Label>
                <Input
                  id="default-fee"
                  type="number"
                  value="1.5"
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compliance-check">
                    Enhanced Compliance Screening
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Additional AML checks for high-risk destinations
                  </p>
                </div>
                <Switch id="compliance-check" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Max Retry Attempts</Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  value="3"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Rate Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">
                  Rate Refresh Interval (seconds)
                </Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value="30"
                  className="w-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="margin-threshold">
                  Margin Alert Threshold (%)
                </Label>
                <Input
                  id="margin-threshold"
                  type="number"
                  value="0.1"
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekend-rates">Weekend Rate Adjustment</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply different rates during weekends
                  </p>
                </div>
                <Switch id="weekend-rates" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="high-volume-discount">
                  High Volume Discount (%)
                </Label>
                <Input
                  id="high-volume-discount"
                  type="number"
                  value="0.25"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangePayoutConfig;
