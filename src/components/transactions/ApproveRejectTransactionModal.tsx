import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ApproveRejectTransactionModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  fetchTransactions: () => void;
  reference: string;
  setReference: React.Dispatch<React.SetStateAction<string>>;
}

export default function ApproveRejectTransactionModal({
  setOpen,
  open,
  fetchTransactions,
  reference,
  setReference,
}: ApproveRejectTransactionModalProps) {
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const [actionType, setActionType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token;
  const actionTypeData = ["Mark As Complete", "Cancel", "Cancel And Refund"];
  const actionUIMap: Record<
    string,
    { title: string; placeholder: string; button: string }
  > = {
    "Mark As Complete": {
      title: "Complete Transaction",
      placeholder: "Add completion note...",
      button: "Mark as Complete",
    },
    Cancel: {
      title: "Cancel Transaction",
      placeholder: "Add cancellation reason...",
      button: "Cancel Transaction",
    },
    "Cancel And Refund": {
      title: "Cancel & Refund Transaction",
      placeholder: "Add refund reason...",
      button: "Cancel & Refund",
    },
  };

  const handleSubmit = async () => {
    if (!actionType) return;
    setLoading(true);
    const actionPayloadMap: Record<
      string,
      { approved: boolean; notes: string; fullRefund?: boolean }
    > = {
      "Mark As Complete": {
        approved: true,
        notes: note,
      },
      Cancel: {
        approved: false,
        notes: note,
        fullRefund: false,
      },
      "Cancel And Refund": {
        approved: false,
        fullRefund: true,
        notes: note,
      },
    };

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/transactions/${reference}/final-approval`,
        actionPayloadMap[actionType],
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
        setActionType("");
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

    // 👉 call API here
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setNote("");
          setActionType("");
          setOpen(false);
          setReference("");
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType ? actionUIMap[actionType]?.title : "Select Action"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select transaction Status" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {actionTypeData?.map((action, index) => (
                <SelectItem key={index} value={action}>
                  <div className="flex items-center justify-between w-full">
                    <span>{action}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder={
              actionType
                ? actionUIMap[actionType]?.placeholder
                : "Enter details..."
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
              variant={actionType === "Cancel" ? "destructive" : "default"}
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
