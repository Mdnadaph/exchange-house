import { useState } from "react";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import BASE_URL from "@/config/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Loader2 } from "lucide-react";

interface DocumentUploadModalProps {
  open: boolean;
  onClose: () => void;
  transactionReference: string;
  documentType;
  userRole:
    | "Exchange Admin"
    | "Branch Admin"
    | "Business Admin"
    | "Business User";
  userName: string;
  onSuccess?: (newDocument: any) => void;
}

const DocumentUploadModal = ({
  open,
  onClose,
  transactionReference,
  documentType,
  userRole,
  userName,
  onSuccess,
}: DocumentUploadModalProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("tt", transactionReference);
    console.log("dt", documentType);
    const documents = event.target.files?.[0];
    if (documents) {
      // Validate file size (20MB)
      if (documents.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 20MB",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(documents.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF, JPG, and PNG files are allowed",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }
      setSelectedFile(documents);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("documents", selectedFile);
    //formData.append("uploadedBy", userName);
    //formData.append("userRole", userRole);

    try {
      const url = `${BASE_URL}/api/v1/transactions/documents/${transactionReference}/append?type=${documentType}`;
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status) {
        // Construct the new document object for the UI
        const newDocument = response?.data?.data;
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });
        onSuccess?.(newDocument);
        onClose();
      } else {
        throw new Error(response?.data?.message || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description:
          error.response?.data?.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "upload-file",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="upload-file">
              Select File <span className="text-red-500">*</span>
            </Label>
            <Input
              id="upload-file"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Allowed: PDF, JPG, PNG (max size 20MB)
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
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
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
