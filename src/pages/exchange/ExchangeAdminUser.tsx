//import { useEffect, useState } from "react";
//import ExchangeLayout from "@/components/layout/ExchangeLayout";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import {
//  Users,
//  Plus,
//  Search,
//  Edit,
//  MapPin,
//  Phone,
//  Mail,
//  Calendar,
//  TrendingUp,
//  CheckCircle,
//  Clock,
//  Shield,
//} from "lucide-react";

//import {
//  Dialog,
//  DialogContent,
//  DialogHeader,
//  DialogTitle,
//  DialogFooter,
//  DialogOverlay,
//} from "@/components/ui/dialog";

//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";

//import { useToast } from "@/hooks/use-toast";
//import BASE_URL from "@/config/config";
//import axios from "axios";
//import { useCookies } from "react-cookie";
//import { useNavigate, useParams } from "react-router-dom";

//const ExchangeAdminUser = () => {
//  const [cookies] = useCookies(["token", "email"]);
//  const [users, setUsers] = useState<any[]>([]);
//  const [currentPage, setCurrentPage] = useState(0);
//  const [totalPages, setTotalPages] = useState(0);
//  const [loading, setLoading] = useState(false);
//  const [totalElements, setTotalElements] = useState(0);
//  const [pageSize] = useState(4);
//  const token = cookies.token;
//  const email = cookies.email;

//  const { toast } = useToast();
//  const navigate = useNavigate();
//  const uuid = useParams();

//  const [userLoading, setUserLoading] = useState(false);

//  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

//  //permissions
//  const [selectedUserForPermissions, setSelectedUserForPermissions] =
//    useState<any>(null);
//  const [allPermissions, setAllPermissions] = useState<any[]>([]);
//  const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>(
//    [],
//  );
//  const [loadingPermissions, setLoadingPermissions] = useState(false);
//  const [isPermissionSelectionModalOpen, setIsPermissionSelectionModalOpen] =
//    useState(false);
//  const [tempSelectedPermissionIds, setTempSelectedPermissionIds] = useState<
//    string[]
//  >([]);
//  const [newUserPermissionIds, setNewUserPermissionIds] = useState<string[]>(
//    [],
//  );
//  const [userForm, setUserForm] = useState({
//    fullName: "",
//    email: "",
//    phoneNumber: "",
//    address: "",
//  });

//  // ---------- Permission Helpers ----------
//  const fetchAllPermissions = async () => {
//    try {
//      setLoadingPermissions(true);
//      const res = await axios.get(`${BASE_URL}/api/v3/permissions/all`, {
//        headers: { Authorization: `Bearer ${token}` },
//      });
//      setAllPermissions(res.data?.data || []);
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: "Failed to load permissions",
//        variant: "destructive",
//      });
//    } finally {
//      setLoadingPermissions(false);
//    }
//  };

//  const fetchUserPermissions = async (userUuid: string) => {
//    try {
//      const res = await axios.get(
//        `${BASE_URL}/api/v3/admin/staff/${userUuid}/permissions`,
//        {
//          headers: { Authorization: `Bearer ${token}` },
//        },
//      );
//      const assigned = res.data?.data || [];
//      setAssignedPermissionIds(assigned.map((p: any) => String(p.id)));
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: "Failed to load user permissions",
//        variant: "destructive",
//      });
//    }
//  };

//  // Recursively collect all permission IDs (for Select All)
//  const getAllPermissionIds = (perms: any[]): string[] => {
//    let ids: string[] = [];
//    perms.forEach((perm) => {
//      ids.push(String(perm.id));
//      if (perm.children && perm.children.length > 0) {
//        ids.push(...getAllPermissionIds(perm.children));
//      }
//    });
//    return ids;
//  };

//  // Recursive rendering of a permission node (tree structure)
//  const renderPermissionNode = (
//    node: any,
//    level: number,
//    selectedIds: string[],
//    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
//  ) => {
//    const nodeId = String(node.id);
//    const hasChildren = node.children && node.children.length > 0;

//    const getAllDescendantIds = (n: any): string[] => {
//      let ids: string[] = [];
//      if (n.children) {
//        n.children.forEach((child: any) => {
//          ids.push(String(child.id));
//          ids.push(...getAllDescendantIds(child));
//        });
//      }
//      return ids;
//    };

