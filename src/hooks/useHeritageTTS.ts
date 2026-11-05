// src/hooks/useHeritageTTS.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface ActiveVoiceTrack {
  id: string;
  title: string;
  role: string;
  transcript: string;
}

export function useHeritageTTS() {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsLang, setTtsLang] = useState<"vi" | "en">("vi");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, forceLang?: "vi" | "en") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      const targetLang = forceLang || ttsLang;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const langLocale = targetLang === "vi" ? "vi-VN" : "en-US";
      utterance.lang = langLocale;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Tìm giọng đọc phù hợp nhất với ngôn ngữ đã chọn
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().includes(targetLang === "vi" ? "vi" : "en-us")) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [ttsLang, voices]
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    ttsLang,
    setTtsLang,
    speak,
    stop,
  };
}
