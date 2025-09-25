import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Eye,
  Clock,
  DollarSign,
  Globe,
  Users,
  Save,
  Download,
  Settings
} from "lucide-react";

const ExchangeComplianceConfig = () => {
  const complianceMetrics = [
    {
      title: "AML Compliance Score",
      value: "98.5%",
      status: "excellent",
      threshold: ">95%",
      icon: Shield
    },
    {
      title: "Transaction Monitoring",
      value: "Active",
      status: "active",
      threshold: "24/7",
      icon: Eye
    },
    {
      title: "Regulatory Reports",
      value: "Up to date",
      status: "current",
      threshold: "Monthly",
      icon: FileText
    },
    {
      title: "Risk Assessment",
      value: "Low Risk",
      status: "low",
      threshold: "<5%",
      icon: AlertTriangle
    }
  ];

  const thresholdRules = [
    {
      id: 1,
      name: "Large Transaction Reporting",
      threshold: 15000,
      currency: "USD",
      action: "auto_report_cbuae",
      frequency: "immediate",
      status: "active",
      category: "regulatory"
    },
    {
      id: 2,
      name: "Suspicious Activity Detection",
      threshold: 10000,
      currency: "USD",
      action: "flag_review",
      frequency: "realtime",
      status: "active", 
      category: "aml"
    },
    {
      id: 3,
      name: "High Risk Country Monitoring",
      threshold: 5000,
      currency: "USD",
      action: "enhanced_screening",
      frequency: "immediate",
      status: "active",
      category: "sanctions"
    },
    {
      id: 4,
      name: "Cumulative Transaction Limit",
      threshold: 50000,
      currency: "USD",
      action: "manual_review",
      frequency: "daily",
      status: "active",
      category: "risk_management"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: "text-success",
      active: "text-primary",
      current: "text-success",
      low: "text-success",
      medium: "text-warning",
      high: "text-destructive"
    };
    return colors[status as keyof typeof colors] || "text-muted-foreground";
  };

  const getCategoryBadge = (category: string) => {
    const categories = {
      regulatory: { variant: "default" as const, label: "Regulatory" },
      aml: { variant: "destructive" as const, label: "AML" },
      sanctions: { variant: "secondary" as const, label: "Sanctions" },
      risk_management: { variant: "outline" as const, label: "Risk Management" }
    };
    return categories[category as keyof typeof categories] || categories.regulatory;
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compliance Configuration</h1>
            <p className="text-muted-foreground">Configure compliance thresholds, monitoring rules, and regulatory requirements</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Config
            </Button>
            <Button variant="business">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </div>
                  <p className="text-xs text-muted-foreground">Threshold: {metric.threshold}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regulatory Thresholds */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Transaction Monitoring Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {thresholdRules.map((rule) => {
              const categoryBadge = getCategoryBadge(rule.category);
              
              return (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Threshold: {rule.threshold.toLocaleString()} {rule.currency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={categoryBadge.variant}>
                          {categoryBadge.label}
                        </Badge>
                        <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                          {rule.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">Action:</div>
                        <p className="font-medium capitalize">{rule.action.replace('_', ' ')}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">Frequency:</div>
                        <p className="font-medium capitalize">{rule.frequency}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">Currency:</div>
                        <p className="font-medium">{rule.currency}</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Switch defaultChecked={rule.status === "active"} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* AML Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AML & Sanctions Screening
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Screening Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Real-time Sanctions Check</span>
                      <p className="text-xs text-muted-foreground">Screen against global sanctions lists</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">PEP Database Screening</span>
                      <p className="text-xs text-muted-foreground">Check politically exposed persons</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Adverse Media Monitoring</span>
                      <p className="text-xs text-muted-foreground">Monitor negative news and events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Enhanced Due Diligence</span>
                      <p className="text-xs text-muted-foreground">Additional checks for high-risk entities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Monitoring Intervals</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="sanctions-frequency">Sanctions List Update</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pep-frequency">PEP Database Refresh</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-frequency">Adverse Media Check</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Country Risk Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Country Risk Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">High Risk Countries</h4>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Enter country codes (e.g., AF, IR, KP)"
                    rows={4}
                    defaultValue="AF, IR, KP, MM, SY"
                  />
                  <p className="text-xs text-muted-foreground">Additional screening required</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Prohibited Countries</h4>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Enter country codes for blocked countries"
                    rows={4}
                    defaultValue="CU, IR, KP"
                  />
                  <p className="text-xs text-muted-foreground">Complete transaction blocking</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Enhanced Monitoring</h4>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Countries requiring enhanced monitoring"
                    rows={4}
                    defaultValue="BD, LK, PH, PK"
                  />
                  <p className="text-xs text-muted-foreground">Lower thresholds applied</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Regulatory Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">CBUAE Reporting</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="large-transaction">Large Transaction Threshold (AED)</Label>
                    <Input id="large-transaction" type="number" defaultValue="55000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suspicious-activity">Suspicious Activity Reports</Label>
                    <Switch id="suspicious-activity" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-returns">Monthly Statistical Returns</Label>
                    <Switch id="monthly-returns" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Internal Reporting</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="compliance-officer">Compliance Officer Alerts</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit-trail">Audit Trail Retention (years)</Label>
                    <Input id="audit-trail" type="number" defaultValue="7" min="5" max="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="management-reports">Management Reports</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Test Configuration</Button>
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

export default ExchangeComplianceConfig;