
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const logSecurityEvent = async (action: string, phoneNumber?: string, details: any = {}) => {
  try {
    // Use untyped insert to bypass TypeScript checks for security_audit_logs table
    await (supabase as any).from('security_audit_logs').insert({
      phone_number: phoneNumber || null,
      action,
      details,
      ip_address: null,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to refresh user from localStorage
  const refreshUserFromStorage = () => {
    console.log('🔄 refreshUserFromStorage called');
    const userProfile = localStorage.getItem('current_user_profile');
    const needsOnboarding = localStorage.getItem('needs_onboarding');
    
    console.log('📝 localStorage values:', {
      userProfile: userProfile ? 'EXISTS' : 'NULL',
      needsOnboarding,
      pathname: window.location.pathname
    });
    
    if (userProfile && needsOnboarding !== 'true') {
      try {
        const profile = JSON.parse(userProfile);
        setUser(profile);
        console.log('✅ User profile refreshed from storage:', profile.phone_number);
        
        // Don't redirect here - let individual pages handle their own redirects
        // This prevents jarring page reloads
      } catch (error) {
        console.error('❌ Error parsing stored user profile:', error);
        setUser(null);
      }
    } else {
      console.log('⚠️ Profile not complete - staying on current page');
      setUser(null);
    }
  };

  useEffect(() => {
    // Check if user is authenticated via phone
    const isAuthenticated = localStorage.getItem('phone_authenticated');
    const userProfile = localStorage.getItem('current_user_profile');
    const needsOnboarding = localStorage.getItem('needs_onboarding');
    
    if (isAuthenticated === 'true') {
      if (userProfile && needsOnboarding !== 'true') {
        // Existing user with complete profile
        try {
          const profile = JSON.parse(userProfile);
          setUser(profile);
          console.log('Restored user session:', profile.phone_number);
          
          // Log session restoration
          logSecurityEvent('user_session_restored', profile.phone_number, {
            user_id: profile.id,
            full_name: profile.full_name,
            language: profile.language
          });
          
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

          // Don't redirect here - let components handle their own navigation
          // This prevents jarring page reloads during authentication
        } catch (error) {
          console.error('Error parsing stored user profile:', error);
          
          // Log suspicious activity
          logSecurityEvent('session_restoration_failed', undefined, {
            error: 'Invalid stored user profile data',
            error_details: error instanceof Error ? error.message : 'Unknown error'
          });
          
          // Clear invalid data
          localStorage.removeItem('phone_authenticated');
          localStorage.removeItem('current_user_profile');
          localStorage.removeItem('phone_number');
          localStorage.removeItem('needs_onboarding');
        }
      } else if (needsOnboarding === 'true') {
        // New user who needs onboarding - keep user as null but authenticated
        console.log('User authenticated but needs onboarding');
        
        // Don't redirect here - let components handle their own navigation
        // This prevents jarring page reloads during authentication
      }
    }
    
    setLoading(false);

    // Listen for localStorage changes within the same tab for instant state updates
    const checkForAuthChanges = () => {
      const isAuthenticated = localStorage.getItem('phone_authenticated');
      const userProfile = localStorage.getItem('current_user_profile');
      const needsOnboarding = localStorage.getItem('needs_onboarding');
      
      if (isAuthenticated === 'true' && userProfile && needsOnboarding !== 'true') {
        try {
          const profile = JSON.parse(userProfile);
          if (!user || user.phone_number !== profile.phone_number) {
            setUser(profile);
            console.log('✅ Auth state updated from localStorage change:', profile.phone_number);
          }
        } catch (error) {
          console.error('❌ Error parsing updated user profile:', error);
        }
      } else if (isAuthenticated !== 'true' && user) {
        setUser(null);
        console.log('🚪 User logged out - clearing state');
      }
    };

    // Check for changes less frequently to avoid infinite loops
    const authCheckInterval = setInterval(checkForAuthChanges, 2000);
    
    return () => clearInterval(authCheckInterval);
  }, []);

  const signOut = async () => {
    try {
      // Track sign out event
      if (user) {
        await logSecurityEvent('user_signout_attempted', user.phone_number, {
          user_id: user.id,
          full_name: user.full_name
        });
        
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
      
      await logSecurityEvent('user_signout_success', user?.phone_number);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Don't force a hard redirect - let the app handle navigation smoothly
      // The user state has been cleared, so components will react accordingly
      
    } catch (error: any) {
      console.error('Sign out failed:', error);
      
      await logSecurityEvent('user_signout_failed', user?.phone_number, {
        error: error.message
      });
      
      // Force cleanup even if there's an error
      localStorage.removeItem('phone_authenticated');
      localStorage.removeItem('current_user_profile');
      localStorage.removeItem('phone_number');
      setUser(null);
      
      // Don't force a hard redirect even on error - let components handle navigation
    }
  };

  const value = {
    user,
    session: user ? { user } : null, // Create a fake session for compatibility
    loading,
    signOut,
    refreshUser: refreshUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
