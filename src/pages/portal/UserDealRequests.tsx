import { useEffect, useState, useRef } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DealRequestForm from "@/components/deals/DealRequestForm";
import DealNegotiationTimeline from "@/components/deals/DealNegotiationTimeline";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { formateDateTime } from "@/utils/formateDateTime";

const UserDealRequests = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const { toast } = useToast();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);


  const [searchTerm, setSearchTerm] = useState("");
   const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showDeclineConfirmation, setShowDeclineConfirmation] = useState(false);
  const [counterDeal, setCounterDeal] = useState<any>(null);
  const [rateDealsData, setRateDealsData] = useState(null);

  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const getRateDeals = async (options?: {
    page?: number;
    search?: string;
    status?: string;
    reset?: boolean;
  }) => {
    const {
      page: targetPage = page,
      search = searchValue,
      status = statusFilter,
      reset = false,
    } = options || {};

    const effectivePage = reset ? 0 : targetPage;
    if (reset) {
      setPage(0);
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (status) params.append("status", status);
      params.append("page", effectivePage.toString());
      params.append("size", "10");

      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals?${params.toString()}`,
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
  }, []);

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      getRateDeals({ search: searchValue, status: statusFilter, reset: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    getRateDeals({ search: searchValue, status: status, reset: true });
  };

  const goToPrevPage = () => {
    const newPage = page - 1;
    setPage(newPage);
    getRateDeals({ page: newPage });
  };

  const goToNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    getRateDeals({ page: newPage });
  };

  const businessAdminstates = rateDealsData?.businessAdminStats;
  const totalDealsRateDataList = rateDealsData?.rateDeals?.totalElements;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "COUNTER_PROPOSAL":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Counter Proposal
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAcceptCounter = (deal: any) => {
    setCounterDeal(deal);
    setShowAcceptConfirmation(true);
    setId(deal?.id);
  };

  const handleDeclineCounter = (deal: any) => {
    setCounterDeal(deal);
    setShowDeclineConfirmation(true);
    setId(deal?.id);
  };

  const confirmAccept = async () => {
    const formDTO = { counterDealStatus: "COUNTER_PROPOSAL_ACCEPTED" };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals/${id}/counter-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDTO),
        },
      );
      const json = await res.json();
      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }
      toast({
        title: "Counter Proposal Accepted",
        description: `You have accepted the rate of ${counterDeal?.counterRate} ${counterDeal?.payoutCurrency}`,
      });
      setShowAcceptConfirmation(false);
      setId(null);
      getRateDeals();
    } catch (error) {
      toast({
        title: "Failed to Counter Proposal Accepted",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const confirmDecline = async () => {
    const formDTO = { counterDealStatus: "COUNTER_PROPOSAL_DECLINED" };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals/${id}/counter-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDTO),
        },
      );
      const json = await res.json();
      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }
      toast({
        title: "Counter Proposal Declined",
        description: "You have declined the counter proposals",
      });
      setShowDeclineConfirmation(false);
      setId(null);
      getRateDeals();
    } catch (error) {
      toast({
        title: "Failed to Counter Proposal Declined",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const getCounterRate = (negotiationHistory: any) => {
    return negotiationHistory?.find(
      (item: any) => item?.actionType === "COUNTER_PROPOSAL",
    )?.rate;
  };

  const getCounterComments = (negotiationHistory: any) => {
    return negotiationHistory?.find(
      (item: any) => item?.actionType === "COUNTER_PROPOSAL",
    )?.comments;
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
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Exchange Rate Deals
            </h1>
            <p className="text-muted-foreground">
              Negotiate custom exchange rates for your transactions
            </p>
          </div>
          <DealRequestForm refetch={getRateDeals} />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessAdminstates?.totalRequests}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {businessAdminstates?.pending}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
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
                {businessAdminstates?.approved}
              </div>
              <p className="text-xs text-muted-foreground">Active deals</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Response
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessAdminstates?.awaitingResponse}
              </div>
              <p className="text-xs text-muted-foreground">Counter proposals</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Deals</Label>
                {/* <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by ID, currency, or purpose..."
                    className="pl-9"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div> */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or role..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
                <Button
                  variant={statusFilter === "" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("")}
                >
                  All Status
                </Button>
                <Button
                  variant={statusFilter === "PENDING_REVIEW" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("PENDING_REVIEW")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "APPROVED" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("APPROVED")}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === "REJECTED" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("REJECTED")}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals List */}
        <div className="space-y-4">
          {rateDealsData?.rateDeals?.content?.length > 0 ? (
            rateDealsData?.rateDeals?.content.map((deal: any) => (
              <Card
                key={deal?.id}
                className="shadow-card hover:shadow-md transition-smooth"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Deal Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {deal?.dealCode}
                          </h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Requested Rate:
                        </span>
                        <p className="font-semibold">
                          {deal.proposedRate} {deal.payoutCurrency}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">
                          Market Rate:
                        </span>
                        <p className="font-medium">
                          {deal.currentMarketRate} {deal.payoutCurrency}
                        </p>
                      </div>
                      {["COUNTER_PROPOSAL", "COUNTER_PROPOSAL_ACCEPTED"].includes(
                        deal?.dealStatus,
                      ) && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Counter Rate:
                          </span>
                          <p className="font-semibold text-accent">
                            {getCounterRate(deal?.negotiationHistory)}{" "}
                            {deal.payoutCurrency}
                          </p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Approved Date:
                        </span>
                        <p className="font-medium">
                          {deal?.approvedAt}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expire Date:
                        </span>
                        <p className="font-medium">
                          {deal?.expiryDate}
                        </p>
                      </div>
                    </div>

                    {/* Counter Proposal Message */}
                    {["COUNTER_PROPOSAL", "COUNTER_PROPOSAL_ACCEPTED"].includes(
                      deal?.dealStatus,
                    ) && (
                      <Card className="bg-accent-muted/20 border-accent">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="h-5 w-5 text-accent mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">
                                Counter Proposal Message
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {getCounterComments(deal?.negotiationHistory)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
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
                        </Button>
                      </div>

                      {deal?.dealStatus === "COUNTER_PROPOSAL" && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAcceptCounter(deal)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Accept Counter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeclineCounter(deal)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}

                      {deal?.dealStatus === "APPROVED" && (
                        <Badge
                          variant="default"
                          className="bg-success/10 text-success"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready to Use in Transactions
                        </Badge>
                      )}
                    </div>

                    {/* Timeline */}
                    {selectedDeal === deal?.id && (
                      <div className="pt-4 border-t">
                        <DealNegotiationTimeline
                          events={deal?.negotiationHistory}
                          currentRate={deal?.proposedRate}
                          currency={deal?.payoutCurrency}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center font-semibold text-sm text-gray-500">
              No Data Found
            </p>
          )}

          {totalDealsRateDataList > 10 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {rateDealsData?.rateDeals?.content.length} of{" "}
                {totalDealsRateDataList} deals
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={goToPrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(page + 1) * 10 >= totalDealsRateDataList}
                  onClick={goToNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={showAcceptConfirmation}
        onOpenChange={setShowAcceptConfirmation}
        onConfirm={confirmAccept}
        title="Accept Counter Proposal"
        description={
          counterDeal
            ? `Accept the counter-proposed rate of ${counterDeal.counterRate} ${counterDeal.payoutCurrency}? This rate will be locked for the deal validity period.`
            : ""
        }
        confirmText="Accept Counter"
      />

      <ConfirmationDialog
        open={showDeclineConfirmation}
        onOpenChange={setShowDeclineConfirmation}
        onConfirm={confirmDecline}
        title="Decline Counter Proposal"
        description="Decline this counter proposal? You can submit a new deal request if needed."
        confirmText="Decline Counter"
        variant="destructive"
      />
    </UserLayout>
  );
};

export default UserDealRequests;