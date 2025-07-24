import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SimpleOnboardingFlow from "@/components/SimpleOnboardingFlow";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import { useAuth } from "@/contexts/AuthContext";
import DashboardStats from "@/components/DashboardStats";
import AnimatedBottomNav from "@/components/AnimatedBottomNav";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import SettingsCard from "@/components/SettingsCard";
import ActivityDetailsView from "@/components/ActivityDetailsView";
import AddSupervisorForm from "@/components/AddSupervisorForm";
import ProfileManagementPage from "@/components/ProfileManagementPage";
import AIBehaviorMetricsPanel from "@/components/AIBehaviorMetricsPanel";
import PageTransition from "@/components/PageTransition";
import { EnhancedProgressView } from "@/components/EnhancedProgressView";
import { FluencyRoadmapView } from "@/components/FluencyRoadmapView";
import WelcomeScreen from "@/components/WelcomeScreen";

const Landing = () => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activityDetailsData, setActivityDetailsData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const testimonials = [
    {
      quote: "Finally, my son can talk to his nani properly. She's so happy she cries every time he calls her.",
      author: "Priya Sharma, Texas",
      role: "Software Engineer", 
      duration: "8 months",
      company: "Meta"
    },
    {
      quote: "The daily reports show exactly what they're learning. My daughter went from zero Hindi to having full conversations in 3 months.",
      author: "Rajesh Patel, California",
      role: "Cardiologist",
      duration: "8 months", 
      company: "Stanford Medical"
    },
    {
      quote: "My kids actually look forward to their Hindi calls now. Better than any app we tried before.",
      author: "Meera Gupta, New York",
      role: "Investment Banker",
      duration: "6 months",
      company: "Goldman Sachs"
    },
    {
      quote: "Our 8-year-old is now teaching ME Hindi words. The tables have turned!",
      author: "Anita Joshi, Florida",
      role: "Pediatrician",
      duration: "1 year",
      company: "Miami Children's Hospital"
    },
    {
      quote: "He went from refusing to speak Hindi to arguing with his cousins in Hindi. Success!",
      author: "Vikram Singh, Illinois",
      role: "Tech Director",
      duration: "10 months",
      company: "Microsoft"
    },
    {
      quote: "My mother-in-law is finally impressed with something I've done for the kids.",
      author: "Deepika Rao, Washington",
      role: "Marketing Manager",
      duration: "5 months",
      company: "Amazon"
    },
    {
      quote: "The scenarios are so realistic. My kid now confidently orders samosas in Hindi at Indian restaurants.",
      author: "Arjun Mehta, Michigan",
      role: "Financial Advisor",
      duration: "9 months",
      company: "Fidelity"
    },
    {
      quote: "From 'I don't want to' to 'When is my next Hindi call?' in just 2 weeks.",
      author: "Kavita Agarwal, Georgia",
      role: "Architect",
      duration: "4 months",
      company: "HOK"
    },
    {
      quote: "My daughter surprised her dadi by singing a Hindi nursery rhyme. There wasn't a dry eye.",
      author: "Rohit Bhandari, Arizona",
      role: "Data Scientist",
      duration: "7 months",
      company: "Google"
    }
  ];

  const reviewsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / reviewsPerSlide);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // This ensures hook order consistency across all renders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Check if user has completed onboarding
  useEffect(() => {
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboarding_complete_${user.id}`);
      if (onboardingComplete) {
        setIsOnboarded(true);
      } else {
        setCurrentView("onboarding");
      }
    }
  }, [user]);

  // Show smooth loading state - no blank screens ever
  if (loading) {
    return (
      <div className="min-h-screen w-full hindi-bg flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-nunito">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartNow = () => {
    setShowOnboarding(true);
  };

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const handleNavigate = (view: string, data?: any) => {
    console.log('🏠 LANDING.tsx handleNavigate called with:', view);
    setIsTransitioning(true);
    
    if (data) {
      setActivityDetailsData(data);
    }
    
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

  const handleOnboardingComplete = () => {
    localStorage.removeItem('needs_onboarding');
    
    const userProfile = localStorage.getItem('current_user_profile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        localStorage.setItem(`onboarding_complete_${profile.id}`, "true");
        setIsOnboarded(true);
        setCurrentView("home");
      } catch (error) {
        console.error('Error parsing user profile after onboarding:', error);
      }
    } else if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, "true");
      setIsOnboarded(true);
      setCurrentView("home");
    }
  };

  const renderCurrentView = () => {
    let content;

    if (currentView === "onboarding" && !isOnboarded) {
      content = <WelcomeScreen onComplete={handleOnboardingComplete} onProfileCreated={refreshUser} />;
    } else if (currentView === "home") {
      content = <DashboardStats onNavigate={handleNavigate} />;
    } else if (currentView === "activity") {
      content = <ActivityCard onNavigate={handleNavigate} />;
    } else if (currentView === "activity-details") {
      content = <ActivityDetailsView activity={activityDetailsData} onNavigate={handleNavigate} />;
    } else if (currentView === "curriculum") {
      content = <CurriculumCard onNavigate={handleNavigate} />;
    } else if (currentView === "progress") {
      content = <EnhancedProgressView onNavigate={handleNavigate} />;
    } else if (currentView === "roadmap") {
      content = <FluencyRoadmapView />;
    } else if (currentView === "settings") {
      content = <SettingsCard onNavigate={handleNavigate} />;
    } else if (currentView === "add-supervisor") {
      content = <AddSupervisorForm onClose={() => handleNavigate("settings")} />;
    } else if (currentView === "profile-management") {
      content = <ProfileManagementPage onNavigate={handleNavigate} />;
    } else if (currentView === "ai-behavior-metrics") {
      content = <AIBehaviorMetricsPanel onNavigate={handleNavigate} />;
    } else {
      content = <DashboardStats onNavigate={handleNavigate} />;
    }

    return (
      <PageTransition 
        isTransitioning={isTransitioning} 
        transitionKey={currentView}
      >
        <div className="w-full">
          {content}
        </div>
      </PageTransition>
    );
  };

  // If user is authenticated, show the complete app interface
  if (user && !loading) {
    const shouldShowBottomNav = isOnboarded && currentView !== "onboarding" && currentView !== "add-supervisor" && currentView !== "ai-behavior-metrics";
    
    return (
      <div className="min-h-screen w-full hindi-bg font-nunito animate-fade-in">
        <div className={`w-full ${shouldShowBottomNav ? "pb-24" : ""}`}>
          {renderCurrentView()}
        </div>
        
        {shouldShowBottomNav && (
          <AnimatedBottomNav 
            currentView={currentView} 
            onNavigate={handleNavigate}
          />
        )}
      </div>
    );
  }

  const handleLandingOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleSignInBack = () => {
    setShowSignIn(false);
  };

  if (showOnboarding) {
    const phoneNumber = localStorage.getItem('phone_number') || '';
    return <SimpleOnboardingFlow onComplete={handleLandingOnboardingComplete} phoneNumber={phoneNumber} onProfileCreated={refreshUser} />;
  }

  if (showSignIn) {
    return (
      <div className="min-h-screen w-full hindi-bg flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/75399f67-a35b-4483-9ef6-99e1aba10b44.png" 
              alt="Bol Logo" 
              className="h-16 w-auto object-contain mx-auto mb-4 hover:scale-110 transition-transform duration-300" 
            />
            <h1 className="text-4xl font-black text-brown-900 mb-2 uppercase tracking-wider transform -rotate-1 font-nunito">
              Sign In
            </h1>
            <p className="text-brown-700 font-semibold font-nunito">Welcome back to Bol</p>
          </div>
          <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <PhoneAuthForm onBack={handleSignInBack} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen w-full font-nunito animate-fade-in"
      style={{
        backgroundImage: `url('/lovable-uploads/f7e8c6ae-d967-4e31-a5b0-8ea6962b374c.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header - optimized for desktop */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/75399f67-a35b-4483-9ef6-99e1aba10b44.png" 
              alt="Bol Logo" 
              className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-200" 
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="flex items-center bg-white hover:bg-orange-50 border-2 border-handdrawn text-primary font-bold py-2 px-4 rounded-2xl transition-all duration-200 text-sm md:text-base shadow-sm"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-brown-700 font-nunito">
              <a href="#why" className="hover:text-primary transition-colors">Why Bol</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#faqs" className="hover:text-primary transition-colors">FAQs</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - responsive for desktop */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            {/* YC-style badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center bg-card border-2 border-handdrawn rounded-full px-4 py-2 shadow-sm hover-lift">
                <span className="text-sm font-black text-foreground mr-2 font-nunito">not backed by</span>
                <img 
                  src="/lovable-uploads/42e02fd5-e4c2-4e62-af21-e13f2948849d.png" 
                  alt="Y Combinator logo" 
                  className="w-6 h-6 mr-2"
                />
                <span className="text-sm font-black text-foreground font-nunito">combinator (yet)</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-brown-900 font-nunito">
              Teach your kids Hindi.<br />
              <span className="text-primary">Without nagging.</span>
            </h1>
            
            <div className="space-y-4 text-base sm:text-lg md:text-xl mb-8 text-brown-700 font-nunito">
              <p className="font-semibold">Daily 1-on-1 calls. No apps. No worksheets.</p>
              <p className="font-semibold">Just one slightly pushy desi sheep.</p>
              <p className="font-black text-xl md:text-2xl text-primary">$4/week. Cancel anytime.</p>
            </div>

            <div className="mb-8 md:mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleStartNow}
                className="warm-button font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 text-white shadow-lg rounded-3xl border-2 border-handdrawn"
              >
                <Phone className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                START NOW! 🚀
              </Button>
              
              <Button
                onClick={handleSignIn}
                variant="outline"
                className="bg-white hover:bg-orange-50 border-2 border-handdrawn text-primary font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-3xl transition-all duration-200 shadow-sm"
              >
                <LogIn className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                Sign In
              </Button>
            </div>

            <p className="text-xs md:text-sm mt-4 max-w-md mx-auto text-brown-700 font-nunito">
              By clicking Start Now, you consent to the{' '}
              <Link to="/terms-of-service" className="hover:underline font-semibold text-primary">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" className="hover:underline font-semibold text-primary">Privacy Policy</Link>.
            </p>
          </div>

          {/* Hero Image - responsive */}
          <div className="relative max-w-sm md:max-w-lg mx-auto">
            <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 md:p-8 shadow-lg">
              <img 
                src="/lovable-uploads/b0e951c1-f59e-468b-afbb-83bef5734b90.png" 
                alt="Learning character with headphones" 
                className="w-full h-auto object-contain animate-gentle-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Bol Works */}
      <section id="why" className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-center mb-8 md:mb-12 text-brown-900 font-nunito">
          Why Bol Works
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { 
              title: "Made for ABCDs", 
              desc: "Built by and for American-born confused desis",
              image: "/lovable-uploads/ebff912f-26c4-4834-9de7-c24d07bd7f1b.png"
            },
            { 
              title: "Real Hindi conversations", 
              desc: "No boring flashcards or grammar drills",
              image: "/lovable-uploads/37e52a63-5cc7-4e54-9b05-193aab994684.png"
            },
            { 
              title: "Daily calls = real fluency", 
              desc: "Consistent practice builds lasting skills",
              image: "/lovable-uploads/794d8758-b34e-48d4-bfa7-0a9f0fbc6580.png"
            },
            { 
              title: "Talk to dadi without Google Translate", 
              desc: "Connect with family in their language",
              image: "/lovable-uploads/a4122ad1-cbc2-4bd9-beae-8eda0bbf6aff.png"
            }
          ].map((item, index) => (
            <Card key={index} className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 text-center shadow-lg hover-lift">
              <div className="mb-4 flex justify-center">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-16 md:w-20 h-16 md:h-20 object-contain"
                />
              </div>
              <h3 className="text-base md:text-lg font-black mb-3 text-brown-900 font-nunito">{item.title}</h3>
              <p className="text-sm font-medium text-brown-700 font-nunito">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-8 text-brown-900 font-nunito">💸 Simple Pricing</h2>
        
        <div className="inline-block">
          <Card className="rounded-3xl border-2 border-handdrawn bg-white/90 p-8 md:p-10 shadow-lg">
            <div className="text-4xl md:text-6xl font-black mb-4 text-brown-900 font-nunito">
              $4<span className="text-2xl md:text-3xl text-muted-foreground">/week</span>
            </div>
            <ul className="text-base md:text-lg space-y-3 font-semibold text-brown-700 font-nunito">
              <li className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Daily 1-on-1 calls 📞
              </li>
              <li className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                No tech headaches ��
              </li>
              <li className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Cancel anytime ✨
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-brown-900 font-nunito">
          How Bol Works
        </h2>
        
        {/* Process Flow */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-8 shadow-lg">
            <img 
              src="/lovable-uploads/ae3ff9ea-2f29-4a46-ac08-13a756e28a34.png" 
              alt="How Bol Works Process Flow Diagram" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="rounded-3xl border-2 border-handdrawn bg-white/90 p-8 shadow-lg hover-lift">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/2759d760-66ad-49a1-b514-506532516fda.png" 
                alt="Daily Progress Reports"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-black mb-3 text-brown-900 font-nunito">Daily Progress Reports</h3>
            <p className="font-medium text-brown-700 font-nunito">
              Get detailed reports after each call. Track your child's vocabulary growth, 
              pronunciation improvements, and conversation confidence.
            </p>
          </Card>
          
          <Card className="rounded-3xl border-2 border-handdrawn bg-white/90 p-8 shadow-lg hover-lift">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/3fba8058-0143-452a-823e-e925bb333097.png" 
                alt="Scenario-Based Learning"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-black mb-3 text-brown-900 font-nunito">Scenario-Based Learning</h3>
            <p className="font-medium text-brown-700 font-nunito">
              Real-life situations like ordering food, asking for directions, or talking to relatives. 
              We don't teach grammar—we teach you to navigate conversations that actually matter.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-brown-900 font-nunito">
          What Devi Parents Say 🇮🇳
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % totalSlides)}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Testimonials carousel */}
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentTestimonial * 100}%)`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials
                      .slice(slideIndex * reviewsPerSlide, (slideIndex + 1) * reviewsPerSlide)
                      .map((testimonial, index) => (
                        <Card 
                          key={`${slideIndex}-${index}`}
                          className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 hover-lift shadow-lg"
                        >
                          <div className="text-2xl mb-3">💬</div>
                          <blockquote className="text-sm mb-4 italic font-medium text-brown-900 font-nunito">
                            "{testimonial.quote}"
                          </blockquote>
                          <div>
                            <cite className="text-sm font-black text-brown-900 font-nunito">— {testimonial.author}</cite>
                            <p className="text-xs font-medium text-brown-700 font-nunito">{testimonial.role}</p>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-brown-900 font-nunito">
          FAQs
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "Ages?",
              answer: "6–15 (or anyone who calls roti \"flatbread\")",
              icon: "🎂"
            },
            {
              question: "Missed a call?",
              answer: "We'll call again.",
              icon: "☎️"
            },
            {
              question: "Can I join the call?",
              answer: "Sure, but we might sass you too.",
              icon: "👨‍👩‍👧‍👦"
            }
          ].map((faq, index) => (
            <Card key={index} className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 hover-lift shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{faq.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-2 text-brown-900 font-nunito">{faq.question}</h3>
                  <p className="font-medium text-brown-700 font-nunito">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center border-t border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img 
              src="/lovable-uploads/75399f67-a35b-4483-9ef6-99e1aba10b44.png" 
              alt="Bol Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>
          <div className="space-y-2 font-semibold text-brown-700 font-nunito">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
            <div className="flex items-center justify-center gap-2 text-sm mt-3">
              <img 
                src="/yc-logo.png" 
                alt="Y Combinator Logo" 
                className="h-4 w-auto object-contain opacity-70" 
              />
              <span className="text-brown-600">not backed by y combinator (yet)</span>
            </div>
          </div>
          <div className="pt-4 text-sm font-medium border-t border-border text-brown-700 font-nunito">
            <p>📩 <a href="mailto:support@bol.ad" className="hover:text-primary transition-colors">support@bol.ad</a></p>
            <p className="mt-2">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a> • © 2025 Bol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
