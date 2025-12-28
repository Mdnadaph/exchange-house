import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const [cookies, , removeCookie] = useCookies([
    "accessToken",
    "tempToken",
    "twoFactorEnabled",
    "requiresTwoFactor",
    "email",
    "token",
    "role",
    "fullName"

  ]);
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

  // const handleLogout = () => {
  //   removeCookie("accessToken");

  //   navigate("/");
  // };

  const handleLogout = () => {
    // removeCookie("accessToken", { path: "/" });
    // removeCookie("tempToken", { path: "/" });
    // removeCookie("twoFactorEnabled", { path: "/" });
    // removeCookie("requiresTwoFactor", { path: "/" });
    removeCookie("token");
    removeCookie("accessToken");
    removeCookie("tempToken");
    removeCookie("requiresTwoFactor");
    removeCookie("twoFactorEnabled");
    removeCookie("email");
    removeCookie("role");
    removeCookie("fullName");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BizPay Axis</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Branch Portal - Dubai Mall
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Ahmed Hassan (Branch Staff)
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
        <aside className="w-64 bg-background border-r min-h-[calc(100vh-4rem)]">
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
        <main className="flex-1">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default BranchLayout;
