// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import BASE_URL from "@/config/config";
// import { useCookies } from "react-cookie";
// import {
//   Building,
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Banknote,
//   FileText,
//   Plus,
//   Trash2,
//   AlertCircle,
//   Upload,
//   CalendarIcon,
//   Globe,
//   CreditCard,
//   Wallet,
//   Info,
//   DollarSign,
//   TrendingUp
// } from "lucide-react";
// import { useState } from "react";

// const BeneficiaryRegistrationForm = () => {
//   const [cookie] = useCookies(["token"]);
//   const token = cookie.token;
//   console.log("token", token);

//   const [beneficiaryType, setBeneficiaryType] = useState<"individual" | "business">("individual");
//   const [residencyType, setResidencyType] = useState<"uae" | "foreign">("foreign");
//   const [beneficiaryCountry, setBeneficiaryCountry] = useState("");
//   const [payoutMechanism, setPayoutMechanism] = useState<"bank_account" | "wallet">("bank_account");
//   const [selectedBank, setSelectedBank] = useState("");
//   const [requiresApproval, setRequiresApproval] = useState(false);
//   const [dateOfBirth, setDateOfBirth] = useState<Date>();
//   const [incorporationDate, setIncorporationDate] = useState<Date>();

//   // Mock data - would come from Core API
//   const payoutDestinations = [
//     { country: "India", code: "IN", supported: true, exchangeRate: "22.45", fees: "5.00" },
//     { country: "Philippines", code: "PH", supported: true, exchangeRate: "3.67", fees: "3.50" },
//     { country: "Pakistan", code: "PK", supported: true, exchangeRate: "84.50", fees: "4.00" },
//     { country: "Bangladesh", code: "BD", supported: true, exchangeRate: "29.75", fees: "3.00" },
//     { country: "Sri Lanka", code: "LK", supported: true, exchangeRate: "109.25", fees: "6.00" },
//     { country: "Nepal", code: "NP", supported: true, exchangeRate: "36.15", fees: "4.50" },
//     { country: "United Arab Emirates", code: "AE", supported: true, exchangeRate: "1.00", fees: "2.00" }
//   ];

//   const uaeBanks = [
//     { name: "Emirates NBD", code: "EBILAEAD", country: "AE" },
//     { name: "First Abu Dhabi Bank (FAB)", code: "NBADAEAD", country: "AE" },
//     { name: "Abu Dhabi Commercial Bank (ADCB)", code: "ADCBAEAD", country: "AE" },
//     { name: "Dubai Islamic Bank", code: "DUIBAEAD", country: "AE" },
//     { name: "Mashreq Bank", code: "BOMLAEAD", country: "AE" },
//     { name: "HSBC UAE", code: "BBMEAEAD", country: "AE" }
//   ];

//   const internationalBanks = [
//     { name: "State Bank of India", code: "SBININBB", country: "IN" },
//     { name: "HDFC Bank", code: "HDFCINBB", country: "IN" },
//     { name: "Bank of the Philippine Islands", code: "BOPIPHMM", country: "PH" },
//     { name: "Metrobank", code: "MBTCPHMM", country: "PH" },
//     { name: "Habib Bank Limited", code: "HABBPKKA", country: "PK" },
//     { name: "MCB Bank", code: "MCBLPKKA", country: "PK" }
//   ];

//   const walletProviders = [
//     { name: "Paymi UAE", country: "AE", type: "Digital Wallet" },
//     { name: "Paymi India", country: "IN", type: "Digital Wallet" },
//     { name: "GCash", country: "PH", type: "Mobile Wallet" },
//     { name: "PayMaya", country: "PH", type: "Digital Wallet" },
//     { name: "bKash", country: "BD", type: "Mobile Banking" },
//     { name: "Nagad", country: "BD", type: "Digital Payment" }
//   ];

//   const getAvailableBanks = () => {
//     if (!beneficiaryCountry) return [];

//     if (beneficiaryCountry === "AE") {
//       return uaeBanks;
//     }

//     return internationalBanks.filter(bank =>
//       payoutDestinations.find(dest => dest.code === beneficiaryCountry)
//     );
//   };

