import { Building2, Mail, Phone, MapPin, Globe, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <Building2 className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">BizPay Axis</span>
            </div>
            <p className="text-background/80 mb-6 text-sm leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
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
            <h4 className="text-lg font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('crossBorderPaymentsService')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('bulkTransactions')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('beneficiaryManagement')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('approvalWorkflows')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('realTimeRatesService')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('supportTitle')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('helpCenter')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('apiDocumentation')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('integrationGuide')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('contactSupport')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-accent transition-smooth">{t('systemStatus')}</a></li>
            </ul>
          </div>

          {/* Contact & Compliance */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contactCompliance')}</h4>
            <div className="space-y-3 text-sm">
              <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-background/80">
                  Dubai International Financial Centre<br />
                  Dubai, UAE
                </span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-background/80">+971 4 XXX XXXX</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-background/80">support@bizpayaxis.ae</span>
              </div>
            </div>
            
            {/* Compliance Badges */}
            <div className="mt-6 space-y-2">
              <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-background/80">{t('uaeCentralBankLicensed')}</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Award className="h-4 w-4 text-accent" />
                <span className="text-background/80">{t('iso27001Certified')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-background/60">
              <span>© {new Date().getFullYear()} BizPay Axis. {t('allRightsReserved')}</span>
              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href="#" className="hover:text-accent transition-smooth">{t('privacyPolicy')}</a>
                <a href="#" className="hover:text-accent transition-smooth">{t('termsOfService')}</a>
                <a href="#" className="hover:text-accent transition-smooth">{t('compliance')}</a>
              </div>
            </div>
            <div className="text-xs text-background/60">
              {t('licensedByUae')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
