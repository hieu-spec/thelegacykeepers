// src/components/veterans/VeteransView.tsx
'use client';

import React, { useState } from 'react';
import { Volume2, Award, MapPin, CheckCircle2, Flame } from 'lucide-react';

interface VeteranMilestone {
  time: string;
  title: string;
  detail: string;
}

interface VeteranProfile {
  id: string;
  name: string;
  birthYear: string;
  role: string;
  unit: string;
  hometown: string;
  campaign: string;
  pastelBg: string;
  medals: string[];
  story: string;
  quote: string;
  milestones: VeteranMilestone[];
}

const VETERANS_DATA: VeteranProfile[] = [
  {
    id: 'vu-dang-toan',
    name: 'Đại tá Vũ Đăng Toàn',
    birthYear: 'Sinh năm 1947',
    role: 'Nguyên Chính trị viên - Trưởng xe tăng 390',
    unit: 'Đại đội 4, Tiểu đoàn 1, Lữ đoàn Xe tăng 203, Quân đoàn 2',
    hometown: 'Yên Chính, Ý Yên, Nam Định',
    campaign: 'Chiến dịch Hồ Chí Minh (1975)',
    pastelBg: 'bg-[#EDE9FE]',
    medals: ['Huân chương Chiến công hạng Nhất', 'Huy hiệu 50 năm tuổi Đảng', 'Chiến sĩ Quyết thắng'],
    story:
      'Trưa ngày 30/4/1975 lịch sử, chiếc xe tăng T-59 mang số hiệu 390 dưới sự chỉ huy của Chính trị viên Vũ Đăng Toàn đã dũng mãnh húc tung cánh cổng chính Dinh Độc Lập, đánh dấu thời khắc toàn thắng thống nhất đất nước.',
    quote:
      'Khoảnh khắc cánh cổng sắt đổ sập xuống, trong lòng chúng tôi chỉ có một suy nghĩ duy nhất: Non sông từ nay liền một dải, hòa bình thật rồi!',
    milestones: [
      {
        time: 'Tháng 3/1975',
        title: 'Chiến dịch Huế - Đà Nẵng',
        detail: 'Hành quân thần tốc dọc duyên hải miền Trung, đập tan các tuyến phòng thủ ngoại vi.',
      },
      {
        time: '11h30 - 30/4/1975',
        title: 'Tiến vào Dinh Độc Lập',
        detail: 'Xe tăng 390 húc đổ cổng chính Dinh Độc Lập, hội quân cùng xe tăng 843.',
      },
    ],
  },
  {
    id: 'nguyen-van-tau',
    name: 'Đại tá Nguyễn Văn Tàu (Tư Cang)',
    birthYear: 'Sinh năm 1928',
    role: 'Anh hùng LLVTND - Cụm trưởng Tình báo H.63',
    unit: 'Cụm Tình báo Chiến lược H.63 - Miền Nam',
    hometown: 'Long Phước, Bà Rịa - Vũng Tàu',
    campaign: 'Tình báo Chiến lược Miền Nam',
    pastelBg: 'bg-[#DCFCE7]',
    medals: ['Anh hùng Lực lượng Vũ trang Nhân dân', 'Huân chương Độc lập hạng Nhì'],
    story:
      'Người chỉ huy huyền thoại của Cụm tình báo H.63 hoạt động ngay giữa lòng Sài Gòn, bảo vệ tuyệt đối an toàn mạng lưới thông tin chiến lược suốt cuộc kháng chiến.',
    quote:
      'Hòa bình hôm nay được đánh đổi bằng xương máu của biết bao đồng đội. Các cháu hãy sống, học tập xứng đáng với non sông.',
    milestones: [
      {
        time: '1962 - 1972',
        title: 'Chỉ huy Cụm tình báo H.63',
        detail: 'Chuyển hàng trăm bản tin tình báo chiến lược về Trung ương Cục miền Nam.',
      },
      {
        time: 'Tháng 4/1975',
        title: 'Tham gia Chiến dịch Hồ Chí Minh',
        detail: 'Chính ủy Lữ đoàn 316 Đặc công - Biệt động tiến vào giải phóng Sài Gòn.',
      },
    ],
  },
];

export default function VeteransView() {
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfile>(VETERANS_DATA[0]);
  const [tributeCount, setTributeCount] = useState(1428);
  const [hasSentTribute, setHasSentTribute] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayVoice = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-5 text-[#18181B]">
      {/* Header & Khung Thắp Nhang Tri Ân Tối Giản */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#18181B] text-white text-[11px] font-medium">
            Lưu trữ Quốc gia • Nhân chứng Sống
          </span>
          <h2 className="text-xl font-semibold text-zinc-900 mt-2">
            Lắng nghe &amp; Tri ân Cựu Chiến Binh
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Đã có <strong className="text-zinc-900">{tributeCount.toLocaleString('vi-VN')}</strong> lời tri ân được gửi từ thế hệ trẻ.
          </p>
        </div>

        <button
          onClick={() => {
            if (!hasSentTribute) {
              setTributeCount((c) => c + 1);
              setHasSentTribute(true);
            }
          }}
          className={`px-4 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 transition ${
            hasSentTribute
              ? 'bg-[#DCFCE7] text-[#166534]'
              : 'bg-[#18181B] text-white hover:bg-zinc-800'
          }`}
        >
          <Flame size={15} />
          <span>{hasSentTribute ? 'Đã Gửi Lời Tri Ân (+50 EXP)' : 'Gửi Lời Tri Ân Nhân Chứng'}</span>
        </button>
      </div>

      {/* Bố cục 2 Cột đồng bộ Dashboard V18 */}
      <div className="grid grid-cols-12 gap-5 items-start">
        
        {/* Cột Trái (4/12): Danh sách Nhân chứng */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          {VETERANS_DATA.map((vet) => {
            const isSelected = selectedVeteran.id === vet.id;
            return (
              <button
                key={vet.id}
                onClick={() => setSelectedVeteran(vet)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-white border-[#18181B] shadow-sm'
                    : 'bg-white/80 border-zinc-200/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-semibold">
                    {vet.birthYear}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 size={13} /> Đã kết nối
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">{vet.name}</h3>
                  <p className="text-xs font-medium text-violet-700 mt-0.5">{vet.role}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{vet.unit}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cột Phải (8/12): Chi tiết Hồi ký & Lời dặn dò */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
          <div className={`p-4 rounded-2xl ${selectedVeteran.pastelBg} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-medium">
                {selectedVeteran.campaign}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 mt-2">{selectedVeteran.name}</h3>
              <p className="text-xs font-medium text-zinc-700">{selectedVeteran.role}</p>
              <p className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                <MapPin size={12} /> {selectedVeteran.unit} • Quê quán: {selectedVeteran.hometown}
              </p>
            </div>

            <button
              onClick={() => handlePlayVoice(`${selectedVeteran.story} ${selectedVeteran.quote}`)}
              className="px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-medium flex items-center gap-2 hover:bg-zinc-800 transition shrink-0"
            >
              <Volume2 size={14} />
              <span>{isSpeaking ? 'Đang đọc hồi ký...' : 'Nghe Thuyết Minh Hồi Ký'}</span>
            </button>
          </div>

          {/* Huân chương */}
          <div className="flex flex-wrap gap-2">
            {selectedVeteran.medals.map((medal) => (
              <span
                key={medal}
                className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium flex items-center gap-1.5"
              >
                <Award size={12} className="text-zinc-900" />
                {medal}
              </span>
            ))}
          </div>

          {/* Ký ức chiến trường */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              1. Ký ức Chiến trường &amp; Lời nhắn gửi
            </h4>
            <p className="text-sm text-zinc-800 leading-relaxed">{selectedVeteran.story}</p>
            <blockquote className="mt-3 pl-3 border-l-2 border-zinc-900 italic text-xs text-zinc-600">
              &ldquo;{selectedVeteran.quote}&rdquo;
            </blockquote>
          </div>

          {/* Dấu mốc chiến tích */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              2. Dấu mốc Chiến tích Tiêu biểu
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedVeteran.milestones.map((m) => (
                <div key={m.time} className="p-3.5 rounded-2xl border border-zinc-200/70 bg-white">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-semibold">
                    {m.time}
                  </span>
                  <h5 className="font-semibold text-xs text-zinc-900 mt-2">{m.title}</h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