//    const isChecked = selectedIds.includes(nodeId);
//    let allChildrenSelected = false;
//    if (hasChildren) {
//      const descendantIds = getAllDescendantIds(node);
//      allChildrenSelected = descendantIds.every((id) =>
//        selectedIds.includes(id),
//      );
//    }

//    const handleToggle = () => {
//      let newSelected = [...selectedIds];
//      if (isChecked || allChildrenSelected) {
//        const idsToRemove = [nodeId, ...getAllDescendantIds(node)];
//        newSelected = newSelected.filter((id) => !idsToRemove.includes(id));
//      } else {
//        const idsToAdd = [nodeId, ...getAllDescendantIds(node)];
//        newSelected = [
//          ...newSelected,
//          ...idsToAdd.filter((id) => !newSelected.includes(id)),
//        ];
//      }
//      setSelectedIds(newSelected);
//    };

//    return (
//      <div key={nodeId} className="flex flex-col">
//        {/* Parent row */}
//        <div
//          style={{ marginLeft: `${level * 20}px` }}
//          className="flex items-start space-x-2 text-center"
//        >
//          <input
//            type="checkbox"
//            id={`perm-${nodeId}`}
//            checked={hasChildren ? allChildrenSelected : isChecked}
//            onChange={handleToggle}
//            className="mt-1 h-4 w-4"
//          />
//          <Label htmlFor={`perm-${nodeId}`} className="text-lg">
//            {node.name}
//            {/*{hasChildren && (
//              <span className="text-xs text-muted-foreground ml-1">
//                ({node.children.length} children)
//              </span>
//            )}*/}
//          </Label>
//        </div>

//        {/* Children (indented further) */}
//        {hasChildren && (
//          <div className="ml-4">
//            {node.children.map((child: any) =>
//              renderPermissionNode(
//                child,
//                level + 1,
//                selectedIds,
//                setSelectedIds,
//              ),
//            )}
//          </div>
//        )}
//      </div>
//    );
//  };
//  // ----------------------------------------

//  const fetchUsers = async (page = 0) => {
//    if (!token) return;
//    try {
//      setLoading(true);
//      const res = await axios.get(`${BASE_URL}/api/v1/exchange-users/all`, {
//        headers: { Authorization: `Bearer ${token}` },
//        params: { page, size: pageSize },
//      });
//      //setUsers(res?.data?.data || []);
//      setUsers(res?.data?.data?.content || []);
//    } catch (error: any) {
//      toast({
//        title: "Error",
//        description: "Failed to load users",
//        variant: "destructive",
//      });
//    } finally {
//      setLoading(false);
//    }
//  };

//  useEffect(() => {
//    if (token) fetchUsers(currentPage);
//  }, [token, currentPage]);

//  const createUser = async () => {
//    try {
//      await axios.post(
//        `${BASE_URL}/api/v1/exchange-users/create`,
//        {
//          fullName: userForm.fullName,
//          email: userForm.email,
//          phoneNumber: userForm.phoneNumber,
//          address: userForm.address,
//          permissionIds: newUserPermissionIds.map(Number), // convert strings to numbers if needed
//        },
//        { headers: { Authorization: `Bearer ${token}` } },
//      );
//      toast({ title: "Success", description: "User created successfully" });
//      setIsCreateModalOpen(false);
//      setUserForm({ fullName: "", email: "", phoneNumber: "", address: "" });
//      setNewUserPermissionIds([]); // reset permissions after creation
//      setCurrentPage(0);
//      fetchUsers(0);
//    } catch (error: any) {
//      toast({
//        title: "Error",
//        description: error?.response?.data?.message || "Failed to create user",
//        variant: "destructive",
//      });
//    }
//  };

//  const getStatusBadge = (status: string) => {
//    const statusMap = {
//      active: {
//        variant: "default" as const,
//        label: "Active",
//        icon: CheckCircle,
//      },
//      inactive: {
//        variant: "secondary" as const,
//        label: "Inactive",
//        icon: Clock,
//      },
//      training: {
//        variant: "destructive" as const,
//        label: "Training",
//        icon: Clock,
//      },
//    };
//    return statusMap[status as keyof typeof statusMap] || statusMap.active;
//  };

//  const totalStaff = users.length;
//  const activeStaff = users.filter((u) => u.active).length;

