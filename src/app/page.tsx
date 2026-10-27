// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MobileHeritageShell } from '@/components/mobile/MobileHeritageShell';
import { PCCommandCenter } from '@/components/desktop/PCCommandCenter';
import { LoginScreen } from '@/components/auth/LoginScreen';

export default function HomePage() {
  const { isAuthenticated, desktopViewMode, setDesktopViewMode } = useApp();
  const [forceMobileSimOnPC, setForceMobileSimOnPC] = useState(false);
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

  const isShowingMobileSimOnPC = forceMobileSimOnPC || desktopViewMode === 'mobile_simulator';

  return (
    <>
      {/* Trên điện thoại & máy tính bảng (< 1024px): Hiển thị trực tiếp MobileHeritageShell full-screen */}
      <div className="block lg:hidden w-full h-[100dvh]">
        <MobileHeritageShell isSimulatorFrame={false} />
      </div>

      {/* Trên màn hình lớn PC (>= 1024px): Cho phép chuyển đổi mượt giữa PC Command Center và Khung iPhone 16 Pro Giả lập */}
      <div className="hidden lg:block w-full min-h-screen">
        {isShowingMobileSimOnPC ? (
          <MobileHeritageShell
            isSimulatorFrame={true}
            onExitSimulator={() => {
              setForceMobileSimOnPC(false);
              setDesktopViewMode('dashboard');
            }}
          />
        ) : (
          <PCCommandCenter
            onOpenMobileSimulator={() => {
              setForceMobileSimOnPC(true);
              setDesktopViewMode('mobile_simulator');
            }}
          />
        )}
      </div>
    </>
  );
}
