import type React from "react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  FileText,
  Shield,
  AlertTriangle,
  Building,
} from "lucide-react";

/* ================= TYPES & ENUMS ================= */

interface DocumentType {
  documentCode: string;
  required: boolean;
}

interface RiskType {
  risk: string;
  enabled: boolean;
}

interface EscalationType {
  highRisk: number;
  edd: number;
  manualReview: number;
}

interface BusinessTypeOption {
  code: string;
  name: string;
}

interface DocumentTypeOption {
  code: string;
  name: string;
  category: string;
}

interface RiskTypeOption {
  code: string;
  description: string;
}

interface KYBRuleFormValues {
  businessType: string;
  name: string;
  autoApprovalLimit: number;
  reviewTiers: number;
  maxProcessingHours: number;
  documents: DocumentType[];
  risks: RiskType[];
  escalation: EscalationType;
}

interface CreateKybRuleProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

/* ================= VALIDATION SCHEMA ================= */

const KYBRuleSchema = Yup.object().shape({
  businessType: Yup.string().required("Business type is required"),

  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Rule name is required"),

  autoApprovalLimit: Yup.number()
    .min(0, "Auto approval limit cannot be negative")
    .required("Auto approval limit is required"),

  reviewTiers: Yup.number()
    .min(1, "Minimum 1 review tier")
    .max(3, "Maximum 3 review tiers")
    .integer("Review tiers must be a whole number")
    .required("Review tiers is required"),

  maxProcessingHours: Yup.number()
    .min(1, "Minimum 1 hour processing time")
    .max(168, "Maximum 7 days (168 hours)")
    .integer("Processing hours must be a whole number")
    .required("Max processing hours is required"),

  documents: Yup.array()
    .of(
      Yup.object().shape({
        documentCode: Yup.string().required("Document type is required"),
        required: Yup.boolean(),
      })
    )
    .min(1, "At least one document is required"),

  risks: Yup.array().of(
    Yup.object().shape({
      risk: Yup.string().required("Risk type is required"),
      enabled: Yup.boolean(),
    })
  ),

  escalation: Yup.object()
    .shape({
      highRisk: Yup.number()
        .min(0, "High risk threshold cannot be negative")
        .required("High risk threshold is required"),
      edd: Yup.number()
        .min(0, "EDD threshold cannot be negative")
        .required("EDD threshold is required"),
      manualReview: Yup.number()
        .min(0, "Manual review threshold cannot be negative")
        .required("Manual review threshold is required"),
    })
    .test(
      "escalation-order",
      "Thresholds must be in ascending order (highRisk ≤ edd ≤ manualReview)",
      (value) => {
        if (!value) return true;
        return value.highRisk <= value.edd && value.edd <= value.manualReview;
      }
    ),
});

/* ================= INITIAL VALUES ================= */

const initialValues: KYBRuleFormValues = {
  businessType: "",
  name: "",
  autoApprovalLimit: 100000,
  reviewTiers: 2,
  maxProcessingHours: 48,
  documents: [],
  risks: [],
  escalation: {
    highRisk: 50000,
    edd: 100000,
    manualReview: 200000,
  },
};

/* ================= MAIN COMPONENT ================= */

