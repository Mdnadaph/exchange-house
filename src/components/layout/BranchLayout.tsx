import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import axios from "axios";
import BASE_URL from "@/config/config";
import {
  Building2,
  Home,
  FileCheck,
  LogOut,
  MapPin,
  CreditCard,
  Files,
  Handshake,
} from "lucide-react";
import { useCookies } from "react-cookie";
interface BranchLayoutProps {
  children: React.ReactNode;
}

const BranchLayout = ({ children }: BranchLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

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

    "uuid",
    "branchId",
    "contactNumber",
    "roleName",
    "id",
    "refreshToken",
    "branchName",
  ]);

  const id = cookie.branchId;
  const fullName = cookie.fullName;
  const firstName = cookie.firstName;
  const lastName = cookie.lastName;
  const branchName = cookie.branchName;

  const token = cookie.token;
  const role = cookie.role;
  const tempToken = cookie.tempToken;
  const email = cookie.email;
  const uuid = cookie.uuid;
  const requiresTwoFactor = cookie.requiresTwoFactor;
  const branchId = cookie.branchId;
  const contactNumber = cookie.contactNumber;
  const roleName = cookie.roleName;
  const refreshToken = cookie.refreshToken;

  // console.log(firstName);
  // console.log(id);

  const clearAllCookies = () => {
    removeCookie("token", { path: "/" });
    removeCookie("role", { path: "/" });
    removeCookie("fullName", { path: "/" });
    removeCookie("email", { path: "/" });
    removeCookie("twoFactorEnabled", { path: "/" });
    removeCookie("tempToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    removeCookie("uuid", { path: "/" });
    removeCookie("id", { path: "/" });
    removeCookie("firstName", { path: "/" });
    removeCookie("lastName", { path: "/" });
    removeCookie("requiresTwoFactor", { path: "/" });
    removeCookie("branchId", { path: "/" });
    removeCookie("branchName", { path: "/" });
    removeCookie("contactNumber", { path: "/" });
    removeCookie("roleName", { path: "/" });
    removeCookie("accessToken", { path: "/" });
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
    { name: "Dashboard", href: "/branch", icon: Home },
    {
      name: "Onboard Business",
      href: "/branch/onboard-business",
      icon: Building2,
    },
    { name: "KYB Queue", href: "/branch/kyb-queue", icon: FileCheck },
    { name: "Transactions", href: "/branch/transactions", icon: CreditCard },
    { name: "Rate Deals", href: "/branch/deals", icon: Handshake },
    { name: "Documents", href: "/branch/documents", icon: Files },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/branch" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BizPay Axis</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Branch Admin Portal - ({branchName})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Branch Admin - ({fullName ? fullName : `${firstName || ""} ${lastName || ""}`})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
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

export default BranchLayout;
