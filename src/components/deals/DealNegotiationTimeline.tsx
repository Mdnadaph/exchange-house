import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, TrendingUp, MessageSquare } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "request" | "approved" | "rejected" | "counter" | "accepted" | "declined";
  actor: string;
  role: "Business" | "Exchange" | "Branch";
  proposedRate?: string;
  message?: string;
  timestamp: string;
}

interface DealNegotiationTimelineProps {
  events: TimelineEvent[];
  currentRate: string;
  currency: string;
}

const DealNegotiationTimeline = ({ events, currentRate, currency }: DealNegotiationTimelineProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "request":
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
      case "declined":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "counter":
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "request":
        return "Deal Requested";
      case "approved":
        return "Deal Approved";
      case "rejected":
        return "Deal Rejected";
      case "counter":
        return "Counter Proposal";
      case "accepted":
        return "Accepted";
      case "declined":
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

          {events.map((event, index) => (
            <div key={event.id} className="relative flex gap-4 items-start">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                {getEventIcon(event.type)}
              </div>

              {/* Event content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{getEventLabel(event.type)}</span>
                  <Badge variant={getRoleBadgeVariant(event.role)} className="text-xs">
                    {event.role}
                  </Badge>
                  {event.proposedRate && (
                    <Badge variant="outline" className="text-xs">
                      Rate: {event.proposedRate} {currency}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  by {event.actor}
                </p>
                {event.message && (
                  <p className="text-sm bg-muted/30 p-2 rounded mt-2">
                    {event.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {event.timestamp}
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
