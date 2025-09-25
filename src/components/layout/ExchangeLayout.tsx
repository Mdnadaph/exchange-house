import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Home, 
  FileCheck, 
  Settings, 
  Users, 
  LogOut,
  Landmark,
  DollarSign,
  Shield
} from "lucide-react";

interface ExchangeLayoutProps {
  children: React.ReactNode;
}

const ExchangeLayout = ({ children }: ExchangeLayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/exchange", icon: Home },
    { name: "KYB Review", href: "/exchange/kyb-review", icon: FileCheck },
    { name: "KYB Config", href: "/exchange/kyb-config", icon: Settings },
    { name: "Payout Config", href: "/exchange/payout-config", icon: DollarSign },
    { name: "Compliance", href: "/exchange/compliance-config", icon: Shield },
    { name: "Staff Management", href: "/exchange/staff", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BusinessPay</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <Landmark className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Exchange House Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sarah Wilson (Exchange Admin)</span>
              <Button variant="ghost" size="sm">
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
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExchangeLayout;