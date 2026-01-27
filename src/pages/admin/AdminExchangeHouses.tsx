// import { useState } from "react";
// // import PlatformAdminLayout from "@/components/layout/PlatformAdminLayout";
// import AdminLayout from "@/components/layout/AdminLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   Landmark, 
//   Plus, 
//   Search, 
//   Building2, 
//   Users, 
//   GitBranch,
//   Clock,
//   CheckCircle,
//   XCircle,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Eye,
//   Ban,
//   Power
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import axios from "axios";
// import { useCookies } from "react-cookie";
// import BASE_URL from "@/config/config";

// const AdminExchangeHouses = () => {

//   const [cookies] = useCookies(["token"]);
//   const token = cookies.token;


//   const { t, isRTL } = useLanguage();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
//   const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
//   const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
//   const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     legalName: "",
//     tradingName: "",
//     registrationNumber: "",
//     licenseNumber: "",
//     licenseExpiry: "",
//     address: "",
//     city: "",
//     country: "UAE",
//     postalCode: "",
//     contactName: "",
//     contactEmail: "",
//     contactPhone: "",
//     adminEmail: "",
//     subscriptionPlan: "professional"
//   });

//   const stats = [
//     {
//       title: t('totalExchangeHouses'),
//       value: "12",
//       icon: Landmark,
//       color: "text-blue-600"
//     },
//     {
//       title: t('activeExchangeHouses'),
//       value: "10",
//       icon: CheckCircle,
//       color: "text-green-600"
//     },
//     {
//       title: t('pendingApprovalHouses'),
//       value: "1",
//       icon: Clock,
//       color: "text-orange-600"
//     },
//     {
//       title: t('suspendedHouses'),
//       value: "1",
//       icon: XCircle,
//       color: "text-red-600"
//     }
//   ];

//   const exchangeHouses = [
//     {
//       id: "EH001",
//       name: "Al Ansari Exchange",
//       tradingName: "Al Ansari Exchange LLC",
//       licenseNumber: "CB-2024-001",
//       location: "Dubai, UAE",
//       contactPerson: "Ahmed Al Ansari",
//       email: "admin@alansari.ae",
//       branches: 45,
//       status: "active",
//       plan: "enterprise",
//       onboardedDate: "2024-01-15",
//       monthlyVolume: "$2.5M"
//     },
//     {
//       id: "EH002",
//       name: "UAE Exchange",
//       tradingName: "UAE Exchange Centre LLC",
//       licenseNumber: "CB-2024-002",
//       location: "Abu Dhabi, UAE",
//       contactPerson: "Fatima Al Zahra",
//       email: "admin@uaeexchange.ae",
//       branches: 32,
//       status: "active",
//       plan: "enterprise",
//       onboardedDate: "2024-01-10",
//       monthlyVolume: "$1.8M"
//     },
//     {
//       id: "EH003",
//       name: "Al Rostamani Exchange",
//       tradingName: "Al Rostamani International Exchange",
//       licenseNumber: "CB-2024-003",
//       location: "Sharjah, UAE",
//       contactPerson: "Omar Abdullah",
//       email: "admin@rostamani.ae",
//       branches: 18,
//       status: "active",
//       plan: "professional",
//       onboardedDate: "2024-02-01",
//       monthlyVolume: "$890K"
//     },
//     {
//       id: "EH004",
//       name: "Global Exchange",
//       tradingName: "Global Money Exchange LLC",
//       licenseNumber: "CB-2024-004",
//       location: "Dubai, UAE",
//       contactPerson: "Priya Sharma",
//       email: "admin@globalexchange.ae",
//       branches: 8,
//       status: "pending",
//       plan: "professional",
//       onboardedDate: "2024-03-10",
//       monthlyVolume: "$0"
//     },
//     {
//       id: "EH005",
//       name: "Emirates Money Exchange",
//       tradingName: "Emirates Money Exchange Co.",
//       licenseNumber: "CB-2024-005",
//       location: "Ajman, UAE",
//       contactPerson: "Khalid Hassan",
//       email: "admin@emiratesmoney.ae",
//       branches: 5,
//       status: "suspended",
//       plan: "basic",
//       onboardedDate: "2024-01-20",
//       monthlyVolume: "$0"
//     }
//   ];

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       active: { variant: "default" as const, label: t('active'), icon: CheckCircle },
//       pending: { variant: "secondary" as const, label: t('pending'), icon: Clock },
//       suspended: { variant: "destructive" as const, label: t('suspended'), icon: XCircle }
//     };
//     return statusMap[status as keyof typeof statusMap] || statusMap.pending;
//   };

