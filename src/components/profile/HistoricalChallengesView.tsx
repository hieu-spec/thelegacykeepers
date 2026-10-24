'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import {
  ArrowLeft,
  Trophy,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Settings,
  Sparkles,
  Signal,
  Check,
  X,
  Play,
  RotateCcw,
  Landmark,
  Award,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface HistoricalChallengesViewProps {
  onBack: () => void;
}

type ChallengeFilterTab = 'all' | 'in_progress' | 'completed';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface HistoricalChallengeItem {
  id: string;
  title: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  rewardExp: number;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  imageUrl: string;
  quizQuestion: string;
  quizOptions: QuizOption[];
  historicalExplanation: string;
}

// 7 comprehensive challenge cards, including the 3 mandatory cards
const INITIAL_CHALLENGES: HistoricalChallengeItem[] = [
  {
    id: 'challenge-dinh-doc-lap',
    title: 'Mảnh ghép lịch sử: Dinh Độc Lập',
    difficulty: 'Trung bình',
    rewardExp: 150,
    description: 'Tái hiện sự kiện 30/4/1975 qua các mảnh ghép lịch sử.',
    status: 'in_progress', // Đang làm
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Vào trưa ngày 30/4/1975, cỗ xe tăng nào thuộc Lữ đoàn 203 đã húc đổ cánh cổng chính Dinh Độc Lập, tiến vào cắm cờ chiến thắng?',
    quizOptions: [
      { id: 'opt-a', text: 'Xe tăng số hiệu 390 (Trung đội trưởng Vũ Đăng Toàn)', isCorrect: true },
      { id: 'opt-b', text: 'Xe tăng số hiệu 843 (Đại đội trưởng Bùi Quang Thận)', isCorrect: false },
      { id: 'opt-c', text: 'Xe tăng số hiệu 985 (Tiểu đoàn 1)', isCorrect: false },
    ],
    historicalExplanation: 'Đúng 11h30 trưa 30/4/1975, xe tăng số hiệu 390 do Vũ Đăng Toàn chỉ huy đã húc tung cánh cổng chính Dinh Độc Lập, mở đường cắm lá cờ chiến thắng lên nóc dinh.',
  },
  {
    id: 'challenge-timeline-vietnam',
    title: 'Dòng thời gian Việt Nam',
    difficulty: 'Dễ',
    rewardExp: 100,
    description: 'Khám phá các mốc son lịch sử qua từng giai đoạn.',
    status: 'not_started', // Chưa bắt đầu
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Sự kiện Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình diễn ra vào ngày tháng năm nào?',
    quizOptions: [
      { id: 'opt-a', text: 'Ngày 2 tháng 9 năm 1945', isCorrect: true },
      { id: 'opt-b', text: 'Ngày 19 tháng 8 năm 1945', isCorrect: false },
      { id: 'opt-c', text: 'Ngày 7 tháng 5 năm 1954', isCorrect: false },
    ],
    historicalExplanation: 'Ngày 2/9/1945, trước hàng vạn đồng bào tại Quảng trường Ba Đình Hà Nội, Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.',
  },
  {
    id: 'challenge-dau-an-saigon',
    title: 'Dấu ấn lịch sử Sài Gòn',
    difficulty: 'Khó',
    rewardExp: 250,
    description: 'Khám phá những địa danh biểu tượng của Sài Gòn xưa và nay.',
    status: 'completed', // Đã hoàn thành
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Đại thắng Mùa Xuân 1975 giải phóng Sài Gòn mang tên chiến dịch lịch sử nào?',
    quizOptions: [
      { id: 'opt-a', text: 'Chiến dịch Hồ Chí Minh', isCorrect: true },
      { id: 'opt-b', text: 'Chiến dịch Tây Nguyên', isCorrect: false },
      { id: 'opt-c', text: 'Chiến dịch Huế - Đà Nẵng', isCorrect: false },
    ],
    historicalExplanation: 'Chiến dịch Hồ Chí Minh lịch sử bắt đầu từ ngày 26/4 và toàn thắng trưa 30/4/1975, hoàn thành thống nhất non sông Việt Nam.',
  },
  {
    id: 'challenge-ben-nha-rong-1911',
    title: 'Bến Nhà Rồng: Người Đi Tìm Đường Cứu Nước',
    difficulty: 'Dễ',
    rewardExp: 120,
    description: 'Hành trình ra đi tìm đường cứu nước của người thanh niên Văn Ba năm 1911.',
    status: 'in_progress', // Đang làm
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Người thanh niên Nguyễn Tất Thành đã bước lên con tàu nào từ Bến cảng Nhà Rồng vào ngày 5/6/1911?',
    quizOptions: [
      { id: 'opt-a', text: 'Tàu Amiral Latouche-Tréville', isCorrect: true },
      { id: 'opt-b', text: 'Tàu La Bourdonnais', isCorrect: false },
      { id: 'opt-c', text: 'Tàu Đô đốc Courbet', isCorrect: false },
    ],
    historicalExplanation: 'Ngày 5/6/1911, anh Ba (Nguyễn Tất Thành) nhận chân phụ bếp trên tàu Amiral Latouche-Tréville để bắt đầu hành trình bôn ba tìm đường cứu nước.',
  },
  {
    id: 'challenge-ham-biet-dong',
    title: 'Bí Mật Căn Hầm Biệt Động Sài Gòn',
    difficulty: 'Trung bình',
    rewardExp: 180,
    description: 'Kho vũ khí ngầm và cuộc tập kích táo bạo Tết Mậu Thân 1968.',
    status: 'in_progress', // Đang làm
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Căn hầm chứa vũ khí ngầm của Biệt động Sài Gòn được ngụy trang dưới vỏ bọc buôn bán gì?',
    quizOptions: [
      { id: 'opt-a', text: 'Hiệu buôn tơ lụa và may mặc của ông Năm Lai', isCorrect: true },
      { id: 'opt-b', text: 'Hiệu thuốc đông y gia truyền', isCorrect: false },
      { id: 'opt-c', text: 'Xưởng chế tác vàng bạc đá quý', isCorrect: false },
    ],
    historicalExplanation: 'Căn hầm bí mật tại số 287/70 Nguyễn Đình Chiểu được ngụy trang hoàn hảo dưới xưởng may tơ lụa của ông Trần Văn Lai.',
  },
  {
    id: 'challenge-hao-khi-ba-dinh',
    title: 'Hào Khí Ba Đình: Tuyên Ngôn Độc Lập',
    difficulty: 'Khó',
    rewardExp: 300,
    description: 'Ngày 2/9/1945 khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    status: 'completed', // Đã hoàn thành
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Câu nói bất hủ của Bác Hồ khi đang đọc Tuyên ngôn Độc lập trước đồng bào là gì?',
    quizOptions: [
      { id: 'opt-a', text: '“Tôi nói đồng bào nghe rõ không?”', isCorrect: true },
      { id: 'opt-b', text: '“Không có gì quý hơn độc lập tự do!”', isCorrect: false },
      { id: 'opt-c', text: '“Đoàn kết, đoàn kết, đại đoàn kết!”', isCorrect: false },
    ],
    historicalExplanation: 'Câu hỏi giản dị, ấm áp của Chủ tịch Hồ Chí Minh đã lay động hàng triệu trái tim nhân dân cả nước trong ngày Tết độc lập đầu tiên.',
  },
  {
    id: 'challenge-dat-thep-cu-chi',
    title: 'Kỳ Quan Đất Thép Củ Chi',
    difficulty: 'Trung bình',
    rewardExp: 200,
    description: 'Hệ thống địa đạo 250km và huyền thoại Bếp Hoàng Cầm giấu khói.',
    status: 'completed', // Đã hoàn thành
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=800&q=80',
    quizQuestion: 'Đặc điểm độc đáo nhất của Bếp Hoàng Cầm được du kích Củ Chi sử dụng là gì?',
    quizOptions: [
      { id: 'opt-a', text: 'Tản khói dưới lòng đất không để máy bay phát hiện', isCorrect: true },
      { id: 'opt-b', text: 'Sử dụng dầu hỏa thay cho củi khô', isCorrect: false },
      { id: 'opt-c', text: 'Đun nấu hoàn toàn không tạo nhiệt', isCorrect: false },
    ],
    historicalExplanation: 'Bếp Hoàng Cầm với hệ thống rãnh tản khói dài uốn lượn dưới đất đã giúp bộ đội nấu ăn ban ngày mà máy bay địch không thể phát hiện.',
  },
];

