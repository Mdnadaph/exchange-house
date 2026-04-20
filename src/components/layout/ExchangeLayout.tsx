import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePermission } from "@/hooks/usePermission";
import axios from "axios";
import BASE_URL from "@/config/config";
import {
  Building2,
  Home,
  FileCheck,
  Settings,
  Users,
  LogOut,
  Landmark,
  DollarSign,
  Shield,
  Calculator,
  CreditCard,
  Files,
  Handshake,
  GitBranch,
  BadgePercent,
  Clock,
  BadgeCheck,
  Loader,
} from "lucide-react";
import { useCookies } from "react-cookie";

interface ExchangeLayoutProps {
  children: React.ReactNode;
}

const ExchangeLayout = ({ children }: ExchangeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermission();
  const [cookies, , removeCookie] = useCookies([
    "token",
    "email",
    "role",
    "fullName",
    "refreshToken",
    "accessToken",
    "legalBusinessName",
    "currencyCode",
  ]);

  const fullName = cookies.fullName;
  const token = cookies.token;
  const role = cookies.role;
  const email = cookies.email;
  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;
  const legalBusinessName = cookies.legalBusinessName;

  const clearAllCookies = () => {
    removeCookie("token", { path: "/" });
    removeCookie("token", { path: "/" });
    removeCookie("email", { path: "/" });
    removeCookie("role", { path: "/" });
    removeCookie("fullName", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    removeCookie("accessToken", { path: "/" });
    removeCookie("legalBusinessName", { path: "/" });
    removeCookie("currencyCode", { path: "/" });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v3/unified/logout`,
        { refreshToken: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        },
      );
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAllCookies();
      navigate("/");
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/exchange", icon: Home, code: "NAV_DASHBOARD" },
    {
      name: "Onboard Business",
      href: "/exchange/onboard-business",
      icon: Building2,
      code: "NAV_ONBOARD_BUSINESS",
    },
    {
      name: "KYB Review",
      href: "/exchange/kyb-review",
      icon: FileCheck,
      code: "NAV_KYB_REVIEW",
    },
    {
      name: "KYB Config",
      href: "/exchange/kyb-config",
      icon: Settings,
      code: "NAV_KYB_CONFIG",
    },
    {
      name: "KYB Mapping",
      href: "/exchange/onmapping",
      icon: FileCheck,
      code: "NAV_KYB_MAPPING",
    },
    {
      name: "Transactions",
      href: "/exchange/transactions",
      icon: CreditCard,
      code: "NAV_TRANSACTION",
    },
    {
      name: "Pending Payment",
      href: "/exchange/pending-verification",
      icon: Loader,
      code: "NAV_PENDING_PEMENT_VERIFICATION",
    },
    {
      name: "Discounts",
      href: "/exchange/discount",
      icon: BadgePercent,
      code: "NAV_DISCOUNTS",
    },
    //{
    //  name: "Rate Deals",
    //  href: "/exchange/deals",
    //  icon: Handshake,
    //  code: "NAV_RATE_DEALS",
    //},
    {
      name: "Documents",
      href: "/exchange/documents",
      icon: Files,
      code: "NAV_DOCUMENTS",
    },
    {
      name: "Fee Management",
      href: "/exchange/fee-management",
      icon: Calculator,
      code: "NAV_FEE_MANAGEMENT",
    },
    {
      name: "Payout Config",
      href: "/exchange/payout-config",
      icon: DollarSign,
      code: "NAV_PAYMENT_CONFIG",
    },
    {
      name: "Compliance",
      href: "/exchange/compliance-config",
      icon: Shield,
      code: "NAV_COMPLIANCE",
    },
    {
      name: "Branch Management",
      href: "/exchange/branches",
      icon: GitBranch,
      code: "NAV_BRANCH_MANAGEMENT",
    },
    {
      name: "Staff Management",
      href: "/exchange/staff",
      icon: Users,
      code: "NAV_STAFF_MANAGEMENT",
    },
    {
      name: "Exchange Admin User",
      href: "/exchange/user",
      icon: Users,
      code: "NAV_EXCHANGE_ADMIN_USER",
    },
  ];
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/exchange" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BizPay Axis</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <Landmark className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  {role === "ROLE_EXCHANGE_ADMIN"
                    ? "Exchange House Admin"
                    : "Exchange House User"}
                  - ( {legalBusinessName} )
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                {role === "ROLE_EXCHANGE_ADMIN"
                  ? "Exchange Admin"
                  : " Exchange User"}
                - ({fullName})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigation
              .filter(
                (item) =>
                  role === "ROLE_EXCHANGE_ADMIN" ||
                  (role === "ROLE_EXCHANGE_USER" && can(item.code)),
              )
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </aside>

        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-2 mb-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ExchangeLayout;
