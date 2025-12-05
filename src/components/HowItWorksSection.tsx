import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileText, 
  Users, 
  Send, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      titleKey: "businessOnboarding" as const,
      descKey: "businessOnboardingDesc" as const,
      details: [
        "uploadBusinessDocs",
        "automatedVerification", 
        "sourceOfFunds",
        "complianceApproval"
      ] as const
    },
    {
      icon: Users,
      titleKey: "setupTeamWorkflows" as const,
      descKey: "setupTeamWorkflowsDesc" as const,
      details: [
        "addTeamMembers",
        "setTransactionLimits",
        "configureApprovalWorkflows",
        "customizeNotifications"
      ] as const
    },
    {
      icon: FileText,
      titleKey: "registerBeneficiaries" as const,
      descKey: "registerBeneficiariesDesc" as const,
      details: [
        "addBeneficiaryInfo",
        "selectPayoutMethods",
        "uploadSupportingDocs",
        "approvalWorkflowValidation"
      ] as const
    },
    {
      icon: Send,
      titleKey: "executeTransactions" as const,
      descKey: "executeTransactionsDesc" as const,
      details: [
        "singleOrBulk",
        "realTimeRates",
        "transactionPurpose",
        "instantConfirmation"
      ] as const
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className={`flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-button">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="shadow-card hover:shadow-lg transition-smooth">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {t(step.titleKey)}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {t(step.descKey)}
                        </p>
                        
                        {/* Step Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{t(detail)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Arrow for desktop */}
                  {!isLast && (
                    <div className="hidden lg:block">
                      <ArrowRight className={`h-6 w-6 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </div>

                {/* Vertical line for mobile */}
                {!isLast && (
                  <div className={`lg:hidden absolute ${isRTL ? 'right-8' : 'left-8'} top-16 w-0.5 h-12 bg-border`} />
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('readyToGetStarted')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('joinHundreds')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="business" size="lg">
                {t('startOnboarding')}
              </Button>
              <Button variant="outline" size="lg">
                {t('scheduleDemo')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