export const HistoricalChallengesView: React.FC<HistoricalChallengesViewProps> = ({ onBack }) => {
  const {
    userProfile,
    updateUserProfile,
    setProfileSubScreen,
    showToast,
  } = useApp();

  // Challenges State
  const [challenges, setChallenges] = useState<HistoricalChallengeItem[]>(INITIAL_CHALLENGES);
  const [activeTab, setActiveTab] = useState<ChallengeFilterTab>('all');

  // Completed challenges count: base 12, incrementing when user completes a challenge
  const [completedBonusCount, setCompletedBonusCount] = useState(0);

  // Modal State for Quick Interactive Challenge (Quiz 1 câu hỏi nhanh)
  const [activeQuizChallenge, setActiveQuizChallenge] = useState<HistoricalChallengeItem | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Overall completed count: base 12 from prompt, dynamically updates to 13, 14...
  const totalCompletedCount = 12 + completedBonusCount;
  const totalChallengesGoal = 20; // Con số 12/20
  const progressRatio = Math.min(Math.round((totalCompletedCount / totalChallengesGoal) * 100), 100);

  // Filter challenges based on tab
  const filteredChallenges = challenges.filter((c) => {
    if (activeTab === 'in_progress') {
      return c.status === 'in_progress';
    }
    if (activeTab === 'completed') {
      return c.status === 'completed';
    }
    return true; // 'all'
  });

  // Open Quiz Modal
  const handleOpenChallengeModal = (challenge: HistoricalChallengeItem) => {
    setActiveQuizChallenge(challenge);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  // Complete Challenge inside Modal
  const handleConfirmComplete = () => {
    if (!activeQuizChallenge) return;

    setIsCompleting(true);

    setTimeout(() => {
      // 1. Update challenge status in list to 'completed'
      setChallenges((prev) =>
        prev.map((item) =>
          item.id === activeQuizChallenge.id
            ? { ...item, status: 'completed' }
            : item
        )
      );

      // 2. Increment completed count from 12 to 13
      setCompletedBonusCount((prev) => prev + 1);

      // 3. Update User Profile EXP & Stats
      const expReward = activeQuizChallenge.rewardExp;
      updateUserProfile({
        currentExp: userProfile.currentExp + expReward,
        stats: {
          ...userProfile.stats,
          fragmentsRestored: userProfile.stats.fragmentsRestored + 1,
        },
      });

      // 4. Show celebratory toast
      showToast(
        `🎉 Hoàn thành: ${activeQuizChallenge.title}!`,
        `Nhận ngay +${expReward} EXP! Tiến trình nâng lên ${totalCompletedCount + 1}/20 thử thách.`,
        'gold'
      );

      // 5. Reset and close modal
      setIsCompleting(false);
      setActiveQuizChallenge(null);
    }, 400);
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
      {/* 3.1. HEADER TRÊN CÙNG */}
      {/* ========================================================= */}
      <div className="pt-14 px-4 pb-2 z-20 flex items-center justify-between border-b border-[#E8DFD1]/80 bg-[#FAF6F0]/90 backdrop-blur-md">
        {/* Nút Quay lại (<) */}
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-[#162A45] shadow-xs active:scale-95 hover:border-[#8B2626]/40 transition-all cursor-pointer"
          title="Quay lại"
        >
          <ChevronLeft className="w-5 h-5 text-[#8B2626]" />
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

        {/* Nút Cài đặt (icon bánh răng) */}
        <button
          onClick={() => setProfileSubScreen('settings')}
          className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-stone-600 shadow-xs active:scale-95 hover:text-[#162A45] hover:border-[#8B2626]/40 transition-all cursor-pointer"
          title="Cài đặt nhanh"
        >
          <Settings className="w-4 h-4 text-stone-600" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3.1. BANNER TIẾN TRÌNH THỬ THÁCH (XANH NAVY) */}
      {/* ========================================================= */}
      <div className="px-4 pt-3 z-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#162A45] via-[#1C3556] to-[#0E1E33] p-4 text-white shadow-md relative overflow-hidden border border-[#D9A05B]/30 space-y-3">
          {/* Faint watermark in corner */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <DongSonSun size={200} color="#FFE082" opacity={0.6} />
          </div>

          {/* Banner Row: Cúp vàng tròn + Tiêu đề + Dòng chữ tiến độ */}
          <div className="flex items-center gap-3 relative z-10">
            {/* Icon Cúp vàng tròn bên trái */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D9A05B] to-[#FFE082] flex items-center justify-center text-slate-950 shadow-md shrink-0 border-2 border-white/30">
              <Trophy className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-amber-50 font-heritage tracking-wide">
                Thử thách lịch sử
              </h1>
              {/* Dòng chữ "12 thử thách đã hoàn thành" với số 12 màu vàng sáng */}
              <p className="text-xs text-slate-300 font-heritage">
                <span className="font-black text-[#FFE082] text-sm font-mono mr-1">
                  {totalCompletedCount}
                </span>
                thử thách đã hoàn thành
              </p>
            </div>
          </div>

          {/* Thanh Tiến trình (Progress Bar) màu vàng đồng hiển thị 12/20 */}
          <div className="space-y-1.5 relative z-10 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold font-heritage">
              <span className="text-[#D9A05B] tracking-wide">Tỷ lệ hoàn thành</span>
              {/* Con số 12/20 ở cuối thanh */}
              <span className="text-[#FFE082] font-mono font-black text-xs">
                {totalCompletedCount}/{totalChallengesGoal}
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-950/80 overflow-hidden border border-[#D9A05B]/40 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#D9A05B] to-[#FFE082] shadow-sm"
                initial={{ width: `${progressRatio}%` }}
                animate={{ width: `${progressRatio}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3.2. BỘ LỌC TRẠNG THÁI (3 TABS) */}
      {/* ========================================================= */}
      <div className="px-4 pt-3 pb-2 z-10">
        <div className="flex rounded-2xl bg-[#EFE8DC] p-1 border border-[#DFD3C3] shadow-xs">
          {/* Tab 1: Tất cả (Nút pill màu đỏ son khi active) */}
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all font-heritage cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#8B2626] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            Tất cả ({challenges.length})
          </button>

          {/* Tab 2: Đang làm */}
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all font-heritage cursor-pointer ${
              activeTab === 'in_progress'
                ? 'bg-[#8B2626] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            Đang làm
          </button>

          {/* Tab 3: Đã hoàn thành */}
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all font-heritage cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#8B2626] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3.3. DANH SÁCH THẺ THỬ THÁCH (CHALLENGE CARDS) */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-3 z-10">
        {filteredChallenges.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-200/60 mx-auto flex items-center justify-center text-stone-400">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-500 font-heritage">
              Không có thử thách nào trong mục này
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-[11px] font-bold text-[#8B2626] underline font-heritage"
            >
              Xem tất cả thử thách
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isCompleted = challenge.status === 'completed';
            const isInProgress = challenge.status === 'in_progress';
            const isNotStarted = challenge.status === 'not_started';

            return (
              <div
                key={challenge.id}
                className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs space-y-3 relative overflow-hidden transition-all hover:border-[#D9A05B]/60"
              >
                {/* Main Card Content */}
                <div className="flex gap-3">
                  {/* Ảnh minh họa lịch sử bên trái */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100 relative">
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="w-full h-full object-cover"
                    />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-[#FFE082]" />
                      </div>
                    )}
                  </div>

                  {/* Thông tin thử thách */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Hàng nhãn: Độ khó + Phần thưởng */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Độ khó: Badge Trung bình (vàng + icon sóng), Dễ (xanh), Khó (đỏ) */}
                      {challenge.difficulty === 'Trung bình' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 font-heritage">
                          <Signal className="w-2.5 h-2.5 text-amber-600" />
                          <span>Trung bình</span>
                        </span>
                      )}
                      {challenge.difficulty === 'Dễ' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 font-heritage">
                          Dễ
                        </span>
                      )}
                      {challenge.difficulty === 'Khó' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 font-heritage">
                          Khó
                        </span>
                      )}

                      {/* Phần thưởng: ⭐ +EXP */}
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#FAF6F0] text-[#8B2626] border border-[#E8DFD1] font-heritage flex items-center gap-0.5">
                        <span>⭐ +{challenge.rewardExp} EXP</span>
                      </span>
                    </div>

                    {/* Tên thử thách */}
                    <h3 className="text-xs font-bold text-[#162A45] font-heritage leading-snug">
                      {challenge.title}
                    </h3>

                    {/* Mô tả thử thách */}
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Hàng Nút Hành Động (Action Button) */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">
                    {isCompleted ? 'Đã lưu vào bộ sưu tập di sản' : 'Nhiệm vụ tương tác 1 câu hỏi'}
                  </span>

                  {/* Nút hành động */}
                  {isCompleted ? (
                    // Nút màu xanh lá "✓ Đã hoàn thành" (vô hiệu hóa click)
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs flex items-center gap-1 font-heritage shadow-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Đã hoàn thành</span>
                    </div>
                  ) : isInProgress ? (
                    // Nút màu đỏ son "Tiếp tục >" (trạng thái Đang làm)
                    <button
                      onClick={() => handleOpenChallengeModal(challenge)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#8B2626] hover:bg-[#721F1F] text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all font-heritage cursor-pointer border border-[#8B2626]"
                    >
                      <span>Tiếp tục &gt;</span>
                    </button>
                  ) : (
                    // Nút màu đỏ son "Chơi ngay >" (trạng thái Chưa bắt đầu)
                    <button
                      onClick={() => handleOpenChallengeModal(challenge)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#8B2626] hover:bg-[#721F1F] text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all font-heritage cursor-pointer border border-[#8B2626]"
                    >
                      <span>Chơi ngay &gt;</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL TƯƠNG TÁC THỬ THÁCH NHANH (QUIZ 1 CÂU HỎI NHANH) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeQuizChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              className="w-full max-w-sm bg-[#FAF6F0] rounded-3xl border border-[#DFD3C3] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="px-4 pt-4 pb-3 bg-white border-b border-[#E8DFD1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center">
                    <Zap className="w-4 h-4 fill-[#8B2626]" />
                  </div>
                  <span className="text-xs font-bold text-[#162A45] font-heritage">
                    Thử Thách Nhanh
                  </span>
                </div>
                <button
                  onClick={() => setActiveQuizChallenge(null)}
                  className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-3.5">
                {/* Challenge Info Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-[#162A45] to-[#1C3556] text-white flex items-center gap-3 shadow-xs">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={activeQuizChallenge.imageUrl}
                      alt={activeQuizChallenge.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#FFE082] font-heritage font-bold block">
                      +{activeQuizChallenge.rewardExp} EXP Phần Thưởng
                    </span>
                    <h4 className="text-xs font-bold text-white font-heritage truncate">
                      {activeQuizChallenge.title}
                    </h4>
                  </div>
                </div>

                {/* Quiz Question */}
                <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#8B2626] font-heritage block tracking-wider">
                    Câu hỏi lịch sử:
                  </span>
                  <p className="text-xs font-bold text-[#162A45] leading-relaxed font-heritage">
                    {activeQuizChallenge.quizQuestion}
                  </p>
                </div>

                {/* Quiz Options */}
                <div className="space-y-2">
                  {activeQuizChallenge.quizOptions.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#8B2626]/10 border-[#8B2626] text-[#8B2626] font-bold shadow-xs'
                            : 'bg-white border-[#DFD3C3] text-stone-700 hover:border-[#8B2626]/40'
                        }`}
                      >
                        <span className="leading-snug">{opt.text}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Confirmation Button */}
                <div className="pt-2">
                  <button
                    disabled={!selectedOptionId || isCompleting}
                    onClick={handleConfirmComplete}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all font-heritage ${
                      selectedOptionId && !isCompleting
                        ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white hover:brightness-110 active:scale-95 cursor-pointer border border-[#8B2626]'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#FFE082]" />
                    <span>
                      {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành thử thách (+150 EXP)'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