//  return (
//    <ExchangeLayout>
//      <div className="space-y-8">
//        {/* Header */}
//        <div className="flex items-center justify-between">
//          <div>
//            <h1 className="text-3xl font-bold text-foreground">
//              Exchange User Management
//            </h1>
//            <p className="text-muted-foreground">
//              Manage exchange user and workload distribution
//            </p>
//          </div>
//          <div className="flex space-x-3">
//            <Button
//              variant="business"
//              onClick={() => setIsCreateModalOpen(true)}
//            >
//              <Plus className="h-4 w-4 mr-2" /> Add Exchange User
//            </Button>
//          </div>
//        </div>
//        <h1 className="text-3xl font-bold">Exchange Admin User Lists</h1>

//        {/* ---------- Permission Edit Modal (for existing users) ---------- */}
//        <Dialog
//          open={isPermissionModalOpen}
//          onOpenChange={(open) => {
//            if (!open) {
//              setIsPermissionModalOpen(false);
//              setSelectedUserForPermissions(null);
//              setAssignedPermissionIds([]);
//              setAllPermissions([]);
//            }
//          }}
//        >
//          <DialogContent className="sm:max-w-lg">
//            <DialogHeader>
//              <DialogTitle>
//                Manage Permissions – {selectedUserForPermissions?.fullName}
//              </DialogTitle>
//            </DialogHeader>
//            <div className="py-4 max-h-96 overflow-y-auto">
//              {loadingPermissions ? (
//                <div className="flex justify-center py-8">
//                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                </div>
//              ) : (
//                <div className="space-y-3">
//                  {allPermissions.length === 0 ? (
//                    <p className="text-sm text-muted-foreground text-center">
//                      No permissions available
//                    </p>
//                  ) : (
//                    allPermissions.map((perm) => (
//                      <div key={perm.id} className="flex items-start space-x-3">
//                        <input
//                          type="checkbox"
//                          id={`perm-${perm.id}`}
//                          checked={assignedPermissionIds.includes(
//                            String(perm.id),
//                          )}
//                          onChange={(e) => {
//                            if (e.target.checked) {
//                              setAssignedPermissionIds([
//                                ...assignedPermissionIds,
//                                String(perm.id),
//                              ]);
//                            } else {
//                              setAssignedPermissionIds(
//                                assignedPermissionIds.filter(
//                                  (id) => id !== String(perm.id),
//                                ),
//                              );
//                            }
//                          }}
//                          className="mt-1 h-4 w-4 rounded border-gray-300"
//                        />
//                        <div>
//                          <Label
//                            htmlFor={`perm-${perm.id}`}
//                            className="text-sm font-normal"
//                          >
//                            {perm.name}
//                          </Label>
//                          {perm.description && (
//                            <p className="text-xs text-muted-foreground">
//                              {perm.description}
//                            </p>
//                          )}
//                        </div>
//                      </div>
//                    ))
//                  )}
//                </div>
//              )}
//            </div>
//            <DialogFooter>
//              <Button
//                variant="outline"
//                onClick={() => setIsPermissionModalOpen(false)}
//              >
//                Cancel
//              </Button>
//              <Button
//                variant="business"
//                onClick={async () => {
//                  if (!selectedUserForPermissions) return;
//                  try {
//                    await axios.put(
//                      `${BASE_URL}/api/v3/admin/staff/${selectedUserForPermissions.uuid}/permissions`,
//                      { permissionIds: assignedPermissionIds.map(Number) },
//                      { headers: { Authorization: `Bearer ${token}` } },
//                    );
//                    toast({
//                      title: "Success",
//                      description: "Permissions updated",
//                    });
//                    fetchUsers(currentPage);
//                    setIsPermissionModalOpen(false);
//                    setSelectedUserForPermissions(null);
//                    setAssignedPermissionIds([]);
//                    setAllPermissions([]);
//                  } catch (error: any) {
//                    toast({
//                      title: "Error",
//                      description:
//                        error?.response?.data?.message ||
//                        "Failed to update permissions",
//                      variant: "destructive",
//                    });
//                  }
//                }}
//              >
//                Save Changes
//              </Button>
//            </DialogFooter>
//          </DialogContent>
//        </Dialog>

