import { Building2, Mail, Phone, MapPin, Globe, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">BusinessPay</span>
            </div>
            <p className="text-background/80 mb-6 text-sm leading-relaxed">
              Transforming cross-border payments for businesses across the UAE and beyond. 
              Licensed, secure, and compliant with UAE Central Bank regulations.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-accent">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-accent">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-accent">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Cross-Border Payments</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Bulk Transactions</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Beneficiary Management</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Approval Workflows</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Real-time Rates</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Help Center</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">API Documentation</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Integration Guide</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">Contact Support</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">System Status</a></li>
            </ul>
          </div>

          {/* Contact & Compliance */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Compliance</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-background/80">
                  Dubai International Financial Centre<br />
                  Dubai, UAE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-background/80">+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-background/80">support@businesspay.ae</span>
              </div>
            </div>
            
            {/* Compliance Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-background/80">UAE Central Bank Licensed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-background/80">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-background/60">
              <span>© 2024 BusinessPay. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-accent transition-smooth">Privacy Policy</a>
                <a href="#" className="hover:text-accent transition-smooth">Terms of Service</a>
                <a href="#" className="hover:text-accent transition-smooth">Compliance</a>
              </div>
            </div>
            <div className="text-xs text-background/60">
              Licensed by UAE Central Bank | Regulated Financial Institution
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;