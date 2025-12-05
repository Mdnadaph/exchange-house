import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BizPay Axis</span>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
              {t('features')}
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-smooth">
              {t('security')}
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
              {t('howItWorks')}
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
              {t('contactUs')}
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <a href="/portal">User Portal</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin">Admin Portal</a>
            </Button>
            <Button variant="business" size="lg">
              {t('getStarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className={`md:hidden flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                {t('features')}
              </a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-smooth">
                {t('security')}
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
                {t('howItWorks')}
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
                {t('contactUs')}
              </a>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="justify-start">Sign In</Button>
              <Button variant="business" className="justify-start">{t('getStarted')}</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;