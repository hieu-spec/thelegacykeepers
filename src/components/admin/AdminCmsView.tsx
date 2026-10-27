// src/components/admin/AdminCmsView.tsx
'use client';

import React, { useState } from 'react';
import { CustomLocationPin, VeteranProfile } from '@/types/system';
import { MapPin, Medal, PlusCircle, Save, Edit3, Trash2, Upload, CheckCircle2 } from 'lucide-react';
import { processAndUploadMedia } from '@/utils/mediaUpload';

interface AdminCmsViewProps {
  locations: CustomLocationPin[];
  veterans: VeteranProfile[];
  onSaveLocation: (pin: CustomLocationPin) => void;
  onDeleteLocation: (id: string) => void;
  onSaveVeteran: (vet: VeteranProfile) => void;
}

export default function AdminCmsView({
  locations,
  veterans,
  onSaveLocation,
  onDeleteLocation,
  onSaveVeteran,
}: AdminCmsViewProps) {
  const [activeTab, setActiveTab] = useState<'LOCATIONS' | 'VETERANS'>('LOCATIONS');
  const [savedNotice, setSavedNotice] = useState('');

  // State cho Form Pin Di tích (Đúng cấu trúc yêu cầu: Loại pin, Mức độ, Địa chỉ, Ảnh, Nội dung, Link tới game)
  const [pinForm, setPinForm] = useState<CustomLocationPin>({
    id: `loc_${Date.now()}`,
    name: '',
    pinType: 'landmark',
    rarity: 'rare',
    address: '',
    imageUrl: '',
    content: '',
    gameLink: 'story_ben_nha_rong',
    audioUrl: '',
    coordinates: { lat: 10.7769, lng: 106.6953 },
    rewardTitleId: 'title_saigon_keeper',
  });

  // State cho Form Hồ sơ Cựu chiến binh
  const [vetForm, setVetForm] = useState<VeteranProfile>({
    id: `vet_${Date.now()}`,
    fullName: '',
    rankAndRole: '',
    birthYear: 1945,
    hometown: '',
    unit: '',
    era: 'Kháng chiến chống Mỹ cứu nước',
    avatarUrl: '',
    videoUrl: '',
    biography: '',
    achievements: [{ year: '1975', title: '', description: '' }],
    medals: ['Huân chương Chiến công hạng Nhất'],
    visitAddress: '',
    coordinates: { lat: 10.7769, lng: 106.6953 },
    tributeCount: 0,
    tributes: [],
  });

  // Xử lý chọn file Audio hoặc Ảnh từ máy tính chuyển thành DataURL bền vững hoặc upload đám mây
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await processAndUploadMedia(file);
      callback(url);
    } catch {
      const fallbackUrl = URL.createObjectURL(file);
      callback(fallbackUrl);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLocation(pinForm);
    setSavedNotice(`Đã lưu địa danh "${pinForm.name}" vào hệ thống Bản đồ!`);
    setTimeout(() => setSavedNotice(''), 4000);
    setPinForm({
      ...pinForm,
      id: `loc_${Date.now()}`,
      name: '',
      address: '',
      content: '',
    });
  };

  const handleVeteranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVeteran(vetForm);
    setSavedNotice(`Đã đăng tải hồ sơ Cựu chiến binh "${vetForm.fullName}" thành công!`);
    setTimeout(() => setSavedNotice(''), 4000);
  };

  return (
    <div className="p-6 pb-36 max-w-7xl mx-auto text-white space-y-6">
      {/* Header Quản trị */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            TRUNG TÂM CHỈ HUY DỮ LIỆU • QUYỀN ADMIN
          </span>
          <h1 className="text-2xl font-extrabold mt-1">Quản Lý Di Tích & Hồ Sơ Cựu Chiến Binh</h1>
          <p className="text-xs text-slate-400">
            Mọi chỉnh sửa tại đây sẽ cập nhật trực tiếp lên Bản Đồ Tác Chiến, Tần Số Ký Ức và trang Nhân Chứng Sống.
          </p>
        </div>

        {/* Chuyển Tab */}
        <div className="flex bg-[#0E1726] p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('LOCATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'LOCATIONS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin size={15} /> 1. Quản Lý Pin Di Tích ({locations.length})
          </button>
          <button
            onClick={() => setActiveTab('VETERANS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'VETERANS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Medal size={15} /> 2. Quản Lý Cựu Chiến Binh ({veterans.length})
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {savedNotice}
        </div>
      )}

      {/* TAB 1: FORM THÊM / SỬA PIN ĐỊA DANH */}
      {activeTab === 'LOCATIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form nhập liệu bên trái */}
          <form
            onSubmit={handlePinSubmit}
            className="lg:col-span-7 bg-[#0E1726] border border-slate-800 rounded-3xl p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <PlusCircle size={18} /> Thêm / Chỉnh sửa File Pin Di Tích
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên Di tích / Địa danh *</label>
                <input
                  required
                  type="text"
                  value={pinForm.name}
                  onChange={(e) => setPinForm({ ...pinForm, name: e.target.value })}
                  placeholder="VD: Dinh Độc Lập"
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Loại Pin *</label>
                <select
                  value={pinForm.pinType}
                  onChange={(e) => setPinForm({ ...pinForm, pinType: e.target.value as any })}
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="landmark">Địa danh / Kiến trúc (Landmark)</option>
                  <option value="battlefield">Chiến trường (Battlefield)</option>
                  <option value="witness">Nhân chứng lịch sử (Witness)</option>
                  <option value="culture">Di sản văn hóa (Culture)</option>
                  <option value="story">Sự kiện lịch sử (Story)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mức độ hiếm *</label>
                <select
                  value={pinForm.rarity}
                  onChange={(e) => setPinForm({ ...pinForm, rarity: e.target.value as any })}
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="common">Phổ biến (Common)</option>
                  <option value="uncommon">Ít gặp (Uncommon)</option>
                  <option value="rare">Hiếm (Rare)</option>
                  <option value="legendary">Huyền thoại (Legendary)</option>
                  <option value="event">Sự kiện đặc biệt (Event)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Link / ID tới Minigame *</label>
                <input
                  type="text"
                  value={pinForm.gameLink}
                  onChange={(e) => setPinForm({ ...pinForm, gameLink: e.target.value })}
                  placeholder="VD: story_ben_nha_rong"
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Địa chỉ thực địa *</label>
              <input
                required
                type="text"
                value={pinForm.address}
                onChange={(e) => setPinForm({ ...pinForm, address: e.target.value })}
                placeholder="VD: 135 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh"
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vĩ độ (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={pinForm.coordinates.lat}
                  onChange={(e) =>
                    setPinForm({
                      ...pinForm,
                      coordinates: { ...pinForm.coordinates, lat: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kinh độ (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={pinForm.coordinates.lng}
                  onChange={(e) =>
                    setPinForm({
                      ...pinForm,
                      coordinates: { ...pinForm.coordinates, lng: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Link Ảnh hoặc Tải ảnh lên</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pinForm.imageUrl}
                    onChange={(e) => setPinForm({ ...pinForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-[#080E18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload size={14} /> Chọn file
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setPinForm({ ...pinForm, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tải lên Voice Audio (.mp3/.wav) (Tùy chọn)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pinForm.audioUrl || ''}
                    onChange={(e) => setPinForm({ ...pinForm, audioUrl: e.target.value })}
                    placeholder="Trống = Dùng AI TTS Tiếng Việt"
                    className="flex-1 bg-[#080E18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload size={14} /> Tải Voice
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setPinForm({ ...pinForm, audioUrl: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nội dung lịch sử & Kịch bản thuyết minh TTS *
              </label>
              <textarea
                required
                rows={4}
                value={pinForm.content}
                onChange={(e) => setPinForm({ ...pinForm, content: e.target.value })}
                placeholder="Nhập câu chuyện lịch sử tại đây. Hệ thống sẽ dùng nội dung này để hiển thị và đọc thuyết minh tiếng Việt..."
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl p-3.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg transition"
            >
              <Save size={16} /> Lưu Điểm Di Tích Vào Hệ Thống
            </button>
          </form>

          {/* Danh sách Pin hiện có bên phải (Bấm vào để sửa ngay) */}
          <div className="lg:col-span-5 bg-[#0E1726] border border-slate-800 rounded-3xl p-6 space-y-3 max-h-[680px] overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-2">
              Danh sách Pin hiện có ({locations.length})
            </h3>
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-3.5 rounded-2xl bg-[#09101B] border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-amber-400">
                    [{loc.rarity}] • {loc.pinType}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{loc.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{loc.address}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPinForm(loc)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs transition"
                    title="Chỉnh sửa Pin này"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteLocation(loc.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-500 text-xs transition"
                    title="Xóa Pin"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FORM ĐĂNG TẢI HỒ SƠ CỰU CHIẾN BINH */}
      {activeTab === 'VETERANS' && (
        <form
          onSubmit={handleVeteranSubmit}
          className="bg-[#0E1726] border border-slate-800 rounded-3xl p-6 space-y-4 max-w-4xl"
        >
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Medal size={18} /> Đăng Tải / Cập Nhật Hồ Sơ Cựu Chiến Binh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Họ tên & Quân hàm *</label>
              <input
                required
                type="text"
                value={vetForm.fullName}
                onChange={(e) => setVetForm({ ...vetForm, fullName: e.target.value })}
                placeholder="VD: Đại tá Vũ Đăng Toàn"
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Chức vụ / Vai trò lịch sử *</label>
              <input
                required
                type="text"
                value={vetForm.rankAndRole}
                onChange={(e) => setVetForm({ ...vetForm, rankAndRole: e.target.value })}
                placeholder="VD: Trưởng xe tăng 390"
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Năm sinh *</label>
              <input
                type="number"
                value={vetForm.birthYear}
                onChange={(e) => setVetForm({ ...vetForm, birthYear: parseInt(e.target.value) || 1945 })}
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Đơn vị chiến đấu *</label>
              <input
                required
                type="text"
                value={vetForm.unit}
                onChange={(e) => setVetForm({ ...vetForm, unit: e.target.value })}
                placeholder="VD: Lữ đoàn Xe tăng 203 - Quân đoàn 2"
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Địa chỉ thăm hỏi / Tri ân</label>
              <input
                type="text"
                value={vetForm.visitAddress}
                onChange={(e) => setVetForm({ ...vetForm, visitAddress: e.target.value })}
                placeholder="Địa chỉ nhà hoặc Hội Cựu chiến binh..."
                className="w-full bg-[#080E18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ảnh chân dung Cựu chiến binh</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vetForm.avatarUrl}
                  onChange={(e) => setVetForm({ ...vetForm, avatarUrl: e.target.value })}
                  placeholder="Link ảnh hoặc tải lên..."
                  className="flex-1 bg-[#080E18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <label className="bg-slate-800 px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1">
                  <Upload size={14} /> Ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setVetForm({ ...vetForm, avatarUrl: url }))}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Video Phỏng vấn (Link YouTube Embed hoặc Tải file MP4)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vetForm.videoUrl || ''}
                  onChange={(e) => setVetForm({ ...vetForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="flex-1 bg-[#080E18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <label className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1">
                  <Upload size={14} /> Video MP4
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setVetForm({ ...vetForm, videoUrl: url }))}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Lịch sử hoạt động & Chiến tích tiêu biểu *
            </label>
            <textarea
              required
              rows={4}
              value={vetForm.biography}
              onChange={(e) => setVetForm({ ...vetForm, biography: e.target.value })}
              placeholder="Mô tả chi tiết quá trình tham gia kháng chiến, các trận đánh tiêu biểu và lời nhắn nhủ cho thế hệ trẻ..."
              className="w-full bg-[#080E18] border border-slate-700 rounded-xl p-3.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg transition"
          >
            <Save size={16} /> Đăng Tải Hồ Sơ Cựu Chiến Binh Lên Hệ Thống
          </button>
        </form>
      )}
    </div>
  );
}