//        {/* ---------- Create Staff Modal (outer dialog) ---------- */}
//        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//          <DialogContent className="sm:max-w-3xl">
//            <DialogHeader>
//              <DialogTitle className="text-xl">Create Staff Member</DialogTitle>
//            </DialogHeader>
//            <div className="grid grid-cols-1 gap-4 py-4">
//              <div>
//                <Label className="text-lg">Full Name</Label>
//                <Input
//                  value={userForm.fullName}
//                  onChange={(e) =>
//                    setUserForm({ ...userForm, fullName: e.target.value })
//                  }
//                  className="mt-2 py-2 text-lg"
//                  placeholder="Full Name"
//                />
//              </div>
//              <div>
//                <Label className="text-lg">Email Address</Label>
//                <Input
//                  type="email"
//                  value={userForm.email}
//                  onChange={(e) =>
//                    setUserForm({ ...userForm, email: e.target.value })
//                  }
//                  className="mt-2 py-2 text-lg"
//                  placeholder="example@gmail.com"
//                />
//              </div>
//              <div>
//                <Label className="text-lg">Phone Number</Label>
//                <Input
//                  value={userForm.phoneNumber}
//                  onChange={(e) =>
//                    setUserForm({ ...userForm, phoneNumber: e.target.value })
//                  }
//                  className="mt-2 py-2 text-lg"
//                  placeholder="9800000002"
//                />
//              </div>
//              <div>
//                <Label className="text-lg">Address</Label>
//                <Input
//                  value={userForm.address}
//                  onChange={(e) =>
//                    setUserForm({ ...userForm, address: e.target.value })
//                  }
//                  className="mt-2 py-2 text-lg"
//                  placeholder="Enter address"
//                />
//              </div>
//              <div className="flex flex-col items-start">
//                <Label className="text-lg pr-4 mt-2">Permissions:</Label>
//                <Button
//                  onClick={async () => {
//                    await fetchAllPermissions(); // load all permissions
//                    setTempSelectedPermissionIds(newUserPermissionIds); // pre‑select already chosen ones
//                    setIsPermissionSelectionModalOpen(true);
//                  }}
//                >
//                  Choose Permission
//                </Button>
//              </div>
//            </div>
//            <DialogFooter>
//              <Button
//                variant="outline"
//                onClick={() => setIsCreateModalOpen(false)}
//                className="text-lg"
//              >
//                Cancel
//              </Button>
//              <Button
//                variant="business"
//                onClick={createUser}
//                className="text-lg"
//              >
//                Create user
//              </Button>
//            </DialogFooter>
//          </DialogContent>
//        </Dialog>

//        {/* ---------- Permission Selection Modal (inner dialog) ---------- */}
//        <Dialog
//          open={isPermissionSelectionModalOpen}
//          onOpenChange={(open) => {
//            if (!open) {
//              setIsPermissionSelectionModalOpen(false);
//              setTempSelectedPermissionIds([]);
//            }
//          }}
//        >
//          {/* No custom overlay – use the default one */}
//          <DialogContent className="sm:max-w-2xl bg-white">
//            <DialogHeader>
//              <DialogTitle className="text-xl font-bold">
//                Select Permissions
//              </DialogTitle>
//            </DialogHeader>
//            <div className="py-1 max-h-96 overflow-y-auto">
//              {loadingPermissions ? (
//                <div className="flex justify-center py-8">
//                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                </div>
//              ) : (
//                <>
//                  {/* Select All / Clear All */}
//                  <div className="flex justify-between mb-4">
//                    <Button
//                      variant="outline"
//                      size="sm"
//                      onClick={() => {
//                        const allIds = getAllPermissionIds(allPermissions);
//                        setTempSelectedPermissionIds(allIds);
//                      }}
//                    >
//                      Select All
//                    </Button>
//                    <Button
//                      variant="outline"
//                      size="sm"
//                      onClick={() => setTempSelectedPermissionIds([])}
//                    >
//                      Clear All
//                    </Button>
//                  </div>

//                  {/* Render permission tree directly from allPermissions (already nested) */}
//                  <div className="space-y-2">
//                    {allPermissions.map((node) =>
//                      renderPermissionNode(
//                        node,
//                        0,
//                        tempSelectedPermissionIds,
//                        setTempSelectedPermissionIds,
//                      ),
//                    )}
//                  </div>

//                  {/* Selected count */}
//                  <p className="text-lg text-muted-foreground mt-4">
//                    {tempSelectedPermissionIds.length} menu(s) selected
//                  </p>
//                </>
//              )}
//            </div>
//            <DialogFooter>
//              <Button
//                variant="outline"
//                onClick={() => {
//                  setIsPermissionSelectionModalOpen(false);
//                  setTempSelectedPermissionIds([]);
//                }}
//              >
//                Cancel
//              </Button>
//              <Button
//                variant="business"
//                onClick={() => {
//                  setNewUserPermissionIds(tempSelectedPermissionIds); // save selected IDs
//                  setIsPermissionSelectionModalOpen(false);
//                }}
//              >
//                Save Selection
//              </Button>
//            </DialogFooter>
//          </DialogContent>
//        </Dialog>

