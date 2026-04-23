import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
type ActionType = "APPROVE" | "REJECT" | null;

interface ApproveRejectTransactionModalProps {
  actionType: ActionType;
  setActionType: React.Dispatch<React.SetStateAction<ActionType>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  fetchTransactions: () => void;
  reference: string;
  setReference: React.Dispatch<React.SetStateAction<string>>;
}
export default function ApproveRejectTransactionModal({
  actionType,
  setActionType,
  setOpen,
  open,
  fetchTransactions,
  reference,
  setReference,
}: ApproveRejectTransactionModalProps) {
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const handleSubmit = async () => {
    if (!actionType) return;
    setLoading(true);
    const payload = {
      approved: actionType == "APPROVE" ? true : false,
      notes: note,
    };
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/transactions/${reference}/final-approval`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        toast({
          title: "Success",
          description: res?.data?.message || "Final Approve success",
        });
        setNote("");
        setActionType(null);
        setOpen(false);
        setReference("");
        fetchTransactions();
      } else {
        toast({
          variant: "destructive",
          title: "Success",
          description: res?.data?.message || "Some thing wrong",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Success",
        description: error?.response?.data?.message || "Some thing wrong",
      });
    } finally {
      setLoading(false);
    }

    console.log("Submit:", payload);

    // 👉 call API here
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setNote("");
          setActionType(null);
          setOpen(false);
          setReference("");
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === "APPROVE"
              ? "Approve Transaction"
              : "Reject Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Textarea
            placeholder={
              actionType === "APPROVE"
                ? "Add approval note..."
                : "Add rejection reason..."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              variant={actionType === "REJECT" ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={!note || loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
