// src/components/auth/LoginScreen.tsx
"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export interface LoginScreenProps {
  onSuccess?: (user: { name: string; email: string }) => void;
  defaultLang?: "vi" | "en";
}

export function LoginScreen({ onSuccess, defaultLang = "vi" }: LoginScreenProps) {
  let appLogin: (() => void) | undefined;
  try {
    const app = useApp();
    appLogin = app?.login;
  } catch {
    // Outside AppProvider
  }

  const [mode, setMode] = useState<"login" | "register">("login");
  const [lang, setLang] = useState<"vi" | "en">(defaultLang);
  const [fullName, setFullName] = useState<string>("Lê Toàn Hiếu");
  const [email, setEmail] = useState<string>("hieu.legacy@keepers.vn");
  const [password, setPassword] = useState<string>("••••••••");

  const t = {
    vi: {
      subtitle: "HỆ THỐNG ĐỊNH DANH NGƯỜI GÌN GIỮ DI SẢN",
      titleLogin: "Mở Sổ Hộ Chiếu Di Sản",
      titleRegister: "Khởi Tạo Hộ Chiếu Di Sản Mới",
      loginTab: "Đăng nhập",
      registerTab: "Đăng ký tài khoản",
      nameLabel: "Họ và tên Người Gìn Giữ Di Sản",
      emailLabel: "Thư điện tử hoặc Mã định danh",
      passLabel: "Mật khẩu bảo mật",
      submitLogin: "Xác Thực & Tiếp Tục Hành Trình",
      submitRegister: "Cấp Phát Hộ Chiếu Di Sản",
      guestContinue: "Tiếp tục với tư cách Khách tham quan →",
    },
    en: {
      subtitle: "HERITAGE KEEPER IDENTIFICATION SYSTEM",
      titleLogin: "Open Your Heritage Passport",
      titleRegister: "Issue a New Heritage Passport",
      loginTab: "Log In",
      registerTab: "Register",
      nameLabel: "Full Name of Legacy Keeper",
      emailLabel: "Email or Keeper ID",
      passLabel: "Security Password",
      submitLogin: "Authenticate & Continue Journey",
      submitRegister: "Issue Heritage Passport",
      guestContinue: "Continue as Visiting Explorer →",
    },
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appLogin?.();
    onSuccess?.({ name: fullName || "Lê Toàn Hiếu", email });
  };

  const handleGuest = () => {
    appLogin?.();
    onSuccess?.({ name: "Lê Toàn Hiếu", email: "guest@keepers.vn" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F4EFE6] text-[#2B2118]">
      <div className="heritage-card max-w-md w-full rounded-3xl p-6 sm:p-8 border-2 border-[#B48327] space-y-6 relative overflow-hidden">
        {/* Thanh chọn ngôn ngữ VI / EN ở góc phải trên */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#8B1E1E] border-2 border-[#B48327] text-[#FAF6EE] flex items-center justify-center font-heritage font-bold text-sm shadow">
              LK
            </div>
            <div>
              <p className="font-heritage font-bold text-xs text-[#2B2118]">THE LEGACY KEEPERS</p>
              <p className="text-[10px] text-[#8B1E1E] font-bold">Người Gìn Giữ Di Sản</p>
            </div>
          </div>

          <div className="flex bg-[#EAE0D0] p-1 rounded-xl border border-[#C8AE7D]">
            <button
              type="button"
              onClick={() => setLang("vi")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                lang === "vi" ? "bg-[#8B1E1E] text-[#FAF6EE]" : "text-[#5C4938]"
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                lang === "en" ? "bg-[#8B1E1E] text-[#FAF6EE]" : "text-[#5C4938]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Tiêu đề Hộ chiếu */}
        <div className="text-center space-y-1 border-b border-[#C8AE7D] pb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8B1E1E]">
            {t.subtitle}
          </p>
          <h1 className="font-heritage text-2xl font-bold text-[#2B2118]">
            {mode === "login" ? t.titleLogin : t.titleRegister}
          </h1>
        </div>

        {/* Chuyển đổi Đăng nhập / Đăng ký */}
        <div className="grid grid-cols-2 gap-2 bg-[#EAE0D0] p-1.5 rounded-2xl border border-[#C8AE7D]">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === "login"
                ? "bg-[#2B2118] text-[#E6C786] shadow"
                : "text-[#5C4938]"
            }`}
          >
            {t.loginTab}
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === "register"
                ? "bg-[#2B2118] text-[#E6C786] shadow"
                : "text-[#5C4938]"
            }`}
          >
            {t.registerTab}
          </button>
        </div>

        {/* Biểu mẫu xác thực */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-[#5C4938] mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5C4938] mb-1">
              {t.emailLabel}
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4938] mb-1">
              {t.passLabel}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] border border-[#E6C786] font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
          >
            {mode === "login" ? t.submitLogin : t.submitRegister}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleGuest}
            className="text-xs font-bold text-[#5C4938] hover:text-[#8B1E1E] underline cursor-pointer"
          >
            {t.guestContinue}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
