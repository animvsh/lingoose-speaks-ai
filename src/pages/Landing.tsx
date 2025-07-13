import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import SimpleOnboardingFlow from "@/components/SimpleOnboardingFlow";
import PhoneAuthForm from "@/components/PhoneAuthForm";

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleStartNow = () => {
    setShowOnboarding(true);
  };

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleSignInBack = () => {
    setShowSignIn(false);
  };

  if (showOnboarding) {
    const phoneNumber = localStorage.getItem('phone_number') || '';
    return <SimpleOnboardingFlow onComplete={handleOnboardingComplete} phoneNumber={phoneNumber} />;
  }

  if (showSignIn) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-16 w-auto object-contain mx-auto mb-4 hover:scale-110 transition-transform duration-300" 
            />
            <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-wider transform -rotate-1">
              Sign In
            </h1>
            <p className="text-muted-foreground font-semibold">Welcome back to Bol</p>
          </div>
          
          <div className="warm-card p-6 soft-shadow">
            <PhoneAuthForm onBack={handleSignInBack} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200" 
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="hidden sm:flex items-center bg-white hover:bg-gray-50 border-2 border-primary text-primary font-bold py-2 px-4 rounded-xl transition-all duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <div className="hidden sm:flex items-center space-x-8 text-sm font-semibold text-foreground">
              <a href="#why" className="hover:text-primary transition-colors">Why Bol</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#faqs" className="hover:text-primary transition-colors">FAQs</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Teach your kids Hindi.<br />
            <span className="text-primary">Without nagging.</span>
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl mb-8 text-muted-foreground">
            <p className="font-semibold">Daily 1-on-1 calls. No apps. No worksheets.</p>
            <p className="font-semibold">Just one slightly pushy desi sheep.</p>
            <p className="font-black text-2xl text-primary">$4/week. Cancel anytime.</p>
          </div>

          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleStartNow}
              className="warm-button font-black text-xl px-12 py-6 text-white soft-shadow"
            >
              <Phone className="w-6 h-6 mr-3" />
              START NOW! 🚀
            </Button>
            
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-2 border-primary text-primary font-black text-xl px-12 py-6 rounded-xl transition-all duration-200"
            >
              <LogIn className="w-6 h-6 mr-3" />
              Sign In
            </Button>
          </div>

          <p className="text-sm mt-4 max-w-md mx-auto text-muted-foreground">
            By clicking Start Now, you consent to the{' '}
            <Link to="/terms-of-service" className="hover:underline font-semibold text-primary">Terms of Service</Link> and{' '}
            <Link to="/privacy-policy" className="hover:underline font-semibold text-primary">Privacy Policy</Link>.
          </p>

          {/* Hero Image */}
          <div className="relative max-w-lg mx-auto">
            <div className="warm-card p-8 soft-shadow">
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
      <section id="why" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-foreground">
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
            <Card key={index} className="warm-card p-6 text-center hover-lift">
              <div className="mb-4 flex justify-center">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-lg font-black mb-3 text-foreground">{item.title}</h3>
              <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-black mb-8 text-foreground">💸 Simple Pricing</h2>
        
        <div className="inline-block">
          <Card className="warm-card p-10 soft-shadow">
            <div className="text-6xl font-black mb-4 text-foreground">
              $4<span className="text-3xl text-muted-foreground">/week</span>
            </div>
            <ul className="text-lg space-y-3 font-semibold text-muted-foreground">
              <li className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Daily 1-on-1 calls 📞
              </li>
              <li className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                No tech headaches 🤯
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
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-foreground">
          How Bol Works
        </h2>
        
        {/* Process Flow */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="warm-card p-8 soft-shadow">
            <img 
              src="/lovable-uploads/ae3ff9ea-2f29-4a46-ac08-13a756e28a34.png" 
              alt="How Bol Works Process Flow Diagram" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="warm-card p-8 hover-lift">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/2759d760-66ad-49a1-b514-506532516fda.png" 
                alt="Daily Progress Reports"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-black mb-3 text-foreground">Daily Progress Reports</h3>
            <p className="font-medium text-muted-foreground">
              Get detailed reports after each call. Track your child's vocabulary growth, 
              pronunciation improvements, and conversation confidence.
            </p>
          </Card>
          
          <Card className="warm-card p-8 hover-lift">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/3fba8058-0143-452a-823e-e925bb333097.png" 
                alt="Scenario-Based Learning"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-black mb-3 text-foreground">Scenario-Based Learning</h3>
            <p className="font-medium text-muted-foreground">
              Real-life situations like ordering food, asking for directions, or talking to relatives. 
              We don't teach grammar—we teach you to navigate conversations that actually matter.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-foreground">
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
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentTestimonial * 100}%)`,
                width: `${totalSlides * 100}%`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex}
                  className="w-full flex gap-6 justify-center"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  {testimonials
                    .slice(slideIndex * reviewsPerSlide, (slideIndex + 1) * reviewsPerSlide)
                    .map((testimonial, index) => (
                      <Card 
                        key={`${slideIndex}-${index}`}
                        className="warm-card flex-1 max-w-sm p-6 hover-lift"
                      >
                        <div className="text-2xl mb-3">💬</div>
                        <blockquote className="text-sm mb-4 italic font-medium text-foreground">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <cite className="text-sm font-black text-foreground">— {testimonial.author}</cite>
                          <p className="text-xs font-medium text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-foreground">
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
            <Card key={index} className="warm-card p-6 hover-lift">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{faq.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-2 text-foreground">{faq.question}</h3>
                  <p className="font-medium text-muted-foreground">{faq.answer}</p>
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
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>
          <div className="space-y-2 font-semibold text-muted-foreground">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
          </div>
          <div className="pt-4 text-sm font-medium border-t border-border text-muted-foreground">
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
