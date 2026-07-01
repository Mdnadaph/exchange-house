import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// ─── Pages ────────────────────────────────────────────────────────────────
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminKybMapping from "./pages/admin/AdminKybMapping";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDealSettings from "./pages/admin/AdminDealSettings";
import AdminExchangeHouses from "./pages/admin/AdminExchangeHouses";
import AdminExchangeHouseDetails from "./pages/admin/AdminExchangeHouseDetails";

// Portal / Business Admin
import UserDashboard from "./pages/portal/UserDashboard";
import UserProfile from "./pages/portal/UserProfile";
import UserBeneficiaries from "./pages/portal/UserBeneficiaries";
import UserTransactions from "./pages/portal/UserTransactions";
import UserDocuments from "./pages/portal/UserDocuments";
import UserGovernance from "./pages/portal/UserGovernance";
import UserManagement from "./pages/portal/UserManagement";
import UserDealRequests from "./pages/portal/UserDealRequests";

// Exchange Admin
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
import BranchDetails from "./pages/exchange/Branch/BranchDetails";
import CreateKybRule from "./components/kyb/CreateKybRule";
import ExchangePendingVerification from "./pages/exchange/ExchangePendingVerification";
import ExchangeAdminComplianceReview from "./pages/exchange/ExchangeAdminComplianceReview";
import ExchangeAdminTransactionReport from "./pages/exchange/ExchangeAdminTransactionReport";

// Branch Staff
import BranchDashboard from "./pages/branch/BranchDashboard";
import BranchKYBQueue from "./pages/branch/BranchKYBQueue";
import BranchTransactions from "./pages/branch/BranchTransactions";
import BranchBusinessDocuments from "./pages/branch/BranchBusinessDocuments";
import BranchDealReview from "./pages/branch/BranchDealReview";
import BranchBusinessOnboarding from "./pages/branch/BranchBusinessOnboarding";

// Branch Admin 2FA
import StaffSetupPassword from "./pages/branch/BranchAdmin2FA/StaffSetupPassword";
import StaffTwoFA from "./pages/branch/BranchAdmin2FA/StaffTwoFA";
import StaffVerifyTwoFALogin from "./pages/branch/BranchAdmin2FA/StaffVerifyTwoFALogin";

// Business Admin 2FA
import BusinessPasswordSetup from "./pages/portal/BusinessAdmin2FA/BusinessPasswordSetup";
import BusinessTwoFA from "./pages/portal/BusinessAdmin2FA/BusinessTwoFA";
import BusinessVerifyTwoFALogin from "./pages/portal/BusinessAdmin2FA/BusinessVerifyTwoFALogin";

// Business User 2FA
import UserSetupPassword from "./pages/user/BusinessUser2FA/UserSetupPassword";
import UserTwoFA from "./pages/user/BusinessUser2FA/UserTwoFA";
import UserTwoFALogin from "./pages/user/BusinessUser2FA/UserVerifyTwoFALogin";

// Business User
import BussinessUserDashboard from "./pages/user/BussinessUserDashboard";
import BussinessUserProfile from "./pages/user/BussinessUserProfile";
import BussinessUserTransaction from "./pages/user/BusinessUserTransaction";
import ChangePassword from "./pages/ChangePassword";
import ExchangeDiscount from "./pages/exchange/ExchangeDiscount";
import ExchangeAdminUser from "./pages/exchange/ExchangeAdminUser";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExchangeKybMapping from "./pages/exchange/ExchangeKybMaping";
import AdminCountryCurrency from "./pages/admin/AdminCountryCurrency";
import AdminPayoutMechanism from "./pages/admin/AdminPayoutMechanism";
import ExchangeCountryCurrency from "./pages/exchange/ExchangeCountryCurrency";
import ExchangePayoutMechanism from "./pages/exchange/ExchangePayoutMechanism";
import BusinessUserTransactionReport from "./pages/user/BusinessUserTransactionReport";
import UserTransactionReport from "./pages/portal/UserTransactionReport";
import BranchTransactionReport from "./pages/branch/BranchTransactionReport";
import AdminReports from "./pages/admin/AdminReports";
import ExchangeReports from "./pages/exchange/ExchangeReports";
import UserReports from "./pages/portal/UserReports";
import BranchBeneficries from "./pages/branch/BranchBeneficries";
import ExchangeAdminMember from "./pages/exchange/ExchangeAdminMember";

