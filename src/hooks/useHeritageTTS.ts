// src/hooks/useHeritageTTS.ts
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { getSharedIOSAudio, unlockIOSAudioAndTTS, triggerIOSHaptic } from '@/utils/iosBridge';

export interface ActiveVoiceTrack {
  id: string;
  title: string;
  role: string;
  transcript: string;
}

function splitChunks(text: string, maxLen = 160): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    if ((current + s).length <= maxLen) {
      current += s;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export function useHeritageTTS() {
  const [activeTrack, setActiveTrack] = useState<ActiveVoiceTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef<number>(0);
  const usingNativeSiriRef = useRef<boolean>(false);

  const stopAll = useCallback(() => {
    const audio = getSharedIOSAudio();
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  // Giọng đọc Siri Tiếng Việt (Linh Đan / Mặc định trên iOS)
  const speakWithIOSNativeVoice = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    usingNativeSiriRef.current = true;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.toLowerCase().includes('vi'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const playChunkAt = useCallback(
    (idx: number, fullFallbackText: string) => {
      if (idx >= chunksRef.current.length) {
        setIsPlaying(false);
        return;
      }

      const chunk = chunksRef.current[idx];
      const audio = getSharedIOSAudio();

      audio.src = `/api/tts?text=${encodeURIComponent(chunk)}&lang=vi`;
      audio.onended = () => {
        indexRef.current = idx + 1;
        playChunkAt(idx + 1, fullFallbackText);
      };
      audio.onerror = () => {
        speakWithIOSNativeVoice(fullFallbackText);
      };

      usingNativeSiriRef.current = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Nếu Safari chặn stream -> gọi ngay giọng Siri Tiếng Việt nội bộ
            speakWithIOSNativeVoice(fullFallbackText);
          });
      }
    },
    [speakWithIOSNativeVoice]
  );

  // Hàm này được gọi trực tiếp từ sự kiện onClick của nút bấm trên iPhone
  const speakTrack = useCallback(
    (track: ActiveVoiceTrack) => {
      unlockIOSAudioAndTTS();
      triggerIOSHaptic('light');
      stopAll();

      setActiveTrack(track);
      chunksRef.current = splitChunks(track.transcript);
      indexRef.current = 0;
      playChunkAt(0, track.transcript);
    },
    [playChunkAt, stopAll]
  );

  const togglePlayPause = useCallback(() => {
    triggerIOSHaptic('light');
    if (!activeTrack) return;

    const audio = getSharedIOSAudio();
    if (isPlaying) {
      if (usingNativeSiriRef.current && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        audio.pause();
      }
      setIsPlaying(false);
    } else {
      if (usingNativeSiriRef.current) {
        speakWithIOSNativeVoice(activeTrack.transcript);
      } else {
        audio.play().catch(() => speakWithIOSNativeVoice(activeTrack.transcript));
        setIsPlaying(true);
      }
    }
  }, [activeTrack, isPlaying, speakWithIOSNativeVoice]);

  const closeTrack = useCallback(() => {
    triggerIOSHaptic('light');
    stopAll();
    setActiveTrack(null);
  }, [stopAll]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    return () => stopAll();
  }, [stopAll]);

  return { activeTrack, isPlaying, speakTrack, togglePlayPause, closeTrack };
}
