import React, { useState } from 'react';
import { EnhancedOnboardingFlow } from './EnhancedOnboardingFlow';
import { PostOnboardingPaywall } from './PostOnboardingPaywall';
import { useEnhancedCreateUserProfile } from '@/hooks/useEnhancedCreateUserProfile';
import LoadingOverlay from './LoadingOverlay';

interface NewUserOnboardingProps {
  onComplete: () => void;
  phoneNumber: string;
  onProfileCreated?: () => void;
}

interface OnboardingData {
  fullName: string;
  hindiProficiency: number;
  age: number;
  location: string;
  motherTongue: string;
  accountType: 'self' | 'child' | 'other';
  accountHolderName?: string;
}

export const NewUserOnboarding: React.FC<NewUserOnboardingProps> = ({
  onComplete,
  phoneNumber,
  onProfileCreated
}) => {
  const [currentPhase, setCurrentPhase] = useState<'onboarding' | 'creating-profile' | 'paywall'>('onboarding');
  const [profileData, setProfileData] = useState<OnboardingData | null>(null);

  const createProfile = useEnhancedCreateUserProfile();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setProfileData(data);
    setCurrentPhase('creating-profile');
    
    try {
      await createProfile.mutateAsync({
        phone_number: phoneNumber,
        full_name: data.fullName,
        proficiency_level: data.hindiProficiency,
        age: data.age,
        location: data.location,
        mother_tongue: data.motherTongue,
        account_type: data.accountType,
        account_holder_name: data.accountHolderName,
        language: 'hindi'
      });

      // Call the profile created callback if provided
      if (onProfileCreated) {
        onProfileCreated();
      }

      // Move to paywall phase
      setCurrentPhase('paywall');
    } catch (error) {
      console.error('Profile creation failed:', error);
      // The error toast is handled by the hook
    }
  };

  const handlePaywallComplete = () => {
    // Complete the entire onboarding flow
    onComplete();
  };

  // Phase 1: Onboarding Flow
  if (currentPhase === 'onboarding') {
    return (
      <EnhancedOnboardingFlow
        onComplete={handleOnboardingComplete}
        phoneNumber={phoneNumber}
      />
    );
  }

  // Phase 2: Creating Profile Loading
  if (currentPhase === 'creating-profile') {
    return (
      <LoadingOverlay isLoading={true} variant="gentle">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-primary">Creating your profile...</p>
            <p className="text-sm text-muted-foreground">Setting up your personalized learning experience</p>
          </div>
        </div>
      </LoadingOverlay>
    );
  }

  // Phase 3: Paywall
  return (
    <PostOnboardingPaywall
      onComplete={handlePaywallComplete}
      userName={profileData?.fullName || 'there'}
    />
  );
};