import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Gavel, 
  Server,
  UserCheck,
  Globe,
  Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SecuritySection = () => {
  const { t, isRTL } = useLanguage();

  const securityFeatures = [
    {
      icon: Shield,
      titleKey: "endToEndEncryption" as const,
      descKey: "endToEndEncryptionDesc" as const,
      badgeKey: "bankGradeSecurityBadge" as const
    },
    {
      icon: Lock,
      titleKey: "multiFactorAuth" as const,
      descKey: "multiFactorAuthDesc" as const,
      badgeKey: "mfaRequired" as const
    },
    {
      icon: Eye,
      titleKey: "realTimeMonitoring" as const,
      descKey: "realTimeMonitoringDesc" as const,
      badgeKey: "liveMonitoring" as const
    },
    {
      icon: FileCheck,
      titleKey: "amlCompliance" as const,
      descKey: "amlComplianceDesc" as const,
      badgeKey: "amlVerified" as const
    }
  ];

  const compliance = [
    // {
    //   icon: Gavel,
    //   titleKey: "uaeCentralBankLicensedTitle" as const,
    //   descKey: "uaeCentralBankLicensedDesc" as const,
    //   certifications: ["msbLicense", "crossBorderPayments", "kybCompliance"] as const
    // },
    {
      icon: Server,
      titleKey: "dataProtection" as const,
      descKey: "dataProtectionDesc" as const,
      certifications: ["gdprCompliant",  "dataResidency"] as const
    },
    
    {
      icon: Award,
      titleKey: "internationalStandards" as const,
      descKey: "internationalStandardsDesc" as const,
      certifications: ["ISO 27001", "SOC 2 Type II", "PCI DSS"] as const
    }
  ];

  return (
    <section id="security" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('securityTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('securitySubtitle')}
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`shadow-card hover:shadow-lg transition-smooth group ${isRTL ? 'border-r-4 border-r-primary' : 'border-l-4 border-l-primary'}`}
              >
                <CardHeader>
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t(feature.titleKey)}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {t(feature.badgeKey)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Compliance Section */}
        <div className="bg-gradient-card rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {t('regulatoryComplianceTitle')}
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('regulatoryComplianceSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {compliance.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-button">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">
                    {t(item.titleKey)}
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    {t(item.descKey)}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {item.certifications.map((cert, certIndex) => (
                      <Badge key={certIndex} variant="outline" className="text-xs">
                        {cert.includes(' ') ? cert : t(cert as any)}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">{t('uptime')}</div>
              </div>
              <div>
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">150+</div>
                <div className="text-sm text-muted-foreground">{t('countries')}</div>
              </div>
              <div>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">{t('breaches')}</div>
              </div>
              <div>
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">{t('support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
