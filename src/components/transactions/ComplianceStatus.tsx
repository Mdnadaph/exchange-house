import { useToast } from "@/hooks/use-toast";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import BASE_URL from "@/config/config";
interface ComplianceStatusProps {
  open: boolean;
  onClose: () => void;
  transactionReference: string; // Required to know which transaction to update
  //currentStatus?: string; // Optional initial status
  onSuccess?: (status: string) => void;
}
const ComplianceStatus = ({
  open,
  onClose,
  transactionReference,
  onSuccess,
}: ComplianceStatusProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const [compliance, setCompliance] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplianceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompliance(e.target.value);
  };
  const handleSubmit = async () => {
    if (!compliance) {
      toast({
        title: "Error",
        description: "Please select a compliance status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/transactions/${transactionReference}/manual-compliance-status`,
        { complianceStatus: compliance },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status) {
        toast({
          title: "Success",
          description: "Compliance status updated successfully",
        });
        onSuccess?.(compliance);
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update compliance status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Change Compliance Status</DialogTitle>
          <DialogDescription>
            Update the compliance status for this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="complianceStatus">Select Compliance Status</Label>
            <select
              id="complianceStatus"
              value={compliance}
              onChange={handleComplianceChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              disabled={isSubmitting}
            >
              <option value="" disabled>
                -- Select status --
              </option>
              <option value="CLEAR">CLEAR</option>
              <option value="FLAGGED">FLAGGED</option>
              <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
              <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
              <option value="REPORTED">REPORTED</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!compliance || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplianceStatus;
