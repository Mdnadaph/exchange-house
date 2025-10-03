import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Calculator,
  TrendingUp,
  Globe,
  FileText
} from "lucide-react";
import { useState } from "react";

const ExchangeFeeManagement = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [newFeeRule, setNewFeeRule] = useState({
    transactionType: "",
    country: "",
    minAmount: "",
    maxAmount: "",
    feeType: "",
    feeValue: "",
    feeResponsibility: "Business",
    isActive: true
  });

  // Mock data for existing fee rules
  const feeRules = [
    {
      id: 1,
      transactionType: "Single Transaction",
      country: "India",
      minAmount: 0,
      maxAmount: 10000,
      feeType: "Flat",
      feeValue: "AED 25",
      feeResponsibility: "Business",
      status: "Active"
    },
    {
      id: 2,
      transactionType: "Single Transaction", 
      country: "India",
      minAmount: 10001,
      maxAmount: 50000,
      feeType: "BPS",
      feeValue: "50 BPS (0.5%)",
      feeResponsibility: "Beneficiary",
      status: "Active"
    },
    {
      id: 3,
      transactionType: "Bulk Transaction",
      country: "Philippines",
      minAmount: 0,
      maxAmount: 999999,
      feeType: "Flat",
      feeValue: "AED 15 per beneficiary",
      feeResponsibility: "Business",
      status: "Active"
    },
    {
      id: 4,
      transactionType: "Single Transaction",
      country: "Bangladesh",
      minAmount: 0,
      maxAmount: 25000,
      feeType: "BPS",
      feeValue: "75 BPS (0.75%)",
      feeResponsibility: "Beneficiary",
      status: "Active"
    }
  ];

  const countries = ["India", "Philippines", "Bangladesh", "Pakistan", "Nepal", "Sri Lanka"];
  const transactionTypes = ["Single Transaction", "Bulk Transaction"];
  const feeTypes = ["Flat", "BPS"];

  const stats = [
    {
      title: "Total Fee Rules",
      value: feeRules.length.toString(),
      description: "Active configurations",
      icon: Calculator,
      color: "text-blue-600"
    },
    {
      title: "Countries Covered",
      value: new Set(feeRules.map(rule => rule.country)).size.toString(),
      description: "Fee structures defined",
      icon: Globe,
      color: "text-green-600"
    },
    {
      title: "Average Fee (Single)",
      value: "AED 32",
      description: "Across all countries",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Revenue This Month",
      value: "AED 45,280",
      description: "From transaction fees",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRules = feeRules.filter(rule => {
    const matchesCountry = selectedCountry === "all" || rule.country === selectedCountry;
    const matchesType = selectedType === "all" || rule.transactionType === selectedType;
    return matchesCountry && matchesType;
  });

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure transaction fees and charges for different countries and transaction types
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Fee Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transaction-type">Transaction Type *</Label>
                    <Select value={newFeeRule.transactionType} onValueChange={(value) => 
                      setNewFeeRule({...newFeeRule, transactionType: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="country">Payout Country *</Label>
                    <Select value={newFeeRule.country} onValueChange={(value) => 
                      setNewFeeRule({...newFeeRule, country: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-amount">Minimum Amount (AED)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newFeeRule.minAmount}
                      onChange={(e) => setNewFeeRule({...newFeeRule, minAmount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-amount">Maximum Amount (AED)</Label>
                    <Input 
                      type="number" 
                      placeholder="999999"
                      value={newFeeRule.maxAmount}
                      onChange={(e) => setNewFeeRule({...newFeeRule, maxAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fee-type">Fee Structure *</Label>
                    <Select value={newFeeRule.feeType} onValueChange={(value) => 
                      setNewFeeRule({...newFeeRule, feeType: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flat">Flat Fee (AED)</SelectItem>
                        <SelectItem value="BPS">BPS (Basis Points %)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fee-value">
                      Fee Value * {newFeeRule.feeType === "BPS" ? "(in basis points)" : "(in AED)"}
                    </Label>
                    <Input 
                      type="number" 
                      placeholder={newFeeRule.feeType === "BPS" ? "50 (0.5%)" : "25"}
                      value={newFeeRule.feeValue}
                      onChange={(e) => setNewFeeRule({...newFeeRule, feeValue: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fee-responsibility">Fee Responsibility *</Label>
                  <Select value={newFeeRule.feeResponsibility} onValueChange={(value) => 
                    setNewFeeRule({...newFeeRule, feeResponsibility: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Who pays the fee?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business">Business Pays</SelectItem>
                      <SelectItem value="Beneficiary">Beneficiary Pays</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Business Pays: Fee added to transaction cost | Beneficiary Pays: Fee deducted from payout amount
                  </p>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Fee Rule</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Fee Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Fee Rules Configuration
            </CardTitle>
            
            {/* Filters */}
            <div className="flex gap-4 mt-4">
              <div className="w-48">
                <Label htmlFor="country-filter">Filter by Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label htmlFor="type-filter">Filter by Transaction Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {transactionTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Amount Range (AED)</TableHead>
                  <TableHead>Fee Structure</TableHead>
                  <TableHead>Fee Value</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.transactionType}</TableCell>
                    <TableCell>{rule.country}</TableCell>
                    <TableCell>
                      {rule.minAmount.toLocaleString()} - {rule.maxAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{rule.feeType}</TableCell>
                    <TableCell className="font-mono">{rule.feeValue}</TableCell>
                    <TableCell>
                      <Badge variant={rule.feeResponsibility === "Business" ? "default" : "secondary"}>
                        {rule.feeResponsibility}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(rule.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeFeeManagement;