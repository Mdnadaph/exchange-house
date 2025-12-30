//import React, { useState } from "react";
//import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
//import * as Yup from "yup";
//import axios from "axios";
//import { useCookies } from "react-cookie";
//import BASE_URL from "@/config/config";
//import { useNavigate } from "react-router-dom";
//import {
//  FiPlus,
//  FiTrash2,
//  FiChevronDown,
//  FiChevronUp,
//  FiArrowLeft,
//  FiCheck,
//  FiAlertCircle,
//} from "react-icons/fi";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import { Checkbox } from "@/components/ui/checkbox";
//import { Switch } from "@/components/ui/switch";
//import { Badge } from "@/components/ui/badge";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
//import { Progress } from "@/components/ui/progress";
//import { Separator } from "@/components/ui/separator";
//import {
//  AlertCircle,
//  CheckCircle,
//  DollarSign,
//  Clock,
//  FileText,
//  Shield,
//  AlertTriangle,
//  Users,
//  Building,
//  TrendingUp,
//  BarChart3,
//  ShieldCheck,
//  Upload,
//} from "lucide-react";

///* ================= TYPES & ENUMS ================= */

//type BusinessType = "STANDARD" | "SME" | "CORPORATE" | "EXCHANGE" | "HIGH_RISK";

//interface DocumentType {
//  documentCode: string;
//  required: boolean;
//}

//interface RiskType {
//  risk: string;
//  enabled: boolean;
//}

//interface EscalationType {
//  highRisk: number;
//  edd: number;
//  manualReview: number;
//}

//interface KYBRuleFormValues {
//  businessType: BusinessType;
//  name: string;
//  autoApprovalLimit: number;
//  reviewTiers: number;
//  maxProcessingHours: number;
//  documents: DocumentType[];
//  risks: RiskType[];
//  escalation: EscalationType;
//}

//interface CreateKybRuleProps {
//  isModal?: boolean;
//  onClose?: () => void;
//  onSuccess?: () => void;
//}

///* ================= CONSTANTS ================= */

//const BUSINESS_TYPES: {
//  value: BusinessType;
//  label: string;
//  description: string;
//}[] = [
//  {
//    value: "STANDARD",
//    label: "Standard",
//    description: "Regular business verification",
//  },
//  { value: "SME", label: "SME", description: "Small & Medium Enterprises" },
//  { value: "CORPORATE", label: "Corporate", description: "Large corporations" },
//  { value: "EXCHANGE", label: "Exchange", description: "Crypto exchanges" },
//  {
//    value: "HIGH_RISK",
//    label: "High Risk",
//    description: "High-risk industries",
//  },
//];

//const DOCUMENT_TYPES = [
//  {
//    code: "BUSINESS_REGISTRATION",
//    label: "Business Registration",
//    category: "Business",
//    icon: "🏢",
//  },
//  {
//    code: "TAX_CERTIFICATE",
//    label: "Tax Certificate",
//    category: "Financial",
//    icon: "📊",
//  },
//  {
//    code: "OWNER_ID",
//    label: "Owner ID",
//    category: "Identification",
//    icon: "🆔",
//  },
//  {
//    code: "PROOF_OF_ADDRESS",
//    label: "Proof of Address",
//    category: "Address",
//    icon: "📍",
//  },
//  {
//    code: "BANK_STATEMENT",
//    label: "Bank Statement",
//    category: "Financial",
//    icon: "🏦",
//  },
//  {
//    code: "LICENSE",
//    label: "Business License",
//    category: "Regulatory",
//    icon: "📜",
//  },
//  {
//    code: "ARTICLES_OF_INCORPORATION",
//    label: "Articles of Incorporation",
//    category: "Business",
//    icon: "📄",
//  },
//];

//const RISK_TYPES = [
//  {
//    code: "HIGH_TRANSACTION_VOLUME",
//    label: "High Transaction Volume",
//    description: "Large transaction volumes",
//    severity: "medium",
//  },
//  {
//    code: "UNVERIFIED_OWNER",
//    label: "Unverified Owner",
//    description: "Owners without proper verification",
//    severity: "high",
//  },
//  {
//    code: "PEP_ASSOCIATION",
//    label: "PEP Association",
//    description: "Politically Exposed Persons",
//    severity: "high",
//  },
//  {
//    code: "SANCTIONED_COUNTRY",
//    label: "Sanctioned Country",
//    description: "Operations in sanctioned countries",
//    severity: "critical",
//  },
//  {
//    code: "HIGH_RISK_INDUSTRY",
//    label: "High Risk Industry",
//    description: "High-risk business sectors",
//    severity: "medium",
//  },
//  {
//    code: "NEW_BUSINESS",
//    label: "New Business (< 2 years)",
//    description: "Recently established businesses",
//    severity: "low",
//  },
//];

///* ================= VALIDATION SCHEMA ================= */

//const KYBRuleSchema = Yup.object().shape({
//  businessType: Yup.string()
//    .oneOf(["STANDARD", "SME", "CORPORATE", "EXCHANGE", "HIGH_RISK"])
//    .required("Business type is required"),

//  name: Yup.string()
//    .min(3, "Name must be at least 3 characters")
//    .max(100, "Name must not exceed 100 characters")
//    .required("Rule name is required"),

//  autoApprovalLimit: Yup.number()
//    .min(0, "Auto approval limit cannot be negative")
//    .required("Auto approval limit is required"),

//  reviewTiers: Yup.number()
//    .min(1, "Minimum 1 review tier")
//    .max(3, "Maximum 3 review tiers")
//    .integer("Review tiers must be a whole number")
//    .required("Review tiers is required"),

//  maxProcessingHours: Yup.number()
//    .min(1, "Minimum 1 hour processing time")
//    .max(168, "Maximum 7 days (168 hours)")
//    .integer("Processing hours must be a whole number")
//    .required("Max processing hours is required"),

//  documents: Yup.array()
//    .of(
//      Yup.object().shape({
//        documentCode: Yup.string().required("Document type is required"),
//        required: Yup.boolean(),
//      })
//    )
//    .min(1, "At least one document is required"),

//  risks: Yup.array().of(
//    Yup.object().shape({
//      risk: Yup.string().required("Risk type is required"),
//      enabled: Yup.boolean(),
//    })
//  ),

//  escalation: Yup.object()
//    .shape({
//      highRisk: Yup.number()
//        .min(0, "High risk threshold cannot be negative")
//        .required("High risk threshold is required"),
//      edd: Yup.number()
//        .min(0, "EDD threshold cannot be negative")
//        .required("EDD threshold is required"),
//      manualReview: Yup.number()
//        .min(0, "Manual review threshold cannot be negative")
//        .required("Manual review threshold is required"),
//    })
//    .test(
//      "escalation-order",
//      "Thresholds must be in ascending order (highRisk ≤ edd ≤ manualReview)",
//      function (value) {
//        if (!value) return true;
//        return value.highRisk <= value.edd && value.edd <= value.manualReview;
//      }
//    ),
//});

///* ================= INITIAL VALUES ================= */

//const initialValues: KYBRuleFormValues = {
//  businessType: "STANDARD",
//  name: "",
//  autoApprovalLimit: 100000,
//  reviewTiers: 2,
//  maxProcessingHours: 48,
//  documents: [
//    { documentCode: "BUSINESS_REGISTRATION", required: true },
//    { documentCode: "TAX_CERTIFICATE", required: false },
//  ],
//  risks: [
//    { risk: "HIGH_TRANSACTION_VOLUME", enabled: true },
//    { risk: "UNVERIFIED_OWNER", enabled: false },
//  ],
//  escalation: {
//    highRisk: 50000,
//    edd: 100000,
//    manualReview: 200000,
//  },
//};

///* ================= MAIN COMPONENT ================= */

//const CreateKybRule: React.FC<CreateKybRuleProps> = ({
//  isModal = false,
//  onClose,
//  onSuccess,
//}) => {
//  const navigate = useNavigate();
//  const [cookies] = useCookies(["token"]);
//  const token = cookies.token;

//  const [successMessage, setSuccessMessage] = useState<string>("");
//  const [errorMessage, setErrorMessage] = useState<string>("");
//  const [expandedSections, setExpandedSections] = useState({
//    documents: true,
//    risks: true,
//    escalation: true,
//  });
//  const [isSubmitting, setIsSubmitting] = useState(false);
//  const [activeTab, setActiveTab] = useState<string>("basic");

//  const handleSubmit = async (values: KYBRuleFormValues) => {
//    try {
//      setIsSubmitting(true);
//      setSuccessMessage("");
//      setErrorMessage("");

//      console.log("Submitting KYB Rule:", values);

//      const response = await axios.post(
//        `${BASE_URL}/api/v3/kyb/rules/create`,
//        values,
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//            "Content-Type": "application/json",
//          },
//        }
//      );

//      console.log("API Response:", response.data);

//      if (response.data.status) {
//        setSuccessMessage("KYB Rule created successfully!");

//        if (isModal) {
//          setTimeout(() => {
//            if (onSuccess) onSuccess();
//            if (onClose) onClose();
//          }, 1500);
//        } else {
//          setTimeout(() => {
//            navigate("/exchange/kyb-config");
//          }, 2000);
//        }
//      } else {
//        setErrorMessage(response.data.message || "Failed to create rule");
//      }
//    } catch (error: any) {
//      console.error("Error creating KYB rule:", error);
//      setErrorMessage(
//        error.response?.data?.message ||
//          error.response?.data?.error ||
//          "Failed to create KYB rule. Please try again."
//      );
//    } finally {
//      setIsSubmitting(false);
//    }
//  };

//  const toggleSection = (section: keyof typeof expandedSections) => {
//    setExpandedSections((prev) => ({
//      ...prev,
//      [section]: !prev[section],
//    }));
//  };

//  const formatCurrency = (value: number) => {
//    return new Intl.NumberFormat("en-US", {
//      style: "currency",
//      currency: "USD",
//      minimumFractionDigits: 0,
//      maximumFractionDigits: 0,
//    }).format(value);
//  };

//  const getSeverityColor = (severity: string) => {
//    switch (severity) {
//      case "critical":
//        return "bg-red-100 text-red-800 border-red-200";
//      case "high":
//        return "bg-orange-100 text-orange-800 border-orange-200";
//      case "medium":
//        return "bg-yellow-100 text-yellow-800 border-yellow-200";
//      case "low":
//        return "bg-blue-100 text-blue-800 border-blue-200";
//      default:
//        return "bg-gray-100 text-gray-800 border-gray-200";
//    }
//  };

//  return (
//    <div
//      className={
//        isModal
//          ? ""
//          : "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30"
//      }
//    >
//      {/* Header with Back Button */}
//      {!isModal && (
//        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
//          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//            <div className="flex items-center justify-between">
//              <Button
//                variant="ghost"
//                size="sm"
//                onClick={() => navigate(-1)}
//                className="flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
//              >
//                <FiArrowLeft className="h-5 w-5 mr-2" />
//                Back to Rules
//              </Button>
//              <div className="text-center flex-1">
//                <h1 className="text-3xl font-bold text-white mb-2">
//                  Create KYB Rule
//                </h1>
//                <p className="text-blue-100/90 max-w-2xl mx-auto">
//                  Configure a comprehensive Know Your Business rule for
//                  different business types
//                </p>
//              </div>
//              <div className="w-24"></div> {/* Spacer for alignment */}
//            </div>
//          </div>
//        </div>
//      )}

//      <div
//        className={
//          isModal ? "p-1" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6"
//        }
//      >
//        {/* Progress Indicator */}
//        {!isModal && (
//          <div className="mb-8">
//            <div className="flex items-center justify-between mb-4">
//              {["Basic", "Documents", "Risk", "Thresholds", "Review"].map(
//                (step, index) => (
//                  <div
//                    key={step}
//                    className="flex flex-col items-center relative"
//                  >
//                    <div
//                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10
//                    ${
//                      activeTab === step.toLowerCase()
//                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
//                        : index <
//                          [
//                            "basic",
//                            "documents",
//                            "risks",
//                            "escalation",
//                            "review",
//                          ].indexOf(activeTab)
//                        ? "bg-green-500 text-white"
//                        : "bg-white text-gray-400 border-2 border-gray-200"
//                    }`}
//                    >
//                      {index <
//                      [
//                        "basic",
//                        "documents",
//                        "risks",
//                        "escalation",
//                        "review",
//                      ].indexOf(activeTab) ? (
//                        <FiCheck className="h-5 w-5" />
//                      ) : (
//                        index + 1
//                      )}
//                    </div>
//                    <span
//                      className={`text-sm font-medium ${
//                        activeTab === step.toLowerCase()
//                          ? "text-blue-600"
//                          : "text-gray-500"
//                      }`}
//                    >
//                      {step}
//                    </span>
//                    {index < 4 && (
//                      <div
//                        className={`absolute top-5 left-1/2 w-full h-0.5 -translate-x-1/2 ${
//                          index <
//                          [
//                            "basic",
//                            "documents",
//                            "risks",
//                            "escalation",
//                            "review",
//                          ].indexOf(activeTab)
//                            ? "bg-green-500"
//                            : "bg-gray-200"
//                        }`}
//                        style={{ left: "calc(50% + 20px)" }}
//                      />
//                    )}
//                  </div>
//                )
//              )}
//            </div>
//          </div>
//        )}

//        {/* Success/Error Messages */}
//        {successMessage && (
//          <div className="mb-8 animate-in slide-in-from-top duration-300">
//            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
//              <div className="flex items-start">
//                <div className="flex-shrink-0 p-2 bg-green-100 rounded-xl">
//                  <CheckCircle className="h-6 w-6 text-green-600" />
//                </div>
//                <div className="ml-4">
//                  <h3 className="text-lg font-semibold text-green-800">
//                    {successMessage}
//                  </h3>
//                  <p className="text-green-700 mt-1">
//                    {isModal
//                      ? "Rule has been created successfully. You can close this window."
//                      : "Redirecting to KYB rules list..."}
//                  </p>
//                </div>
//              </div>
//            </div>
//          </div>
//        )}

//        {errorMessage && (
//          <div className="mb-8 animate-in slide-in-from-top duration-300">
//            <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl shadow-lg">
//              <div className="flex items-start">
//                <div className="flex-shrink-0 p-2 bg-red-100 rounded-xl">
//                  <AlertCircle className="h-6 w-6 text-red-600" />
//                </div>
//                <div className="ml-4">
//                  <h3 className="text-lg font-semibold text-red-800">
//                    Unable to create rule
//                  </h3>
//                  <p className="text-red-700 mt-1">{errorMessage}</p>
//                </div>
//              </div>
//            </div>
//          </div>
//        )}

//        {/* Main Form Container */}
//        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//          {/* Form Tabs Navigation */}
//          <div className="border-b border-gray-200">
//            <Tabs
//              value={activeTab}
//              onValueChange={setActiveTab}
//              className="w-full"
//            >
//              <TabsList className="grid grid-cols-5 h-14 bg-gray-50/50 p-1">
//                <TabsTrigger
//                  value="basic"
//                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                >
//                  <div className="flex items-center gap-2">
//                    <Building className="h-4 w-4" />
//                    <span>Basic Info</span>
//                  </div>
//                </TabsTrigger>
//                <TabsTrigger
//                  value="documents"
//                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                >
//                  <div className="flex items-center gap-2">
//                    <FileText className="h-4 w-4" />
//                    <span>Documents</span>
//                  </div>
//                </TabsTrigger>
//                <TabsTrigger
//                  value="risks"
//                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                >
//                  <div className="flex items-center gap-2">
//                    <Shield className="h-4 w-4" />
//                    <span>Risk Assessment</span>
//                  </div>
//                </TabsTrigger>
//                <TabsTrigger
//                  value="escalation"
//                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                >
//                  <div className="flex items-center gap-2">
//                    <TrendingUp className="h-4 w-4" />
//                    <span>Thresholds</span>
//                  </div>
//                </TabsTrigger>
//                <TabsTrigger
//                  value="review"
//                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                >
//                  <div className="flex items-center gap-2">
//                    <ShieldCheck className="h-4 w-4" />
//                    <span>Review</span>
//                  </div>
//                </TabsTrigger>
//              </TabsList>
//            </Tabs>
//          </div>

//          {/* Form */}
//          <Formik
//            initialValues={initialValues}
//            validationSchema={KYBRuleSchema}
//            onSubmit={handleSubmit}
//          >
//            {({ values, errors, touched, setFieldValue }) => (
//              <Form>
//                <div className="p-8">
//                  {/* Basic Information Tab */}
//                  {activeTab === "basic" && (
//                    <div className="space-y-8 animate-in fade-in duration-300">
//                      <div>
//                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                          Basic Information
//                        </h2>
//                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                          {/* Left Column */}
//                          <div className="space-y-8">
//                            {/* Business Type */}
//                            <div className="space-y-4">
//                              <div className="flex items-center justify-between">
//                                <Label className="text-base font-semibold text-gray-800">
//                                  Business Type *
//                                </Label>
//                                <Badge
//                                  variant="outline"
//                                  className="text-blue-600 border-blue-200"
//                                >
//                                  Required
//                                </Badge>
//                              </div>
//                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                {BUSINESS_TYPES.map((type) => (
//                                  <button
//                                    key={type.value}
//                                    type="button"
//                                    onClick={() =>
//                                      setFieldValue("businessType", type.value)
//                                    }
//                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
//                                      values.businessType === type.value
//                                        ? "border-blue-500 bg-blue-50 shadow-sm"
//                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                                    }`}
//                                  >
//                                    <div className="font-medium text-gray-900">
//                                      {type.label}
//                                    </div>
//                                    <div className="text-sm text-gray-600 mt-1">
//                                      {type.description}
//                                    </div>
//                                  </button>
//                                ))}
//                              </div>
//                              <ErrorMessage
//                                name="businessType"
//                                component="div"
//                                className="text-red-500 text-sm mt-2"
//                              />
//                            </div>

//                            {/* Rule Name */}
//                            <div className="space-y-3">
//                              <Label className="text-base font-semibold text-gray-800">
//                                Rule Name *
//                              </Label>
//                              <div className="relative">
//                                <Field
//                                  as={Input}
//                                  type="text"
//                                  id="name"
//                                  name="name"
//                                  placeholder="e.g., SME KYB Rule"
//                                  className="h-12 pl-4 pr-4 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all"
//                                />
//                                {values.name && !errors.name && (
//                                  <FiCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
//                                )}
//                              </div>
//                              <ErrorMessage
//                                name="name"
//                                component="div"
//                                className="text-red-500 text-sm mt-1"
//                              />
//                            </div>

//                            {/* Auto Approval Limit */}
//                            <div className="space-y-3">
//                              <Label className="text-base font-semibold text-gray-800">
//                                Auto Approval Limit *
//                              </Label>
//                              <div className="relative">
//                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                                  <DollarSign className="h-5 w-5" />
//                                </span>
//                                <Field
//                                  as={Input}
//                                  type="number"
//                                  id="autoApprovalLimit"
//                                  name="autoApprovalLimit"
//                                  className="h-12 pl-12 pr-4 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl"
//                                  min="0"
//                                  step="1000"
//                                  placeholder="0"
//                                />
//                              </div>
//                              <div className="text-sm text-gray-500 mt-2">
//                                Transactions below this amount will be
//                                automatically approved
//                              </div>
//                              <ErrorMessage
//                                name="autoApprovalLimit"
//                                component="div"
//                                className="text-red-500 text-sm mt-1"
//                              />
//                            </div>
//                          </div>

//                          {/* Right Column */}
//                          <div className="space-y-8">
//                            {/* Review Tiers */}
//                            <div className="space-y-4">
//                              <Label className="text-base font-semibold text-gray-800">
//                                Review Tiers *
//                              </Label>
//                              <div className="grid grid-cols-3 gap-4">
//                                {[1, 2, 3].map((tier) => (
//                                  <button
//                                    key={tier}
//                                    type="button"
//                                    onClick={() =>
//                                      setFieldValue("reviewTiers", tier)
//                                    }
//                                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
//                                      values.reviewTiers === tier
//                                        ? "border-blue-500 bg-blue-50 shadow-sm"
//                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                                    }`}
//                                  >
//                                    <div className="text-2xl font-bold text-gray-900">
//                                      {tier}
//                                    </div>
//                                    <div className="text-sm text-gray-600 mt-2">
//                                      {tier === 1
//                                        ? "Single Tier"
//                                        : tier === 2
//                                        ? "Dual Tier"
//                                        : "Triple Tier"}
//                                    </div>
//                                    <div className="text-xs text-gray-500 mt-1">
//                                      {tier === 1
//                                        ? "One reviewer"
//                                        : tier === 2
//                                        ? "Two reviewers"
//                                        : "Three reviewers"}
//                                    </div>
//                                  </button>
//                                ))}
//                              </div>
//                              <ErrorMessage
//                                name="reviewTiers"
//                                component="div"
//                                className="text-red-500 text-sm mt-1"
//                              />
//                            </div>

//                            {/* Max Processing Time */}
//                            <div className="space-y-3">
//                              <Label className="text-base font-semibold text-gray-800">
//                                Max Processing Time *
//                              </Label>
//                              <div className="relative">
//                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                                  <Clock className="h-5 w-5" />
//                                </span>
//                                <Field
//                                  as={Input}
//                                  type="number"
//                                  id="maxProcessingHours"
//                                  name="maxProcessingHours"
//                                  className="h-12 pl-12 pr-20 border-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl"
//                                  min="1"
//                                  max="168"
//                                  placeholder="48"
//                                />
//                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
//                                  hours
//                                </span>
//                              </div>
//                              <div className="flex items-center justify-between text-sm text-gray-500">
//                                <span>Fast processing</span>
//                                <span className="text-blue-600 font-medium">
//                                  {values.maxProcessingHours <= 24
//                                    ? "Express"
//                                    : "Standard"}
//                                </span>
//                                <span>Extended review</span>
//                              </div>
//                              <ErrorMessage
//                                name="maxProcessingHours"
//                                component="div"
//                                className="text-red-500 text-sm mt-1"
//                              />
//                            </div>

//                            {/* Preview Card */}
//                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
//                              <h3 className="font-semibold text-gray-800 mb-3">
//                                Rule Preview
//                              </h3>
//                              <div className="space-y-3">
//                                <div className="flex justify-between items-center">
//                                  <span className="text-gray-600">Type:</span>
//                                  <Badge className="bg-blue-100 text-blue-800">
//                                    {values.businessType}
//                                  </Badge>
//                                </div>
//                                <div className="flex justify-between items-center">
//                                  <span className="text-gray-600">
//                                    Auto Approval:
//                                  </span>
//                                  <span className="font-semibold">
//                                    {formatCurrency(values.autoApprovalLimit)}
//                                  </span>
//                                </div>
//                                <div className="flex justify-between items-center">
//                                  <span className="text-gray-600">
//                                    Review Tiers:
//                                  </span>
//                                  <span className="font-semibold">
//                                    {values.reviewTiers}
//                                  </span>
//                                </div>
//                              </div>
//                            </div>
//                          </div>
//                        </div>
//                      </div>

//                      {/* Navigation Buttons */}
//                      <div className="flex justify-between pt-8 border-t">
//                        <Button
//                          type="button"
//                          variant="outline"
//                          onClick={() =>
//                            isModal && onClose ? onClose() : navigate(-1)
//                          }
//                          className="px-8 py-3 rounded-xl"
//                        >
//                          Cancel
//                        </Button>
//                        <Button
//                          type="button"
//                          onClick={() => setActiveTab("documents")}
//                          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                        >
//                          Continue to Documents
//                          <FiChevronDown className="ml-2 h-5 w-5" />
//                        </Button>
//                      </div>
//                    </div>
//                  )}

//                  {/* Documents Tab */}
//                  {activeTab === "documents" && (
//                    <div className="space-y-8 animate-in fade-in duration-300">
//                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                        Required Documents
//                      </h2>
//                      <p className="text-gray-600 mb-8">
//                        Select documents required for business verification
//                      </p>

//                      <FieldArray name="documents">
//                        {({ push, remove }) => (
//                          <div className="space-y-6">
//                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                              {DOCUMENT_TYPES.map((docType) => {
//                                const isSelected = values.documents.some(
//                                  (doc) => doc.documentCode === docType.code
//                                );
//                                const selectedDoc = values.documents.find(
//                                  (doc) => doc.documentCode === docType.code
//                                );

//                                return (
//                                  <div
//                                    key={docType.code}
//                                    className={`p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
//                                      isSelected
//                                        ? "border-blue-500 bg-blue-50"
//                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                                    }`}
//                                    onClick={() => {
//                                      if (isSelected) {
//                                        const index =
//                                          values.documents.findIndex(
//                                            (doc) =>
//                                              doc.documentCode === docType.code
//                                          );
//                                        if (index !== -1) remove(index);
//                                      } else {
//                                        push({
//                                          documentCode: docType.code,
//                                          required: true,
//                                        });
//                                      }
//                                    }}
//                                  >
//                                    <div className="flex items-start justify-between">
//                                      <div className="flex items-center gap-3">
//                                        <div className="text-2xl">
//                                          {docType.icon}
//                                        </div>
//                                        <div>
//                                          <div className="font-semibold text-gray-900">
//                                            {docType.label}
//                                          </div>
//                                          <div className="text-sm text-gray-500 mt-1">
//                                            {docType.category}
//                                          </div>
//                                        </div>
//                                      </div>
//                                      {isSelected && (
//                                        <FiCheck className="h-5 w-5 text-blue-600" />
//                                      )}
//                                    </div>

//                                    {isSelected && selectedDoc && (
//                                      <div className="mt-4 pt-4 border-t">
//                                        <div className="flex items-center justify-between">
//                                          <span className="text-sm text-gray-600">
//                                            Required for approval
//                                          </span>
//                                          <Switch
//                                            checked={selectedDoc.required}
//                                            onCheckedChange={(checked) => {
//                                              const index =
//                                                values.documents.findIndex(
//                                                  (doc) =>
//                                                    doc.documentCode ===
//                                                    docType.code
//                                                );
//                                              setFieldValue(
//                                                `documents.${index}.required`,
//                                                checked
//                                              );
//                                            }}
//                                            onClick={(e) => e.stopPropagation()}
//                                            className="data-[state=checked]:bg-blue-600"
//                                          />
//                                        </div>
//                                      </div>
//                                    )}
//                                  </div>
//                                );
//                              })}
//                            </div>

//                            <div className="p-6 bg-gray-50 rounded-2xl">
//                              <div className="flex items-center justify-between">
//                                <div>
//                                  <div className="font-semibold text-gray-900">
//                                    Selected Documents (
//                                    {values.documents.length})
//                                  </div>
//                                  <div className="text-sm text-gray-600 mt-1">
//                                    {
//                                      values.documents.filter((d) => d.required)
//                                        .length
//                                    }{" "}
//                                    required,{" "}
//                                    {
//                                      values.documents.filter(
//                                        (d) => !d.required
//                                      ).length
//                                    }{" "}
//                                    optional
//                                  </div>
//                                </div>
//                                <Button
//                                  type="button"
//                                  variant="outline"
//                                  onClick={() =>
//                                    push({ documentCode: "", required: false })
//                                  }
//                                  className="rounded-xl"
//                                >
//                                  <FiPlus className="h-4 w-4 mr-2" />
//                                  Add Custom Document
//                                </Button>
//                              </div>
//                            </div>
//                          </div>
//                        )}
//                      </FieldArray>

//                      {/* Navigation Buttons */}
//                      <div className="flex justify-between pt-8 border-t">
//                        <Button
//                          type="button"
//                          variant="outline"
//                          onClick={() => setActiveTab("basic")}
//                          className="px-8 py-3 rounded-xl"
//                        >
//                          <FiChevronUp className="mr-2 h-5 w-5" />
//                          Back
//                        </Button>
//                        <Button
//                          type="button"
//                          onClick={() => setActiveTab("risks")}
//                          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                        >
//                          Continue to Risk Assessment
//                          <FiChevronDown className="ml-2 h-5 w-5" />
//                        </Button>
//                      </div>
//                    </div>
//                  )}

//                  {/* Risk Assessment Tab */}
//                  {activeTab === "risks" && (
//                    <div className="space-y-8 animate-in fade-in duration-300">
//                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                        Risk Assessment
//                      </h2>
//                      <p className="text-gray-600 mb-8">
//                        Configure risk factors to monitor for this business type
//                      </p>

//                      <FieldArray name="risks">
//                        {({ push, remove }) => (
//                          <div className="space-y-4">
//                            {RISK_TYPES.map((riskType, index) => {
//                              const existingRisk = values.risks.find(
//                                (r) => r.risk === riskType.code
//                              );
//                              const isEnabled = existingRisk?.enabled || false;

//                              return (
//                                <div
//                                  key={riskType.code}
//                                  className="p-5 rounded-xl border-2 transition-all duration-200 hover:border-gray-300"
//                                >
//                                  <div className="flex items-start justify-between">
//                                    <div className="flex items-start gap-4">
//                                      <div className="mt-1">
//                                        <Switch
//                                          checked={isEnabled}
//                                          onCheckedChange={(checked) => {
//                                            if (existingRisk) {
//                                              const riskIndex =
//                                                values.risks.findIndex(
//                                                  (r) =>
//                                                    r.risk === riskType.code
//                                                );
//                                              setFieldValue(
//                                                `risks.${riskIndex}.enabled`,
//                                                checked
//                                              );
//                                            } else {
//                                              push({
//                                                risk: riskType.code,
//                                                enabled: checked,
//                                              });
//                                            }
//                                          }}
//                                          className="data-[state=checked]:bg-red-600"
//                                        />
//                                      </div>
//                                      <div className="flex-1">
//                                        <div className="flex items-center gap-3">
//                                          <div className="font-semibold text-gray-900">
//                                            {riskType.label}
//                                          </div>
//                                          <Badge
//                                            variant="outline"
//                                            className={`text-xs ${getSeverityColor(
//                                              riskType.severity
//                                            )}`}
//                                          >
//                                            {riskType.severity
//                                              .charAt(0)
//                                              .toUpperCase() +
//                                              riskType.severity.slice(1)}
//                                          </Badge>
//                                        </div>
//                                        <div className="text-sm text-gray-600 mt-1">
//                                          {riskType.description}
//                                        </div>
//                                      </div>
//                                    </div>
//                                    {isEnabled ? (
//                                      <Badge className="bg-red-100 text-red-800 border-red-200">
//                                        Active
//                                      </Badge>
//                                    ) : (
//                                      <Badge
//                                        variant="outline"
//                                        className="text-gray-500"
//                                      >
//                                        Inactive
//                                      </Badge>
//                                    )}
//                                  </div>
//                                </div>
//                              );
//                            })}
//                          </div>
//                        )}
//                      </FieldArray>

//                      {/* Risk Summary */}
//                      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl">
//                        <h3 className="font-semibold text-gray-800 mb-4">
//                          Risk Summary
//                        </h3>
//                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                          <div className="text-center p-4 bg-white rounded-xl border">
//                            <div className="text-2xl font-bold text-gray-900">
//                              {values.risks.filter((r) => r.enabled).length}
//                            </div>
//                            <div className="text-sm text-gray-600 mt-1">
//                              Active Risks
//                            </div>
//                          </div>
//                          <div className="text-center p-4 bg-white rounded-xl border">
//                            <div className="text-2xl font-bold text-gray-900">
//                              {values.risks.filter((r) => !r.enabled).length}
//                            </div>
//                            <div className="text-sm text-gray-600 mt-1">
//                              Inactive Risks
//                            </div>
//                          </div>
//                          <div className="text-center p-4 bg-white rounded-xl border">
//                            <div className="text-2xl font-bold text-gray-900">
//                              {RISK_TYPES.length}
//                            </div>
//                            <div className="text-sm text-gray-600 mt-1">
//                              Total Available
//                            </div>
//                          </div>
//                          <div className="text-center p-4 bg-white rounded-xl border">
//                            <div className="text-2xl font-bold text-gray-900">
//                              {Math.round(
//                                (values.risks.filter((r) => r.enabled).length /
//                                  RISK_TYPES.length) *
//                                  100
//                              )}
//                              %
//                            </div>
//                            <div className="text-sm text-gray-600 mt-1">
//                              Coverage
//                            </div>
//                          </div>
//                        </div>
//                      </div>

//                      {/* Navigation Buttons */}
//                      <div className="flex justify-between pt-8 border-t">
//                        <Button
//                          type="button"
//                          variant="outline"
//                          onClick={() => setActiveTab("documents")}
//                          className="px-8 py-3 rounded-xl"
//                        >
//                          <FiChevronUp className="mr-2 h-5 w-5" />
//                          Back
//                        </Button>
//                        <Button
//                          type="button"
//                          onClick={() => setActiveTab("escalation")}
//                          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                        >
//                          Continue to Thresholds
//                          <FiChevronDown className="ml-2 h-5 w-5" />
//                        </Button>
//                      </div>
//                    </div>
//                  )}

//                  {/* Escalation Thresholds Tab */}
//                  {activeTab === "escalation" && (
//                    <div className="space-y-8 animate-in fade-in duration-300">
//                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                        Escalation Thresholds
//                      </h2>
//                      <p className="text-gray-600 mb-8">
//                        Set transaction thresholds for risk escalation
//                      </p>

//                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                        {/* High Risk Threshold */}
//                        <div className="p-6 rounded-2xl border-2 border-yellow-200 bg-gradient-to-b from-yellow-50 to-yellow-100/50">
//                          <div className="flex items-center gap-3 mb-4">
//                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                            <Label className="text-lg font-semibold text-gray-800">
//                              High Risk Threshold
//                            </Label>
//                          </div>
//                          <div className="space-y-4">
//                            <div className="relative">
//                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
//                                <DollarSign className="h-5 w-5" />
//                              </span>
//                              <Field
//                                as={Input}
//                                type="number"
//                                name="escalation.highRisk"
//                                className="h-12 pl-12 pr-4 text-lg border-2 border-yellow-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-xl"
//                                min="0"
//                                step="1000"
//                              />
//                            </div>
//                            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
//                              <div className="font-medium text-gray-800 mb-1">
//                                Enhanced Monitoring
//                              </div>
//                              <p>Triggers additional monitoring and alerts</p>
//                            </div>
//                          </div>
//                        </div>

//                        {/* EDD Threshold */}
//                        <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-orange-100/50">
//                          <div className="flex items-center gap-3 mb-4">
//                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                            <Label className="text-lg font-semibold text-gray-800">
//                              EDD Threshold
//                            </Label>
//                          </div>
//                          <div className="space-y-4">
//                            <div className="relative">
//                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
//                                <DollarSign className="h-5 w-5" />
//                              </span>
//                              <Field
//                                as={Input}
//                                type="number"
//                                name="escalation.edd"
//                                className="h-12 pl-12 pr-4 text-lg border-2 border-orange-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl"
//                                min="0"
//                                step="1000"
//                              />
//                            </div>
//                            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
//                              <div className="font-medium text-gray-800 mb-1">
//                                Enhanced Due Diligence
//                              </div>
//                              <p>
//                                Requires additional documentation and
//                                verification
//                              </p>
//                            </div>
//                          </div>
//                        </div>

//                        {/* Manual Review Threshold */}
//                        <div className="p-6 rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-red-100/50">
//                          <div className="flex items-center gap-3 mb-4">
//                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                            <Label className="text-lg font-semibold text-gray-800">
//                              Manual Review
//                            </Label>
//                          </div>
//                          <div className="space-y-4">
//                            <div className="relative">
//                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
//                                <DollarSign className="h-5 w-5" />
//                              </span>
//                              <Field
//                                as={Input}
//                                type="number"
//                                name="escalation.manualReview"
//                                className="h-12 pl-12 pr-4 text-lg border-2 border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl"
//                                min="0"
//                                step="1000"
//                              />
//                            </div>
//                            <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
//                              <div className="font-medium text-gray-800 mb-1">
//                                Manual Approval Required
//                              </div>
//                              <p>
//                                Transaction requires manual approval by manager
//                              </p>
//                            </div>
//                          </div>
//                        </div>
//                      </div>

//                      {/* Threshold Flow Visualization */}
//                      <div className="mt-12">
//                        <h3 className="text-lg font-semibold text-gray-800 mb-6">
//                          Threshold Flow Visualization
//                        </h3>
//                        <div className="relative">
//                          {/* Flow Line */}
//                          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 -translate-y-1/2"></div>

//                          {/* Points */}
//                          <div className="relative flex justify-between">
//                            {[
//                              {
//                                label: "Start",
//                                value: 0,
//                                color: "bg-green-500",
//                              },
//                              {
//                                label: "High Risk",
//                                value: values.escalation.highRisk,
//                                color: "bg-yellow-500",
//                              },
//                              {
//                                label: "EDD",
//                                value: values.escalation.edd,
//                                color: "bg-orange-500",
//                              },
//                              {
//                                label: "Manual Review",
//                                value: values.escalation.manualReview,
//                                color: "bg-red-500",
//                              },
//                            ].map((point, index) => (
//                              <div
//                                key={index}
//                                className="flex flex-col items-center"
//                              >
//                                <div
//                                  className={`w-6 h-6 ${point.color} rounded-full border-4 border-white shadow-lg z-10`}
//                                ></div>
//                                <div className="mt-8 text-center">
//                                  <div className="font-semibold text-gray-900">
//                                    {formatCurrency(point.value)}
//                                  </div>
//                                  <div className="text-sm text-gray-600 mt-1">
//                                    {point.label}
//                                  </div>
//                                </div>
//                              </div>
//                            ))}
//                          </div>
//                        </div>
//                      </div>

//                      {/* Navigation Buttons */}
//                      <div className="flex justify-between pt-8 border-t">
//                        <Button
//                          type="button"
//                          variant="outline"
//                          onClick={() => setActiveTab("risks")}
//                          className="px-8 py-3 rounded-xl"
//                        >
//                          <FiChevronUp className="mr-2 h-5 w-5" />
//                          Back
//                        </Button>
//                        <Button
//                          type="button"
//                          onClick={() => setActiveTab("review")}
//                          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                        >
//                          Review & Create
//                          <FiChevronDown className="ml-2 h-5 w-5" />
//                        </Button>
//                      </div>
//                    </div>
//                  )}

//                  {/* Review Tab */}
//                  {activeTab === "review" && (
//                    <div className="space-y-8 animate-in fade-in duration-300">
//                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                        Review & Create
//                      </h2>
//                      <p className="text-gray-600 mb-8">
//                        Review your KYB rule configuration before creating
//                      </p>

//                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                        {/* Summary Cards */}
//                        <div className="lg:col-span-2 space-y-6">
//                          <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                            <h3 className="font-semibold text-gray-800 mb-4">
//                              Rule Summary
//                            </h3>
//                            <div className="space-y-4">
//                              <div className="flex justify-between items-center py-3 border-b">
//                                <span className="text-gray-600">
//                                  Business Type
//                                </span>
//                                <Badge className="bg-blue-100 text-blue-800">
//                                  {values.businessType}
//                                </Badge>
//                              </div>
//                              <div className="flex justify-between items-center py-3 border-b">
//                                <span className="text-gray-600">Rule Name</span>
//                                <span className="font-semibold">
//                                  {values.name || "Not set"}
//                                </span>
//                              </div>
//                              <div className="flex justify-between items-center py-3 border-b">
//                                <span className="text-gray-600">
//                                  Auto Approval Limit
//                                </span>
//                                <span className="font-semibold">
//                                  {formatCurrency(values.autoApprovalLimit)}
//                                </span>
//                              </div>
//                              <div className="flex justify-between items-center py-3 border-b">
//                                <span className="text-gray-600">
//                                  Review Tiers
//                                </span>
//                                <span className="font-semibold">
//                                  {values.reviewTiers}
//                                </span>
//                              </div>
//                              <div className="flex justify-between items-center py-3">
//                                <span className="text-gray-600">
//                                  Max Processing Time
//                                </span>
//                                <span className="font-semibold">
//                                  {values.maxProcessingHours} hours
//                                </span>
//                              </div>
//                            </div>
//                          </div>

//                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                              <div className="flex items-center gap-3 mb-4">
//                                <FileText className="h-5 w-5 text-green-600" />
//                                <h3 className="font-semibold text-gray-800">
//                                  Documents
//                                </h3>
//                              </div>
//                              <div className="space-y-2">
//                                <div className="text-2xl font-bold text-gray-900">
//                                  {values.documents.length}
//                                </div>
//                                <div className="text-sm text-gray-600">
//                                  {
//                                    values.documents.filter((d) => d.required)
//                                      .length
//                                  }{" "}
//                                  required
//                                </div>
//                              </div>
//                            </div>

//                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                              <div className="flex items-center gap-3 mb-4">
//                                <Shield className="h-5 w-5 text-red-600" />
//                                <h3 className="font-semibold text-gray-800">
//                                  Risk Factors
//                                </h3>
//                              </div>
//                              <div className="space-y-2">
//                                <div className="text-2xl font-bold text-gray-900">
//                                  {values.risks.filter((r) => r.enabled).length}
//                                </div>
//                                <div className="text-sm text-gray-600">
//                                  Active risk monitoring
//                                </div>
//                              </div>
//                            </div>
//                          </div>
//                        </div>

//                        {/* Create Card */}
//                        <div className="bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
//                          <div className="text-center mb-6">
//                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                              <ShieldCheck className="h-8 w-8 text-white" />
//                            </div>
//                            <h3 className="font-bold text-gray-900 text-lg">
//                              Ready to Create
//                            </h3>
//                            <p className="text-gray-600 mt-2">
//                              Review all settings before creating the rule
//                            </p>
//                          </div>

//                          <div className="space-y-4">
//                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
//                              <FiCheck className="h-5 w-5 text-green-500" />
//                              <span className="text-sm">
//                                All required fields are filled
//                              </span>
//                            </div>
//                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
//                              <FiCheck className="h-5 w-5 text-green-500" />
//                              <span className="text-sm">
//                                Thresholds are properly configured
//                              </span>
//                            </div>
//                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
//                              <FiCheck className="h-5 w-5 text-green-500" />
//                              <span className="text-sm">
//                                Minimum documents selected
//                              </span>
//                            </div>
//                          </div>

//                          <div className="mt-8 space-y-4">
//                            <Button
//                              type="submit"
//                              disabled={isSubmitting}
//                              className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg"
//                            >
//                              {isSubmitting ? (
//                                <>
//                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
//                                  Creating Rule...
//                                </>
//                              ) : (
//                                "Create KYB Rule"
//                              )}
//                            </Button>

//                            <Button
//                              type="button"
//                              variant="outline"
//                              onClick={() => setActiveTab("basic")}
//                              className="w-full py-3 rounded-xl"
//                            >
//                              Edit Configuration
//                            </Button>
//                          </div>
//                        </div>
//                      </div>
//                    </div>
//                  )}
//                </div>
//              </Form>
//            )}
//          </Formik>
//        </div>
//      </div>
//    </div>
//  );
//};

//export default CreateKybRule;

//import React, { useState } from "react";
//import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
//import * as Yup from "yup";
//import axios from "axios";
//import { useCookies } from "react-cookie";
//import BASE_URL from "@/config/config";
//import { useNavigate } from "react-router-dom";
//import {
//  FiPlus,
//  FiTrash2,
//  FiChevronDown,
//  FiChevronUp,
//  FiArrowLeft,
//} from "react-icons/fi";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import { Checkbox } from "@/components/ui/checkbox";
//import { Switch } from "@/components/ui/switch";
//import { Badge } from "@/components/ui/badge";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import {
//  AlertCircle,
//  CheckCircle,
//  DollarSign,
//  Clock,
//  FileText,
//  Shield,
//  AlertTriangle,
//  Users,
//  Building,
//} from "lucide-react";

///* ================= TYPES & ENUMS ================= */

//type BusinessType = "STANDARD" | "SME" | "CORPORATE" | "EXCHANGE" | "HIGH_RISK";

//interface DocumentType {
//  documentCode: string;
//  required: boolean;
//}

//interface RiskType {
//  risk: string;
//  enabled: boolean;
//}

//interface EscalationType {
//  highRisk: number;
//  edd: number;
//  manualReview: number;
//}

//interface KYBRuleFormValues {
//  businessType: BusinessType;
//  name: string;
//  autoApprovalLimit: number;
//  reviewTiers: number;
//  maxProcessingHours: number;
//  documents: DocumentType[];
//  risks: RiskType[];
//  escalation: EscalationType;
//}

//interface CreateKybRuleProps {
//  isModal?: boolean;
//  onClose?: () => void;
//  onSuccess?: () => void;
//}

///* ================= CONSTANTS ================= */

//const BUSINESS_TYPES: BusinessType[] = [
//  "STANDARD",
//  "SME",
//  "CORPORATE",
//  "EXCHANGE",
//  "HIGH_RISK",
//];

//const DOCUMENT_TYPES = [
//  {
//    code: "BUSINESS_REGISTRATION",
//    label: "Business Registration",
//    category: "Business",
//  },
//  { code: "TAX_CERTIFICATE", label: "Tax Certificate", category: "Financial" },
//  { code: "OWNER_ID", label: "Owner ID", category: "Identification" },
//  { code: "PROOF_OF_ADDRESS", label: "Proof of Address", category: "Address" },
//  { code: "BANK_STATEMENT", label: "Bank Statement", category: "Financial" },
//  { code: "LICENSE", label: "Business License", category: "Regulatory" },
//  {
//    code: "ARTICLES_OF_INCORPORATION",
//    label: "Articles of Incorporation",
//    category: "Business",
//  },
//];

//const RISK_TYPES = [
//  {
//    code: "HIGH_TRANSACTION_VOLUME",
//    label: "High Transaction Volume",
//    description: "Large transaction volumes",
//  },
//  {
//    code: "UNVERIFIED_OWNER",
//    label: "Unverified Owner",
//    description: "Owners without proper verification",
//  },
//  {
//    code: "PEP_ASSOCIATION",
//    label: "PEP Association",
//    description: "Politically Exposed Persons",
//  },
//  {
//    code: "SANCTIONED_COUNTRY",
//    label: "Sanctioned Country",
//    description: "Operations in sanctioned countries",
//  },
//  {
//    code: "HIGH_RISK_INDUSTRY",
//    label: "High Risk Industry",
//    description: "High-risk business sectors",
//  },
//  {
//    code: "NEW_BUSINESS",
//    label: "New Business (< 2 years)",
//    description: "Recently established businesses",
//  },
//];

///* ================= VALIDATION SCHEMA ================= */

//const KYBRuleSchema = Yup.object().shape({
//  businessType: Yup.string()
//    .oneOf(["STANDARD", "SME", "CORPORATE", "EXCHANGE", "HIGH_RISK"])
//    .required("Business type is required"),

//  name: Yup.string()
//    .min(3, "Name must be at least 3 characters")
//    .max(100, "Name must not exceed 100 characters")
//    .required("Rule name is required"),

//  autoApprovalLimit: Yup.number()
//    .min(0, "Auto approval limit cannot be negative")
//    .required("Auto approval limit is required"),

//  reviewTiers: Yup.number()
//    .min(1, "Minimum 1 review tier")
//    .max(3, "Maximum 3 review tiers")
//    .integer("Review tiers must be a whole number")
//    .required("Review tiers is required"),

//  maxProcessingHours: Yup.number()
//    .min(1, "Minimum 1 hour processing time")
//    .max(168, "Maximum 7 days (168 hours)")
//    .integer("Processing hours must be a whole number")
//    .required("Max processing hours is required"),

//  documents: Yup.array()
//    .of(
//      Yup.object().shape({
//        documentCode: Yup.string().required("Document type is required"),
//        required: Yup.boolean(),
//      })
//    )
//    .min(1, "At least one document is required"),

//  risks: Yup.array().of(
//    Yup.object().shape({
//      risk: Yup.string().required("Risk type is required"),
//      enabled: Yup.boolean(),
//    })
//  ),

//  escalation: Yup.object()
//    .shape({
//      highRisk: Yup.number()
//        .min(0, "High risk threshold cannot be negative")
//        .required("High risk threshold is required"),
//      edd: Yup.number()
//        .min(0, "EDD threshold cannot be negative")
//        .required("EDD threshold is required"),
//      manualReview: Yup.number()
//        .min(0, "Manual review threshold cannot be negative")
//        .required("Manual review threshold is required"),
//    })
//    .test(
//      "escalation-order",
//      "Thresholds must be in ascending order (highRisk ≤ edd ≤ manualReview)",
//      function (value) {
//        if (!value) return true;
//        return value.highRisk <= value.edd && value.edd <= value.manualReview;
//      }
//    ),
//});

///* ================= INITIAL VALUES ================= */

//const initialValues: KYBRuleFormValues = {
//  businessType: "STANDARD",
//  name: "",
//  autoApprovalLimit: 100000,
//  reviewTiers: 2,
//  maxProcessingHours: 48,
//  documents: [
//    { documentCode: "BUSINESS_REGISTRATION", required: true },
//    { documentCode: "TAX_CERTIFICATE", required: false },
//  ],
//  risks: [
//    { risk: "HIGH_TRANSACTION_VOLUME", enabled: true },
//    { risk: "UNVERIFIED_OWNER", enabled: false },
//  ],
//  escalation: {
//    highRisk: 50000,
//    edd: 100000,
//    manualReview: 200000,
//  },
//};

///* ================= MAIN COMPONENT ================= */

//const CreateKybRule: React.FC<CreateKybRuleProps> = ({
//  isModal = false,
//  onClose,
//  onSuccess,
//}) => {
//  const navigate = useNavigate();
//  const [cookies] = useCookies(["token"]);
//  const token = cookies.token;

//  const [successMessage, setSuccessMessage] = useState<string>("");
//  const [errorMessage, setErrorMessage] = useState<string>("");
//  const [expandedSections, setExpandedSections] = useState({
//    documents: true,
//    risks: true,
//    escalation: true,
//  });
//  const [isSubmitting, setIsSubmitting] = useState(false);

//  const handleSubmit = async (values: KYBRuleFormValues) => {
//    try {
//      setIsSubmitting(true);
//      setSuccessMessage("");
//      setErrorMessage("");

//      console.log("Submitting KYB Rule:", values);

//      const response = await axios.post(
//        `${BASE_URL}/api/v3/kyb/rules/create`,
//        values,
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//            "Content-Type": "application/json",
//          },
//        }
//      );

//      console.log("API Response:", response.data);

//      if (response.data.status) {
//        setSuccessMessage("KYB Rule created successfully!");

//        // Handle success based on modal or page mode
//        if (isModal) {
//          setTimeout(() => {
//            if (onSuccess) onSuccess();
//            if (onClose) onClose();
//          }, 1500);
//        } else {
//          setTimeout(() => {
//            navigate("/exchange/kyb-config");
//          }, 2000);
//        }
//      } else {
//        setErrorMessage(response.data.message || "Failed to create rule");
//      }
//    } catch (error: any) {
//      console.error("Error creating KYB rule:", error);
//      setErrorMessage(
//        error.response?.data?.message ||
//          error.response?.data?.error ||
//          "Failed to create KYB rule. Please try again."
//      );
//    } finally {
//      setIsSubmitting(false);
//    }
//  };

//  const toggleSection = (section: keyof typeof expandedSections) => {
//    setExpandedSections((prev) => ({
//      ...prev,
//      [section]: !prev[section],
//    }));
//  };

//  const formatCurrency = (value: number) => {
//    return new Intl.NumberFormat("en-US", {
//      style: "currency",
//      currency: "USD",
//      minimumFractionDigits: 0,
//      maximumFractionDigits: 0,
//    }).format(value);
//  };

//  return (
//    <div className={isModal ? "" : "min-h-screen bg-gray-50"}>
//      {/* Header with Back Button */}
//      {!isModal && (
//        <div className="bg-white border-b">
//          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//            <div className="flex items-center justify-center space-x-4">
//              <Button
//                variant="ghost"
//                size="sm"
//                onClick={() => navigate(-1)}
//                className="flex items-center text-gray-600 hover:text-gray-900"
//              >
//                <FiArrowLeft className="h-8 w-8" />
//                Back
//              </Button>
//              <div className="flex-1 text-center">
//                <h1 className="text-2xl font-bold text-gray-900">
//                  Create KYB Rule
//                </h1>
//                <p className="text-sm text-gray-600">
//                  Configure a new Know Your Business rule for different business
//                  types
//                </p>
//              </div>
//            </div>
//          </div>
//        </div>
//      )}

//      <div
//        className={
//          isModal ? "p-1" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
//        }
//      >
//        {/* Success/Error Messages */}
//        {successMessage && (
//          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
//            <div className="flex items-start">
//              <div className="flex-shrink-0">
//                <CheckCircle className="h-5 w-5 text-green-600" />
//              </div>
//              <div className="ml-3">
//                <h3 className="text-sm font-medium text-green-800">
//                  {successMessage}
//                </h3>
//                <p className="text-sm text-green-700 mt-1">
//                  {isModal
//                    ? "Rule has been created successfully. You can close this window."
//                    : "Redirecting to KYB rules list..."}
//                </p>
//              </div>
//            </div>
//          </div>
//        )}

//        {errorMessage && (
//          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//            <div className="flex items-start">
//              <div className="flex-shrink-0">
//                <AlertCircle className="h-5 w-5 text-red-600" />
//              </div>
//              <div className="ml-3">
//                <h3 className="text-sm font-medium text-red-800">
//                  Unable to create rule
//                </h3>
//                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
//              </div>
//            </div>
//          </div>
//        )}

//        {/* Form */}
//        <Formik
//          initialValues={initialValues}
//          validationSchema={KYBRuleSchema}
//          onSubmit={handleSubmit}
//        >
//          {({ values, errors, touched, setFieldValue }) => (
//            <Form className="space-y-6">
//              {/* Basic Information Card */}
//              <Card className="border shadow-sm">
//                <CardHeader className="bg-gray-50 border-b">
//                  <div className="flex items-center space-x-3">
//                    <div className="p-2 bg-blue-100 rounded-lg">
//                      <Building className="h-5 w-5 text-blue-600" />
//                    </div>
//                    <div>
//                      <CardTitle className="text-lg">
//                        Basic Information
//                      </CardTitle>
//                      <p className="text-sm text-gray-500">
//                        Core details about the KYB rule
//                      </p>
//                    </div>
//                  </div>
//                </CardHeader>
//                <CardContent className="pt-6">
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {/* Business Type */}
//                    <div className="space-y-3">
//                      <Label
//                        htmlFor="businessType"
//                        className="text-sm font-medium"
//                      >
//                        Business Type *
//                      </Label>
//                      <Select
//                        value={values.businessType}
//                        onValueChange={(value: BusinessType) =>
//                          setFieldValue("businessType", value)
//                        }
//                      >
//                        <SelectTrigger id="businessType" className="h-11">
//                          <SelectValue placeholder="Select business type" />
//                        </SelectTrigger>
//                        <SelectContent>
//                          {BUSINESS_TYPES.map((type) => (
//                            <SelectItem key={type} value={type}>
//                              <div className="flex flex-col">
//                                <span className="font-medium">{type}</span>
//                              </div>
//                            </SelectItem>
//                          ))}
//                        </SelectContent>
//                      </Select>
//                      <ErrorMessage
//                        name="businessType"
//                        component="div"
//                        className="text-red-500 text-sm mt-1"
//                      />
//                    </div>

//                    {/* Rule Name */}
//                    <div className="space-y-3">
//                      <Label htmlFor="name" className="text-sm font-medium">
//                        Rule Name *
//                      </Label>
//                      <Field
//                        as={Input}
//                        type="text"
//                        id="name"
//                        name="name"
//                        placeholder="e.g., SME KYB Rule"
//                        className="h-11"
//                      />
//                      <ErrorMessage
//                        name="name"
//                        component="div"
//                        className="text-red-500 text-sm mt-1"
//                      />
//                    </div>

//                    {/* Auto Approval Limit */}
//                    <div className="space-y-3">
//                      <Label
//                        htmlFor="autoApprovalLimit"
//                        className="text-sm font-medium"
//                      >
//                        Auto Approval Limit *
//                      </Label>
//                      <div className="relative">
//                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                          <DollarSign className="h-4 w-4" />
//                        </span>
//                        <Field
//                          as={Input}
//                          type="number"
//                          id="autoApprovalLimit"
//                          name="autoApprovalLimit"
//                          className="h-11 pl-10"
//                          min="0"
//                          step="1000"
//                          placeholder="0"
//                        />
//                      </div>
//                      <div className="flex items-center justify-between">
//                        {touched.autoApprovalLimit &&
//                          errors.autoApprovalLimit && (
//                            <ErrorMessage
//                              name="autoApprovalLimit"
//                              component="div"
//                              className="text-red-500 text-xs"
//                            />
//                          )}
//                      </div>
//                    </div>

//                    {/* Review Tiers */}
//                    <div className="space-y-1">
//                      <Label className="text-sm font-medium">
//                        Review Tiers *
//                      </Label>
//                      <div className="grid grid-cols-3 gap-2">
//                        {[1, 2, 3].map((tier) => (
//                          <button
//                            key={tier}
//                            type="button"
//                            onClick={() => setFieldValue("reviewTiers", tier)}
//                            className={`flex flex-col items-center justify-center px-2 py-1
//                               border rounded-lg transition-all ${
//                                 values.reviewTiers === tier
//                                   ? "bg-blue-50 border-blue-500 text-blue-700"
//                                   : "border-gray-300 text-gray-700 hover:bg-gray-50"
//                               }`}
//                          >
//                            <span className="font-medium">{tier}</span>
//                            <span className="text-xs text-gray-500 mt-1">
//                              {tier === 1
//                                ? "Single"
//                                : tier === 2
//                                ? "Dual"
//                                : "Triple"}
//                            </span>
//                          </button>
//                        ))}
//                      </div>
//                      <ErrorMessage
//                        name="reviewTiers"
//                        component="div"
//                        className="text-red-500 text-sm mt-1"
//                      />
//                    </div>

//                    {/* Max Processing Hours */}
//                    <div className="space-y-3">
//                      <Label
//                        htmlFor="maxProcessingHours"
//                        className="text-sm font-medium"
//                      >
//                        Max Processing Time *
//                      </Label>
//                      <div className="relative">
//                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                          <Clock className="h-4 w-4" />
//                        </span>
//                        <Field
//                          as={Input}
//                          type="number"
//                          id="maxProcessingHours"
//                          name="maxProcessingHours"
//                          className="h-11 pl-10 pr-20"
//                          min="1"
//                          max="168"
//                          placeholder="48"
//                        />
//                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
//                          hours
//                        </span>
//                      </div>

//                    </div>
//                  </div>
//                </CardContent>
//              </Card>

//              {/* Documents Section */}
//              <Card className="border shadow-sm">
//                <div
//                  className="cursor-pointer hover:bg-gray-50 transition-colors"
//                  onClick={() => toggleSection("documents")}
//                >
//                  <CardHeader className="flex flex-row items-center justify-between">
//                    <div className="flex items-center space-x-3">
//                      <div className="p-2 bg-green-100 rounded-lg">
//                        <FileText className="h-5 w-5 text-green-600" />
//                      </div>
//                      <div>
//                        <CardTitle className="text-lg">
//                          Required Documents
//                        </CardTitle>
//                        <p className="text-sm text-gray-500">
//                          Documents needed for business verification
//                        </p>
//                      </div>
//                    </div>
//                    <div className="flex items-center space-x-2">
//                      <Badge variant="secondary" className="px-2 py-1">
//                        {values.documents.length}{" "}
//                        {values.documents.length === 1
//                          ? "document"
//                          : "documents"}
//                      </Badge>
//                      {expandedSections.documents ? (
//                        <FiChevronUp className="h-5 w-5 text-gray-400" />
//                      ) : (
//                        <FiChevronDown className="h-5 w-5 text-gray-400" />
//                      )}
//                    </div>
//                  </CardHeader>
//                </div>

//                {expandedSections.documents && (
//                  <CardContent className="border-t pt-6">
//                    <FieldArray name="documents">
//                      {({ push, remove }) => (
//                        <div className="space-y-4">
//                          {values.documents.map((doc, index) => (
//                            <div
//                              key={index}
//                              className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50/50"
//                            >
//                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                {/* Document Type */}
//                                <div className="space-y-2">
//                                  <Label
//                                    htmlFor={`documents.${index}.documentCode`}
//                                    className="text-sm font-medium"
//                                  >
//                                    Document Type *
//                                  </Label>
//                                  <Select
//                                    value={doc.documentCode}
//                                    onValueChange={(value) =>
//                                      setFieldValue(
//                                        `documents.${index}.documentCode`,
//                                        value
//                                      )
//                                    }
//                                  >
//                                    <SelectTrigger className="h-10">
//                                      <SelectValue placeholder="Select document type" />
//                                    </SelectTrigger>
//                                    <SelectContent>
//                                      {DOCUMENT_TYPES.map((docType) => (
//                                        <SelectItem
//                                          key={docType.code}
//                                          value={docType.code}
//                                        >
//                                          <div className="flex flex-col">
//                                            <span>{docType.label}</span>
//                                            <span className="text-xs text-gray-500">
//                                              {docType.category}
//                                            </span>
//                                          </div>
//                                        </SelectItem>
//                                      ))}
//                                    </SelectContent>
//                                  </Select>
//                                  <ErrorMessage
//                                    name={`documents.${index}.documentCode`}
//                                    component="div"
//                                    className="text-red-500 text-xs"
//                                  />
//                                </div>

//                                {/* Required */}
//                                <div className="flex items-center space-x-3 pt-6">
//                                  <Switch
//                                    id={`documents.${index}.required`}
//                                    checked={doc.required}
//                                    onCheckedChange={(checked) =>
//                                      setFieldValue(
//                                        `documents.${index}.required`,
//                                        checked
//                                      )
//                                    }
//                                  />
//                                  <div>
//                                    <Label
//                                      htmlFor={`documents.${index}.required`}
//                                      className="cursor-pointer font-medium"
//                                    >
//                                      Required for approval
//                                    </Label>
//                                    <p className="text-xs text-gray-500">
//                                      This document must be provided
//                                    </p>
//                                  </div>
//                                </div>
//                              </div>

//                              {/* Remove Button */}
//                              {values.documents.length > 1 && (
//                                <Button
//                                  type="button"
//                                  variant="ghost"
//                                  size="icon"
//                                  onClick={() => remove(index)}
//                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50"
//                                >
//                                  <FiTrash2 className="h-4 w-4" />
//                                </Button>
//                              )}
//                            </div>
//                          ))}

//                          {/* Add Document Button */}
//                          <Button
//                            type="button"
//                            variant="outline"
//                            onClick={() =>
//                              push({ documentCode: "", required: false })
//                            }
//                            className="w-full h-11 border-dashed"
//                          >
//                            <FiPlus className="h-4 w-4 mr-2" />
//                            Add Document Requirement
//                          </Button>
//                        </div>
//                      )}
//                    </FieldArray>
//                    {errors.documents &&
//                      typeof errors.documents === "string" && (
//                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
//                          <p className="text-red-600 text-sm">
//                            {errors.documents}
//                          </p>
//                        </div>
//                      )}
//                  </CardContent>
//                )}
//              </Card>

//              {/* Risk Assessment Section */}
//              <Card className="border shadow-sm">
//                <div
//                  className="cursor-pointer hover:bg-gray-50 transition-colors"
//                  onClick={() => toggleSection("risks")}
//                >
//                  <CardHeader className="flex flex-row items-center justify-between">
//                    <div className="flex items-center space-x-3">
//                      <div className="p-2 bg-red-100 rounded-lg">
//                        <Shield className="h-5 w-5 text-red-600" />
//                      </div>
//                      <div>
//                        <CardTitle className="text-lg">
//                          Risk Assessment
//                        </CardTitle>
//                        <p className="text-sm text-gray-500">
//                          Risk factors to monitor for this business type
//                        </p>
//                      </div>
//                    </div>
//                    <div className="flex items-center space-x-2">
//                      <Badge variant="secondary" className="px-2 py-1">
//                        {values.risks.filter((r) => r.enabled).length} enabled
//                      </Badge>
//                      {expandedSections.risks ? (
//                        <FiChevronUp className="h-5 w-5 text-gray-400" />
//                      ) : (
//                        <FiChevronDown className="h-5 w-5 text-gray-400" />
//                      )}
//                    </div>
//                  </CardHeader>
//                </div>

//                {expandedSections.risks && (
//                  <CardContent className="border-t pt-6">
//                    <FieldArray name="risks">
//                      {({ push, remove }) => (
//                        <div className="space-y-4">
//                          {values.risks.map((risk, index) => (
//                            <div
//                              key={index}
//                              className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50/50"
//                            >
//                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                {/* Risk Type */}
//                                <div className="space-y-2">
//                                  <Label
//                                    htmlFor={`risks.${index}.risk`}
//                                    className="text-sm font-medium"
//                                  >
//                                    Risk Factor *
//                                  </Label>
//                                  <Select
//                                    value={risk.risk}
//                                    onValueChange={(value) =>
//                                      setFieldValue(
//                                        `risks.${index}.risk`,
//                                        value
//                                      )
//                                    }
//                                  >
//                                    <SelectTrigger className="h-10">
//                                      <SelectValue placeholder="Select risk factor" />
//                                    </SelectTrigger>
//                                    <SelectContent>
//                                      {RISK_TYPES.map((riskType) => (
//                                        <SelectItem
//                                          key={riskType.code}
//                                          value={riskType.code}
//                                        >
//                                          <div className="flex flex-col">
//                                            <span>{riskType.label}</span>
//                                            <span className="text-xs text-gray-500">
//                                              {riskType.description}
//                                            </span>
//                                          </div>
//                                        </SelectItem>
//                                      ))}
//                                    </SelectContent>
//                                  </Select>
//                                </div>

//                                {/* Enabled Switch */}
//                                <div className="flex items-center space-x-3 pt-6">
//                                  <Switch
//                                    id={`risks.${index}.enabled`}
//                                    checked={risk.enabled}
//                                    onCheckedChange={(checked) =>
//                                      setFieldValue(
//                                        `risks.${index}.enabled`,
//                                        checked
//                                      )
//                                    }
//                                    className="data-[state=checked]:bg-red-600"
//                                  />
//                                  <div>
//                                    <Label
//                                      htmlFor={`risks.${index}.enabled`}
//                                      className={`cursor-pointer font-medium ${
//                                        risk.enabled
//                                          ? "text-red-700"
//                                          : "text-gray-700"
//                                      }`}
//                                    >
//                                      {risk.enabled
//                                        ? "Active Monitoring"
//                                        : "Disabled"}
//                                    </Label>
//                                    <p className="text-xs text-gray-500">
//                                      {risk.enabled
//                                        ? "This risk will be monitored"
//                                        : "This risk will be ignored"}
//                                    </p>
//                                  </div>
//                                </div>
//                              </div>

//                              {/* Remove Button */}
//                              {values.risks.length > 1 && (
//                                <Button
//                                  type="button"
//                                  variant="ghost"
//                                  size="icon"
//                                  onClick={() => remove(index)}
//                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50"
//                                >
//                                  <FiTrash2 className="h-4 w-4" />
//                                </Button>
//                              )}
//                            </div>
//                          ))}

//                          {/* Add Risk Button */}
//                          <Button
//                            type="button"
//                            variant="outline"
//                            onClick={() => push({ risk: "", enabled: false })}
//                            className="w-full h-11 border-dashed"
//                          >
//                            <FiPlus className="h-4 w-4 mr-2" />
//                            Add Risk Factor
//                          </Button>
//                        </div>
//                      )}
//                    </FieldArray>
//                  </CardContent>
//                )}
//              </Card>

//              {/* Escalation Thresholds */}
//              <Card className="border shadow-sm">
//                <div
//                  className="cursor-pointer hover:bg-gray-50 transition-colors"
//                  onClick={() => toggleSection("escalation")}
//                >
//                  <CardHeader className="flex flex-row items-center justify-between">
//                    <div className="flex items-center space-x-3">
//                      <div className="p-2 bg-orange-100 rounded-lg">
//                        <AlertTriangle className="h-5 w-5 text-orange-600" />
//                      </div>
//                      <div>
//                        <CardTitle className="text-lg">
//                          Escalation Thresholds
//                        </CardTitle>
//                        <p className="text-sm text-gray-500">
//                          Transaction thresholds for risk escalation
//                        </p>
//                      </div>
//                    </div>
//                    {expandedSections.escalation ? (
//                      <FiChevronUp className="h-5 w-5 text-gray-400" />
//                    ) : (
//                      <FiChevronDown className="h-5 w-5 text-gray-400" />
//                    )}
//                  </CardHeader>
//                </div>

//                {expandedSections.escalation && (
//                  <CardContent className="border-t pt-6">
//                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                      {/* High Risk Threshold */}
//                      <div className="space-y-3">
//                        <div className="flex items-center space-x-2">
//                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                          <Label
//                            htmlFor="escalation.highRisk"
//                            className="text-sm font-medium"
//                          >
//                            High Risk Threshold *
//                          </Label>
//                        </div>
//                        <div className="relative">
//                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                            <DollarSign className="h-4 w-4" />
//                          </span>
//                          <Field
//                            as={Input}
//                            type="number"
//                            id="escalation.highRisk"
//                            name="escalation.highRisk"
//                            className="h-11 pl-10"
//                            min="0"
//                            step="1000"
//                            placeholder="50000"
//                          />
//                        </div>
//                        <p className="text-xs text-gray-500">
//                          Triggers enhanced monitoring
//                        </p>
//                        <ErrorMessage
//                          name="escalation.highRisk"
//                          component="div"
//                          className="text-red-500 text-sm mt-1"
//                        />
//                      </div>

