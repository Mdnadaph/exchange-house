import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

/* ================= TYPES & ENUMS ================= */

type BusinessType = "STANDARD" | "SME" | "CORPORATE" | "EXCHANGE" | "HIGH_RISK";

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

interface KYBRuleFormValues {
  businessType: BusinessType;
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

/* ================= CONSTANTS ================= */

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "STANDARD", label: "Standard" },
  { value: "SME", label: "SME" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "EXCHANGE", label: "Exchange" },
  { value: "HIGH_RISK", label: "High Risk" },
];

const DOCUMENT_TYPES = [
  { code: "BUSINESS_REGISTRATION", label: "Business Registration" },
  { code: "TAX_CERTIFICATE", label: "Tax Certificate" },
  { code: "OWNER_ID", label: "Owner ID" },
  { code: "PROOF_OF_ADDRESS", label: "Proof of Address" },
  { code: "BANK_STATEMENT", label: "Bank Statement" },
  { code: "LICENSE", label: "Business License" },
  { code: "ARTICLES_OF_INCORPORATION", label: "Articles of Incorporation" },
];

const RISK_TYPES = [
  { code: "HIGH_TRANSACTION_VOLUME", label: "High Transaction Volume" },
  { code: "UNVERIFIED_OWNER", label: "Unverified Owner" },
  { code: "PEP_ASSOCIATION", label: "PEP Association" },
  { code: "SANCTIONED_COUNTRY", label: "Sanctioned Country" },
  { code: "HIGH_RISK_INDUSTRY", label: "High Risk Industry" },
  { code: "NEW_BUSINESS", label: "New Business (< 2 years)" },
];

/* ================= VALIDATION SCHEMA ================= */

const KYBRuleSchema = Yup.object().shape({
  businessType: Yup.string()
    .oneOf(["STANDARD", "SME", "CORPORATE", "EXCHANGE", "HIGH_RISK"])
    .required("Business type is required"),

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
      function (value) {
        if (!value) return true;
        return value.highRisk <= value.edd && value.edd <= value.manualReview;
      }
    ),
});

/* ================= INITIAL VALUES ================= */

