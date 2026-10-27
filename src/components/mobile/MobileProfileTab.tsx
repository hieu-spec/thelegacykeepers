// src/components/mobile/MobileProfileTab.tsx
'use client';

import React, { useState } from 'react';
import {
  User,
  Edit3,
  Check,
  Award,
  MapPin,
  ShieldCheck,
  Sparkles,
  Footprints,
  Lock,
  Unlock,
} from 'lucide-react';
import { CompanionAvatarType } from './MobileSatelliteMap';

export interface UserProfileData {
  displayName: string;
  bioNote: string;
  titleEquipped: string;
  companion: CompanionAvatarType;
  collectedLocationIds: string[];
  unlockedTitles: { id: string; name: string; desc: string; icon: string; date: string }[];
  journeyLogs: { id: string; locationName: string; action: string; timestamp: string }[];
}

interface MobileProfileTabProps {
  profile: UserProfileData;
  onUpdateProfile: (next: UserProfileData) => void;
  isAdmin: boolean;
  onToggleAdminAuth: (password: string) => boolean;
}

export const MobileProfileTab: React.FC<MobileProfileTabProps> = ({
  profile,
  onUpdateProfile,
  isAdmin,
  onToggleAdminAuth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [bioInput, setBioInput] = useState(profile.bioNote);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      displayName: nameInput.trim() || 'Người Gìn Giữ Di Sản',
      bioNote: bioInput.trim(),
    });
    setIsEditing(false);
  };

  const handleSelectCompanion = (companion: CompanionAvatarType) => {
    onUpdateProfile({ ...profile, companion });
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-3 pb-28 space-y-4">
      {/* 1. THẺ HỒ SƠ CÁ NHÂN (CHO PHÉP ĐỔI TÊN, ĐỔI GHI CHÚ BẢN THÂN) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#16243B] via-[#0F1A2C] to-[#0B1320] border border-[#D4AF37]/50 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#8B2626] border-2 border-[#D4AF37] flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase">
                {profile.titleEquipped}
              </span>
              {!isEditing ? (
                <h2 className="font-['Cinzel',serif] text-base font-bold text-white mt-1">
                  {profile.displayName}
                </h2>
              ) : (
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 w-full bg-[#070C15] border border-[#D4AF37] rounded-lg px-2.5 py-1 text-xs text-white"
                  placeholder="Nhập tên của bạn..."
                />
              )}
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#0B1320] text-xs font-bold flex items-center gap-1 shadow"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" /> Lưu
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> Sửa Hồ Sơ
              </>
            )}
          </button>
        </div>

        {/* Ghi chú cá nhân (Bio) */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold block mb-1">
            Ghi chú & Châm ngôn cá nhân:
          </span>
          {!isEditing ? (
            <p className="text-xs text-gray-200 italic">“{profile.bioNote}”</p>
          ) : (
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              rows={2}
              className="w-full bg-[#070C15] border border-[#D4AF37] rounded-xl p-2 text-xs text-white"
              placeholder="Viết giới thiệu hoặc cảm nghĩ của bạn..."
            />
          )}
        </div>
      </div>

      {/* 2. CHỌN NHÂN VẬT BƯỚC ĐI TRÊN BẢN ĐỒ (PIKACHU / CHIẾN SĨ / SỨ GIẢ) */}
      <div className="p-4 rounded-3xl bg-[#111C2D]/90 border border-[#D4AF37]/30 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase">
          <Footprints className="w-4 h-4" />
          <span>Nhân Vật Đồng Hành Trên Bản Đồ</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {[
            {
              id: 'pikachu' as CompanionAvatarType,
              label: 'Pikachu',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
            },
            {
              id: 'soldier' as CompanionAvatarType,
              label: 'Chiến Sĩ',
              img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=VietnamHero&backgroundColor=b6e3f4',
            },
            {
              id: 'scholar' as CompanionAvatarType,
              label: 'Sứ Giả',
              img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=LegacyKeeper&backgroundColor=ffdfbf',
            },
            {
              id: 'dragon' as CompanionAvatarType,
              label: 'Rồng Con',
              img: 'https://api.dicebear.com/9.x/bottts/svg?seed=DragonVN&backgroundColor=ffd5dc',
            },
            {
              id: 'bird' as CompanionAvatarType,
              label: 'Chim Lạc',
              img: 'https://api.dicebear.com/9.x/icons/svg?seed=ChimLac&backgroundColor=fef08a',
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectCompanion(item.id)}
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                profile.companion === item.id
                  ? 'bg-[#8B2626]/80 border-[#D4AF37] scale-105 shadow-lg'
                  : 'bg-[#070C15]/70 border-white/10 opacity-75'
              }`}
            >
              <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />
              <span className="text-[11px] font-bold text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. KHO DANH HIỆU ĐẠT ĐƯỢC (CHỌN ĐỂ ĐEO LÊN HỒ SƠ) */}
      <div className="space-y-2">
        <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
          <Award className="w-4 h-4" />
          <span>Danh Hiệu Đã Thu Thập ({profile.unlockedTitles.length})</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {profile.unlockedTitles.map((t) => {
            const isEquipped = profile.titleEquipped === t.name;
            return (
              <button
                key={t.id}
                onClick={() => onUpdateProfile({ ...profile, titleEquipped: t.name })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isEquipped
                    ? 'bg-gradient-to-br from-[#8B2626] to-[#16243B] border-[#D4AF37] shadow-lg'
                    : 'bg-[#111C2D]/90 border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{t.icon}</span>
                  {isEquipped && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0B1320] font-bold">
                      Đang đeo
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-white mt-1">{t.name}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. NHẬT KÝ HÀNH TRÌNH THU THẬP DI TÍCH */}
      <div className="space-y-2">
        <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>Nhật Ký Hành Trình Di Sản</span>
        </h3>
        <div className="space-y-2">
          {profile.journeyLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-[#111C2D]/80 border border-[#D4AF37]/25 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white">{log.locationName}</p>
                <p className="text-[11px] text-emerald-400">{log.action}</p>
              </div>
              <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CỔNG XÁC THỰC QUẢN TRỊ VIÊN (ADMIN) ĐỂ TẢI LÊN LOGO ĐỊA DANH */}
      <div className="p-4 rounded-3xl bg-[#070C15] border border-[#D4AF37]/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
            {isAdmin ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
            Quyền Quản Trị Viên (Admin CMS)
          </span>
          {isAdmin && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400">
              Đã Mở Khóa
            </span>
          )}
        </div>

        {!isAdmin ? (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="password"
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              placeholder="Nhập mật khẩu Admin (mặc định: admin123)..."
              className="flex-1 bg-[#111C2D] border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              onClick={() => {
                const ok = onToggleAdminAuth(adminPassInput);
                if (!ok) setAuthError('Sai mật khẩu Admin!');
                else setAuthError('');
              }}
              className="px-3 py-2 rounded-xl bg-[#D4AF37] text-[#0B1320] text-xs font-bold"
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-gray-300">
            Bạn đang ở chế độ <strong>Admin</strong>. Hãy quay lại tab <strong>Sa Bàn</strong> và bấm nút{' '}
            <strong className="text-[#D4AF37]">“Đổi Logo Map (Admin)”</strong> để tải lên biểu tượng động cho từng địa danh!
          </p>
        )}
        {authError && <p className="text-[11px] text-red-400">{authError}</p>}
      </div>
    </div>
  );
};
