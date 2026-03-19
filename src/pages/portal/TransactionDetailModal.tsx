import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  Wallet,
  X,
} from "lucide-react";

interface TransactionDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: string;
  uploadedBy: string;
}

interface Transaction {
  id: string;
  branchName: string;
  businessId: string;
  beneficiary: string;
  amount: string;
  currency: string;
  exchangeRate: string;
  localAmount: string;
  localCurrency: string;
  status: string;
  type: "SINGLE" | "BULK";
  purpose: string;
  date: string;
  processedDate: string | null;
  referenceNumber: string;
  fees: string;
  feeResponsibility: string;
  branch: string;
  bulkCount?: number;
  failureReason?: string;
  documents?: TransactionDocument[];
  totalDebit: number;
  discountValue: string;
  discountAmount: string | String;
  beneficiaryName: string;
  businessName: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
      icon: React.ElementType;
    }
  > = {
    COMPLETED: { variant: "default", label: "Completed", icon: CheckCircle },
    PENDING_APPROVAL: { variant: "secondary", label: "Pending Approval", icon: Clock },
    pending_payment: { variant: "destructive", label: "Pending Payment", icon: Wallet },
    payment_verification: { variant: "secondary", label: "Payment Verification", icon: Clock },
    PROCESSING: { variant: "destructive", label: "Processing", icon: Clock },
    FAILED: { variant: "destructive", label: "Failed", icon: AlertCircle },
    APPROVED: { variant: "default", label: "Approved", icon: CheckCircle },
    cancelled: { variant: "outline", label: "Cancelled", icon: AlertCircle },
    COMPLIANCE_REVIEW: { variant: "outline", label: "Compliance Review", icon: AlertCircle },
  };
  return statusMap[status] ?? { variant: "secondary", label: status, icon: Clock };
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SINGLE: "bg-blue-100 text-blue-800",
    BULK: "bg-purple-100 text-purple-800",
  };
  return colors[type] ?? "bg-gray-100 text-gray-800";
};

