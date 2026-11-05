// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Tải bất đồng bộ tránh lỗi SSR của thư viện bản đồ Leaflet trên cả Laptop và Điện thoại
const PCCommandCenter = dynamic(() => import("@/components/pc/PCCommandCenter"), {
  ssr: false,
});
const MobileHeritageShell = dynamic(() => import("@/components/mobile/MobileHeritageShell"), {
  ssr: false,
});

export default function HomePage() {
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F4EFE6] text-[#2B2118] gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#8B1E1E] border-2 border-[#B48327] text-[#E6C786] flex items-center justify-center font-heritage font-bold text-lg animate-pulse shadow-lg">
          LK
        </div>
        <p className="font-heritage text-sm font-bold text-[#5C4938]">
          Đang mở Sổ Hộ Chiếu Di Sản...
        </p>
      </div>
    );
  }

  return isMobileViewport ? <MobileHeritageShell /> : <PCCommandCenter />;
}
