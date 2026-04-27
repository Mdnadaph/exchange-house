import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import axios from "axios";
import BASE_URL from "@/config/config";

import {
  Building2,
  Home,
  Users,
  Settings,
  FileCheck,
  LogOut,
  Shield,
  Handshake,
  Landmark,
  Globe,
} from "lucide-react";
import { useCookies } from "react-cookie";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    {
      name: "Exchange House Management",
      href: "/admin/exchange-houses",
      icon: Landmark,
    },

    // { name: "KYB Mappning", href: "/admin/onmapping", icon: FileCheck },
    // { name: "Country & Currency", href: "/admin/county-currency", icon: Globe },
    // {
    //   name: "Payout Mechanism",
    //   href: "/admin/payout-mechanism",
    //   icon: Handshake,
    // },
    // { name: "KYB Onboarding", href: "/admin/onboarding", icon: FileCheck },
    // { name: "Deal Settings", href: "/admin/deal-settings", icon: Handshake },
    // { name: "Settings & Rules", href: "/admin/settings", icon: Settings },
  ];

  const [cookies, , removeCookie] = useCookies([
    "token",
    "accessToken",
    "refreshToken",
    "fullName",
    "role",
  ]);

  const token = cookies.token;
  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;

  const fullName = cookies.fullName;
  const role = cookies.role;

  const clearAllCookies = () => {
    removeCookie("token", { path: "/" });
    removeCookie("role", { path: "/" });
    removeCookie("fullName", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BizPay Axis</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Super Admin Portal
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Super admin (Admin)
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

export default AdminLayout;
