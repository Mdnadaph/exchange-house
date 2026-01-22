// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import { Plus, Users, Building, User, Search } from "lucide-react";
// import BASE_URL from "@/config/config";
// import { useCookies } from "react-cookie";

// interface Beneficiary {
//   id: number;
//   name: string;
//   type: "INDIVIDUAL" | "CORPORATE";
//   countryId: number;
//   countryName: string;
//   currency: string;
//   bankName: string;
//   maskedAccount: string;
//   relationshipType: string;
//   monthlyLimit: number;
//   payoutMethod: string;
//   active: boolean;
//   approvalStatus: string;
//   totalPayments: number | null;
//   lastPaymentDate: string | null;
//   totalSent: number | null;
//   avgAmount: number | null;
// }

// interface BeneficiaryGroupFormProps {
//   onGroupCreated?: (group: any) => void;
//   trigger?: React.ReactNode;
// }

// const BeneficiaryGroupForm = ({ onGroupCreated, trigger }: BeneficiaryGroupFormProps) => {
//   const [cookie] = useCookies(["token"]);
//   const token = cookie.token;
//   console.log("token", token);

//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [groupName, setGroupName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<number[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

//   useEffect(() => {
//     if (open) {
//       fetchBeneficiaries();
//     }
//   }, [open]);

//   const fetchBeneficiaries = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/v1/beneficiaries`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch beneficiaries");
//       }

//       const result = await response.json();
//       setBeneficiaries(result.data || []);
//     } catch (error) {
//       console.error("Error fetching beneficiaries:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch beneficiaries. Please try again.",
//         variant: "destructive"
//       });
//     }
//   };

//   const activeBeneficiaries = beneficiaries.filter(b => b.active);

//   const filteredBeneficiaries = activeBeneficiaries.filter(b => 
//     b.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleToggleBeneficiary = (beneficiaryId: number) => {
//     setSelectedBeneficiaries(prev => 
//       prev.includes(beneficiaryId)
//         ? prev.filter(id => id !== beneficiaryId)
//         : [...prev, beneficiaryId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedBeneficiaries.length === filteredBeneficiaries.length) {
//       setSelectedBeneficiaries([]);
//     } else {
//       setSelectedBeneficiaries(filteredBeneficiaries.map(b => b.id));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!groupName.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a group name",
//         variant: "destructive"
//       });
//       return;
//     }

