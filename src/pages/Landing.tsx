
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, FileText, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/WelcomeScreen";

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  
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
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleStartNow = () => {
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    // This will be handled by WelcomeScreen component
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-visible">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-8 h-8 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-10 h-10 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-10 w-7 h-7 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-wiggle">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <div className="hidden sm:flex items-center space-x-8 text-sm font-bold text-amber-800">
            <a href="#why" className="hover:text-orange-600 transition-colors hover:scale-110 transform duration-200">Why Bol</a>
            <a href="#pricing" className="hover:text-orange-600 transition-colors hover:scale-110 transform duration-200">Pricing</a>
            <a href="#faqs" className="hover:text-orange-600 transition-colors hover:scale-110 transform duration-200">FAQs</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-amber-800 mb-6 animate-bounce">
            Teach your kids Hindi.<br />
            <span className="text-orange-600 animate-pulse">Without nagging.</span>
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl text-amber-700 mb-8 animate-fade-in">
            <p className="font-bold">Daily 1-on-1 calls. No apps. No worksheets.</p>
            <p className="font-bold">Just one slightly pushy desi sheep.</p>
            <p className="font-black text-orange-700 text-2xl animate-pulse">$4/week. Cancel anytime.</p>
          </div>

          <div className="mb-12">
            <Button 
              onClick={handleStartNow}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 animate-pulse border-4 border-orange-600"
            >
              <Phone className="w-6 h-6 mr-3 animate-bounce" />
              START NOW! 🚀
            </Button>
            <p className="text-sm text-amber-600 mt-4 max-w-md mx-auto">
              By clicking Start Now, you consent to the{' '}
              <Link to="/terms-of-service" className="text-orange-600 hover:underline font-bold">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" className="text-orange-600 hover:underline font-bold">Privacy Policy</Link>.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 border-4 border-orange-200 shadow-2xl hover:scale-105 transition-transform duration-300 animate-float">
              <img 
                src="/lovable-uploads/b0e951c1-f59e-468b-afbb-83bef5734b90.png" 
                alt="Learning character with headphones" 
                className="w-full h-auto object-contain animate-wiggle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Bol Works */}
      <section id="why" className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-amber-800 animate-bounce">
          Why Bol Works
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto overflow-visible">
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
            <Card key={index} className="bg-white/80 backdrop-blur-sm p-6 text-center border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-2 transform hover-safe overflow-visible group">
              <div className="mb-4 flex justify-center">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-20 h-20 object-contain animate-bounce group-hover:animate-spin transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              </div>
              <h3 className="text-lg font-black text-amber-800 mb-3">{item.title}</h3>
              <p className="text-amber-700 text-sm font-bold">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-amber-800 mb-8 animate-wiggle">💸 Simple Pricing</h2>
        
        <div className="inline-block">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 p-10 border-4 border-orange-300 rounded-3xl shadow-2xl hover:scale-110 hover:rotate-3 transition-all duration-300 transform">
            <div className="text-6xl font-black text-amber-800 mb-4 animate-pulse">
              $4<span className="text-3xl text-amber-700">/week</span>
            </div>
            <ul className="text-lg text-amber-700 space-y-3 font-bold">
              <li className="flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}>
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Daily 1-on-1 calls 📞
              </li>
              <li className="flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                No tech headaches 🤯
              </li>
              <li className="flex items-center justify-center animate-bounce" style={{ animationDelay: '0.4s' }}>
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Cancel anytime ✨
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-amber-800 animate-bounce">
          How Bol Works
        </h2>
        
        {/* Process Flow */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center items-center space-x-8 mb-8 overflow-visible">
            <div className="text-center animate-bounce" style={{ animationDelay: '0s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300 hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
              <p className="font-black text-amber-800">Sign up</p>
            </div>
            <div className="text-orange-400 text-2xl animate-pulse">→</div>
            <div className="text-center animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300 hover:scale-110 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/540d4461-c8f0-47eb-b512-91bee9ecf029.png" 
                  alt="Get calls" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="font-black text-amber-800">Get a call<br />every day</p>
            </div>
            <div className="text-orange-400 text-2xl animate-pulse">→</div>
            <div className="text-center animate-bounce" style={{ animationDelay: '1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300 hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🗣️</span>
              </div>
              <p className="font-black text-amber-800">Speak<br />confidently</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto overflow-visible">
          <Card className="bg-white/80 backdrop-blur-sm p-8 border-4 border-orange-200 rounded-3xl hover:scale-110 hover:rotate-2 transition-all duration-300 transform hover-safe overflow-visible group">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/2759d760-66ad-49a1-b514-506532516fda.png" 
                alt="Daily Progress Reports"
                className="w-16 h-16 object-contain animate-bounce group-hover:animate-spin"
              />
            </div>
            <h3 className="text-xl font-black text-amber-800 mb-3">Daily Progress Reports</h3>
            <p className="text-amber-700 font-bold">
              Get detailed reports after each call. Track your child's vocabulary growth, 
              pronunciation improvements, and conversation confidence.
            </p>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm p-8 border-4 border-orange-200 rounded-3xl hover:scale-110 hover:rotate-2 transition-all duration-300 transform hover-safe overflow-visible group">
            <div className="w-16 h-16 mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/3fba8058-0143-452a-823e-e925bb333097.png" 
                alt="Scenario-Based Learning"
                className="w-16 h-16 object-contain animate-bounce group-hover:animate-spin"
              />
            </div>
            <h3 className="text-xl font-black text-amber-800 mb-3">Scenario-Based Learning</h3>
            <p className="text-amber-700 font-bold">
              Real-life situations like ordering food, asking for directions, or talking to relatives. 
              We don't teach grammar—we teach you to navigate conversations that actually matter.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-amber-800 animate-wiggle">
          What Devi Parents Say 🇮🇳
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-amber-700" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % totalSlides)}
              className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-amber-700" />
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
                        className="flex-1 max-w-sm p-6 bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-2xl hover:scale-105 hover:rotate-1 transition-all duration-300 transform"
                      >
                        <div className="text-2xl mb-3 animate-bounce">💬</div>
                        <blockquote className="text-sm text-amber-800 mb-4 italic font-bold">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <cite className="text-sm text-amber-700 font-black">— {testimonial.author}</cite>
                          <p className="text-xs text-amber-600 font-bold">{testimonial.role}</p>
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
      <section id="faqs" className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-amber-800 animate-bounce">
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
            <Card key={index} className="bg-white/80 backdrop-blur-sm p-6 border-4 border-orange-200 rounded-2xl hover:scale-105 hover:rotate-1 transition-all duration-300 transform">
              <div className="flex items-start gap-4">
                <div className="text-2xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>{faq.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-amber-800 mb-2">{faq.question}</h3>
                  <p className="text-amber-700 font-bold">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center border-t border-orange-200 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 animate-wiggle">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <div className="text-amber-700 space-y-2 font-bold">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
          </div>
          <div className="pt-4 border-t border-orange-200 text-sm text-amber-600 font-bold">
            <p>📩 <a href="mailto:support@bol.ad" className="hover:text-amber-800 transition-colors">support@bol.ad</a></p>
            <p className="mt-2">
              <a href="/privacy-policy" className="hover:text-amber-800 transition-colors">Privacy Policy</a> • © 2025 Bol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
