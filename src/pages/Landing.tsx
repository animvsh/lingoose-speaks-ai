import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, FileText, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();
  
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
  
  console.log('Testimonials debug:', {
    totalTestimonials: testimonials.length,
    reviewsPerSlide,
    totalSlides,
    currentSlide: currentTestimonial
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleStartNow = () => {
    navigate('/app');
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: `url('/lovable-uploads/a9b20945-5451-46fb-a09b-b884ef485216.png')`,
      backgroundSize: '50%',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'scroll'
    }}>
      {/* Background image opacity overlay */}
      <div className="absolute inset-0 bg-background/30"></div>
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <img src="/lovable-uploads/f87019b3-6c6d-4fa2-b33c-4a9fff19a6ea.png" alt="Bol - Learn Hindi by talking" className="h-12 sm:h-16 hover:scale-110 hover:rotate-3 transition-all duration-300" />
          <div className="hidden sm:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#why" className="hover:text-foreground transition-colors">Why Bol</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-foreground transition-colors">FAQs</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Teach your kids Hindi. Without nagging.
            </h1>
            <div className="space-y-4 text-lg sm:text-xl lg:text-2xl text-muted-foreground">
              <p>Daily 1-on-1 calls. No apps. No worksheets.</p>
              <p>Just one slightly pushy desi sheep.</p>
              <p className="font-semibold text-foreground text-xl sm:text-2xl">$4/week. Cancel anytime.</p>
            </div>
            <div className="flex flex-col items-center lg:items-start justify-center gap-6 py-8 sm:py-10">
              <div className="flex flex-col items-center lg:items-start gap-2 w-full max-w-md lg:max-w-none">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="gap-3 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 animate-slide-up w-full max-w-xs lg:max-w-sm shadow-lg"
                  onClick={handleStartNow}
                >
                  <Phone className="w-6 h-6 animate-wiggle" />
                  <span className="font-bold text-xl">START NOW! 🚀</span>
                </Button>
                <span className="text-xs text-muted-foreground mt-2 text-center lg:text-left max-w-xs lg:max-w-sm">
                  By clicking Start Now, you consent to the{' '}
                  <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/20 p-8 border-4 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <img 
                src="/lovable-uploads/b0e951c1-f59e-468b-afbb-83bef5734b90.png" 
                alt="Learning character with headphones and speech bubbles" 
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain"
              />
            </div>
            {/* Speech bubbles */}
            <div className="absolute top-8 right-4 animate-bounce">
              <div className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-accent/90 to-accent/70 rounded-full flex items-center justify-center border-3 border-white animate-wiggle">
                <img src="/lovable-uploads/ba0c673c-0b8b-451e-ae5b-c29a485dbb36.png" alt="Brain power" className="w-7 h-7 sm:w-9 sm:h-9 animate-pulse" />
              </div>
            </div>
            <div className="absolute top-16 left-8 animate-bounce delay-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/30 to-primary/50 rounded-full flex items-center justify-center border-3 border-white">
                <img src="/lovable-uploads/1bd4be2b-4bc3-4c18-8472-a01174c35e8f.png" alt="Star achievement" className="w-5 h-5 sm:w-7 sm:h-7 animate-wiggle" />
              </div>
            </div>
            <div className="absolute bottom-20 right-8 animate-bounce delay-700">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-secondary/30 to-secondary/50 rounded-full flex items-center justify-center border-3 border-white">
                <img src="/lovable-uploads/4b9e4924-c847-4d9f-970b-d21006f4ca28.png" alt="Phone call" className="w-5 h-5 sm:w-7 sm:h-7 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bol Works */}
      <section id="why" className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/20"></div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground">
          Why Bol Works
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            { emoji: "🇮🇳", text: "Made for ABCDs", desc: "Built by and for American-born confused desis", image: "/lovable-uploads/84aa4f1d-1646-4ff6-b233-4105d98aa30e.png" },
            { emoji: "🗣", text: "Real Hindi conversations", desc: "No boring flashcards or grammar drills", image: "/lovable-uploads/ae3ff9ea-2f29-4a46-ac08-13a756e28a34.png" },
            { emoji: "📞", text: "Daily calls = real fluency", desc: "Consistent practice builds lasting skills", image: "/lovable-uploads/5d12e971-db50-422d-a45a-d4836a1a326a.png" },
            { emoji: "👵🏽", text: "Talk to dadi without Google Translate", desc: "Connect with family in their language", image: "/lovable-uploads/e2ea25fb-98de-4024-ab15-4e101c3c2af0.png" }
          ].map((item, index) => (
            <Card key={index} className="playful-card p-6 sm:p-8 text-center group animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              {item.image ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 group-hover:scale-125 transition-all duration-300">
                  <img src={item.image} alt={item.text} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5 group-hover:scale-125 group-hover:animate-wiggle transition-all duration-300">{item.emoji}</div>
              )}
              <p className="text-base sm:text-lg text-foreground font-bold mb-3 group-hover:text-primary transition-colors">{item.text}</p>
              <p className="text-sm text-muted-foreground group-hover:scale-105 transition-transform">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent/30"></div>
        <div className="text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">💸 Simple Pricing</h2>
          
          <div className="inline-block">
            <Card className="playful-card p-8 sm:p-10 bg-gradient-to-br from-accent/60 to-accent/40 border-4 border-accent hover:border-primary transition-all duration-300 animate-slide-up">
              <div className="text-5xl sm:text-6xl font-black text-foreground animate-wiggle">
                $4<span className="text-2xl sm:text-3xl text-muted-foreground">/week</span>
              </div>
              <ul className="text-base sm:text-lg text-muted-foreground mt-4 space-y-2 font-semibold">
                <li className="hover:scale-105 transition-transform">✔ Daily 1-on-1 calls 📞</li>
                <li className="hover:scale-105 transition-transform">✔ No tech headaches 🤯</li>
                <li className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <img src="/lovable-uploads/ab071a62-2bf0-4218-9838-3f1e171db464.png" alt="Cancel anytime" className="w-5 h-5" />
                  Cancel anytime ✨
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/30"></div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground">
          How Bol Works
        </h2>
        
        {/* Process Flow Graphic */}
        <div className="max-w-4xl mx-auto mb-12">
          <img 
            src="/lovable-uploads/974d3e12-ee0f-4ca1-afdd-7583b70c86c4.png" 
            alt="Bol process: Sign up, get daily calls, speak confidently" 
            className="w-3/5 h-auto object-contain animate-fade-in mx-auto"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          <Card className="p-6 sm:p-8 bg-card border-2 hover:scale-105 transition-all duration-300 group animate-slide-up">
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <img src="/lovable-uploads/e6e33590-af2b-49ac-a5b3-b534bd620a28.png" alt="Progress tracking sheep" className="w-20 h-auto sm:w-24 object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Daily Progress Reports</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get detailed reports after each call. Track your child's vocabulary growth, 
              pronunciation improvements, and conversation confidence. Parents get insights, 
              kids get motivated.
            </p>
          </Card>
          
          <Card className="p-6 sm:p-8 bg-card border-2 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <img src="/lovable-uploads/1ac29178-04c6-4bbc-ae5f-6680e41e08f1.png" alt="Scenario-based learning" className="w-20 h-auto sm:w-24 object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Scenario-Based Learning</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-life situations like ordering food, asking for directions, or talking to relatives. 
              We don't teach grammar—we teach you to navigate conversations that actually matter.
            </p>
          </Card>
        </div>
      </section>


      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent/50"></div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground animate-slide-up">
          What Desi Parents Say 🇮🇳
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % totalSlides)}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
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
                  className="w-full flex gap-4 sm:gap-6 justify-center"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  {(() => {
                    const slideTestimonials = testimonials
                      .slice(slideIndex * reviewsPerSlide, (slideIndex + 1) * reviewsPerSlide)
                      .filter(testimonial => testimonial && testimonial.quote);
                    
                    console.log(`Slide ${slideIndex}:`, slideTestimonials.map(t => t.author));
                    
                    return slideTestimonials
                      .map((testimonial, index) => (
                        <TooltipProvider key={`${slideIndex}-${index}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card 
                                className="flex-1 max-w-sm p-4 bg-gradient-to-br from-card to-accent/5 border-2 border-accent/20 hover:border-primary/30 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                              >
                                <div className="text-xl mb-2">💬</div>
                                <blockquote className="text-sm text-foreground mb-3 italic line-clamp-3">
                                  "{testimonial.quote}"
                                </blockquote>
                                <div className="space-y-1">
                                  <cite className="text-xs text-foreground font-medium">— {testimonial.author}</cite>
                                  <p className="text-xs text-primary/70 font-medium">{testimonial.role}</p>
                                </div>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent className="p-4 max-w-sm bg-background border border-border shadow-lg z-50">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                                    <span className="text-lg font-bold text-primary">
                                      {testimonial.company.split(' ')[0].charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                                    <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                                  </div>
                                </div>
                                <div className="border-t border-border pt-2">
                                  <p className="text-xs text-muted-foreground">
                                    <strong>Duration:</strong> Using Bol for {testimonial.duration}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <strong>Profession:</strong> {testimonial.role}
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ));
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial counter */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentTestimonial ? 'bg-primary w-8' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary/20"></div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground">
          FAQs
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
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
            <Card key={index} className="p-4 sm:p-6 bg-card border-2 hover:border-accent/30 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start gap-4">
                <div className="text-2xl">{faq.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 sm:py-12 text-center border-t border-border relative z-10">
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">🐏 bol</h3>
          <div className="text-sm sm:text-base text-muted-foreground space-y-2">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
          </div>
          <div className="pt-4 border-t border-border text-xs sm:text-sm text-muted-foreground">
            <p>📩 <a href="mailto:support@bol.ad" className="hover:text-foreground transition-colors">support@bol.ad</a></p>
            <p className="mt-2">
              <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a> • © 2025 Bol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 