const queryClient = new QueryClient();

// ─── Role Constants ──
const BRANCH_ROLES = [
  "ROLE_STAFF",
  "ROLE_KYB_OFFICER",
  "ROLE_SENIOR_KYB_OFFICER",
  "ROLE_BRANCH_MANAGER",
];

const BUSINESS_ROLES = ["ROLE_USER", "ROLE_BUSINESS_USER"];

// ─── Protected Route with Role + Smart Redirects ─────
interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const [cookies] = useCookies(["token", "role"]);
  const location = useLocation();

  // No token → redirect to login
  if (!cookies.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = cookies.role as string | undefined;

  // Explicitly allowed role for this section
  if (currentRole && allowedRoles.includes(currentRole)) {
    return <Outlet />;
  }

  // Smart fallback redirects based on role
  if (
    currentRole === "ROLE_EXCHANGE_ADMIN" ||
    currentRole === "ROLE_EXCHANGE_USER"
  ) {
    return <Navigate to="/exchange" replace />;
  }

  if (BRANCH_ROLES.includes(currentRole)) {
    return <Navigate to="/branch" replace />;
  }

  if (currentRole === "ROLE_BUSINESS_ADMIN") {
    return <Navigate to="/portal" replace />;
  }

  if (BUSINESS_ROLES.includes(currentRole)) {
    return <Navigate to="/user" replace />;
  }

  // Unknown or invalid role → login (safety net)
  console.warn("[ProtectedRoute] Unknown/invalid role:", currentRole);
  return <Navigate to="/login" replace />;
};

