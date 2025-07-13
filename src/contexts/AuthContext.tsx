
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: any; // Keep for compatibility
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated via phone
    const isAuthenticated = localStorage.getItem('phone_authenticated');
    const userProfile = localStorage.getItem('current_user_profile');
    
    if (isAuthenticated === 'true' && userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUser(profile);
        console.log('Restored user session:', profile.phone_number);
        
        // Track user session restored
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.capture('user_session_restored', profile.id || profile.phone_number, {
                phone_number: profile.phone_number,
                full_name: profile.full_name,
                language: profile.language
              });
            }
          });
        }, 1000);

        // If user is authenticated and on landing page, redirect to app
        if (window.location.pathname === '/') {
          window.location.href = '/app';
        }
      } catch (error) {
        console.error('Error parsing stored user profile:', error);
        // Clear invalid data
        localStorage.removeItem('phone_authenticated');
        localStorage.removeItem('current_user_profile');
        localStorage.removeItem('phone_number');
      }
    }
    
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      // Track sign out event
      if (user) {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.capture('user_signed_out', user.id || user.phone_number, {
              phone_number: user.phone_number,
              full_name: user.full_name
            });
          }
        });
      }

      // Clear localStorage immediately
      localStorage.removeItem('phone_authenticated');
      localStorage.removeItem('current_user_profile');
      localStorage.removeItem('phone_number');
      
      // Clear state immediately
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Navigate to auth page properly
      window.location.href = '/auth';
      
    } catch (error: any) {
      console.error('Sign out failed:', error);
      
      // Force cleanup even if there's an error
      localStorage.removeItem('phone_authenticated');
      localStorage.removeItem('current_user_profile');
      localStorage.removeItem('phone_number');
      setUser(null);
      
      // Still redirect even on error
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session: user ? { user } : null, // Create a fake session for compatibility
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