//   const getAvailableWallets = () => {
//     if (!beneficiaryCountry) return [];
//     return walletProviders.filter(wallet => wallet.country === beneficiaryCountry);
//   };

//   const getExchangeInfo = () => {
//     return payoutDestinations.find(dest => dest.code === beneficiaryCountry);
//   };

//   const getSelectedBankDetails = () => {
//     return [...uaeBanks, ...internationalBanks].find(bank => bank.name === selectedBank);
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h2 className="text-2xl font-bold text-foreground">Register New Beneficiary</h2>
//         <p className="text-muted-foreground">Complete all required information for beneficiary registration and verification</p>
//       </div>

//       {/* Beneficiary Type & Residency Selection */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Beneficiary Type */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5 text-primary" />
//               Beneficiary Type
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${beneficiaryType === "individual" ? "ring-2 ring-primary bg-primary/5" : ""
//                   }`}
//                 onClick={() => setBeneficiaryType("individual")}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <User className="h-8 w-8 text-primary" />
//                   <div>
//                     <h3 className="font-semibold text-foreground">Individual</h3>
//                     <p className="text-sm text-muted-foreground">Personal recipient</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${beneficiaryType === "business" ? "ring-2 ring-primary bg-primary/5" : ""
//                   }`}
//                 onClick={() => setBeneficiaryType("business")}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <Building className="h-8 w-8 text-primary" />
//                   <div>
//                     <h3 className="font-semibold text-foreground">Business</h3>
//                     <p className="text-sm text-muted-foreground">Corporate entity</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Residency Type */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Globe className="h-5 w-5 text-primary" />
//               Residency Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${residencyType === "uae" ? "ring-2 ring-primary bg-primary/5" : ""
//                   }`}
//                 onClick={() => {
//                   setResidencyType("uae");
//                   setBeneficiaryCountry("AE");
//                 }}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                     <span className="text-xs font-bold text-primary">UAE</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">UAE Resident</h3>
//                     <p className="text-sm text-muted-foreground">Local transfers</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${residencyType === "foreign" ? "ring-2 ring-primary bg-primary/5" : ""
//                   }`}
//                 onClick={() => {
//                   setResidencyType("foreign");
//                   setBeneficiaryCountry("");
//                 }}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <Globe className="h-8 w-8 text-primary" />
//                   <div>
//                     <h3 className="font-semibold text-foreground">Foreign Country</h3>
//                     <p className="text-sm text-muted-foreground">International transfers</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Country Selection & Exchange Rate Info */}
//       {residencyType === "foreign" && (
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-primary" />
//               Destination Country & Exchange Rates
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="md:col-span-1">
//                 <Label htmlFor="country">Beneficiary Country *</Label>
//                 <Select value={beneficiaryCountry} onValueChange={setBeneficiaryCountry}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select destination country" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border border-border z-50">
//                     {payoutDestinations.filter(dest => dest.code !== "AE").map((country) => (
//                       <SelectItem key={country.code} value={country.code}>
//                         {country.country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {beneficiaryCountry && getExchangeInfo() && (
//                 <div className="md:col-span-2">
//                   <div className="bg-accent-muted/20 rounded-lg p-4">
//                     <div className="flex items-center space-x-2 mb-3">
//                       <TrendingUp className="h-4 w-4 text-accent" />
//                       <span className="font-medium text-foreground">Current Exchange Rate & Fees</span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Exchange Rate:</span>
//                         <p className="font-medium">1 AED = {getExchangeInfo()?.exchangeRate} {beneficiaryCountry}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Transfer Fee:</span>
//                         <p className="font-medium">AED {getExchangeInfo()?.fees}</p>
//                       </div>
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-2">
//                       *Rates are indicative and may vary at the time of transaction
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Basic Information */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="h-5 w-5 text-primary" />
//             Basic Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {beneficiaryType === "individual" ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name *</Label>
//                 <Input id="firstName" placeholder="Enter first name" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name *</Label>
//                 <Input id="lastName" placeholder="Enter last name" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dateOfBirth">Date of Birth *</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !dateOfBirth && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={dateOfBirth}
//                       onSelect={setDateOfBirth}
//                       disabled={(date) =>
//                         date > new Date() || date < new Date("1900-01-01")
//                       }
//                       initialFocus
//                       className={cn("p-3 pointer-events-auto")}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="nationality">Nationality *</Label>
//                 <Input id="nationality" placeholder="Enter nationality" />
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="companyName">Company Name *</Label>
//                 <Input id="companyName" placeholder="Enter company name" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="registrationNumber">Registration Number *</Label>
//                 <Input id="registrationNumber" placeholder="Enter registration number" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="businessType">Business Type *</Label>
//                 <Input id="businessType" placeholder="e.g., Trading, Manufacturing, Services" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="incorporationDate">Incorporation Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !incorporationDate && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {incorporationDate ? format(incorporationDate, "PPP") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={incorporationDate}
//                       onSelect={setIncorporationDate}
//                       disabled={(date) =>
//                         date > new Date() || date < new Date("1900-01-01")
//                       }
//                       initialFocus
//                       className={cn("p-3 pointer-events-auto")}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address *</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input id="email" type="email" className="pl-9" placeholder="Enter email address" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number *</Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input id="phone" className="pl-9" placeholder="+971 XX XXX XXXX" />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Address Information */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="h-5 w-5 text-primary" />
//             Address Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="address1">Address Line 1 *</Label>
//             <Input id="address1" placeholder="Street address, building name, etc." />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="address2">Address Line 2</Label>
//             <Input id="address2" placeholder="Apartment, suite, unit, etc." />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="city">City *</Label>
//               <Input id="city" placeholder="Enter city" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="state">State/Province</Label>
//               <Input id="state" placeholder="Enter state/province" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="country">Country *</Label>
//               <Input
//                 id="country"
//                 value={residencyType === "uae" ? "United Arab Emirates" : beneficiaryCountry ? payoutDestinations.find(d => d.code === beneficiaryCountry)?.country : ""}
//                 disabled
//                 placeholder="Select country from residency section above"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="postalCode">Postal Code</Label>
//               <Input id="postalCode" placeholder="Enter postal code" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Payout Mechanism Selection */}
//       {beneficiaryCountry && (
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-primary" />
//               Payout Mechanism
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${payoutMechanism === "bank_account" ? "ring-2 ring-primary bg-primary/5" : ""
//                   }`}
//                 onClick={() => setPayoutMechanism("bank_account")}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <Banknote className="h-8 w-8 text-primary" />
//                   <div>
//                     <h3 className="font-semibold text-foreground">Bank Account</h3>
//                     <p className="text-sm text-muted-foreground">Direct bank transfer</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card
//                 className={`cursor-pointer transition-all hover:shadow-md ${payoutMechanism === "wallet" ? "ring-2 ring-primary bg-primary/5" : ""
//                   } ${getAvailableWallets().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => getAvailableWallets().length > 0 && setPayoutMechanism("wallet")}
//               >
//                 <CardContent className="p-4 flex items-center space-x-3">
//                   <Wallet className="h-8 w-8 text-primary" />
//                   <div>
//                     <h3 className="font-semibold text-foreground">Digital Wallet</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {getAvailableWallets().length > 0 ? "Mobile/digital wallet" : "Not available"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Bank Account Details */}
//             {payoutMechanism === "bank_account" && (
//               <Card className="border-l-4 border-l-primary">
//                 <CardContent className="p-4 space-y-4">
//                   <h4 className="font-medium text-foreground">Bank Account Details</h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Select Bank *</Label>
//                       <Select value={selectedBank} onValueChange={setSelectedBank}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Choose bank" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-background border border-border z-50">
//                           {getAvailableBanks().map((bank) => (
//                             <SelectItem key={bank.name} value={bank.name}>
//                               {bank.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {selectedBank && getSelectedBankDetails() && (
//                       <div className="space-y-2">
//                         <Label>SWIFT/BIC Code</Label>
//                         <Input
//                           value={getSelectedBankDetails()?.code || ""}
//                           disabled
//                           className="bg-muted"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Account Number *</Label>
//                       <Input
//                         placeholder={beneficiaryCountry === "AE" ? "AE070331234567890123456" : "Enter account number"}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Account Holder Name *</Label>
//                       <Input placeholder="Enter account holder name" />
//                     </div>
//                   </div>

//                   {beneficiaryCountry === "AE" && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>IBAN</Label>
//                         <Input placeholder="AE070331234567890123456" />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Branch Code</Label>
//                         <Input placeholder="Enter branch code (if applicable)" />
//                       </div>
//                     </div>
//                   )}

//                   {/* Bank Address - WorkerAppz API Field */}
//                   <div className="space-y-2">
//                     <Label>Bank Address *</Label>
//                     <Input
//                       placeholder="Enter bank branch address"
//                     />
//                     <p className="text-xs text-muted-foreground">Full address of the bank branch for SWIFT transfers</p>
//                   </div>

//                   {/* Correspondent Bank Details - WorkerAppz API Field */}
//                   {residencyType === "foreign" && (
//                     <div className="border-t pt-4 mt-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Building className="h-4 w-4 text-muted-foreground" />
//                         <h5 className="font-medium text-foreground">Correspondent Bank (Optional)</h5>
//                       </div>
//                       <p className="text-xs text-muted-foreground mb-3">
//                         Required for some international transfers when an intermediary bank is used
//                       </p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Correspondent Bank Name</Label>
//                           <Input placeholder="Enter correspondent bank name" />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Correspondent SWIFT/BIC</Label>
//                           <Input placeholder="e.g., CITIUS33" />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Correspondent Account Number</Label>
//                           <Input placeholder="Enter correspondent account number" />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Correspondent Bank Address</Label>
//                           <Input placeholder="Enter correspondent bank address" />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {selectedBank === "Emirates NBD" && (
//                     <div className="bg-accent-muted/20 rounded-lg p-3">
//                       <div className="flex items-start space-x-2">
//                         <Info className="h-4 w-4 text-accent mt-0.5" />
//                         <div className="text-sm">
//                           <p className="font-medium text-foreground">Emirates NBD Account Format</p>
//                           <p className="text-muted-foreground">IBAN: AE07 0331 2345 6789 0123 456</p>
//                           <p className="text-muted-foreground">SWIFT: EBILAEAD</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Wallet Details */}
//             {payoutMechanism === "wallet" && (
//               <Card className="border-l-4 border-l-accent">
//                 <CardContent className="p-4 space-y-4">
//                   <h4 className="font-medium text-foreground">Digital Wallet Details</h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Wallet Provider *</Label>
//                       <Select>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Choose wallet provider" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-background border border-border z-50">
//                           {getAvailableWallets().map((wallet) => (
//                             <SelectItem key={wallet.name} value={wallet.name}>
//                               {wallet.name} ({wallet.type})
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Wallet ID/Phone Number *</Label>
//                       <Input placeholder="Enter wallet ID or phone number" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Purpose and Relationship */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Business Relationship</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="relationship">Relationship Type *</Label>
//             <Select>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select relationship type" />
//               </SelectTrigger>
//               <SelectContent className="bg-background border border-border z-50">
//                 <SelectItem value="supplier">Supplier</SelectItem>
//                 <SelectItem value="employee">Employee</SelectItem>
//                 <SelectItem value="contractor">Contractor</SelectItem>
//                 <SelectItem value="vendor">Vendor</SelectItem>
//                 <SelectItem value="family">Family Member</SelectItem>
//                 <SelectItem value="client">Client</SelectItem>
//                 <SelectItem value="partner">Business Partner</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="purpose">Expected Transaction Purpose</Label>
//             <Textarea
//               id="purpose"
//               placeholder="Describe the typical purpose of payments to this beneficiary"
//               rows={3}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="expectedAmount">Expected Monthly Volume</Label>
//               <div className="relative">
//                 <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input id="expectedAmount" className="pl-9" placeholder="0.00" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="frequency">Expected Frequency</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select frequency" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-background border border-border z-50">
//                   <SelectItem value="daily">Daily</SelectItem>
//                   <SelectItem value="weekly">Weekly</SelectItem>
//                   <SelectItem value="monthly">Monthly</SelectItem>
//                   <SelectItem value="quarterly">Quarterly</SelectItem>
//                   <SelectItem value="adhoc">Ad-hoc</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Document Upload */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Upload className="h-5 w-5 text-primary" />
//             Supporting Documents
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
//               <CardContent className="p-6 text-center">
//                 <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm font-medium">
//                   {beneficiaryType === "individual" ? "Identity Document" : "Business Registration"}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {beneficiaryType === "individual" ? "Passport/Emirates ID/National ID" : "Trade License/Certificate of Incorporation"}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
//               <CardContent className="p-6 text-center">
//                 <Banknote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm font-medium">Bank Statement</p>
//                 <p className="text-xs text-muted-foreground">Recent bank statement or void check</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="bg-accent-muted rounded-lg p-4">
//             <div className="flex items-start space-x-3">
//               <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
//               <div>
//                 <p className="text-sm font-medium text-foreground">Document Requirements</p>
//                 <ul className="text-xs text-muted-foreground mt-1 space-y-1">
//                   <li>• Documents must be clear and legible</li>
//                   <li>• Maximum file size: 10MB per document</li>
//                   <li>• Accepted formats: PDF, JPG, PNG</li>
//                   <li>• Documents should be recent (within 3 months)</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4 pt-6">
//         <Button variant="outline" size="lg">
//           Save as Draft
//         </Button>
//         <Button variant="business" size="lg">
//           {requiresApproval ? "Submit for Approval" : "Register Beneficiary"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default BeneficiaryRegistrationForm;




import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";
import {
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  Banknote,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  CalendarIcon,
  Globe,
  CreditCard,
  Wallet,
  Info,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner for notifications

const BeneficiaryRegistrationForm = () => {
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;
  console.log("token", token);

  // Form & UI States
  const [loading, setLoading] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<
    "individual" | "business"
  >("individual");
  const [residencyType, setResidencyType] = useState<"uae" | "foreign">(
    "foreign",
  );
  const [beneficiaryCountry, setBeneficiaryCountry] = useState("");
  const [payoutMechanism, setPayoutMechanism] = useState<
    "bank_account" | "wallet"
  >("bank_account");
  const [selectedBank, setSelectedBank] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [incorporationDate, setIncorporationDate] = useState<Date | undefined>(undefined);

  // Input States for API
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    registrationNumber: "",
    businessType: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    accountNumber: "",
    iban: "",
    accountHolderName: "",
    bankAddress: "",
    walletId: "",
    dateOfBirth: "",
    incorporationDate: "",
    relationshipType: "",
    purpose: "",
    expectedMonthlyVolume: "",
    expectedFrequency: "",

    correspondentBankName: "",
    correspondentSwift: "",
    correspondentAccountNumber: "",
    correspondentBankAddress: "",

  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Mock data - would come from Core API
  const payoutDestinations = [
    {
      country: "India",
      code: "IN",
      id: 2,
      supported: true,
      exchangeRate: "22.45",
      fees: "5.00",
      currency: "INR"
    },
    {
      country: "Philippines",
      code: "PH",
      id: 3,
      supported: true,
      exchangeRate: "3.67",
      fees: "3.50",
      currency: "PHP"
    },
    {
      country: "Pakistan",
      code: "PK",
      id: 4,
      supported: true,
      exchangeRate: "84.50",
      fees: "4.00",
      currency: "PKR"
    },
    {
      country: "Bangladesh",
      code: "BD",
      id: 5,
      supported: true,
      exchangeRate: "29.75",
      fees: "3.00",
      currency: "BDT"
    },
    {
      country: "Sri Lanka",
      code: "LK",
      id: 6,
      supported: true,
      exchangeRate: "109.25",
      fees: "6.00",
      currency: "LKR"
    },
    {
      country: "Nepal",
      code: "NP",
      id: 7,
      supported: true,
      exchangeRate: "36.15",
      fees: "4.50",
      currency: "NPR"
    },
    {
      country: "United Arab Emirates",
      code: "AE",
      id: 1,
      supported: true,
      exchangeRate: "1.00",
      fees: "2.00",
      currency: "AED"
    },
  ];

  const uaeBanks = [
    { name: "Emirates NBD", code: "EBILAEAD", country: "AE" },
    { name: "First Abu Dhabi Bank (FAB)", code: "NBADAEAD", country: "AE" },
    {
      name: "Abu Dhabi Commercial Bank (ADCB)",
      code: "ADCBAEAD",
      country: "AE",
    },
    { name: "Dubai Islamic Bank", code: "DUIBAEAD", country: "AE" },
    { name: "Mashreq Bank", code: "BOMLAEAD", country: "AE" },
    { name: "HSBC UAE", code: "BBMEAEAD", country: "AE" },
  ];

  const internationalBanks = [
    { name: "State Bank of India", code: "SBININBB", country: "IN" },
    { name: "HDFC Bank", code: "HDFCINBB", country: "IN" },
    { name: "Bank of the Philippine Islands", code: "BOPIPHMM", country: "PH" },
    { name: "Metrobank", code: "MBTCPHMM", country: "PH" },
    { name: "Habib Bank Limited", code: "HABBPKKA", country: "PK" },
    { name: "MCB Bank", code: "MCBLPKKA", country: "PK" },
  ];

  const walletProviders = [
    { name: "Paymi UAE", country: "AE", type: "Digital Wallet" },
    { name: "Paymi India", country: "IN", type: "Digital Wallet" },
    { name: "GCash", country: "PH", type: "Mobile Wallet" },
    { name: "PayMaya", country: "PH", type: "Digital Wallet" },
    { name: "bKash", country: "BD", type: "Mobile Banking" },
    { name: "Nagad", country: "BD", type: "Digital Payment" },
  ];

  const getAvailableBanks = () => {
    if (!beneficiaryCountry) return [];
    if (beneficiaryCountry === "AE") return uaeBanks;
    return internationalBanks.filter(
      (bank) => bank.country === beneficiaryCountry,
    );
  };

  const getAvailableWallets = () => {
    if (!beneficiaryCountry) return [];
    return walletProviders.filter(
      (wallet) => wallet.country === beneficiaryCountry,
    );
  };

  const getExchangeInfo = () => {
    return payoutDestinations.find((dest) => dest.code === beneficiaryCountry);
  };

  const getSelectedBankDetails = () => {
    return [...uaeBanks, ...internationalBanks].find(
      (bank) => bank.name === selectedBank,
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    // 1. Log the final URL to ensure it's correct
    const fullUrl = `${BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/"}api/v1/beneficiaries`;
    console.log("Requesting URL:", fullUrl);

    const countryObj = payoutDestinations.find(
      (d) => d.code === (residencyType === "uae" ? "AE" : beneficiaryCountry),
    );

    const payload: any = {
      name:
        beneficiaryType === "individual"
          ? `${formData.firstName} ${formData.lastName}`
          : formData.companyName,
      type: beneficiaryType.toUpperCase(),
      countryId: countryObj?.id || 1,
      relationshipType: formData.relationshipType.toUpperCase() || "OTHER",
      purpose: formData.purpose,
      expectedMonthlyVolume: Number(formData.expectedMonthlyVolume) || 0,
      expectedFrequency: formData.expectedFrequency.toUpperCase() || "MONTHLY",
      payoutMethod:
        payoutMechanism === "bank_account" ? "BANK_TRANSFER" : "WALLET",
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      addressCountryId: countryObj?.id || 1,
    };

    if (beneficiaryType === "individual") {
      payload.firstName = formData.firstName;
      payload.lastName = formData.lastName;
      payload.nationality = formData.nationality;
      payload.dateOfBirth = formData.dateOfBirth;
    } else {
      payload.companyName = formData.companyName;
      payload.registrationNumber = formData.registrationNumber;
      payload.businessType = formData.businessType;
      payload.incorporationDate = formData.incorporationDate;
    }

    if (payoutMechanism === "bank_account") {
      payload.bankName = selectedBank;
      payload.accountNumber = formData.accountNumber;
      payload.iban = formData.iban;
      payload.swiftCode = getSelectedBankDetails()?.code || "";
      payload.accountHolderName = formData.accountHolderName;
      payload.bankAddress = formData.bankAddress;
      payload.correspondentBankName = formData.correspondentBankName;
      payload.correspondentSwift = formData.correspondentSwift;
      payload.correspondentAccountNumber = formData.correspondentAccountNumber;
      payload.correspondentBankAddress = formData.correspondentBankAddress;
    } else {
      payload.bankName = walletProvider;
      payload.accountNumber = formData.walletId;
      payload.iban = "";
      payload.swiftCode = "";
      payload.accountHolderName = formData.accountHolderName;
      payload.bankAddress = "";
    }

    console.log("Payload being sent:", payload);

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is actually okay (200-299)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error Detail:", errorData);
        throw new Error(
          errorData.message || `Server responded with ${response.status}`,
        );
      }

      const result = await response.json();
      if (result.status || response.ok) {
        toast.success(result.message || "Beneficiary registered successfully!");
      } else {
        toast.error(result.message || "Failed to register beneficiary");
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      // This will now show the actual error message in the toast
      toast.error(
        error.message === "Failed to fetch"
          ? "Network error: Cannot reach server. Check CORS or URL."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Register New Beneficiary
        </h2>
        <p className="text-muted-foreground">
          Complete all required information for beneficiary registration and
          verification
        </p>
      </div>

      {/* Beneficiary Type & Residency Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiary Type */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Beneficiary Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  beneficiaryType === "individual"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setBeneficiaryType("individual")}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Individual
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Personal recipient
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  beneficiaryType === "business"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setBeneficiaryType("business")}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Building className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Business</h3>
                    <p className="text-sm text-muted-foreground">
                      Corporate entity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Residency Type */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Residency Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  residencyType === "uae"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setResidencyType("uae");
                  setBeneficiaryCountry("AE");
                }}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">UAE</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      UAE Resident
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Local transfers
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  residencyType === "foreign"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setResidencyType("foreign");
                  setBeneficiaryCountry("");
                }}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Foreign Country
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      International transfers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Selection & Exchange Rate Info */}
      {residencyType === "foreign" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Country & Exchange Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="country">Beneficiary Country *</Label>
                <Select
                  value={beneficiaryCountry}
                  onValueChange={setBeneficiaryCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {payoutDestinations
                      .filter((dest) => dest.code !== "AE")
                      .map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.country}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {beneficiaryCountry && getExchangeInfo() && (
                <div className="md:col-span-2">
                  <div className="bg-accent-muted/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-medium text-foreground">
                        Current Exchange Rate & Fees
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Exchange Rate:
                        </span>
                        <p className="font-medium">
                          1 AED = {getExchangeInfo()?.exchangeRate}{" "}
                          {getExchangeInfo()?.currency}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Transfer Fee:
                        </span>
                        <p className="font-medium">
                          AED {getExchangeInfo()?.fees}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      *Rates are indicative and may vary at the time of
                      transaction
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {beneficiaryType === "individual" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        setDateOfBirth(date);
                        if (date) {
                          setFormData({ ...formData, dateOfBirth: format(date, "yyyy-MM-dd") });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Enter nationality"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName" 
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="e.g., Trading, Manufacturing, Services"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">Incorporation Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !incorporationDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {incorporationDate ? (
                        format(incorporationDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={incorporationDate}
                      onSelect={(date) => {
                        setIncorporationDate(date);
                        if (date) {
                          setFormData({ ...formData, incorporationDate: format(date, "yyyy-MM-dd") });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="971501234567"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="Street address, building name, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state/province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={
                  residencyType === "uae"
                    ? "United Arab Emirates"
                    : beneficiaryCountry
                      ? payoutDestinations.find(
                          (d) => d.code === beneficiaryCountry,
                        )?.country
                      : ""
                }
                disabled
                placeholder="Select country from residency section above"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Mechanism Selection */}
      {(beneficiaryCountry || residencyType === "uae") && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payout Mechanism
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  payoutMechanism === "bank_account"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                } ${getAvailableBanks().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => getAvailableBanks().length > 0 && setPayoutMechanism("bank_account")}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Banknote className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Bank Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getAvailableBanks().length > 0 ? "Direct bank transfer" : "Not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  payoutMechanism === "wallet"
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                } ${getAvailableWallets().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  getAvailableWallets().length > 0 &&
                  setPayoutMechanism("wallet")
                }
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Wallet className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Digital Wallet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getAvailableWallets().length > 0
                        ? "Mobile/digital wallet"
                        : "Not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bank Account Details */}
            {payoutMechanism === "bank_account" && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-foreground">
                    Bank Account Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Bank *</Label>
                      <Select
                        value={selectedBank}
                        onValueChange={setSelectedBank}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          {getAvailableBanks().map((bank) => (
                            <SelectItem key={bank.name} value={bank.name}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedBank && getSelectedBankDetails() && (
                      <div className="space-y-2">
                        <Label>SWIFT/BIC Code</Label>
                        <Input
                          value={getSelectedBankDetails()?.code || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder={
                          beneficiaryCountry === "AE"
                            ? "033123456789"
                            : "Enter account number"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">
                        Account Holder Name *
                      </Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                      />
                    </div>
                  </div>

                  {(beneficiaryCountry === "AE" || residencyType === "uae") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          value={formData.iban}
                          onChange={handleInputChange}
                          placeholder="AE070331234567890123456"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bankAddress">Bank Address *</Label>
                    <Input
                      id="bankAddress"
                      value={formData.bankAddress}
                      onChange={handleInputChange}
                      placeholder="Enter bank branch address"
                    />
                  </div>

                  {residencyType === "foreign" && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <h5 className="font-medium text-foreground">Correspondent Bank (Optional)</h5>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Required for some international transfers when an intermediary bank is used
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="correspondentBankName">Correspondent Bank Name</Label>
                          <Input 
                            id="correspondentBankName" 
                            value={formData.correspondentBankName} 
                            onChange={handleInputChange} 
                            placeholder="Enter correspondent bank name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentSwift">Correspondent SWIFT/BIC</Label>
                          <Input 
                            id="correspondentSwift" 
                            value={formData.correspondentSwift} 
                            onChange={handleInputChange} 
                            placeholder="e.g., CITIUS33" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentAccountNumber">Correspondent Account Number</Label>
                          <Input 
                            id="correspondentAccountNumber" 
                            value={formData.correspondentAccountNumber} 
                            onChange={handleInputChange} 
                            placeholder="Enter correspondent account number" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correspondentBankAddress">Correspondent Bank Address</Label>
                          <Input 
                            id="correspondentBankAddress" 
                            value={formData.correspondentBankAddress} 
                            onChange={handleInputChange} 
                            placeholder="Enter correspondent bank address" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            )}

            {/* Wallet Details */}
            {payoutMechanism === "wallet" && (
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-foreground">
                    Digital Wallet Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Wallet Provider *</Label>
                      <Select value={walletProvider} onValueChange={setWalletProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          {getAvailableWallets().map((wallet) => (
                            <SelectItem key={wallet.name} value={wallet.name}>
                              {wallet.name} ({wallet.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletId">Wallet ID/Phone Number *</Label>
                      <Input 
                        id="walletId"
                        value={formData.walletId}
                        onChange={handleInputChange}
                        placeholder="Enter wallet ID or phone number" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Purpose and Relationship */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Business Relationship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship Type *</Label>
            <Select
              onValueChange={(v) =>
                setFormData({ ...formData, relationshipType: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="partner">Business Partner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Expected Transaction Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the typical purpose of payments to this beneficiary"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedMonthlyVolume">
                Expected Monthly Volume (AED)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedMonthlyVolume"
                  type="number"
                  value={formData.expectedMonthlyVolume}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedFrequency">Expected Frequency</Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, expectedFrequency: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supportive Documents Section (Design Only) */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Supportive Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">National ID / Passport</p>
              <p className="text-xs text-muted-foreground text-center">
                Upload a clear copy for verification
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Proof of Address</p>
              <p className="text-xs text-muted-foreground text-center">
                Utility bill or bank statement
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Action */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          {/* <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            I confirm that the information provided is accurate
          </Label> */}
        </div>
        <div className="space-x-4">
          <Button variant="ghost">Cancel</Button>
          <Button
            className="min-w-[150px]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              "Register Beneficiary"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryRegistrationForm;