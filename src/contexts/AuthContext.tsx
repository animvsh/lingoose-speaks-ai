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
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create context with proper error handling
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

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        console.log('AuthProvider: Restoring session from localStorage...');
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser && mounted) {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthProvider: Found stored user:', parsedUser);
          setUser(parsedUser);
          
          await logSecurityEvent('session_restored', parsedUser.phone_number, {
            user_id: parsedUser.id,
            restored_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('AuthProvider: Error restoring session:', error);
        localStorage.removeItem('currentUser');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('AuthProvider: Starting signOut process...');
      
      if (user) {
        await logSecurityEvent('logout', user.phone_number, {
          user_id: user.id,
          logout_time: new Date().toISOString()
        });
      }

      // Clear local storage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      
      // Clear any onboarding state
      if (user) {
        localStorage.removeItem(`onboarding_complete_${user.id}`);
      }
      
      // Update state
      setUser(null);
      
      console.log('AuthProvider: SignOut completed successfully');
      
      // Navigate to landing page
      window.location.href = '/';
      
    } catch (error) {
      console.error('AuthProvider: Error during signOut:', error);
      
      // Force clear everything on error
      localStorage.clear();
      setUser(null);
      window.location.href = '/';
      
      toast({
        title: "Error signing out",
        description: "There was an issue signing out. You have been logged out anyway.",
        variant: "destructive",
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    session: user, // Keep for compatibility
    loading,
    signOut,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};