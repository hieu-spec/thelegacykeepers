// src/components/common/AudioPlayerBar.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronDown, Radio, X, UploadCloud } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateDistance } from '@/utils/geo';
import { WitnessStory } from '@/types/location';

export interface AudioPlayerBarProps {
  title?: string;
  speaker?: string;
  textScript?: string;
  uploadedAudioUrl?: string; // Nếu có file MP3/WAV gốc thì ưu tiên phát file này
  activeAudioWitness?: WitnessStory | null;
  isPlaying?: boolean;
  onClose?: () => void;
  onTogglePlay?: () => void;
}

// Chia văn bản thành các đoạn < 175 ký tự cho API TTS
function splitTextIntoChunks(text: string, maxLength = 175): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLength) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export function AudioPlayerBar({
  title: propTitle,
  speaker: propSpeaker,
  textScript: propTextScript,
  uploadedAudioUrl: propUploadedAudioUrl,
  activeAudioWitness: propActiveAudioWitness,
  isPlaying: propIsPlaying,
  onClose: propOnClose,
  onTogglePlay: propOnTogglePlay,
}: AudioPlayerBarProps = {}) {
  const {
    selectedLocation,
    userLocation,
    currentGps,
    locations,
    activeAudioWitness: contextActiveWitness,
    isPlayingAudio: contextIsPlayingAudio,
    stopAudio,
    togglePlayAudio,
  } = useApp();

  const [activeLoc, setActiveLoc] = useState<any | null>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triggeredIdsRef = useRef<Set<string>>(new Set());

  // Đồng bộ nguồn nhân chứng (prop hoặc context)
  const currentWitness = propActiveAudioWitness !== undefined ? propActiveAudioWitness : contextActiveWitness;

  // Xác định trạng thái isPlaying đồng bộ từ props hoặc context hoặc internal
  const isPlaying =
    propIsPlaying !== undefined
      ? propIsPlaying
      : contextIsPlayingAudio !== undefined
      ? contextIsPlayingAudio
      : internalIsPlaying;

  // Trích xuất metadata bài đọc
  const title =
    propTitle ||
    currentWitness?.title ||
    currentWitness?.memoryFilmTitle ||
    activeLoc?.name ||
    selectedLocation?.name ||
    '';

  const speaker =
    propSpeaker ||
    currentWitness?.speakerName ||
    currentWitness?.witnessName ||
    activeLoc?.witnessStory?.witnessName ||
    activeLoc?.witnessStory?.speakerName ||
    selectedLocation?.witnessStory?.witnessName ||
    selectedLocation?.witnessStory?.speakerName ||
    'Tư liệu Lịch sử';

  const textScript =
    propTextScript ||
    currentWitness?.fullStory ||
    currentWitness?.quote ||
    activeLoc?.witnessStory?.fullStory ||
    activeLoc?.witnessStory?.quote ||
    activeLoc?.historicalSummary ||
    activeLoc?.content ||
    selectedLocation?.witnessStory?.fullStory ||
    selectedLocation?.witnessStory?.quote ||
    selectedLocation?.historicalSummary ||
    '';

  const uploadedAudioUrl =
    propUploadedAudioUrl ||
    currentWitness?.audioUrl ||
    activeLoc?.audioUrl ||
    activeLoc?.witnessStory?.audioUrl ||
    selectedLocation?.audioUrl ||
    (selectedLocation?.witnessStory as any)?.audioUrl ||
    '';

  // Proximity auto-trigger sử dụng calculateDistance từ @/utils/geo
  const activePosition = userLocation || currentGps;
  useEffect(() => {
    if (!activePosition || !locations?.length) return;

    for (const loc of locations) {
      const lat = (loc as any).coordinates?.lat ?? (loc as any).lat;
      const lng = (loc as any).coordinates?.lng ?? (loc as any).lng;
      if (!lat || !lng) continue;

      const dist = calculateDistance(activePosition, { lat, lng });
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

  // Chia câu chuyện dài thành các câu nhỏ (< 175 ký tự) để đọc TTS mượt mà
  const sentences = useMemo(() => {
    if (!textScript) return ['Đang kết nối tần số ký ức di sản Việt Nam.'];
    return splitTextIntoChunks(textScript);
  }, [textScript]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setInternalIsPlaying(false);
    if (stopAudio) stopAudio();
  }, [stopAudio]);

  useEffect(() => {
    stopPlayback();
    setCurrentChunkIndex(0);
    return () => stopPlayback();
  }, [title, uploadedAudioUrl, textScript, stopPlayback]);

  // Rung phản hồi haptic khi kích hoạt nhân chứng mới
  useEffect(() => {
    if (currentWitness && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(100);
      } catch {}
    }
  }, [currentWitness]);

  const speakFallback = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
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
          if (next < sentences.length) {
            playChunk(next);
            return next;
          }
          setInternalIsPlaying(false);
          return 0;
        });
      };
      window.speechSynthesis.speak(utterance);
      setInternalIsPlaying(true);
    }
  }, [playbackSpeed, sentences.length]);

  const playChunk = useCallback(
    async (index: number) => {
      if (index >= sentences.length) {
        setInternalIsPlaying(false);
        setCurrentChunkIndex(0);
        return;
      }

      const chunkText = sentences[index];

      // 1. Nếu có file Audio gốc do Admin tải lên -> Ưu tiên phát file này
      if (uploadedAudioUrl && audioRef.current) {
        audioRef.current.src = uploadedAudioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.muted = isMuted;
        try {
          await audioRef.current.play();
          setInternalIsPlaying(true);
        } catch (e) {
          console.warn('Audio play failed:', e);
        }
        return;
      }

      // 2. Phát qua API Giọng đọc Tiếng Việt (/api/tts)
      try {
        if (audioRef.current) {
          audioRef.current.src = `/api/tts?text=${encodeURIComponent(chunkText)}&lang=vi`;
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.muted = isMuted;
          await audioRef.current.play();
          setInternalIsPlaying(true);
        }
      } catch {
        // 3. Fallback: Nếu không tải được audio stream, ép giọng 'vi-VN' trên Web Speech API
        speakFallback(chunkText);
      }
    },
    [sentences, uploadedAudioUrl, playbackSpeed, isMuted, speakFallback]
  );

  const handleTogglePlay = () => {
    if (propOnTogglePlay) {
      propOnTogglePlay();
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setInternalIsPlaying(false);
      if (stopAudio) stopAudio();
    } else {
      if (togglePlayAudio) togglePlayAudio();
      setInternalIsPlaying(true);
      playChunk(currentChunkIndex);
    }
  };

  const handleAudioEnded = () => {
    if (uploadedAudioUrl) {
      setInternalIsPlaying(false);
      if (stopAudio) stopAudio();
      return;
    }
    const nextIndex = currentChunkIndex + 1;
    if (nextIndex < sentences.length) {
      setCurrentChunkIndex(nextIndex);
      playChunk(nextIndex);
    } else {
      setInternalIsPlaying(false);
      setCurrentChunkIndex(0);
      if (stopAudio) stopAudio();
    }
  };

  const handleClose = () => {
    stopPlayback();
    setActiveLoc(null);
    if (propOnClose) propOnClose();
  };

  // Nếu không có thông tin bài đọc hoặc phụ đề, ẩn thanh bar
  if (!title && !textScript) return null;

  // Chế độ thu gọn góc phải dưới
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[600] flex items-center gap-3 bg-[#0B1320]/95 border border-amber-500/60 rounded-full px-4 py-2.5 shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md">
        <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition"
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
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
            <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
              {sentences[currentChunkIndex] || textScript}
            </p>
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
