//import { useState } from "react";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
//import { Card, CardContent } from "@/components/ui/card";
//import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
//import { useToast } from "@/hooks/use-toast";
//import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
//import BASE_URL from "@/config/config";
//import { useCookies } from "react-cookie";

//interface DealResponseFormProps {
//  refetch?: () => any;
//  dealId: string;
//  businessName: string;
//  requestedRate: string;
//  currency: string;
//  onResponse?: () => void;
//}

//const DealResponseForm = ({
//  refetch,
//  dealId,
//  businessName,
//  requestedRate,
//  currency,
//  onResponse,
//}: DealResponseFormProps) => {
//  const { toast } = useToast();
//  const [cookies] = useCookies(["token"]);
//  const token = cookies?.token;
//  const [action, setAction] = useState<
//    "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL" | null
//  >(null);
//  const [counterRate, setCounterRate] = useState("");
//  const [message, setMessage] = useState("");
//  const [showConfirmation, setShowConfirmation] = useState(false);

//  const handleAction = (
//    actionType: "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL",
//  ) => {
//    if (actionType === "COUNTER_PROPOSAL" && !counterRate) {
//      toast({
//        title: "Missing Information",
//        description: "Please enter a counter-proposed rate",
//        variant: "destructive",
//      });
//      return;
//    }
//    setAction(actionType);
//    setShowConfirmation(true);
//  };

//  const confirmAction = () => {
//    const formDTO = {
//      action: action,
//      counterRate: counterRate,
//      message: message,
//    };
//    const actionMessages = {
//      DEAL_APPROVED: "Deal approved and rate locked for the business",
//      DEAL_REJECTED: "Deal request rejected",
//      COUNTER_PROPOSAL: "Counter proposal sent to business",
//    };
//    const counterProposal = async () => {
//      try {
//        const res = await fetch(
//          `${BASE_URL}/api/v1/rate-deals/${dealId}/action`,
//          {
//            method: "POST",
//            headers: {
//              "Content-Type": "application/json",
//              Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify(formDTO),
//          },
//        );
//        const json = await res.json();

//        if (!res.ok || json.status !== true) {
//          throw new Error(json.message || "Create failed");
//        }
//        toast({
//          title: "Response Submitted",
//          description: actionMessages[action],
//        });
//        onResponse?.();
//        refetch?.();
//        setCounterRate("");
//        setMessage("");
//      } catch (error) {
//        toast({
//          title: "Failed",
//          description: error?.message || "Please try again",
//          variant: "destructive",
//        });
//      } finally {
//      }
//    };
//    counterProposal();
//  };

//  return (
//    <>
//      <Card className="shadow-card">
//        <CardContent className="p-6 space-y-6">
//          <h3 className="font-semibold text-lg">Review & Respond</h3>

//          <div className="space-y-4">
//            {/* Quick Actions */}
//            <div className="flex flex-wrap gap-3">
//              <Button
//                variant="default"
//                className="bg-success hover:bg-success/90"
//                onClick={() => handleAction("DEAL_APPROVED")}
//              >
//                <CheckCircle className="h-4 w-4 mr-2" />
//                Approve Deal
//              </Button>

//              <Button
//                variant="destructive"
//                onClick={() => handleAction("DEAL_REJECTED")}
//              >
//                <XCircle className="h-4 w-4 mr-2" />
//                Reject Deal
//              </Button>
//            </div>

//            {/* Counter Proposal Section */}
//            <div className="pt-4 border-t space-y-4">
//              <div className="flex items-center gap-2">
//                <MessageSquare className="h-5 w-5 text-primary" />
//                <h4 className="font-medium">Counter Proposal</h4>
//              </div>

//              <div className="space-y-4">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  <div className="space-y-2">
//                    <Label htmlFor="counterRate">Your Counter Rate</Label>
//                    <Input
//                      id="counterRate"
//                      type="number"
//                      step="0.01"
//                      placeholder="Enter counter rate"
//                      value={counterRate}
//                      onChange={(e) => setCounterRate(e.target.value)}
//                    />
//                    <p className="text-xs text-muted-foreground">
//                      Business requested: {requestedRate} {currency}
//                    </p>
//                  </div>

