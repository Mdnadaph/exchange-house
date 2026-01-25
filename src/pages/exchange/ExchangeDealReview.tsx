import { useEffect, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
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
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";

import { formateDateTime } from "@/utils/formateDateTime";
import { useToast } from "@/hooks/use-toast";
import UserLayout from "@/components/layout/UserLayout";

const ExchangeDealReview = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const { toast } = useToast();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [rateDealsData, setRateDealsData] = useState(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const getRateDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals?query=${searchValue}&page=${page}&size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setRateDealsData(json?.data);
    } catch (error) {
      const msg = error.message || "Failed to load rate-deals";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRateDeals();
  }, [searchValue, page]);
  const exchangeAdminStats = rateDealsData?.exchangeAdminStats;
  const dealsData = rateDealsData?.rateDeals?.content;
  const totalDealsRateDataList = rateDealsData?.rateDeals?.totalElements;
  // const deals = [
  //   {
  //     id: "DEAL-001",
  //     businessId: "BIZ-001",
  //     businessName: "Tech Solutions LLC",
  //     sendingCurrency: "AED",
  //     sendingAmount: "50,000",
  //     payoutCountry: "India",
  //     payoutCurrency: "INR",
  //     requestedRate: "23.50",
  //     currentRate: "22.50",
  //     status: "pending",
  //     purpose: "Supplier Payment",
  //     submittedDate: "2024-01-16 10:30",
  //     branch: "Dubai Mall Branch",
  //     notes: "Urgent payment needed for supplier contract renewal",
  //     timeline: [
  //       {
  //         id: "1",
  //         type: "request" as const,
  //         actor: "Sarah Smith",
  //         role: "Business" as const,
  //         proposedRate: "23.50",
  //         timestamp: "2024-01-16 10:30",
  //       },
  //     ],
  //   },
  //   {
  //     id: "DEAL-005",
  //     businessId: "BIZ-002",
  //     businessName: "Smart Trading Corp",
  //     sendingCurrency: "USD",
  //     sendingAmount: "75,000",
  //     payoutCountry: "Philippines",
  //     payoutCurrency: "PHP",
  //     requestedRate: "57.00",
  //     currentRate: "55.80",
  //     status: "pending",
  //     purpose: "Salary Payment",
  //     submittedDate: "2024-01-16 08:15",
  //     branch: "Abu Dhabi Branch",
  //     notes: "Monthly salary disbursement for overseas staff",
  //     timeline: [
  //       {
  //         id: "1",
  //         type: "request" as const,
  //         actor: "John Doe",
  //         role: "Business" as const,
  //         proposedRate: "57.00",
  //         timestamp: "2024-01-16 08:15",
  //       },
  //     ],
  //   },
  // ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "COUNTER_PROPOSAL":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Counter Proposal
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateRateDifference = (requested: string, current: string) => {
    const diff =
      ((parseFloat(requested) - parseFloat(current)) / parseFloat(current)) *
      100;
    return diff.toFixed(2);
  };
  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </UserLayout>
    );
  }
  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Deal Requests Review
            </h1>
            <p className="text-muted-foreground">
              Review and respond to custom exchange rate requests
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {exchangeAdminStats?.pendingReview}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exchangeAdminStats?.totalRequests}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {exchangeAdminStats?.approved}
              </div>
              <p className="text-xs text-muted-foreground">75% approval rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Deals
              </CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exchangeAdminStats?.activeDeals}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
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
                    value={searchValue}
                    onChange={(e: any) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button variant="outline">Pending</Button>
                <Button variant="outline">All Branches</Button>
                <Button variant="outline">This Week</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals List */}
        <div className="space-y-4">
          {dealsData?.length > 0 ? (
            dealsData?.map((deal: any) => (
              <Card key={deal?.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Deal Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{deal?.companyName}</h3>
                          <span className="text-sm text-muted-foreground">
                            ({deal?.id})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{deal?.dealCode}</span>
                          {getStatusBadge(deal?.dealStatus)}
                          <Badge variant="outline" className="text-xs">
                            {deal?.registeredBranchName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {deal?.transactionPurpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {deal?.sendingCurrency} {deal?.amount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          to {deal?.payoutCurrency}
                        </p>
                      </div>
                    </div>

                    {/* Deal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">
                          Requested Rate:
                        </span>
                        <p className="font-semibold text-lg">
                          {deal?.proposedRate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {deal?.payoutCurrency}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">
                          Market Rate:
                        </span>
                        <p className="font-medium">{deal?.currentMarketRate}</p>
                        <p className="text-xs text-muted-foreground">
                          {deal?.payoutCurrency}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">
                          Difference:
                        </span>
                        <p
                          className={`font-medium ${parseFloat(calculateRateDifference(deal?.proposedRate, deal?.currentMarketRate)) > 0 ? "text-warning" : "text-success"}`}
                        >
                          +
                          {calculateRateDifference(
                            deal?.proposedRate,
                            deal?.currentMarketRate,
                          )}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground">
                          vs market
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Submitted:
                        </span>
                        <p className="font-medium">
                          {formateDateTime(deal?.submittedAt)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">
                          Estimated Payout:
                        </span>
                        <p className="font-medium">
                          {/* {deal.payoutCurrency}{" "}
                        {(
                          parseFloat(deal.sendingAmount.replace(/,/g, "")) *
                          parseFloat(deal.requestedRate)
                        ).toLocaleString()} */}
                          {deal?.proposedRate * deal?.amount}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {deal?.notes && (
                      <Card className="bg-muted/20">
                        <CardContent className="p-3">
                          <p className="text-sm">
                            <span className="font-medium">Business Notes:</span>{" "}
                            {deal?.notes}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedDeal(
                            expandedDeal === deal?.id ? null : deal?.id,
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedDeal === deal?.id ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                    </div>

                    {/* Expanded View */}
                    {expandedDeal === deal?.id && (
                      <div className="pt-4 border-t space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <DealNegotiationTimeline
                            events={deal?.negotiationHistory}
                            currentRate={deal?.proposedRate}
                            currency={deal?.payoutCurrency}
                          />

                          {deal?.dealStatus === "PENDING_REVIEW" && (
                            <DealResponseForm
                              refetch={getRateDeals}
                              dealId={deal?.id}
                              businessName={deal?.companyName}
                              requestedRate={deal?.proposedRate}
                              currency={deal?.payoutCurrency}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="font-semibold text-sm text-center text-gray-400">
              No Data Found
            </p>
          )}
          {totalDealsRateDataList > 10 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {rateDealsData?.rateDeals?.content.length} of{" "}
                {totalDealsRateDataList} beneficiaries
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(page + 1) * 10 >= totalDealsRateDataList}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeDealReview;
