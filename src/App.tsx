import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDealSettings from "./pages/admin/AdminDealSettings";
import UserProfile from "./pages/portal/UserProfile";
import UserDashboard from "./pages/portal/UserDashboard";
import UserBeneficiaries from "./pages/portal/UserBeneficiaries";
import UserTransactions from "./pages/portal/UserTransactions";
import UserDocuments from "./pages/portal/UserDocuments";
import UserGovernance from "./pages/portal/UserGovernance";
import UserDealRequests from "./pages/portal/UserDealRequests";
import ExchangeAdminDashboard from "./pages/exchange/ExchangeAdminDashboard";
import ExchangeKYBReview from "./pages/exchange/ExchangeKYBReview";
import ExchangeKYBConfig from "./pages/exchange/ExchangeKYBConfig";
import ExchangePayoutConfig from "./pages/exchange/ExchangePayoutConfig";
import ExchangeComplianceConfig from "./pages/exchange/ExchangeComplianceConfig";
import ExchangeStaffManagement from "./pages/exchange/ExchangeStaffManagement";
import ExchangeBranchManagement from "./pages/exchange/ExchangeBranchManagement";
import ExchangeFeeManagement from "./pages/exchange/ExchangeFeeManagement";
import ExchangeTransactions from "./pages/exchange/ExchangeTransactions";
import ExchangeBusinessDocuments from "./pages/exchange/ExchangeBusinessDocuments";
import ExchangeDealReview from "./pages/exchange/ExchangeDealReview";
import ExchangeBusinessOnboarding from "./pages/exchange/ExchangeBusinessOnboarding";
import BranchDashboard from "./pages/branch/BranchDashboard";
import BranchKYBQueue from "./pages/branch/BranchKYBQueue";
import BranchTransactions from "./pages/branch/BranchTransactions";
import BranchBusinessDocuments from "./pages/branch/BranchBusinessDocuments";
import BranchDealReview from "./pages/branch/BranchDealReview";
import BranchBusinessOnboarding from "./pages/branch/BranchBusinessOnboarding";

import Login from "./components/Login";
import BranchDetails from "./pages/exchange/Branch/BranchDetails";
import ExchangeLayout from "./components/layout/ExchangeLayout";
import PasswordSetup from "../src/pages/exchange/Staff/PasswordSetup";
import StaffTwoFA from "./pages/exchange/Staff/StaffTwoFA";

import Otp from "./pages/exchange/Staff/Otp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<Index />} /> */}

              <Route path="/" element={<Login />} />
              <Route path="/set-password" element={<PasswordSetup />} />
              <Route path="/generateqr" element={<StaffTwoFA />} />

              {/* Business Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/onboarding" element={<AdminOnboarding />} />
              <Route
                path="/admin/deal-settings"
                element={<AdminDealSettings />}
              />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* Business User Routes */}
              <Route path="/portal" element={<UserDashboard />} />
              <Route path="/portal/profile/:id" element={<UserProfile />} />
              <Route
                path="/portal/beneficiaries"
                element={<UserBeneficiaries />}
              />
              <Route
                path="/portal/transactions"
                element={<UserTransactions />}
              />
              <Route path="/portal/deals" element={<UserDealRequests />} />
              <Route path="/portal/users" element={<AdminUserManagement />} />
              <Route path="/portal/governance" element={<UserGovernance />} />
              <Route path="/portal/documents" element={<UserDocuments />} />

              {/* Exchange House Admin Routes */}
              <Route path="/exchange" element={<ExchangeAdminDashboard />} />
              <Route
                path="/exchange/Details/:uuid"
                element={<BranchDetails />}
              />
              <Route
                path="/exchange/onboard-business"
                element={<ExchangeBusinessOnboarding />}
              />
              <Route
                path="/exchange/kyb-review"
                element={<ExchangeKYBReview />}
              />
              <Route
                path="/exchange/kyb-config"
                element={<ExchangeKYBConfig />}
              />
              <Route
                path="/exchange/transactions"
                element={<ExchangeTransactions />}
              />
              <Route path="/exchange/deals" element={<ExchangeDealReview />} />
              <Route
                path="/exchange/documents"
                element={<ExchangeBusinessDocuments />}
              />
              <Route
                path="/exchange/fee-management"
                element={<ExchangeFeeManagement />}
              />
              <Route
                path="/exchange/payout-config"
                element={<ExchangePayoutConfig />}
              />
              <Route
                path="/exchange/compliance-config"
                element={<ExchangeComplianceConfig />}
              />
              <Route
                path="/exchange/branches"
                element={<ExchangeBranchManagement />}
              />
              <Route
                path="/exchange/staff"
                element={<ExchangeStaffManagement />}
              />

              {/* Branch User Routes */}
              <Route path="/branch" element={<BranchDashboard />} />
              <Route
                path="/branch/onboard-business"
                element={<BranchBusinessOnboarding />}
              />
              <Route path="/branch/kyb-queue" element={<BranchKYBQueue />} />
              <Route
                path="/branch/transactions"
                element={<BranchTransactions />}
              />
              <Route path="/branch/deals" element={<BranchDealReview />} />
              <Route
                path="/branch/documents"
                element={<BranchBusinessDocuments />}
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
