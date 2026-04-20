// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
// // import { useToast } from "@/hooks/use-toast";
// // import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
// // import BASE_URL from "@/config/config";
// // import { useCookies } from "react-cookie";

// // interface DealResponseFormProps {
// //   refetch?: () => any;
// //   dealId: string;
// //   businessName: string;
// //   requestedRate: string;
// //   currency: string;
// //   onResponse?: () => void;
// // }

// // const DealResponseForm = ({
// //   refetch,
// //   dealId,
// //   businessName,
// //   requestedRate,
// //   currency,
// //   onResponse,
// // }: DealResponseFormProps) => {
// //   const { toast } = useToast();
// //   const [cookies] = useCookies(["token"]);
// //   const token = cookies?.token;
// //   const [action, setAction] = useState<
// //     "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL" | null
// //   >(null);
// //   const [counterRate, setCounterRate] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [showConfirmation, setShowConfirmation] = useState(false);

// //   const handleAction = (
// //     actionType: "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL",
// //   ) => {
// //     if (actionType === "COUNTER_PROPOSAL" && !counterRate) {
// //       toast({
// //         title: "Missing Information",
// //         description: "Please enter a counter-proposed rate",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     setAction(actionType);
// //     setShowConfirmation(true);
// //   };

// //   const confirmAction = () => {
// //     const formDTO = {
// //       action: action,
// //       counterRate: counterRate,
// //       message: message,
// //     };
// //     const actionMessages = {
// //       DEAL_APPROVED: "Deal approved and rate locked for the business",
// //       DEAL_REJECTED: "Deal request rejected",
// //       COUNTER_PROPOSAL: "Counter proposal sent to business",
// //     };
// //     const counterProposal = async () => {
// //       try {
// //         const res = await fetch(
// //           // `${BASE_URL}/api/v1/rate-deals/${dealId}/action`,
// //           `${BASE_URL}/api/v1/transactions/${dealId}/rate-deal`,
// //           // api/v1/transactions/TXN-37A56AC8-C/rate-deal
// //           {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${token}`,
// //             },
// //             body: JSON.stringify(formDTO),
// //           },
// //         );
// //         const json = await res.json();

// //         if (!res.ok || json.status !== true) {
// //           throw new Error(json.message || "Create failed");
// //         }
// //         toast({
// //           title: "Response Submitted",
// //           description: actionMessages[action],
// //         });
// //         onResponse?.();
// //         refetch?.();
// //         setCounterRate("");
// //         setMessage("");
// //       } catch (error) {
// //         toast({
// //           title: "Failed",
// //           description: error?.message || "Please try again",
// //           variant: "destructive",
// //         });
// //       } finally {
// //       }
// //     };
// //     counterProposal();
// //   };

// //   return (
// //     <>
// //       <Card className="shadow-card">
// //         <CardContent className="p-6 space-y-6">
// //           <h3 className="font-semibold text-lg">Review & Respond</h3>

// //           <div className="space-y-4">
// //             {/* Quick Actions */}
// //             <div className="flex flex-wrap gap-3">
// //               <Button
// //                 variant="default"
// //                 className="bg-success hover:bg-success/90"
// //                 onClick={() => handleAction("DEAL_APPROVED")}
// //               >
// //                 <CheckCircle className="h-4 w-4 mr-2" />
// //                 Approve Deal
// //               </Button>

// //               <Button
// //                 variant="destructive"
// //                 onClick={() => handleAction("DEAL_REJECTED")}
// //               >
// //                 <XCircle className="h-4 w-4 mr-2" />
// //                 Reject Deal
// //               </Button>
// //             </div>

// //             {/* Counter Proposal Section */}
// //             <div className="pt-4 border-t space-y-4">
// //               <div className="flex items-center gap-2">
// //                 <MessageSquare className="h-5 w-5 text-primary" />
// //                 <h4 className="font-medium">Counter Proposal</h4>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label htmlFor="counterRate">Your Counter Rate</Label>
// //                     <Input
// //                       id="counterRate"
// //                       type="number"
// //                       step="0.01"
// //                       placeholder="Enter counter rate"
// //                       value={counterRate}
// //                       onChange={(e) => setCounterRate(e.target.value)}
// //                     />
// //                     <p className="text-xs text-muted-foreground">
// //                       Business requested: {requestedRate} {currency}
// //                     </p>
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label>Rate Comparison</Label>
// //                     <div className="p-3 bg-muted/30 rounded-md">
// //                       {counterRate && (
// //                         <div className="space-y-1 text-sm">
// //                           <div className="flex justify-between">
// //                             <span className="text-muted-foreground">
// //                               Requested:
// //                             </span>
// //                             <span className="font-medium">{requestedRate}</span>
// //                           </div>
// //                           <div className="flex justify-between">
// //                             <span className="text-muted-foreground">
// //                               Your Counter:
// //                             </span>
// //                             <span className="font-medium">{counterRate}</span>
// //                           </div>
// //                           <div className="flex justify-between pt-1 border-t">
// //                             <span className="text-muted-foreground">
// //                               Difference:
// //                             </span>
// //                             <span
// //                               className={`font-medium ${parseFloat(counterRate) > parseFloat(requestedRate) ? "text-success" : "text-destructive"}`}
// //                             >
// //                               {(
// //                                 parseFloat(counterRate) -
// //                                 parseFloat(requestedRate)
// //                               ).toFixed(4)}
// //                             </span>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="message">
// //                     Message to Business (Optional)
// //                   </Label>
// //                   <Textarea
// //                     id="message"
// //                     placeholder="Provide reasoning for your decision..."
// //                     value={message}
// //                     onChange={(e) => setMessage(e.target.value)}
// //                     rows={3}
// //                   />
// //                 </div>

// //                 <Button
// //                   variant="outline"
// //                   onClick={() => handleAction("COUNTER_PROPOSAL")}
// //                   disabled={!counterRate}
// //                 >
// //                   <MessageSquare className="h-4 w-4 mr-2" />
// //                   Send Counter Proposal
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <ConfirmationDialog
// //         open={showConfirmation}
// //         onOpenChange={setShowConfirmation}
// //         onConfirm={confirmAction}
// //         title={`Confirm ${action === "DEAL_APPROVED" ? "Approval" : action === "DEAL_REJECTED" ? "Rejection" : "Counter Proposal"}`}
// //         description={
// //           action === "DEAL_APPROVED"
// //             ? `Approve the requested rate of ${requestedRate} ${currency} for ${businessName}? This will lock the rate for the deal validity period.`
// //             : action === "DEAL_REJECTED"
// //               ? `Reject the deal request from ${businessName}? They will be notified of the rejection.`
// //               : `Send counter proposal of ${counterRate} ${currency} to ${businessName}? They can accept or decline this rate.`
// //         }
// //         confirmText={
// //           action === "DEAL_APPROVED"
// //             ? "Approve Deal"
// //             : action === "DEAL_REJECTED"
// //               ? "Reject Deal"
// //               : "Send Counter"
// //         }
// //         variant={action === "DEAL_REJECTED" ? "destructive" : "default"}
// //       />
// //     </>
// //   );
// // };

// // export default DealResponseForm;

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
// import { useToast } from "@/hooks/use-toast";
// import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
// import BASE_URL from "@/config/config";
// import { useCookies } from "react-cookie";

// interface DealResponseFormProps {
//   refetch?: () => void;
//   dealId: string;
//   businessName: string;
//   requestedRate: string;
//   currency: string;
//   onResponse?: () => void;
// }

// const DealResponseForm = ({
//   refetch,
//   dealId,
//   businessName,
//   requestedRate,
//   currency,
//   onResponse,
// }: DealResponseFormProps) => {
//   const { toast } = useToast();
//   const [cookies] = useCookies(["token"]);
//   const token = cookies?.token;

