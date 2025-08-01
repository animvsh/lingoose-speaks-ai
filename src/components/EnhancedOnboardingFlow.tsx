import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Star, Globe, Heart, Baby, User, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import BolMascot from '@/components/BolMascot';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';

interface EnhancedOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  phoneNumber: string;
}

interface OnboardingData {
  fullName: string;
  phoneNumber: string; // Add phone number to the data structure
  hindiProficiency: number;
  age: number;
  location: string;
  motherTongue: string;
  accountType: 'self' | 'child' | 'other';
  accountHolderName?: string;
}

const hindiLevels = [
  { 
    level: 1, 
    title: "मैं हिंदी नहीं जानता", 
    subtitle: "I don't know Hindi",
    icon: "🌱",
    description: "Starting fresh"
  },
  { 
    level: 2, 
    title: "थोड़ा सा", 
    subtitle: "A little bit",
    icon: "🌿",
    description: "Basic words & phrases"
  },
  { 
    level: 3, 
    title: "कुछ समझ सकता हूँ", 
    subtitle: "I understand some",
    icon: "🌳",
    description: "Simple conversations"
  },
  { 
    level: 4, 
    title: "अच्छी तरह बोल सकता हूँ", 
    subtitle: "I can speak well",
    icon: "🌟",
    description: "Comfortable speaking"
  },
  { 
    level: 5, 
    title: "धाराप्रवाह", 
    subtitle: "Fluent",
    icon: "✨",
    description: "Native-like fluency"
  }
];

const languages = [
  "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", 
  "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Nepali", "Other"
];

export const EnhancedOnboardingFlow: React.FC<EnhancedOnboardingFlowProps> = ({
  onComplete,
  phoneNumber
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    phoneNumber: phoneNumber || '', // Initialize with prop or empty
    hindiProficiency: 1,
    age: 25,
    location: '',
    motherTongue: 'English',
    accountType: 'self'
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackTap } = useEngagementTracking();

  const totalSteps = 7; // Increase to include phone number step

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation && !data.location) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            );
            const locationData = await response.json();
            setData(prev => ({ 
              ...prev, 
              location: `${locationData.city || locationData.locality}, ${locationData.countryName}` 
            }));
          } catch (error) {
            console.log('Could not fetch location');
          }
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (direction === 'left' && currentStep < totalSteps - 1) {
      handleNext();
    }
  };

  useSwipeNavigation(containerRef, handleSwipe);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      trackTap('next_button', `onboarding_step_${currentStep + 1}`, { 
        step: currentStep + 1,
        phone_number: phoneNumber 
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    trackTap('complete_onboarding', 'onboarding_final', { 
      phone_number: phoneNumber,
      data: data
    });
    onComplete(data);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.fullName.trim().length >= 2;
      case 1: return true; // Hindi proficiency always valid
      case 2: return data.age >= 5 && data.age <= 100;
      case 3: return data.location.trim().length >= 2;
      case 4: return data.motherTongue.length > 0;
      case 5: return data.accountType && (data.accountType === 'self' || data.accountHolderName?.trim());
      case 6: return data.phoneNumber.trim().length >= 10; // Phone number validation
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <BolMascot className="mx-auto hover-lift animate-gentle-float" />
              <div className="space-y-2">
                <h1 className="hero-text text-primary">नमस्ते! 🙏</h1>
                <p className="subtext">Let's start your Hindi journey</p>
              </div>
            </div>
            
            <Card className="warm-card clean-surface p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">What should I call you?</label>
                <Input
                  placeholder="Your full name"
                  value={data.fullName}
                  onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="text-lg h-12 border-primary/20 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>This helps me personalize your learning experience</span>
              </div>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🗣️</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Hindi Fluency</h2>
                <p className="subtext">How well do you speak Hindi currently?</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {hindiLevels.map((level) => (
                <Card
                  key={level.level}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    data.hindiProficiency === level.level
                      ? 'border-primary bg-primary/5 shadow-glow scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, hindiProficiency: level.level }))}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{level.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{level.title}</h3>
                      <p className="text-sm text-muted-foreground">{level.subtitle}</p>
                      <p className="text-xs text-primary/80">{level.description}</p>
                    </div>
                    {data.hindiProficiency === level.level && (
                      <Star className="w-5 h-5 text-primary fill-current" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-pulse">🎂</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Your Age</h2>
                <p className="subtext">This helps me adjust the pace</p>
              </div>
            </div>
            
            <Card className="warm-card clean-surface p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Age</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={data.age}
                  onChange={(e) => setData(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                  className="text-lg h-12 border-primary/20 focus:border-primary transition-colors text-center"
                  min="5"
                  max="100"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span>Learning is beautiful at any age!</span>
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🌍</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Where are you?</h2>
                <p className="subtext">Your general location helps with context</p>
              </div>
            </div>
            
            <Card className="warm-card clean-surface p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <Input
                  placeholder="City, Country"
                  value={data.location}
                  onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
                  className="text-lg h-12 border-primary/20 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                <span>We detected your location automatically if you allowed it</span>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-pulse">🗣️</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Mother Tongue</h2>
                <p className="subtext">What language are you most comfortable in?</p>
              </div>
            </div>
            
            <Card className="warm-card clean-surface p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Most comfortable language</label>
                <select
                  value={data.motherTongue}
                  onChange={(e) => setData(prev => ({ ...prev, motherTongue: e.target.value }))}
                  className="w-full text-lg h-12 border border-primary/20 rounded-md px-3 bg-background focus:border-primary transition-colors"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span>I can explain things in your native language when needed</span>
              </div>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">👥</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Account Type</h2>
                <p className="subtext">Who is this account for?</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  data.accountType === 'self'
                    ? 'border-primary bg-primary/5 shadow-glow scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setData(prev => ({ ...prev, accountType: 'self' }))}
              >
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">For myself</h3>
                    <p className="text-sm text-muted-foreground">I want to learn Hindi</p>
                  </div>
                  {data.accountType === 'self' && (
                    <Star className="w-5 h-5 text-primary fill-current" />
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  data.accountType === 'child'
                    ? 'border-primary bg-primary/5 shadow-glow scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setData(prev => ({ ...prev, accountType: 'child' }))}
              >
                <div className="flex items-center gap-4">
                  <Baby className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">For my child</h3>
                    <p className="text-sm text-muted-foreground">My child will learn Hindi</p>
                  </div>
                  {data.accountType === 'child' && (
                    <Star className="w-5 h-5 text-primary fill-current" />
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  data.accountType === 'other'
                    ? 'border-primary bg-primary/5 shadow-glow scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setData(prev => ({ ...prev, accountType: 'other' }))}
              >
                <div className="flex items-center gap-4">
                  <Heart className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">For someone else</h3>
                    <p className="text-sm text-muted-foreground">Family member or friend</p>
                  </div>
                  {data.accountType === 'other' && (
                    <Star className="w-5 h-5 text-primary fill-current" />
                  )}
                </div>
              </Card>

              {(data.accountType === 'child' || data.accountType === 'other') && (
                <Card className="warm-card clean-surface p-4 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">
                      {data.accountType === 'child' ? "Child's name" : "Their name"}
                    </label>
                    <Input
                      placeholder={data.accountType === 'child' ? "Your child's name" : "Their full name"}
                      value={data.accountHolderName || ''}
                      onChange={(e) => setData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      className="text-lg h-12 border-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>
        );

      case 6: // Phone number step
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-pulse">📱</div>
              <div className="space-y-2">
                <h2 className="hero-text text-primary">Phone Number</h2>
                <p className="subtext">We'll call you for your Hindi lessons!</p>
              </div>
            </div>
            
            <Card className="warm-card clean-surface p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={data.phoneNumber}
                  onChange={(e) => setData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="text-lg h-12 border-primary/20 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span>We'll use this number to call you for personalized Hindi lessons</span>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 clean-grid">
      <div className="safe-area-padding">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {currentStep > 0 ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="hover-lift rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-8 bg-primary shadow-glow'
                    : i < currentStep
                    ? 'w-2 bg-primary/60'
                    : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
          
          <div className="w-10 flex justify-center">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6">
          <Button
            onClick={currentStep === totalSteps - 1 ? handleComplete : handleNext}
            disabled={!isStepValid()}
            className="w-full h-14 text-lg font-semibold hover-lift bg-gradient-to-r from-primary to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? '🚀 Start Learning!' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};