//        {/* ---------- User List ---------- */}
//        {loading ? (
//          <div className="flex justify-center items-center py-12">
//            <div className="text-center">
//              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//              <p className="text-muted-foreground">Loading users..</p>
//            </div>
//          </div>
//        ) : (
//          <div className="space-y-8">
//            {users.length === 0 ? (
//              <div className="text-center py-12">
//                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//                <h3 className="text-lg font-medium mb-2">No users found</h3>
//                <p className="text-muted-foreground">
//                  Create your first user to get started
//                </p>
//              </div>
//            ) : (
//              users.map((user) => {
//                const status = getStatusBadge(
//                  user.active ? "active" : "inactive",
//                );
//                const StatusIcon = status.icon;
//                return (
//                  <Card
//                    key={user.uuid || user.id}
//                    className="border-l-4 border-l-accent hover:shadow-md transition-smooth"
//                  >
//                    <CardContent className="p-6">
//                      <div className="flex items-start justify-between">
//                        <div className="space-y-4 flex-1">
//                          <div className="flex items-center space-x-4">
//                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
//                              <span className="text-primary-foreground font-semibold">
//                                {user.fullName
//                                  ?.split(" ")
//                                  .map((n: string) => n[0])
//                                  .join("")}
//                              </span>
//                            </div>
//                            <div className="flex-1">
//                              <div className="flex items-center gap-3 mb-1">
//                                <h2 className="font-semibold text-foreground text-2xl">
//                                  {user.fullName}
//                                </h2>
//                                <Badge
//                                  variant={status.variant}
//                                  className="flex items-center gap-1"
//                                >
//                                  <StatusIcon className="h-3 w-3" />{" "}
//                                  {status.label}
//                                </Badge>
//                              </div>
//                            </div>
//                          </div>
//                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
//                            <div className="space-y-1">
//                              <div className="flex items-center text-muted-foreground">
//                                <Mail className="h-3 w-3 mr-1" /> Email:
//                              </div>
//                              <p className="font-medium">{user.email}</p>
//                            </div>
//                            <div className="space-y-1">
//                              <div className="flex items-center text-muted-foreground">
//                                <Phone className="h-3 w-3 mr-1" /> Phone:
//                              </div>
//                              <p className="font-medium">{user.phoneNumber}</p>
//                            </div>
//                            <div className="space-y-1">
//                              <div className="flex items-center text-muted-foreground">
//                                <MapPin className="h-3 w-3 mr-1" /> Address:
//                              </div>
//                              <p className="font-medium">{user.address}</p>
//                            </div>
//                          </div>
//                        </div>
//                        <div className="flex flex-col space-y-2 ml-4">
//                          <Button variant="outline" size="sm">
//                            <Edit className="h-4 w-4 mr-1" /> Edit Details
//                          </Button>
//                          <Button
//                            variant="outline"
//                            size="sm"
//                            onClick={async () => {
//                              setSelectedUserForPermissions(user);
//                              setLoadingPermissions(true);
//                              await Promise.all([
//                                fetchAllPermissions(),
//                                fetchUserPermissions(user.uuid),
//                              ]);
//                              setLoadingPermissions(false);
//                              setIsPermissionModalOpen(true);
//                            }}
//                          >
//                            <Shield className="h-4 w-4 mr-1" /> Permissions
//                          </Button>
//                        </div>
//                      </div>
//                    </CardContent>
//                  </Card>
//                );
//              })
//            )}
//          </div>
//        )}
//      </div>

