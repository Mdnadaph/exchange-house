import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  X,
  ChevronLeft,
  ChevronRight,
  Building,
  Shield,
  FileCheck,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import CreateKybRule from "@/components/kyb/CreateKybRule";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import { PermissionGate } from "@/contexts/PermissionGate";

const ExchangeKYBConfig = () => {
  const [cookie] = useCookies(["token"]);
  const [showPopup, setShowPopup] = useState(false);
  const [kybRules, setKybRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRule, setEditingRule] = useState<any>(null);

  const token = cookie.token;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchKybRules = async (page = 0, size = 3) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/api/v3/admin/kyb/rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          page: page,
          size: size,
        },
        withCredentials: true,
      });

      if (res.data?.status) {
        setKybRules(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
        setCurrentPage(res.data.currentPage || 0);
        setPageSize(res.data.pageSize || 10);
      } else {
        setKybRules(res?.data?.data || []);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load KYB rules",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchKybRules();
    }
  }, [token]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchKybRules(newPage, pageSize);
      document
        .getElementById("kyb-rules-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreateClick = () => {
    setEditingRule(null);
    setShowPopup(true);
  };

  const handleEditClick = (rule: any) => {
    setEditingRule(rule);
    setShowPopup(true);
  };

  const getComplianceBadge = (compliance: string) => {
    const badges = {
      standard: {
        variant: "default" as const,
        label: "Standard",
        icon: FileCheck,
      },
      enhanced: {
        variant: "secondary" as const,
        label: "Enhanced",
        icon: Shield,
      },
      strict: {
        variant: "destructive" as const,
        label: "Strict",
        icon: AlertTriangle,
      },
    };
    return badges[compliance as keyof typeof badges] || badges.standard;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { variant: "default" as const, label: "Active" },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      draft: { variant: "outline" as const, label: "Draft" },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);
      if (currentPage <= 2) end = Math.min(3, totalPages - 2);
      if (currentPage >= totalPages - 3) start = Math.max(1, totalPages - 4);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYB Rules Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure business verification rules, document requirements, and
              approval workflows
            </p>
          </div>
          <div className="flex space-x-3">
            <PermissionGate permission="BTN_CREATE_KYB_RULE">
              <Button variant="business" onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Rule
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Business Type Rules */}
        <Card id="kyb-rules-section" className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Business Type KYB Rules</CardTitle>
              {kybRules.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(currentPage * pageSize + 1, totalElements)}{" "}
                  - {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                  {totalElements} rules
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading KYB rules...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <p>Error loading KYB rules</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : kybRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No KYB rules configured</p>
                <p className="text-sm mt-1">
                  Create your first rule to get started
                </p>
              </div>
            ) : (
              <>
                {/* Rules List */}
                <div className="space-y-4">
                  {kybRules.map((rule) => {
                    const status = rule.active ? "active" : "inactive";
                    const complianceBadge = getComplianceBadge("standard");
                    const statusBadge = getStatusBadge(status);
                    const ComplianceIcon = complianceBadge.icon;

                    return (
                      <Card
                        key={rule.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Building className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-foreground">
                                  {rule.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Business Type: {rule.businessType}
                                </p>
                                {rule.default && (
                                  <Badge
                                    variant="default"
                                    className="mt-1 text-xs"
                                  >
                                    Default Rule
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={complianceBadge.variant}
                                className="flex items-center gap-1"
                              >
                                <ComplianceIcon className="h-3 w-3" />
                                {complianceBadge.label}
                              </Badge>
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Shield className="h-3 w-3 mr-1" />
                                Auto-Approval Limit:
                              </div>
                              <p className="font-medium">
                                $
                                {rule.autoApprovalLimit?.toLocaleString() ||
                                  "0"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Users className="h-3 w-3 mr-1" />
                                Review Tiers:
                              </div>
                              <p className="font-medium">
                                {rule.reviewTiers || 1} levels
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Clock className="h-3 w-3 mr-1" />
                                Max Processing:
                              </div>
                              <p className="font-medium">
                                {rule.maxProcessingHours || 48} hours
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">
                                Required Documents
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {rule?.documents &&
                                rule?.documents?.length > 0 ? (
                                  rule?.documents?.map(
                                    (
                                      doc: { documentCode: string },
                                      index: number,
                                    ) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {doc?.documentCode
                                          ?.toLocaleLowerCase()
                                          ?.split("_")
                                          ?.map(
                                            (word) =>
                                              word?.charAt(0)?.toUpperCase() +
                                              word?.slice(1),
                                          )
                                          ?.join(" ")}
                                      </Badge>
                                    ),
                                  )
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No documents specified
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <PermissionGate permission="BTN_EDIT_KYB_RULE">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(rule)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </PermissionGate>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination Controls */}

                <div className="flex flex-col sm:flex-row items-center justify-center pt-6 border-t border-gray-200 gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                        currentPage === 0
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum as number)}
                            className={`flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-sm font-medium ${
                              currentPage === pageNum
                                ? "bg-primary text-white border border-primary"
                                : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {(pageNum as number) + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                        currentPage === totalPages - 1
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-muted-foreground pl-28">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit KYB Rule Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <div className="flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowPopup(false);
                    setEditingRule(null);
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <CreateKybRule
                isModal={true}
                isEdit={!!editingRule}
                ruleToEdit={editingRule}
                onClose={() => {
                  setShowPopup(false);
                  setEditingRule(null);
                  fetchKybRules(currentPage, pageSize);
                }}
                onSuccess={() => {
                  fetchKybRules(currentPage, pageSize);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ExchangeLayout>
  );
};

export default ExchangeKYBConfig;
