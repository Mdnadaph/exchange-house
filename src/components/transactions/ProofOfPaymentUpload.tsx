import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Download,
  Eye,
  CheckCircle,
  Calendar,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ApiDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: string;
  uploadedBy: string;
}

interface ProofDocument {
  id: string;
  name: string;
  type: "PROOF_OF_PAYMENT" | "SUPPORTING_DOCUMENT" | "OTHER";
  uploadDate: string;
  uploadedBy: string;
  uploaderRole: "Exchange" | "Branch" | "Business";
  size: string;
  fileUrl: string;
  branchName?: string;
}

interface ProofOfPaymentUploadProps {
  transactionId: string;
  userRole: "Exchange" | "Branch" | "Business";
  userName: string;
  branchName?: string;
  onUploadComplete?: () => void;
  initialDocuments?: any[];
}

const ProofOfPaymentUpload = ({
  transactionId,
  userRole,
  userName,
  branchName,
  onUploadComplete,
  initialDocuments,
}: ProofOfPaymentUploadProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<
    "PROOF_OF_PAYMENT" | "SUPPORTING_DOCUMENT" | "OTHER" | ""
  >("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [activeDoc, setActiveDoc] = useState<ProofDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<
    "image" | "pdf" | "other"
  >("other");
  const [previewFileName, setPreviewFileName] = useState("");

  // Load documents from API
  const [documents, setDocuments] = useState<ProofDocument[]>([]);

  // Fetch documents for this transaction
  //useEffect(() => {
  //  const fetchDocuments = async () => {
  //    try {
  //      setIsLoading(true);
  //      const response = await axios.get(
  //        `${BASE_URL}/api/v1/transactions?type=SINGLE`,
  //        {
  //          headers: {
  //            Authorization: `Bearer ${cookies.token}`,
  //          },
  //        },
  //      );

  //      if (response?.data?.status && response?.data?.data) {
  //        // Find the specific transaction by ID
  //        //const transaction = response?.data?.data?.transactions.find(
  //        //  (tx: any) => tx.transactionId === transactionId,
  //        //);
  //        const transaction = response?.data?.data?.transactions.find(
  //          (tx: any) => tx.reference === transactionId,
  //        );

  //        if (transaction && transaction?.documents) {
  //          // Transform API documents to ProofDocument format
  //          const transformedDocuments: ProofDocument[] =
  //            transaction.documents.map((doc: ApiDocument) => ({
  //              id: doc.id.toString(),
  //              name: doc.fileName,
  //              type: determineDocumentType(doc.fileName),
  //              uploadDate: formatDateTime(doc.uploadedAt),
  //              uploadedBy: doc.uploadedBy,
  //              uploaderRole: determineUploaderRole(doc.uploadedBy),
  //              size: doc.fileSize
  //                ? `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB`
  //                : "Unknown size",
  //              fileUrl: doc.fileUrl,
  //              branchName: branchName,
  //            }));
  //          setDocuments(transformedDocuments);
  //        }
  //      }
  //    } catch (error) {
  //      console.error("Error fetching documents:", error);
  //      toast({
  //        title: "Error",
  //        description: "Failed to load documents",
  //        variant: "destructive",
  //      });
  //    } finally {
  //      setIsLoading(false);
  //    }
  //  };

  //  fetchDocuments();
  //}, [transactionId, cookies.token, branchName]);

  useEffect(() => {
    // If initialDocuments are passed from parent, use them directly
    if (initialDocuments && initialDocuments.length > 0) {
      const transformed = initialDocuments.map((doc: ApiDocument) => ({
        id: doc.id.toString(),
        name: doc.fileName,
        type: determineDocumentType(doc.fileName),
        uploadDate: formatDateTime(doc.uploadedAt),
        uploadedBy: doc.uploadedBy,
        uploaderRole: determineUploaderRole(doc.uploadedBy),
        size: doc.fileSize
          ? `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB`
          : "Unknown size",
        fileUrl: doc.fileUrl,
        branchName: branchName,
      }));
      setDocuments(transformed);
      return; // ✅ no API call needed
    }

    // Fallback: fetch from API (optional, can be removed if you always pass documents)
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/v1/transactions?type=SINGLE`,
          { headers: { Authorization: `Bearer ${cookies.token}` } },
        );
        // ... rest of your existing fetch logic
      } catch (error) {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [transactionId, cookies.token, branchName, initialDocuments]); // 👈 add initialDocuments dependency
  //const handleView = (doc: ProofDocument) => {
  //  setActiveDoc(doc);
  //  setOpenViewer(true);
  //};
  const handleView = async (doc: ProofDocument) => {
    try {
      setPreviewLoading(true);
      setPreviewFileName(doc.name);

      const response = await axios.get(doc.fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const blob = response.data;
      const blobUrl = URL.createObjectURL(blob);

      // Determine file type for the viewer
      if (doc.name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
        setPreviewFileType("image");
      } else if (doc.name.match(/\.pdf$/i)) {
        setPreviewFileType("pdf");
      } else {
        setPreviewFileType("other");
      }

      setPreviewUrl(blobUrl);
      setPreviewOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "Unable to load document preview.",
      });
    } finally {
      setPreviewLoading(false);
    }
  };
  const handleClosePreview = (open: boolean) => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl); // free memory
      setPreviewUrl(null);
    }
    setPreviewOpen(open);
  };
  const handleDownload = async (doc: ProofDocument) => {
    try {
      const response = await axios.get(doc.fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.name); // or extract filename from doc
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download document",
      });
    }
  };

  // Helper function to determine document type from file name
  const determineDocumentType = (
    fileName: string,
  ): "PROOF_OF_PAYMENT" | "SUPPORTING_DOCUMENT" | "OTHER" => {
    const lowerName = fileName.toLowerCase();
    if (
      lowerName.includes("mt103") ||
      lowerName.includes("swift") ||
      lowerName.includes("proof")
    ) {
      return "PROOF_OF_PAYMENT";
    } else if (
      lowerName.includes("license") ||
      lowerName.includes("trade") ||
      lowerName.includes("support")
    ) {
      return "SUPPORTING_DOCUMENT";
    }
    return "OTHER";
  };

  // Helper function to determine uploader role from email
  const determineUploaderRole = (
    uploadedBy: string,
  ): "Exchange" | "Branch" | "Business" => {
    if (uploadedBy.includes("@exchangehouse.com")) {
      return "Exchange";
    } else if (uploadedBy.includes("branch") || uploadedBy.includes("Branch")) {
      return "Branch";
    }
    return "Business";
  };

  // Helper function to format date time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 20MB",
          variant: "destructive",
        });
        event.target.value = ""; // Reset input
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF, JPG, and PNG files are allowed",
          variant: "destructive",
        });
        event.target.value = ""; // Reset input
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile || !documentType) return;

    try {
      setIsUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);
      formData.append("transactionId", transactionId);

      // Note: You'll need to adjust this URL to match your actual upload endpoint
      // This is an example - you need to check the actual upload endpoint
      const response = await axios.post(
        `${BASE_URL}/api/v1/transactions/${transactionId}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.status) {
        // Create new document object
        const newDocument: ProofDocument = {
          id: Date.now().toString(),
          name: selectedFile.name,
          type: documentType,
          uploadDate: formatDateTime(new Date().toISOString()),
          uploadedBy: userName,
          uploaderRole: userRole,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
          fileUrl: URL.createObjectURL(selectedFile), // Temporary URL for preview
          branchName: userRole === "Branch" ? branchName : undefined,
        };

        // Add to documents list
        setDocuments([...documents, newDocument]);
        setSelectedFile(null);
        setDocumentType("");

        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });

        onUploadComplete?.();
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description:
          error.response?.data?.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setShowConfirmation(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "PROOF_OF_PAYMENT":
        return "Proof of Payment";
      case "SUPPORTING_DOCUMENT":
        return "Supporting Document";
      case "OTHER":
        return "Other Document";
      default:
        return type;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "PROOF_OF_PAYMENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "SUPPORTING_DOCUMENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OTHER":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canUpload = userRole === "Exchange" || userRole === "Branch";

  return (
    <Card className="shadow-card">
      <Dialog open={previewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
          {/* Fixed Header */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="truncate">{previewFileName}</DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto p-4 bg-muted/10">
            {previewLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!previewLoading && previewUrl && (
              <>
                {/* Image Preview */}
                {previewFileType === "image" && (
                  <div className="flex justify-center items-center h-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                {/* PDF Preview */}
                {previewFileType === "pdf" && (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full min-h-[500px] border rounded"
                    title="PDF Preview"
                  />
                )}

                {/* Unsupported File Type */}
                {previewFileType === "other" && (
                  <div className="text-center text-muted-foreground py-8">
                    Preview not available for this file type.
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Transaction Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section - Only for Exchange/Branch */}
        {/*{canUpload && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground">
              Upload New Document
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proofType">Document Type *</Label>
                <select
                  id="proofType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  disabled={isUploading}
                >
                  <option value="">Select document type...</option>
                  <option value="PROOF_OF_PAYMENT">Proof of Payment</option>
                  <option value="SUPPORTING_DOCUMENT">
                    Supporting Document
                  </option>
                  <option value="OTHER">Other Document</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofFile">Select File *</Label>
                <Input
                  id="proofFile"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                      {selectedFile.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedFile(null)}
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleUpload}
                    variant="default"
                    size="sm"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Upload documents related to this transaction. Accepted formats:
              PDF, JPG, PNG. Max size: 20MB
            </p>
          </div>
        )}*/}

        {/* Existing Documents */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Uploaded Documents
          </h4>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents uploaded yet.</p>
              {canUpload && (
                <p className="text-xs mt-1">
                  Upload relevant documents for this transaction.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:shadow-sm transition-smooth"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h5 className="font-semibold text-sm truncate max-w-xs">
                              {doc.name}
                            </h5>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getDocumentTypeColor(doc.type)}`}
                            >
                              {getDocumentTypeLabel(doc.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate}
                            </span>
                            <span className="flex items-center gap-1">
                              Uploaded by: {doc.uploadedBy} ({doc.uploaderRole})
                              {doc.branchName && ` - ${doc.branchName}`}
                            </span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmUpload}
        title="Confirm Document Upload"
        description={`Are you sure you want to upload this ${getDocumentTypeLabel(documentType)}? This document will be visible to all parties involved.`}
        confirmText={isUploading ? "Uploading..." : "Upload Document"}
        isConfirming={isUploading}
      />
    </Card>
  );
};

export default ProofOfPaymentUpload;
