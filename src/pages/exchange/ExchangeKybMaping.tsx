import { useState, useEffect, useRef } from "react";
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
  Delete,
  Trash2,
} from "lucide-react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { PermissionGate } from "@/contexts/PermissionGate";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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
  const [businessTypesDropDownData, setBusinessTypeDropDownData] = useState<
    BusinessType[]
  >([]);
  const [kybTypesDropDownData, setKybTypesDropDownData] = useState<KybType[]>(
    [],
  );
  const [businessTypesDropdownLoading, setBusinessTypesDropdownLoading] =
    useState<boolean>(false);
  const [kybTypesDropDownLoading, setkybTypesDropDownLoading] =
    useState<boolean>(false);
  const [hasMoreBusinessType, setHasMoreBusinessType] = useState<boolean>(true);
  const [hasMoreKybTypes, setHasMoreKybTypes] = useState<boolean>(true);
  const [businessTypePage, setBusinessTypePage] = useState<number>(0);
  const [kybTypePage, setKybTypePage] = useState<number>(0);

  const [loadingMappings, setLoadingMappings] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [businessTypePagination, setBusinessTypePagination] = useState({
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
  });
  const [KYBTypePagination, setKYBTypePagination] = useState({
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
  });
  const businessTyeListRef = useRef<HTMLDivElement | null>(null);
  const kybTypeListRef = useRef<HTMLDivElement | null>(null);

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
  const [editableBusinessTypeId, setEditableBusinessTypeId] = useState<
    number | null
  >(null);
  const [editableKYBTypesId, setEditableKYBTypesId] = useState<number | null>(
    null,
  );
  const [
    showDeleteBusinessTypeConfirmation,
    setShowDeleteBusinessTypeConfirmation,
  ] = useState<boolean>(false);
  const [showDeleteKYBTypeConfirmation, setShowDeleteKYBTypeConfirmation] =
    useState<boolean>(false);
  const [businessTypeName, setBusinessTypeName] = useState("");
  const [kybTypeName, setKybTypeName] = useState("");
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

  const fetchBusinessTypeDropDown = async () => {
    if (businessTypesDropdownLoading || !hasMoreBusinessType) return;
    try {
      setBusinessTypesDropdownLoading(true);
      const currentPage = businessTypePage;
      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/kyb/master/business-types?page=${currentPage}&pageSize=10`,
        {
          headers: getHeaders(),
        },
      );
      if (res?.data?.status) {
        const newData = res?.data?.data || [];
        // No more data
        if (newData.length < 10) {
          setHasMoreBusinessType(false);
        }

        // Prevent duplicate data
        setBusinessTypeDropDownData((prev) => {
          const merged = [...prev, ...newData];
          const uniqueData = merged.filter(
            (item, index, self) =>
              index === self.findIndex((x) => x.id === item.id),
          );
          return uniqueData;
        });

        // NEXT PAGE
        setBusinessTypePage((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.responsive?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setBusinessTypesDropdownLoading(false);
    }
  };

  const handleBusinessTypeScroll = () => {
    if (!businessTyeListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      businessTyeListRef.current;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isBottom && !businessTypesDropdownLoading && hasMoreBusinessType) {
      fetchBusinessTypeDropDown();
    }
  };

  const fetchKybTypeDropDown = async () => {
    if (kybTypesDropDownLoading || !hasMoreKybTypes) return;
    try {
      setkybTypesDropDownLoading(true);
      const currentPage = kybTypePage;
      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/kyb/master/kyb-types?page=${currentPage}&pageSize=10`,
        {
          headers: getHeaders(),
        },
      );
      if (res?.data?.status) {
        const newData = res?.data?.data || [];

        // No more data
        if (newData.length < 10) {
          setHasMoreKybTypes(false);
        }

        // Prevent duplicate data
        setKybTypesDropDownData((prev) => {
          const merged = [...prev, ...newData];

          const uniqueData = merged.filter(
            (item, index, self) =>
              index === self.findIndex((x) => x.id === item.id),
          );
          return uniqueData;
        });

        // NEXT PAGE
        setKybTypePage((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setkybTypesDropDownLoading(false);
    }
  };

  const handleKybTypesScroll = () => {
    if (!kybTypeListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = kybTypeListRef.current;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isBottom && !kybTypesDropDownLoading && hasMoreKybTypes) {
      fetchKybTypeDropDown();
    }
  };

  //   const getExchangeAdminList = async () => {
  //     // IMPORTANT
  //     if (exchangeAdminLoading || !hasMore) return;

  //     try {
  //       setExchangeAdminLoading(true);

  //       const currentPage = page;

  //       const res = await axios.get(
  //         `${BASE_URL}/api/v3/super/exchange-admins?page=${currentPage}&pageSize=10`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );

  //       if (res?.data?.status) {
  //         const newData = res?.data?.data?.exchangeAdminResponse || [];

  //         // No more data
  //         if (newData.length < 10) {
  //           setHasMore(false);
  //         }

  //         // Prevent duplicate data
  //         setExchangeAdminData((prev) => {
  //           const merged = [...prev, ...newData];

  //           const uniqueData = merged.filter(
  //             (item, index, self) =>
  //               index === self.findIndex((x) => x.id === item.id),
  //           );

  //           return uniqueData;
  //         });

  //         // NEXT PAGE
  //         setPage((prev) => prev + 1);
  //       }
  //     } catch (error: any) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: error?.response?.data?.message || "Something went wrong",
  //       });
  //     } finally {
  //       setExchangeAdminLoading(false);
  //     }
  //   };

  //    const handleScroll = () => {
  //   if (!listRef.current) return;

  //   const { scrollTop, scrollHeight, clientHeight } = listRef.current;

  //   const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

  //   if (isBottom && !exchangeAdminLoading && hasMore) {
  //     getExchangeAdminList();
  //   }
  // };

  // ── Fetch: Dropdowns ─────────────────────────────────────────────────────────
  const fetchTypeData = async () => {
    if (!token) return;
    setLoadingDropdowns(true);
    try {
      const [btRes, kybRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/api/v3/admin/kyb/master/business-types?page=${businessTypePagination?.currentPage}&pageSize=${businessTypePagination?.pageSize}`,
          {
            headers: getHeaders(),
          },
        ),
        axios.get(
          `${BASE_URL}/api/v3/admin/kyb/master/kyb-types?page=${KYBTypePagination?.currentPage}&pageSize=${KYBTypePagination?.pageSize}`,
          {
            headers: getHeaders(),
          },
        ),
      ]);
      setBusinessTypes(btRes.data?.data ?? []);
      setBusinessTypePagination({
        pageSize: btRes?.data?.pageSize,
        totalPages: btRes?.data?.totalPage,
        currentPage: btRes?.data?.currentPage,
        totalElements: btRes?.data?.totalElement,
      });
      setKybTypes(kybRes.data?.data ?? []);
      setKYBTypePagination({
        pageSize: kybRes?.data?.pageSize,
        totalPages: kybRes?.data?.totalPage,
        currentPage: kybRes?.data?.currentPage,
        totalElements: kybRes?.data?.totalElement,
      });
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
      fetchTypeData();
    }
  }, [
    token,
    businessTypePagination?.currentPage,
    KYBTypePagination?.currentPage,
  ]);

  const businessTypeList = businessTypes?.map((item, index) => ({
    sn: index + 1,
    ...item,
  }));

  const KYBTypeList = kybTypes?.map((item, index) => ({
    sn: index + 1,
    ...item,
  }));

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
      fetchTypeData();
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

  const handleEditOpenBusinessType = (m) => {
    setEditableBusinessTypeId(m?.id);
    setBtForm({ code: m?.code, name: m?.name, active: true });
    setShowCreateBT(true);
  };

  const handleEditOpenKYBType = (m) => {
    setEditableKYBTypesId(m?.id);
    setKybForm({ code: m?.code, name: m?.name, active: true });
    setShowCreateKYB(true);
  };

  const handleEditBusinessType = async () => {
    if (!btForm.code.trim() || !btForm.name.trim()) {
      toast({
        title: "Validation",
        description: "Code and Name are required.",
        variant: "destructive",
      });
      return;
    }
    setBtLoading(true);
    const payload = {
      name: btForm?.name,
      code: btForm?.code,
    };
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/admin/kyb/master/business-types/${editableBusinessTypeId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        toast({
          title: "Success",
          description:
            res?.data?.message || "Update Business Type Successfully",
        });
        setBtForm({ name: "", code: "", active: true });
        setEditableBusinessTypeId(null);
        setShowCreateBT(false);
        fetchTypeData();
      } else {
        toast({
          title: "Error",
          description: res?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong while updating Business type",
        variant: "destructive",
      });
    } finally {
      setBtLoading(false);
    }
  };

  const handleEditKYBType = async () => {
    if (!kybForm.code.trim() || !kybForm.name.trim()) {
      toast({
        title: "Validation",
        description: "Code and Name are required.",
        variant: "destructive",
      });
      return;
    }
    setKybLoading(true);
    const payload = {
      name: kybForm?.name,
      code: kybForm?.code,
    };
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v3/admin/kyb/master/kyb-types/${editableKYBTypesId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        setEditableKYBTypesId(null);
        toast({
          title: "Success",
          description: res?.data?.message || "Update KYB Type Successfully",
        });
        setKybForm({
          code: "",
          name: "",
          active: true,
        });
        setShowCreateKYB(false);
        fetchTypeData();
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message ||
            "Something went wrong while updating KYB Types",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong while updating KYB Type",
        variant: "destructive",
      });
    } finally {
      setKybLoading(false);
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
      fetchTypeData();
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
    // fetchTypeData();
    setShowCreateMapping(true);
  };

  useEffect(() => {
    if (!showCreateMapping) return;
    fetchBusinessTypeDropDown();
    fetchKybTypeDropDown();
  }, [showCreateMapping]);

  // ─────────────────────────────────────────────────────────────────────────────
  const handleBusinessTypePageChange = (newPage) => {
    if (newPage >= 0 && newPage < businessTypePagination.totalPages) {
      setBusinessTypePagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleKYBTypePageChange = (newPage) => {
    if (newPage >= 0 && newPage < businessTypePagination.totalPages) {
      setBusinessTypePagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };
  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYB Mapping Management
            </h1>
            <p className="text-muted-foreground">
              Manage business type to KYB type mappings
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <PermissionGate permission="BTN_CREATE_BUSINESS_TYPE">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateBT(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Create Business Type
              </Button>
            </PermissionGate>
            <PermissionGate permission="BTN_CREATE_KYB_TYPE">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateKYB(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Create KYB Type
              </Button>
            </PermissionGate>
            <PermissionGate permission="BTN_CREATE_MAPPING">
              <Button size="sm" onClick={handleOpenMappingDialog}>
                <Layers className="h-4 w-4 mr-1" /> Create Mapping
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          {/* <Card className="shadow-card">
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
          </Card> */}
          {/* <Card className="shadow-card">
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
          </Card> */}
        </div>

        {/* ── Search & Refresh ── */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex gap-3 items-end flex-wrap">
              <div className="md:flex-1">
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
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(0);
                    }}
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
                        <th className="pb-3 pr-4 font-medium">Action</th>
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
              </>
            )}
          </CardContent>
        </Card>
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
          <Card className="shadow-card p-4">
            <CardHeader>
              <CardTitle>Business Type</CardTitle>
            </CardHeader>
            {businessTypeList?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-left">
                        <th className="pb-3 pr-4 font-medium">SN</th>
                        <th className="pb-3 pr-4 font-medium">Name</th>
                        <th className="pb-3 pr-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {businessTypeList?.map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 pr-4 font-medium">{m?.sn}</td>
                          <td className="py-3 pr-4 font-medium">{m?.name}</td>
                          <td className="flex gap-3 items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              // onClick={() => handleOpenEdit(m)}
                              onClick={() => handleEditOpenBusinessType(m)}
                              title="Edit Business Type"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setShowDeleteBusinessTypeConfirmation(true);
                                setEditableBusinessTypeId(m?.id);
                                setBusinessTypeName(m?.name);
                              }}
                              title="Delete BusinessType"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBusinessTypePageChange(
                            businessTypePagination.currentPage - 1,
                          );
                        }}
                        className={
                          businessTypePagination.currentPage === 0
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(businessTypePagination.totalPages)].map(
                      (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleBusinessTypePageChange(index);
                            }}
                            isActive={
                              businessTypePagination.currentPage === index
                            }
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBusinessTypePageChange(
                            businessTypePagination.currentPage + 1,
                          );
                        }}
                        className={
                          businessTypePagination.currentPage ===
                          businessTypePagination.totalPages - 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <p className="text-center pb-3 text-muted-foreground">
                No Business Type Available
              </p>
            )}
          </Card>
          <Card className="shadow-card p-4">
            <CardHeader>
              <CardTitle>KYB Type</CardTitle>
            </CardHeader>
            {KYBTypeList?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-left">
                        <th className="pb-3 pr-4 font-medium">SN</th>
                        <th className="pb-3 pr-4 font-medium">Name</th>
                        <th className="pb-3 pr-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {KYBTypeList?.map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 pr-4 font-medium">{m?.sn}</td>
                          <td className="py-3 pr-4 font-medium">{m?.name}</td>
                          <div className="flex gap-3 items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              // onClick={() => handleOpenEdit(m)}
                              onClick={() => handleEditOpenKYBType(m)}
                              title="Edit KYB Type"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditableKYBTypesId(m?.id);
                                setShowDeleteKYBTypeConfirmation(true);
                                setKybTypeName(m?.name);
                              }}
                              title="Delete KYB Type"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleKYBTypePageChange(
                            KYBTypePagination.currentPage - 1,
                          );
                        }}
                        className={
                          KYBTypePagination.currentPage === 0
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(KYBTypePagination.totalPages)].map(
                      (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleKYBTypePageChange(index);
                            }}
                            isActive={KYBTypePagination.currentPage === index}
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleKYBTypePageChange(
                            KYBTypePagination.currentPage + 1,
                          );
                        }}
                        className={
                          KYBTypePagination.currentPage ===
                          KYBTypePagination.totalPages - 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <p className="text-center pb-3 text-muted-foreground">
                No KYB Type Available
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Confirm Delete business Type modal*/}
      <ConfirmationDialog
        open={showDeleteBusinessTypeConfirmation}
        onOpenChange={setShowDeleteBusinessTypeConfirmation}
        onConfirm={() => {}}
        title="Delete Business Type"
        description={`Are you sure you want to delete "${businessTypeName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmationDialog
        open={showDeleteKYBTypeConfirmation}
        onOpenChange={setShowDeleteKYBTypeConfirmation}
        onConfirm={() => {}}
        title="Delete KYB Type"
        description={`Are you sure you want to delete "${kybTypeName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      {/* ══════════════════════════════════════════════════════════
          Dialog: Create Business Type
      ══════════════════════════════════════════════════════════ */}
      <Dialog
        open={showCreateBT}
        onOpenChange={(open) => {
          setShowCreateBT(open);
          if (!open) {
            setShowCreateBT(false);
            setEditableBusinessTypeId(null);
            setBtForm({ code: "", name: "", active: true });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editableBusinessTypeId
                ? "Update Business Type"
                : "Create Business Type"}
            </DialogTitle>
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
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateBT(false);
                setEditableBusinessTypeId(null);
                setBtForm({ code: "", name: "", active: true });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                editableBusinessTypeId
                  ? handleEditBusinessType()
                  : handleCreateBT();
              }}
              disabled={btLoading}
            >
              {btLoading
                ? editableBusinessTypeId
                  ? "Updating"
                  : "Creating..."
                : editableBusinessTypeId
                  ? "Upate"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Dialog: Create KYB Type
      ══════════════════════════════════════════════════════════ */}
      <Dialog
        open={showCreateKYB}
        onOpenChange={(open) => {
          setShowCreateKYB(open);
          if (!open) {
            setShowCreateKYB(false);
            setEditableKYBTypesId(null);
            setKybForm({ code: "", name: "", active: true });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editableKYBTypesId ? "Update KYB Type" : "Create KYB Type"}
            </DialogTitle>
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
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateKYB(false);
                setEditableKYBTypesId(null);
                setKybForm({ code: "", name: "", active: true });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                editableKYBTypesId ? handleEditKYBType() : handleCreateKYB()
              }
              disabled={kybLoading}
            >
              {kybLoading
                ? editableKYBTypesId
                  ? "Updating..."
                  : "Creating…"
                : editableKYBTypesId
                  ? "Update"
                  : "Create"}
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
                    // placeholder={
                    //   loadingDropdowns ? "Loading…" : "Select business type"
                    // }
                    placeholder="Select business type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <div
                    ref={businessTyeListRef}
                    onScroll={handleBusinessTypeScroll}
                    className="max-h-60 overflow-y-auto"
                  >
                    {businessTypesDropDownData?.map((c, index) => (
                      <SelectItem key={index} value={String(c?.id)}>
                        {c?.name}
                      </SelectItem>
                    ))}
                    {/* OBSERVER TARGET */}
                    {businessTypesDropdownLoading && (
                      <div className="py-2 text-center text-sm text-gray-500">
                        Loading...
                      </div>
                    )}
                    {/* {!hasMore && (
                                                <div className="py-2 text-center text-sm text-gray-400">
                                                  No More Data
                                                </div>
                                              )} */}
                  </div>

                  {/* {businessTypes.length === 0 && !loadingDropdowns ? (
                    <SelectItem value="__none__" disabled>
                      No business types found
                    </SelectItem>
                  ) : (
                    businessTypes.map((bt) => (
                      <SelectItem key={bt.id} value={String(bt.id)}>
                        {bt.name}
                      </SelectItem>
                    ))
                  )} */}
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
                  <div
                    ref={kybTypeListRef}
                    onScroll={handleKybTypesScroll}
                    className="max-h-60 overflow-y-auto"
                  >
                    {kybTypesDropDownData?.map((c, index) => (
                      <SelectItem key={index} value={String(c?.id)}>
                        {c?.name}
                      </SelectItem>
                    ))}
                    {/* OBSERVER TARGET */}
                    {businessTypesDropdownLoading && (
                      <div className="py-2 text-center text-sm text-gray-500">
                        Loading...
                      </div>
                    )}
                    {/* {!hasMore && (
                                                <div className="py-2 text-center text-sm text-gray-400">
                                                  No More Data
                                                </div>
                                              )} */}
                  </div>
                  {/* {kybTypes.length === 0 && !loadingDropdowns ? (
                    <SelectItem value="__none__" disabled>
                      No KYB types found
                    </SelectItem>
                  ) : (
                    kybTypes.map((kt) => (
                      <SelectItem key={kt.id} value={String(kt.id)}>
                        {kt.name}
                      </SelectItem>
                    ))
                  )} */}
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