//   const getPlanBadge = (plan: string) => {
//     const planMap = {
//       basic: { variant: "outline" as const, label: t('basic') },
//       professional: { variant: "secondary" as const, label: t('professional') },
//       enterprise: { variant: "default" as const, label: t('enterprise') }
//     };
//     return planMap[plan as keyof typeof planMap] || planMap.basic;
//   };

//   const handleSubmitOnboarding = () => {
//     // Validation
//     if (!formData.legalName || !formData.licenseNumber || !formData.adminEmail) {
//       toast({
//         title: t('validationError'),
//         description: t('fillAllFields'),
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: t('exchangeHouseCreated'),
//       description: t('exchangeHouseCreatedDesc'),
//     });
//     setIsOnboardingOpen(false);
//     setFormData({
//       legalName: "",
//       tradingName: "",
//       registrationNumber: "",
//       licenseNumber: "",
//       licenseExpiry: "",
//       address: "",
//       city: "",
//       country: "UAE",
//       postalCode: "",
//       contactName: "",
//       contactEmail: "",
//       contactPhone: "",
//       adminEmail: "",
//       subscriptionPlan: "professional"
//     });
//   };

//   const handleSuspend = () => {
//     toast({
//       title: t('suspendExchangeHouse'),
//       description: `Exchange house ${selectedHouse} has been suspended.`,
//     });
//     setSuspendDialogOpen(false);
//     setSelectedHouse(null);
//   };

//   const handleActivate = () => {
//     toast({
//       title: t('activateExchangeHouse'),
//       description: `Exchange house ${selectedHouse} has been activated.`,
//     });
//     setActivateDialogOpen(false);
//     setSelectedHouse(null);
//   };

//   const filteredHouses = exchangeHouses.filter(house =>
//     house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     house.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     house.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
//           <div className={isRTL ? 'text-right' : ''}>
//             <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('exchangeHouseManagement')}</h1>
//             <p className="text-muted-foreground text-sm sm:text-base">{t('manageExchangeHouses')}</p>
//           </div>
//           <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
//             <DialogTrigger asChild>
//               <Button variant="business" className={isRTL ? 'flex-row-reverse' : ''}>
//                 <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                 {t('onboardExchangeHouse')}
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>{t('exchangeHouseOnboardingForm')}</DialogTitle>
//                 <DialogDescription>
//                   {t('manageExchangeHouses')}
//                 </DialogDescription>
//               </DialogHeader>
              