//   const [action, setAction] = useState<
//     "RATE_DEAL_APPROVED" | "RATE_DEAL_REJECTED" | "RATE_DEAL_COUNTER_PROPOSAL" | null
//   >(null);

//   const [counterRate, setCounterRate] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleAction = (
//     actionType: "RATE_DEAL_APPROVED" | "RATE_DEAL_REJECTED" | "RATE_DEAL_COUNTER_PROPOSAL"
//   ) => {
//     if (actionType === "RATE_DEAL_COUNTER_PROPOSAL" && !counterRate) {
//       toast({
//         title: "Missing Information",
//         description: "Please enter a counter-proposed rate",
//         variant: "destructive",
//       });
//       return;
//     }

//     setAction(actionType);
//     setShowConfirmation(true);
//   };

//   const confirmAction = async () => {
//     if (!action || !token) return;

//     setIsSubmitting(true);

//     const formDTO = {
//       status: action,                    // Backend expects "status", not "action"
//       counterRate: action === "RATE_DEAL_COUNTER_PROPOSAL" ? parseFloat(counterRate) : undefined,
//       message: message.trim() || undefined,
//     };

//     const actionMessages = {
//       RATE_DEAL_APPROVED: "Deal approved and rate locked successfully",
//       RATE_DEAL_REJECTED: "Deal request rejected successfully",
//       RATE_DEAL_COUNTER_PROPOSAL: "Counter proposal sent to business successfully",
//     };

//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/v1/transactions/${dealId}/rate-deal`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formDTO),
//         }
//       );

//       const json = await res.json();

//       if (!res.ok || json.status !== true) {
//         throw new Error(json.message || "Failed to process rate deal action");
//       }

//       toast({
//         title: "Success",
//         description: actionMessages[action],
//         variant: "default",
//       });

//       // Reset form
//       setCounterRate("");
//       setMessage("");
//       setAction(null);

//       // Refresh data
//       onResponse?.();
//       refetch?.();

//     } catch (error: any) {
//       toast({
//         title: "Failed",
//         description: error?.message || "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//       setShowConfirmation(false);
//     }
//   };

//   return (
//     <>
//       <Card className="shadow-card">
//         <CardContent className="p-6 space-y-6">
//           <h3 className="font-semibold text-lg">Review & Respond to Rate Deal</h3>

//           <div className="space-y-4">
//             {/* Quick Actions */}
//             <div className="flex flex-wrap gap-3">
//               <Button
//                 variant="default"
//                 className="bg-success hover:bg-success/90"
//                 onClick={() => handleAction("RATE_DEAL_APPROVED")}
//                 disabled={isSubmitting}
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Approve Deal
//               </Button>

//               <Button
//                 variant="destructive"
//                 onClick={() => handleAction("RATE_DEAL_REJECTED")}
//                 disabled={isSubmitting}
//               >
//                 <XCircle className="h-4 w-4 mr-2" />
//                 Reject Deal
//               </Button>
//             </div>

//             {/* Counter Proposal Section */}
//             <div className="pt-4 border-t space-y-4">
//               <div className="flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5 text-primary" />
//                 <h4 className="font-medium">Counter Proposal</h4>
//               </div>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="counterRate">Your Counter Rate</Label>
//                     <Input
//                       id="counterRate"
//                       type="number"
//                       step="0.0001"
//                       placeholder="Enter counter rate"
//                       value={counterRate}
//                       onChange={(e) => setCounterRate(e.target.value)}
//                       disabled={isSubmitting}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Business requested: {requestedRate} {currency}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Rate Comparison</Label>
//                     <div className="p-3 bg-muted/30 rounded-md min-h-[80px]">
//                       {counterRate && (
//                         <div className="space-y-1 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Requested:</span>
//                             <span className="font-medium">{requestedRate}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Your Counter:</span>
//                             <span className="font-medium">{counterRate}</span>
//                           </div>
//                           <div className="flex justify-between pt-1 border-t">
//                             <span className="text-muted-foreground">Difference:</span>
//                             <span
//                               className={`font-medium ${
//                                 parseFloat(counterRate) > parseFloat(requestedRate)
//                                   ? "text-success"
//                                   : "text-destructive"
//                               }`}
//                             >
//                               {(
//                                 parseFloat(counterRate) - parseFloat(requestedRate)
//                               ).toFixed(4)}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">Message to Business (Optional)</Label>
//                   <Textarea
//                     id="message"
//                     placeholder="Provide reasoning for your decision..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     rows={3}
//                     disabled={isSubmitting}
//                   />
//                 </div>

