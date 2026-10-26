import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Cinzel } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B1320',
};

export const metadata: Metadata = {
  title: 'The Legacy Keepers · Người Gìn Giữ Di Sản',
  description:
    'Ứng dụng mobile-first khám phá lịch sử Việt Nam qua định vị GPS kết hợp minigame Mảnh ghép Lịch sử và sưu tầm huy hiệu danh dự.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="bg-[#05080E] text-slate-100 min-h-screen antialiased overflow-hidden">
          <AppProvider>{children}</AppProvider>
        </div>
      </body>
    </html>
  );
}