//               <div className="space-y-6 py-4">
//                 {/* Business Information */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-foreground">{t('exchangeHouseDetails')}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="legalName">{t('legalBusinessName')} *</Label>
//                       <Input
//                         id="legalName"
//                         value={formData.legalName}
//                         onChange={(e) => setFormData({...formData, legalName: e.target.value})}
//                         placeholder="Al Ansari Exchange LLC"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="tradingName">{t('tradingName')}</Label>
//                       <Input
//                         id="tradingName"
//                         value={formData.tradingName}
//                         onChange={(e) => setFormData({...formData, tradingName: e.target.value})}
//                         placeholder="Al Ansari Exchange"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="registrationNumber">{t('registrationNumber')}</Label>
//                       <Input
//                         id="registrationNumber"
//                         value={formData.registrationNumber}
//                         onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
//                         placeholder="REG-2024-XXXXX"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="licenseNumber">{t('centralBankLicense')} *</Label>
//                       <Input
//                         id="licenseNumber"
//                         value={formData.licenseNumber}
//                         onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
//                         placeholder="CB-2024-XXXXX"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="licenseExpiry">{t('licenseExpiryDate')}</Label>
//                       <Input
//                         id="licenseExpiry"
//                         type="date"
//                         value={formData.licenseExpiry}
//                         onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-foreground">{t('businessAddress')}</h3>
//                   <div className="space-y-2">
//                     <Label htmlFor="address">{t('businessAddress')}</Label>
//                     <Textarea
//                       id="address"
//                       value={formData.address}
//                       onChange={(e) => setFormData({...formData, address: e.target.value})}
//                       placeholder="Street address, building number..."
//                       rows={2}
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="city">{t('city')}</Label>
//                       <Input
//                         id="city"
//                         value={formData.city}
//                         onChange={(e) => setFormData({...formData, city: e.target.value})}
//                         placeholder="Dubai"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="country">{t('country')}</Label>
//                       <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="UAE">United Arab Emirates</SelectItem>
//                           <SelectItem value="SA">Saudi Arabia</SelectItem>
//                           <SelectItem value="KW">Kuwait</SelectItem>
//                           <SelectItem value="BH">Bahrain</SelectItem>
//                           <SelectItem value="OM">Oman</SelectItem>
//                           <SelectItem value="QA">Qatar</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="postalCode">{t('postalCode')}</Label>
//                       <Input
//                         id="postalCode"
//                         value={formData.postalCode}
//                         onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
//                         placeholder="00000"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-foreground">{t('contactPerson')}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="contactName">{t('primaryContactName')}</Label>
//                       <Input
//                         id="contactName"
//                         value={formData.contactName}
//                         onChange={(e) => setFormData({...formData, contactName: e.target.value})}
//                         placeholder="Full name"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="contactEmail">{t('primaryContactEmail')}</Label>
//                       <Input
//                         id="contactEmail"
//                         type="email"
//                         value={formData.contactEmail}
//                         onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
//                         placeholder="contact@example.com"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="contactPhone">{t('primaryContactPhone')}</Label>
//                       <Input
//                         id="contactPhone"
//                         value={formData.contactPhone}
//                         onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
//                         placeholder="+971 XX XXX XXXX"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Admin Account */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-foreground">{t('adminPortal')}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="adminEmail">{t('adminEmail')} *</Label>
//                       <Input
//                         id="adminEmail"
//                         type="email"
//                         value={formData.adminEmail}
//                         onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
//                         placeholder="admin@exchangehouse.com"
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         A temporary password will be sent to this email.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Subscription Plan */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-foreground">{t('subscriptionPlan')}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <Card 
//                       className={`cursor-pointer transition-all ${formData.subscriptionPlan === 'basic' ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
//                       onClick={() => setFormData({...formData, subscriptionPlan: 'basic'})}
//                     >
//                       <CardContent className="p-4 text-center">
//                         <h4 className="font-semibold">{t('basic')}</h4>
//                         <p className="text-xs text-muted-foreground mt-1">{t('basicPlanDesc')}</p>
//                         <p className="text-lg font-bold mt-2">$299/mo</p>
//                       </CardContent>
//                     </Card>
//                     <Card 
//                       className={`cursor-pointer transition-all ${formData.subscriptionPlan === 'professional' ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
//                       onClick={() => setFormData({...formData, subscriptionPlan: 'professional'})}
//                     >
//                       <CardContent className="p-4 text-center">
//                         <h4 className="font-semibold">{t('professional')}</h4>
//                         <p className="text-xs text-muted-foreground mt-1">{t('professionalPlanDesc')}</p>
//                         <p className="text-lg font-bold mt-2">$799/mo</p>
//                       </CardContent>
//                     </Card>
//                     <Card 
//                       className={`cursor-pointer transition-all ${formData.subscriptionPlan === 'enterprise' ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
//                       onClick={() => setFormData({...formData, subscriptionPlan: 'enterprise'})}
//                     >
//                       <CardContent className="p-4 text-center">
//                         <h4 className="font-semibold">{t('enterprise')}</h4>
//                         <p className="text-xs text-muted-foreground mt-1">{t('enterprisePlanDesc')}</p>
//                         <p className="text-lg font-bold mt-2">Custom</p>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button variant="outline" onClick={() => setIsOnboardingOpen(false)}>
//                     {t('cancel')}
//                   </Button>
//                   <Button onClick={handleSubmitOnboarding}>
//                     {t('submitOnboarding')}
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
//                 <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                   <CardTitle className="text-sm font-medium text-muted-foreground">
//                     {stat.title}
//                   </CardTitle>
//                   <Icon className={`h-5 w-5 ${stat.color}`} />
//                 </CardHeader>
//                 <CardContent className={isRTL ? 'text-right' : ''}>
//                   <div className="text-2xl font-bold text-foreground">{stat.value}</div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Search */}
//         <div className="relative max-w-md">
//           <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
//           <Input
//             placeholder={`${t('search')} ${t('exchangeHouseManagement').toLowerCase()}...`}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={isRTL ? 'pr-10' : 'pl-10'}
//           />
//         </div>