//                  <div className="space-y-2">
//                    <Label>Rate Comparison</Label>
//                    <div className="p-3 bg-muted/30 rounded-md">
//                      {counterRate && (
//                        <div className="space-y-1 text-sm">
//                          <div className="flex justify-between">
//                            <span className="text-muted-foreground">
//                              Requested:
//                            </span>
//                            <span className="font-medium">{requestedRate}</span>
//                          </div>
//                          <div className="flex justify-between">
//                            <span className="text-muted-foreground">
//                              Your Counter:
//                            </span>
//                            <span className="font-medium">{counterRate}</span>
//                          </div>
//                          <div className="flex justify-between pt-1 border-t">
//                            <span className="text-muted-foreground">
//                              Difference:
//                            </span>
//                            <span
//                              className={`font-medium ${parseFloat(counterRate) > parseFloat(requestedRate) ? "text-success" : "text-destructive"}`}
//                            >
//                              {(
//                                parseFloat(counterRate) -
//                                parseFloat(requestedRate)
//                              ).toFixed(4)}
//                            </span>
//                          </div>
//                        </div>
//                      )}
//                    </div>
//                  </div>
//                </div>

//                <div className="space-y-2">
//                  <Label htmlFor="message">
//                    Message to Business (Optional)
//                  </Label>
//                  <Textarea
//                    id="message"
//                    placeholder="Provide reasoning for your decision..."
//                    value={message}
//                    onChange={(e) => setMessage(e.target.value)}
//                    rows={3}
//                  />
//                </div>

//                <Button
//                  variant="outline"
//                  onClick={() => handleAction("COUNTER_PROPOSAL")}
//                  disabled={!counterRate}
//                >
//                  <MessageSquare className="h-4 w-4 mr-2" />
//                  Send Counter Proposal
//                </Button>
//              </div>
//            </div>
//          </div>
//        </CardContent>
//      </Card>

//      <ConfirmationDialog
//        open={showConfirmation}
//        onOpenChange={setShowConfirmation}
//        onConfirm={confirmAction}
//        title={`Confirm ${action === "DEAL_APPROVED" ? "Approval" : action === "DEAL_REJECTED" ? "Rejection" : "Counter Proposal"}`}
//        description={
//          action === "DEAL_APPROVED"
//            ? `Approve the requested rate of ${requestedRate} ${currency} for ${businessName}? This will lock the rate for the deal validity period.`
//            : action === "DEAL_REJECTED"
//              ? `Reject the deal request from ${businessName}? They will be notified of the rejection.`
//              : `Send counter proposal of ${counterRate} ${currency} to ${businessName}? They can accept or decline this rate.`
//        }
//        confirmText={
//          action === "DEAL_APPROVED"
//            ? "Approve Deal"
//            : action === "DEAL_REJECTED"
//              ? "Reject Deal"
//              : "Send Counter"
//        }
//        variant={action === "DEAL_REJECTED" ? "destructive" : "default"}
//      />
//    </>
//  );
//};

//export default DealResponseForm;



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
//   refetch?: () => any;
//   dealId: string; // this is actually the transaction ID
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
//     "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL" | null
//   >(null);
//   const [counterRate, setCounterRate] = useState("");
//   const [message, setMessage] = useState("");
//   const [showConfirmation, setShowConfirmation] = useState(false);

//   const handleAction = (
//     actionType: "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL",
//   ) => {
//     if (actionType === "COUNTER_PROPOSAL" && !counterRate) {
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
//     // Map action to API status
//     let status = "";
//     switch (action) {
//       case "DEAL_APPROVED":
//         status = "RATE_DEAL_APPROVED";
//         break;
//       case "DEAL_REJECTED":
//         status = "RATE_DEAL_REJECTED";
//         break;
//       case "COUNTER_PROPOSAL":
//         status = "RATE_DEAL_COUNTER_PROPOSAL";
//         break;
//     }

//     const body: any = {
//       status,
//       message: message || "",
//     };

//     if (action === "COUNTER_PROPOSAL" && counterRate) {
//       body.counterRate = parseFloat(counterRate);
//     }

