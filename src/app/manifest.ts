// src/app/manifest.ts
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Legacy Keepers - Người Gìn Giữ Di Sản',
    short_name: 'Di Sản Việt',
    description: 'Khám phá di tích lịch sử bằng bản đồ vệ tinh, AR và ký ức nhân chứng sống.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070C15',
    theme_color: '#070C15',
    icons: [
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