//         {/* Exchange Houses List */}
//         <div className="space-y-4">
//           {filteredHouses.map((house) => {
//             const status = getStatusBadge(house.status);
//             const plan = getPlanBadge(house.plan);
//             const StatusIcon = status.icon;
            
//             return (
//               <Card key={house.id} className="shadow-card">
//                 <CardContent className="p-6">
//                   <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
//                     <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                       <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Landmark className="h-6 w-6 text-primary" />
//                       </div>
//                       <div className={isRTL ? 'text-right' : ''}>
//                         <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
//                           <h3 className="font-semibold text-foreground text-lg">{house.name}</h3>
//                           <Badge variant={status.variant} className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                             <StatusIcon className="h-3 w-3" />
//                             {status.label}
//                           </Badge>
//                           <Badge variant={plan.variant}>{plan.label}</Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">{house.tradingName}</p>
//                         <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
//                           <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                             <Building2 className="h-3.5 w-3.5" />
//                             {house.location}
//                           </span>
//                           <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                             <GitBranch className="h-3.5 w-3.5" />
//                             {house.branches} {t('branchLocations').toLowerCase()}
//                           </span>
//                           <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                             <Users className="h-3.5 w-3.5" />
//                             {house.contactPerson}
//                           </span>
//                         </div>
//                         <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
//                           <span>{t('centralBankLicense')}: {house.licenseNumber}</span>
//                           <span>{t('dateOnboarded')}: {house.onboardedDate}</span>
//                           <span>{t('monthlyTransactionVolume')}: {house.monthlyVolume}</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
//                       <Button variant="outline" size="sm" className={isRTL ? 'flex-row-reverse' : ''}>
//                         <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                         {t('viewDetails')}
//                       </Button>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
//                           <DropdownMenuItem className={isRTL ? 'flex-row-reverse' : ''}>
//                             <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                             {t('editExchangeHouse')}
//                           </DropdownMenuItem>
//                           {house.status === 'active' ? (
//                             <DropdownMenuItem 
//                               className={`text-orange-600 ${isRTL ? 'flex-row-reverse' : ''}`}
//                               onClick={() => {
//                                 setSelectedHouse(house.name);
//                                 setSuspendDialogOpen(true);
//                               }}
//                             >
//                               <Ban className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                               {t('suspendExchangeHouse')}
//                             </DropdownMenuItem>
//                           ) : house.status === 'suspended' ? (
//                             <DropdownMenuItem 
//                               className={`text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}
//                               onClick={() => {
//                                 setSelectedHouse(house.name);
//                                 setActivateDialogOpen(true);
//                               }}
//                             >
//                               <Power className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                               {t('activateExchangeHouse')}
//                             </DropdownMenuItem>
//                           ) : null}
//                           <DropdownMenuItem className={`text-destructive ${isRTL ? 'flex-row-reverse' : ''}`}>
//                             <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
//                             {t('deleteExchangeHouse')}
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Confirmation Dialogs */}
//         <ConfirmationDialog
//           open={suspendDialogOpen}
//           onOpenChange={setSuspendDialogOpen}
//           title={t('confirmSuspend')}
//           description={t('confirmSuspendDesc')}
//           confirmText={t('suspendExchangeHouse')}
//           onConfirm={handleSuspend}
//           variant="destructive"
//         />

//         <ConfirmationDialog
//           open={activateDialogOpen}
//           onOpenChange={setActivateDialogOpen}
//           title={t('confirmActivate')}
//           description={t('confirmActivateDesc')}
//           confirmText={t('activateExchangeHouse')}
//           onConfirm={handleActivate}
//         />
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminExchangeHouses;


import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Landmark,
  Plus,
  Search,
  Building2,
  Users,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Ban,
  Power,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";

// Types based on your API responses
interface Country {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  branchLimit: number;
}

interface ExchangeAdmin {
  id: number;
  uuid: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  primaryContactMail: string | null;
  active: boolean;
  legalBusinessName: string | null;
  tradingName: string | null;
  registrationNumber: string | null;
  centralBankLicense: string | null;
  licenseExpiryDate: string | null;
  businessAddress: string | null;
  city: string | null;
  country: any | null;
  postalCode: string | null;
  subscriptionPlan: Plan | null;
  subscriptionStartDate: string | null;
  subscriptionStatus: string | null;
  exchangeStatus: string | null;
}