//     try {
//       const res = await fetch(
//         // `${BASE_URL}/api/v1/transactions/${dealId}/rate-deal`,
//         `${BASE_URL}/api/v1/rate-deals/${dealId}/action`,
//         // api/v1/rate-deals/11/action
//         {
//           method: "Post",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         },
//       );

//       const json = await res.json();

//       if (!res.ok || json.status !== true) {
//         throw new Error(json.message || "Failed to submit response");
//       }

//       const actionMessages = {
//         DEAL_APPROVED: "Deal approved and rate locked for the business",
//         DEAL_REJECTED: "Deal request rejected",
//         COUNTER_PROPOSAL: "Counter proposal sent to business",
//       };

//       toast({
//         title: "Response Submitted",
//         description: actionMessages[action!],
//       });

//       onResponse?.();
//       refetch?.();
//       setCounterRate("");
//       setMessage("");
//     } catch (error: any) {
//       toast({
//         title: "Failed",
//         description: error?.message || "Please try again",
//         variant: "destructive",
//       });
//     } finally {
//       setShowConfirmation(false);
//     }
//   };

//   return (
//     <>
//       <Card className="shadow-card">
//         <CardContent className="p-6 space-y-6">
//           <h3 className="font-semibold text-lg">Review & Respond</h3>

//           <div className="space-y-4">
//             {/* Quick Actions */}
//             <div className="flex flex-wrap gap-3">
//               <Button
//                 variant="default"
//                 className="bg-success hover:bg-success/90"
//                 onClick={() => handleAction("DEAL_APPROVED")}
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Approve Deal
//               </Button>

//               <Button
//                 variant="destructive"
//                 onClick={() => handleAction("DEAL_REJECTED")}
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
//                       step="0.01"
//                       placeholder="Enter counter rate"
//                       value={counterRate}
//                       onChange={(e) => setCounterRate(e.target.value)}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Business requested: {requestedRate} {currency}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Rate Comparison</Label>
//                     <div className="p-3 bg-muted/30 rounded-md">
//                       {counterRate && (
//                         <div className="space-y-1 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">
//                               Requested:
//                             </span>
//                             <span className="font-medium">{requestedRate}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">
//                               Your Counter:
//                             </span>
//                             <span className="font-medium">{counterRate}</span>
//                           </div>
//                           <div className="flex justify-between pt-1 border-t">
//                             <span className="text-muted-foreground">
//                               Difference:
//                             </span>
//                             <span
//                               className={`font-medium ${parseFloat(counterRate) > parseFloat(requestedRate) ? "text-success" : "text-destructive"}`}
//                             >
//                               {(
//                                 parseFloat(counterRate) -
//                                 parseFloat(requestedRate)
//                               ).toFixed(4)}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">
//                     Message to Business (Optional)
//                   </Label>
//                   <Textarea
//                     id="message"
//                     placeholder="Provide reasoning for your decision..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     rows={3}
//                   />
//                 </div>

//                 <Button
//                   variant="outline"
//                   onClick={() => handleAction("COUNTER_PROPOSAL")}
//                   disabled={!counterRate}
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
//         title={`Confirm ${action === "DEAL_APPROVED" ? "Approval" : action === "DEAL_REJECTED" ? "Rejection" : "Counter Proposal"}`}
//         description={
//           action === "DEAL_APPROVED"
//             ? `Approve the requested rate of ${requestedRate} ${currency} for ${businessName}? This will lock the rate for the deal validity period.`
//             : action === "DEAL_REJECTED"
//               ? `Reject the deal request from ${businessName}? They will be notified of the rejection.`
//               : `Send counter proposal of ${counterRate} ${currency} to ${businessName}? They can accept or decline this rate.`
//         }
//         confirmText={
//           action === "DEAL_APPROVED"
//             ? "Approve Deal"
//             : action === "DEAL_REJECTED"
//               ? "Reject Deal"
//               : "Send Counter"
//         }
//         variant={action === "DEAL_REJECTED" ? "destructive" : "default"}
//       />
//     </>
//   );
// };

// export default DealResponseForm;




import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

type ActionType = "DEAL_APPROVED" | "DEAL_REJECTED" | "COUNTER_PROPOSAL";

