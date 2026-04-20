import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import axios from "axios";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";

import {
  FileCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Shield,
  RefreshCw,
  Layers,
  Pencil,
} from "lucide-react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BusinessType {
  id: number;
  code: string;
  name: string;
}

interface KybType {
  id: number;
  code: string;
  name: string;
}

interface MappingItem {
  id: number;
  businessTypeId: number;
  businessTypeCode: string;
  businessType: string;
  kybTypeId: number;
  kybTypeCode: string;
  kybTypeName: string;
  active: boolean;
  description: string;
  default: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────

const kybTypeBadgeColor: Record<string, string> = {
  SME: "bg-blue-100 text-blue-700 border-blue-200",
  CORPORATE: "bg-purple-100 text-purple-700 border-purple-200",
  HIGH_RISK: "bg-red-100 text-red-700 border-red-200",
  EXCHANGE: "bg-amber-100 text-amber-700 border-amber-200",
  STANDARD: "bg-gray-100 text-gray-700 border-gray-200",
  ENTERPRISE: "bg-indigo-100 text-indigo-700 border-indigo-200",
  CODING: "bg-teal-100 text-teal-700 border-teal-200",
};

const getKybBadgeClass = (code: string) =>
  kybTypeBadgeColor[code] ?? "bg-gray-100 text-gray-700 border-gray-200";

// ─── Component ───────────────────────────────────────────────────────────

const ExchangeKybMapping = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { toast } = useToast();

  // ── Data state ─────────────────────────────────────────────────────────
  const [mappings, setMappings] = useState<MappingItem[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [kybTypes, setKybTypes] = useState<KybType[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // ── Stats from API ───────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    totalMappings: 0,
    activeMappings: 0,
    highRiskMappings: 0,
    defaultFallbackMappings: 0,
  });

  // ── Search (server-side query param, debounced) ──────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0); // reset to first page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Pagination state (Spring 0-indexed) ─────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Dialog visibility ────────────────────────────────────────────────────────
  const [showCreateBT, setShowCreateBT] = useState(false);
  const [showCreateKYB, setShowCreateKYB] = useState(false);
  const [showCreateMapping, setShowCreateMapping] = useState(false);
  const [showEditMapping, setShowEditMapping] = useState(false); // ← NEW

  // ── Form: Business Type ──────────────────────────────────────────────────────
  const [btForm, setBtForm] = useState({ code: "", name: "", active: true });
  const [btLoading, setBtLoading] = useState(false);

  // ── Form: KYB Type ───────────────────────────────────────────────────────────
  const [kybForm, setKybForm] = useState({ code: "", name: "", active: true });
  const [kybLoading, setKybLoading] = useState(false);

  // ── Form: Create Mapping ─────────────────────────────────────────────────────
  const [mapForm, setMapForm] = useState({
    businessTypeId: "",
    kybTypeId: "",
    active: true,
    isDefault: false,
    description: "",
  });
  const [mapLoading, setMapLoading] = useState(false);

  // ── Form: Edit Mapping (PUT) ─────────────────────────────────────────────────
  const [editForm, setEditForm] = useState({
    id: 0,
    businessTypeId: 0,
    kybTypeId: 0,
    active: true,
    default: false,
    description: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // ── Auth headers ─────────────────────────────────────────────────────────────
  const getHeaders = () => ({ Authorization: `Bearer ${token}` });

  // ── Fetch: Mappings (server-side paginated + query) ──────────────────────────
  const fetchMappings = async (page = currentPage, query = debouncedSearch) => {
    if (!token) return;
    setLoadingMappings(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/kyb-type-mappings`, {
        headers: getHeaders(),
        params: { page, size: pageSize, query },
      });
      const responseData = res.data?.data;
      const pageData = responseData?.mappings ?? responseData;
      setMappings(pageData?.content ?? []);
      setTotalPages(pageData?.totalPages ?? 1);
      setTotalElements(pageData?.totalElements ?? 0);
      if (responseData?.stats) {
        setStats(responseData.stats);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to fetch mappings.",
        variant: "destructive",
      });
    } finally {
      setLoadingMappings(false);
    }
  };

  // ── Fetch: Dropdowns ─────────────────────────────────────────────────────────
  const fetchDropdowns = async () => {
    if (!token) return;
    setLoadingDropdowns(true);
    try {
      const [btRes, kybRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/v3/admin/kyb/master/business-types`, {
          headers: getHeaders(),
        }),
        axios.get(`${BASE_URL}/api/v3/admin/kyb/master/kyb-types`, {
          headers: getHeaders(),
        }),
      ]);
      setBusinessTypes(btRes.data?.data ?? []);
      setKybTypes(kybRes.data?.data ?? []);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to load dropdown data.",
        variant: "destructive",
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      fetchMappings(0, "");
      fetchDropdowns();
    }
  }, [token]);

  // Re-fetch when page or debounced search changes
  useEffect(() => {
    if (token) fetchMappings(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  // ── Page helpers ─────────────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ── Submit: Create Business Type ─────────────────────────────────────────────
  const handleCreateBT = async () => {
    if (!btForm.code.trim() || !btForm.name.trim()) {
      toast({
        title: "Validation",
        description: "Code and Name are required.",
        variant: "destructive",
      });
      return;
    }
    setBtLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v3/admin/business-types`,
        {
          code: btForm.code.trim(),
          name: btForm.name.trim(),
          active: btForm.active,
        },
        { headers: getHeaders() },
      );
      toast({
        title: "Success",
        description: res.data?.message ?? "Business type created.",
      });
      setBtForm({ code: "", name: "", active: true });
      setShowCreateBT(false);
      fetchDropdowns();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to create business type.",
        variant: "destructive",
      });
    } finally {
      setBtLoading(false);
    }
  };

  // ── Submit: Create KYB Type ──────────────────────────────────────────────────
  const handleCreateKYB = async () => {
    if (!kybForm.code.trim() || !kybForm.name.trim()) {
      toast({
        title: "Validation",
        description: "Code and Name are required.",
        variant: "destructive",
      });
      return;
    }
    setKybLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v3/admin/kyb-types`,
        {
          code: kybForm.code.trim(),
          name: kybForm.name.trim(),
          active: kybForm.active,
        },
        { headers: getHeaders() },
      );
      toast({
        title: "Success",
        description: res.data?.message ?? "KYB type created.",
      });
      setKybForm({ code: "", name: "", active: true });
      setShowCreateKYB(false);
      fetchDropdowns();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to create KYB type.",
        variant: "destructive",
      });
    } finally {
      setKybLoading(false);
    }
  };

  // ── Submit: Create Mapping ───────────────────────────────────────────────────
  const handleCreateMapping = async () => {
    if (!mapForm.businessTypeId || !mapForm.kybTypeId) {
      toast({
        title: "Validation",
        description: "Business Type and KYB Type are required.",
        variant: "destructive",
      });
      return;
    }
    setMapLoading(true);
    try {
      const payload = {
        businessTypeId: Number(mapForm.businessTypeId),
        kybTypeId: Number(mapForm.kybTypeId),
        active: mapForm.active,
        isDefault: mapForm.isDefault,
        description: mapForm.description.trim(),
      };
      const res = await axios.post(
        `${BASE_URL}/api/v1/kyb-type-mappings`,
        payload,
        {
          headers: getHeaders(),
        },
      );
      toast({
        title: "Success",
        description: res.data?.message ?? "Mapping created.",
      });
      setMapForm({
        businessTypeId: "",
        kybTypeId: "",
        active: true,
        isDefault: false,
        description: "",
      });
      setShowCreateMapping(false);
      if (currentPage === 0) fetchMappings(0, debouncedSearch);
      else setCurrentPage(0);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to create mapping.",
        variant: "destructive",
      });
    } finally {
      setMapLoading(false);
    }
  };

  // ── Open Edit Dialog ─────────────────────────────────────────────────────────
  const handleOpenEdit = (m: MappingItem) => {
    setEditForm({
      id: m.id,
      businessTypeId: m.businessTypeId,
      kybTypeId: m.kybTypeId,
      active: m.active,
      default: m.default,
      description: m.description ?? "",
    });
    setShowEditMapping(true);
  };

  // ── Submit: Update Mapping (PUT) ─────────────────────────────────────────────
  const handleUpdateMapping = async () => {
    setEditLoading(true);
    try {
      const payload = {
        businessTypeId: editForm.businessTypeId,
        kybTypeId: editForm.kybTypeId,
        active: editForm.active,
        default: editForm.default,
        description: editForm.description.trim(),
      };
      const res = await axios.put(
        `${BASE_URL}/api/v1/kyb-type-mappings/${editForm.id}`,
        payload,
        { headers: getHeaders() },
      );
      toast({
        title: "Success",
        description: res.data?.message ?? "Mapping updated.",
      });
      setShowEditMapping(false);
      fetchMappings(currentPage, debouncedSearch);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to update mapping.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // ── Open mapping dialog ──────────────────────────────────────────────────────
  const handleOpenMappingDialog = () => {
    fetchDropdowns();
    setShowCreateMapping(true);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYB Mapping Management
            </h1>
            <p className="text-muted-foreground">
              Manage business type to KYB type mappings
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateBT(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Create Business Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateKYB(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Create KYB Type
            </Button>
            <Button size="sm" onClick={handleOpenMappingDialog}>
              <Layers className="h-4 w-4 mr-1" /> Create Mapping
            </Button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Mappings
              </CardTitle>
              <FileCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMappings}</div>
              <p className="text-xs text-muted-foreground">
                All configurations
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeMappings}
              </div>
              <p className="text-xs text-muted-foreground">Across all pages</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Risk
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.highRiskMappings}
              </div>
              <p className="text-xs text-muted-foreground">Elevated scrutiny</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Default Fallback
              </CardTitle>
              <Shield className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.defaultFallbackMappings}
              </div>
              <p className="text-xs text-muted-foreground">Fallback rules</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Search & Refresh ── */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="search" className="mb-1 block">
                  Search Mappings
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by business type or KYB type..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => fetchMappings(currentPage, debouncedSearch)}
                disabled={loadingMappings}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${loadingMappings ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Mappings Table ── */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>KYB Type Mappings List</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMappings ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading
                mappings…
              </div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No mappings found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-left">
                        <th className="pb-3 pr-4 font-medium">Business Type</th>
                        {/* <th className="pb-3 pr-4 font-medium">Code</th> */}
                        <th className="pb-3 pr-4 font-medium">KYB Type</th>
                        {/* <th className="pb-3 pr-4 font-medium">KYB Code</th> */}
                        <th className="pb-3 pr-4 font-medium">Description</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        {/*<th className="pb-3 pr-4 font-medium">Default</th>*/}
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mappings.map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 pr-4 font-medium">
                            {m.businessType}
                          </td>
                          {/* <td className="py-3 pr-4">
                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                              {m.businessTypeCode}
                            </span>
                          </td> */}
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getKybBadgeClass(m.kybTypeCode)}`}
                            >
                              {m.kybTypeName}
                            </span>
                          </td>
                          {/* <td className="py-3 pr-4">
                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                              {m.kybTypeCode}
                            </span>
                          </td> */}
                          <td
                            className="py-3 pr-4 text-muted-foreground max-w-[200px] truncate"
                            title={m.description}
                          >
                            {m.description || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={m.active ? "default" : "secondary"}>
                              {m.active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          {/*<td className="py-3 pr-4">
                            {m.default ? (
                              <Badge
                                variant="outline"
                                className="border-blue-400 text-blue-600"
                              >
                                Default
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </td>*/}
                          {/* ── Edit action ── */}
                          <td className="py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenEdit(m)}
                              title="Edit mapping"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                            className={
                              currentPage === 0
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {getPageNumbers().map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                            className={
                              currentPage >= totalPages - 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Dialog: Create Business Type
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={showCreateBT} onOpenChange={setShowCreateBT}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Business Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="bt-code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bt-code"
                placeholder="e.g. IT"
                value={btForm.code}
                onChange={(e) =>
                  setBtForm({ ...btForm, code: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bt-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bt-name"
                placeholder="e.g. Information Technology"
                value={btForm.name}
                onChange={(e) => setBtForm({ ...btForm, name: e.target.value })}
              />
            </div>
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="bt-active">Active</Label>
              <Switch
                id="bt-active"
                checked={btForm.active}
                onCheckedChange={(val) => setBtForm({ ...btForm, active: val })}
              />
            </div>*/}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBT(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBT} disabled={btLoading}>
              {btLoading ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Dialog: Create KYB Type
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={showCreateKYB} onOpenChange={setShowCreateKYB}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create KYB Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="kyb-code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kyb-code"
                placeholder="e.g. CODING"
                value={kybForm.code}
                onChange={(e) =>
                  setKybForm({ ...kybForm, code: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="kyb-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kyb-name"
                placeholder="e.g. Coding KYB"
                value={kybForm.name}
                onChange={(e) =>
                  setKybForm({ ...kybForm, name: e.target.value })
                }
              />
            </div>
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="kyb-active">Active</Label>
              <Switch
                id="kyb-active"
                checked={kybForm.active}
                onCheckedChange={(val) =>
                  setKybForm({ ...kybForm, active: val })
                }
              />
            </div>*/}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateKYB(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKYB} disabled={kybLoading}>
              {kybLoading ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Dialog: Create Mapping
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={showCreateMapping} onOpenChange={setShowCreateMapping}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create KYB Mapping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>
                Business Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={mapForm.businessTypeId}
                onValueChange={(val) =>
                  setMapForm({ ...mapForm, businessTypeId: val })
                }
                disabled={loadingDropdowns}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingDropdowns ? "Loading…" : "Select business type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.length === 0 && !loadingDropdowns ? (
                    <SelectItem value="__none__" disabled>
                      No business types found
                    </SelectItem>
                  ) : (
                    businessTypes.map((bt) => (
                      <SelectItem key={bt.id} value={String(bt.id)}>
                        {bt.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>
                KYB Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={mapForm.kybTypeId}
                onValueChange={(val) =>
                  setMapForm({ ...mapForm, kybTypeId: val })
                }
                disabled={loadingDropdowns}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingDropdowns ? "Loading…" : "Select KYB type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {kybTypes.length === 0 && !loadingDropdowns ? (
                    <SelectItem value="__none__" disabled>
                      No KYB types found
                    </SelectItem>
                  ) : (
                    kybTypes.map((kt) => (
                      <SelectItem key={kt.id} value={String(kt.id)}>
                        {kt.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="map-desc">Description</Label>
              <Textarea
                id="map-desc"
                placeholder="e.g. Coding businesses go to IT KYB"
                rows={2}
                value={mapForm.description}
                onChange={(e) =>
                  setMapForm({ ...mapForm, description: e.target.value })
                }
              />
            </div>
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="map-active">Active</Label>
              <Switch
                id="map-active"
                checked={mapForm.active}
                onCheckedChange={(val) =>
                  setMapForm({ ...mapForm, active: val })
                }
              />
            </div>*/}
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="map-default">Set as Default</Label>
              <Switch
                id="map-default"
                checked={mapForm.isDefault}
                onCheckedChange={(val) =>
                  setMapForm({ ...mapForm, isDefault: val })
                }
              />
            </div>*/}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateMapping(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMapping}
              disabled={mapLoading || loadingDropdowns}
            >
              {mapLoading ? "Creating…" : "Create Mapping"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Dialog: Edit Mapping  (PUT /api/v1/kyb-type-mappings/:id)
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={showEditMapping} onOpenChange={setShowEditMapping}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Mapping #{editForm.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* businessTypeId — dropdown showing name, passes id to API */}
            <div className="space-y-1">
              <Label>
                Business Type <span className="text-destructive">*</span>
              </Label>
              <Select
                disabled
                value={String(editForm.businessTypeId)}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, businessTypeId: Number(val) })
                }
                // disabled={loadingDropdowns}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingDropdowns ? "Loading…" : "Select business type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((bt) => (
                    <SelectItem key={bt.id} value={String(bt.id)}>
                      {bt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* kybTypeId — dropdown populated from fetched KYB types */}
            <div className="space-y-1">
              <Label>
                KYB Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(editForm.kybTypeId)}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, kybTypeId: Number(val) })
                }
                disabled={loadingDropdowns}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingDropdowns ? "Loading…" : "Select KYB type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {kybTypes.map((kt) => (
                    <SelectItem key={kt.id} value={String(kt.id)}>
                      {kt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* description */}
            <div className="space-y-1">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                rows={2}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>

            {/* active toggle */}
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active</Label>
              <Switch
                id="edit-active"
                checked={editForm.active}
                onCheckedChange={(val) =>
                  setEditForm({ ...editForm, active: val })
                }
              />
            </div>*/}

            {/* default toggle */}
            {/*<div className="flex items-center justify-between">
              <Label htmlFor="edit-default">Set as Default</Label>
              <Switch
                id="edit-default"
                checked={editForm.default}
                onCheckedChange={(val) =>
                  setEditForm({ ...editForm, default: val })
                }
              />
            </div>*/}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditMapping(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMapping} disabled={editLoading}>
              {editLoading ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ExchangeLayout>
  );
};

export default ExchangeKybMapping;
