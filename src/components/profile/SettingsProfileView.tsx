// src/components/profile/SettingsProfileView.tsx
'use client';

import React, { useState } from 'react';
import {
  MapPin,
  BookOpen,
  Award,
  Settings,
  Plus,
  Sparkles,
  CheckCircle2,
  Share2,
  LogOut,
  Volume2,
  Edit3,
  Footprints,
  Quote,
  Clock,
  Shield,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import { V18_PASTEL_RARITY } from '@/constants/minimalTheme';

// ============================================================================
// PHẦN 1: DỮ LIỆU MẶC ĐỊNH CHO TRANG HỒ SƠ CÁ NHÂN & KHO DI SẢN
// ============================================================================

interface CompanionItem {
  id: string;
  name: string;
  role: string;
  emoji: string;
  pastelBg: string;
  accentText: string;
}

const COMPANIONS_LIST: CompanionItem[] = [
  {
    id: 'chien-si',
    name: 'Chiến Sĩ',
    role: 'Bộ đội Cụ Hồ',
    emoji: '🪖',
    pastelBg: 'bg-[#DCFCE7]',
    accentText: 'text-[#166534]',
  },
  {
    id: 'su-gia',
    name: 'Sứ Giả',
    role: 'Học giả Lịch sử',
    emoji: '📜',
    pastelBg: 'bg-[#EDE9FE]',
    accentText: 'text-[#5B21B6]',
  },
  {
    id: 'rong-con',
    name: 'Rồng Con',
    role: 'Hậu duệ Lạc Hồng',
    emoji: '🐉',
    pastelBg: 'bg-[#FEF3C7]',
    accentText: 'text-[#92400E]',
  },
  {
    id: 'chim-lac',
    name: 'Chim Lạc',
    role: 'Biểu tượng Đông Sơn',
    emoji: '🕊️',
    pastelBg: 'bg-[#FCE7F3]',
    accentText: 'text-[#9D174D]',
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    role: 'Bạn đồng hành',
    emoji: '⚡',
    pastelBg: 'bg-[#F1F5F9]',
    accentText: 'text-[#334155]',
  },
];

interface TitleItem {
  id: string;
  name: string;
  description: string;
  pastelBg: string;
  badgeText: string;
  unlocked: boolean;
}

const TITLES_LIST: TitleItem[] = [
  {
    id: 'su-gia-dong-son',
    name: 'Sứ Giả Ký Ức Đông Sơn',
    description: 'Khởi đầu hành trình gìn giữ và khám phá di sản dân tộc',
    pastelBg: 'bg-[#EDE9FE]',
    badgeText: 'text-[#5B21B6]',
    unlocked: true,
  },
  {
    id: 'nguoi-giu-thu',
    name: 'Người Giữ Thư Thời Chiến',
    description: 'Thu thập và lắng nghe các bức thư, kỷ vật rơi trên đường hành quân',
    pastelBg: 'bg-[#FCE7F3]',
    badgeText: 'text-[#9D174D]',
    unlocked: true,
  },
  {
    id: 'nguoi-chau-tri-an',
    name: '★ Người Cháu Tri Ân',
    description: 'Lắng nghe hồi ký và gửi lời tri ân tới các Cựu chiến binh',
    pastelBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#166534]',
    unlocked: true,
  },
];

const JOURNEY_LOGS = [
  {
    id: 'log-1',
    place: 'Bến Nhà Rồng',
    action: 'Khởi hành tìm kiếm kỷ vật & hoàn thành giải đố 1911',
    time: 'Hôm nay',
    tag: '+150 EXP',
    dotColor: 'bg-violet-500',
  },
  {
    id: 'log-2',
    place: 'Dinh Độc Lập',
    action: 'Nghe thuyết minh chiến dịch Hồ Chí Minh lịch sử 30/4/1975',
    time: 'Hôm qua',
    tag: '+120 EXP',
    dotColor: 'bg-emerald-500',
  },
  {
    id: 'log-3',
    place: 'Hồ sơ Nhân chứng Sống',
    action: 'Gửi lời tri ân tới Đại tá Vũ Đăng Toàn (Trưởng xe tăng 390)',
    time: '3 ngày trước',
    tag: '+50 EXP',
    dotColor: 'bg-pink-500',
  },
];

export interface SettingsProfileViewProps {
  onBack?: () => void;
}

// ============================================================================
// PHẦN 2: COMPONENT CHÍNH - TRANG THÔNG TIN CÁ NHÂN (HỒ SƠ)
// ============================================================================

export default function SettingsProfileView({ onBack }: SettingsProfileViewProps = {}) {
  // State Thông tin cá nhân (Có thể chỉnh sửa trực tiếp)
  const [fullName, setFullName] = useState('Lê Toàn Hiếu');
  const [motto, setMotto] = useState(
    'Tự hào gìn giữ ký ức lịch sử hào hùng của dân tộc Việt Nam.'
  );
  const [selectedCompanion, setSelectedCompanion] = useState<string>('chien-si');
  const [equippedTitleId, setEquippedTitleId] = useState<string>('su-gia-dong-son');

  // State Modal Sửa Hồ Sơ & Cài đặt
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(fullName);
  const [draftMotto, setDraftMotto] = useState(motto);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const equippedTitleObj =
    TITLES_LIST.find((t) => t.id === equippedTitleId) || TITLES_LIST[0];

  const handleSaveProfile = () => {
    if (draftName.trim()) setFullName(draftName.trim());
    if (draftMotto.trim()) setMotto(draftMotto.trim());
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-[#18181B]">
      {/* 1. HEADER TRANG HỒ SƠ CÁ NHÂN */}
      <header className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white border border-zinc-200/80 hover:bg-zinc-100 transition"
              title="Quay lại"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Hồ sơ Cá nhân
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Quản lý định danh Người Gìn Giữ Di Sản, nhân vật đồng hành, danh hiệu và nhật ký hành trình
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDraftName(fullName);
              setDraftMotto(motto);
              setIsEditingProfile(true);
            }}
            className="px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-800 transition shadow-2xs"
          >
            <Edit3 size={13} />
            <span>Sửa Hồ Sơ</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-white border border-zinc-200/80 text-zinc-700 hover:bg-zinc-100 transition"
            title="Cài đặt hệ thống"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* 2. BỐ CỤC 2 CỘT CHUẨN DASHBOARD V18 */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (4/12): THẺ ĐỊNH DANH CÁ NHÂN & CHÂM NGÔN */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          
          {/* Thẻ Căn Cước / Định Danh Cá Nhân */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className={`p-4 rounded-2xl ${equippedTitleObj.pastelBg} flex items-center gap-3.5`}>
              <div className="w-14 h-14 rounded-2xl bg-[#18181B] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                {fullName
                  .split(' ')
                  .slice(-2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-semibold uppercase tracking-wide">
                  {equippedTitleObj.name}
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-1 truncate">
                  {fullName}
                </h2>
                <p className="text-[11px] text-zinc-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Đã xác thực Hộ chiếu Di sản</span>
                </p>
              </div>
            </div>

            {/* Ghi chú & Châm ngôn cá nhân */}
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
              <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <Quote size={11} /> Ghi chú &amp; Châm ngôn cá nhân
                </span>
                <button
                  onClick={() => {
                    setDraftName(fullName);
                    setDraftMotto(motto);
                    setIsEditingProfile(true);
                  }}
                  className="text-zinc-600 hover:text-zinc-900 underline"
                >
                  Sửa
                </button>
              </div>
              <p className="text-xs text-zinc-700 italic leading-relaxed">
                “{motto}”
              </p>
            </div>

            {/* Cấp độ & Thanh kinh nghiệm */}
            <div className="px-1">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-zinc-700">Cấp độ 4 • Học giả Trẻ</span>
                <span className="text-zinc-900">1.450 / 2.000 EXP</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-[#18181B] rounded-full" />
              </div>
            </div>

            {/* Chỉ số tóm tắt */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-center">
              <div className="p-2 rounded-xl bg-zinc-50">
                <p className="text-base font-bold text-zinc-900">6</p>
                <p className="text-[10px] text-zinc-500">Di tích đã mở</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50">
                <p className="text-base font-bold text-zinc-900">3</p>
                <p className="text-[10px] text-zinc-500">Danh hiệu</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50">
                <p className="text-base font-bold text-zinc-900">5</p>
                <p className="text-[10px] text-zinc-500">Bạn đồng hành</p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition">
              <Share2 size={13} />
              <span>Chia sẻ Thẻ Hồ Sơ Di Sản</span>
            </button>
          </div>

          {/* Nhật ký Hành trình Di sản (Journey Log) */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
                <Clock size={15} className="text-zinc-700" />
                <span>Nhật ký Hành trình Di sản</span>
              </h3>
              <span className="text-[11px] text-zinc-400">Gần đây</span>
            </div>

            <div className="flex flex-col gap-3">
              {JOURNEY_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.dotColor}`} />
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-900">{log.place}</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                        {log.action}
                      </p>
                      <span className="text-[10px] text-zinc-400 mt-1 inline-block">
                        {log.time}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10px] font-semibold text-emerald-700 shrink-0">
                    {log.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (8/12): NHÂN VẬT ĐỒNG HÀNH & DANH HIỆU ĐÃ THU THẬP */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* KHỐI 1: NHÂN VẬT ĐỒNG HÀNH TRÊN BẢN ĐỒ */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
                  <Footprints size={17} className="text-zinc-800" />
                  <span>Nhân vật Đồng hành trên Bản đồ</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Chọn linh vật xuất hiện cùng bạn khi di chuyển khám phá các di tích lịch sử
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium">
                Đã mở khóa 5/5
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COMPANIONS_LIST.map((comp) => {
                const isSelected = selectedCompanion === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompanion(comp.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 relative ${
                      isSelected
                        ? 'bg-white border-[#18181B] ring-2 ring-zinc-900/10 shadow-xs'
                        : 'bg-zinc-50/60 border-zinc-200/70 hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#18181B] text-white flex items-center justify-center">
                        <Check size={10} />
                      </span>
                    )}
                    <div
                      className={`w-14 h-14 rounded-2xl ${comp.pastelBg} flex items-center justify-center text-2xl shadow-2xs`}
                    >
                      {comp.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-zinc-900">{comp.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{comp.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* KHỐI 2: DANH HIỆU ĐÃ THU THẬP */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
                  <Award size={17} className="text-zinc-800" />
                  <span>Danh hiệu Đã Thu thập ({TITLES_LIST.length})</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Chạm vào một danh hiệu bất kỳ để trang bị lên thẻ Hồ sơ Cá nhân của bạn
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TITLES_LIST.map((titleItem) => {
                const isEquipped = equippedTitleId === titleItem.id;
                return (
                  <div
                    key={titleItem.id}
                    onClick={() => setEquippedTitleId(titleItem.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                      isEquipped
                        ? 'bg-white border-[#18181B] ring-2 ring-zinc-900/10 shadow-xs'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className={`p-3.5 rounded-xl ${titleItem.pastelBg} flex flex-col gap-2.5`}>
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center shadow-2xs">
                          <Shield size={15} className="text-[#18181B]" />
                        </div>
                        {isEquipped ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-semibold">
                            Đang đeo
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-zinc-700 text-[10px] font-medium">
                            Trang bị
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-zinc-900 leading-snug mt-1">
                        {titleItem.name}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-500 px-1 leading-relaxed">
                      {titleItem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. MODAL SỬA HỒ SƠ CÁ NHÂN */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-200 p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-semibold text-base text-zinc-900">Chỉnh sửa Hồ sơ Cá nhân</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Họ và Tên hiển thị
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#18181B]"
                  placeholder="Nhập họ tên của bạn..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Ghi chú &amp; Châm ngôn cá nhân
                </label>
                <textarea
                  rows={3}
                  value={draftMotto}
                  onChange={(e) => setDraftMotto(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#18181B] resize-none"
                  placeholder="Viết châm ngôn hành trình di sản của bạn..."
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end gap-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-zinc-800"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL CÀI ĐẶT HỆ THỐNG */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-200 p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-semibold text-base text-zinc-900">Tùy chỉnh Hệ thống</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                Đóng
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Volume2 size={17} className="text-zinc-700" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Thuyết minh Giọng đọc AI (TTS)</p>
                  <p className="text-[11px] text-zinc-500">Tự động đọc tư liệu khi mở di tích</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={(e) => setTtsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#18181B] rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end gap-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200"
              >
                Hoàn tất
              </button>
              <button className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-xs font-medium hover:bg-rose-100 flex items-center gap-1.5">
                <LogOut size={13} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PHẦN 3: COMPONENT KHO DI SẢN ĐÃ LƯU (DASHBOARD V18 SAVED FOR LATER)
// ============================================================================

const SAVED_HERITAGE_CARDS = [
  {
    id: 'bnr-1911',
    title: 'Bến Nhà Rồng — Hành trình Vượt trùng dương 1911',
    subtitle: 'Quận 4, TP.HCM • Đã đóng dấu thực địa',
    category: 'relic',
    tagLabel: 'Di tích Quốc gia',
    rarity: 'legendary',
    progressPercent: 100,
    dateStamped: '15/04/2026',
  },
  {
    id: 'ddl-1975',
    title: 'Dinh Độc Lập — Bản hùng ca Trưa 30/4/1975',
    subtitle: 'Quận 1, TP.HCM • Hoàn thành Storyteller',
    category: 'relic',
    tagLabel: 'Chiến dịch 1975',
    rarity: 'uncommon',
    progressPercent: 100,
    dateStamped: '20/04/2026',
  },
  {
    id: 'thu-quang-tri',
    title: 'Bức thư từ Thành Cổ Quảng Trị mùa hè 1972',
    subtitle: 'Kỷ vật thời chiến • Đã nghe thuyết minh',
    category: 'artifact',
    tagLabel: 'Kỷ vật Thời chiến',
    rarity: 'rare',
    progressPercent: 85,
    dateStamped: '24/04/2026',
  },
  {
    id: 'ham-biet-dong',
    title: 'Hầm chứa vũ khí bí mật Biệt động Sài Gòn',
    subtitle: 'Quận 3, TP.HCM • Đã mở khóa hầm ngầm',
    category: 'relic',
    tagLabel: 'Biệt động Sài Gòn',
    rarity: 'uncommon',
    progressPercent: 90,
    dateStamped: '28/04/2026',
  },
  {
    id: 'binh-tong-men',
    title: 'Chiếc bình tông men trên sườn Đồi A1 Điện Biên',
    subtitle: 'Kỷ vật chiến trường • Đã lưu vào Bộ sưu tập',
    category: 'artifact',
    tagLabel: 'Điện Biên 1954',
    rarity: 'legendary',
    progressPercent: 100,
    dateStamped: '30/04/2026',
  },
  {
    id: 'dai-ta-bui-quang-than',
    title: 'Lời kể Đại tá Vũ Đăng Toàn — Trưởng xe tăng 390',
    subtitle: 'Hồ sơ Nhân chứng sống • Đã gửi lời tri ân',
    category: 'veteran',
    tagLabel: 'Nhân chứng Sống',
    rarity: 'rare',
    progressPercent: 100,
    dateStamped: '01/05/2026',
  },
];

export function SavedHeritagesView() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'relic' | 'artifact' | 'veteran'>('all');

  const filteredItems = SAVED_HERITAGE_CARDS.filter((item) =>
    activeFilter === 'all' ? true : item.category === activeFilter
  );

  return (
    <div className="w-full flex flex-col gap-6 text-[#18181B]">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Kho Di sản &amp; Kỷ vật đã lưu
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Các di tích lịch sử, bức thư thời chiến và hồ sơ nhân chứng bạn đã sưu tầm
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'relic', label: 'Di tích' },
            { key: 'artifact', label: 'Kỷ vật' },
            { key: 'veteran', label: 'Nhân chứng' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeFilter === tab.key
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const theme = V18_PASTEL_RARITY[item.rarity];
            return (
              <div
                key={item.id}
                className="bg-white p-3 rounded-2xl border border-zinc-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition flex flex-col justify-between"
              >
                <div className={`h-36 rounded-xl p-3 flex flex-col justify-between ${theme.bgBox}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-medium">
                      {item.tagLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-600 bg-white/75 px-2 py-0.5 rounded-full">
                      {item.dateStamped}
                    </span>
                  </div>

                  <div className="self-center my-auto w-12 h-12 rounded-2xl bg-white/85 flex items-center justify-center shadow-2xs">
                    {item.category === 'relic' && <MapPin size={22} className={theme.iconColor} />}
                    {item.category === 'artifact' && <BookOpen size={22} className={theme.iconColor} />}
                    {item.category === 'veteran' && <Award size={22} className={theme.iconColor} />}
                  </div>

                  <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                    <div className={`h-full ${theme.accentBar}`} style={{ width: `${item.progressPercent}%` }} />
                  </div>
                </div>

                <div className="pt-3 px-1">
                  <h3 className="font-semibold text-sm text-zinc-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-400">
                    <span>{item.subtitle}</span>
                    <Sparkles size={13} className={theme.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="col-span-12 lg:col-span-3 bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-zinc-900">Bộ sưu tập Chiến dịch</h2>
            <Plus size={15} className="text-zinc-400" />
          </div>
          <div className="flex flex-col gap-2 text-xs font-medium text-zinc-700">
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
              <span className="w-6 h-6 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-[10px]">01</span>
              <span className="flex-1 ml-2.5 truncate">Biệt động Sài Gòn</span>
              <span className="text-zinc-400">4</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50">
              <span className="w-6 h-6 rounded-lg bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center text-[10px]">02</span>
              <span className="flex-1 ml-2.5 truncate">Mùa Xuân 1975</span>
              <span className="text-zinc-400">5</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50">
              <span className="w-6 h-6 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center text-[10px]">03</span>
              <span className="flex-1 ml-2.5 truncate">Điện Biên Phủ 1954</span>
              <span className="text-zinc-400">3</span>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-lg font-bold text-zinc-900">6</span>
              <span className="text-zinc-400 ml-1.5">mục đã lưu</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
              Đạt 85%
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export { SettingsProfileView };
