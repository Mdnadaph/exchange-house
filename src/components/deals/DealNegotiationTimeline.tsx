import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { formateDateTime } from "@/utils/formateDateTime";

interface TimelineEvent {
  id: string;
  actionType:
    | "request"
    | "approved"
    | "rejected"
    | "counter"
    | "accepted"
    | "declined";
  performedBy: string;
  role: "Business" | "Exchange" | "Branch";
  rate?: string;
  message?: string;
  createdAt: string;
  performedByRole: string;
}

interface DealNegotiationTimelineProps {
  //events: TimelineEvent[];
  events: any;
  currentRate: string | number;
  currency: string;
}

const DealNegotiationTimeline = ({
  events,
  currentRate,
  currency,
}: DealNegotiationTimelineProps) => {
  // const getEventIcon = (type: string) => {
  //   switch (type) {
  //     case "DEAL_REQUESTED":
  //       return <TrendingUp className="h-4 w-4 text-primary" />;
  //     case "approved":
  //       return <CheckCircle className="h-4 w-4 text-success" />;
  //     case "rejected":
  //     case "declined":
  //       return <XCircle className="h-4 w-4 text-destructive" />;
  //     case "counter":
  //       return <MessageSquare className="h-4 w-4 text-warning" />;
  //     case "accepted":
  //       return <CheckCircle className="h-4 w-4 text-success" />;
  //     default:
  //       return <Clock className="h-4 w-4 text-muted-foreground" />;
  //   }
  // };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "DEAL_REQUESTED":
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case "DEAL_APPROVED":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "DEAL_REJECTED":
      case "COUNTER_PROPSAL_DECLINED":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "COUNTER_PROPOSAL":
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case "COUNTER_PROPOSAL_ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  // const getEventIcon = (type: string) => {
  //   switch (type) {
  //     case "DEAL_REQUESTED":
  //       return <TrendingUp className="h-4 w-4 text-primary" />;
  //     case "approved":
  //       return <CheckCircle className="h-4 w-4 text-success" />;
  //     case "rejected":
  //     case "declined":
  //       return <XCircle className="h-4 w-4 text-destructive" />;
  //     case "counter":
  //       return <MessageSquare className="h-4 w-4 text-warning" />;
  //     case "accepted":
  //       return <CheckCircle className="h-4 w-4 text-success" />;
  //     default:
  //       return <Clock className="h-4 w-4 text-muted-foreground" />;
  //   }
  // };
  const getEventLabel = (type: string) => {
    switch (type) {
      case "DEAL_REQUESTED":
        return "Deal Requested";
      case "DEAL_APPROVED":
        return "Deal Approved";
      case "DEAL_REJECTED":
        return "Deal Rejected";
      case "COUNTER_PROPOSAL":
        return "Counter Proposal";
      case "COUNTER_PROPOSAL_ACCEPTED":
        return "Accepted";
      case "COUNTER_PROPSAL_DECLINED":
        return "Declined";
      default:
        return type;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Exchange":
        return "default";
      case "Branch":
        return "secondary";
      case "Business":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Negotiation History</h3>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />

          {events?.map((event, index) => (
            <div key={event?.id} className="relative flex gap-4 items-start">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                {getEventIcon(event?.actionType)}
              </div>

              {/* Event content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {getEventLabel(event?.actionType)}
                  </span>
                  {/* <Badge
                    variant={getRoleBadgeVariant(event.role)}
                    className="text-xs"
                  >
                    {"Business"}
                  </Badge> */}
                  <Badge
                    variant={getRoleBadgeVariant("Business")}
                    className="text-xs"
                  >
                    {event?.performedByRole}
                  </Badge>
                  {event?.rate && (
                    <Badge variant="outline" className="text-xs">
                      Rate: {event?.rate} {currency}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  by {event?.performedBy}
                </p>
                {event?.message && (
                  <p className="text-sm bg-muted/30 p-2 rounded mt-2">
                    {event.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formateDateTime(event?.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealNegotiationTimeline;