/** Generates and triggers a PDF download using the browser's print dialog */
const handleDownloadReceipt = (transaction: Transaction) => {
  const status = getStatusBadge(transaction.status);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt – ${transaction.referenceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; }
    .receipt { max-width: 680px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); color: #fff; padding: 32px 36px; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { font-size: 13px; color: #a0aec0; margin-top: 4px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.15); color: #fff; margin-top: 10px; }
    .amount-block { background: #f8fafc; padding: 24px 36px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .amount-block .main { font-size: 28px; font-weight: 800; color: #0f3460; }
    .amount-block .sub { font-size: 14px; color: #64748b; margin-top: 4px; }
    .amount-block .right { text-align: right; }
    .section { padding: 20px 36px; border-bottom: 1px solid #f1f5f9; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; }
    .field label { font-size: 11px; color: #94a3b8; display: block; margin-bottom: 3px; }
    .field p { font-size: 13px; font-weight: 600; color: #1e293b; }
    .field p.mono { font-family: 'Courier New', monospace; font-size: 12px; }
    .failure { color: #dc2626 !important; }
    .footer { padding: 20px 36px; background: #f8fafc; text-align: center; }
    .footer p { font-size: 11px; color: #94a3b8; line-height: 1.6; }
    @media print {
      body { padding: 0; }
      .receipt { border: none; border-radius: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <h1>Payment Receipt</h1>
    <p>Transaction Reference: ${transaction.referenceNumber}</p>
    <span class="badge">${status.label}</span>
  </div>

  <div class="amount-block">
    <div>
      <div class="main">${transaction.currency.toUpperCase()} ${transaction.amount}</div>
      <div class="sub">${transaction.localCurrency} ${transaction.localAmount}</div>
    </div>
    <div class="right">
      <div class="sub">Total Debit</div>
      <div class="main" style="font-size:20px">AED ${transaction.totalDebit}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Transaction Info</div>
    <div class="grid">
      <div class="field"><label>Beneficiary</label><p>${transaction.beneficiary}</p></div>
      <div class="field"><label>Type</label><p>${transaction.type === "BULK" ? `Bulk (${transaction.bulkCount})` : "Single"}</p></div>
      <div class="field"><label>Purpose</label><p>${transaction.purpose || "—"}</p></div>
      <div class="field"><label>Submitted</label><p>${transaction.date}</p></div>
      ${transaction.processedDate ? `<div class="field"><label>Processed</label><p>${transaction.processedDate}</p></div>` : ""}
      <div class="field"><label>Status</label><p>${status.label}</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Branch & Business</div>
    <div class="grid">
      <div class="field"><label>Branch Name</label><p>${transaction.branchName || "—"}</p></div>
      <div class="field"><label>Business ID</label><p>${transaction.businessId || "—"}</p></div>
      <div class="field"><label>Business Name</label><p class="mono">${transaction.businessName || "—"}</p></div>
      <div class="field"><label>Beneficiary Name</label><p class="mono">${transaction.beneficiaryName || "—"}</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Financial Details</div>
    <div class="grid">
      <div class="field"><label>Exchange Rate</label><p>1 ${transaction.currency.toUpperCase()} = ${transaction.exchangeRate} ${transaction.localCurrency}</p></div>
      <div class="field"><label>Fee</label><p>AED ${transaction.fees}${transaction.feeResponsibility ? ` (Paid by: ${transaction.feeResponsibility})` : ""}</p></div>
      <div class="field"><label>Discount %</label><p>${transaction.discountValue}</p></div>
      <div class="field"><label>Discount Amount</label><p>${transaction.discountAmount === "0.00" ? "—" : `AED ${transaction.discountAmount}`}</p></div>
      ${transaction.failureReason ? `<div class="field" style="grid-column:span 2"><label>Failure Reason</label><p class="failure">${transaction.failureReason}</p></div>` : ""}
    </div>
  </div>

  <div class="footer">
    <p>This is an auto-generated receipt. Please retain for your records.<br/>Generated on ${new Date().toLocaleString()}</p>
  </div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=800,height=900");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
};

const DetailField = ({
  label,
  value,
  mono = false,
  danger = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  danger?: boolean;
}) => (
  <div className="space-y-1">
    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      {label}
    </span>
    <p
      className={`text-sm font-semibold ${mono ? "font-mono" : ""} ${danger ? "text-red-600" : "text-foreground"}`}
    >
      {value || "—"}
    </p>
  </div>
);

export default function TransactionDetailModal({
  transaction,
  open,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const status = getStatusBadge(transaction.status);
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* ── Header ── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {transaction.branchName && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-300" />
                  <span className="text-lg font-bold text-white">
                    {transaction.branchName}
                  </span>
                  {transaction.businessId && (
                    <span className="text-xs text-slate-400">
                      ({transaction.businessId})
                    </span>
                  )}
                </div>
              )}
              <h2 className="text-2xl font-extrabold tracking-tight">
                {transaction.beneficiary}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={status.variant}
                  className="flex items-center gap-1 bg-white/10 text-white border-white/20"
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}
                >
                  {transaction.type === "BULK"
                    ? `Bulk (${transaction.bulkCount})`
                    : "Single"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {transaction.id}
                {transaction.purpose && ` • ${transaction.purpose}`}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums">
                {transaction.currency.toUpperCase()} {transaction.amount}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {transaction.localCurrency} {transaction.localAmount}
              </p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-8 py-6 space-y-6">
          {/* Transaction Info */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Transaction Info
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 rounded-xl p-4">
              <DetailField
                label="Submitted"
                value={
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {transaction.date}
                  </span>
                }
              />
              {transaction.processedDate && (
                <DetailField label="Processed" value={transaction.processedDate} />
              )}
              <DetailField label="Reference" value={transaction.referenceNumber} mono />
              <DetailField label="Branch" value={transaction.branch} />
              <DetailField label="Purpose" value={transaction.purpose} />
              {transaction.failureReason && (
                <DetailField
                  label="Failure Reason"
                  value={transaction.failureReason}
                  danger
                />
              )}
            </div>
          </section>

          <Separator />

          {/* Business & Beneficiary */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Business &amp; Beneficiary
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 rounded-xl p-4">
              <DetailField label="Business Name" value={transaction.businessName} mono />
              <DetailField label="Beneficiary Name" value={transaction.beneficiaryName} mono />
              <DetailField label="Business ID" value={transaction.businessId} mono />
            </div>
          </section>

          <Separator />

          {/* Financial Details */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Financial Details
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 rounded-xl p-4">
              <DetailField
                label="Exchange Rate"
                value={`1 ${transaction.currency.toUpperCase()} = ${transaction.exchangeRate} ${transaction.localCurrency}`}
              />
              <DetailField
                label="Fee"
                value={
                  <>
                    AED {transaction.fees}
                    {transaction.feeResponsibility && (
                      <span className="text-xs text-muted-foreground block font-normal">
                        Paid by: {transaction.feeResponsibility}
                      </span>
                    )}
                  </>
                }
              />
              <DetailField
                label="Total Debit"
                value={`AED ${transaction.totalDebit}`}
              />
              <DetailField label="Discount %" value={transaction.discountValue} />
              <DetailField
                label="Discount Amount"
                value={
                  transaction.discountAmount === "0.00"
                    ? "—"
                    : `AED ${transaction.discountAmount}`
                }
              />
            </div>
          </section>

          {/* Documents */}
          {transaction.documents && transaction.documents.length > 0 && (
            <>
              <Separator />
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Documents ({transaction.documents.length})
                </p>
                <div className="space-y-2">
                  {transaction.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded by {doc.uploadedBy} •{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end gap-3 px-8 py-4 border-t bg-muted/20 rounded-b-lg">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => handleDownloadReceipt(transaction)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { handleDownloadReceipt };