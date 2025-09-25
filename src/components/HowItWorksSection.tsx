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

const steps = [
  {
    icon: UserPlus,
    title: "Business Onboarding",
    description: "Complete UAE Central Bank KYB compliance with our streamlined digital onboarding process.",
    details: [
      "Upload business documents",
      "Automated verification process", 
      "Source of funds declaration",
      "Compliance approval within 24-48 hours"
    ]
  },
  {
    icon: Users,
    title: "Setup Team & Workflows",
    description: "Configure your internal user hierarchies and define approval workflows for different transaction thresholds.",
    details: [
      "Add team members and roles",
      "Set transaction limits by user",
      "Configure approval workflows",
      "Customize notification preferences"
    ]
  },
  {
    icon: FileText,
    title: "Register Beneficiaries",
    description: "Add and verify beneficiaries worldwide with flexible payout options and comprehensive documentation.",
    details: [
      "Add beneficiary information",
      "Select payout methods",
      "Upload supporting documents",
      "Approval workflow validation"
    ]
  },
  {
    icon: Send,
    title: "Execute Transactions",
    description: "Process single payments or bulk transactions with real-time rates, full transparency, and instant confirmations.",
    details: [
      "Single or bulk transaction processing",
      "Real-time exchange rates",
      "Transaction purpose documentation",
      "Instant confirmation and tracking"
    ]
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in just four simple steps and transform your cross-border payment operations
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
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-12">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-button">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="shadow-card hover:shadow-lg transition-smooth">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {step.description}
                        </p>
                        
                        {/* Step Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Arrow for desktop */}
                  {!isLast && (
                    <div className="hidden lg:block">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Vertical line for mobile */}
                {!isLast && (
                  <div className="lg:hidden absolute left-8 top-16 w-0.5 h-12 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join hundreds of businesses already using our platform for seamless cross-border payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="business" size="lg">
                Start Onboarding
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;