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

const UserProfile = () => {
  const { id } = useParams();
  console.log(id);

  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [businessProfile, setBusinessProfile] = useState({
    id: 0,
    companyName: "",
    legalForm: "",
    businessType: "",
    tradeLicense: "",
    taxNumber: "",
    country: "",
    branchId: 0,
    branchName: "",
    email: "",
    phone: "",
    status: "PENDING",
    monthlyLimit: 0,
    dealValidityDays: 0,
    supportedCurrencies: [] as string[],
    kybStatus: "pending_kyb",
    kybSubmitted: false,
    registeredDate: "",
    contactEmail: "",
    contactPhone: "",
    createdBy: "",
  });

  const [documents, setDocuments] = useState([
    {
      id: "DOC-001",
      name: "Trade License.pdf",
      type: "Trade License",
      uploadDate: "2023-05-15",
      uploadedBy: "Tech Solutions LLC",
      size: "2.4 MB",
      status: "verified",
    },
    {
      id: "DOC-002",
      name: "Tax Registration Certificate.pdf",
      type: "Tax Certificate",
      uploadDate: "2023-05-15",
      uploadedBy: "Tech Solutions LLC",
      size: "1.8 MB",
      status: "verified",
    },
    {
      id: "DOC-003",
      name: "Bank Statement - January 2024.pdf",
      type: "Bank Statement",
      uploadDate: "2024-01-10",
      uploadedBy: "Tech Solutions LLC",
      size: "3.2 MB",
      status: "pending_review",
    },
    {
      id: "DOC-004",
      name: "Board Resolution.pdf",
      type: "Board Resolution",
      uploadDate: "2023-06-20",
      uploadedBy: "Tech Solutions LLC",
      size: "1.5 MB",
      status: "verified",
    },
  ]);

  const documentTypes = [
    "Trade License",
    "Tax Certificate",
    "Bank Statement",
    "Board Resolution",
    "Memorandum of Association",
    "Signatory Authorization",
    "Proof of Address",
    "Other",
  ];

  const [documentType, setDocumentType] = useState("");

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

  const confirmUploadDocument = () => {
    if (!selectedFile || !documentType) return;

    const newDocument = {
      id: `DOC-${String(documents.length + 1).padStart(3, "0")}`,
      name: selectedFile.name,
      type: documentType,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: businessProfile.companyName,
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "pending_review",
    };

    setDocuments([...documents, newDocument]);
    setSelectedFile(null);
    setDocumentType("");

    toast({
      title: "Document Uploaded",
      description:
        "Your document has been uploaded successfully and is pending review.",
    });
  };

  useEffect(() => {
    const businessProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v3/business/${id}`);

        const data = response?.data?.data;
        console.log("business profile", response.data.data);

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
          email: data?.email || "",
          phone: data?.phone || "",
          status: data?.status || "PENDING",
          monthlyLimit: data?.monthlyLimit || 0,
          dealValidityDays: data?.dealValidityDays || 0,
          supportedCurrencies: data?.supportedCurrencies || [],
          kybStatus: data?.kybStatus || "pending_kyb",
          kybSubmitted: data?.kybSubmitted || false,
          registeredDate: data?.registeredDate || "",
          contactEmail: data?.contactEmail || "",
          contactPhone: data?.contactPhone || "",
          createdBy: data?.createdBy || "",
        });
      } catch (error) {
        console.error("Failed to fetch business profile", error);
      }
    };
    businessProfile();
  }, []);

  const handleUploadDocument = () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }
    setShowUploadConfirmation(true);
  };

  const confirmSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your business profile has been updated successfully.",
    });
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

  const getKybStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 text-lg px-3 py-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Verified
          </Badge>
        );
      case "pending_review":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1"
          >
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
          </Badge>
        );
      case "pending_kyb":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 text-lg px-3 py-1"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            KYB Required
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="text-lg px-3 py-1">
            <X className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleKYBSubmit = () => {
    setBusinessProfile((prev) => ({
      ...prev,
      kybStatus: "pending_review",
      kybSubmitted: true,
    }));
    toast({
      title: "KYB Submitted Successfully",
      description: "Your KYB application has been submitted for review.",
    });
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* KYB Status Alert */}
        {businessProfile.kybStatus === "pending_kyb" &&
          !businessProfile.kybSubmitted && (
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
          )}

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
                  <Label>Company Name</Label>
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
                  <Label>Business ID</Label>
                  <p className="text-foreground font-medium">
                    {businessProfile.id}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Trade License Number</Label>
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
                  <Label>Tax Number</Label>
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
                  <Label className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Company Email
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={businessProfile.email}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Company Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.phone}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {businessProfile.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
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
                <div className="flex justify-center">
                  {getKybStatusBadge(businessProfile.kybStatus)}
                </div>
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
                      {businessProfile.registeredDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Contact Person
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {/*<div className="space-y-2">
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.contactPerson}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          contactPerson: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="font-medium">
                      {businessProfile.contactPerson}
                    </p>
                  )}
                </div>*/}
                <div className="space-y-2">
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={businessProfile.contactEmail}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          contactEmail: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="font-medium">
                      {businessProfile.contactEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={businessProfile.contactPhone}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="font-medium">
                      {businessProfile.contactPhone}
                    </p>
                  )}
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
                <Label htmlFor="documentType">Document Type</Label>
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
              {documents.map((doc) => (
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
                        {doc.status === "pending_review" && (
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
        onConfirm={confirmSaveProfile}
        title="Confirm Profile Changes"
        description="Are you sure you want to save these changes to your business profile? This information will be updated in the system."
        confirmText="Save Changes"
      />

      <ConfirmationDialog
        open={showUploadConfirmation}
        onOpenChange={setShowUploadConfirmation}
        onConfirm={confirmUploadDocument}
        title="Confirm Document Upload"
        description={`Are you sure you want to upload this ${documentType} document? It will be sent for review by the Exchange House.`}
        confirmText="Upload Document"
      />
    </UserLayout>
  );
};

export default UserProfile;
