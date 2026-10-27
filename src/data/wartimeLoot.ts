// src/data/wartimeLoot.ts

export interface WartimeArtifact {
  id: string;
  name: string;
  category: 'letter' | 'relic';
  rarity: 'SSR' | 'SR' | 'R';
  year: string;
  author: string;
  recipient: string;
  icon: string;
  shortDesc: string;
  fullLetterContent: string;
  dropRateWeight: number;
}

export interface SpawnedLootItem {
  instanceId: string;
  artifact: WartimeArtifact;
  coordinates: { lat: number; lng: number };
  arScreenPos: { x: number; y: number }; // Vị trí xuất hiện trong ống ngắm AR (%)
  spawnedAt: number;
}

export const WARTIME_ARTIFACTS_POOL: WartimeArtifact[] = [
  {
    id: 'letter-quang-tri-1972',
    name: 'Bức Thư Từ Thành Cổ Quảng Trị',
    category: 'letter',
    rarity: 'SSR',
    year: 'Mùa hè đỏ lửa 1972',
    author: 'Liệt sĩ Lê Văn Huỳnh',
    recipient: 'Gửi Mẹ và Người vợ trẻ',
    icon: '✉️',
    shortDesc: 'Lá thư dự báo ngày hy sinh viết dưới làn mưa bom bão đạn bên dòng sông Thạch Hãn.',
    fullLetterContent:
      'Mẹ kính mến! Lớn lên trong vòng tay mẹ từ khi còn trứng nước, chưa báo đáp được công ơn thì con đi bộ đội. Kháng chiến thành công con sẽ về. Nếu con có mệnh hệ nào, mẹ và em đừng buồn quá, hãy tự hào vì con đã sống trọn vẹn cho Tổ quốc...',
    dropRateWeight: 25,
  },
  {
    id: 'letter-truong-son-1968',
    name: 'Lá Thư Trên Đỉnh Trường Sơn',
    category: 'letter',
    rarity: 'SSR',
    year: 'Xuân Mậu Thân 1968',
    author: 'Chiến sĩ Nguyễn Văn Nam (Đoàn 559)',
    recipient: 'Gửi người em gái hậu phương Hà Nội',
    icon: '💌',
    shortDesc: 'Viết vội bên ánh đèn dầu trong hầm chữ A giữa rừng già Trường Sơn.',
    fullLetterContent:
      'Em thương nhớ! Đêm Trường Sơn mưa rừng rả rích, đoàn xe vận tải vẫn nối đuôi nhau ra tiền tuyến. Nhìn cánh hoa rừng nở bên hố bom, anh lại nhớ mùa thu Hà Nội. Hẹn ngày toàn thắng, anh sẽ về đưa em đi dạo bên Hồ Gươm!',
    dropRateWeight: 30,
  },
  {
    id: 'diary-dang-thuy-tram',
    name: 'Trang Nhật Ký Nơi Tuyến Lửa Đức Phổ',
    category: 'letter',
    rarity: 'SSR',
    year: '1970 • Quảng Ngãi',
    author: 'Bác sĩ Đặng Thùy Trâm',
    recipient: 'Nhật ký chiến trường',
    icon: '📓',
    shortDesc: 'Những dòng chữ rực lửa lý tưởng của người nữ bác sĩ quân y tuổi đôi mươi.',
    fullLetterContent:
      'Đời người phải trải qua giông tố nhưng không được cúi đầu trước giông tố. Dù gian khổ đến đâu, bệnh xá giữa rừng vẫn sáng đèn cứu chữa thương binh...',
    dropRateWeight: 20,
  },
  {
    id: 'relic-chiec-luoc-nga',
    name: 'Chiếc Lược Ngà Khắc Dòng Chữ Nhớ Thương',
    category: 'relic',
    rarity: 'SR',
    year: '1966 • Chiến khu Đ',
    author: 'Người chiến sĩ miền Tây Nam Bộ',
    recipient: 'Kỷ vật gửi con gái nhỏ',
    icon: '🪮',
    shortDesc: 'Từng chiếc răng lược được cưa tỉ mỉ từ mảnh ngà voi giữa rừng chiến khu.',
    fullLetterContent:
      'Yêu nhớ tặng Thu con của ba! Cây lược nhỏ thấm đẫm tình phụ tử thiêng liêng giữa khói lửa chiến tranh, được đồng đội trao tận tay con gái sau ngày người chiến sĩ ngã xuống.',
    dropRateWeight: 25,
  },
];

/**
 * Hàm tính xác suất rớt vật phẩm ngẫu nhiên khi người chơi đang bước đi (Mặc định 38% mỗi bước)
 */
export function tryRollLootDrop(
  userGps: { lat: number; lng: number },
  forceSpawn = false
): SpawnedLootItem | null {
  const dropChance = 0.38;
  if (!forceSpawn && Math.random() > dropChance) {
    return null;
  }

  const totalWeight = WARTIME_ARTIFACTS_POOL.reduce((sum, item) => sum + item.dropRateWeight, 0);
  let randomVal = Math.random() * totalWeight;
  let chosen = WARTIME_ARTIFACTS_POOL[0];

  for (const item of WARTIME_ARTIFACTS_POOL) {
    if (randomVal < item.dropRateWeight) {
      chosen = item;
      break;
    }
    randomVal -= item.dropRateWeight;
  }

  // Tạo tọa độ rơi cách vị trí người chơi khoảng 8m - 25m trên mặt đường
  const offsetLat = (Math.random() - 0.5) * 0.00035;
  const offsetLng = (Math.random() - 0.5) * 0.00035;

  return {
    instanceId: `loot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    artifact: chosen,
    coordinates: {
      lat: Number((userGps.lat + offsetLat).toFixed(6)),
      lng: Number((userGps.lng + offsetLng).toFixed(6)),
    },
    arScreenPos: {
      x: Math.floor(20 + Math.random() * 60), // 20% -> 80% chiều ngang Camera
      y: Math.floor(30 + Math.random() * 40), // 30% -> 70% chiều dọc Camera
    },
    spawnedAt: Date.now(),
  };
}
