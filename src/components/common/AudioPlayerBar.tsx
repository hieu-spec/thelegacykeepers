// src/components/common/AudioPlayerBar.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronDown, Radio, X, UploadCloud } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface AudioPlayerBarProps {
  title?: string;
  speaker?: string;
  textScript?: string;
  uploadedAudioUrl?: string; // Nếu Admin đã tải file MP3/WAV lên thì ưu tiên phát file này
  onClose?: () => void;
}

export function AudioPlayerBar({
  title: propTitle,
  speaker: propSpeaker,
  textScript: propTextScript,
  uploadedAudioUrl: propUploadedAudioUrl,
  onClose: propOnClose,
}: AudioPlayerBarProps = {}) {
  const { selectedLocation, userLocation, currentGps, locations } = useApp();

  const [activeLoc, setActiveLoc] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triggeredIdsRef = useRef<Set<string>>(new Set());

  // Derive active data from props or context
  const title = propTitle || activeLoc?.name || selectedLocation?.name || '';
  const speaker =
    propSpeaker ||
    activeLoc?.witnessStory?.witnessName ||
    activeLoc?.witnessStory?.speakerName ||
    selectedLocation?.witnessStory?.witnessName ||
    selectedLocation?.witnessStory?.speakerName ||
    'Tư liệu Lịch sử';
  const textScript =
    propTextScript ||
    activeLoc?.witnessStory?.quote ||
    activeLoc?.historicalSummary ||
    activeLoc?.content ||
    activeLoc?.description ||
    selectedLocation?.witnessStory?.quote ||
    selectedLocation?.historicalSummary ||
    selectedLocation?.description ||
    '';
  const uploadedAudioUrl =
    propUploadedAudioUrl ||
    activeLoc?.audioUrl ||
    activeLoc?.witnessStory?.audioUrl ||
    selectedLocation?.audioUrl ||
    (selectedLocation?.witnessStory as any)?.audioUrl ||
    '';

  // Proximity auto-trigger (Haversine formula)
  const activePosition = userLocation || currentGps;
  useEffect(() => {
    if (!activePosition || !locations?.length) return;

    for (const loc of locations) {
      const lat = (loc as any).coordinates?.lat ?? (loc as any).lat;
      const lng = (loc as any).coordinates?.lng ?? (loc as any).lng;
      if (!lat || !lng) continue;

      const R = 6371e3;
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRad(lat - activePosition.lat);
      const dLng = toRad(lng - activePosition.lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(activePosition.lat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const triggerRadius = (loc as any).interactionRadius || 120;

      if (dist <= triggerRadius && !triggeredIdsRef.current.has(loc.id)) {
        triggeredIdsRef.current.add(loc.id);
        setActiveLoc(loc);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([150, 80, 200]);
          } catch {}
        }
        break;
      }
    }
  }, [activePosition, locations]);

  // Sync when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && selectedLocation.id !== activeLoc?.id) {
      setActiveLoc(selectedLocation);
    }
  }, [selectedLocation]);

  // Chia câu chuyện dài thành các câu nhỏ (< 180 ký tự) để đọc TTS tiếng Việt mượt mà
  const sentences = useMemo(() => {
    if (!textScript) return ['Đang kết nối tần số ký ức di sản Việt Nam.'];
    return textScript
      .split(/(?<=[.!?])\s+/)
      .flatMap((sentence: string) => {
        if (sentence.length <= 180) return [sentence];
        return sentence.match(/.{1,180}(\s|$)/g) || [sentence];
      })
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [textScript]);

  useEffect(() => {
    // Khởi tạo lại khi đổi bài/đổi di tích
    stopPlayback();
    setCurrentChunkIndex(0);
    return () => stopPlayback();
  }, [title, uploadedAudioUrl, textScript]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const playChunk = async (index: number) => {
    if (index >= sentences.length) {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
      return;
    }

    const chunkText = sentences[index];

    // 1. Nếu có file Audio do Admin tải lên -> Phát trực tiếp file đó
    if (uploadedAudioUrl && audioRef.current) {
      audioRef.current.src = uploadedAudioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.muted = isMuted;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.warn('Audio play failed:', e);
      }
      return;
    }

    // 2. Phát qua API Giọng đọc Tiếng Việt (/api/tts)
    try {
      if (audioRef.current) {
        audioRef.current.src = `/api/tts?text=${encodeURIComponent(chunkText)}`;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.muted = isMuted;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      // 3. Fallback: Nếu mất mạng, ép giọng 'vi-VN' trên trình duyệt
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = 'vi-VN';
        utterance.rate = playbackSpeed;
        const voices = window.speechSynthesis.getVoices();
        const vnVoice = voices.find(
          (v) => v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('viet')
        );
        if (vnVoice) utterance.voice = vnVoice;
        utterance.onend = () => {
          setCurrentChunkIndex((prev) => {
            const next = prev + 1;
            playChunk(next);
            return next;
          });
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playChunk(currentChunkIndex);
    }
  };

  const handleAudioEnded = () => {
    if (uploadedAudioUrl) {
      setIsPlaying(false);
      return;
    }
    const nextIndex = currentChunkIndex + 1;
    if (nextIndex < sentences.length) {
      setCurrentChunkIndex(nextIndex);
      playChunk(nextIndex);
    } else {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
    }
  };

  const handleClose = () => {
    stopPlayback();
    setActiveLoc(null);
    if (propOnClose) propOnClose();
  };

  // If no location or script is available, don't show
  if (!title && !textScript) return null;

  // Chế độ thu gọn góc phải dưới để không che khuất danh sách Nhiệm Vụ Sự Kiện
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[600] flex items-center gap-3 bg-[#0B1320]/95 border border-amber-500/60 rounded-full px-4 py-2.5 shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md">
        <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <div className="max-w-[160px] cursor-pointer" onClick={() => setIsMinimized(false)}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {uploadedAudioUrl ? 'Băng Ghi Âm Gốc' : 'Tần Số Ký Ức (VI-VN)'}
          </p>
          <p className="text-xs font-semibold text-white truncate">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[600] w-[92%] max-w-xl bg-[#0F192A]/95 border border-amber-500/50 rounded-2xl p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

      {/* Thanh hiệu ứng sóng âm trên đỉnh */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 opacity-80" />

      <div className="flex items-center justify-between gap-4">
        {/* Thông tin bài đọc */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Radio size={20} className={isPlaying ? 'animate-pulse text-emerald-400' : ''} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ● TẦN SỐ KÝ ỨC
              </span>
              <span className="text-[11px] text-slate-400 truncate">• {speaker}</span>
              {uploadedAudioUrl && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <UploadCloud size={10} /> Voice Gốc
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white truncate">{title}</h4>
          </div>
        </div>

        {/* Cụm nút điều khiển */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition active:scale-95"
            title={isPlaying ? 'Tạm dừng' : 'Phát thuyết minh'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setCurrentChunkIndex(0);
              playChunk(0);
            }}
            className="p-2 text-slate-400 hover:text-white transition"
            title="Đọc lại từ đầu"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => {
              const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 0.9 : 1;
              setPlaybackSpeed(nextSpeed);
              if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
            }}
            className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-amber-400 border border-slate-700"
            title="Tốc độ đọc"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (audioRef.current) audioRef.current.muted = !isMuted;
            }}
            className="p-2 text-slate-400 hover:text-white transition"
            title={isMuted ? 'Bật âm' : 'Tắt âm'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-slate-400 hover:text-amber-400 transition"
            title="Thu gọn thanh âm thanh"
          >
            <ChevronDown size={18} />
          </button>

          <button onClick={handleClose} className="p-1.5 text-slate-500 hover:text-red-400 transition" title="Đóng">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayerBar;
