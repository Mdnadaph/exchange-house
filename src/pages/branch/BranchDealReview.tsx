import { useEffect, useState } from "react";
import BranchLayout from "@/components/layout/BranchLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DealResponseForm from "@/components/deals/DealResponseForm";
import DealNegotiationTimeline from "@/components/deals/DealNegotiationTimeline";
import {
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
  Loader2,
  MessageSquare,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { formateDateTime } from "@/utils/formateDateTime";
import BranchDealRequestForm from "@/components/deals/BranchDealRequestForm";
import DealCounterResponseForm from "@/components/deals/DealCounterResponseForm";
import { PermissionGate } from "@/contexts/PermissionGate";
type NegotiationHistoryItem = {
  id: number;
  actionType: string;
  rate: number;
  comments?: string | null;
  createdAt: string;
  performedBy: string;
  performedByRole: string;
};
// ──────────────────────────────────────────────
// Simple debounce hook (no external dependency needed)
// ──────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const BranchDealReview = () => {
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies?.token;
  const currencyCode = cookies?.currencyCode;
  const [page, setPage] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Debounce search input — API called only after 500ms pause
  const debouncedSearch = useDebounce(searchValue, 500);

  const [rateDealsData, setRateDealsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const getRateDeals = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/rate-deals?query=${encodeURIComponent(
        debouncedSearch,
      )}&page=${page}&size=10&fromDate=${fromDate}&toDate=${toDate}`;

      if (filterStatus !== "ALL") {
        url += `&status=${filterStatus}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      if (json?.status !== true || !json.data) {
        throw new Error("Unexpected API response format");
      }

      setRateDealsData(json.data);
    } catch (error: any) {
      const msg = error.message || "Failed to load rate deals";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const clearFilterData = () => {
    setSearchValue("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  // Trigger fetch when these values change
  useEffect(() => {
    getRateDeals();
  }, [debouncedSearch, page, filterStatus, fromDate, toDate]);

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
      case "EXPIRED":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Expire
          </Badge>
        );
      case "COUNTER_PROPOSAL_DECLINED":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Counter Proposal Declined
          </Badge>
        );
      case "COUNTER_PROPOSAL_ACCEPTED":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Counter Propsal Accepted
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
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const calculateRateDifference = (requested: any, current: any) => {
    const req = parseFloat(requested);
    const cur = parseFloat(current);
    if (isNaN(req) || isNaN(cur) || cur === 0) return "0.00";
    const diff = ((req - cur) / cur) * 100;
    return diff.toFixed(2);
  };

  const stats = rateDealsData?.branchStats || {};
  const content = rateDealsData?.rateDeals?.content || [];
  const totalElements = rateDealsData?.rateDeals?.totalElements || 0;
  const hasMultipleCounterProposals = (
    negotiationHistory?: NegotiationHistoryItem[],
  ): boolean => {
    if (!negotiationHistory || negotiationHistory.length === 0) return false;

    const count = negotiationHistory.filter(
      (item) => item.actionType === "COUNTER_PROPOSAL",
    ).length;

    return count >= 2;
  };

  // if (loading) {
  //   return (
  //     <BranchLayout>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="flex flex-col items-center space-y-4">
  //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //           <p className="text-muted-foreground">Loading rate deals...</p>
  //         </div>
  //       </div>
  //     </BranchLayout>
  //   );
  // }

  return (
    <BranchLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Branch Deal Requests
            </h1>
            <p className="text-muted-foreground">
              Review deals from your registered businesses
            </p>
          </div>
          <div>
            <PermissionGate permission="BTN_BRANCH_CREATE_RATE_DEALS">
              <BranchDealRequestForm
                refetch={getRateDeals}
                clearFilterData={clearFilterData}
              />
            </PermissionGate>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Branch Businesses
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.branchBusiness ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Active businesses</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Volume
              </CardTitle>
              {/* <DollarSign className="h-5 w-5 text-accent" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencyCode} {stats.totalVolume?.toLocaleString() ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">Deals volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 flex gap-2 items-center flex-wrap">
                <div className="min-w-[280px]">
                  <Label htmlFor="search">Search Deals</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Business name, deal code, currency..."
                      className="pl-10"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setPage(0);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <Label htmlFor="fromDate">From Date</Label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md p-1 text-gray-500 font-normal text-base h-[40px]"
                    placeholder="Select Date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <Label htmlFor="toDate">To Date</Label>
                  <input
                    type="date"
                    placeholder="Select Date"
                    className="border border-gray-300 rounded-md p-1 text-gray-500 font-normal text-base h-[40px]"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilterStatus("ALL");
                    setPage(0);
                  }}
                >
                  All
                </Button>
                <Button
                  variant={
                    filterStatus === "PENDING_REVIEW" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setFilterStatus("PENDING_REVIEW");
                    setPage(0);
                  }}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "APPROVED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilterStatus("APPROVED");
                    setPage(0);
                  }}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === "REJECTED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilterStatus("REJECTED");
                    setPage(0);
                  }}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading rate deals...</p>
              </div>
            </div>
          ) : content?.length > 0 ? (
            <div>
              {content.map((deal: any) => (
                <Card key={deal.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Building2 className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">
                              {deal?.companyName || "—"}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {deal?.dealCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(deal?.dealStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {deal?.transactionPurpose || "—"}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold">
                            {deal?.sendingCurrency}{" "}
                            {deal?.amount?.toLocaleString() || "—"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            to {deal?.country || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Requested Rate
                          </span>
                          <p className="font-semibold text-lg">
                            {deal?.proposedRate || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {deal?.payoutCurrency}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Market Rate
                          </span>
                          <p className="font-medium">
                            {deal?.currentMarketRate || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {deal?.payoutCurrency}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Difference
                          </span>
                          <p
                            className={`font-medium ${
                              Number(
                                calculateRateDifference(
                                  deal?.proposedRate,
                                  deal?.currentMarketRate,
                                ),
                              ) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {Number(
                              calculateRateDifference(
                                deal?.proposedRate,
                                deal?.currentMarketRate,
                              ),
                            ) >= 0
                              ? "+"
                              : ""}
                            {calculateRateDifference(
                              deal?.proposedRate,
                              deal?.currentMarketRate,
                            )}
                            %
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Submitted
                          </span>
                          <p className="font-medium">
                            {deal?.submittedAt
                              ? formateDateTime(deal.submittedAt)
                              : "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">
                            Est. Payout
                          </span>
                          <p className="font-medium">
                            {deal?.payoutCurrency}{" "}
                            {(
                              Number(deal?.amount || 0) *
                              Number(deal?.proposedRate || 0)
                            ).toLocaleString() || "—"}
                          </p>
                        </div>
                      </div>

                      {deal?.notes && (
                        <div className="text-sm bg-muted/20 p-3 rounded">
                          <span className="font-medium">Notes: </span>
                          {deal.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedDeal(
                              selectedDeal === deal.id ? null : deal.id,
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {selectedDeal === deal.id ? "Hide" : "View"} Timeline
                          {selectedDeal === deal.id ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </Button>
                      </div>

                      {/* {expandedDeal === deal.id && (
                    <div className="pt-4 border-t grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DealNegotiationTimeline
                        events={deal?.negotiationHistory || []}
                        currentRate={deal.proposedRate}
                        currency={deal.payoutCurrency}
                      />

                      {deal?.dealStatus === "COUNTER_PROPOSAL" && (
                        <DealResponseForm
                          refetch={getRateDeals}
                          dealId={deal.id}
                          businessName={deal.companyName}
                          requestedRate={deal.proposedRate}
                          currency={deal.payoutCurrency}
                        />
                      )}
                    </div>
                  )} */}

                      {selectedDeal === deal?.id && (
                        <div className="pt-4 border-t">
                          <div className="grid grid-cols-2 gap-6">
                            <DealNegotiationTimeline
                              events={deal?.negotiationHistory}
                              currentRate={deal?.proposedRate}
                              currency={deal?.payoutCurrency}
                            />
                            {/* {deal?.dealStatus === "COUNTER_PROPOSAL" && (
                                              <DealResponseForm
                                                refetch={getRateDeals}
                                                dealId={deal?.id}
                                                businessName={deal?.companyName}
                                                requestedRate={deal?.proposedRate}
                                                currency={deal?.payoutCurrency}
                                              />
                                            )} */}
                            {deal?.dealStatus === "COUNTER_PROPOSAL" &&
                              (hasMultipleCounterProposals(
                                deal?.negotiationHistory,
                              ) ? (
                                <div></div>
                              ) : (
                                <PermissionGate permission="BTN_BRANCH_RATE_DEALS_HANDLE_DEAL">
                                  <DealCounterResponseForm
                                    refetch={getRateDeals}
                                    dealId={deal?.id}
                                    businessName={deal?.companyName}
                                    requestedRate={
                                      deal?.negotiationHistory[
                                        deal?.negotiationHistory?.length - 1
                                      ]?.rate
                                    }
                                    currency={deal?.payoutCurrency}
                                  />
                                </PermissionGate>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center font-normal text-xl text-gray-600">
              No Rate Deals Found.
            </p>
          )}

          {totalElements > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {content.length} of {totalElements} deals
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * 10 + content.length >= totalElements}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {content.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              No rate deals found matching your filters.
            </div>
          )}
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchDealReview;
