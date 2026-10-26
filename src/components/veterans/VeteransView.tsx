// src/components/veterans/VeteransView.tsx
'use client';

import React, { useState } from 'react';
import { VeteranProfile } from '@/types/system';
import {
  Medal,
  Video,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Sparkles,
  Send,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface VeteransViewProps {
  veterans: VeteranProfile[];
  visitedVeteranIds: string[];
  currentUserName: string;
  onVisitVeteran: (veteranId: string, tributeMessage?: string) => void;
  onPlayVeteranAudio: (veteran: VeteranProfile) => void;
}

export default function VeteransView({
  veterans,
  visitedVeteranIds,
  currentUserName,
  onVisitVeteran,
  onPlayVeteranAudio,
}: VeteransViewProps) {
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfile>(veterans[0]);
  const [tributeInput, setTributeInput] = useState('');
  const [justUnlockedBanner, setJustUnlockedBanner] = useState(false);

  const isVisited = visitedVeteranIds.includes(selectedVeteran?.id);

  const handleSendTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeInput.trim()) return;
    onVisitVeteran(selectedVeteran.id, tributeInput.trim());
    setTributeInput('');
    setJustUnlockedBanner(true);
    setTimeout(() => setJustUnlockedBanner(false), 5000);
  };

  return (
    <div className="p-6 pb-36 text-white max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Medal size={15} /> LƯU TRỮ QUỐC GIA • NHÂN CHỨNG SỐNG
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
            Hồ Sơ Cựu Chiến Binh & Ký Ức Sống
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lắng nghe lời kể từ những nhân chứng bằng xương bằng thịt, đến thăm và gửi lời tri ân để mở khóa danh hiệu{' '}
            <span className="text-pink-400 font-bold">★ Người Cháu Tri Ân</span>.
          </p>
        </div>

        <div className="bg-[#111C2D] border border-amber-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0">
          <HeartHandshake className="text-pink-400" size={24} />
          <div>
            <p className="text-[11px] text-slate-400">Hành trình tri ân của bạn</p>
            <p className="text-sm font-bold text-white">
              Đã kết nối {visitedVeteranIds.length} / {veterans.length} Cựu chiến binh
            </p>
          </div>
        </div>
      </div>

      {justUnlockedBanner && (
        <div className="bg-gradient-to-r from-pink-950/80 via-amber-950/80 to-pink-950/80 border border-pink-400/60 rounded-2xl p-4 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-400" size={22} />
            <div>
              <h4 className="text-sm font-bold text-white">
                Chúc mừng! Bạn đã gửi lời tri ân & mở khóa Danh Hiệu Mới:
              </h4>
              <p className="text-xs text-pink-300 font-extrabold">★ NGƯỜI CHÁU TRI ÂN (+300 EXP)</p>
            </div>
          </div>
        </div>
      )}

      {/* Bố cục 2 cột: Danh sách bên trái - Hồ sơ chi tiết bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Danh sách Cựu Chiến Binh */}
        <div className="lg:col-span-4 space-y-3">
          {veterans.map((vet) => {
            const active = vet.id === selectedVeteran?.id;
            const visited = visitedVeteranIds.includes(vet.id);
            return (
              <button
                key={vet.id}
                onClick={() => setSelectedVeteran(vet)}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                  active
                    ? 'bg-[#15233B] border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#0E1726] border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={vet.avatarUrl}
                  alt={vet.fullName}
                  className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">
                      Sinh năm {vet.birthYear}
                    </span>
                    {visited && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Đã tri ân
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5 truncate">{vet.fullName}</h3>
                  <p className="text-xs text-amber-400/90 truncate">{vet.rankAndRole}</p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{vet.unit}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cột phải: Chi tiết Hồ sơ Quân nhân, Chiến tích & Video Phỏng vấn */}
        {selectedVeteran && (
          <div className="lg:col-span-8 bg-[#0E1726] border border-slate-800 rounded-3xl p-6 space-y-6">
            {/* Thông tin tổng quan */}
            <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-800 pb-6">
              <img
                src={selectedVeteran.avatarUrl}
                alt={selectedVeteran.fullName}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedVeteran.era}
                  </span>
                  {isVisited && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Đã hoàn thành Thăm & Tri ân
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-white">{selectedVeteran.fullName}</h2>
                <p className="text-sm font-semibold text-amber-400">{selectedVeteran.rankAndRole}</p>
                <p className="text-xs text-slate-300">
                  <strong>Đơn vị:</strong> {selectedVeteran.unit} • <strong>Quê quán:</strong> {selectedVeteran.hometown}
                </p>

                {/* Danh sách Huân chương */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedVeteran.medals.map((medal, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#162238] text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1"
                    >
                      <ShieldCheck size={12} className="text-amber-400" /> {medal}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onPlayVeteranAudio(selectedVeteran)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 shadow-lg transition"
              >
                <Volume2 size={16} />
                Nghe Thuyết Minh Hồi Ký
              </button>
            </div>

            {/* Tiểu sử hoạt động */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                1. Lịch sử hoạt động & Ký ức chiến trường
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-[#09101B] p-4 rounded-2xl border border-slate-800/80">
                {selectedVeteran.biography}
              </p>
            </div>

            {/* Dòng thời gian Chiến tích */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3">
                2. Dấu mốc Chiến tích tiêu biểu
              </h3>
              <div className="space-y-3">
                {selectedVeteran.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#111C2D] border border-slate-800 flex items-start gap-3.5"
                  >
                    <div className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-700/50 text-red-300 text-xs font-bold shrink-0 flex items-center gap-1">
                      <Calendar size={12} /> {ach.year}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Phỏng vấn Nhân chứng */}
            {selectedVeteran.videoUrl && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Video size={16} /> 3. Thước phim Phỏng vấn Nhân chứng
                </h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-700 bg-black">
                  {selectedVeteran.videoUrl.includes('youtube.com') ||
                  selectedVeteran.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={selectedVeteran.videoUrl}
                      title={selectedVeteran.fullName}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={selectedVeteran.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            )}

            {/* Khu vực Check-in Thăm hỏi & Sổ Lưu Bút Tri Ân */}
            <div className="bg-gradient-to-br from-[#131F33] to-[#0B1320] border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin size={16} className="text-amber-400" />
                    Địa điểm Thăm hỏi & Giao lưu: {selectedVeteran.visitAddress}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Xác nhận đến thăm hoặc gửi lời tri ân tới {selectedVeteran.fullName} để nhận +300 EXP và Danh hiệu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onVisitVeteran(selectedVeteran.id);
                    setJustUnlockedBanner(true);
                    setTimeout(() => setJustUnlockedBanner(false), 5000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition"
                >
                  ✓ Check-in Đã Đến Thăm Bác
                </button>
              </div>

              <form onSubmit={handleSendTribute} className="flex gap-2">
                <input
                  type="text"
                  value={tributeInput}
                  onChange={(e) => setTributeInput(e.target.value)}
                  placeholder={`Viết lời chúc sức khỏe và tri ân gửi tới ${selectedVeteran.fullName}...`}
                  className="flex-1 bg-[#080E18] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Send size={14} /> Gửi Tri Ân
                </button>
              </form>

              {/* Danh sách lời tri ân */}
              <div className="space-y-2 pt-2">
                {selectedVeteran.tributes.map((t, i) => (
                  <div key={i} className="text-xs bg-[#09101B]/80 border border-slate-800 rounded-xl p-3">
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span>{t.user}</span>
                      <span className="text-[10px] text-slate-500">{t.date}</span>
                    </div>
                    <p className="text-slate-300 mt-1">"{t.message}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
