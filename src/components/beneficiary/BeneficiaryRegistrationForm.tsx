import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Banknote, 
  FileText, 
  Plus, 
  Trash2,
  AlertCircle,
  Upload
} from "lucide-react";
import { useState } from "react";

const BeneficiaryRegistrationForm = () => {
  const [beneficiaryType, setBeneficiaryType] = useState<"individual" | "corporate">("individual");
  const [payoutMethods, setPayoutMethods] = useState([
    { type: "bank_transfer", isDefault: true, details: {} }
  ]);

  const addPayoutMethod = () => {
    setPayoutMethods([...payoutMethods, { type: "bank_transfer", isDefault: false, details: {} }]);
  };

  const removePayoutMethod = (index: number) => {
    if (payoutMethods.length > 1) {
      setPayoutMethods(payoutMethods.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Register New Beneficiary</h2>
        <p className="text-muted-foreground">Complete all required information for beneficiary registration and verification</p>
      </div>

      {/* Beneficiary Type Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Beneficiary Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                beneficiaryType === "individual" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setBeneficiaryType("individual")}
            >
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Individual</h3>
                <p className="text-sm text-muted-foreground">Personal recipient for salary, remittance, or personal payments</p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                beneficiaryType === "corporate" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setBeneficiaryType("corporate")}
            >
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Corporate</h3>
                <p className="text-sm text-muted-foreground">Business entity for supplier payments, invoices, or commercial transactions</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {beneficiaryType === "individual" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input id="nationality" placeholder="Enter nationality" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input id="registrationNumber" placeholder="Enter registration number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Input id="businessType" placeholder="e.g., Trading, Manufacturing, Services" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">Incorporation Date</Label>
                <Input id="incorporationDate" type="date" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9" placeholder="Enter email address" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" className="pl-9" placeholder="+971 XX XXX XXXX" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input id="address1" placeholder="Street address, building name, etc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2</Label>
            <Input id="address2" placeholder="Apartment, suite, unit, etc." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" placeholder="Enter state/province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" placeholder="Enter country" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="Enter postal code" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Methods */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Payout Methods
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addPayoutMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {payoutMethods.map((method, index) => (
            <Card key={index} className="border-l-4 border-l-accent">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Payout Method {index + 1}</h4>
                    {method.isDefault && (
                      <Badge variant="default" className="text-xs">Default</Badge>
                    )}
                  </div>
                  {payoutMethods.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removePayoutMethod(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name *</Label>
                    <Input placeholder="Enter bank name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Code/SWIFT</Label>
                    <Input placeholder="Enter SWIFT/bank code" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number *</Label>
                    <Input placeholder="Enter account number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name *</Label>
                    <Input placeholder="Enter account holder name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency *</Label>
                    <Input placeholder="USD, AED, EUR, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Code</Label>
                    <Input placeholder="Enter branch code (if applicable)" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`default-${index}`}
                    checked={method.isDefault}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPayoutMethods(payoutMethods.map((m, i) => ({
                          ...m,
                          isDefault: i === index
                        })));
                      }
                    }}
                  />
                  <Label htmlFor={`default-${index}`}>Set as default payout method</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Purpose and Relationship */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Business Relationship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship Type *</Label>
            <Input id="relationship" placeholder="e.g., Supplier, Employee, Contractor, Vendor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Expected Transaction Purpose</Label>
            <Textarea 
              id="purpose" 
              placeholder="Describe the typical purpose of payments to this beneficiary"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedAmount">Expected Monthly Volume</Label>
              <Input id="expectedAmount" placeholder="USD amount (optional)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Expected Frequency</Label>
              <Input id="frequency" placeholder="e.g., Monthly, Weekly, Ad-hoc" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Supporting Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Identity Document</p>
                <p className="text-xs text-muted-foreground">
                  {beneficiaryType === "individual" ? "Passport/Emirates ID" : "Trade License"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Banknote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Bank Statement</p>
                <p className="text-xs text-muted-foreground">Recent bank statement or void check</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-accent-muted rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Document Requirements</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Documents must be clear and legible</li>
                  <li>• Maximum file size: 10MB per document</li>
                  <li>• Accepted formats: PDF, JPG, PNG</li>
                  <li>• Documents should be recent (within 3 months)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button variant="outline" size="lg">
          Save as Draft
        </Button>
        <Button variant="business" size="lg">
          Submit for Approval
        </Button>
      </div>
    </div>
  );
};

export default BeneficiaryRegistrationForm;