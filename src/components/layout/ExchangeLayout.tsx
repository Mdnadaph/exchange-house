import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
} from "lucide-react";
import { useCookies } from "react-cookie";

interface ExchangeLayoutProps {
  children: React.ReactNode;
}

const ExchangeLayout = ({ children }: ExchangeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookies, , removeCookie] = useCookies([
    "tempToken",
    "token",
    "twoFactorEnabled",
    "email",
    "role",
    "fullName",
    "businessEmail",
    "accessToken",
    "businessTwoFactorEnabled",
    "firstName",
    "lastName",
  ]);

  const firstName = cookies.firstName;
  const lastName = cookies.lastName;
  const fullName = cookies.fullName;

  console.log("first Name ", firstName);
  console.log("Last Name", lastName);
  console.log("full Name ", fullName);

  const handleLogout = () => {
    removeCookie("email");
    removeCookie("token");
    removeCookie("fullName");
    removeCookie("firstName");
    removeCookie("lastName");
    removeCookie("role");
    navigate("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/exchange", icon: Home },
    { name: "Onboard Business", href: "/exchange/onboard-business", icon: Building2 },
    { name: "KYB Review", href: "/exchange/kyb-review", icon: FileCheck },
    { name: "KYB Config", href: "/exchange/kyb-config", icon: Settings },
    { name: "Transactions", href: "/exchange/transactions", icon: CreditCard },
    { name: "Rate Deals", href: "/exchange/deals", icon: Handshake },
    { name: "Documents", href: "/exchange/documents", icon: Files },
    { name: "Fee Management", href: "/exchange/fee-management", icon: Calculator },
    { name: "Payout Config", href: "/exchange/payout-config", icon: DollarSign },
    { name: "Compliance", href: "/exchange/compliance-config", icon: Shield },
    { name: "Branch Management", href: "/exchange/branches", icon: GitBranch },
    { name: "Staff Management", href: "/exchange/staff", icon: Users },
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
                  Exchange House Admin
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                {fullName} {firstName} {lastName} (Exchange Admin)
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
            {navigation.map((item) => {
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
          <div className="container mx-auto px-6 py-2 mb-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExchangeLayout;
