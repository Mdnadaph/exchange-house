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

const features = [
  {
    icon: Users,
    title: "User Hierarchies & Workflows",
    description: "Create internal user hierarchies with customizable approval workflows based on transaction thresholds.",
    color: "text-blue-600"
  },
  {
    icon: Globe2,
    title: "Global Beneficiary Management", 
    description: "Register and manage beneficiaries worldwide with flexible payout options and approval processes.",
    color: "text-green-600"
  },
  {
    icon: FileCheck,
    title: "Bulk & Single Transactions",
    description: "Process individual invoice payments or bulk salary disbursements with comprehensive documentation support.",
    color: "text-purple-600"
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description: "Full UAE Central Bank KYB compliance with automated and manual verification options.",
    color: "text-red-600"
  },
  {
    icon: Layers,
    title: "Seamless Integration",
    description: "Real-time access to payout destinations, exchange rates, and fees through secure API integration.",
    color: "text-indigo-600"
  },
  {
    icon: Clock,
    title: "Real-Time Processing",
    description: "Instant transaction processing with live updates on exchange rates and transaction status.",
    color: "text-orange-600"
  }
];

const businessBenefits = [
  {
    icon: Building,
    title: "Enhanced Efficiency",
    description: "Eliminate branch visits and process transactions from anywhere, anytime.",
    stat: "90% Faster Processing"
  },
  {
    icon: CreditCard,
    title: "Cost Optimization", 
    description: "Competitive exchange rates and transparent fee structure with no hidden costs.",
    stat: "Up to 50% Cost Savings"
  },
  {
    icon: UserCheck,
    title: "Complete Control",
    description: "Full visibility and control over your payment processes with detailed reporting.",
    stat: "100% Transparency"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage cross-border payments efficiently, 
            securely, and in full compliance with UAE regulations.
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
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
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
              Why Businesses Choose Our Platform
            </h3>
            <p className="text-muted-foreground text-lg">
              Join thousands of businesses that have transformed their payment operations
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
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {benefit.description}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    {benefit.stat}
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