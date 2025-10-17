import { useState } from "react";
import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DealResponseForm from "@/components/deals/DealResponseForm";
import DealNegotiationTimeline from "@/components/deals/DealNegotiationTimeline";
import { 
  TrendingUp, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Building2,
  Calendar,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";

const BranchDealReview = () => {
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);

  // Only deals from businesses registered through this branch
  const deals = [
    {
      id: "DEAL-001",
      businessId: "BIZ-001",
      businessName: "Tech Solutions LLC",
      sendingCurrency: "AED",
      sendingAmount: "50,000",
      payoutCountry: "India",
      payoutCurrency: "INR",
      requestedRate: "23.50",
      currentRate: "22.50",
      status: "pending",
      purpose: "Supplier Payment",
      submittedDate: "2024-01-16 10:30",
      registeredDate: "2023-05-15",
      notes: "Urgent payment needed for supplier contract renewal",
      timeline: [
        {
          id: "1",
          type: "request" as const,
          actor: "Sarah Smith",
          role: "Business" as const,
          proposedRate: "23.50",
          timestamp: "2024-01-16 10:30"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateRateDifference = (requested: string, current: string) => {
    const diff = ((parseFloat(requested) - parseFloat(current)) / parseFloat(current)) * 100;
    return diff.toFixed(2);
  };

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branch Deal Requests</h1>
            <p className="text-muted-foreground">Review deals from your registered businesses</p>
          </div>
        </div>

        {/* Info Alert */}
        <Card className="bg-accent-muted/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Branch Deal Authority</p>
                <p className="text-sm text-muted-foreground">
                  You can review and respond to deal requests from businesses registered through Dubai Mall Branch. 
                  You have authority to approve deals within your branch's rate margin limits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Businesses</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active businesses</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {deals.filter(d => d.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">8</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$450K</div>
              <p className="text-xs text-muted-foreground">Deals volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Deals</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by business name, ID, or currency..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button variant="outline">Pending</Button>
                <Button variant="outline">All Businesses</Button>
                <Button variant="outline">This Week</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals List */}
        <div className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Deal Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{deal.businessName}</h3>
                        <span className="text-sm text-muted-foreground">({deal.businessId})</span>
                        <Badge variant="outline" className="text-xs">
                          Reg: {deal.registeredDate}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deal.id}</span>
                        {getStatusBadge(deal.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{deal.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {deal.sendingCurrency} {deal.sendingAmount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        to {deal.payoutCountry}
                      </p>
                    </div>
                  </div>

                  {/* Deal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Requested Rate:</span>
                      <p className="font-semibold text-lg">{deal.requestedRate}</p>
                      <p className="text-xs text-muted-foreground">{deal.payoutCurrency}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Market Rate:</span>
                      <p className="font-medium">{deal.currentRate}</p>
                      <p className="text-xs text-muted-foreground">{deal.payoutCurrency}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Difference:</span>
                      <p className={`font-medium ${parseFloat(calculateRateDifference(deal.requestedRate, deal.currentRate)) > 0 ? 'text-warning' : 'text-success'}`}>
                        +{calculateRateDifference(deal.requestedRate, deal.currentRate)}%
                      </p>
                      <p className="text-xs text-muted-foreground">vs market</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Submitted:
                      </span>
                      <p className="font-medium">{deal.submittedDate}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Estimated Payout:</span>
                      <p className="font-medium">
                        {deal.payoutCurrency} {(parseFloat(deal.sendingAmount.replace(/,/g, '')) * parseFloat(deal.requestedRate)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {deal.notes && (
                    <Card className="bg-muted/20">
                      <CardContent className="p-3">
                        <p className="text-sm"><span className="font-medium">Business Notes:</span> {deal.notes}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedDeal === deal.id ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>

                  {/* Expanded View */}
                  {expandedDeal === deal.id && (
                    <div className="pt-4 border-t space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <DealNegotiationTimeline 
                          events={deal.timeline}
                          currentRate={deal.requestedRate}
                          currency={deal.payoutCurrency}
                        />
                        
                        {deal.status === "pending" && (
                          <DealResponseForm 
                            dealId={deal.id}
                            businessName={deal.businessName}
                            requestedRate={deal.requestedRate}
                            currency={deal.payoutCurrency}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchDealReview;
