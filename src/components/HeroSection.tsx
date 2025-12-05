import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Globe, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/business-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, isRTL } = useLanguage();

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
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-accent-muted border border-accent/20 text-accent-foreground text-sm font-medium mb-6 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Shield className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('uaeCentralBankCompliant')}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            {t('heroTitle')}
            <span className="block bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
            {t('heroSubtitle')}
          </p>

          {/* Key Benefits */}
          <div className={`flex flex-wrap justify-center gap-6 mb-10 animate-fade-in [animation-delay:400ms]`}>
            <div className={`flex items-center text-primary-foreground/90 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{t('instantProcessing')}</span>
            </div>
            <div className={`flex items-center text-primary-foreground/90 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{t('globalReach')}</span>
            </div>
            <div className={`flex items-center text-primary-foreground/90 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{t('bankGradeSecurity')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in [animation-delay:600ms]`}>
            <Button variant="hero" size="xl" className="group">
              {t('startYourJourney')}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-smooth`} />
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
              {t('scheduleDemo')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in [animation-delay:800ms]">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className={`flex items-center justify-center text-primary-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-sm font-medium">{t('uaeCentralBankLicensed')}</span>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className={`flex items-center justify-center text-primary-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-sm font-medium">{t('iso27001Certified')}</span>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
              <div className={`flex items-center justify-center text-primary-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-sm font-medium">{t('support247')}</span>
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
