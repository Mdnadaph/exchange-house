import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Download,
  Eye,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import BASE_URL from "@/config/config";
import { Badge } from "../ui/badge";

// ─── Types ────────────────────────────────────────────────────
interface ProofDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: string;
  uploadedBy: string;
  documentType?: string;
}

interface ProofOfPaymentUploadProps {
  transactionId: string;
  userRole: "Exchange" | "Branch" | "Business";
  userName: string;
  branchName?: string;
  initialDocuments?: ProofDocument[];
  onUploadComplete?: () => void;
}

// ─── Helpers ────────────────────────────────────────────
const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
};

// ─── Main Component ─────────────────────────────────────────────
const ProofOfPaymentUpload = ({
  transactionId,
  userRole,
  userName,
  branchName,
  initialDocuments = [],
  onUploadComplete,
}: ProofOfPaymentUploadProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [documents, setDocuments] = useState<ProofDocument[]>(initialDocuments);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    "view" | "download" | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = userRole === "Exchange" || userRole === "Branch";

  // ── Fetch Documents ───────────────────────────────────────────────────────
  const fetchDocuments = async () => {
    if (!token || !transactionId) return;

    try {
      setIsFetching(true);
      setFetchError(null);

      const res = await axios.get(
        `${BASE_URL}/api/v1/transactions?type=all&status=`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      );

      const transactions: any[] = res.data?.data?.transactions ?? [];
      const matchedTxn = transactions.find(
        (txn: any) => txn.reference === transactionId,
      );

      // ✅ ONLY show PROOF_OF_PAYMENT documents
      const proofDocs: ProofDocument[] = (matchedTxn?.documents ?? []).filter(
        (doc: any) => doc.documentType === "PROOF_OF_PAYMENT",
      );

      console.log(
        `📄 Found ${proofDocs.length} PROOF_OF_PAYMENT documents for transaction ${transactionId}`,
      );

      setDocuments(matchedTxn?.documents ?? []);
    } catch (err: any) {
      console.error(
        "Fetch Documents Error:",
        err.response?.data || err.message,
      );
      setFetchError("Could not load documents. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [transactionId, token]);

  // ── File Handling ─────────────────────────────────────────────────────────
  const validateAndSetFile = (file: File) => {
    const MAX_MB = 20;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `Maximum file size is ${MAX_MB}MB`,
        variant: "destructive",
      });
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF, JPG, and PNG files are accepted.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUploadClick = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile || !token) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("proof", selectedFile); // Important: "file" field
      if (userRole === "Branch" && branchName) {
        formData.append("branchName", branchName);
      }

      const uploadUrl = `${BASE_URL}/api/v1/transactions/${transactionId}/proof-of-payment`;

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File ? `${value.name} (${value.size} bytes)` : value,
        );
      }

      const res = await axios.post(uploadUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      if (res?.data?.status) {
        toast({
          title: "Upload Successful",
          description:
            res?.data?.message ||
            "Proof of payment document uploaded successfully.",
        });
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message ||
            "Proof of payment document uploaded successfully.",
          variant: "destructive",
        });
      }
      setSelectedFile(null);
      await fetchDocuments(); // Refresh list
      onUploadComplete?.();
    } catch (err: any) {
      console.error("Upload Error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message || "Upload failed. Please try again.";

      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ── View & Download Helpers ───────────────────────────────────────────────
  const fetchFileBlob = async (fileUrl: string): Promise<Blob> => {
    const response = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
      timeout: 30000,
    });
    return response.data;
  };

  const handleView = async (doc: ProofDocument) => {
    if (!doc.fileUrl || loadingDocId !== null) return;
    try {
      setLoadingDocId(doc.id);
      setLoadingAction("view");
      const blob = await fetchFileBlob(doc.fileUrl);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      toast({
        title: "View Failed",
        description: "Could not open the document.",
        variant: "destructive",
      });
    } finally {
      setLoadingDocId(null);
      setLoadingAction(null);
    }
  };

  const handleDownload = async (doc: ProofDocument) => {
    if (!doc.fileUrl || loadingDocId !== null) return;
    try {
      setLoadingDocId(doc.id);
      setLoadingAction("download");
      const blob = await fetchFileBlob(doc.fileUrl);
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      toast({
        title: "Download Started",
        description: `${doc.fileName} is downloading.`,
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not download the document.",
        variant: "destructive",
      });
    } finally {
      setLoadingDocId(null);
      setLoadingAction(null);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Proof of Payment Documents
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
        {canUpload && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
            <h4 className="font-semibold text-foreground">
              Upload Proof Document
            </h4>

            <div
              role="button"
              tabIndex={0}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !isUploading &&
                fileInputRef.current?.click()
              }
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed
                transition-colors cursor-pointer select-none
                ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/50"}
                ${isUploading ? "pointer-events-none opacity-60" : ""}
              `}
            >
              <CloudUpload
                className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
              />
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-medium text-foreground">
                  Click to browse
                </span>{" "}
                or drag & drop your file here
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG • Max 20 MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={isUploading}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleUploadClick}
                    size="sm"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading…" : "Upload"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents List - Only PROOF_OF_PAYMENT */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Transaction Documents {!isFetching && `(${documents?.length})`}
          </h4>

          {isFetching && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading documents...
            </div>
          )}

          {!isFetching && fetchError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{fetchError}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={fetchDocuments}
              >
                Retry
              </Button>
            </div>
          )}

          {!isFetching && !fetchError && documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">
                No proof of payment documents uploaded yet.
              </p>
              {canUpload && (
                <p className="text-xs mt-1">
                  Upload proof once payment is confirmed.
                </p>
              )}
            </div>
          )}

          {!isFetching && !fetchError && documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc) => {
                const isThisLoading = loadingDocId === doc.id;
                const isViewLoading = isThisLoading && loadingAction === "view";
                const isDownloadLoading =
                  isThisLoading && loadingAction === "download";

                return (
                  <Card
                    key={doc.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-8 w-8 text-primary shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex gap-2 items-center">
                              <p className="font-medium truncate">
                                {doc.fileName}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {doc?.documentType}
                              </Badge>
                            </div>

                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 mt-1">
                              <span>{formatDate(doc.uploadedAt)}</span>
                              {doc.uploadedBy && (
                                <span>By: {doc.uploadedBy}</span>
                              )}
                              <span>{formatFileSize(doc.fileSize)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(doc)}
                            disabled={loadingDocId !== null}
                          >
                            {isViewLoading ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4 mr-1" />
                            )}
                            {isViewLoading ? "Opening…" : "View"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            disabled={loadingDocId !== null}
                          >
                            {isDownloadLoading ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            {isDownloadLoading ? "Downloading…" : "Download"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={async () => {
          setShowConfirmation(false);
          await confirmUpload();
        }}
        title="Confirm Upload"
        description={`Upload "${selectedFile?.name}"?`}
        confirmText="Upload"
      />
    </Card>
  );
};

export default ProofOfPaymentUpload;
