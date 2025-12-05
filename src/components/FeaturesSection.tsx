import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileCheck, 
  Globe2, 
  Layers, 
  Shield, 
  Clock,
  Building,
  CreditCard,
  UserCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Users,
      titleKey: "userHierarchies" as const,
      descKey: "userHierarchiesDesc" as const,
      color: "text-blue-600"
    },
    {
      icon: Globe2,
      titleKey: "globalBeneficiary" as const,
      descKey: "globalBeneficiaryDesc" as const,
      color: "text-green-600"
    },
    {
      icon: FileCheck,
      titleKey: "bulkSingleTransactions" as const,
      descKey: "bulkSingleTransactionsDesc" as const,
      color: "text-purple-600"
    },
    {
      icon: Shield,
      titleKey: "regulatoryCompliance" as const,
      descKey: "regulatoryComplianceDesc" as const,
      color: "text-red-600"
    },
    {
      icon: Layers,
      titleKey: "seamlessIntegration" as const,
      descKey: "seamlessIntegrationDesc" as const,
      color: "text-indigo-600"
    },
    {
      icon: Clock,
      titleKey: "realTimeProcessing" as const,
      descKey: "realTimeProcessingDesc" as const,
      color: "text-orange-600"
    }
  ];

  const businessBenefits = [
    {
      icon: Building,
      titleKey: "enhancedEfficiency" as const,
      descKey: "enhancedEfficiencyDesc" as const,
      statKey: "fasterProcessing" as const
    },
    {
      icon: CreditCard,
      titleKey: "costOptimization" as const,
      descKey: "costOptimizationDesc" as const,
      statKey: "costSavings" as const
    },
    {
      icon: UserCheck,
      titleKey: "completeControl" as const,
      descKey: "completeControlDesc" as const,
      statKey: "transparency" as const
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-lg transition-smooth group cursor-pointer hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t(feature.titleKey)}
                  </CardTitle>
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

        {/* Business Benefits */}
        <div className="bg-gradient-card rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {t('whyBusinessesChoose')}
            </h3>
            <p className="text-muted-foreground text-lg">
              {t('joinThousands')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {businessBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-bounce shadow-button">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">
                    {t(benefit.titleKey)}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {t(benefit.descKey)}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    {t(benefit.statKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
