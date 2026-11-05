// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "The Legacy Keepers | Người Gìn Giữ Di Sản",
  description:
    "Hành trình định vị thế giới thực, giải mã biên niên sử và tri ân nhân chứng lịch sử Việt Nam.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F4EFE6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased bg-[#F4EFE6] text-[#2B2118] selection:bg-[#8B1E1E] selection:text-[#FAF6EE]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
