'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { PCCommandCenter } from '@/components/desktop/PCCommandCenter';
import { RadarScanner } from '@/components/radar/RadarScanner';
import { MinigameView } from '@/components/minigame/MinigameView';
import { ProfileView } from '@/components/profile/ProfileView';
import { LoginScreen } from '@/components/auth/LoginScreen';

export default function Home() {
  const { currentTab, isAuthenticated, desktopViewMode } = useApp();
  const [isDesktopScreen, setIsDesktopScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktopScreen(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Render Full PC Command Center on Desktop when in 'dashboard' mode
  if (isDesktopScreen && desktopViewMode === 'dashboard') {
    return <PCCommandCenter />;
  }

  // Render Mobile Viewport (Optimized 1-hand Field Experience & AR Navigation)
  return (
    <MobileContainer>
      {currentTab === 'radar' && <RadarScanner />}
      {currentTab === 'minigame' && <MinigameView />}
      {currentTab === 'profile' && <ProfileView />}
    </MobileContainer>
  );
}
