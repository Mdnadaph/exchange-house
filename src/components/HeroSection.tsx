import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Globe, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/business-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Business cross-border payments"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-muted border border-accent/20 text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Shield className="h-4 w-4 mr-2" />
            UAE Central Bank Compliant
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Transform Your
            <span className="block bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
              Cross-Border Payments
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
            Streamline your business transactions with our secure, compliant digital platform. 
            No more branch visits—manage payments, beneficiaries, and approvals from anywhere.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in [animation-delay:400ms]">
            <div className="flex items-center text-primary-foreground/90">
              <Zap className="h-5 w-5 mr-2 text-accent" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center text-primary-foreground/90">
              <Globe className="h-5 w-5 mr-2 text-accent" />
              <span>Global Reach</span>
            </div>
            <div className="flex items-center text-primary-foreground/90">
              <Shield className="h-5 w-5 mr-2 text-accent" />
              <span>Bank-Grade Security</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in [animation-delay:600ms]">
            <Button variant="hero" size="xl" className="group">
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
              Schedule Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in [animation-delay:800ms]">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className="flex items-center justify-center text-primary-foreground">
                <CheckCircle className="h-5 w-5 mr-2 text-accent" />
                <span className="text-sm font-medium">UAE Central Bank Licensed</span>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className="flex items-center justify-center text-primary-foreground">
                <CheckCircle className="h-5 w-5 mr-2 text-accent" />
                <span className="text-sm font-medium">ISO 27001 Certified</span>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className="flex items-center justify-center text-primary-foreground">
                <CheckCircle className="h-5 w-5 mr-2 text-accent" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;