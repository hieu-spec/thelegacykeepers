// src/utils/iosBridge.ts
'use client';

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isRunningStandaloneIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    ('standalone' in window.navigator && (window.navigator as any).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

/**
 * Kích hoạt rung phản hồi Taptic Engine trên iPhone (Hỗ trợ cả iOS Safari 17.4+ & Capacitor)
 */
export function triggerIOSHaptic(style: 'light' | 'medium' | 'heavy' = 'medium'): void {
  if (typeof window === 'undefined') return;

  // 1. Nếu chạy trong Capacitor Native iOS
  const capHaptics = (window as any)?.Capacitor?.Plugins?.Haptics;
  if (capHaptics) {
    capHaptics.impact({ style: style.toUpperCase() }).catch(() => {});
    return;
  }

  // 2. Nếu chạy trên Android
  if (navigator.vibrate) {
    navigator.vibrate(style === 'heavy' ? 60 : 25);
    return;
  }

  // 3. Mẹo kích hoạt Taptic Engine thật trên iOS 17.4+ / iOS 18 WebKit
  try {
    const label = document.createElement('label');
    label.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    label.appendChild(input);
    document.body.appendChild(label);
    label.click();
    document.body.removeChild(label);
  } catch {
    // Bỏ qua nếu iOS đời cũ
  }
}

/**
 * Mở khóa (Unlock) Audio & SpeechSynthesis trên iOS Safari/WebView
 * Bắt buộc gọi hàm này trong sự kiện onClick đầu tiên của người dùng
 */
let iosAudioUnlocked = false;
let sharedIOSAudioElement: HTMLAudioElement | null = null;

export function getSharedIOSAudio(): HTMLAudioElement {
  if (!sharedIOSAudioElement && typeof window !== 'undefined') {
    sharedIOSAudioElement = new Audio();
    sharedIOSAudioElement.setAttribute('playsinline', 'true');
    sharedIOSAudioElement.preload = 'auto';
  }
  return sharedIOSAudioElement!;
}

export function unlockIOSAudioAndTTS(): void {
  if (iosAudioUnlocked || typeof window === 'undefined') return;

  try {
    // Mở khóa thẻ Audio dùng chung bằng 1 file WAV câm siêu ngắn
    const audio = getSharedIOSAudio();
    audio.src =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        iosAudioUnlocked = true;
      })
      .catch(() => {});

    // Mở khóa bộ đọc giọng nói có sẵn của iOS (SpeechSynthesis)
    if ('speechSynthesis' in window) {
      const silentUtterance = new SpeechSynthesisUtterance('');
      silentUtterance.volume = 0;
      silentUtterance.lang = 'vi-VN';
      window.speechSynthesis.speak(silentUtterance);
    }
  } catch {}
}

/**
 * Xin cấp quyền đồng loạt cho iPhone: La bàn AR + Định vị GPS
 */
export async function requestAllIOSPermissions(): Promise<{
  compass: boolean;
  gps: boolean;
}> {
  unlockIOSAudioAndTTS();
  triggerIOSHaptic('medium');

  let compassGranted = true;
  let gpsGranted = false;

  // 1. Xin quyền cảm biến La bàn trên iOS 13+
  const DeviceOrientation = (typeof window !== 'undefined' ? (window as any).DeviceOrientationEvent : undefined) as
    | { requestPermission?: () => Promise<'granted' | 'denied'> }
    | undefined;
  if (typeof DeviceOrientation?.requestPermission === 'function') {
    try {
      const state = await DeviceOrientation.requestPermission();
      compassGranted = state === 'granted';
    } catch {
      compassGranted = false;
    }
  }

  // 2. Xin quyền GPS
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    gpsGranted = await new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }

  return { compass: compassGranted, gps: gpsGranted };
}