//                 <Button
//                   variant="outline"
//                   onClick={() => handleAction("RATE_DEAL_COUNTER_PROPOSAL")}
//                   disabled={!counterRate || isSubmitting}
//                 >
//                   <MessageSquare className="h-4 w-4 mr-2" />
//                   Send Counter Proposal
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <ConfirmationDialog
//         open={showConfirmation}
//         onOpenChange={setShowConfirmation}
//         onConfirm={confirmAction}
//         title={`Confirm ${action === "RATE_DEAL_APPROVED" ? "Approval" : action === "RATE_DEAL_REJECTED" ? "Rejection" : "Counter Proposal"}`}
//         description={
//           action === "RATE_DEAL_APPROVED"
//             ? `Approve the requested rate of ${requestedRate} ${currency} for ${businessName}?`
//             : action === "RATE_DEAL_REJECTED"
//             ? `Reject the deal request from ${businessName}?`
//             : `Send counter proposal of ${counterRate} ${currency} to ${businessName}?`
//         }
//         confirmText={
//           action === "RATE_DEAL_APPROVED"
//             ? "Approve Deal"
//             : action === "RATE_DEAL_REJECTED"
//             ? "Reject Deal"
//             : "Send Counter Proposal"
//         }
//         variant={action === "RATE_DEAL_REJECTED" ? "destructive" : "default"}
//         isLoading={isSubmitting}
//       />
//     </>
//   );
// };

// export default DealResponseForm;

// components/deals/ExchangeTransactionTimeLine.tsx

import { Clock, CheckCircle, XCircle, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RateDealHistory {
  action: string;
  actorEmail: string;
  rate?: number | null;
  message?: string | null;
  actedAt: string;
}

interface ExchangeTransactionTimeLineProps {
  events?: RateDealHistory[];
  currentRate?: string | number;
  currency?: string;
}

const ExchangeTransactionResponseForm = ({
  events = [],
  currentRate,
  currency = "AED",
}: ExchangeTransactionTimeLineProps) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "RATE_DEAL_APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "RATE_DEAL_REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "RATE_DEAL_COUNTER_PROPOSAL":
        return <MessageSquare className="h-5 w-5 text-amber-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "RATE_DEAL_APPROVED":
        return "Rate Approved";
      case "RATE_DEAL_REJECTED":
        return "Rate Rejected";
      case "RATE_DEAL_COUNTER_PROPOSAL":
        return "Counter Proposal Sent";
      default:
        return action.replace("RATE_DEAL_", "").replace("_", " ");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="shadow-card h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Rate Deal Timeline</h3>
        </div>

        {currentRate && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Current / Latest Rate</p>
            <p className="text-2xl font-bold text-primary">
              {currentRate} {currency}
            </p>
          </div>
        )}

        {events && events.length > 0 ? (
          <div className="relative space-y-8 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(event.action)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-medium">
                      {getActionLabel(event.action)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.actedAt)}
                    </span>
                  </div>

                  <p className="text-sm font-medium">{event.actorEmail}</p>

                  {event.rate && (
                    <p className="text-sm">
                      Rate: <span className="font-semibold">{event.rate}</span> {currency}
                    </p>
                  )}

                  {event.message && (
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                      "{event.message}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No rate deal history available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeTransactionResponseForm;