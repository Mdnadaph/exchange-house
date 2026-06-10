import { useEffect, useMemo, useState } from "react";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Plus,
  Search,
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader2 } from "lucide-react";
import { PermissionGate } from "@/contexts/PermissionGate";
const DASHBOARD_PERMISSION_CODE = "NAV_DASHBOARD";
const ExchangeAdminUser = () => {
  const [cookies] = useCookies(["token", "email"]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(4);
  const token = cookies.token;
  const email = cookies.email;

  const { toast } = useToast();
  const navigate = useNavigate();
  const uuid = useParams();

  const [dashboardPermissionId, setDashboardPermissionId] = useState<
    string | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionTree, setPermissionTree] = useState<any[]>([]);
  //permissions
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState<any>(null);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>(
    [],
  );
  const [rawSelectedIds, setRawSelectedIds] = useState<string[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, string | null>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [isPermissionSelectionModalOpen, setIsPermissionSelectionModalOpen] =
    useState(false);

  const [newUserPermissionIds, setNewUserPermissionIds] = useState<string[]>(
    [],
  );
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!userForm.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (userForm.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email
    if (!userForm.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userForm.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Phone Number
    const digits = userForm.phoneNumber
      ? userForm.phoneNumber.replace(/\D/g, "")
      : "";
    if (!digits) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (digits.length < 5) {
      newErrors.phoneNumber = "Phone number must be at least 5 digits";
    }

    // Address
    if (!userForm.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ---------- Permission Helpers ----------
  const handleToggleNode = (nodeId) => {
    setRawSelectedIds((prev) => {
      if (prev.includes(nodeId)) {
        return prev.filter((id) => id !== nodeId);
      } else {
        return [...prev, nodeId];
      }
    });
  };
  const filterOutDashboard = (
    nodes: any[],
  ): { filtered: any[]; dashboardId: string | null } => {
    let dashboardId: string | null = null;

    const filterNodes = (items: any[]): any[] => {
      return items.reduce((acc, node) => {
        if (node.code === DASHBOARD_PERMISSION_CODE) {
          dashboardId = String(node.id); // capture the ID
          return acc; // skip this node entirely
        }
        // Process children recursively
        const newNode = { ...node };
        if (node.children?.length) {
          newNode.children = filterNodes(node.children);
        }
        acc.push(newNode);
        return acc;
      }, []);
    };

    const filtered = filterNodes(nodes);
    return { filtered, dashboardId };
  };
  const fetchAllPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const res = await axios.get(
        `${BASE_URL}/api/v3/permissions/all?portalType=EXCHANGE_ADMIN`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const treeData = res.data?.data || [];
      console.log("res", res);
      const { filtered: treeDataFiltered, dashboardId } =
        filterOutDashboard(treeData);
      setPermissionTree(treeDataFiltered);
      setDashboardPermissionId(dashboardId);
      // Build parent map: id -> parentId (or null for roots)
      const buildParentMap = (nodes, parentId = null) => {
        let map = {};
        nodes.forEach((node) => {
          map[String(node.id)] = parentId ? String(parentId) : null;
          if (node.children && node.children.length) {
            map = { ...map, ...buildParentMap(node.children, node.id) };
          }
        });
        return map;
      };
      const parentMap = buildParentMap(treeData);
      setParentMap(parentMap);

      // Flatten for the simple edit modal (optional)
      const flattenPermissions = (nodes) => {
        let flat = [];
        nodes.forEach((node) => {
          flat.push(node);
          if (node.children && node.children.length > 0) {
            flat.push(...flattenPermissions(node.children));
          }
        });
        return flat;
      };
      const flatList = flattenPermissions(treeData);
      setAllPermissions(flatList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoadingPermissions(false);
    }
  };

  const computeEffectiveIds = (rawIds, parentMap) => {
    const effective = new Set(rawIds);
    rawIds.forEach((id) => {
      let parentId = parentMap[id];
      while (parentId) {
        effective.add(parentId);
        parentId = parentMap[parentId];
      }
    });
    return Array.from(effective);
  };

  // Recursively collect all permission IDs (for Select All)
  const getAllPermissionIds = (perms: any[]): string[] => {
    let ids: string[] = [];
    perms.forEach((perm) => {
      ids.push(String(perm.id));
      if (perm.children && perm.children.length > 0) {
        ids.push(...getAllPermissionIds(perm.children));
      }
    });
    return ids;
  };

  const effectiveSelectedIds = useMemo(
    () => computeEffectiveIds(rawSelectedIds, parentMap),
    [rawSelectedIds, parentMap],
  );

  // Recursive rendering of a permission node (tree structure)
  const renderPermissionNode = (
    node,
    level,
    effectiveSelectedIds,
    onToggle,
  ) => {
    const nodeId = String(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isChecked = effectiveSelectedIds.includes(nodeId);

    return (
      <div key={nodeId} className="flex flex-col">
        {/* Parent row */}
        <div
          style={{ marginLeft: `${level * 20}px` }}
          className="flex items-start space-x-2"
        >
          <input
            type="checkbox"
            id={`perm-${nodeId}`}
            checked={isChecked}
            onChange={() => onToggle(nodeId)}
            className="mt-1 h-4 w-4"
          />
          <Label htmlFor={`perm-${nodeId}`} className="text-lg">
            {node.name}
          </Label>
        </div>

        {/* Children */}
        {hasChildren && (
          <div className="ml-4">
            {node.children.map((child) =>
              renderPermissionNode(
                child,
                level + 1,
                effectiveSelectedIds,
                onToggle,
              ),
            )}
          </div>
        )}
      </div>
    );
  };
  // ----------------------------------------

  const fetchUsers = async (page = 0) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/exchange-users/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size: pageSize },
      });
      setUsers(res?.data?.data?.content || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers(currentPage);
  }, [token, currentPage]);

  const createUser = async () => {
    if (!validateAll()) {
      //toast({
      //  title: "Validation Error",
      //  description: "Please fix the errors before submitting.",
      //  variant: "destructive",
      //});
      return;
    }
    setIsCreating(true);
    let permissionIds = newUserPermissionIds.map(Number);
    if (
      dashboardPermissionId &&
      !permissionIds.includes(Number(dashboardPermissionId))
    ) {
      permissionIds.push(Number(dashboardPermissionId));
    }
    try {
      await axios.post(
        `${BASE_URL}/api/v1/exchange-users/create`,
        {
          fullName: userForm.fullName,
          email: userForm.email,
          phoneNumber: userForm.phoneNumber,
          address: userForm.address,
          permissionIds,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast({ title: "Success", description: "User created successfully" });
      setIsCreateModalOpen(false);
      setUserForm({ fullName: "", email: "", phoneNumber: "", address: "" });
      setNewUserPermissionIds([]);
      setCurrentPage(0);
      fetchUsers(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: CheckCircle,
      },
      inactive: {
        variant: "secondary" as const,
        label: "Inactive",
        icon: Clock,
      },
      training: {
        variant: "destructive" as const,
        label: "Training",
        icon: Clock,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  const totalStaff = users.length;
  const activeStaff = users.filter((u) => u.active).length;
  const handleToggle = (perm: any) => {
    const parentId = String(perm.id);
    const childIds = perm.children?.map((c: any) => String(c.id)) || [];

    const allIds = [parentId, ...childIds];

    setAssignedPermissionIds((prev) => {
      const allSelected = allIds.every((id) => prev.includes(id));

      if (allSelected) {
        return prev.filter((id) => !allIds.includes(id));
      } else {
        return [...new Set([...prev, ...allIds])];
      }
    });
  };
  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Exchange User Management
            </h1>
            <p className="text-muted-foreground">
              Manage exchange user and workload distribution
            </p>
          </div>
          <div className="flex space-x-3">
            <PermissionGate permission="BTN_CREATE_EXCHANGE_USER">
              <Button
                variant="business"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Exchange User
              </Button>
            </PermissionGate>
          </div>
        </div>
        {/* <h1 className="text-3xl font-bold">Exchange Admin User Lists</h1> */}

        {/* ---------- Permission Edit Modal (for existing users) ---------- */}
        <Dialog
          open={isPermissionModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsPermissionModalOpen(false);
              setSelectedUserForPermissions(null);
              setAssignedPermissionIds([]);
              setAllPermissions([]);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Manage Permissions – {selectedUserForPermissions?.fullName}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 max-h-96 overflow-y-auto">
              {loadingPermissions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {permissionTree?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      No permissions available
                    </p>
                  ) : (
                    permissionTree?.map((perm) => (
                      <div key={perm.id} className="space-y-2">
                        {/* Parent */}
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={`perm-${perm.id}`}
                            checked={assignedPermissionIds.includes(
                              String(perm.id),
                            )}
                            onChange={() => handleToggle(perm)}
                            className="mt-1 h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`perm-${perm.id}`}
                            className="text-sm font-normal"
                          >
                            {perm.name}
                          </Label>
                        </div>

                        {/* Children */}
                        {perm.children && perm.children.length > 0 && (
                          <div className="ml-6 space-y-2">
                            {perm.children.map((child: any) => (
                              <div
                                key={child.id}
                                className="flex items-start space-x-3"
                              >
                                <input
                                  type="checkbox"
                                  id={`perm-${child.id}`}
                                  checked={assignedPermissionIds.includes(
                                    String(child.id),
                                  )}
                                  onChange={() =>
                                    handleToggle({ id: child.id })
                                  }
                                  className="mt-1 h-4 w-4 rounded border-gray-300"
                                />
                                <Label
                                  htmlFor={`perm-${child.id}`}
                                  className="text-sm font-normal"
                                >
                                  {child.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPermissionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="business"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  if (!selectedUserForPermissions) return;
                  let permissionIds = assignedPermissionIds.map(Number);

                  // Always include dashboard
                  if (
                    dashboardPermissionId &&
                    !permissionIds.includes(Number(dashboardPermissionId))
                  ) {
                    permissionIds.push(Number(dashboardPermissionId));
                  }
                  try {
                    const res = await axios.put(
                      `${BASE_URL}/api/v1/exchange-users/${selectedUserForPermissions.uuid}/permissions`,
                      { permissionIds },
                      { headers: { Authorization: `Bearer ${token}` } },
                    );

                    toast({
                      title: "Success",
                      description: res?.data?.message || "Permissions updated",
                    });
                    fetchUsers(currentPage);
                    setIsPermissionModalOpen(false);
                    setSelectedUserForPermissions(null);
                    setAssignedPermissionIds([]);
                    setAllPermissions([]);
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description:
                        error?.response?.data?.message ||
                        "Failed to update permissions",
                      variant: "destructive",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---------- Create Staff Modal (outer dialog) ---------- */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Create Exchange Admin User
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pl-2">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-lg">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={userForm.fullName}
                    onChange={(e) => {
                      setUserForm({ ...userForm, fullName: e.target.value });
                      clearError("fullName");
                    }}
                    className="mt-2 py-2 text-lg"
                    placeholder="Full Name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-lg">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => {
                      setUserForm({ ...userForm, email: e.target.value });
                      clearError("email");
                    }}
                    className="mt-2 py-2 text-lg"
                    placeholder="example@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label className="text-lg">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={userForm.address}
                    onChange={(e) => {
                      setUserForm({ ...userForm, address: e.target.value });
                      clearError("address");
                    }}
                    className="mt-2 py-2 text-lg"
                    placeholder="Enter address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-lg">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>

                  <PhoneInput
                    country={"ae"} // default country (UAE)
                    value={userForm.phoneNumber}
                    onChange={(value) => {
                      setUserForm({ ...userForm, phoneNumber: value });
                      clearError("phoneNumber");
                    }}
                    inputProps={{
                      name: "phone",
                      id: "phone",
                    }}
                    containerClass="w-full mt-1"
                    inputClass="!h-10 !w-full !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm !ring-offset-background !pl-[52px] !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:ring-offset-2"
                    buttonClass="!absolute !left-0 !top-0 !h-10 !w-12 !border-0 !bg-transparent !flex !items-center !justify-center !rounded-l-md hover:!bg-accent/50"
                    dropdownClass="!bg-background !border !border-border !rounded-md !shadow-lg"
                    enableSearch
                    searchPlaceholder="Search country..."
                    preferredCountries={["ae", "in"]}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <Label className="text-lg pr-4 mt-2">
                    Permissions <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    onClick={async () => {
                      await fetchAllPermissions();
                      setRawSelectedIds(newUserPermissionIds);
                      setIsPermissionSelectionModalOpen(true);
                    }}
                  >
                    Choose Permission
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-lg"
              >
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={createUser}
                className="text-lg"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create user"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---------- Permission Selection Modal (inner dialog) ---------- */}
        <Dialog
          open={isPermissionSelectionModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsPermissionSelectionModalOpen(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Select Permissions
              </DialogTitle>
            </DialogHeader>
            <div className="py-1 max-h-96 overflow-y-auto">
              {loadingPermissions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allIds = getAllPermissionIds(permissionTree);
                        setRawSelectedIds(allIds);
                      }}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawSelectedIds([])}
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {permissionTree.map((node) =>
                      renderPermissionNode(
                        node,
                        0,
                        effectiveSelectedIds,
                        handleToggleNode,
                      ),
                    )}
                  </div>

                  <p className="text-lg text-muted-foreground mt-4">
                    {rawSelectedIds.length} menu(s) selected
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsPermissionSelectionModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="business"
                onClick={() => {
                  setNewUserPermissionIds(effectiveSelectedIds as string[]);
                  setIsPermissionSelectionModalOpen(false);
                }}
              >
                Save Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---------- User List ---------- */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users..</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Create your first user to get started
                </p>
              </div>
            ) : (
              users?.map((user) => {
                const status = getStatusBadge(
                  user.active ? "active" : "inactive",
                );
                const StatusIcon = status.icon;
                return (
                  <Card
                    key={user.uuid || user.id}
                    className="border-l-4 border-l-accent hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold">
                                {user.fullName
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h2 className="font-semibold text-foreground text-2xl">
                                  {user.fullName}
                                </h2>
                                <Badge
                                  variant={status.variant}
                                  className="flex items-center gap-1"
                                >
                                  <StatusIcon className="h-3 w-3" />{" "}
                                  {status.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" /> Email:
                              </div>
                              <p className="font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" /> Phone:
                              </div>
                              <p className="font-medium">{user.phoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" /> Address:
                              </div>
                              <p className="font-medium">{user.address}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {/* <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit Details
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setSelectedUserForPermissions(user);
                              setLoadingPermissions(true);
                              await Promise.all([
                                fetchAllPermissions(),
                                // fetchUserPermissions(user.uuid),
                              ]);
                              setLoadingPermissions(false);
                              setIsPermissionModalOpen(true);
                              setAssignedPermissionIds(
                                user?.permissions?.map((id: number) =>
                                  String(id),
                                ),
                              );
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" /> Permissions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {!loading && users.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

      <div className="flex items-center justify-end mt-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage < 3) {
              pageNum = i;
            } else if (currentPage > totalPages - 4) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </Button>
            );
          })}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages ? totalPages - 1 : 0),
              )
            }
            disabled={currentPage >= (totalPages || 1) - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeAdminUser;
