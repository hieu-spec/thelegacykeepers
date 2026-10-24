'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { RadarScanner } from '@/components/radar/RadarScanner';
import { MinigameView } from '@/components/minigame/MinigameView';
import { ProfileView } from '@/components/profile/ProfileView';
import { LoginScreen } from '@/components/auth/LoginScreen';

export default function Home() {
  const { currentTab, isAuthenticated } = useApp();

  return (
    <MobileContainer>
      {!isAuthenticated ? (
        <LoginScreen />
      ) : (
        <>
          {currentTab === 'radar' && <RadarScanner />}
          {currentTab === 'minigame' && <MinigameView />}
          {currentTab === 'profile' && <ProfileView />}
        </>
      )}
    </MobileContainer>
  );
}
