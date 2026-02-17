import { useEffect, useState } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BASE_URL from "@/config/config";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  Edit,
  Save,
  X,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import KYBInitiationForm from "@/components/kyb/KYBInitiationForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

interface BusinessProfile {
  id: number;
  companyName: string;
  legalForm: string;
  businessType: string;
  tradeLicense: string;
  taxNumber: string;
  country: string;
  branchId: number;
  branchName: string;
  businessEmail: string;
  businessPhone: string;
  status: string;
  monthlyLimit: number;
  dealValidityDays: number;
  supportedCurrencies: string[];
  createdDate: string;
  createdBy: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  status: "verified" | "pending_review" | "rejected";
  // Optional fields from KYB context
  documentId?: number;
  fileUrl?: string;
  documentNumber?: string;
  verified?: boolean | null;
}

interface KYBContextDocument {
  code: string;
  name: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  verified: boolean | null;
  document: any | null;
}

interface KYBContext {
  businessId: number;
  businessType: string;
  kybType: string;
  kybRuleName: string;
  documents: KYBContextDocument[];
}

const UserProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [kybContext, setKybContext] = useState<KYBContext | null>(null);

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: 0,
    companyName: "",
    legalForm: "",
    businessType: "",
    tradeLicense: "",
    taxNumber: "",
    country: "",
    branchId: 0,
    branchName: "",
    businessEmail: "",
    businessPhone: "",
    status: "PENDING",
    monthlyLimit: 0,
    dealValidityDays: 0,
    supportedCurrencies: [],
    createdDate: "",
    createdBy: "",
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [documentNumber, setDocumentNumber] = useState("");

  const [cookie] = useCookies(["token"]);
  const token = cookie.token;
  // Fetch business profile
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v3/business/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response?.data?.data;
        if (!data) {
          toast({
            title: "Error",
            description: "No data received from server",
            variant: "destructive",
          });
          return;
        }

        setBusinessProfile({
          id: data?.id || 0,
          companyName: data?.companyName || "",
          legalForm: data?.legalForm || "",
          businessType: data?.businessType || "",
          tradeLicense: data?.tradeLicense || "",
          taxNumber: data?.taxNumber || "",
          country: data?.country || "",
          branchId: data?.branchId || 0,
          branchName: data?.branchName || "",
          businessEmail: data?.businessEmail || "",
          businessPhone: data?.businessPhone || "",
          status: data?.status || "PENDING",
          monthlyLimit: data?.monthlyLimit || 0,
          dealValidityDays: data?.dealValidityDays || 0,
          supportedCurrencies: data?.supportedCurrencies || [],
          createdDate: data?.createdDate || [],
          createdBy: data?.createdBy || "",
        });

        // If there are documents in the response, set them
        //if (data?.documents && Array.isArray(data.documents)) {
        //  setDocuments(data.documents);
        //}
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load business profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [id, toast]);

  // Fetch KYB context for document types AND uploaded documents
  useEffect(() => {
    const fetchKYBContext = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/business/${id}/kyb-context`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response?.data?.data;
        if (data?.documents) {
          setKybContext(data);

          // Extract document names from KYB context for the dropdown
          const types = data.documents.map(
            (doc: KYBContextDocument) => doc.name,
          );
          setDocumentTypes(types);

          // Extract uploaded documents from KYB context and set to documents state
          const uploadedDocs = data.documents.filter(
            (doc: KYBContextDocument) => doc.uploaded && doc.document,
          );

          if (uploadedDocs.length > 0) {
            const transformedDocuments: Document[] = uploadedDocs.map(
              (doc: KYBContextDocument, index: number) => {
                const docData = doc.document!;

                // Format uploaded date
                let uploadDate = new Date().toISOString().split("T")[0];
                if (
                  docData.uploadedAt &&
                  Array.isArray(docData.uploadedAt) &&
                  docData.uploadedAt.length >= 3
                ) {
                  const [year, month, day] = docData.uploadedAt;
                  uploadDate = `${year}-${month
                    .toString()
                    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                }

                // Format file size from bytes to human readable format
                let fileSizeStr = "N/A";
                if (docData.fileSize) {
                  const bytes = Number(docData.fileSize);
                  if (!isNaN(bytes)) {
                    if (bytes < 1024) {
                      fileSizeStr = `${bytes} B`;
                    } else if (bytes < 1024 * 1024) {
                      fileSizeStr = `${(bytes / 1024).toFixed(1)} KB`;
                    } else {
                      fileSizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                    }
                  }
                }

                return {
                  id: `DOC-${String(docData.id).padStart(3, "0")}`,
                  name: docData.fileName || doc.name,
                  type: doc.name,
                  uploadDate: uploadDate,
                  uploadedBy: "Business",
                  fileSize: fileSizeStr, // Use the formatted string here
                  status:
                    doc.verified === true
                      ? "verified"
                      : doc.verified === false
                        ? "pending_review"
                        : "pending_review",
                  documentId: docData.id,
                  fileUrl: docData.fileUrl,
                  documentNumber: docData.documentNumber,
                  verified: doc.verified,
                };
              },
            );

            setDocuments(transformedDocuments);
          } else {
            toast({
              title: "Error",
              description: "No uploaded documents found in KYB context",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        toast({ title: "Error", description: error, variant: "destructive" });
      }
    };

    if (id) {
      fetchKYBContext();
    }
  }, [id]);

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

  const uploadDocument = async () => {
    if (!selectedFile || !documentType || !id) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the document from KYB context to get the CODE
      const selectedDoc = kybContext?.documents.find(
        (doc) => doc.name === documentType,
      );

      if (!selectedDoc) {
        toast({
          title: "Document Type Error",
          description: `Could not find document type "${documentType}" in KYB rules`,
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      // CORRECT: Use the document CODE, not the name
      // The API expects the code like "TRADE_LICENSE", "MEMORANDUM_OF_ASSOCIATION", etc.
      formData.append("documentType", selectedDoc.code); // This is the key fix!

      // Add documentNumber if provided
      if (documentNumber) {
        formData.append("documentNumber", documentNumber);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${BASE_URL}/api/business/${id}/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        // Add the new document to the list
        const newDocument: Document = {
          id: `DOC-${String(documents.length + 1).padStart(3, "0")}`,
          name: selectedFile.name,
          type: documentType, // Keep the display name
          uploadDate: new Date().toISOString().split("T")[0],
          uploadedBy: businessProfile.companyName,
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          status: "pending_review",
        };

        setDocuments([...documents, newDocument]);
        setSelectedFile(null);
        setDocumentType("");
        setDocumentNumber("");

        toast({
          title: "Document Uploaded",
          description:
            response.data.message ||
            "Document uploaded successfully and is pending review.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: response.data.message || "Upload failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description:
          error.response?.data?.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const confirmUploadDocument = () => {
    setShowUploadConfirmation(false);
    uploadDocument();
  };

  //  if (!selectedFile || !documentType) {
  //    toast({
  //      title: "Missing Information",
  //      description: "Please select a file and document type",
  //      variant: "destructive",
  //    });
  //    return;
  //  }
  //  setShowUploadConfirmation(true);
  //};
  const handleUploadDocument = () => {
    // Find the corresponding KYB document
    const selectedDoc = kybContext?.documents.find(
      (doc) => doc.name === documentType,
    );

    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoc?.code) {
      toast({
        title: "Document Type Error",
        description: "Selected document type is not valid",
        variant: "destructive",
      });
      return;
    }

    setShowUploadConfirmation(true);
  };

  const confirmSaveProfile = async () => {
    try {
      // Update business profile API call would go here
      // For now, we'll just update the local state
      setIsEditing(false);
      setShowSaveConfirmation(false);

      toast({
        title: "Profile Updated",
        description: "Your business profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update business profile",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getKybStatusBadge = () => {
    // Calculate KYB status based on uploaded documents
    if (!kybContext) {
      return (
        <Badge variant="outline" className="text-lg px-3 py-1">
          <Clock className="h-4 w-4 mr-1" />
          Loading...
        </Badge>
      );
    }

    const allRequiredUploaded = kybContext.documents
      .filter((doc) => doc.required)
      .every((doc) => doc.uploaded && doc.verified);

    const anyUploaded = kybContext.documents.some((doc) => doc.uploaded);
    const anyPendingReview = kybContext.documents.some(
      (doc) => doc.uploaded && !doc.verified,
    );

    if (allRequiredUploaded) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 text-lg px-3 py-1"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Verified
        </Badge>
      );
    } else if (anyPendingReview) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1"
        >
          <Clock className="h-4 w-4 mr-1" />
          Pending Review
        </Badge>
      );
    } else if (anyUploaded) {
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 text-lg px-3 py-1"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          In Progress
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 text-lg px-3 py-1"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          KYB Required
        </Badge>
      );
    }
  };

  const handleKYBSubmit = () => {
    toast({
      title: "KYB Submitted Successfully",
      description: "Your KYB application has been submitted for review.",
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return date.split(" ")[0];
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading business profile...</p>
        </div>
      </UserLayout>
    );
  }
  console.log("businessProfile", businessProfile);
  return (
    <UserLayout>
      <div className="space-y-8">
        {/* KYB Status Alert */}
        {/* {kybContext &&
          kybContext.documents
            .filter((doc) => doc.required)
            .some((doc) => !doc.uploaded) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900">
                      KYB Verification Required
                    </h3>
                    <p className="text-sm text-orange-800 mt-1">
                      Please complete your KYB (Know Your Business) verification
                      to start using all platform features.
                    </p>
                    <KYBInitiationForm
                      trigger={
                        <Button variant="default" size="sm" className="mt-3">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Complete KYB Verification
                        </Button>
                      }
                      onSubmit={handleKYBSubmit}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}

        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Business Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your business information and documents
            </p>
          </div>
          {!isEditing ? (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => setShowSaveConfirmation(true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Company Name</Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.companyName}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          companyName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.companyName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Business ID</Label>
                  <p className="text-foreground font-medium">
                    {businessProfile.id}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Trade License Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.tradeLicense}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          tradeLicense: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.tradeLicense}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tax Number</Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.taxNumber}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          taxNumber: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.taxNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    Company Email
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={businessProfile.businessEmail}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          businessEmail: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.businessEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    Company Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.businessPhone}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          businessPhone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.businessPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  Business Address
                </Label>
                {isEditing ? (
                  <Textarea
                    value={businessProfile.country}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        country: e.target.value,
                      })
                    }
                    rows={2}
                  />
                ) : (
                  <p className="text-foreground font-medium">
                    {businessProfile.country}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">KYB Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">{getKybStatusBadge()}</div>
                {kybContext && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Business Type:
                      </span>
                      <span className="font-medium">
                        {kybContext.businessType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">KYB Type:</span>
                      <span className="font-medium">{kybContext.kybType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Rule Applied:
                      </span>
                      <span className="font-medium">
                        {kybContext.kybRuleName}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Registered Branch:
                    </span>
                    <span className="font-medium">
                      {businessProfile.branchName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Registration Date:
                    </span>
                    <span className="font-medium">
                      {formatDate(businessProfile?.createdDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created By</Label>
                  <p className="font-medium">{businessProfile.createdBy}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Monthly Limit</Label>
                  <p className="font-medium">
                    ${businessProfile.monthlyLimit.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Deal Validity Days
                  </Label>
                  <p className="font-medium">
                    {businessProfile.dealValidityDays} days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload New Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  type="text"
                  required
                  placeholder="e.g., License No. 12345"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full"
                />

                <Label htmlFor="documentType">Document Type</Label>
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => {
                    const docInfo = kybContext?.documents.find(
                      (d) => d.name === type,
                    );
                    return (
                      <option key={type} value={type}>
                        {type} {docInfo?.code ? `(${docInfo.code})` : ""}{" "}
                        {docInfo?.required ? "- Required" : "- Optional"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUpload">Select File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button onClick={handleUploadDocument} variant="default">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG. Maximum file size:
              20MB
            </p>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Business Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No documents uploaded yet.
                </p>
              ) : (
                documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">
                                {doc.name}
                              </h4>
                              {getStatusBadge(doc.status)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {doc.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.uploadDate}
                              </span>
                              <span>{doc.fileSize}</span>
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
                          {doc.status === "pending_review" && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={showUploadConfirmation}
        onOpenChange={setShowUploadConfirmation}
        onConfirm={confirmUploadDocument}
        title="Confirm Document Upload"
        description={`Are you sure you want to upload this ${documentType} document (Code: ${
          kybContext?.documents.find((doc) => doc.name === documentType)
            ?.code || "N/A"
        })${
          documentNumber ? ` with number: ${documentNumber}` : ""
        }? It will be sent for review by the Exchange House.`}
        confirmText="Upload Document"
      />
    </UserLayout>
  );
};

export default UserProfile;