//      {/* Pagination */}
//      {!loading && users.length > 0 && totalPages > 1 && (
//        <div className="flex items-center justify-end mt-6">
//          <div className="flex items-center space-x-2">
//            <Button
//              variant="outline"
//              size="sm"
//              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//              disabled={currentPage === 0}
//            >
//              Previous
//            </Button>
//            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//              let pageNum;
//              if (totalPages <= 5) {
//                pageNum = i;
//              } else if (currentPage < 3) {
//                pageNum = i;
//              } else if (currentPage > totalPages - 4) {
//                pageNum = totalPages - 5 + i;
//              } else {
//                pageNum = currentPage - 2 + i;
//              }
//              return (
//                <Button
//                  key={pageNum}
//                  variant={currentPage === pageNum ? "default" : "outline"}
//                  size="sm"
//                  onClick={() => setCurrentPage(pageNum)}
//                >
//                  {pageNum + 1}
//                </Button>
//              );
//            })}
//            <Button
//              variant="outline"
//              size="sm"
//              onClick={() =>
//                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
//              }
//              disabled={currentPage === totalPages - 1}
//            >
//              Next
//            </Button>
//          </div>
//        </div>
//      )}
//    </ExchangeLayout>
//  );
//};

//export default ExchangeAdminUser;

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

  const [userLoading, setUserLoading] = useState(false);

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

  const fetchAllPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const res = await axios.get(`${BASE_URL}/api/v3/permissions/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const treeData = res.data?.data || [];
      setPermissionTree(treeData);

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

  const fetchUserPermissions = async (userUuid: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/admin/staff/${userUuid}/permissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const assigned = res.data?.data || [];
      setAssignedPermissionIds(assigned.map((p: any) => String(p.id)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user permissions",
        variant: "destructive",
      });
    }
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
    try {
      await axios.post(
        `${BASE_URL}/api/v1/exchange-users/create`,
        {
          fullName: userForm.fullName,
          email: userForm.email,
          phoneNumber: userForm.phoneNumber,
          address: userForm.address,
          permissionIds: newUserPermissionIds.map(Number),
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
            <Button
              variant="business"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Exchange User
            </Button>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Exchange Admin User Lists</h1>

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
                  {allPermissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      No permissions available
                    </p>
                  ) : (
                    allPermissions.map((perm) => (
                      <div key={perm.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={`perm-${perm.id}`}
                          checked={assignedPermissionIds.includes(
                            String(perm.id),
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedPermissionIds([
                                ...assignedPermissionIds,
                                String(perm.id),
                              ]);
                            } else {
                              setAssignedPermissionIds(
                                assignedPermissionIds.filter(
                                  (id) => id !== String(perm.id),
                                ),
                              );
                            }
                          }}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        <div>
                          <Label
                            htmlFor={`perm-${perm.id}`}
                            className="text-sm font-normal"
                          >
                            {perm.name}
                          </Label>
                          {perm.description && (
                            <p className="text-xs text-muted-foreground">
                              {perm.description}
                            </p>
                          )}
                        </div>
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
                onClick={async () => {
                  if (!selectedUserForPermissions) return;
                  try {
                    await axios.put(
                      `${BASE_URL}/api/v3/admin/staff/${selectedUserForPermissions.uuid}/permissions`,
                      { permissionIds: assignedPermissionIds.map(Number) },
                      { headers: { Authorization: `Bearer ${token}` } },
                    );
                    toast({
                      title: "Success",
                      description: "Permissions updated",
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
              <DialogTitle className="text-xl">Create Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div>
                <Label className="text-lg">Full Name</Label>
                <Input
                  value={userForm.fullName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, fullName: e.target.value })
                  }
                  className="mt-2 py-2 text-lg"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label className="text-lg">Email Address</Label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="mt-2 py-2 text-lg"
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <Label className="text-lg">Phone Number</Label>
                <Input
                  value={userForm.phoneNumber}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phoneNumber: e.target.value })
                  }
                  className="mt-2 py-2 text-lg"
                  placeholder="9800000002"
                />
              </div>
              <div>
                <Label className="text-lg">Address</Label>
                <Input
                  value={userForm.address}
                  onChange={(e) =>
                    setUserForm({ ...userForm, address: e.target.value })
                  }
                  className="mt-2 py-2 text-lg"
                  placeholder="Enter address"
                />
              </div>
              <div className="flex flex-col items-start">
                <Label className="text-lg pr-4 mt-2">Permissions:</Label>
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
              >
                Create user
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
              users.map((user) => {
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
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setSelectedUserForPermissions(user);
                              setLoadingPermissions(true);
                              await Promise.all([
                                fetchAllPermissions(),
                                fetchUserPermissions(user.uuid),
                              ]);
                              setLoadingPermissions(false);
                              setIsPermissionModalOpen(true);
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
      {!loading && users.length > 0 && totalPages > 1 && (
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
      )}
    </ExchangeLayout>
  );
};

export default ExchangeAdminUser;
