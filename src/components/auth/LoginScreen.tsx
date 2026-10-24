'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  Landmark,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, loginAsDemoUser, userProfile } = useApp();

  const [email, setEmail] = useState('nam.legacy@keeper.vn');
  const [password, setPassword] = useState('DiSanVietNam@1975');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
    }, 450);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoUser();
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-[#FAF6F0] text-[#162A45] p-5 select-none">
      {/* Background Dong Son Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <DongSonSun size={600} color="#162A45" opacity={0.3} />
      </div>

      {/* Decorative Cloud */}
      <div className="absolute top-10 right-2 pointer-events-none opacity-25">
        <AncientCloudMotif color="#8B2626" opacity={0.4} />
      </div>

      {/* Top Brand Header */}
      <div className="pt-8 text-center space-y-2 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B2626] to-[#5C1414] text-[#FFE082] mx-auto flex items-center justify-center shadow-lg border-2 border-[#D9A05B]/60 ring-4 ring-[#D9A05B]/20"
        >
          <Landmark className="w-8 h-8 fill-current" />
        </motion.div>

        <div>
          <span className="text-[10px] font-bold text-[#D9A05B] uppercase tracking-widest font-heritage block">
            NGƯỜI GÌN GIỮ KÝ ỨC DI SẢN
          </span>
          <h1 className="text-xl font-black text-[#162A45] font-heritage tracking-wide">
            THE LEGACY KEEPERS
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-[280px] mx-auto leading-relaxed">
            Hành trình khám phá lịch sử Việt Nam qua định vị GPS, Minigame Storyteller và bảo tàng ký ức
          </p>
        </div>
      </div>

      {/* Login Card Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="w-full max-w-sm mx-auto rounded-3xl bg-white border border-[#E8DFD1] p-5 shadow-xl relative overflow-hidden space-y-4 z-10"
      >
        <HeritageCornerDecoration color="#D9A05B" size={14} />

        <div className="text-left border-b border-stone-100 pb-2">
          <h2 className="text-sm font-extrabold text-[#162A45] font-heritage">
            Đăng Nhập Tài Khoản
          </h2>
          <p className="text-[11px] text-stone-500">
            Tiếp tục hành trình lưu giữ trang sử hào hùng
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email / Username */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#D9A05B]" />
              <span>Email hoặc Username</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhakhampha@legacykeepers.vn"
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-[#DFD3C3] text-xs font-medium text-[#162A45] focus:outline-none focus:ring-2 focus:ring-[#8B2626]/30 focus:border-[#8B2626]"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-stone-600 uppercase font-heritage flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#D9A05B]" />
                <span>Mật khẩu</span>
              </label>
              <button
                type="button"
                className="text-[10px] text-[#8B2626] font-bold hover:underline font-heritage"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-stone-50 border border-[#DFD3C3] text-xs font-medium text-[#162A45] focus:outline-none focus:ring-2 focus:ring-[#8B2626]/30 focus:border-[#8B2626]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all font-heritage cursor-pointer border border-[#8B2626]"
          >
            {isLoading ? (
              <span>Đang kết nối...</span>
            ) : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold text-stone-400 uppercase font-heritage">
            HOẶC
          </span>
        </div>

        {/* Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#162A45] via-[#1E375A] to-[#0E1E33] text-amber-200 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all font-heritage border border-[#D9A05B]/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FFE082]" />
          <span>⚡ Đăng nhập nhanh bằng tài khoản mẫu</span>
        </button>
      </motion.div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-stone-500 py-3 z-10 space-y-1">
        <p className="flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bảo mật dữ liệu định vị & Tôn vinh lịch sử dân tộc</span>
        </p>
        <p>© 2026 The Legacy Keepers · Phiên bản 2.4.0</p>
      </div>
    </div>
  );
};
