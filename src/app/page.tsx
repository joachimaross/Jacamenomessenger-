
'use client'

import { useState, useEffect } from 'react';
import Onboarding from "@/components/Onboarding";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string; livePhoto?: string } | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboarded = localStorage.getItem('jacameno_onboarded');
    if (onboarded) {
      setIsOnboarded(true);
      const profile = localStorage.getItem('jacameno_profile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    }
  }, []);

  const handleOnboardingComplete = (profile: { name: string; avatar: string; livePhoto?: string }) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    localStorage.setItem('jacameno_onboarded', 'true');
    localStorage.setItem('jacameno_profile', JSON.stringify(profile));
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MainLayout />;
}