// ─── Root App ─────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Staff / Exchange 2FA & setup – public */}
                <Route path="/set-password" element={<StaffSetupPassword />} />
                <Route path="/generateqr" element={<StaffTwoFA />} />
                <Route
                  path="/verify-2fa-login"
                  element={<StaffVerifyTwoFALogin />}
                />

                {/* Business / Branch 2FA & setup – public */}
                <Route
                  path="/business-auth/set-password"
                  element={<BusinessPasswordSetup />}
                />
                <Route path="/business/2fa/qr" element={<BusinessTwoFA />} />
                <Route
                  path="/business/2fa/login"
                  element={<BusinessVerifyTwoFALogin />}
                />

                {/* Business User for Portal 2FA setup  - public */}
                <Route
                  path="/business-user-set-password"
                  element={<UserSetupPassword />}
                />
                <Route
                  path="/business-user-generateqr"
                  element={<UserTwoFA />}
                />
                <Route
                  path="/business-user-2fa-login"
                  element={<UserTwoFALogin />}
                />

                {/* ─── PROTECTED ROUTES ─────────────────────────── */}

                {/* Admin (super admin) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["ROLE_SUPER_USER"]} />
                  }
                >
                  <Route path="/admin">
                    <Route index element={<AdminDashboard />} />
                    <Route
                      path="/admin/exchange-houses"
                      element={<AdminExchangeHouses />}
                    />

                    <Route
                      path="/admin/exchange-houses/:id"
                      element={<AdminExchangeHouseDetails />}
                    />
                    <Route
                      path="/admin/onmapping"
                      element={<AdminKybMapping />}
                    />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    {/* <Route
                      path="/admin/county-currency"
                      element={<AdminCountryCurrency />}
                    />
                    <Route
                      path="payout-mechanism"
                      element={<AdminPayoutMechanism />}
                    /> */}

                    <Route path="onboarding" element={<AdminOnboarding />} />

                    <Route
                      path="deal-settings"
                      element={<AdminDealSettings />}
                    />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route
                      path="user-management"
                      element={<AdminUserManagement />}
                    />
                  </Route>
                </Route>

                {/* Portal – Business Admin and Business User */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["ROLE_BUSINESS_ADMIN"]} />
                  }
                >
                  <Route path="/portal">
                    <Route index element={<UserDashboard />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="profile/:id" element={<UserProfile />} />
                    <Route
                      path="beneficiaries"
                      element={<UserBeneficiaries />}
                    />
                    <Route path="transactions" element={<UserTransactions />} />
                    <Route path="deals" element={<UserDealRequests />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="governance" element={<UserGovernance />} />
                    <Route path="documents" element={<UserDocuments />} />
                    <Route path="documents/:id" element={<UserDocuments />} />
                    <Route
                      path="transaction-report"
                      element={<UserTransactionReport />}
                    />
                    <Route path="reports" element={<UserReports />} />
                  </Route>
                </Route>

                {/* Portal – Business User */}
                <Route
                  element={<ProtectedRoute allowedRoles={BUSINESS_ROLES} />}
                >
                  <Route path="/user">
                    <Route index element={<BussinessUserDashboard />} />
                    <Route path="profile" element={<BussinessUserProfile />} />
                    <Route
                      path="transactions"
                      element={<BussinessUserTransaction />}
                    />
                    <Route
                      path="transaction-report"
                      element={<BusinessUserTransactionReport />}
                    />
                  </Route>
                </Route>

                {/* Exchange Admin  and Exchange User */}
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "ROLE_EXCHANGE_ADMIN",
                        "ROLE_EXCHANGE_USER",
                      ]}
                    />
                  }
                >
                  <Route path="/exchange">
                    <Route index element={<ExchangeAdminDashboard />} />
                    <Route
                      path="onboard-business"
                      element={<ExchangeBusinessOnboarding />}
                    />
                    <Route path="kyb-review" element={<ExchangeKYBReview />} />
                    <Route path="kyb-config" element={<ExchangeKYBConfig />} />
                    <Route
                      path="kyb-mapping"
                      element={<ExchangeKybMapping />}
                    />
                    <Route path="create-kyb-rule" element={<CreateKybRule />} />
                    <Route
                      path="transactions"
                      element={<ExchangeTransactions />}
                    />
                    <Route
                      path="pending-verification"
                      element={<ExchangePendingVerification />}
                    />
                    <Route
                      path="compliance-review"
                      element={<ExchangeAdminComplianceReview />}
                    />

                    <Route
                      path="transaction-report"
                      element={<ExchangeAdminTransactionReport />}
                    />
                    <Route path="discount" element={<ExchangeDiscount />} />
                    <Route path="deals" element={<ExchangeDealReview />} />
                    <Route
                      path="documents"
                      element={<ExchangeBusinessDocuments />}
                    />
                    <Route
                      path="fee-management"
                      element={<ExchangeFeeManagement />}
                    />
                    <Route
                      path="payout-config"
                      element={<ExchangePayoutConfig />}
                    />
                    <Route
                      path="compliance-config"
                      element={<ExchangeComplianceConfig />}
                    />
                    <Route
                      path="branches"
                      element={<ExchangeBranchManagement />}
                    />
                    <Route
                      path="branches/Details/:uuid"
                      element={<BranchDetails />}
                    />
                    {/* <Route path="staff" element={<ExchangeStaffManagement />} /> */}
                    <Route path="member" element={<ExchangeAdminMember />} />
                    {/* <Route path="user" element={<ExchangeAdminUser />} /> */}
                    <Route
                      path="country-currency"
                      element={<ExchangeCountryCurrency />}
                    />
                    <Route
                      path="payout-mechanism"
                      element={<ExchangePayoutMechanism />}
                    />
                    <Route path="reports" element={<ExchangeReports />} />
                  </Route>
                </Route>

                {/* Branch Staff – all 4 roles allowed */}
                <Route element={<ProtectedRoute allowedRoles={BRANCH_ROLES} />}>
                  <Route path="/branch">
                    <Route index element={<BranchDashboard />} />
                    <Route
                      path="onboard-business"
                      element={<BranchBusinessOnboarding />}
                    />
                    <Route path="kyb-queue" element={<BranchKYBQueue />} />
                    <Route
                      path="beneficiaries"
                      element={<BranchBeneficries />}
                    />
                    <Route
                      path="transactions"
                      element={<BranchTransactions />}
                    />
                    <Route path="deals" element={<BranchDealReview />} />
                    <Route
                      path="documents"
                      element={<BranchBusinessDocuments />}
                    />
                    <Route
                      path="transaction-report"
                      element={<BranchTransactionReport />}
                    />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
