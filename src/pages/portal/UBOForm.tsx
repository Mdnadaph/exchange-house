import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

interface UBOFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface DocumentData {
  id: string;
  idType: string;
  expireDate: string;
  issuedCountry: string;
  docs: File | null;
}

interface UBOFormData {
  uboType: string;
  ownershipPercentage: string;
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  address: string;
  email: string;
  organizationName: string;
  phoneNumber: string;
  registrationNumber: string;
  documentData: DocumentData[];
}

const initialFormData: UBOFormData = {
  uboType: "",
  ownershipPercentage: "",
  fullName: "",
  dateOfBirth: "",
  contactNumber: "",
  address: "",
  email: "",
  organizationName: "",
  phoneNumber: "",
  registrationNumber: "",
  documentData: [
    {
      id: "",
      idType: "",
      expireDate: "",
      issuedCountry: "",
      docs: null,
    },
  ],
};

const UBOForm = ({ open, onOpenChange, onSuccess }: UBOFormDialogProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [formData, setFormData] = useState<UBOFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // ─── Handlers ────────────────────────────────────────────────

  const handleFieldChange = (field: keyof UBOFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`ubo_${field}`];
      return newErrors;
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      uboType: value,
      fullName: "",
      dateOfBirth: "",
      contactNumber: "",
      email: "",
      organizationName: "",
      phoneNumber: "",
      registrationNumber: "",
      documentData: [
        {
          id: "",
          idType: "",
          expireDate: "",
          issuedCountry: "",
          docs: null,
        },
      ],
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors["ubo_uboType"];
      return newErrors;
    });
  };

  const handleDocumentChange = (
    docIndex: number,
    field: keyof DocumentData,
    value: any,
  ) => {
    const updatedDocs = [...formData.documentData];
    updatedDocs[docIndex] = { ...updatedDocs[docIndex], [field]: value };
    setFormData((prev) => ({ ...prev, documentData: updatedDocs }));
    // Clear error for this specific document field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`ubo_doc_${docIndex}_${field}`];
      return newErrors;
    });
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documentData: [
        ...prev.documentData,
        {
          id: "",
          idType: "",
          expireDate: "",
          issuedCountry: "",
          docs: null,
        },
      ],
    }));
  };

  const removeDocument = (docIndex: number) => {
    if (formData.documentData.length <= 1) return;
    const updatedDocs = [...formData.documentData];
    updatedDocs.splice(docIndex, 1);
    setFormData((prev) => ({ ...prev, documentData: updatedDocs }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // ─── Validation ──────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const data = formData;

    // Common
    if (!data.uboType) newErrors["ubo_uboType"] = "UBO Type is required";
    if (!data.ownershipPercentage)
      newErrors["ubo_ownershipPercentage"] = "Ownership % is required";
    else if (+data.ownershipPercentage <= 0 || +data.ownershipPercentage > 100)
      newErrors["ubo_ownershipPercentage"] = "Must be between 1 and 100";
    if (!data.address) newErrors["ubo_address"] = "Address is required";

    // Individual
    if (data.uboType === "INDIVIDUAL") {
      if (!data.fullName) newErrors["ubo_fullName"] = "Full Name is required";
      if (!data.dateOfBirth)
        newErrors["ubo_dateOfBirth"] = "Date of Birth is required";
      if (!data.contactNumber)
        newErrors["ubo_contactNumber"] = "Contact Number is required";
      if (!data.email) newErrors["ubo_email"] = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(data.email))
        newErrors["ubo_email"] = "Invalid email format";
    }

    // Organization
    if (data.uboType === "ORGANIZATION") {
      if (!data.organizationName)
        newErrors["ubo_organizationName"] = "Organization Name is required";
      if (!data.phoneNumber)
        newErrors["ubo_phoneNumber"] = "Phone Number is required";
      if (!data.registrationNumber)
        newErrors["ubo_registrationNumber"] = "Registration Number is required";
    }

    // Documents
    data.documentData.forEach((doc, docIndex) => {
      if (!doc.id)
        newErrors[`ubo_doc_${docIndex}_id`] = "Document ID is required";
      if (!doc.idType)
        newErrors[`ubo_doc_${docIndex}_idType`] = "ID Type is required";
      if (!doc.expireDate)
        newErrors[`ubo_doc_${docIndex}_expireDate`] = "Expire Date is required";
      if (!doc.issuedCountry)
        newErrors[`ubo_doc_${docIndex}_issuedCountry`] =
          "Issued Country is required";
      if (!doc.docs)
        newErrors[`ubo_doc_${docIndex}_docs`] = "Document file is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ──────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const apiFormData = new FormData();

      // Build UBO payload without documents
      const { documentData, ...uboPayload } = formData;
      const uboWithDocuments = {
        ...uboPayload,
        documents: documentData.map((doc) => ({
          documentType: doc.idType,
          documentNumber: doc.id,
          issuedCountry: doc.issuedCountry,
          expiryDate: doc.expireDate,
        })),
      };

      apiFormData.append(
        "ubos",
        new Blob([JSON.stringify(uboWithDocuments)], {
          type: "multipart/form-data",
        }),
      );

      // Append each document file
      formData.documentData.forEach((doc) => {
        if (doc.docs instanceof File) {
          apiFormData.append("documents", doc.docs);
        }
      });

      const response = await axios.post(
        `${BASE_URL}/api/v3/business/ubos`,
        apiFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        toast({
          title: "Success",
          description: "UBO added successfully.",
        });
        onOpenChange(false);
        resetForm();
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add UBO.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add UBO.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Ultimate Beneficial Owner (UBO)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* UBO Type */}
          <div className="space-y-1">
            <Label>
              UBO Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.uboType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
              </SelectContent>
            </Select>
            {errors["ubo_uboType"] && (
              <p className="text-red-500 text-xs">{errors["ubo_uboType"]}</p>
            )}
          </div>

          {/* Common fields */}
          <div className="space-y-1">
            <Label>
              Ownership Percentage <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={formData.ownershipPercentage}
              onChange={(e) =>
                handleFieldChange("ownershipPercentage", e.target.value)
              }
              placeholder="e.g., 25"
            />
            {errors["ubo_ownershipPercentage"] && (
              <p className="text-red-500 text-xs">
                {errors["ubo_ownershipPercentage"]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="Full address"
            />
            {errors["ubo_address"] && (
              <p className="text-red-500 text-xs">{errors["ubo_address"]}</p>
            )}
          </div>

          {/* Individual fields */}
          {formData.uboType === "INDIVIDUAL" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      handleFieldChange("fullName", e.target.value)
                    }
                    placeholder="Full Name"
                  />
                  {errors["ubo_fullName"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_fullName"]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleFieldChange("dateOfBirth", e.target.value)
                    }
                  />
                  {errors["ubo_dateOfBirth"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_dateOfBirth"]}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <PhoneInput
                    country={"us"}
                    value={formData.contactNumber}
                    onChange={(value) =>
                      handleFieldChange("contactNumber", value)
                    }
                    enableSearch
                    preferredCountries={["ae", "in"]}
                  />
                  {errors["ubo_contactNumber"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_contactNumber"]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                  {errors["ubo_email"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_email"]}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Organization fields */}
          {formData.uboType === "ORGANIZATION" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.organizationName}
                    onChange={(e) =>
                      handleFieldChange("organizationName", e.target.value)
                    }
                    placeholder="Organization Name"
                  />
                  {errors["ubo_organizationName"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_organizationName"]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <PhoneInput
                    country={"us"}
                    value={formData.phoneNumber}
                    onChange={(value) =>
                      handleFieldChange("phoneNumber", value)
                    }
                    enableSearch
                    preferredCountries={["ae", "in"]}
                  />
                  {errors["ubo_phoneNumber"] && (
                    <p className="text-red-500 text-xs">
                      {errors["ubo_phoneNumber"]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>
                  Registration Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    handleFieldChange("registrationNumber", e.target.value)
                  }
                  placeholder="Registration Number"
                />
                {errors["ubo_registrationNumber"] && (
                  <p className="text-red-500 text-xs">
                    {errors["ubo_registrationNumber"]}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Documents */}
          <div className="space-y-3">
            <Label className="font-semibold">Documents</Label>
            {formData.documentData.map((doc, docIndex) => (
              <div
                key={docIndex}
                className="border p-3 rounded-md grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <Label>
                    Document ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={doc.id}
                    onChange={(e) =>
                      handleDocumentChange(docIndex, "id", e.target.value)
                    }
                    placeholder="Document ID"
                  />
                  {errors[`ubo_doc_${docIndex}_id`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_doc_${docIndex}_id`]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Document Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={doc.idType}
                    onValueChange={(value) =>
                      handleDocumentChange(docIndex, "idType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ID_COPY">ID Copy</SelectItem>
                      <SelectItem value="ADDRESS_PROOF">
                        Address Proof
                      </SelectItem>
                      <SelectItem value="SOURCE_OF_FUNDS">
                        Source Of Funds
                      </SelectItem>
                      <SelectItem value="TRADE_LICENSE">
                        Trade License
                      </SelectItem>
                      <SelectItem value="COMPANY_REGISTRATION">
                        Company Registration
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`ubo_doc_${docIndex}_idType`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_doc_${docIndex}_idType`]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Expire Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={doc.expireDate}
                    onChange={(e) =>
                      handleDocumentChange(
                        docIndex,
                        "expireDate",
                        e.target.value,
                      )
                    }
                  />
                  {errors[`ubo_doc_${docIndex}_expireDate`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_doc_${docIndex}_expireDate`]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Issued Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={doc.issuedCountry}
                    onChange={(e) =>
                      handleDocumentChange(
                        docIndex,
                        "issuedCountry",
                        e.target.value,
                      )
                    }
                    placeholder="Country"
                  />
                  {errors[`ubo_doc_${docIndex}_issuedCountry`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_doc_${docIndex}_issuedCountry`]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Upload Document <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleDocumentChange(docIndex, "docs", file);
                    }}
                  />
                  {errors[`ubo_doc_${docIndex}_docs`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`ubo_doc_${docIndex}_docs`]}
                    </p>
                  )}
                </div>
                {formData.documentData.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDocument(docIndex)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addDocument}>
              + Add Document
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add UBO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UBOForm;
