
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, FileText, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/bffc16a0-a627-446a-bf2b-ff86182ebeea.png" alt="Bol Logo" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold text-amber-800">bol</span>
          </div>
          <div className="hidden sm:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#why" className="hover:text-foreground transition-colors">Why Bol</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-foreground transition-colors">FAQs</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-amber-800 mb-6">
            Teach your kids Hindi.<br />
            <span className="text-amber-700">Without nagging.</span>
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl text-amber-700 mb-8">
            <p>Daily 1-on-1 calls. No apps. No worksheets.</p>
            <p>Just one slightly pushy desi sheep.</p>
            <p className="font-bold text-amber-800 text-2xl">$4/week. Cancel anytime.</p>
          </div>

          <div className="mb-12">
            <Button 
              onClick={handleStartNow}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-6 h-6 mr-3" />
              START NOW! 🚀
            </Button>
            <p className="text-sm text-amber-600 mt-4 max-w-md mx-auto">
              By clicking Start Now, you consent to the{' '}
              <Link to="/terms-of-service" className="text-orange-600 hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" className="text-orange-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 border-4 border-orange-200 shadow-2xl">
              <img 
                src="/lovable-uploads/b0e951c1-f59e-468b-afbb-83bef5734b90.png" 
                alt="Learning character with headphones" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Bol Works */}
      <section id="why" className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-amber-800">
          Why Bol Works
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { 
              title: "Made for ABCDs", 
              desc: "Built by and for American-born confused desis",
              icon: "🇮🇳"
            },
            { 
              title: "Real Hindi conversations", 
              desc: "No boring flashcards or grammar drills",
              icon: "🗣️"
            },
            { 
              title: "Daily calls = real fluency", 
              desc: "Consistent practice builds lasting skills",
              icon: "📞"
            },
            { 
              title: "Talk to dadi without Google Translate", 
              desc: "Connect with family in their language",
              icon: "👵🏽"
            }
          ].map((item, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm p-6 text-center border-2 border-orange-200 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-amber-800 mb-3">{item.title}</h3>
              <p className="text-amber-700 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-8">💸 Simple Pricing</h2>
        
        <div className="inline-block">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 p-10 border-4 border-orange-300 rounded-3xl shadow-2xl">
            <div className="text-6xl font-black text-amber-800 mb-4">
              $4<span className="text-3xl text-amber-700">/week</span>
            </div>
            <ul className="text-lg text-amber-700 space-y-3 font-semibold">
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
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-amber-800">
          How Bol Works
        </h2>
        
        {/* Process Flow */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300">
                <span className="text-2xl">✅</span>
              </div>
              <p className="font-bold text-amber-800">Sign up</p>
            </div>
            <div className="text-orange-400 text-2xl">→</div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300">
                <span className="text-2xl">🐏</span>
              </div>
              <p className="font-bold text-amber-800">Get a call<br />every day</p>
            </div>
            <div className="text-orange-400 text-2xl">→</div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-3 border-3 border-orange-300">
                <span className="text-2xl">🗣️</span>
              </div>
              <p className="font-bold text-amber-800">Speak<br />confidently</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm p-8 border-2 border-orange-200 rounded-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-3">Daily Progress Reports</h3>
            <p className="text-amber-700">
              Get detailed reports after each call. Track your child's vocabulary growth, 
              pronunciation improvements, and conversation confidence.
            </p>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm p-8 border-2 border-orange-200 rounded-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-3">Scenario-Based Learning</h3>
            <p className="text-amber-700">
              Real-life situations like ordering food, asking for directions, or talking to relatives. 
              We don't teach grammar—we teach you to navigate conversations that actually matter.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-amber-800">
          What Desi Parents Say 🇮🇳
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-amber-700" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % totalSlides)}
              className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition-all duration-300"
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
                        className="flex-1 max-w-sm p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl"
                      >
                        <div className="text-2xl mb-3">💬</div>
                        <blockquote className="text-sm text-amber-800 mb-4 italic">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <cite className="text-sm text-amber-700 font-semibold">— {testimonial.author}</cite>
                          <p className="text-xs text-amber-600">{testimonial.role}</p>
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
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-amber-800">
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
            <Card key={index} className="bg-white/80 backdrop-blur-sm p-6 border-2 border-orange-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{faq.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-amber-800 mb-2">{faq.question}</h3>
                  <p className="text-amber-700">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center border-t border-orange-200 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img src="/lovable-uploads/bffc16a0-a627-446a-bf2b-ff86182ebeea.png" alt="Bol Logo" className="h-8 w-8 object-contain" />
            <h3 className="text-2xl font-bold text-amber-800">bol</h3>
          </div>
          <div className="text-amber-700 space-y-2">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
          </div>
          <div className="pt-4 border-t border-orange-200 text-sm text-amber-600">
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
