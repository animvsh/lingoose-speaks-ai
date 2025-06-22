
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Phone, User, ArrowLeft } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        toast({
          title: "❌ Missing Information",
          description: "Please enter both email and password.",
          variant: "destructive",
          className: "border-2 border-red-400 bg-red-50 text-red-800",
        });
        return;
      }

      if (!isLogin && (!fullName.trim() || !phoneNumber.trim())) {
        toast({
          title: "❌ Missing Information",
          description: "Please enter your full name and phone number.",
          variant: "destructive",
          className: "border-2 border-red-400 bg-red-50 text-red-800",
        });
        return;
      }

      // Clean up existing state before authentication
      cleanupAuthState();
      
      // Attempt global sign out before new authentication
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Cleanup sign out failed, continuing...', err);
      }

      const redirectUrl = `${window.location.origin}/`;

      if (isLogin) {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully signed in to Lingoose!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      } else {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              phone_number: phoneNumber
            }
          }
        });

        if (error) throw error;

        toast({
          title: "🎉 Account Created!",
          description: "Welcome to Lingoose! Please check your email to verify your account.",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      }

      // Force page reload after successful auth
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "❌ Authentication Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authMethod === "phone") {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <DuckMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
            <h1 className="text-4xl font-black text-orange-600 mb-2 uppercase tracking-wider transform -rotate-1">
              Lingoose
            </h1>
            <p className="text-slate-700 font-bold">Your AI Hindi Learning Companion</p>
          </div>
          
          <PhoneAuthForm onBack={() => setAuthMethod("email")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DuckMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
          <h1 className="text-4xl font-black text-orange-600 mb-2 uppercase tracking-wider transform -rotate-1">
            Lingoose
          </h1>
          <p className="text-slate-700 font-bold">Your AI Hindi Learning Companion</p>
        </div>

        <Card className="border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center justify-center gap-2">
              <User className="w-6 h-6" />
              {isLogin ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-slate-600 font-bold">
              {isLogin 
                ? "Enter your credentials to continue" 
                : "Create your account to get started"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Auth Method Selection */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={authMethod === "email" ? "default" : "outline"}
                onClick={() => setAuthMethod("email")}
                className="flex-1 font-bold"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={authMethod === "phone" ? "default" : "outline"}
                onClick={() => setAuthMethod("phone")}
                className="flex-1 font-bold"
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
              >
                {isLoading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-600 hover:text-slate-800 font-bold"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
