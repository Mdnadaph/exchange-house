import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function ApproveRejectTransactionModal({
  actionType,
  setActionType,
  setOpen,
  open,
}: any) {
  const [note, setNote] = useState("");
  const handleSubmit = () => {
    if (!actionType) return;

    const payload = {
      action: actionType,
      note,
    };

    console.log("Submit:", payload);

    // 👉 call API here

    setNote("");
    setActionType(null);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === "APPROVE" ? "Approve Deal" : "Reject Deal"}
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
              disabled={!note}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
