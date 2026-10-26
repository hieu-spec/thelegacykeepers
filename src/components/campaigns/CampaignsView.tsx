// src/components/campaigns/CampaignsView.tsx
'use client';

import React from 'react';
import { Award, CheckCircle2, Compass, Flame, Headphones, MapPin, Puzzle, Sparkles } from 'lucide-react';

export interface HistoricalCampaign {
  id: string;
  codeName: string;
  eraTag: string;
  title: string;
  description: string;
  archivalImage: string;
  difficulty: number;
  expReward: number;
  rewardTitleName: string;
  steps: {
    step1Audio: string;
    step2Gps: string;
    step3Minigame: string;
  };
}

export const CAMPAIGNS_DATA: HistoricalCampaign[] = [
  {
    id: 'camp_1911',
    codeName: 'CHIẾN DỊCH SỐ 01 • BẾN CẢNG NHÀ RỒNG',
    eraTag: 'Ngày 05/06/1911 - Thời khắc Lịch sử',
    title: '1. BẾN NHÀ RỒNG: NGƯỜI ĐI TÌM ĐƯỜNG CỨU NƯỚC',
    description:
      'Theo dấu chân người thanh niên Nguyễn Tất Thành từ quán trọ Xóm Chiếu bước lên con tàu Đô đốc Latouche-Tréville vượt đại dương tìm đường cứu nước.',
    archivalImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    difficulty: 3,
    expReward: 500,
    rewardTitleName: 'Người Mở Đường Bến Cảng',
    steps: {
      step1Audio: 'Nghe hồi ký Bến Cảng Sài Gòn 1911',
      step2Gps: 'Check-in GPS tại Bến Nhà Rồng (Quận 4)',
      step3Minigame: 'Phục dựng 3 mảnh ghép: Tàu Latouche-Tréville',
    },
  },
  {
    id: 'camp_1968',
    codeName: 'CHIẾN DỊCH SỐ 02 • MẬT ĐỊA NỘI ĐÔ',
    eraTag: 'Tết Mậu Thân 1968',
    title: '2. CĂN HẦM VŨ KHÍ: HỎA TUYẾN BIỆT ĐỘNG SÀI GÒN',
    description:
      'Khám phá nghệ thuật ngụy trang thần kỳ của Anh hùng Năm Lai và bà Đặng Thị Thiệp khi đào hầm chứa hơn 2 tấn vũ khí ngay sát nách địch.',
    archivalImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    difficulty: 4,
    expReward: 750,
    rewardTitleName: 'Chiến Sĩ Biệt Động Thành',
    steps: {
      step1Audio: 'Xem phỏng vấn bà Đặng Thị Thiệp',
      step2Gps: 'Định vị Hầm Bí Mật 287/70 Nguyễn Đình Chiểu',
      step3Minigame: 'Giải mã sơ đồ hầm ngầm Đội 5 Biệt Động',
    },
  },
  {
    id: 'camp_1975',
    codeName: 'CHIẾN DỊCH SỐ 03 • ĐẠI THẮNG MÙA XUÂN',
    eraTag: '10h45 Trưa ngày 30/04/1975',
    title: '3. DINH ĐỘC LẬP: HÀNH TRÌNH GIẢI PHÓNG 1975',
    description:
      'Tái hiện giây phút lịch sử khi biên đội xe tăng 390 của Đại tá Vũ Đăng Toàn và xe tăng 843 tiến thẳng vào cánh cổng sắt Dinh Độc Lập.',
    archivalImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80',
    difficulty: 5,
    expReward: 1000,
    rewardTitleName: 'Sứ Giả Ký Ức Sài Gòn',
    steps: {
      step1Audio: 'Nghe lời kể Trưởng xe tăng 390 Vũ Đăng Toàn',
      step2Gps: 'Quét Radar thực địa tại cổng Dinh Độc Lập',
      step3Minigame: 'Phục dựng thời khắc cắm cờ Giải phóng',
    },
  },
  {
    id: 'camp_1945',
    codeName: 'CHIẾN DỊCH SỐ 04 • HÀO KHÍ ĐỘC LẬP',
    eraTag: 'Ngày 02/09/1945',
    title: '4. QUẢNG TRƯỜNG BA ĐÌNH: TUYÊN NGÔN ĐỘC LẬP',
    description:
      'Lắng nghe âm vang bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa giữa mùa thu lịch sử tại Quảng trường Ba Đình.',
    archivalImage: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&auto=format&fit=crop&q=80',
    difficulty: 5,
    expReward: 1200,
    rewardTitleName: 'Hộ Vệ Di Sản Quốc Gia',
    steps: {
      step1Audio: 'Nghe băng thu âm Tuyên ngôn Độc lập 1945',
      step2Gps: 'Kết nối vệ tinh Quảng trường Ba Đình',
      step3Minigame: 'Hoàn thành sa bàn Lịch sử Mùa Thu Cách Mạng',
    },
  },
];

interface CampaignsViewProps {
  completedCampaignIds?: string[];
  onStartCampaign?: (campaign: HistoricalCampaign) => void;
}

export default function CampaignsView({ completedCampaignIds = [], onStartCampaign }: CampaignsViewProps) {
  return (
    <div className="p-6 pb-36 max-w-7xl mx-auto text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Flame size={15} /> CHIẾN DỊCH LỊCH SỬ HÀO HÙNG
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
            Các Mạch Nguồn Ký Ức Toàn Quốc
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hoàn thành 3 mắt xích (Nghe nhân chứng ➔ Đến thực địa ➔ Giải mã Minigame) để nhận Danh hiệu độc quyền.
          </p>
        </div>

        <div className="bg-[#111C2D] border border-amber-500/30 rounded-2xl px-4 py-2.5 text-xs">
          Tiến độ Chiến dịch:{' '}
          <strong className="text-amber-400">
            {completedCampaignIds.length} / {CAMPAIGNS_DATA.length} Chiến dịch đã giải mã
          </strong>
        </div>
      </div>

      {/* Grid Hồ sơ Chiến dịch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CAMPAIGNS_DATA.map((camp) => {
          const isCompleted = completedCampaignIds.includes(camp.id);

          return (
            <div
              key={camp.id}
              className="group bg-[#0E1726] border border-slate-800 hover:border-amber-500/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all shadow-xl"
            >
              <div>
                {/* Ảnh tư liệu phủ bộ lọc Sepia/Tactical */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={camp.archivalImage}
                    alt={camp.title}
                    className="w-full h-full object-cover sepia-[.35] contrast-110 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-[#0E1726]/40 to-transparent" />

                  {/* Mộc đóng dấu góc trên */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#0B1320]/90 text-amber-400 px-3 py-1 rounded-full border border-amber-500/40">
                      {camp.codeName}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                          : 'bg-red-950/90 text-red-300 border-red-500/50'
                      }`}
                    >
                      {isCompleted ? '✓ ĐÃ GIẢI MÃ HOÀN TẤT' : `ĐỘ KHÓ: ${'★'.repeat(camp.difficulty)}`}
                    </span>
                  </div>

                  {/* Nhãn Thời gian lịch sử */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md shadow">
                      {camp.eraTag}
                    </span>
                  </div>
                </div>

                {/* Nội dung Chiến dịch */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{camp.description}</p>
                  </div>

                  {/* Chuỗi 3 Nhiệm vụ Liên hoàn (Chain Quests) */}
                  <div className="bg-[#09101B] border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Lộ trình 3 Bước Chinh Phục:
                    </p>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Headphones size={14} className="text-emerald-400 shrink-0" />
                      <span>Bước 1: {camp.steps.step1Audio}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <MapPin size={14} className="text-amber-400 shrink-0" />
                      <span>Bước 2: {camp.steps.step2Gps}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Puzzle size={14} className="text-pink-400 shrink-0" />
                      <span>Bước 3: {camp.steps.step3Minigame}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Phần thưởng & Nút Tham gia */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-4 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Phần thưởng Chiến dịch:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-extrabold text-amber-400">+{camp.expReward} EXP</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                      <Award size={13} /> Danh hiệu: {camp.rewardTitleName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onStartCampaign && onStartCampaign(camp)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-md transition"
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 size={15} /> Phục Dựng Lại
                    </>
                  ) : (
                    <>
                      <Compass size={15} /> Bắt Đầu Chiến Dịch
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
