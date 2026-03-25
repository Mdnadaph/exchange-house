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
  beneficiaryName?: string;
  businessName?: string;

  complianceRules?: any[];
  complianceStatus?: string;
  convertedAmount?: number;
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
    PENDING_APPROVAL: {
      variant: "secondary",
      label: "Pending Approval",
      icon: Clock,
    },
    pending_payment: {
      variant: "destructive",
      label: "Pending Payment",
      icon: Wallet,
    },
    payment_verification: {
      variant: "secondary",
      label: "Payment Verification",
      icon: Clock,
    },
    PROCESSING: { variant: "destructive", label: "Processing", icon: Clock },
    FAILED: { variant: "destructive", label: "Failed", icon: AlertCircle },
    APPROVED: { variant: "default", label: "Approved", icon: CheckCircle },
    cancelled: { variant: "outline", label: "Cancelled", icon: AlertCircle },
    COMPLIANCE_REVIEW: {
      variant: "outline",
      label: "Compliance Review",
      icon: AlertCircle,
    },
  };
  return (
    statusMap[status] ?? { variant: "secondary", label: status, icon: Clock }
  );
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SINGLE: "bg-blue-100 text-blue-800",
    BULK: "bg-purple-100 text-purple-800",
  };
  return colors[type] ?? "bg-gray-100 text-gray-800";
};

const handleDownloadReceipt = (
  transaction: any,
  OperatorName?: string,
  currencyCode?: any,
) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${transaction.referenceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #000;
      padding: 20px;
    }

    .container {
      max-width: 900px;
      margin: auto;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .link {
      font-size: 12px;
      color: blue;
      cursor: pointer;
      text-decoration: underline;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .logo-section {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .logo {
      font-size: 22px;
      font-weight: bold;
    }

    .company-info {
      font-size: 12px;
      line-height: 1.4;
    }

    .title {
      text-align: center;
      font-weight: bold;
      margin: 10px 0;
      font-size: 14px;
    }

    .duplicate {
      text-align: right;
      font-weight: bold;
      color: gray;
    }

    .section {
      margin-top: 10px;
    }

    .flex {
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }

    .box {
      width: 48%;
    }

    .label {
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 5px;
    }

    .row {
      margin: 2px 0;
    }

    .amount {
      width:"100%"
      display: flex;
  justify-content: space-between;
  align-items: center;
    }

    .footer {
      margin-top: 20px;
      font-size: 10px;
      text-align: center;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      font-size: 12px;
    }

    @media print {
      body { padding: 0; }
    }
  </style>
</head>

<body>

<div class="container">
  <!-- Header -->
  <div class="header">
    <div class="logo-section">
      <div class="logo">WorkerAppz</div>
      <div class="company-info">
        ${transaction.branchName || ""}<br/>
        ${transaction.businessName || ""}<br/>
        Phone: ${transaction.phone || "-"}
      </div>
    </div>

    <div class="duplicate">
      DUPLICATE COPY<br/>
      ${transaction.referenceNumber}
    </div>
  </div>

  <!-- Title -->
  <div class="title">${transaction.branchName || ""} Receipt</div>

  <!-- Basic Info -->
  <div class="section">
    <div class="row"><b>Date:</b> ${transaction.date}</div>
    <div class="row"><b>Registration No:</b> ${transaction.referenceNumber}</div>
    <div class="row"><b>Purpose:</b> ${transaction.purpose || "-"}</div>
  </div>

  <!-- Main Content -->
  <div class="flex section">

    <!-- LEFT SIDE -->
    <div class="box">
      <div class="label">Remitter Details</div>
      <div class="row"><b>Name:</b> ${transaction.businessName}</div>
      <div class="row"><b>Phone:</b> ${transaction.businessPhone || "-"}</div>
      <div class="row"><b>Address:</b> ${transaction.address || "-"}</div>
    </div>

    <!-- RIGHT SIDE -->
    <div class="box">
      <div class="label">Beneficiary Details</div>
      <div class="row"><b>Name:</b> ${transaction.singleBeneficiary?.name}</div>
      <div class="row"><b>Phone:</b> ${transaction.singleBeneficiary?.phone || "-"}</div>
      <div class="row"><b>Address:</b> ${transaction.singleBeneficiary?.address || "-"}</div>
       <div class="row"><b>Address:</b> ${transaction.singleBeneficiary?.email || "-"}</div>

      <div class="label">Payment Details</div>
      <div class="row amount">PayIn Amount: ${transaction.convertedAmount} ${currencyCode}</div>
      <div class="row amount">Charges: ${transaction.fees} ${currencyCode}</div>
      <div class="row amount">VAT: 0</div>
      <div class="row amount"><b>Total Payable: ${transaction.totalDebit} ${currencyCode}</b></div>
      <div class="row amount">Exchange Rate: ${transaction.exchangeRate}</div>
      <div class="row amount"><b>Actual Payout Amount: ${transaction?.sourceAmount} ${transaction?.currency}</b></div>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    Thank you for using our service<br/>
    Terms & Conditions Apply
  </div>

  <!-- Signatures -->
  <div class="signatures">
    <div>Remitter Signature</div>
    <div>${OperatorName}</div>
    <div>Cashier</div>
  </div>

</div>

<script>
  window.onload = function() {
    window.print();
  }
</script>

</body>
</html>
`;

  const win = window.open("", "_blank", "width=900,height=900");

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
  console.log("transactionData", transaction);
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
                <DetailField
                  label="Processed"
                  value={transaction.processedDate}
                />
              )}
              <DetailField
                label="Reference"
                value={transaction.referenceNumber}
                mono
              />
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
              <DetailField
                label="Business Name"
                value={transaction.businessName}
                mono
              />
              <DetailField
                label="Beneficiary Name"
                value={transaction.beneficiaryName}
                mono
              />
              <DetailField
                label="Business ID"
                value={transaction.businessId}
                mono
              />
            </div>
          </section>

          <Separator />

          {/* compliance Rules */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              compliance Rules
            </p>

            <div className="space-y-4">
              {transaction.complianceRules &&
              transaction.complianceRules.length > 0 ? (
                transaction.complianceRules.map((rule: any, index: number) => (
                  <div
                    key={rule.ruleId || index}
                    className="bg-muted/30 rounded-xl p-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <DetailField
                        label="Rule Name"
                        value={rule.ruleName || "—"}
                      />
                      {/* <DetailField label="Rule ID" value={rule.ruleId} /> */}
                      <DetailField
                        label="Threshold Amount"
                        value={`${rule.thresholdAmount || 0} ${rule.currency || "USD"}`}
                      />
                      <DetailField label="Action" value={rule.action || "—"} />
                      <DetailField label="Status" value={rule.status || "—"} />
                      <DetailField label="Reason" value={rule.reason || "—"} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-muted/30 rounded-xl p-6 text-center">
                  <DetailField
                    label="Compliance Rules"
                    value="No rules triggered"
                  />
                </div>
              )}
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
              <DetailField
                label="Discount %"
                value={transaction.discountValue}
              />
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
