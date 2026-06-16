import { useEffect, useRef, useState } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  country: string | string[];
  branchId: number;
  branchName: string;
  businessEmail: string;
  businessPhone: string;
  status: string;
  kybStatus?: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED"; // Added
  monthlyLimit: number;
  dealValidityDays: number;
  supportedCurrencies: string[];
  createdDate: string;
  createdBy: string;
  profileImage: File;
  logoUrl: string;
  ubos: [];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  status: "verified" | "pending_review" | "rejected";
  documentId?: number;
  fileUrl?: string;
  documentNumber?: string;
  verified?: boolean | null;
  rejectionReason?: string;
}

interface KYBContextDocument {
  code: string;
  name: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  verified: boolean | null;
  rejectionReason?: string;
  document: {
    id: number;
    fileName: string;
    fileUrl: string;
    documentNumber?: string;
    fileSize?: number;
    uploadedAt: string | number[];
  } | null;
}

interface KYBContext {
  businessId: number;
  businessType: string;
  kybType: string;
  kybRuleName: string;
  kybStatus?: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: 0,
    companyName: "",
    profileImage: undefined,
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
    kybStatus: undefined, // Added
    monthlyLimit: 0,
    dealValidityDays: 0,
    supportedCurrencies: [],
    createdDate: "",
    createdBy: "",
    logoUrl: "",
    ubos: [],
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [documentNumber, setDocumentNumber] = useState("");
  const [expiryDate, setExpireDate] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documentsData, setDocumentsData] = useState([]);
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function for KYB Status color
  const getKybStatusColor = (status?: string): string => {
    if (!status) return "bg-gray-100 text-gray-800 border border-gray-200";

    const s = status.toUpperCase();
    if (s === "APPROVED")
      return "bg-green-100 text-green-800 border border-green-200";
    if (s === "PENDING")
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    if (s === "REJECTED")
      return "bg-red-100 text-red-800 border border-red-200";
    if (s === "NOT_STARTED")
      return "bg-blue-100 text-blue-800 border border-blue-200";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const loadDocumentsFromServer = async () => {
    if (!id || !token) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/api/business/${id}/kyb-context`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = res?.data?.data;
      if (!data?.documents) return;

      const uploadedDocs = data.documents.filter(
        (doc) => doc.uploaded && doc.document,
      );

      if (uploadedDocs.length === 0) {
        setDocuments([]);
        return;
      }

      const transformed: Document[] = uploadedDocs.map((doc) => {
        const docData = doc.document;

        let uploadDate = new Date().toISOString().split("T")[0];
        if (docData.uploadedAt) {
          if (typeof docData.uploadedAt === "string") {
            uploadDate = docData.uploadedAt.split(" ")[0];
          } else if (
            Array.isArray(docData.uploadedAt) &&
            docData.uploadedAt.length >= 3
          ) {
            const [y, m, d] = docData.uploadedAt;
            uploadDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          }
        }

        let fileSizeStr = "N/A";
        if (typeof docData.fileSize === "number") {
          const bytes = docData.fileSize;
          if (bytes < 1024) fileSizeStr = `${bytes} B`;
          else if (bytes < 1024 * 1024)
            fileSizeStr = `${(bytes / 1024).toFixed(1)} KB`;
          else fileSizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }

        let status: "verified" | "pending_review" | "rejected" =
          "pending_review";
        if (doc.verified === true) status = "verified";
        if (doc.verified === false) status = "rejected";

        return {
          id: `DOC-${docData.id}`,
          name: docData.fileName || doc.name,
          type: doc.name,
          uploadDate,
          uploadedBy: "Business",
          fileSize: fileSizeStr,
          status,
          documentId: docData.id,
          fileUrl: docData.fileUrl,
          documentNumber: docData.documentNumber,
          verified: doc.verified,
          rejectionReason: doc.rejectionReason || undefined,
        };
      });

      setDocuments(transformed);
    } catch (err) {
      console.error("Failed to reload documents", err);
    }
  };

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
        logoUrl: data?.logoUrl,
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
        kybStatus: data?.kybStatus, // Added - getting from this API
        monthlyLimit: data?.monthlyLimit || 0,
        dealValidityDays: data?.dealValidityDays || 0,
        supportedCurrencies: data?.supportedCurrencies || [],
        createdDate: data?.createdDate || "",
        createdBy: data?.createdBy || "",
        profileImage: data?.profileUrl || "",
        ubos: data?.ubos || [],
      });
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
  useEffect(() => {
    fetchBusinessProfile();
  }, [id, toast, token]);

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
        setDocumentsData(response?.data?.data?.documents || []);
        if (data?.documents) {
          setKybContext(data);

          const types = data.documents.map((doc) => doc.name);
          setDocumentTypes(types);

          await loadDocumentsFromServer();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load KYB context",
          variant: "destructive",
        });
      }
    };

    if (id && token) {
      fetchKYBContext();
    }
  }, [id, token]);

  const handleView = async (viewUrl?: string) => {
    if (!viewUrl) return;
    try {
      const response = await axios.get(viewUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Failed",
        description: "Could not open document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (viewUrl?: string, fileName?: string) => {
    if (!viewUrl || !fileName) return;
    try {
      const response = await axios.get(viewUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Failed",
        description: "Could not download document",
        variant: "destructive",
      });
    }
  };

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
      formData.append("documentType", selectedDoc.code);
      if (expiryDate) {
        formData.append("expiryDate", expiryDate);
      }
      if (documentNumber) {
        formData.append("documentNumber", documentNumber);
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
        const newDocument: Document = {
          id: `DOC-${String(documents.length + 1).padStart(3, "0")}`,
          name: selectedFile.name,
          type: documentType,
          uploadDate: new Date().toISOString().split("T")[0],
          uploadedBy: businessProfile.companyName,
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          status: "pending_review",
        };

        setDocuments([...documents, newDocument]);
        await loadDocumentsFromServer();

        setSelectedFile(null);
        setDocumentType("");
        setDocumentNumber("");
        setExpireDate("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  const handleUploadDocument = () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    const selectedDoc = kybContext?.documents.find(
      (doc) => doc.name === documentType,
    );

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

  const confirmUploadDocument = () => {
    setShowUploadConfirmation(false);
    uploadDocument();
  };

  const confirmSaveProfile = async () => {
    try {
      setIsSaving(true);

      const businessAddress = Array.isArray(businessProfile.country)
        ? businessProfile.country.join(", ")
        : businessProfile.country;

      const payload = {
        companyName: businessProfile.companyName,
        tradeLicense: businessProfile.tradeLicense,
        taxNumber: businessProfile.taxNumber,
        businessPhone: businessProfile.businessPhone,
        businessAddress: businessAddress,
      };
      const formData = new FormData();
      const payloadBlob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      formData.append("data", payloadBlob);
      formData.append("logo", businessProfile?.profileImage);
      const response = await axios.put(
        `${BASE_URL}/api/v3/business/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchBusinessProfile();
      if (response.data?.status) {
        setIsEditing(false);
        setShowSaveConfirmation(false);

        toast({
          title: "Profile Updated",
          description: "Your business profile has been updated successfully.",
        });
      } else {
        // throw new Error(response.data?.message || "Update failed");
        toast({
          title: "Error",
          description:
            response?.data?.message ||
            "Something went wrong while updating profile",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error?.response?.data?.message || "Failed to update business profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // preview
      setProfileImage(imageUrl);

      // optional: store file in your main state
      setBusinessProfile({
        ...businessProfile,
        profileImage: file,
      });
    }
  };

  const expiryDateRequired = documentsData?.find(
    (context) => context?.name == documentType,
  )?.expiryDateRequired;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading business profile...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-2 flex-wrap">
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
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setProfileImage(null);
                }}
              >
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
                <div className="relative">
                  {/* Hidden input */}
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {/* Clickable Image */}
                  {isEditing ? (
                    <label htmlFor="profileUpload" className="cursor-pointer">
                      <img
                        src={
                          profileImage
                            ? profileImage
                            : businessProfile?.logoUrl
                              ? businessProfile.logoUrl
                              : "https://i.fbcd.co/products/original/f8b30a80c3dd7846280debe018062435fb0273b9a391c2d05b1783ac5a473077.jpg"
                        }
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border"
                      />
                    </label>
                  ) : (
                    <img
                      src={
                        businessProfile?.logoUrl
                          ? businessProfile?.logoUrl
                          : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_incoming&w=740&q=80"
                      }
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Company Name</Label>
                  {isEditing ? (
                    <Input
                      disabled={businessProfile.kybStatus === "APPROVED"}
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
                  <Label className="text-muted-foreground">
                    Trade License Number
                  </Label>
                  {isEditing ? (
                    <Input
                      disabled={businessProfile.kybStatus === "APPROVED"}
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
                      disabled={businessProfile.kybStatus === "APPROVED"}
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
                  <p className="text-foreground font-medium">
                    {businessProfile.businessEmail}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    Company Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      disabled={businessProfile.kybStatus === "APPROVED"}
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
                  Country of Trade
                </Label>
                <p className="text-foreground font-medium">
                  {Array.isArray(businessProfile.country)
                    ? businessProfile.country.join(", ")
                    : businessProfile.country || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">KYB Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Updated KYB Status display using businessProfile.kybStatus */}

                <div className="flex justify-center py-4">
                  {businessProfile.kybStatus ? (
                    <Badge
                      className={`text-lg px-8 py-2.5 font-semibold shadow-sm ${getKybStatusColor(
                        businessProfile.kybStatus,
                      )}`}
                    >
                      {businessProfile.kybStatus.replace("_", " ")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-lg px-8 py-2.5">
                      <Clock className="h-4 w-4 mr-2" />
                      NOT STARTED
                    </Badge>
                  )}
                </div>

                {kybContext && (
                  <>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Business Type:
                        </span>
                        <span className="font-medium">
                          {kybContext.businessType}
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">KYB Type:</span>
                        <span className="font-medium">
                          {kybContext.kybType}
                        </span>
                      </div> */}
                      {/* <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Rule Applied:
                        </span>
                        <span className="font-medium">
                          {kybContext.kybRuleName}
                        </span>
                      </div> */}
                    </div>
                  </>
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
        <Card className="">
          <CardHeader>
            <CardTitle>UBO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessProfile?.ubos?.map((uboItem: any) => (
              <div className="w-full" key={uboItem?.uuid}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  <Card>
                    <CardContent className="p-4 flex gap-2 items-start ">
                      <p className="text-muted-foreground shrink-0">
                        UBO Type:
                      </p>
                      <p className="font-medium break-all min-w-0">
                        {uboItem?.uboType?.charAt(0)?.toUpperCase()}
                        {uboItem?.uboType?.slice(1)?.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>

                  {uboItem?.uboType == "INDIVIDUAL" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">
                          Full Name
                        </p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.fullName}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {uboItem?.uboType == "INDIVIDUAL" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">Email:</p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.email}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-4 flex gap-2 items-start">
                      <p className="text-muted-foreground shrink-0">
                        OwnerShip Percentage:
                      </p>
                      <p className="font-medium break-all min-w-0">
                        {uboItem?.ownershipPercentage}
                      </p>
                    </CardContent>
                  </Card>
                  {uboItem?.uboType == "INDIVIDUAL" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">
                          Contact Number:
                        </p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.contactNumber}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {uboItem?.uboType == "ORGANIZATION" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">
                          Organization Name:
                        </p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.organizationName}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-4 flex gap-2 items-start">
                      <p className="text-muted-foreground shrink-0">
                        Date Of Birth:
                      </p>
                      <p className="font-medium break-all min-w-0">
                        {uboItem?.dateOfBirth}
                      </p>
                    </CardContent>
                  </Card>
                  {uboItem?.uboType == "ORGANIZATION" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">
                          Registration Number:
                        </p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.registrationNumber}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {uboItem?.uboType == "ORGANIZATION" && (
                    <Card>
                      <CardContent className="p-4 flex gap-2 items-start">
                        <p className="text-muted-foreground shrink-0">
                          Phone Number:
                        </p>
                        <p className="font-medium break-all min-w-0">
                          {uboItem?.phoneNumber}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
                  placeholder="e.g., License No. 12345"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full"
                />

                <Label htmlFor="documentType">Document Type</Label>
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => {
                    setDocumentType(e.target.value);
                    setExpireDate("");
                  }}
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
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {expiryDateRequired && (
                  <div className="space-y-1">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      value={expiryDate}
                      id="expiryDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setExpireDate(e.target.value);
                      }}
                    />
                  </div>
                )}
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
                <div className="flex gap-3 items-center">
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setDocumentType("");
                      setDocumentNumber("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleUploadDocument} variant="default">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG. Maximum file size:
              20MB
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Business Documents ({documents.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No documents uploaded yet.
                </p>
              ) : (
                documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-md transition-all duration-200 border"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <FileText className="h-9 w-9 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                <h4 className="font-semibold text-base text-foreground truncate">
                                  {doc.name}
                                </h4>
                                {getStatusBadge(doc.status)}
                              </div>
                              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  {doc.type}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {doc.uploadDate}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  {doc.fileSize}
                                </span>
                                {doc.documentNumber && (
                                  <span className="font-medium">
                                    #{doc.documentNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-wrap mt-2 sm:mt-0">
                            {doc.fileUrl && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(doc.fileUrl)}
                                >
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(doc.fileUrl, doc.name)
                                  }
                                >
                                  <Download className="h-4 w-4 mr-1.5" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {doc.rejectionReason && (
                          <div className="mt-1 p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="h-4.5 w-4.5 text-destructive mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium text-destructive/90">
                                  Rejection Reason
                                </p>
                                <p className="text-destructive/80 mt-0.5">
                                  {doc.rejectionReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
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
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
        onConfirm={confirmSaveProfile}
        title="Confirm Profile Update"
        description="Are you sure you want to save these changes to your business profile?"
        confirmText="Save Changes"
      />

      <ConfirmationDialog
        open={showUploadConfirmation}
        onOpenChange={setShowUploadConfirmation}
        onConfirm={confirmUploadDocument}
        title="Confirm Document Upload"
        description="Upload this document for review?"
        confirmText="Upload Now"
      />
    </UserLayout>
  );
};

export default UserProfile;