const initialValues: KYBRuleFormValues = {
  businessType: "STANDARD",
  name: "",
  autoApprovalLimit: 100000,
  reviewTiers: 2,
  maxProcessingHours: 48,
  documents: [
    { documentCode: "BUSINESS_REGISTRATION", required: true },
    { documentCode: "TAX_CERTIFICATE", required: false },
  ],
  risks: [
    { risk: "HIGH_TRANSACTION_VOLUME", enabled: true },
    { risk: "UNVERIFIED_OWNER", enabled: false },
  ],
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

  const handleSubmit = async (values: KYBRuleFormValues) => {
    try {
      setIsSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");

      console.log("Submitting KYB Rule:", values);

      const response = await axios.post(
        `${BASE_URL}/api/v3/kyb/rules/create`,
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

        // Handle success based on modal or page mode
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

  return (
    <div className={isModal ? "p-1" : "p-6"}>
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
              <p className="text-xs text-green-700">
                {isModal
                  ? "You can close this window"
                  : "Redirecting to rules list..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={KYBRuleSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={values.businessType}
                      onValueChange={(value: BusinessType) =>
                        setFieldValue("businessType", value)
                      }
                    >
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="businessType"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Rule Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name *</Label>
                    <Field
                      as={Input}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g., SME KYB Rule"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Auto Approval Limit */}
                  <div className="space-y-2">
                    <Label htmlFor="autoApprovalLimit">
                      Auto Approval Limit (USD) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Field
                        as={Input}
                        type="number"
                        id="autoApprovalLimit"
                        name="autoApprovalLimit"
                        className="pl-8"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Current: {formatCurrency(values.autoApprovalLimit)}
                    </p>
                    <ErrorMessage
                      name="autoApprovalLimit"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Review Tiers */}
                  <div className="space-y-2">
                    <Label>Review Tiers *</Label>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((tier) => (
                        <Button
                          key={tier}
                          type="button"
                          variant={
                            values.reviewTiers === tier ? "default" : "outline"
                          }
                          onClick={() => setFieldValue("reviewTiers", tier)}
                          className="flex-1"
                        >
                          {tier} {tier === 1 ? "Tier" : "Tiers"}
                        </Button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="reviewTiers"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Max Processing Hours */}
                  <div className="space-y-2">
                    <Label htmlFor="maxProcessingHours">
                      Max Processing Hours *
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type="number"
                        id="maxProcessingHours"
                        name="maxProcessingHours"
                        min="1"
                        max="168"
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        hours
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.floor(values.maxProcessingHours / 24)} days,{" "}
                      {values.maxProcessingHours % 24} hours
                    </p>
                    <ErrorMessage
                      name="maxProcessingHours"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card>
              <div
                className="cursor-pointer"
                onClick={() => toggleSection("documents")}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Required Documents
                    <Badge variant="secondary">{values.documents.length}</Badge>
                  </CardTitle>
                  {expandedSections.documents ? (
                    <FiChevronUp className="h-5 w-5" />
                  ) : (
                    <FiChevronDown className="h-5 w-5" />
                  )}
                </CardHeader>
              </div>

              {expandedSections.documents && (
                <CardContent>
                  <FieldArray name="documents">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Document Type */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`documents.${index}.documentCode`}
                                >
                                  Document Type *
                                </Label>
                                <Select
                                  value={doc.documentCode}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      `documents.${index}.documentCode`,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DOCUMENT_TYPES.map((docType) => (
                                      <SelectItem
                                        key={docType.code}
                                        value={docType.code}
                                      >
                                        {docType.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <ErrorMessage
                                  name={`documents.${index}.documentCode`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              {/* Required */}
                              <div className="flex items-center space-x-2 pt-6">
                                <Checkbox
                                  id={`documents.${index}.required`}
                                  checked={doc.required}
                                  onCheckedChange={(checked) =>
                                    setFieldValue(
                                      `documents.${index}.required`,
                                      checked
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`documents.${index}.required`}
                                  className="cursor-pointer"
                                >
                                  Required for approval
                                </Label>
                              </div>
                            </div>

                            {/* Remove Button */}
                            {values.documents.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {/* Add Document Button */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            push({ documentCode: "", required: false })
                          }
                          className="w-full"
                        >
                          <FiPlus className="h-4 w-4 mr-2" />
                          Add Document Requirement
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                  {errors.documents && typeof errors.documents === "string" && (
                    <div className="text-red-500 text-sm mt-2">
                      {errors.documents}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Risk Assessment Section */}
            <Card>
              <div
                className="cursor-pointer"
                onClick={() => toggleSection("risks")}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Risk Assessment
                    <Badge variant="secondary">
                      {values.risks.filter((r) => r.enabled).length} enabled
                    </Badge>
                  </CardTitle>
                  {expandedSections.risks ? (
                    <FiChevronUp className="h-5 w-5" />
                  ) : (
                    <FiChevronDown className="h-5 w-5" />
                  )}
                </CardHeader>
              </div>

              {expandedSections.risks && (
                <CardContent>
                  <FieldArray name="risks">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.risks.map((risk, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Risk Type */}
                              <div className="space-y-2">
                                <Label htmlFor={`risks.${index}.risk`}>
                                  Risk Type *
                                </Label>
                                <Select
                                  value={risk.risk}
                                  onValueChange={(value) =>
                                    setFieldValue(`risks.${index}.risk`, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select risk type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {RISK_TYPES.map((riskType) => (
                                      <SelectItem
                                        key={riskType.code}
                                        value={riskType.code}
                                      >
                                        {riskType.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Enabled Switch */}
                              <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                  id={`risks.${index}.enabled`}
                                  checked={risk.enabled}
                                  onCheckedChange={(checked) =>
                                    setFieldValue(
                                      `risks.${index}.enabled`,
                                      checked
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`risks.${index}.enabled`}
                                  className="cursor-pointer"
                                >
                                  {risk.enabled ? "Enabled" : "Disabled"}
                                </Label>
                              </div>
                            </div>

                            {/* Remove Button */}
                            {values.risks.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
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
                          onClick={() => push({ risk: "", enabled: false })}
                          className="w-full"
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
            <Card>
              <div
                className="cursor-pointer"
                onClick={() => toggleSection("escalation")}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Escalation Thresholds
                  </CardTitle>
                  {expandedSections.escalation ? (
                    <FiChevronUp className="h-5 w-5" />
                  ) : (
                    <FiChevronDown className="h-5 w-5" />
                  )}
                </CardHeader>
              </div>

              {expandedSections.escalation && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* High Risk Threshold */}
                    <div className="space-y-2">
                      <Label htmlFor="escalation.highRisk">
                        High Risk Threshold (USD) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Field
                          as={Input}
                          type="number"
                          id="escalation.highRisk"
                          name="escalation.highRisk"
                          className="pl-8"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <ErrorMessage
                        name="escalation.highRisk"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* EDD Threshold */}
                    <div className="space-y-2">
                      <Label htmlFor="escalation.edd">
                        EDD Threshold (USD) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Field
                          as={Input}
                          type="number"
                          id="escalation.edd"
                          name="escalation.edd"
                          className="pl-8"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <ErrorMessage
                        name="escalation.edd"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Manual Review Threshold */}
                    <div className="space-y-2">
                      <Label htmlFor="escalation.manualReview">
                        Manual Review (USD) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Field
                          as={Input}
                          type="number"
                          id="escalation.manualReview"
                          name="escalation.manualReview"
                          className="pl-8"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <ErrorMessage
                        name="escalation.manualReview"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Validation for order */}
                  {errors.escalation &&
                    typeof errors.escalation === "string" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">
                          ⚠️ {errors.escalation}
                        </p>
                      </div>
                    )}

                  {/* Threshold Flow Visualization */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Threshold Flow Visualization
                    </h4>
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      {/* Auto Approval Zone */}
                      <div
                        className="absolute left-0 h-full bg-green-500"
                        style={{
                          width: `${
                            (values.escalation.highRisk /
                              values.escalation.manualReview) *
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
                              values.escalation.manualReview) *
                            100
                          }%`,
                          width: `${
                            ((values.escalation.edd -
                              values.escalation.highRisk) /
                              values.escalation.manualReview) *
                            100
                          }%`,
                        }}
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-800">
                          High Risk
                        </span>
                      </div>

                      {/* EDD Zone */}
                      <div
                        className="absolute h-full bg-orange-500"
                        style={{
                          left: `${
                            (values.escalation.edd /
                              values.escalation.manualReview) *
                            100
                          }%`,
                          width: `${
                            ((values.escalation.manualReview -
                              values.escalation.edd) /
                              values.escalation.manualReview) *
                            100
                          }%`,
                        }}
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                          EDD
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>$0</span>
                      <span>{formatCurrency(values.escalation.highRisk)}</span>
                      <span>{formatCurrency(values.escalation.edd)}</span>
                      <span>
                        {formatCurrency(values.escalation.manualReview)}+
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              {isModal && onClose ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create KYB Rule"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateKybRule;
