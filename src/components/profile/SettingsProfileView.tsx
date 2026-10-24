'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  ArrowLeft,
  Settings,
  User,
  Lock,
  Link as LinkIcon,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  MessageSquare,
  Send,
  AlertTriangle,
  Building,
  CheckCircle2,
  Landmark,
  Radio,
  Share2,
} from 'lucide-react';

interface SettingsProfileViewProps {
  onBack: () => void;
}

type SettingsModalType =
  | 'edit_profile'
  | 'change_password'
  | 'linked_accounts'
  | 'notifications'
  | 'privacy'
  | 'language'
  | 'help_center'
  | 'terms_policy'
  | 'logout_confirm'
  | null;

const HERITAGE_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
];

export const SettingsProfileView: React.FC<SettingsProfileViewProps> = ({ onBack }) => {
  const {
    userProfile,
    updateUserProfile,
    showToast,
    logout,
    language,
    setLanguage,
    preferences,
    updatePreferences,
  } = useApp();

  // Active Sub-screen Modal
  const [activeModal, setActiveModal] = useState<SettingsModalType>(null);

  // 1. Edit Profile Form State
  const [editAvatar, setEditAvatar] = useState(userProfile.avatarUrl);
  const [editName, setEditName] = useState(userProfile.displayName || userProfile.name);
  const [editUsername, setEditUsername] = useState(userProfile.username);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editLocation, setEditLocation] = useState(userProfile.location || 'TP. Hồ Chí Minh');

  // 2. Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Linked Accounts State
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    facebook: false,
    apple: false,
    email: true,
  });

  // 4. Help Center State (Accordion & Chatbot)
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(0);
  const [supportCategory, setSupportCategory] = useState('Góp ý tư liệu lịch sử');
  const [supportMessage, setSupportMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Xin chào Nhà Khám Phá! Tôi là Trợ lý Di sản AI. Bạn có thắc mắc gì về việc quét radar, mở khóa huy hiệu hay dữ liệu lịch sử không?',
    },
  ]);

  // Password strength meter calculation
  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string; level: number } => {
    if (!pwd) return { label: 'Chưa nhập', color: 'bg-stone-200', width: '0%', level: 0 };
    if (pwd.length < 6) return { label: 'Yếu', color: 'bg-red-500', width: '33%', level: 1 };
    const hasLettersAndNumbers = /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd) || /[A-Z]/.test(pwd);
    if (pwd.length >= 8 && hasLettersAndNumbers && hasSpecial) {
      return { label: 'Mạnh', color: 'bg-emerald-500', width: '100%', level: 3 };
    }
    if (pwd.length >= 6 && hasLettersAndNumbers) {
      return { label: 'Trung bình', color: 'bg-amber-500', width: '66%', level: 2 };
    }
    return { label: 'Yếu', color: 'bg-red-500', width: '33%', level: 1 };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.slice(0, 30),
      displayName: editName.slice(0, 30),
      username: editUsername.startsWith('@') ? editUsername : `@${editUsername}`,
      bio: editBio.slice(0, 150),
      location: editLocation,
      avatarUrl: editAvatar,
    });
    setActiveModal(null);
  };

  // Handle Change Password Submit
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu không khớp!', 'Vui lòng kiểm tra lại mật khẩu xác nhận.', 'cinnabar');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Mật khẩu quá ngắn!', 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'cinnabar');
      return;
    }

    showToast('Đổi mật khẩu thành công!', 'Mật khẩu tài khoản đã được cập nhật an toàn.', 'emerald');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActiveModal(null);
  };

  // Handle Send Chatbot Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'Cảm ơn bạn đã đặt câu hỏi. Hệ thống Radar GPS của The Legacy Keepers luôn tự động cập nhật khi bạn di chuyển đến gần các di tích lịch sử!';
      const q = userText.toLowerCase();
      if (q.includes('bến nhà rồng') || q.includes('1911')) {
        reply = 'Bến Nhà Rồng là nơi Bác Hồ ra đi tìm đường cứu nước ngày 5/6/1911. Bạn có thể ghé thăm để mở khóa huy hiệu Dấu Chân Bác Hồ và lắng nghe audio tư liệu!';
      } else if (q.includes('dinh độc lập') || q.includes('30/4') || q.includes('1975')) {
        reply = 'Dinh Độc Lập gắn liền với chiến dịch Hồ Chí Minh lịch sử trưa ngày 30/4/1975. Xe tăng 390 đã húc tung cổng chính mở đầu kỷ nguyên hòa bình.';
      } else if (q.includes('exp') || q.includes('cấp') || q.includes('level')) {
        reply = 'Bạn có thể kiếm EXP bằng cách: Khám phá di tích (+300~500 EXP), hoàn thành thử thách Storyteller (+150 EXP) và thu thập huy hiệu mới!';
      } else if (q.includes('huy hiệu')) {
        reply = 'Có 20 huy hiệu trong bộ sưu tập di sản. Hãy vào mục My Legacy Collection để kiểm tra điều kiện mở khóa từng huy hiệu nhé!';
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  // Handle Support Form Submit
  const handleSendSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    showToast('Đã gửi phản hồi!', 'Cảm ơn bạn đã đóng góp cho The Legacy Keepers. Chúng tôi sẽ phản hồi sớm nhất.', 'emerald');
    setSupportMessage('');
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#FAF6F0] text-[#162A45] select-none pb-24">
      {/* Background Dong Son Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <DongSonSun size={550} color="#162A45" opacity={0.3} />
      </div>

      {/* Decorative Cloud */}
      <div className="absolute top-20 right-2 pointer-events-none opacity-25">
        <AncientCloudMotif color="#8B2626" opacity={0.4} />
      </div>

      {/* ========================================================= */}
      {/* 5.1. TOP BAR */}
      {/* ========================================================= */}
      <div className="pt-14 px-4 pb-2 z-20 flex items-center justify-between border-b border-[#E8DFD1]/80 bg-[#FAF6F0]/90 backdrop-blur-md">
        {/* Nút Quay lại (<) */}
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-[#162A45] shadow-xs active:scale-95 hover:border-[#8B2626]/40 transition-all cursor-pointer"
          title="Quay lại"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B2626]" />
        </button>

        {/* Tiêu đề "THE LEGACY KEEPERS" */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-[#8B2626]/10 flex items-center justify-center text-[#8B2626]">
            <Landmark className="w-3.5 h-3.5 fill-[#8B2626]" />
          </div>
          <span className="font-heritage font-extrabold text-xs tracking-wider text-[#8B2626]">
            THE LEGACY KEEPERS
          </span>
        </div>

        {/* Icon bánh răng */}
        <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-stone-600 shadow-xs">
          <Settings className="w-4 h-4 text-stone-600" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5.1. THẺ HEADER CÀI ĐẶT THU GỌN (NỀN XANH NAVY) */}
      {/* ========================================================= */}
      <div className="px-4 pt-3 z-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#162A45] via-[#1C3556] to-[#0E1E33] p-4 text-white shadow-md relative overflow-hidden border border-[#D9A05B]/30 flex items-center justify-between">
          {/* Faint watermark on the right */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <DongSonSun size={180} color="#FFE082" opacity={0.6} />
          </div>

          <div className="flex items-center gap-3 min-w-0 relative z-10">
            {/* Avatar tròn viền vàng đồng */}
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#D9A05B] ring-2 ring-[#FFE082]/40 shrink-0 bg-stone-800">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.displayName || userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thông tin người dùng */}
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#D9A05B] font-heritage block leading-tight">
                TÀI KHOẢN ĐANG ĐĂNG NHẬP
              </span>
              <h2 className="text-sm font-extrabold text-amber-50 font-heritage truncate">
                {userProfile.displayName || userProfile.name}
              </h2>
              <p className="text-[11px] text-slate-300 font-mono truncate">
                {userProfile.username} · 📍 {userProfile.location || 'TP. Hồ Chí Minh'}
              </p>
            </div>
          </div>

          {/* Quick Edit shortcut */}
          <button
            onClick={() => setActiveModal('edit_profile')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold font-heritage border border-white/20 shrink-0 active:scale-95 transition-all cursor-pointer relative z-10"
          >
            Sửa
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5.2. CÁC NHÓM CHỨC NĂNG CHI TIẾT (SETTINGS GROUPS) */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 z-10">
        {/* ========================================================= */}
        {/* NHÓM 1: TÀI KHOẢN (ACCOUNT) */}
        {/* ========================================================= */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1 font-heritage">
            TÀI KHOẢN
          </span>
          <div className="rounded-2xl bg-white border border-[#E8DFD1] divide-y divide-stone-100 shadow-xs overflow-hidden">
            {/* 1. Chỉnh sửa hồ sơ */}
            <button
              onClick={() => setActiveModal('edit_profile')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Chỉnh sửa hồ sơ
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Tên, ảnh đại diện, tiểu sử
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>

            {/* 2. Đổi mật khẩu */}
            <button
              onClick={() => setActiveModal('change_password')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#D9A05B] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Đổi mật khẩu
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Bảo vệ tài khoản của bạn
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>

            {/* 3. Liên kết tài khoản */}
            <button
              onClick={() => setActiveModal('linked_accounts')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Liên kết tài khoản
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Google, email, mạng xã hội
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NHÓM 2: CÁ NHÂN HÓA (PREFERENCES & PRIVACY) */}
        {/* ========================================================= */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1 font-heritage">
            CÁ NHÂN HÓA
          </span>
          <div className="rounded-2xl bg-white border border-[#E8DFD1] divide-y divide-stone-100 shadow-xs overflow-hidden">
            {/* 1. Thông báo */}
            <button
              onClick={() => setActiveModal('notifications')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Thông báo
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Nhắc nhở thử thách, địa danh gần bạn
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>

            {/* 2. Quyền riêng tư */}
            <button
              onClick={() => setActiveModal('privacy')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Quyền riêng tư
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Quản lý dữ liệu và vị trí
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>

            {/* 3. Ngôn ngữ */}
            <button
              onClick={() => setActiveModal('language')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#D9A05B] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Ngôn ngữ
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Tùy chọn hiển thị đa ngữ
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Hiển thị ngôn ngữ hiện tại bên phải: "Tiếng Việt >" */}
                <span className="text-xs font-bold text-[#8B2626] font-heritage">
                  {language}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NHÓM 3: KHÁC (SUPPORT & LEGAL) */}
        {/* ========================================================= */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1 font-heritage">
            KHÁC
          </span>
          <div className="rounded-2xl bg-white border border-[#E8DFD1] divide-y divide-stone-100 shadow-xs overflow-hidden">
            {/* 1. Trung tâm trợ giúp */}
            <button
              onClick={() => setActiveModal('help_center')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Trung tâm trợ giúp
                  </span>
                  <span className="text-[10px] text-stone-500">
                    FAQ, gửi phản hồi & Chatbot hỗ trợ
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>

            {/* 2. Điều khoản & chính sách */}
            <button
              onClick={() => setActiveModal('terms_policy')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage block group-hover:text-[#8B2626] transition-colors">
                    Điều khoản & chính sách
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Quy định sử dụng & bảo mật GPS
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2626] transition-colors" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NHÓM 4: NÚT ĐĂNG XUẤT (LOGOUT BUTTON) */}
        {/* ========================================================= */}
        <div className="pt-1">
          <button
            onClick={() => setActiveModal('logout_confirm')}
            className="w-full p-3.5 rounded-2xl bg-white border border-red-200 shadow-xs flex items-center justify-between hover:bg-red-50/50 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#DC2626] font-heritage block">
                  Đăng xuất
                </span>
                <span className="text-[10px] text-stone-400">
                  Đăng xuất khỏi phiên làm việc
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-[#DC2626] transition-colors" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CÁC MODAL & SUB-SCREEN CHỨC NĂNG */}
      {/* ========================================================= */}
      <AnimatePresence>
        {/* --------------------------------------------------------- */}
        {/* MODAL 1: CHỈNH SỬA HỒ SƠ ĐẦY ĐỦ */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'edit_profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45] max-h-[90vh] overflow-y-auto"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Chỉnh Sửa Hồ Sơ
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D9A05B] ring-2 ring-[#FFE082]/40 mx-auto bg-stone-200">
                  <img src={editAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-stone-500 block font-heritage">
                  Chọn ảnh đại diện mẫu:
                </span>
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                  {HERITAGE_AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditAvatar(url)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform active:scale-90 ${
                        editAvatar === url ? 'border-[#8B2626] ring-2 ring-[#8B2626]/30 scale-105' : 'border-stone-300 opacity-70'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                {/* Display Name with x/30 Counter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold font-heritage">
                    <label className="text-stone-600 uppercase">Tên hiển thị</label>
                    <span className="text-stone-400 font-mono">{editName.length}/30</span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs font-bold text-[#162A45] focus:ring-2 focus:ring-[#8B2626]/30"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage">Username (@)</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs font-mono text-[#162A45] focus:ring-2 focus:ring-[#8B2626]/30"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage">Thành phố / Vị trí</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs text-[#162A45] focus:ring-2 focus:ring-[#8B2626]/30"
                    required
                  />
                </div>

                {/* Bio with x/150 Counter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold font-heritage">
                    <label className="text-stone-600 uppercase">Tiểu sử Bio</label>
                    <span className="text-stone-400 font-mono">{editBio.length}/150</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={150}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs text-[#162A45] focus:ring-2 focus:ring-[#8B2626]/30 leading-relaxed"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs font-heritage"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 font-heritage cursor-pointer border border-[#8B2626]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 2: ĐỔI MẬT KHẨU CÓ PASSWORD STRENGTH METER */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'change_password' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Đổi Mật Khẩu
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3">
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs font-mono text-[#162A45]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs font-mono text-[#162A45]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Thanh đo Độ mạnh mật khẩu (Password Strength Meter) */}
                  {newPassword && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-heritage font-bold">
                        <span className="text-stone-500">Độ mạnh mật khẩu:</span>
                        <span
                          className={
                            passwordStrength.level === 3
                              ? 'text-emerald-600'
                              : passwordStrength.level === 2
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs font-mono text-[#162A45]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs font-heritage"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white font-bold text-xs shadow-md font-heritage cursor-pointer border border-[#8B2626]"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 3: LIÊN KẾT TÀI KHOẢN */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'linked_accounts' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Liên Kết Tài Khoản
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* 1. Google */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center text-xs">
                      G
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#162A45] block font-heritage">Google</span>
                      <span className="text-[10px] text-stone-400">nam.legacy@gmail.com</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLinkedAccounts((prev) => ({ ...prev, google: !prev.google }));
                      showToast('Google', linkedAccounts.google ? 'Đã hủy liên kết Google' : 'Đã liên kết Google', 'gold');
                    }}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold font-heritage transition-colors ${
                      linkedAccounts.google ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-[#162A45] text-white'
                    }`}
                  >
                    {linkedAccounts.google ? 'Đã liên kết' : 'Liên kết'}
                  </button>
                </div>

                {/* 2. Facebook */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                      f
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#162A45] block font-heritage">Facebook</span>
                      <span className="text-[10px] text-stone-400">{linkedAccounts.facebook ? 'Nam Legacy' : 'Chưa liên kết'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLinkedAccounts((prev) => ({ ...prev, facebook: !prev.facebook }));
                      showToast('Facebook', linkedAccounts.facebook ? 'Đã hủy liên kết Facebook' : 'Đã liên kết Facebook', 'gold');
                    }}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold font-heritage transition-colors ${
                      linkedAccounts.facebook ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-[#162A45] text-white'
                    }`}
                  >
                    {linkedAccounts.facebook ? 'Đã liên kết' : 'Liên kết'}
                  </button>
                </div>

                {/* 3. Apple ID */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">
                      
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#162A45] block font-heritage">Apple ID</span>
                      <span className="text-[10px] text-stone-400">{linkedAccounts.apple ? 'nam@icloud.com' : 'Chưa liên kết'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLinkedAccounts((prev) => ({ ...prev, apple: !prev.apple }));
                      showToast('Apple ID', linkedAccounts.apple ? 'Đã hủy liên kết Apple ID' : 'Đã liên kết Apple ID', 'gold');
                    }}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold font-heritage transition-colors ${
                      linkedAccounts.apple ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-[#162A45] text-white'
                    }`}
                  >
                    {linkedAccounts.apple ? 'Đã liên kết' : 'Liên kết'}
                  </button>
                </div>

                {/* 4. Email */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#8B2626] font-bold flex items-center justify-center text-xs">
                      @
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#162A45] block font-heritage">Email bảo mật</span>
                      <span className="text-[10px] text-stone-400">nam.legacy@keeper.vn</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 font-heritage">
                    Đã xác thực
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 4: QUẢN LÝ THÔNG BÁO (3 TOGGLES) */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'notifications' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Cài Đặt Thông Báo
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Nhắc nhở thử thách hàng ngày */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#162A45] block font-heritage">
                      Nhắc nhở thử thách hàng ngày
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Gửi thông báo làm nhiệm vụ và nhận EXP
                    </span>
                  </div>
                  <button
                    onClick={() => updatePreferences({ dailyReminder: !preferences.dailyReminder })}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                      preferences.dailyReminder ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        preferences.dailyReminder ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Thông báo khi đến gần di tích - GPS Geofencing */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#162A45] block font-heritage">
                      Thông báo GPS Geofencing
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Rung chuông khi đến gần địa danh lịch sử
                    </span>
                  </div>
                  <button
                    onClick={() => updatePreferences({ gpsGeofencing: !preferences.gpsGeofencing })}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                      preferences.gpsGeofencing ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        preferences.gpsGeofencing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Cập nhật sự kiện di sản mới */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#162A45] block font-heritage">
                      Sự kiện di sản mới
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Nhận thông tin triển lãm và tour nhân chứng
                    </span>
                  </div>
                  <button
                    onClick={() => updatePreferences({ heritageEvents: !preferences.heritageEvents })}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                      preferences.heritageEvents ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        preferences.heritageEvents ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 5: QUYỀN RIÊNG TƯ & VỊ TRÍ */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'privacy' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Quyền Riêng Tư & Vị Trí
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* GPS Access Radio Options */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] space-y-2">
                <span className="text-[10px] uppercase font-bold text-stone-600 font-heritage block">
                  Quyền truy cập vị trí (GPS):
                </span>
                {[
                  { value: 'always', label: 'Luôn cho phép' },
                  { value: 'while_using', label: 'Chỉ khi dùng ứng dụng (Khuyên dùng)' },
                  { value: 'never', label: 'Không cho phép' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => updatePreferences({ locationAccess: opt.value as any })}
                    className="flex items-center gap-2 text-xs font-heritage cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="locationAccess"
                      checked={preferences.locationAccess === opt.value}
                      onChange={() => {}}
                      className="text-[#8B2626] focus:ring-[#8B2626]"
                    />
                    <span className={preferences.locationAccess === opt.value ? 'font-bold text-[#8B2626]' : 'text-stone-700'}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Public Profile Toggle */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#162A45] block font-heritage">
                    Công khai trang cá nhân
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Hiển thị huy hiệu và danh hiệu với người dùng khác
                  </span>
                </div>
                <button
                  onClick={() => updatePreferences({ publicProfile: !preferences.publicProfile })}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                    preferences.publicProfile ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.publicProfile ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 6: CHỌN NGÔN NGỮ */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'language' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Chọn Ngôn Ngữ
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
                  { code: 'en', label: '🇬🇧 English' },
                  { code: 'fr', label: '🇫🇷 Français' },
                  { code: 'ja', label: '🇯🇵 日本語' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.label);
                      showToast('Ngôn ngữ', `Đã chuyển ngôn ngữ hiển thị sang ${item.label}`, 'gold');
                      setActiveModal(null);
                    }}
                    className={`w-full p-3 rounded-2xl border text-xs font-heritage font-bold flex items-center justify-between transition-all cursor-pointer ${
                      language.includes(item.label) || language === item.label
                        ? 'bg-[#8B2626]/10 border-[#8B2626] text-[#8B2626] shadow-xs'
                        : 'bg-white border-[#DFD3C3] text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {(language.includes(item.label) || language === item.label) && (
                      <Check className="w-4 h-4 text-[#8B2626]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 7: TRUNG TÂM TRỢ GIÚP (FAQ + TICKET FORM + CHATBOT) */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'help_center' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45] max-h-[90vh] overflow-y-auto"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Trung Tâm Trợ Giúp
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Accordion FAQ */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#8B2626] font-heritage block tracking-wider">
                  Câu hỏi thường gặp (FAQ):
                </span>
                <div className="rounded-2xl bg-white border border-[#DFD3C3] divide-y divide-stone-100 overflow-hidden shadow-xs">
                  {[
                    {
                      id: 0,
                      q: 'Làm thế nào để quét Radar tìm di tích lịch sử?',
                      a: 'Khi bạn bật quyền định vị GPS, radar sẽ quét các địa danh trong bán kính từ 1.5km đến 25km. Di chuyển lại gần dưới 50m để tương tác trực tiếp.',
                    },
                    {
                      id: 1,
                      q: 'Mảnh ghép Storyteller hoạt động ra sao?',
                      a: 'Tại mỗi di tích mở khóa, bạn sẽ đọc các câu chuyện ký ức và ghép nối các sự kiện theo đúng dòng thời gian để phục dựng ký ức di sản.',
                    },
                    {
                      id: 2,
                      q: 'Cách nhận huy hiệu Huyền Thoại Di Sản?',
                      a: 'Cần mở khóa toàn bộ các địa danh Legendary và thu thập đủ 10 tư liệu nhân chứng lịch sử Living History.',
                    },
                  ].map((faq) => (
                    <div key={faq.id} className="p-3">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between text-left text-xs font-bold text-[#162A45] font-heritage cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {expandedFaqId === faq.id ? (
                          <ChevronUp className="w-4 h-4 text-[#8B2626] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                      </button>
                      {expandedFaqId === faq.id && (
                        <p className="mt-2 text-[11px] text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Khung Chatbot Hỗ Trợ Nhanh (Trợ Lý Di Sản AI) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#8B2626] font-heritage block tracking-wider">
                  Trò chuyện cùng Trợ lý Di sản AI:
                </span>
                <div className="rounded-2xl bg-white border border-[#DFD3C3] p-2.5 space-y-2 shadow-xs">
                  <div className="h-32 overflow-y-auto space-y-2 pr-1 text-xs">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-[11px] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#8B2626] text-white ml-6 text-right'
                            : 'bg-stone-100 text-stone-800 mr-6 text-left border border-stone-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1 border-t border-stone-100">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Hỏi về địa danh, huy hiệu..."
                      className="flex-1 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#162A45] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#162A45] text-amber-200 font-bold text-xs flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. Form Gửi Phản Hồi / Báo Lỗi */}
              <form onSubmit={handleSendSupportTicket} className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase text-stone-600 font-heritage block tracking-wider">
                  Gửi yêu cầu hỗ trợ trực tiếp:
                </span>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#DFD3C3] text-xs font-heritage text-[#162A45]"
                >
                  <option>Góp ý tư liệu lịch sử</option>
                  <option>Báo lỗi vị trí GPS</option>
                  <option>Trợ giúp tài khoản & huy hiệu</option>
                </select>
                <textarea
                  rows={2}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Mô tả chi tiết nội dung cần trợ giúp..."
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#DFD3C3] text-xs text-[#162A45] leading-relaxed"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#162A45] text-amber-200 font-bold text-xs shadow-xs font-heritage hover:brightness-110 active:scale-95 transition-all"
                >
                  Gửi phản hồi
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 8: ĐIỀU KHOẢN & CHÍNH SÁCH */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'terms_policy' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45] max-h-[85vh] overflow-y-auto"
            >
              <HeritageCornerDecoration color="#D9A05B" size={14} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <h3 className="text-sm font-black text-[#162A45] font-heritage">
                  Điều Khoản & Chính Sách
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-stone-700">
                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] space-y-1">
                  <h4 className="font-bold text-[#8B2626] font-heritage text-[11px]">
                    1. Quy định sử dụng & Bản quyền tư liệu
                  </h4>
                  <p className="text-[10px] text-stone-600">
                    Mọi hình ảnh, thước phim nhân chứng và tài liệu lịch sử được khai thác từ các bảo tàng quốc gia và nhân chứng lịch sử chính thống với mục đích giáo dục, tôn vinh di sản dân tộc.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] space-y-1">
                  <h4 className="font-bold text-[#8B2626] font-heritage text-[11px]">
                    2. Chính sách bảo mật dữ liệu GPS
                  </h4>
                  <p className="text-[10px] text-stone-600">
                    Tọa độ GPS của người dùng chỉ được sử dụng tức thời để tính toán khoảng cách đến di tích lịch sử và kích hoạt thử thách, tuyệt đối không lưu trữ hay chia sẻ cho bên thứ ba.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] space-y-1">
                  <h4 className="font-bold text-[#8B2626] font-heritage text-[11px]">
                    3. Trách nhiệm người gìn giữ di sản
                  </h4>
                  <p className="text-[10px] text-stone-600">
                    Người dùng cam kết giữ gìn thái độ tôn kính khi check-in tại các địa điểm di tích lịch sử, không phát tán thông tin sai lệch lịch sử.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MODAL 9: DIALOG XÁC NHẬN ĐĂNG XUẤT */}
        {/* --------------------------------------------------------- */}
        {activeModal === 'logout_confirm' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl bg-white border-2 border-red-300 p-5 shadow-2xl text-center space-y-4 text-[#162A45]"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-[#162A45] font-heritage">
                  Xác nhận đăng xuất?
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản{' '}
                  <span className="font-bold text-[#162A45]">
                    {userProfile.displayName || userProfile.name}
                  </span>{' '}
                  không?
                </p>
              </div>

              {/* 2 Nút: Hủy (Nền xám) & Đăng xuất (Nền đỏ đậm) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs font-heritage transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    logout();
                  }}
                  className="py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs font-heritage transition-colors shadow-md cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
