import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  login: (userProfile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackEvent, identifyUser } = useAnalytics();

  useEffect(() => {
    const storedProfile = localStorage.getItem('current_user_profile');
    const phoneAuthenticated = localStorage.getItem('phone_authenticated');

    if (storedProfile && phoneAuthenticated === 'true') {
      const userProfile = JSON.parse(storedProfile) as UserProfile;
      setUser(userProfile);
    }

    setLoading(false);
  }, []);

  const login = (userProfile: UserProfile) => {
    setUser(userProfile);
    localStorage.setItem('current_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('phone_authenticated', 'true');
    
    // Track login event
    trackEvent('user_login', {
      user_id: userProfile.id,
      phone_number: userProfile.phone_number,
      language: userProfile.language
    });
    
    // Identify user for PostHog
    identifyUser(userProfile.id, {
      phone_number: userProfile.phone_number,
      full_name: userProfile.full_name,
      language: userProfile.language
    });
  };

  const logout = () => {
    if (user) {
      trackEvent('user_logout', {
        user_id: user.id
      });
    }
    
    setUser(null);
    localStorage.removeItem('current_user_profile');
    localStorage.removeItem('phone_authenticated');
    localStorage.removeItem('phone_number');
  };

  const value: AuthContextProps = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