interface ListData {
  exchangeAdminResponse: ExchangeAdmin[];
  exchangeHouseStats: {
    totalExchangeHouse: number;
    activeExchangeHouse: number;
    pendingApproval: number;
    suspended: number;
  };
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}

const AdminExchangeHouses = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { t, isRTL } = useLanguage();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);

  // Data from APIs
  const [countries, setCountries] = useState<Country[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [exchangeAdmins, setExchangeAdmins] = useState<ExchangeAdmin[]>([]);
  const [stats, setStats] = useState<ListData["exchangeHouseStats"]>({
    totalExchangeHouse: 0,
    activeExchangeHouse: 0,
    pendingApproval: 0,
    suspended: 0,
  });

  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form state - aligned with API payload
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    primaryContactEmail: "",
    phoneNumber: "",
    legalBusinessName: "",
    tradingName: "",
    registrationNumber: "",
    centralBankLicense: "",
    licenseExpiryDate: "",
    businessAddress: "",
    city: "",
    countryId: 1, // default UAE
    postalCode: "",
    subscriptionPlanId: 2, // default Professional
  });

  // Fetch countries and plans once
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [countriesRes, plansRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v3/super/exchange-admins/country`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v3/super/exchange-admins/plans`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (countriesRes.data.status) {
          setCountries(countriesRes.data.data);
        }

        if (plansRes.data.status) {
          setPlans(plansRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load countries/plans", err);
        toast({
          title: t("error"),
          description: t("failedToLoadRequiredData"),
          variant: "destructive",
        });
      }
    };

    if (token) fetchStaticData();
  }, [token, t, toast]);

  // Fetch exchange admins list
  const fetchExchangeAdmins = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/super/exchange-admins?page=0&size=50&query=`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const data: ListData = res.data.data;
        setExchangeAdmins(data.exchangeAdminResponse || []);
        setStats(data.exchangeHouseStats || {
          totalExchangeHouse: 0,
          activeExchangeHouse: 0,
          pendingApproval: 0,
          suspended: 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch exchange admins", err);
      toast({
        title: t("error"),
        description: t("failedToLoadExchangeHouses"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeAdmins();
  }, [token]);

  const handleSubmitOnboarding = async () => {
    // Required fields validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.legalBusinessName.trim() ||
      !formData.centralBankLicense.trim()
    ) {
      toast({
        title: t("validationError"),
        description: t("pleaseFillAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    setFormSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        primaryContactEmail: formData.primaryContactEmail.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        legalBusinessName: formData.legalBusinessName.trim(),
        tradingName: formData.tradingName.trim() || null,
        registrationNumber: formData.registrationNumber.trim() || null,
        centralBankLicense: formData.centralBankLicense.trim(),
        licenseExpiryDate: formData.licenseExpiryDate || null,
        businessAddress: formData.businessAddress.trim() || null,
        city: formData.city.trim() || null,
        countryId: formData.countryId,
        postalCode: formData.postalCode.trim() || null,
        subscriptionPlanId: formData.subscriptionPlanId,
      };

      const res = await axios.post(
        `${BASE_URL}/api/v3/super/exchange-admins`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status) {
        toast({
          title: t("success"),
          description: res.data.message || t("exchangeHouseCreated"),
        });
        setIsOnboardingOpen(false);
        fetchExchangeAdmins(); // refresh list

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          primaryContactEmail: "",
          phoneNumber: "",
          legalBusinessName: "",
          tradingName: "",
          registrationNumber: "",
          centralBankLicense: "",
          licenseExpiryDate: "",
          businessAddress: "",
          city: "",
          countryId: 1,
          postalCode: "",
          subscriptionPlanId: 2,
        });
      }
    } catch (err: any) {
      console.error("Onboarding error:", err);
      toast({
        title: t("error"),
        description: err.response?.data?.message || t("failedToCreateExchangeHouse"),
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Placeholder for suspend/activate (no API provided yet)
  const handleSuspend = () => {
    toast({
      title: t("suspendExchangeHouse"),
      description: t("featureComingSoon"),
    });
    setSuspendDialogOpen(false);
    setSelectedHouseId(null);
  };

  const handleActivate = () => {
    toast({
      title: t("activateExchangeHouse"),
      description: t("featureComingSoon"),
    });
    setActivateDialogOpen(false);
    setSelectedHouseId(null);
  };

  // Status badge logic
  const getStatusBadge = (status: string | null) => {
    const lower = (status || "").toLowerCase();
    if (lower === "active" || lower === "ACTIVE") {
      return { variant: "default" as const, label: t("active"), icon: CheckCircle };
    }
    if (lower === "pending" || lower === "PENDING") {
      return { variant: "secondary" as const, label: t("pending"), icon: Clock };
    }
    if (lower === "suspended") {
      return { variant: "destructive" as const, label: t("suspended"), icon: XCircle };
    }
    return { variant: "secondary" as const, label: t("pending"), icon: Clock };
  };

  // Plan badge logic
  const getPlanBadge = (plan: Plan | null) => {
    if (!plan) return { variant: "outline" as const, label: t("unknown") };

    const nameLower = plan.name.toLowerCase();
    if (nameLower.includes("basic")) {
      return { variant: "outline" as const, label: t("basic") };
    }
    if (nameLower.includes("professional")) {
      return { variant: "secondary" as const, label: t("professional") };
    }
    if (nameLower.includes("enterprise")) {
      return { variant: "default" as const, label: t("enterprise") };
    }
    return { variant: "outline" as const, label: plan.name };
  };

  // Filter admins (client-side search)
  const filteredAdmins = exchangeAdmins.filter((admin) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      (admin.legalBusinessName || "").toLowerCase().includes(q) ||
      (admin.tradingName || "").toLowerCase().includes(q) ||
      (admin.fullName || "").toLowerCase().includes(q) ||
      (admin.email || "").toLowerCase().includes(q) ||
      (admin.centralBankLicense || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("exchangeHouseManagement")}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{t("manageExchangeHouses")}</p>
          </div>

          <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
            <DialogTrigger asChild>
              <Button variant="business" className={isRTL ? "flex-row-reverse" : ""}>
                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("onboardExchangeHouse")}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("exchangeHouseOnboardingForm")}</DialogTitle>
                <DialogDescription>{t("enterDetailsToOnboardNewExchangeHouse")}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Admin / Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">{t("adminDetails")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("fullName")} *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Hamdan Al Nahyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("adminEmail")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@uaeexchange.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="971501234567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactEmail">{t("primaryContactEmail")}</Label>
                      <Input
                        id="primaryContactEmail"
                        type="email"
                        value={formData.primaryContactEmail}
                        onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                        placeholder="contact@uaeexchange.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">{t("exchangeHouseDetails")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalBusinessName">{t("legalBusinessName")} *</Label>
                      <Input
                        id="legalBusinessName"
                        value={formData.legalBusinessName}
                        onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
                        placeholder="UAE Exchange Centre LLC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradingName">{t("tradingName")}</Label>
                      <Input
                        id="tradingName"
                        value={formData.tradingName}
                        onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                        placeholder="UAE Exchange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">{t("registrationNumber")}</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder="REG-998877"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="centralBankLicense">{t("centralBankLicense")} *</Label>
                      <Input
                        id="centralBankLicense"
                        value={formData.centralBankLicense}
                        onChange={(e) => setFormData({ ...formData, centralBankLicense: e.target.value })}
                        placeholder="CB-UAE-2024-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiryDate">{t("licenseExpiryDate")}</Label>
                      <Input
                        id="licenseExpiryDate"
                        type="date"
                        value={formData.licenseExpiryDate}
                        onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">{t("businessAddress")}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">{t("businessAddress")}</Label>
                    <Textarea
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      placeholder="Level 12, Al Sayegh Officers Tower..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("city")}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Abu Dhabi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryId">{t("country")}</Label>
                      <Select
                        value={formData.countryId.toString()}
                        onValueChange={(val) => setFormData({ ...formData, countryId: Number(val) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCountry")} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t("postalCode")}</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="17001"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan - using dynamic plans */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">{t("subscriptionPlan")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                      const isSelected = formData.subscriptionPlanId === plan.id;
                      const nameLower = plan.name.toLowerCase();
                      let displayName = plan.name;
                      let descKey = "basicPlanDesc";
                      if (nameLower.includes("professional")) descKey = "professionalPlanDesc";
                      if (nameLower.includes("enterprise")) descKey = "enterprisePlanDesc";

                      return (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
                          }`}
                          onClick={() => setFormData({ ...formData, subscriptionPlanId: plan.id })}
                        >
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold">{t(nameLower)}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{t(descKey)}</p>
                            <p className="text-lg font-bold mt-2">
                              ${plan.price.toFixed(0)}/mo
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsOnboardingOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleSubmitOnboarding} disabled={formSubmitting}>
                    {formSubmitting ? t("submitting") : t("submitOnboarding")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalExchangeHouses")}
              </CardTitle>
              <Landmark className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.totalExchangeHouse}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("activeExchangeHouses")}
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.activeExchangeHouse}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("pendingApprovalHouses")}
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("suspendedHouses")}
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent className={isRTL ? "text-right" : ""}>
              <div className="text-2xl font-bold">{stats.suspended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
          />
          <Input
            placeholder={`${t("search")} ${t("exchangeHouses")}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={isRTL ? "pr-10" : "pl-10"}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">{t("loading")}...</div>
        ) : (
          <div className="space-y-4">
            {filteredAdmins.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {searchQuery ? t("noResultsFound") : t("noExchangeHousesFound")}
              </div>
            ) : (
              filteredAdmins.map((admin) => {
                const status = getStatusBadge(admin.exchangeStatus);
                const plan = getPlanBadge(admin.subscriptionPlan);
                const StatusIcon = status.icon;

                const displayName =
                  admin.legalBusinessName ||
                  admin.tradingName ||
                  admin.fullName ||
                  "Unnamed Exchange";

                return (
                  <Card key={admin.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div
                        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          isRTL ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Landmark className="h-6 w-6 text-primary" />
                          </div>
                          <div className={isRTL ? "text-right" : ""}>
                            <div className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                              <h3 className="font-semibold text-lg">{displayName}</h3>
                              <Badge
                                variant={status.variant}
                                className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                              <Badge variant={plan.variant}>{plan.label}</Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mt-1">
                              {admin.tradingName || admin.legalBusinessName || admin.fullName}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Building2 className="h-3.5 w-3.5" />
                                {admin.city || "N/A"}, {admin.country?.name || "N/A"}
                              </span>
                              <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <GitBranch className="h-3.5 w-3.5" />
                                {/* Branch limit from plan if available */}
                                {admin.subscriptionPlan?.branchLimit ?? "N/A"} {t("branches")}
                              </span>
                              <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Users className="h-3.5 w-3.5" />
                                {admin.fullName}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                              <span>
                                {t("centralBankLicense")}: {admin.centralBankLicense || "N/A"}
                              </span>
                              <span>
                                {t("dateOnboarded")}: {admin.subscriptionStartDate || "N/A"}
                              </span>
                              <span>{t("monthlyTransactionVolume")}: N/A</span>
                            </div>
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Button variant="outline" size="sm">
                            <Eye className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("viewDetails")}
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isRTL ? "start" : "end"}>
                              <DropdownMenuItem className={isRTL ? "flex-row-reverse" : ""}>
                                <Edit className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                {t("editExchangeHouse")}
                              </DropdownMenuItem>

                              {admin.exchangeStatus?.toUpperCase() === "ACTIVE" ? (
                                <DropdownMenuItem
                                  className={`text-orange-600 ${isRTL ? "flex-row-reverse" : ""}`}
                                  onClick={() => {
                                    setSelectedHouseId(admin.id);
                                    setSuspendDialogOpen(true);
                                  }}
                                >
                                  <Ban className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                  {t("suspendExchangeHouse")}
                                </DropdownMenuItem>
                              ) : (
                                admin.exchangeStatus?.toUpperCase() === "SUSPENDED" && (
                                  <DropdownMenuItem
                                    className={`text-green-600 ${isRTL ? "flex-row-reverse" : ""}`}
                                    onClick={() => {
                                      setSelectedHouseId(admin.id);
                                      setActivateDialogOpen(true);
                                    }}
                                  >
                                    <Power className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                    {t("activateExchangeHouse")}
                                  </DropdownMenuItem>
                                )
                              )}

                              <DropdownMenuItem className={`text-destructive ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Trash2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                {t("deleteExchangeHouse")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Dialogs */}
        <ConfirmationDialog
          open={suspendDialogOpen}
          onOpenChange={setSuspendDialogOpen}
          title={t("confirmSuspend")}
          description={t("confirmSuspendDesc")}
          confirmText={t("suspendExchangeHouse")}
          onConfirm={handleSuspend}
          variant="destructive"
        />

        <ConfirmationDialog
          open={activateDialogOpen}
          onOpenChange={setActivateDialogOpen}
          title={t("confirmActivate")}
          description={t("confirmActivateDesc")}
          confirmText={t("activateExchangeHouse")}
          onConfirm={handleActivate}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminExchangeHouses;
