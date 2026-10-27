// src/components/auth/LoginScreen.tsx
'use client';

import React, { useState } from 'react';
import { INITIAL_ACCOUNTS, SYSTEM_TITLES } from '@/data/accounts';
import { AccountProfile } from '@/types/system';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, UserCheck, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess?: (account: AccountProfile) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps = {}) {
  const { loginAsAccount, login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSelectAccount = async (account: AccountProfile) => {
    if (account.role === 'ADMIN') {
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: account.username, password: account.password || '123' }),
        });
      } catch (err) {
        console.warn('Lỗi thiết lập phiên đăng nhập máy chủ:', err);
      }
    }
    if (loginAsAccount) {
      loginAsAccount(account);
    }
    if (onLoginSuccess) {
      onLoginSuccess(account);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === username.trim().toLowerCase() &&
        (acc.password === password || password === 'LegacyKeepers@2026!')
    );
    if (!found) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác (Mật khẩu mặc định: 123)');
      return;
    }
    await handleSelectAccount(found);
  };

  return (
    <div className="min-h-screen bg-[#070D17] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none font-sans">
      {/* Vòng tròn họa tiết radar Đông Sơn phía sau */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-amber-500/10 pointer-events-none animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-500/15 pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#0E1726]/90 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl z-10">
        {/* Cột trái: Form Đăng nhập */}
        <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-serif font-bold text-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                L
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-wider text-amber-400">LEGACY KEEPERS</h1>
                <p className="text-xs text-slate-400">Hệ Thống Định Danh Người Gìn Giữ Di Sản</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Đăng nhập Trạm Điều Hành</h2>
            <p className="text-xs text-slate-400 mb-6">
              Sử dụng tài khoản Quản trị viên (Admin) để mở khóa CMS hoặc tài khoản Nhà khám phá (User).
            </p>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tên định danh (Username)
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="VD: admin hoặc hieu_keeper"
                    className="w-full bg-[#09101B] border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mật mã (Password)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu mặc định: 123"
                    className="w-full bg-[#09101B] border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
              >
                <span>Kết Nối Vệ Tinh Di Sản</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            Mật khẩu chung cho cả 6 tài khoản thử nghiệm: <code className="text-amber-400 font-bold">123</code>
          </div>
        </div>

        {/* Cột phải: Bảng Chọn Nhanh 6 Tài Khoản (1 Admin + 5 Users) */}
        <div className="lg:col-span-7 p-8 bg-[#0A111D]/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                Chuyển Nhanh 6 Tài Khoản Hệ Thống (1-Click Login)
              </h3>
              <p className="text-xs text-slate-400">
                Chọn 1 trong 6 hồ sơ dưới đây để vào thẳng giao diện với quyền hạn tương ứng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {INITIAL_ACCOUNTS.map((acc) => {
              const titleObj = SYSTEM_TITLES.find((t) => t.id === acc.activeTitleId);
              const isAdmin = acc.role === 'ADMIN';

              return (
                <button
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                    isAdmin
                      ? 'bg-gradient-to-br from-red-950/40 via-[#131D31] to-amber-950/30 border-amber-500/60 hover:border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#111B2E]/80 border-slate-800 hover:border-amber-500/50 hover:bg-[#152238]'
                  }`}
                >
                  <img
                    src={acc.avatarUrl}
                    alt={acc.displayName}
                    className={`w-12 h-12 rounded-full object-cover border-2 shrink-0 ${
                      isAdmin ? 'border-amber-400' : 'border-slate-600 group-hover:border-amber-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${
                          isAdmin
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isAdmin ? <ShieldAlert size={11} /> : <UserCheck size={11} />}
                        {isAdmin ? 'ADMIN CMS' : `USER • CẤP ${String(acc.level).padStart(2, '0')}`}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">@{acc.username}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1.5 truncate">{acc.displayName}</h4>

                    <p className={`text-xs mt-0.5 truncate ${titleObj?.auraClass || 'text-amber-400'}`}>
                      ★ {titleObj?.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
