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
} from "lucide-react";
import { useCookies } from "react-cookie";

interface UserLayoutProps {
  children: React.ReactNode;
}

const BusinessUserLayout = ({ children }: UserLayoutProps) => {
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
    "refreshToken",
    "businessName",
    "currencyCode",
    "exchangeHouseName",
    "twoFactorMethod",
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
  const refreshToken = cookie.refreshToken;
  const businessName = cookie.businessName;

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
    removeCookie("currencyCode", { path: "/" });
    removeCookie("exchangeHouseName", { path: "/" });
    removeCookie("twoFactorMethod", { path: "/" });
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

  // const navigation = [
  //   { name: "Dashboard", href: "/user", icon: Home },
  //   { name: "Profile", href: `/user/profile`, icon: UserCircle },
  //   { name: "Transactions", href: "/user/transactions", icon: CreditCard },
  //   {
  //     name: "Transaction Report",
  //     href: "/user/transaction-report",
  //     icon: BookOpen,
  //   },
  //   // { name: "Beneficiaries", href: "/user/beneficiaries", icon: Users },
  //   // { name: "Rate Deals", href: "/user/deals", icon: Handshake },
  //   // { name: "User Management", href: "/user/users", icon: Users },
  //   // { name: "Governance", href: "/user/governance", icon: Shield },
  //   // { name: "Documents", href: `/user/documents/${id}`, icon: FileText },
  // ];

  const navigation = [
    {
      group: "Home",
      items: [
        { name: "Dashboard", href: "/user", icon: Home },
        { name: "Profile", href: `/user/profile`, icon: UserCircle },
        // {
        //   name: "Transaction Report",
        //   href: "/user/transaction-report",
        //   icon: BookOpen,
        // },
      ],
    },
    {
      group: "Transaction",
      items: [
        { name: "Transactions", href: "/user/transactions", icon: CreditCard },
      ],
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
                  Business User Portal - ({businessName})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Business User - (
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
            {/* {navigation.map((item) => {
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
            })} */}
            {navigation.map((group) => (
              <div key={group.group}>
                {/* Group Title */}
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                  {group.group}
                </p>

                {/* Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
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
                </div>
              </div>
            ))}
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

export default BusinessUserLayout;