interface DealResponseFormProps {
  refetch?: () => any;
  dealId: string;
  businessName: string;
  requestedRate: string;
  currency: string;
  onResponse?: () => void;
}

const DealResponseForm = ({
  refetch,
  dealId,
  businessName,
  requestedRate,
  currency,
  onResponse,
}: DealResponseFormProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const [action, setAction] = React.useState<ActionType | null>(null);
  const [counterRate, setCounterRate] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);

  const handleAction = (actionType: ActionType) => {
    if (actionType === "COUNTER_PROPOSAL" && !counterRate) {
      toast({
        title: "Missing Information",
        description: "Please enter a counter-proposed rate",
        variant: "destructive",
      });
      return;
    }
    setAction(actionType);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    if (!action) return;

    let status = "";
    switch (action) {
      case "DEAL_APPROVED":
        status = "APPROVED";
        break;
      case "DEAL_REJECTED":
        status = "REJECTED";
        break;
      case "COUNTER_PROPOSAL":
        status = "COUNTER_PROPOSAL";
        break;
    }

    const body: Record<string, any> = {
      action: status,
      message: message || "",
    };

    if (action === "COUNTER_PROPOSAL" && counterRate) {
      body.counterRate = parseFloat(counterRate);
    }

    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals/${dealId}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Failed to submit response");
      }

      const actionMessages: Record<ActionType, string> = {
        DEAL_APPROVED: "Deal approved and rate locked for the business",
        DEAL_REJECTED: "Deal request rejected",
        COUNTER_PROPOSAL: "Counter proposal sent to business",
      };

      toast({
        title: "Response Submitted",
        description: actionMessages[action],
      });

      onResponse?.();
      refetch?.();
      setCounterRate("");
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
    }
  };

  const requestedRateNum: number = parseFloat(String(requestedRate)) || 0;
  const counterRateNum: number = parseFloat(counterRate) || 0;
  const difference: number = counterRateNum - requestedRateNum;

  return (
    <>
      <Card className="shadow-card">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold text-lg">Review & Respond</h3>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                className="bg-success hover:bg-success/90"
                onClick={() => handleAction("DEAL_APPROVED")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Deal
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleAction("DEAL_REJECTED")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Deal
              </Button>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Counter Proposal</h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="counterRate">Your Counter Rate</Label>
                    <Input
                      id="counterRate"
                      type="number"
                      step="0.01"
                      placeholder="Enter counter rate"
                      value={counterRate}
                      onChange={(e) => setCounterRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Business requested: {requestedRate} {currency}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Rate Comparison</Label>
                    <div className="p-3 bg-muted/30 rounded-md">
                      {counterRate && (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Requested:
                            </span>
                            <span className="font-medium">{requestedRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Your Counter:
                            </span>
                            <span className="font-medium">{counterRate}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t">
                            <span className="text-muted-foreground">
                              Difference:
                            </span>
                            <span
                              className={`font-medium ${difference > 0 ? "text-success" : "text-destructive"}`}
                            >
                              {difference.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message to Business (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Provide reasoning for your decision..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleAction("COUNTER_PROPOSAL")}
                  disabled={!counterRate}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Counter Proposal
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmAction}
        title={`Confirm ${action === "DEAL_APPROVED" ? "Approval" : action === "DEAL_REJECTED" ? "Rejection" : "Counter Proposal"}`}
        description={
          action === "DEAL_APPROVED"
            ? `Approve the requested rate of ${requestedRate} ${currency} for ${businessName}? This will lock the rate for the deal validity period.`
            : action === "DEAL_REJECTED"
              ? `Reject the deal request from ${businessName}? They will be notified of the rejection.`
              : `Send counter proposal of ${counterRate} ${currency} to ${businessName}? They can accept or decline this rate.`
        }
        confirmText={
          action === "DEAL_APPROVED"
            ? "Approve Deal"
            : action === "DEAL_REJECTED"
              ? "Reject Deal"
              : "Send Counter"
        }
        variant={action === "DEAL_REJECTED" ? "destructive" : "default"}
      />
    </>
  );
};

export default DealResponseForm;