const CreateKybRule: React.FC<CreateKybRuleProps> = ({
  isModal = false,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState({
    documents: true,
    risks: true,
    escalation: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [businessTypes, setBusinessTypes] = useState<BusinessTypeOption[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([]);
  const [riskTypes, setRiskTypes] = useState<RiskTypeOption[]>([]);

  const handleSubmit = async (values: KYBRuleFormValues) => {
    try {
      setIsSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");

      console.log("Submitting KYB Rule:", values);

      const response = await axios.post(
        `http://192.168.18.174:8082/api/v3/kyb/rules/create`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status) {
        setSuccessMessage("KYB Rule created successfully!");

        if (isModal) {
          setTimeout(() => {
            if (onSuccess) onSuccess();
            if (onClose) onClose();
          }, 1500);
        } else {
          setTimeout(() => {
            navigate("/exchange/kyb-config");
          }, 2000);
        }
      } else {
        setErrorMessage(response.data.message || "Failed to create rule");
      }
    } catch (error: any) {
      console.error("Error creating KYB rule:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create KYB rule. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoading(true);

        // Fetch all three APIs in parallel
        const [businessTypesRes, documentTypesRes, riskTypesRes] =
          await Promise.all([
            axios.get(
              `http://192.168.18.174:8082/api/v3/admin/kyb/master/business-types`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `http://192.168.18.174:8082/api/v3/admin/kyb/master/documents`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `http://192.168.18.174:8082/api/v3/admin/kyb/master/risks`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

        // Set business types
        if (
          businessTypesRes.data?.data &&
          Array.isArray(businessTypesRes.data.data)
        ) {
          setBusinessTypes(businessTypesRes.data.data);
          console.log("Business Types:", businessTypesRes.data.data);
        }

        // Set document types
        if (
          documentTypesRes.data?.data &&
          Array.isArray(documentTypesRes.data.data)
        ) {
          setDocumentTypes(documentTypesRes.data.data);
          console.log("Document Types:", documentTypesRes.data.data);
        }

        // Set risk types
        if (riskTypesRes.data?.data && Array.isArray(riskTypesRes.data.data)) {
          setRiskTypes(riskTypesRes.data.data);
          console.log("Risk Types:", riskTypesRes.data.data);
        }

        setSuccessMessage("All data loaded successfully");
      } catch (error: any) {
        console.error("Error fetching master data:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to fetch master data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterData();
  }, [token]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading master data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isModal ? "" : "min-h-screen bg-gradient-to-b from-slate-50 to-white"
      }
    >
      {/* Header with Back Button */}
      {!isModal && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-lg"
            >
              <IoMdArrowRoundBack size={8} />
              Back
            </Button>
            <div className="flex justify-center gap-4">
              <div className="text-center items-center">
                <h1 className="text-3xl font-bold text-slate-900 text-center">
                  Create KYB Rule
                </h1>
                <p className="text-slate-600 mt-1">
                  Define compliance requirements for different business types
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          isModal ? "p-4" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        }
      >
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900">
                {successMessage}
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                {isModal
                  ? "Rule has been created successfully. You can close this window."
                  : "Redirecting to KYB rules list..."}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">
                Unable to create rule
              </h3>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={KYBRuleSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-2">
              {/* Basic Information Card */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900">
                        Basic Information
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Core details about the KYB rule
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Business Type */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="businessType"
                        className="font-semibold text-slate-900"
                      >
                        Business Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.businessType}
                        onValueChange={(value: string) =>
                          setFieldValue("businessType", value)
                        }
                        disabled={businessTypes.length === 0}
                      >
                        <SelectTrigger
                          id="businessType"
                          className="h-11 border-slate-200 bg-white"
                        >
                          {businessTypes.length > 0 ? (
                            <SelectValue placeholder="Select business type" />
                          ) : (
                            <span className="text-slate-400">
                              No business types available
                            </span>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.code} value={type.code}>
                              <span className="font-medium">{type.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="businessType"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>

                    {/* Rule Name */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="font-semibold text-slate-900"
                      >
                        Rule Name <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        type="text"
                        id="name"
                        name="name"
                        placeholder="e.g., SME KYB Rule"
                        className="h-11 border-slate-200 bg-white focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>

                    {/* Auto Approval Limit */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="autoApprovalLimit"
                        className="font-semibold text-slate-900"
                      >
                        Auto Approval Limit{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <Field
                          as={Input}
                          type="number"
                          id="autoApprovalLimit"
                          name="autoApprovalLimit"
                          className="h-11 pl-10 border-slate-200 bg-white focus:border-blue-500"
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                      </div>
                      <ErrorMessage
                        name="autoApprovalLimit"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>

                    {/* Review Tiers */}
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-900">
                        Review Tiers <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setFieldValue("reviewTiers", tier)}
                            className={` px-2 border rounded-lg font-medium transition-all ${
                              values.reviewTiers === tier
                                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                : "border-slate-200 text-slate-700 hover:border-blue-300 bg-white"
                            }`}
                          >
                            <div className="text-lg">{tier}</div>
                            <div className="text-xs mt-1 opacity-80">
                              {tier === 1
                                ? "Single"
                                : tier === 2
                                ? "Dual"
                                : "Triple"}
                            </div>
                          </button>
                        ))}
                      </div>
                      <ErrorMessage
                        name="reviewTiers"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>

                    {/* Max Processing Hours */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="maxProcessingHours"
                        className="font-semibold text-slate-900"
                      >
                        Max Processing Time{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                          <Clock className="h-4 w-4" />
                        </span>
                        <Field
                          as={Input}
                          type="number"
                          id="maxProcessingHours"
                          name="maxProcessingHours"
                          className="h-11 pl-10 pr-20 border-slate-200 bg-white focus:border-blue-500"
                          min="1"
                          max="168"
                          placeholder="48"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                          hours
                        </span>
                      </div>
                      <ErrorMessage
                        name="maxProcessingHours"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleSection("documents")}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900">
                          Required Documents
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          Documents needed for business verification
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {values.documents.length}{" "}
                        {values.documents.length === 1
                          ? "document"
                          : "documents"}
                      </Badge>
                      {expandedSections.documents ? (
                        <FiChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </div>

                {expandedSections.documents && (
                  <CardContent className="border-t border-slate-200 pt-4">
                    <FieldArray name="documents">
                      {({ push, remove }) => (
                        <div className="space-y-4">
                          {values.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 px-6 py-3 border border-slate-200 rounded-lg bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Document Type */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`documents.${index}.documentCode`}
                                    className="font-semibold text-slate-900"
                                  >
                                    Document Type
                                  </Label>
                                  <Select
                                    value={doc.documentCode}
                                    onValueChange={(value) =>
                                      setFieldValue(
                                        `documents.${index}.documentCode`,
                                        value
                                      )
                                    }
                                    disabled={documentTypes.length === 0}
                                  >
                                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                                      {documentTypes.length > 0 ? (
                                        <SelectValue placeholder="Select document type" />
                                      ) : (
                                        <span className="text-slate-400">
                                          No documents available
                                        </span>
                                      )}
                                    </SelectTrigger>
                                    <SelectContent>
                                      {documentTypes.map((docType) => (
                                        <SelectItem
                                          key={docType.code}
                                          value={docType.code}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {docType.name}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                              {docType.category}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <ErrorMessage
                                    name={`documents.${index}.documentCode`}
                                    component="div"
                                    className="text-red-600 text-xs"
                                  />
                                </div>

                                {/* Required */}
                                <div className="flex items-center gap-3 pt-9">
                                  <Switch
                                    id={`documents.${index}.required`}
                                    checked={doc.required}
                                    onCheckedChange={(checked) =>
                                      setFieldValue(
                                        `documents.${index}.required`,
                                        checked
                                      )
                                    }
                                    className="data-[state=checked]:bg-blue-600"
                                  />
                                  <div>
                                    <Label
                                      htmlFor={`documents.${index}.required`}
                                      className="font-semibold text-slate-900 cursor-pointer"
                                    >
                                      Required for approval
                                    </Label>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                      Must be provided
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Remove Button */}
                              {values.documents.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 mt-9"
                                >
                                  <FiTrash2 className="h-10 w-10" />
                                </Button>
                              )}
                            </div>
                          ))}

                          {/* Add Document Button */}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              push({
                                documentCode:
                                  documentTypes.length > 0
                                    ? documentTypes[0].code
                                    : "",
                                required: false,
                              })
                            }
                            className="w-full h-11 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                            disabled={documentTypes.length === 0}
                          >
                            <FiPlus className="h-4 w-4 mr-2" />
                            Add Document Requirement
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                    {errors.documents &&
                      typeof errors.documents === "string" && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm font-medium">
                            {errors.documents}
                          </p>
                        </div>
                      )}
                  </CardContent>
                )}
              </Card>

              {/* Risk Assessment Section */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleSection("risks")}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900">
                          Risk Assessment
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          Risk factors to monitor for this business type
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                        {values.risks.filter((r) => r.enabled).length} enabled
                      </Badge>
                      {expandedSections.risks ? (
                        <FiChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </div>

                {expandedSections.risks && (
                  <CardContent className="border-t border-slate-200 pt-4">
                    <FieldArray name="risks">
                      {({ push, remove }) => (
                        <div className="space-y-4">
                          {values.risks.map((risk, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 px-6 py-3 border border-slate-200 rounded-lg bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Risk Type */}
                                <div className="space-y-3">
                                  <Label
                                    htmlFor={`risks.${index}.risk`}
                                    className="font-semibold text-slate-900"
                                  >
                                    Risk Factor
                                  </Label>
                                  <Select
                                    value={risk.risk}
                                    onValueChange={(value) =>
                                      setFieldValue(
                                        `risks.${index}.risk`,
                                        value
                                      )
                                    }
                                    disabled={riskTypes.length === 0}
                                  >
                                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                                      {riskTypes.length > 0 ? (
                                        <SelectValue placeholder="Select risk factor" />
                                      ) : (
                                        <span className="text-slate-400">
                                          No risks available
                                        </span>
                                      )}
                                    </SelectTrigger>
                                    <SelectContent>
                                      {riskTypes.map((riskType) => (
                                        <SelectItem
                                          key={riskType.code}
                                          value={riskType.code}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {riskType.description}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                              {riskType.code}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Enabled Switch */}
                                <div className="flex items-center gap-3 pt-9">
                                  <Switch
                                    id={`risks.${index}.enabled`}
                                    checked={risk.enabled}
                                    onCheckedChange={(checked) =>
                                      setFieldValue(
                                        `risks.${index}.enabled`,
                                        checked
                                      )
                                    }
                                    className="data-[state=checked]:bg-red-600"
                                  />
                                  <div>
                                    <Label
                                      htmlFor={`risks.${index}.enabled`}
                                      className={`font-semibold cursor-pointer ${
                                        risk.enabled
                                          ? "text-red-700"
                                          : "text-slate-700"
                                      }`}
                                    >
                                      {risk.enabled
                                        ? "Active Monitoring"
                                        : "Disabled"}
                                    </Label>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                      {risk.enabled
                                        ? "This risk will be monitored"
                                        : "This risk will be ignored"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Remove Button */}
                              {values.risks.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 mt-9"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}

                          {/* Add Risk Button */}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              push({
                                risk:
                                  riskTypes.length > 0 ? riskTypes[0].code : "",
                                enabled: false,
                              })
                            }
                            className="w-full h-11 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                            disabled={riskTypes.length === 0}
                          >
                            <FiPlus className="h-4 w-4 mr-2" />
                            Add Risk Factor
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </CardContent>
                )}
              </Card>

              {/* Escalation Thresholds */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleSection("escalation")}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900">
                          Escalation Thresholds
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          Transaction thresholds for risk escalation
                        </p>
                      </div>
                    </div>
                    {expandedSections.escalation ? (
                      <FiChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </CardHeader>
                </div>

                {expandedSections.escalation && (
                  <CardContent className="border-t border-slate-200 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* High Risk Threshold */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <Label
                            htmlFor="escalation.highRisk"
                            className="font-semibold text-slate-900"
                          >
                            High Risk
                          </Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <Field
                            as={Input}
                            type="number"
                            id="escalation.highRisk"
                            name="escalation.highRisk"
                            className="h-11 pl-10 border-slate-200 bg-white focus:border-blue-500"
                            min="0"
                            step="1000"
                            placeholder="50000"
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          Triggers enhanced monitoring
                        </p>
                        <ErrorMessage
                          name="escalation.highRisk"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* EDD Threshold */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <Label
                            htmlFor="escalation.edd"
                            className="font-semibold text-slate-900"
                          >
                            EDD Review
                          </Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <Field
                            as={Input}
                            type="number"
                            id="escalation.edd"
                            name="escalation.edd"
                            className="h-11 pl-10 border-slate-200 bg-white focus:border-blue-500"
                            min="0"
                            step="1000"
                            placeholder="100000"
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          Enhanced Due Diligence required
                        </p>
                        <ErrorMessage
                          name="escalation.edd"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Manual Review Threshold */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <Label
                            htmlFor="escalation.manualReview"
                            className="font-semibold text-slate-900"
                          >
                            Manual Review
                          </Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <Field
                            as={Input}
                            type="number"
                            id="escalation.manualReview"
                            name="escalation.manualReview"
                            className="h-11 pl-10 border-slate-200 bg-white focus:border-blue-500"
                            min="0"
                            step="1000"
                            placeholder="200000"
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          Requires manual approval
                        </p>
                        <ErrorMessage
                          name="escalation.manualReview"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                    </div>

                    {/* Validation for order */}
                    {errors.escalation &&
                      typeof errors.escalation === "string" && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <p className="text-red-700 text-sm font-medium">
                              {errors.escalation}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Threshold Flow Visualization */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-700 mb-4">
                        Threshold Flow Visualization
                      </h4>
                      <div className="space-y-4">
                        <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                          {/* Auto Approval Zone */}
                          <div
                            className="absolute left-0 h-full bg-green-500"
                            style={{
                              width: `${
                                (values.autoApprovalLimit /
                                  Math.max(values.escalation.manualReview, 1)) *
                                100
                              }%`,
                            }}
                          >
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                              Auto Approval
                            </span>
                          </div>

                          {/* High Risk Zone */}
                          <div
                            className="absolute h-full bg-yellow-500"
                            style={{
                              left: `${
                                (values.escalation.highRisk /
                                  Math.max(values.escalation.manualReview, 1)) *
                                100
                              }%`,
                              width: `${
                                ((values.escalation.edd -
                                  values.escalation.highRisk) /
                                  Math.max(values.escalation.manualReview, 1)) *
                                100
                              }%`,
                            }}
                          >
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-800">
                              High Risk
                            </span>
                          </div>

                          {/* EDD Zone */}
                          <div
                            className="absolute h-full bg-orange-500"
                            style={{
                              left: `${
                                (values.escalation.edd /
                                  Math.max(values.escalation.manualReview, 1)) *
                                100
                              }%`,
                              width: `${
                                ((values.escalation.manualReview -
                                  values.escalation.edd) /
                                  Math.max(values.escalation.manualReview, 1)) *
                                100
                              }%`,
                            }}
                          >
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                              EDD
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-slate-500">
                          <div className="flex flex-col items-center">
                            <span>$0</span>
                            <span className="text-slate-400">Start</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span>
                              {formatCurrency(values.escalation.highRisk)}
                            </span>
                            <span className="text-slate-400">High Risk</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span>{formatCurrency(values.escalation.edd)}</span>
                            <span className="text-slate-400">EDD</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span>
                              {formatCurrency(values.escalation.manualReview)}+
                            </span>
                            <span className="text-slate-400">
                              Manual Review
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  All fields marked with * are required
                </div>
                <div className="flex space-x-3">
                  {isModal && onClose ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 h-11 bg-transparent"
                    >
                      Cancel
                    </Button>
                  ) : !isModal ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      disabled={isSubmitting}
                      className="px-6 h-11"
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={isSubmitting || businessTypes.length === 0}
                    className="px-8 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Rule...
                      </>
                    ) : (
                      "Create KYB Rule"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateKybRule;