//                      {/* EDD Threshold */}
//                      <div className="space-y-3">
//                        <div className="flex items-center space-x-2">
//                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                          <Label
//                            htmlFor="escalation.edd"
//                            className="text-sm font-medium"
//                          >
//                            EDD Threshold *
//                          </Label>
//                        </div>
//                        <div className="relative">
//                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                            <DollarSign className="h-4 w-4" />
//                          </span>
//                          <Field
//                            as={Input}
//                            type="number"
//                            id="escalation.edd"
//                            name="escalation.edd"
//                            className="h-11 pl-10"
//                            min="0"
//                            step="1000"
//                            placeholder="100000"
//                          />
//                        </div>
//                        <p className="text-xs text-gray-500">
//                          Triggers Enhanced Due Diligence
//                        </p>
//                        <ErrorMessage
//                          name="escalation.edd"
//                          component="div"
//                          className="text-red-500 text-sm mt-1"
//                        />
//                      </div>

//                      {/* Manual Review Threshold */}
//                      <div className="space-y-3">
//                        <div className="flex items-center space-x-2">
//                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                          <Label
//                            htmlFor="escalation.manualReview"
//                            className="text-sm font-medium"
//                          >
//                            Manual Review *
//                          </Label>
//                        </div>
//                        <div className="relative">
//                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                            <DollarSign className="h-4 w-4" />
//                          </span>
//                          <Field
//                            as={Input}
//                            type="number"
//                            id="escalation.manualReview"
//                            name="escalation.manualReview"
//                            className="h-11 pl-10"
//                            min="0"
//                            step="1000"
//                            placeholder="200000"
//                          />
//                        </div>
//                        <p className="text-xs text-gray-500">
//                          Requires manual approval
//                        </p>
//                        <ErrorMessage
//                          name="escalation.manualReview"
//                          component="div"
//                          className="text-red-500 text-sm mt-1"
//                        />
//                      </div>
//                    </div>

//                    {/* Validation for order */}
//                    {errors.escalation &&
//                      typeof errors.escalation === "string" && (
//                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                          <div className="flex items-center">
//                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
//                            <p className="text-red-600 text-sm">
//                              {errors.escalation}
//                            </p>
//                          </div>
//                        </div>
//                      )}

//                    {/* Threshold Flow Visualization */}
//                    <div className="mt-8 pt-6 border-t">
//                      <h4 className="text-sm font-medium text-gray-700 mb-4">
//                        Threshold Flow Visualization
//                      </h4>
//                      <div className="space-y-4">
//                        <div className="relative h-10 bg-gray-100 rounded-xl overflow-hidden">
//                          {/* Auto Approval Zone */}
//                          <div
//                            className="absolute left-0 h-full bg-green-500"
//                            style={{
//                              width: `${
//                                (values.escalation.highRisk /
//                                  Math.max(values.escalation.manualReview, 1)) *
//                                100
//                              }%`,
//                            }}
//                          >
//                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
//                              Auto Approval
//                            </span>
//                          </div>

//                          {/* High Risk Zone */}
//                          <div
//                            className="absolute h-full bg-yellow-500"
//                            style={{
//                              left: `${
//                                (values.escalation.highRisk /
//                                  Math.max(values.escalation.manualReview, 1)) *
//                                100
//                              }%`,
//                              width: `${
//                                ((values.escalation.edd -
//                                  values.escalation.highRisk) /
//                                  Math.max(values.escalation.manualReview, 1)) *
//                                100
//                              }%`,
//                            }}
//                          >
//                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-800">
//                              High Risk
//                            </span>
//                          </div>

//                          {/* EDD Zone */}
//                          <div
//                            className="absolute h-full bg-orange-500"
//                            style={{
//                              left: `${
//                                (values.escalation.edd /
//                                  Math.max(values.escalation.manualReview, 1)) *
//                                100
//                              }%`,
//                              width: `${
//                                ((values.escalation.manualReview -
//                                  values.escalation.edd) /
//                                  Math.max(values.escalation.manualReview, 1)) *
//                                100
//                              }%`,
//                            }}
//                          >
//                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
//                              EDD
//                            </span>
//                          </div>
//                        </div>

//                        <div className="flex justify-between text-xs text-gray-500">
//                          <div className="flex flex-col items-center">
//                            <span>$0</span>
//                            <span className="text-gray-400">Start</span>
//                          </div>
//                          <div className="flex flex-col items-center">
//                            <span>
//                              {formatCurrency(values.escalation.highRisk)}
//                            </span>
//                            <span className="text-gray-400">High Risk</span>
//                          </div>
//                          <div className="flex flex-col items-center">
//                            <span>{formatCurrency(values.escalation.edd)}</span>
//                            <span className="text-gray-400">EDD</span>
//                          </div>
//                          <div className="flex flex-col items-center">
//                            <span>
//                              {formatCurrency(values.escalation.manualReview)}+
//                            </span>
//                            <span className="text-gray-400">Manual Review</span>
//                          </div>
//                        </div>
//                      </div>
//                    </div>
//                  </CardContent>
//                )}
//              </Card>

//              {/* Form Actions */}
//              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
//                <div className="text-sm text-gray-500">
//                  All fields marked with * are required
//                </div>
//                <div className="flex space-x-3">
//                  {isModal && onClose ? (
//                    <Button
//                      type="button"
//                      variant="outline"
//                      onClick={onClose}
//                      disabled={isSubmitting}
//                      className="px-6"
//                    >
//                      Cancel
//                    </Button>
//                  ) : !isModal ? (
//                    <Button
//                      type="button"
//                      variant="outline"
//                      onClick={() => navigate(-1)}
//                      disabled={isSubmitting}
//                      className="px-6"
//                    >
//                      Cancel
//                    </Button>
//                  ) : null}
//                  <Button
//                    type="submit"
//                    disabled={isSubmitting}
//                    className="px-8 bg-blue-600 hover:bg-blue-700"
//                  >
//                    {isSubmitting ? (
//                      <>
//                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                        Creating Rule...
//                      </>
//                    ) : (
//                      "Create KYB Rule"
//                    )}
//                  </Button>
//                </div>
//              </div>
//            </Form>
//          )}
//        </Formik>
//      </div>
//    </div>
//  );
//};

//export default CreateKybRule;

import type React from "react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
} from "react-icons/fi";
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

/* ================= CONSTANTS ================= */

const DOCUMENT_TYPES = [
  {
    code: "BUSINESS_REGISTRATION",
    label: "Business Registration",
    category: "Business",
  },
  { code: "TAX_CERTIFICATE", label: "Tax Certificate", category: "Financial" },
  { code: "OWNER_ID", label: "Owner ID", category: "Identification" },
  { code: "PROOF_OF_ADDRESS", label: "Proof of Address", category: "Address" },
  { code: "BANK_STATEMENT", label: "Bank Statement", category: "Financial" },
  { code: "LICENSE", label: "Business License", category: "Regulatory" },
  {
    code: "ARTICLES_OF_INCORPORATION",
    label: "Articles of Incorporation",
    category: "Business",
  },
];

const RISK_TYPES = [
  {
    code: "HIGH_TRANSACTION_VOLUME",
    label: "High Transaction Volume",
    description: "Large transaction volumes",
  },
  {
    code: "UNVERIFIED_OWNER",
    label: "Unverified Owner",
    description: "Owners without proper verification",
  },
  {
    code: "PEP_ASSOCIATION",
    label: "PEP Association",
    description: "Politically Exposed Persons",
  },
  {
    code: "SANCTIONED_COUNTRY",
    label: "Sanctioned Country",
    description: "Operations in sanctioned countries",
  },
  {
    code: "HIGH_RISK_INDUSTRY",
    label: "High Risk Industry",
    description: "High-risk business sectors",
  },
  {
    code: "NEW_BUSINESS",
    label: "New Business (< 2 years)",
    description: "Recently established businesses",
  },
];

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

  interface BusinessTypeOption {
    code: string;
    name: string;
  }

  const [businessTypes, setBusinessTypes] = useState<BusinessTypeOption[]>([]);

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

  useEffect(() => {
    const fetchBusinessType = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v3/admin/kyb/master/business-types`
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          setBusinessTypes(response?.data?.data);
          console.log("Business Types:", response?.data?.data);
        } else {
          console.error("Invalid data format:", response.data);
          setBusinessTypes([]);
        }

        setSuccessMessage(response?.data?.message || "Business types loaded");
      } catch (error: any) {
        console.error("Error fetching business types:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to fetch business types. Please try again."
        );
        setBusinessTypes([]);
      }
    };

    fetchBusinessType();
  }, []);

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
                      >
                        <SelectTrigger
                          id="businessType"
                          className="h-11 border-slate-200 bg-white"
                        >
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.length > 0 ? (
                            businessTypes.map((type) => (
                              <SelectItem key={type.code} value={type.code}>
                                <span className="font-medium">{type.name}</span>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              Loading business types...
                            </SelectItem>
                          )}
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
                                  >
                                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                                      <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DOCUMENT_TYPES.map((docType) => (
                                        <SelectItem
                                          key={docType.code}
                                          value={docType.code}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {docType.label}
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
                              push({ documentCode: "", required: false })
                            }
                            className="w-full h-11 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
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
                                  >
                                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                                      <SelectValue placeholder="Select risk factor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {RISK_TYPES.map((riskType) => (
                                        <SelectItem
                                          key={riskType.code}
                                          value={riskType.code}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {riskType.label}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                              {riskType.description}
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
                            onClick={() => push({ risk: "", enabled: false })}
                            className="w-full h-11 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
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
                    disabled={isSubmitting}
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
