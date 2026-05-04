import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import axios from "axios";
import BASE_URL from "@/config/config";
import {
  Building2,
  Home,
  Users,
  CreditCard,
  FileText,
  LogOut,
  User,
  Shield,
  UserCircle,
  Handshake,
  BookOpen,
  FileBarChart,
} from "lucide-react";
import { useCookies } from "react-cookie";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookie, , removeCookie] = useCookies([
    "accessToken",
    "tempToken",
    "twoFactorEnabled",
    "requiresTwoFactor",
    "email",
    "token",
    "role",
    "fullName",
    "firstName",
    "lastName",
    "businessId",
    "uuid",
    "id",
    "businessName",
    "refreshToken",
    "exchangeHouseName",
    "currencyCode",
  ]);

  const id = cookie.businessId;
  const fullName = cookie.fullName;
  const firstName = cookie.firstName;
  const lastName = cookie.lastName;

  const token = cookie.token;
  const role = cookie.role;
  const tempToken = cookie.tempToken;
  const email = cookie.email;
  const uuid = cookie.uuid;
  const requiresTwoFactor = cookie.requiresTwoFactor;
  const businessId = cookie.businessId;
  const businessName = cookie.businessName;
  const refreshToken = cookie.refreshToken;
  const exchangeHouseName = cookie.exchangeHouseName;

  // console.log(firstName);
  // console.log(id);

  const clearAllCookies = () => {
    removeCookie("token", { path: "/" });
    removeCookie("role", { path: "/" });
    removeCookie("fullName", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    removeCookie("accessToken", { path: "/" });

    removeCookie("email", { path: "/" });
    removeCookie("twoFactorEnabled", { path: "/" });
    removeCookie("tempToken", { path: "/" });

    removeCookie("token", { path: "/" });
    removeCookie("email", { path: "/" });
    removeCookie("uuid", { path: "/" });
    removeCookie("id", { path: "/" });

    removeCookie("firstName", { path: "/" });
    removeCookie("lastName", { path: "/" });
    removeCookie("requiresTwoFactor", { path: "/" });
    removeCookie("businessId", { path: "/" });
    removeCookie("businessName", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
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
    { name: "Dashboard", href: "/portal", icon: Home },
    { name: "Profile", href: `/portal/profile/${id}`, icon: UserCircle },
    { name: "Beneficiaries", href: "/portal/beneficiaries", icon: Users },
    { name: "Transactions", href: "/portal/transactions", icon: CreditCard },
    { name: "Rate Deals", href: "/portal/deals", icon: Handshake },
    { name: "User Management", href: "/portal/users", icon: Users },
    { name: "Governance", href: "/portal/governance", icon: Shield },
    { name: "Documents", href: `/portal/documents/${id}`, icon: FileText },
    {
      name: "Reports",
      href: "/portal/reports",
      icon: FileBarChart,
    },
    {
      name: "Transaction Report",
      href: "/portal/transaction-report",
      icon: BookOpen,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/portal" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BizPay Axis</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Business Admin Portal - {exchangeHouseName} - ({businessName})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Business Admin - (
                {fullName ? fullName : `${firstName || ""} ${lastName || ""}`})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-smooth ${
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-2 mb-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
