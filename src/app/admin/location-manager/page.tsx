'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation, LocationRarity, LocationContentType } from '@/types/location';
import { MOCK_STORIES } from '@/data/stories';
import {
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Save,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Gamepad2,
  BookOpen,
  UserCheck,
  FileCode,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
  Radio,
  Compass,
} from 'lucide-react';

// Preset sample photos for fast demo
const PRESET_IMAGES = [
  { label: 'Bến Nhà Rồng', url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Dinh Độc Lập', url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cố Đô Huế', url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Hồ Gươm / Tháp Rùa', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Kiến Trúc Pháp', url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Di tích Chiến khu', url: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80' },
];

// Preset City Coordinates
const CITY_COORDS = [
  { name: 'TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { name: 'Huế', lat: 16.4637, lng: 107.5909 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
];

const DEFAULT_BLANK_LOCATION: HistoricalLocation = {
  id: '',
  name: '',
  subtitle: '',
  categoryTitle: 'Di tích Lịch sử Cấp Quốc gia',
  address: '',
  coordinates: { lat: 10.77689, lng: 106.69547 },
  rarity: 'uncommon',
  contentType: 'landmark',
  discoveryRadius: 5.0,
  interactionRadius: 50,
  historicalPeriod: 'Thời kỳ Kháng chiến chống Mỹ cứu nước',
  yearEstablished: '1965',
  imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80',
  historicalSummary: '',
  fullDescription: '',
  witnessStory: {
    id: '',
    title: '',
    duration: '03:30',
    speakerName: '',
    speakerRole: 'Nhân chứng lịch sử / Cựu chiến binh',
    quote: '',
    fullStory: '',
    historicalSource: 'Trung tâm Lưu trữ Quốc gia',
  },
  storyChallengeIds: ['story-dinh-doc-lap-1975'],
  rewardExp: 300,
  tags: ['Di tích', 'Lịch sử'],
};

export default function LocationManagerAdminPage() {
  const {
    locations,
    addOrUpdateLocation,
    removeLocation,
    currentGps,
    showToast,
  } = useApp();

  // Selected Location for Editing (or blank for creating new)
  const [formData, setFormData] = useState<HistoricalLocation>(DEFAULT_BLANK_LOCATION);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');

  // UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [rawJsonPaste, setRawJsonPaste] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered List
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchSearch =
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRarity = filterRarity === 'all' || loc.rarity === filterRarity;
      const matchType = filterType === 'all' || loc.contentType === filterType;
      return matchSearch && matchRarity && matchType;
    });
  }, [locations, searchQuery, filterRarity, filterType]);

  // Load Location into Form for Editing
  const handleSelectToEdit = (loc: HistoricalLocation) => {
    setFormData(JSON.parse(JSON.stringify(loc)));
    setIsEditMode(true);
    setActiveTab('form');
    setTagInput((loc.tags || []).join(', '));
  };

  // Reset to New Blank Form
  const handleCreateNew = () => {
    const newId = `di-tich-${Date.now().toString(36)}`;
    setFormData({
      ...DEFAULT_BLANK_LOCATION,
      id: newId,
      coordinates: { ...currentGps },
      witnessStory: {
        ...DEFAULT_BLANK_LOCATION.witnessStory,
        id: `witness-${newId}`,
      },
    });
    setIsEditMode(false);
    setActiveTab('form');
    setTagInput('Di tích, Lịch sử');
  };

  // Update Field Helper
  const updateField = (field: keyof HistoricalLocation, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update Nested Witness Story Field
  const updateWitnessField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      witnessStory: {
        ...prev.witnessStory,
        [field]: value,
      },
    }));
  };

  // Save via API & Update AppContext (Method 2: Full Automation)
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Lỗi nhập liệu', 'Vui lòng nhập Tên địa danh di tích!', 'cinnabar');
      return;
    }

    // Auto-generate ID if missing
    let finalId = formData.id.trim();
    if (!finalId) {
      finalId = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Parse tags
    const finalTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: HistoricalLocation = {
      ...formData,
      id: finalId,
      tags: finalTags,
      witnessStory: {
        ...formData.witnessStory,
        id: formData.witnessStory.id || `witness-${finalId}`,
        title: formData.witnessStory.title || `Ký ức tại ${formData.name}`,
      },
    };

    setIsSaving(true);
    try {
      // Call Next.js API route to persist directly into src/data/locations.ts
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', location: payload }),
      });

      const data = await res.json();

      if (data.success) {
        // Update live AppContext state immediately
        addOrUpdateLocation(payload);
        setFormData(payload);
        setIsEditMode(true);
        showToast('Đã lưu thành công!', data.message || 'Dữ liệu đã được cập nhật vào mã nguồn.', 'emerald');
      } else {
        throw new Error(data.error || 'Không thể lưu vào file dữ liệu');
      }
    } catch (err: any) {
      // Fallback: update AppContext locally
      addOrUpdateLocation(payload);
      showToast('Đã cập nhật giao diện', 'Lưu ý: Không thể ghi file do môi trường, dữ liệu đã lưu vào bộ nhớ tạm.', 'gold');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete via API
  const handleDeleteLocation = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa địa danh "${name}" (${id}) không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/locations?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        removeLocation(id);
        if (formData.id === id) {
          handleCreateNew();
        }
        showToast('Đã xóa địa danh', `Đã xóa "${name}" thành công!`, 'emerald');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      removeLocation(id);
      showToast('Đã xóa khỏi giao diện', 'Đã cập nhật danh sách hiển thị.', 'gold');
    }
  };

  // Copy Single Object JSON to Clipboard
  const handleCopyJson = (loc: HistoricalLocation) => {
    const jsonStr = JSON.stringify(loc, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedId(loc.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Đã sao chép JSON!', 'Bạn có thể dán vào file locations.ts hoặc gửi cho thành viên khác.', 'emerald');
  };

  // Parse & Apply Pasted JSON
  const handleApplyPastedJson = () => {
    try {
      const parsed = JSON.parse(rawJsonPaste);
      if (!parsed.name) {
        throw new Error('Thiếu trường "name" trong object JSON');
      }
      setFormData(parsed);
      setIsEditMode(true);
      setTagInput((parsed.tags || []).join(', '));
      setIsJsonModalOpen(false);
      setRawJsonPaste('');
      showToast('Đã nạp JSON thành công!', `Đã điền thông tin địa danh "${parsed.name}".`, 'emerald');
    } catch (err: any) {
      alert(`JSON không hợp lệ: ${err.message}`);
    }
  };

  // Export all locations to backup file
  const handleExportBackupFile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(locations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `locations_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã tải file Backup!', 'File JSON đã được tải về máy của bạn.', 'emerald');
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* 1. TOP HEADER ADMIN BAR */}
      <header className="sticky top-0 z-40 bg-[#0B1422]/95 backdrop-blur-xl border-b border-[#D4AF37]/30 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#D4AF37] text-amber-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Bản Đồ Radar</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-sm sm:text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFE082] via-[#D4AF37] to-[#F59E0B] uppercase">
                  CMS Quản Trị Địa Danh & Pin Di Tích
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Thêm, sửa & cấu hình điểm đánh dấu GPS trực tiếp trên bản đồ
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Pin Mới</span>
            </button>

            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-[#D4AF37]/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:border-[#D4AF37] active:scale-95 transition-all"
              title="Dán đoạn mã JSON để chỉnh sửa nhanh"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dán JSON Sửa Nhanh</span>
            </button>

            <button
              onClick={handleExportBackupFile}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-200 hover:border-slate-700 active:scale-95 transition-all"
              title="Xuất bản sao lưu JSON toàn bộ hệ thống"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN WORKSPACE */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIST OF EXISTING PINS (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          {/* Search & Filter Header */}
          <div className="p-3 rounded-2xl bg-[#0B1422]/90 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                Danh Sách Địa Danh ({filteredLocations.length}/{locations.length})
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                Click vào thẻ để sửa
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên, địa chỉ, ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Tất cả thể loại</option>
                <option value="landmark">Kiến trúc (Landmark)</option>
                <option value="culture">Văn hóa (Culture)</option>
                <option value="witness">Nhân chứng (Witness)</option>
                <option value="battlefield">Chiến trường (Battlefield)</option>
                <option value="story">Sự kiện (Story)</option>
              </select>

              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Tất cả độ hiếm</option>
                <option value="common">Thường (Common)</option>
                <option value="uncommon">Hiếm (Uncommon)</option>
                <option value="legendary">Huyền thoại (Legendary)</option>
                <option value="event">Sự kiện (Event)</option>
              </select>
            </div>
          </div>

          {/* Location Cards Scroll Area */}
          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = formData.id === loc.id;
              const isLegendary = loc.rarity === 'legendary';
              const isEvent = loc.rarity === 'event';

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectToEdit(loc)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative group flex gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1E1B10] to-[#121824] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-[#0B1422]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#0F1B2E]'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative">
                    <img
                      src={loc.imageUrl}
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <span
                      className={`absolute bottom-0 inset-x-0 text-[8px] text-center font-bold uppercase py-0.5 ${
                        isLegendary
                          ? 'bg-amber-500 text-slate-950'
                          : isEvent
                          ? 'bg-red-500 text-white'
                          : 'bg-black/80 text-slate-300'
                      }`}
                    >
                      {loc.rarity}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-200">
                          {loc.name}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">
                          ID: {loc.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {loc.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                      <span className="text-amber-300/80 font-mono">
                        {loc.coordinates.lat.toFixed(4)}, {loc.coordinates.lng.toFixed(4)}
                      </span>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyJson(loc);
                          }}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-300"
                          title="Sao chép JSON pin này"
                        >
                          {copiedId === loc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(loc.id, loc.name);
                          }}
                          className="p-1 rounded-lg hover:bg-red-950 text-slate-500 hover:text-red-400"
                          title="Xóa pin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: INTELLIGENT FORM EDITOR & JSON INSPECTOR (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-3">
          {/* Form Header & Mode Tabs */}
          <div className="p-3 rounded-2xl bg-[#0B1422]/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-[#D4AF37]' : 'bg-emerald-400 animate-ping'}`} />
              <h3 className="text-xs font-bold text-amber-200">
                {isEditMode ? `Đang Chỉnh Sửa: ${formData.name || formData.id}` : 'Tạo Điểm Đánh Dấu (Pin) Mới'}
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === 'form'
                    ? 'bg-[#D4AF37] text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Giao Diện Nhập Liệu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === 'json'
                    ? 'bg-[#D4AF37] text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mã JSON Trực Quan
              </button>
            </div>
          </div>

          {activeTab === 'form' ? (
            /* FORM EDITOR */
            <form onSubmit={handleSaveLocation} className="space-y-4">
              {/* BLOCK 1: THÔNG TIN CƠ BẢN */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  1. Thông Tin Nhận Diện & Định Danh
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Tên Địa Danh <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Ví dụ: Cột Cờ Hà Nội"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      ID Mã Định Danh (Slug)
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => updateField('id', e.target.value)}
                      placeholder="Ví dụ: cot-co-ha-noi"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Phụ Đề / Tên Gọi Khác
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      placeholder="Ví dụ: Kỳ đài Hà Nội thế kỷ 19"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Danh Hiệu / Phân Hạng
                    </label>
                    <input
                      type="text"
                      value={formData.categoryTitle}
                      onChange={(e) => updateField('categoryTitle', e.target.value)}
                      placeholder="Ví dụ: Di tích Quốc gia Đặc biệt"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* BLOCK 2: PHÂN LOẠI & ĐỘ HIẾM (BẮT BUỘC THEO ĐỀ BÀI) */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                  2. Phân Loại Pin & Mức Độ Hiếm (Rarity)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Loại Pin (Content Type) <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => updateField('contentType', e.target.value as LocationContentType)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-bold focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="landmark">🏛️ Địa danh Kiến trúc Đô thị (Landmark)</option>
                      <option value="culture">🏮 Di sản Văn hóa - Lịch sử (Culture)</option>
                      <option value="witness">🎙️ Điểm Nhân chứng Sống (Witness)</option>
                      <option value="battlefield">⚔️ Chiến trường / Căn cứ ngầm (Battlefield)</option>
                      <option value="story">📜 Dấu ấn Sự kiện Toàn quốc (Story Event)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Mức Độ Hiếm (Rarity) <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.rarity}
                      onChange={(e) => updateField('rarity', e.target.value as LocationRarity)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-bold focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="common">🔵 Thường (Common - Mở trong 1.5km)</option>
                      <option value="uncommon">🟢 Hiếm (Uncommon - Mở trong 5km)</option>
                      <option value="legendary">🟡 Cực Hiếm / Huyền Thoại (Legendary - 20km)</option>
                      <option value="event">🔴 Sự Kiện Lịch Sử Trọng Điểm (Event - 50km)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Bán Kính Phát Hiện Trên Radar (km)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="100"
                      value={formData.discoveryRadius}
                      onChange={(e) => updateField('discoveryRadius', parseFloat(e.target.value) || 5)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Bán Kính Tương Tác GPS (Mét - ≤ 35m mở game)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="10"
                      max="200"
                      value={formData.interactionRadius}
                      onChange={(e) => updateField('interactionRadius', parseInt(e.target.value) || 50)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* BLOCK 3: TỌA ĐỘ GPS & ĐỊA CHỈ */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                    3. Vị Trí Tọa Độ GPS & Địa Chỉ
                  </span>

                  {/* Quick Pick Location Buttons */}
                  <button
                    type="button"
                    onClick={() => updateField('coordinates', { ...currentGps })}
                    className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg hover:bg-emerald-900 transition-all flex items-center gap-1"
                  >
                    <span>Lấy Tọa Độ Hiện Tại ({currentGps.lat.toFixed(4)}, {currentGps.lng.toFixed(4)})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Vĩ Độ (Latitude) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      required
                      value={formData.coordinates.lat}
                      onChange={(e) =>
                        updateField('coordinates', {
                          ...formData.coordinates,
                          lat: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Kinh Độ (Longitude) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      required
                      value={formData.coordinates.lng}
                      onChange={(e) =>
                        updateField('coordinates', {
                          ...formData.coordinates,
                          lng: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* City Coordinates Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Chọn nhanh tọa độ:</span>
                  {CITY_COORDS.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() =>
                        updateField('coordinates', {
                          lat: city.lat,
                          lng: city.lng,
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-200 hover:border-slate-700"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Địa Chỉ Cụ Thể <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Ví dụ: 19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* BLOCK 4: HÌNH ẢNH TRỰC QUAN */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  4. Hình Ảnh Địa Danh (URL & Preview)
                </span>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Link Ảnh (Image URL) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Preset Image Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Chọn ảnh mẫu có sẵn:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => updateField('imageUrl', img.url)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-200 hover:border-[#D4AF37]"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                {formData.imageUrl && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
                    <img
                      src={formData.imageUrl}
                      alt="Xem trước ảnh"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded-md text-amber-200 border border-slate-800 backdrop-blur-sm">
                      Xem Trước Ảnh Địa Danh
                    </span>
                  </div>
                )}
              </div>

              {/* BLOCK 5: NỘI DUNG LỊCH SỬ & LIÊN KẾT MINIGAME */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  5. Nội Dung Lịch Sử & Liên Kết Tới Game (Minigame Story Link)
                </span>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Link Tới Game (Minigame Story ID) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.storyChallengeIds[0] || ''}
                    onChange={(e) => updateField('storyChallengeIds', [e.target.value])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 font-bold focus:outline-none focus:border-[#D4AF37]"
                  >
                    {MOCK_STORIES.map((st) => (
                      <option key={st.id} value={st.id}>
                        🎮 {st.title} ({st.period})
                      </option>
                    ))}
                    <option value="custom">Nhập ID Minigame Tùy Chọn...</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Tóm Tắt Lịch Sử (Hiển thị nổi bật trên thẻ Radar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.historicalSummary}
                    onChange={(e) => updateField('historicalSummary', e.target.value)}
                    placeholder="Tóm tắt dấu ấn lịch sử hào hùng..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Nội Dung Mô Tả Chi Tiết (Full Historical Story)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => updateField('fullDescription', e.target.value)}
                    placeholder="Mô tả toàn diện kiến trúc, các sự kiện gắn liền với di tích..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Thời Kỳ Lịch Sử
                    </label>
                    <input
                      type="text"
                      value={formData.historicalPeriod}
                      onChange={(e) => updateField('historicalPeriod', e.target.value)}
                      placeholder="Ví dụ: Kháng chiến chống Pháp (1911)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Thưởng EXP Khám Phá
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={formData.rewardExp}
                      onChange={(e) => updateField('rewardExp', parseInt(e.target.value) || 200)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Thẻ Phân Loại (Tags - Phân tách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Di tích, Lịch sử, Bác Hồ, Kháng chiến"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* BLOCK 6: NHÂN CHỨNG LỊCH SỬ & AUDIO */}
              <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  6. Thước Phim Ký Ức & Nhân Chứng Lịch Sử
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Tên Nhân Chứng / Diễn Giả
                    </label>
                    <input
                      type="text"
                      value={formData.witnessStory?.speakerName || ''}
                      onChange={(e) => updateWitnessField('speakerName', e.target.value)}
                      placeholder="Ví dụ: Đại tá Vũ Đăng Toàn"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Vai Trò / Chức Danh
                    </label>
                    <input
                      type="text"
                      value={formData.witnessStory?.speakerRole || ''}
                      onChange={(e) => updateWitnessField('speakerRole', e.target.value)}
                      placeholder="Ví dụ: Anh hùng Lực lượng Vũ trang Nhân dân"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Trích Dẫn Lời Kể Xúc Động
                  </label>
                  <textarea
                    rows={2}
                    value={formData.witnessStory?.quote || ''}
                    onChange={(e) => updateWitnessField('quote', e.target.value)}
                    placeholder="“Khi tiếng bom dứt, chúng tôi ùa vào nóc Dinh cắm cờ...”"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-200 italic focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON BAR */}
              <div className="sticky bottom-4 z-20 p-3 rounded-2xl bg-[#0B1422]/98 border-2 border-[#D4AF37] shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyJson(formData)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-[#D4AF37]/50 text-amber-200 text-xs font-bold hover:border-[#D4AF37] flex items-center gap-1.5 active:scale-95 transition-all"
                  title="Sao chép object JSON hiện tại"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON Pin Này</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold active:scale-95 transition-all"
                  >
                    Hủy / Làm Mới
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isEditMode ? 'CẬP NHẬT PIN (LƯU VÀO FILE)' : 'LƯU PIN MỚI VÀO HỆ THỐNG'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* TAB 2: LIVE JSON INSPECTOR */
            <div className="p-4 rounded-2xl bg-[#0B1422]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-[#D4AF37]" />
                  Mã JSON Chuẩn của "{formData.name || 'Địa danh'}"
                </span>
                <button
                  onClick={() => handleCopyJson(formData)}
                  className="px-3 py-1 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép JSON</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[500px]">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </main>

      {/* MODAL: PASTE RAW JSON TO EDIT / CREATE */}
      <AnimatePresence>
        {isJsonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#0B1422] border-2 border-[#D4AF37] rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#D4AF37]" />
                  Dán Mã JSON Để Tự Động Điền & Sửa
                </h3>
                <button
                  onClick={() => setIsJsonModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕ Đóng
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Dán một đối tượng JSON địa danh vào đây. Hệ thống sẽ tự động phân tích và nạp vào toàn bộ các trường của form:
              </p>

              <textarea
                rows={10}
                value={rawJsonPaste}
                onChange={(e) => setRawJsonPaste(e.target.value)}
                placeholder='{\n  "id": "ho-guom",\n  "name": "Hồ Gươm",\n  ...\n}'
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#D4AF37]"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedJson}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg"
                >
                  Phân Tích & Điền Vào Form
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