//     if (selectedBeneficiaries.length === 0) {
//       toast({
//         title: "Error", 
//         description: "Please select at least one beneficiary",
//         variant: "destructive"
//       });
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/api/v1/beneficiary-groups`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           groupName,
//           description,
//           beneficiaryIds: selectedBeneficiaries,
//         }),
//       });

//       let result;
//       try {
//         result = await response.json();
//       } catch (jsonError) {
//         console.error("JSON parse error:", jsonError);
//         throw new Error("Invalid response from server");
//       }

//       if (result.status === true) {
//         const fullGroup = {
//           ...result.data,
//           beneficiaryIds: selectedBeneficiaries,
//           beneficiaries: beneficiaries.filter(b => selectedBeneficiaries.includes(b.id)),
//         };
//         onGroupCreated?.(fullGroup);

//         toast({
//           title: "Group Created",
//           description: `"${groupName}" has been created with ${selectedBeneficiaries.length} beneficiaries.`
//         });

//         // Reset form
//         setGroupName("");
//         setDescription("");
//         setSelectedBeneficiaries([]);
//         setSearchQuery("");
//         setOpen(false);
//       } else {
//         console.error("API error:", result.message);
//         toast({
//           title: "Error",
//           description: result.message || "Failed to create group. Please try again.",
//           variant: "destructive"
//         });
//       }
//     } catch (error) {
//       console.error("Error creating group:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create group. Please try again.",
//         variant: "destructive"
//       });
//     }
//   };

//   const selectedIndividuals = selectedBeneficiaries.filter(id => 
//     beneficiaries.find(b => b.id === id)?.type.toLowerCase() === "individual"
//   ).length;

//   const selectedBusinesses = selectedBeneficiaries.filter(id =>
//     beneficiaries.find(b => b.id === id)?.type.toLowerCase() === "corporate"
//   ).length;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline">
//             <Plus className="h-4 w-4 mr-2" />
//             Create Group
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             Create Beneficiary Group
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Group Details */}
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="groupName">Group Name *</Label>
//               <Input
//                 id="groupName"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 placeholder="e.g., Monthly Payroll, Q1 Vendors"
//               />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Optional description for this group"
//                 rows={2}
//               />
//             </div>
//           </div>

//           {/* Selection Summary */}
//           <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4 text-primary" />
//               <span className="text-sm font-medium">{selectedBeneficiaries.length} Selected</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <User className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">{selectedIndividuals} Individuals</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Building className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">{selectedBusinesses} Businesses</span>
//             </div>
//           </div>

//           {/* Beneficiary Selection */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <Label>Select Beneficiaries</Label>
//               <Button variant="ghost" size="sm" onClick={handleSelectAll}>
//                 {selectedBeneficiaries.length === filteredBeneficiaries.length ? "Deselect All" : "Select All"}
//               </Button>
//             </div>

//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search beneficiaries..."
//                 className="pl-9"
//               />
//             </div>

//             <div className="max-h-64 overflow-y-auto border rounded-lg">
//               {filteredBeneficiaries.length === 0 ? (
//                 <div className="p-4 text-center text-muted-foreground">
//                   No active beneficiaries found
//                 </div>
//               ) : (
//                 filteredBeneficiaries.map((beneficiary) => (
//                   <Card 
//                     key={beneficiary.id}
//                     className={`m-2 cursor-pointer transition-colors ${
//                       selectedBeneficiaries.includes(beneficiary.id) 
//                         ? 'border-primary bg-primary/5' 
//                         : 'hover:bg-muted/50'
//                     }`}
//                     onClick={() => handleToggleBeneficiary(beneficiary.id)}
//                   >
//                     <CardContent className="p-3">
//                       <div className="flex items-center gap-3">
//                         <Checkbox
//                           checked={selectedBeneficiaries.includes(beneficiary.id)}
//                           onCheckedChange={() => handleToggleBeneficiary(beneficiary.id)}
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             {beneficiary.type.toLowerCase() === "corporate" ? (
//                               <Building className="h-4 w-4 text-primary" />
//                             ) : (
//                               <User className="h-4 w-4 text-primary" />
//                             )}
//                             <span className="font-medium">{beneficiary.name}</span>
//                             <Badge variant="outline" className="text-xs">
//                               {beneficiary.type.toLowerCase() === "corporate" ? "Business" : "Individual"}
//                             </Badge>
//                           </div>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {beneficiary.bankName} • {beneficiary.maskedAccount}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <Button variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={!groupName || selectedBeneficiaries.length === 0}>
//               Create Group
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BeneficiaryGroupForm;





import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Users,
  Building,
  User,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Layers,
} from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

// ────────────────────────────────────────────────
//  Types matching REAL API responses
// ────────────────────────────────────────────────

interface BeneficiarySummary {
  id: number;
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  countryId: number;
  countryName: string;
  currency: string;
  bankName: string;
  maskedAccount: string;
  relationshipType: string;
  monthlyLimit: number;
  payoutMethod: string;
  active: boolean;
  approvalStatus: string;
  // ... other fields you might use later
}

interface BeneficiaryGroupSummary {
  id: number;
  groupName: string;
  description: string;
  totalBeneficiaries: number;
  beneficiaryNames: string[];
}

interface BeneficiaryGroupFormProps {
  // Changed: now receives real summary shape
  onGroupCreated?: (newGroup: BeneficiaryGroupSummary) => void;
  trigger?: React.ReactNode;
}

const BeneficiaryGroupForm = ({ onGroupCreated, trigger }: BeneficiaryGroupFormProps) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  // Real beneficiary list (for selection)
  const [beneficiaries, setBeneficiaries] = useState<BeneficiarySummary[]>([]);

  useEffect(() => {
    if (open && token) {
      loadBeneficiaries();
    }
  }, [open, token]);

  const loadBeneficiaries = async () => {
    if (!token) {
      toast({ title: "Error", description: "No token found", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/beneficiaries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.status !== true || !json.data?.beneficiaries) {
        throw new Error("Unexpected response format");
      }

      setBeneficiaries(json.data.beneficiaries);
    } catch (err: any) {
      const msg = err.message || "Failed to load beneficiaries";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const activeBeneficiaries = beneficiaries.filter((b) => b.active);

  const filtered = activeBeneficiaries.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((b) => b.id));
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      toast({ title: "Error", description: "Group name is required", variant: "destructive" });
      return;
    }
    if (selectedIds.length === 0) {
      toast({ title: "Error", description: "Select at least one beneficiary", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/beneficiary-groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupName: groupName.trim(),
          description: description.trim(),
          beneficiaryIds: selectedIds,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }

      // API returns summary shape → we use that
      const createdGroup: BeneficiaryGroupSummary = {
        id: json.data?.id || Date.now(), // fallback
        groupName: json.data?.groupName || groupName,
        description: json.data?.description || description,
        totalBeneficiaries: selectedIds.length,
        beneficiaryNames: beneficiaries
          .filter((b) => selectedIds.includes(b.id))
          .map((b) => b.name),
      };

      onGroupCreated?.(createdGroup);

      toast({
        title: "Success",
        description: (
          <span>
            Group <strong>{groupName}</strong> created ({selectedIds.length} members)
          </span>
        ),
      });

      // Reset
      setGroupName("");
      setDescription("");
      setSelectedIds([]);
      setSearch("");
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to create group",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countIndividuals = selectedIds.filter(
    (id) => beneficiaries.find((b) => b.id === id)?.type === "INDIVIDUAL"
  ).length;

  const countBusinesses = selectedIds.length - countIndividuals;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Create Beneficiary Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ─── Group info ─── */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">
                Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Monthly Payroll, Q1 Vendors"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional..."
                rows={2}
                className="mt-1.5 resize-none"
              />
            </div>
          </div>

          {/* Selection stats */}
          <div className="flex flex-wrap gap-4 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedIds.length} selected</span>
            </div>
            {countIndividuals > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {countIndividuals} individual
              </div>
            )}
            {countBusinesses > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building className="h-3.5 w-3.5" />
                {countBusinesses} business
              </div>
            )}
          </div>

          {/* Beneficiary picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Beneficiaries</Label>
              {filtered.length > 0 && (
                <Button variant="ghost" size="sm" onClick={toggleAll}>
                  {selectedIds.length === filtered.length ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search beneficiaries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="border rounded-md max-h-64 overflow-y-auto bg-background">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Loading beneficiaries...</p>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-destructive">
                  <AlertCircle className="mx-auto h-10 w-10 mb-3" />
                  <p className="font-medium">{error}</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={loadBeneficiaries}>
                    Retry
                  </Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No matching active beneficiaries
                </div>
              ) : (
                filtered.map((b) => {
                  const selected = selectedIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`flex items-start gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/60 transition-colors ${
                        selected ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggle(b.id)}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggle(b.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {b.type === "CORPORATE" ? (
                            <Building className="h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <User className="h-4 w-4 shrink-0 text-primary" />
                          )}
                          <span className="font-medium truncate">{b.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {b.type === "CORPORATE" ? "Business" : "Individual"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {b.bankName} • {b.maskedAccount} • {b.countryName}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !groupName.trim() || selectedIds.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BeneficiaryGroupForm;