import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Eye, CheckCircle, Calendar, X } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";

interface ProofDocument {
  id: string;
  name: string;
  type: "POD" | "SWIFT_MT103";
  uploadDate: string;
  uploadedBy: string;
  uploaderRole: "Exchange" | "Branch";
  size: string;
  branchName?: string;
}

interface ProofOfPaymentUploadProps {
  transactionId: string;
  userRole: "Exchange" | "Branch" | "Business";
  userName: string;
  branchName?: string;
  onUploadComplete?: () => void;
}

const ProofOfPaymentUpload = ({ 
  transactionId, 
  userRole, 
  userName,
  branchName,
  onUploadComplete 
}: ProofOfPaymentUploadProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<"POD" | "SWIFT_MT103" | "">("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock existing proof documents
  const [proofDocuments, setProofDocuments] = useState<ProofDocument[]>([
    {
      id: "PROOF-001",
      name: "SWIFT_MT103_TXN2024001.pdf",
      type: "SWIFT_MT103",
      uploadDate: "2024-01-16 15:00",
      uploadedBy: "Sarah Wilson",
      uploaderRole: "Exchange",
      size: "1.2 MB"
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const confirmUpload = () => {
    if (!selectedFile || !documentType) return;

    const newProof: ProofDocument = {
      id: `PROOF-${String(proofDocuments.length + 1).padStart(3, '0')}`,
      name: selectedFile.name,
      type: documentType,
      uploadDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      uploadedBy: userName,
      uploaderRole: userRole as "Exchange" | "Branch",
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      branchName: userRole === "Branch" ? branchName : undefined
    };

    setProofDocuments([...proofDocuments, newProof]);
    setSelectedFile(null);
    setDocumentType("");

    toast({
      title: "Proof of Payment Uploaded",
      description: "The document has been uploaded and is now available to the business.",
    });

    onUploadComplete?.();
  };

  const handleUpload = () => {
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

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "POD":
        return "Proof of Delivery";
      case "SWIFT_MT103":
        return "SWIFT MT103";
      default:
        return type;
    }
  };

  const canUpload = userRole === "Exchange" || userRole === "Branch";

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Proof of Payment Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section - Only for Exchange/Branch */}
        {canUpload && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground">Upload Proof Document</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proofType">Document Type</Label>
                <select
                  id="proofType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as "POD" | "SWIFT_MT103")}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select document type...</option>
                  <option value="POD">Proof of Delivery (POD)</option>
                  <option value="SWIFT_MT103">SWIFT MT103</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofFile">Select File</Label>
                <Input
                  id="proofFile"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button onClick={handleUpload} variant="default" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Upload SWIFT MT103 or Proof of Delivery documents. Accepted formats: PDF, JPG, PNG. Max size: 20MB
            </p>
          </div>
        )}

        {/* Existing Proof Documents */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Uploaded Documents ({proofDocuments.length})
          </h4>
          
          {proofDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No proof of payment documents uploaded yet.</p>
              {canUpload && (
                <p className="text-xs mt-1">Upload the SWIFT MT103 or POD once payment is confirmed.</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {proofDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-sm transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-sm">{doc.name}</h5>
                            <Badge variant="default" className="text-xs">
                              {getDocumentTypeLabel(doc.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate}
                            </span>
                            <span>
                              Uploaded by: {doc.uploadedBy} ({doc.uploaderRole})
                              {doc.branchName && ` - ${doc.branchName}`}
                            </span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        {canUpload && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setProofDocuments(proofDocuments.filter(d => d.id !== doc.id));
                              toast({
                                title: "Document Removed",
                                description: "The proof document has been removed.",
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
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
        title="Confirm Proof Upload"
        description={`Are you sure you want to upload this ${documentType === 'POD' ? 'Proof of Delivery' : 'SWIFT MT103'} document? This will make it available to the business for download.`}
        confirmText="Upload Document"
      />
    </Card>
  );
};

export default ProofOfPaymentUpload;
