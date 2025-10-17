import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import UserDashboard from "./pages/portal/UserDashboard";
import UserBeneficiaries from "./pages/portal/UserBeneficiaries";
import UserTransactions from "./pages/portal/UserTransactions";
import UserDocuments from "./pages/portal/UserDocuments";
import UserGovernance from "./pages/portal/UserGovernance";
import ExchangeAdminDashboard from "./pages/exchange/ExchangeAdminDashboard";
import ExchangeKYBReview from "./pages/exchange/ExchangeKYBReview";
import ExchangeKYBConfig from "./pages/exchange/ExchangeKYBConfig";
import ExchangePayoutConfig from "./pages/exchange/ExchangePayoutConfig";
import ExchangeComplianceConfig from "./pages/exchange/ExchangeComplianceConfig";
import ExchangeStaffManagement from "./pages/exchange/ExchangeStaffManagement";
import ExchangeFeeManagement from "./pages/exchange/ExchangeFeeManagement";
import BranchDashboard from "./pages/branch/BranchDashboard";
import BranchKYBQueue from "./pages/branch/BranchKYBQueue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Business Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Business User Routes */}
          <Route path="/portal" element={<UserDashboard />} />
          <Route path="/portal/beneficiaries" element={<UserBeneficiaries />} />
          <Route path="/portal/transactions" element={<UserTransactions />} />
          <Route path="/portal/users" element={<AdminUserManagement />} />
          <Route path="/portal/governance" element={<UserGovernance />} />
          <Route path="/portal/documents" element={<UserDocuments />} />
          
          {/* Exchange House Admin Routes */}
          <Route path="/exchange" element={<ExchangeAdminDashboard />} />
        <Route path="/exchange/kyb-review" element={<ExchangeKYBReview />} />
        <Route path="/exchange/kyb-config" element={<ExchangeKYBConfig />} />
        <Route path="/exchange/fee-management" element={<ExchangeFeeManagement />} />
        <Route path="/exchange/payout-config" element={<ExchangePayoutConfig />} />
        <Route path="/exchange/compliance-config" element={<ExchangeComplianceConfig />} />
        <Route path="/exchange/staff" element={<ExchangeStaffManagement />} />
          
          {/* Branch User Routes */}
          <Route path="/branch" element={<BranchDashboard />} />
          <Route path="/branch/kyb-queue" element={<BranchKYBQueue />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
