import { HistoricalLocation } from '@/types/location';

export const MOCK_LOCATIONS: HistoricalLocation[] = [
  {
    id: 'ben-nha-rong',
    name: 'Bến Nhà Rồng',
    subtitle: 'Bảo tàng Hồ Chí Minh - Chi nhánh TP. Hồ Chí Minh',
    categoryTitle: 'Di tích Quốc gia Đặc biệt',
    address: 'Số 01 Nguyễn Tất Thành, Phường 12, Quận 4, TP.HCM',
    coordinates: { lat: 10.76815, lng: 106.70678 },
    rarity: 'legendary',
    contentType: 'witness', // Focus witness location
    discoveryRadius: 20, // 20 km (rule: 15-30km)
    interactionRadius: 35, // 35 m (rule: 20-50m)
    historicalPeriod: 'Thời kỳ Kháng chiến chống Pháp (1911)',
    yearEstablished: '1863',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'HÀNH TRÌNH RA ĐI TÌM ĐƯỜNG CỨU NƯỚC (1911) — Ngày 5 tháng 6 năm 1911, từ Bến cảng Nhà Rồng, người thanh niên yêu nước Nguyễn Tất Thành (với tên gọi Văn Ba) đã bước lên con tàu buôn Amiral Latouche-Tréville sang phương Tây tìm đường cứu nước, mở ra bước ngoặt vĩ đại cho vận mệnh dân tộc Việt Nam.',
    fullDescription:
      'Bến Nhà Rồng khởi công xây dựng từ năm 1863 với lối kiến trúc Pháp kết hợp hai con rồng uốn lượn chầu mặt trời trên đỉnh mái ("Lưỡng long chầu nguyệt"). Ngày 5/6/1911, từ bến cảng này, người thanh niên 21 tuổi Nguyễn Tất Thành (với tên gọi Văn Ba) đã lên tàu Amiral Latouche-Tréville sang phương Tây tìm con đường giải phóng cho đồng bào mình.',
    witnessStory: {
      id: 'witness-ben-nha-rong',
      title: 'Ký ức Bến cảng 1911 & Quyết định chấn động của người thanh niên Văn Ba',
      memoryFilmTitle: 'Thước phim Ký ức: Ngày tôi ra khơi và câu chuyện Bến cảng',
      duration: '04:15',
      speakerName: 'Nhà nghiên cứu Trần Đức Hạnh',
      speakerRole: 'Chuyên gia Lịch sử Văn hóa · Ban Quản lý Di tích Bảo tàng Hồ Chí Minh',
      speakerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Ngày ấy, anh Ba hỏi bạn: \'Tôi muốn đi ra nước ngoài xem nước Pháp và các nước khác... sau đó trở về giúp đồng bào chúng ta\'. Người bạn hỏi \'Lấy tiền đâu mà đi?\'. Anh Ba giơ hai bàn tay chai sạn ra và nói: \'Đây, tiền ở đây!\'. Khí phách ấy đã làm rung chuyển cả dòng lịch sử.”',
      fullStory:
        'Theo tài liệu lưu trữ từ công ty tàu biển Chargeurs Réunis và lời kể của các bậc lão thành, người thanh niên Nguyễn Tất Thành nhận chân phụ bếp với mức lương 45 franc mỗi tháng. Công việc trên tàu vô cùng nặng nhọc giữa cái lạnh buốt của biển cả và sóng gió gào thét. Bất chấp tất cả, người thanh niên ấy luôn thức khuya học thêm tiếng Pháp, đọc sách báo để tìm hiểu gốc rễ vì sao các nước phương Tây lại hùng mạnh.',
      historicalSource: 'Bảo tàng Hồ Chí Minh - Chi nhánh TP.HCM & Trung tâm Lưu trữ Quốc gia II',
    },
    storyChallengeIds: ['story-ben-nha-rong-1', 'story-ben-nha-rong-2', 'story-ben-nha-rong-3'],
    rewardExp: 500,
    tags: ['Bác Hồ', 'Lịch sử 1911', 'Di tích Quốc gia đặc biệt', 'Sông Sài Gòn'],
  },
  {
    id: 'dinh-doc-lap',
    name: 'Dinh Độc Lập',
    subtitle: 'Hội trường Thống Nhất · Di tích Lịch sử Dinh Thống Nhất',
    categoryTitle: 'Di tích Quốc gia Đặc biệt',
    address: '135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM',
    coordinates: { lat: 10.77689, lng: 106.69547 },
    rarity: 'uncommon',
    contentType: 'witness',
    discoveryRadius: 6, // 6 km (rule: 5-8km)
    interactionRadius: 75, // 75 m (rule: 50-100m)
    historicalPeriod: 'Đại thắng Mùa Xuân 1975',
    yearEstablished: '1966',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'THỜI KHẮC TOÀN THẮNG 30/4/1975 — Đúng 11 giờ 30 phút ngày 30/4/1975, xe tăng quân Giải phóng húc đổ cổng sắt Dinh Độc Lập, cắm lá cờ chiến thắng lên nóc dinh thự, đánh dấu sự toàn thắng của Chiến dịch Hồ Chí Minh lịch sử, non sông thu về một mối.',
    fullDescription:
      'Dinh Độc Lập do kiến trúc sư Ngô Viết Thụ thiết kế, kết hợp hài hòa giữa triết lý phương Đông cổ truyền và nghệ thuật hiện đại. Đúng 11 giờ 30 phút ngày 30/4/1975, xe tăng số hiệu 390 và 843 thuộc Lữ đoàn xe tăng 203 đã húc đổ cánh cổng sắt kiên cố, cắm lá cờ chiến thắng lên nóc Dinh.',
    witnessStory: {
      id: 'witness-dinh-doc-lap',
      title: 'Trưa 30/4/1975: Cú húc cổng sắt vang dội của Xe tăng 390',
      memoryFilmTitle: 'Thước phim Ký ức: Trưa ngày 30/4/1975 và cú húc cổng lịch sử',
      duration: '03:52',
      speakerName: 'Đại tá Vũ Đăng Toàn',
      speakerRole: 'Trung đội trưởng lái xe tăng số hiệu 390 · Anh hùng LLVTND',
      speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Khi thấy xe 843 bị kẹt lại ở cổng phụ, tôi hô dõng dạc qua máy liên lạc: \'Cho xe tăng tốc, húc thẳng vào cổng chính!\'. Rầm một tiếng rung chuyển, cánh cổng sắt đổ sập. Chúng tôi ùa vào nóc Dinh cắm cờ. Đó là giây phút nước mắt chảy dài vì biết từ nay quê hương không còn bom đạn.”',
      fullStory:
        'Tiếng động cơ gầm vang của cỗ xe tăng 390 giữa trưa tháng Tư rực nắng đã đi vào ký ức hàng triệu người. Bức ảnh của phóng viên chiến trường Francoise Demulder đã ghi lại khoảnh khắc lịch sử này, chứng minh sức mạnh của ý chí độc lập tự do và hòa bình.',
      historicalSource: 'Bảo tàng Lịch sử Quân sự & Lữ đoàn Xe tăng 203',
    },
    storyChallengeIds: ['story-dinh-doc-lap-1975'],
    rewardExp: 350,
    tags: ['Chiến dịch Hồ Chí Minh', '30/4/1975', 'Xe tăng 390', 'Thống Nhất'],
  },
  {
    id: 'ham-biet-dong-sai-gon',
    name: 'Căn Hầm Bí Mật Chứa Vũ Khí',
    subtitle: 'Sở chỉ huy bí mật của Biệt động Sài Gòn',
    categoryTitle: 'Di tích Lịch sử Cấp Quốc gia',
    address: '287/70 Nguyễn Đình Chiểu, Phường 5, Quận 3, TP.HCM',
    coordinates: { lat: 10.77884, lng: 106.68962 },
    rarity: 'uncommon',
    contentType: 'battlefield',
    discoveryRadius: 5.5, // 5.5 km (rule: 5-8km)
    interactionRadius: 60, // 60 m (rule: 50-100m)
    historicalPeriod: 'Cuộc Tổng tiến công Tết Mậu Thân (1968)',
    yearEstablished: '1965',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'HỎA TUYẾN DƯỚI LÒNG ĐỊCH — Căn hầm ngầm được đào bí mật ngay giữa trung tâm Sài Gòn dưới vỏ bọc xưởng may tơ lụa, cất giấu gần 3 tấn thuốc nổ, súng AK, B40 để Biệt động Sài Gòn mở màn cuộc tập kích chấn động vào Dinh Độc Lập Tết Mậu Thân 1968.',
    fullDescription:
      'Ngôi nhà bề ngoài là tiệm may và buôn bán tơ lụa của ông Trần Văn Lai (tức Năm U.Som, Mai Hồng Quế). Dưới sàn nhà lát gạch bông giả cổ là một nắp hầm tinh vi chỉ vừa một người chui lọt. Trong suốt nhiều năm trời, vợ chồng ông Năm Lai đã vận chuyển từng viên gạch vụn ra ngoài và chuyển vũ khí giấu trong sọt rau cải về đây.',
    witnessStory: {
      id: 'witness-ham-biet-dong',
      title: 'Mật lệnh đêm Giao thừa & Lời thề quyết tử của Biệt động Đội 5',
      memoryFilmTitle: 'Thước phim Ký ức: Mật lệnh giao thừa dưới căn hầm tơ lụa',
      duration: '04:02',
      speakerName: 'Bà Đặng Thị Thiệp',
      speakerRole: 'Phu nhân Anh hùng LLVTND Trần Văn Lai (Năm Lai)',
      speakerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Đêm đêm, chồng tôi vừa đào đất vừa nghe ngóng tiếng giày đinh của mật thám ngoài ngõ. Từng thùng thuốc nổ được bọc kín chôn sâu dưới nền nhà. Nếu bị lộ thì cả gia đình tan xác trong chớp mắt. Nhưng chúng tôi không sợ, vì lòng tin sắt đá vào ngày đất nước sạch bóng ngoại xâm.”',
      fullStory:
        'Đêm mùng 1 Tết Mậu Thân 1968, 15 chiến sĩ dũng cảm của Đội 5 Biệt động Sài Gòn đã tập hợp tại căn hầm này, nhận vũ khí và phát lệnh mở màn cuộc tập kích chấn động vào Dinh Độc Lập.',
      historicalSource: 'Bảo tàng Biệt động Sài Gòn - Gia Định',
    },
    storyChallengeIds: ['story-biet-dong-1968'],
    rewardExp: 300,
    tags: ['Biệt động Sài Gòn', 'Tết Mậu Thân 1968', 'Hầm vũ khí ngầm', 'Anh hùng'],
  },
  {
    id: 'thpt-le-hong-phong',
    name: 'Trường THPT Chuyên Lê Hồng Phong',
    subtitle: 'Cái nôi yêu nước của Trường Trung học Petrus Ký xưa',
    categoryTitle: 'Di tích Kiến trúc Nghệ thuật Cấp Thành phố',
    address: '235 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM',
    coordinates: { lat: 10.76092, lng: 106.68115 },
    rarity: 'common',
    contentType: 'culture',
    discoveryRadius: 1.5, // 1.5 km (rule: 1-2km)
    interactionRadius: 120, // 120 m (rule: 100-200m)
    historicalPeriod: 'Phong trào Học sinh Sinh viên Kháng chiến (1950)',
    yearEstablished: '1927',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'NGỌN LỬA TUỔI TRẺ YÊU NƯỚC — Ngôi trường cổ kính mang phong cách Art Deco của kiến trúc sư Ernest Hébrard, nơi thắp sáng phong trào học sinh sinh viên kháng Pháp của anh hùng Trần Văn Ơn và nhạc sĩ tài hoa Lưu Hữu Phước với bài hát bất hủ \'Lên Đàng\'.',
    fullDescription:
      'Khánh thành năm 1927 dưới tên Trường Petrus Ký, nơi đây từng là trung tâm tri thức và cũng là cái nôi bùng nổ các cuộc bãi khóa chống thực dân. Ngày 9/1/1950, cuộc biểu tình của học sinh Petrus Ký do Trần Văn Ơn dẫn đầu đòi thả học sinh bị bắt đã trở thành Ngày truyền thống Học sinh - Sinh viên toàn quốc.',
    witnessStory: {
      id: 'witness-le-hong-phong',
      title: 'Tiếng hát \'Lên Đàng\' và ngọn đuốc Trần Văn Ơn ngày 9 tháng Giêng',
      memoryFilmTitle: 'Thước phim Ký ức: Khí phách học sinh Petrus Ký và ngọn lửa 9/1',
      duration: '03:10',
      speakerName: 'GS. Lê Văn Triết',
      speakerRole: 'Cựu học sinh Petrus Ký khóa 1948 · Nhân chứng phong trào 9/1',
      speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Ngày anh Trần Văn Ơn ngã xuống vì viên đạn của cảnh sát Pháp, hàng vạn người dân Sài Gòn đã đổ ra đường đưa tiễn. Tiếng hát \'Này sinh viên ơi, đứng lên đáp lời sông núi\' vang rền khắp các nẻo đường, lay động từng trái tim yêu nước.”',
      fullStory:
        'Đám tang của người học trò Trần Văn Ơn đã trở thành cuộc biểu dương lực lượng quần chúng lớn nhất Sài Gòn thời bấy giờ, quy tụ hơn 50 vạn đồng bào tham gia tuần hành bất chấp sự đàn áp của chính quyền thực dân.',
      historicalSource: 'Kỷ yếu 90 năm Petrus Ký - Lê Hồng Phong & Hội Khoa học Lịch sử TP.HCM',
    },
    storyChallengeIds: ['story-petrus-ky'],
    rewardExp: 200,
    tags: ['Trần Văn Ơn', 'Phong trào HSSV', 'Kiến trúc cổ', 'Lê Hồng Phong'],
  },
  {
    id: 'buu-dien-trung-tam',
    name: 'Bưu Điện Trung Tâm Sài Gòn',
    subtitle: 'Biểu tượng Bưu chính Viễn thông hơn một thế kỷ',
    categoryTitle: 'Di tích Kiến trúc Nghệ thuật Đô thị',
    address: 'Số 02 Công xã Paris, Phường Bến Nghé, Quận 1, TP.HCM',
    coordinates: { lat: 10.77977, lng: 106.69996 },
    rarity: 'common',
    contentType: 'landmark',
    discoveryRadius: 1.8, // 1.8 km (rule: 1-2km)
    interactionRadius: 150, // 150 m (rule: 100-200m)
    historicalPeriod: 'Thời kỳ Giao thương Thế kỷ 19',
    yearEstablished: '1891',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'GIAO THƯƠNG VƯỢT THỜI GIAN — Kiệt tác kiến trúc Gothic kết hợp nét cổ điển Pháp, là trung tâm liên lạc bưu chính huyết mạch kết nối Sài Gòn với quốc tế suốt từ năm 1891 đến nay với những hòm thư và bản đồ vẽ tay hơn trăm tuổi.',
    fullDescription:
      'Tòa nhà được thiết kế bởi kiến trúc sư Marie-Alfred Foulhoux với vòm trần uốn cong bằng sắt rèn tinh xảo, hai bản đồ lịch sử vẽ tay trên tường thể hiện hệ thống điện tín cổ xưa của Nam Bộ và Campuchia.',
    witnessStory: {
      id: 'witness-buu-dien',
      title: 'Người chép thư tay cuối cùng bên hòm thư trăm năm',
      memoryFilmTitle: 'Thước phim Ký ức: Hơn 30 năm chắp cánh những cánh thư',
      duration: '02:45',
      speakerName: 'Bác Dương Văn Ngộ',
      speakerRole: 'Người viết thư thuê thâm niên hơn 30 năm tại Bưu điện Sài Gòn',
      speakerAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Tôi đã chắp cánh cho hàng nghìn cánh thư vượt trùng dương, gửi gắm nỗi nhớ thương của những gia đình ly tán thời tao loạn. Bưu điện này không chỉ là sắt thép gạch đá, mà là nơi lưu giữ tâm hồn và nước mắt của bao thế hệ người Việt.”',
      fullStory:
        'Trong những năm tháng chiến tranh và thời kỳ đầu đất nước mở cửa, việc liên lạc quốc tế chủ yếu nhờ vào những cánh thư tay bưu điện. Những lời dặn dò, bức ảnh kỷ niệm gửi về quê nhà đã gắn bó mật thiết với dòng chảy văn hóa đô thị Sài Gòn.',
      historicalSource: 'Bảo tàng Bưu chính Viễn thông & Ký ức đô thị Sài Gòn',
    },
    storyChallengeIds: ['story-buu-dien-saigon'],
    rewardExp: 180,
    tags: ['Kiến trúc Pháp', 'Thư tay', 'Công xã Paris', 'Bưu điện'],
  },
  {
    id: 'dia-dao-cu-chi',
    name: 'Địa Đạo Củ Chi',
    subtitle: 'Chiến khu Tam Giác Sắt · Kỳ quan Đất Thép Thành Đồng',
    categoryTitle: 'Di tích Quốc gia Đặc biệt',
    address: 'Đường Tỉnh lộ 15, Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP.HCM',
    coordinates: { lat: 11.14321, lng: 106.46312 },
    rarity: 'legendary',
    contentType: 'battlefield',
    discoveryRadius: 25, // 25 km (rule: 15-30km)
    interactionRadius: 40, // 40 m (rule: 20-50m)
    historicalPeriod: 'Kháng chiến chống Mỹ cứu nước (1961 - 1975)',
    yearEstablished: '1948',
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'KỲ QUAN DƯỚI LÒNG ĐẤT — Mạng lưới địa đạo hơn 250km xuyên sâu trong lòng đất gồm 3 tầng hầm thông nhau, nơi nuôi dưỡng ý chí quật cường của quân và dân Củ Chi chống lại bom đạn khốc liệt để bảo vệ cửa ngõ Sài Gòn.',
    fullDescription:
      'Củ Chi được mệnh danh là "Đất thép thành đồng". Chỉ bằng những chiếc cuốc con và cần xé tre, quân và dân Củ Chi đã kiên cường đào nên một mê cung ngầm đồ sộ chống lại bom B-52, xe tăng và chiến dịch càn quét khốc liệt của đối phương.',
    witnessStory: {
      id: 'witness-cu-chi',
      title: 'Ánh đèn dầu le lói dưới tầng hầm thứ ba và Nồi cơm Bếp Hoàng Cầm',
      memoryFilmTitle: 'Thước phim Ký ức: Ánh đèn dầu Bếp Hoàng Cầm và huyền thoại Đất Thép',
      duration: '04:30',
      speakerName: 'Bác Tô Văn Đực',
      speakerRole: 'Chiến sĩ du kích Củ Chi · Anh hùng Lực lượng Vũ trang Nhân dân',
      speakerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Ở dưới đất nhiều tháng liền không thấy mặt trời, da đứa nào cũng tái mét vì thiếu khí oxy. Nhưng hễ nghe tiếng bom dứt là lại bò lên bắn tỉa, gài mìn bẫy giặc. Quân địch gọi Củ Chi là \'thành phố ma\', bởi người của ta như từ lòng đất mọc lên.”',
      fullStory:
        'Sự sáng tạo của Bếp Hoàng Cầm giấu khói dưới lòng đất giúp bộ đội nấu ăn ban ngày mà máy bay địch không thể phát hiện. Tinh thần quật cường của du kích Củ Chi đã trở thành biểu tượng huyền thoại trên toàn thế giới.',
      historicalSource: 'Khu Di tích Lịch sử Địa đạo Củ Chi & Bảo tàng Lực lượng Vũ trang',
    },
    storyChallengeIds: ['story-dia-dao-cuchi'],
    rewardExp: 450,
    tags: ['Đất Thép', 'Bếp Hoàng Cầm', 'Hầm ngầm 250km', 'Du kích'],
  },
  {
    id: 'hanh-trinh-giai-phong-1975',
    name: 'Hành Trình Giải Phóng 1975',
    subtitle: 'Sự kiện Đặc biệt: Đại thắng Mùa Xuân 1975 Toàn quốc',
    categoryTitle: 'Địa bàn Lịch sử Trọng điểm Toàn quốc',
    address: 'Đại lộ Lê Duẩn - Trục kết nối Di sản Hòa Bình, TP.HCM',
    coordinates: { lat: 10.77512, lng: 106.70081 },
    rarity: 'event',
    contentType: 'story',
    discoveryRadius: 50, // 50 km (rule: 50km)
    interactionRadius: 80, // 80 m (rule: 50-100m)
    historicalPeriod: 'Chiến dịch Hồ Chí Minh lịch sử (Tháng 4/1975)',
    yearEstablished: '1975',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'KHÚC KHẢI HOÀN NON SÔNG — Đỉnh cao của cuộc kháng chiến vĩ đại, quy tụ sức mạnh 5 cánh quân tiến vào giải phóng Sài Gòn, đưa đất nước bước vào kỷ nguyên hòa bình, thống nhất trọn vẹn lãnh thổ.',
    fullDescription:
      'Tháng 4 năm 1975, Chiến dịch Hồ Chí Minh lịch sử diễn ra với tinh thần "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa". Sự kiện này mở ra kỷ nguyên độc lập, tự do và thống nhất toàn vẹn lãnh thổ cho non sông Việt Nam.',
    witnessStory: {
      id: 'witness-giai-phong-1975',
      title: 'Bản tin phát thanh 11h30 trưa 30/4 và Nụ cười ngày toàn thắng',
      memoryFilmTitle: 'Thước phim Ký ức: Bản tin trưa 30/4 và nụ cười ngày toàn thắng',
      duration: '03:30',
      speakerName: 'Nhà báo Nguyễn Văn Thắng',
      speakerRole: 'Phóng viên Đài Tiếng nói Việt Nam tại mặt trận Sài Gòn',
      speakerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Khi giọng đọc của Tổng thống Dương Văn Minh tuyên bố đầu hàng vang lên trên sóng phát thanh, khắp đường phố Sài Gòn như vỡ òa. Người dân ùa ra đón những đoàn quân giải phóng với cờ hoa đỏ thắm. Nước mắt rơi vì sau mấy mươi năm, bom đạn đã thực sự chấm dứt.”',
      fullStory:
        'Hàng triệu gia đình Bắc - Nam nghẹn ngào trong ngày sum họp. Các chiến sĩ từ khắp mọi miền đất nước ôm chầm lấy nhau bên những chiếc xe tăng còn vương khói súng.',
      historicalSource: 'Viện Lịch sử Quân sự Việt Nam & Đài Tiếng nói Việt Nam',
    },
    storyChallengeIds: ['story-giai-phong-1975-series'],
    rewardExp: 600,
    tags: ['Chiến dịch Hồ Chí Minh', '30/4/1975', 'Thống Nhất', 'Sự kiện Lịch sử'],
  },
  {
    id: 'bao-tang-chung-tich',
    name: 'Bảo Tàng Chứng Tích Chiến Tranh',
    subtitle: 'Nơi lưu giữ bằng chứng tội ác chiến tranh và khát vọng hòa bình',
    categoryTitle: 'Bảo tàng Cấp Quốc gia',
    address: '28 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
    coordinates: { lat: 10.77943, lng: 106.69238 },
    rarity: 'uncommon',
    contentType: 'witness',
    discoveryRadius: 5.0,
    interactionRadius: 80,
    historicalPeriod: 'Kháng chiến chống Mỹ (1954 - 1975)',
    yearEstablished: '1975',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'KHÁT VỌNG HÒA BÌNH — Bảo tàng chuyên đề nghiên cứu, sưu tầm, lưu trữ, bảo quản và trưng bày những tư liệu, hình ảnh, hiện vật về những chứng tích tội ác và hậu quả của các cuộc chiến tranh mà các thế lực xâm lược đã gây ra đối với Việt Nam.',
    fullDescription:
      'Thành lập từ tháng 9/1975, bảo tàng hiện lưu giữ hơn 20.000 tài liệu, hiện vật và phim ảnh tái hiện sự khốc liệt của chiến tranh cũng như tinh thần quật cường của nhân dân Việt Nam.',
    witnessStory: {
      id: 'witness-chung-tich',
      title: 'Bức ảnh em bé Napalm và tiếng chuông thức tỉnh nhân loại',
      memoryFilmTitle: 'Thước phim Ký ức: Tiếng chuông hòa bình từ những bức ảnh chiến trường',
      duration: '03:40',
      speakerName: 'Bác Huỳnh Công Út (Nick Út)',
      speakerRole: 'Nhiếp ảnh gia chiến trường · Giải thưởng Báo chí Pulitzer',
      speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Những bức ảnh chiến tranh không phải để kích động hận thù, mà là lời cảnh tỉnh thiêng liêng nhất gửi tới nhân loại: Hãy trân quý từng giây phút của hòa bình.”',
      fullStory:
        'Từng bức ảnh trưng bày tại bảo tàng là một chứng nhân không lời về nỗi đau thương mất mát do bom đạn và chất độc da cam, nhắc nhở thế hệ hôm nay về giá trị vô giá của nền độc lập.',
      historicalSource: 'Bảo tàng Chứng tích Chiến tranh TP.HCM',
    },
    storyChallengeIds: ['story-chung-tich'],
    rewardExp: 250,
    tags: ['Bảo tàng', 'Hòa bình', 'Hiện vật chiến tranh', 'Ký ức'],
  },
  {
    id: 'bao-tang-lich-su',
    name: 'Bảo Tàng Lịch Sử TP. Hồ Chí Minh',
    subtitle: 'Nơi bảo tồn tinh hoa văn hóa ngàn năm dân tộc',
    categoryTitle: 'Bảo tàng Di sản Văn hóa',
    address: 'Số 02 Nguyễn Bỉnh Khiêm, Phường Bến Nghé, Quận 1, TP.HCM',
    coordinates: { lat: 10.78768, lng: 106.70498 },
    rarity: 'common',
    contentType: 'culture',
    discoveryRadius: 4.0,
    interactionRadius: 100,
    historicalPeriod: 'Thời kỳ Tiền sử đến Thế kỷ 20',
    yearEstablished: '1929',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'NGỌN NGUỒN VĂN HIẾN — Tòa nhà kiến trúc Đông Dương độc đáo lưu giữ hơn 40.000 cổ vật quý giá từ thời nguyên thủy, nền văn hóa Đông Sơn, Sa Huỳnh, Óc Eo cho đến các triều đại phong kiến Việt Nam.',
    fullDescription:
      'Khánh thành năm 1929, đây là một trong những bảo tàng cổ kính nhất phương Nam, nơi du khách có thể chiêm ngưỡng Trống đồng Đông Sơn, tượng Phật cổ Champa và xác ướp Xóm Cải độc nhất vô nhị.',
    witnessStory: {
      id: 'witness-bao-tang-lich-su',
      title: 'Âm vang Trống đồng và dấu tích ngàn năm người Việt cổ',
      memoryFilmTitle: 'Thước phim Ký ức: Ngàn năm văn hiến bên dòng sông thời gian',
      duration: '03:15',
      speakerName: 'TS. Nguyễn Thị Hậu',
      speakerRole: 'Nhà Khảo cổ học · Tổng Thư ký Hội Khoa học Lịch sử TP.HCM',
      speakerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      quote:
        '“Mỗi hoa văn chim phượng, thuyền chiến trên mặt trống đồng là một thông điệp thiêng liêng tổ tiên gửi gắm qua hàng ngàn năm về lòng tự hào và cội nguồn dân tộc.”',
      fullStory:
        'Bảo tàng là kho tàng sống động phản ánh sự giao lưu văn hóa và quá trình mở mang bờ cõi phương Nam của dân tộc ta.',
      historicalSource: 'Bảo tàng Lịch sử TP.HCM',
    },
    storyChallengeIds: ['story-co-vat-dong-son'],
    rewardExp: 220,
    tags: ['Bảo tàng', 'Khảo cổ', 'Trống đồng', 'Văn hóa cổ'],
  },
  {
    id: 'co-do-hue',
    name: 'Cố Đô Huế - Đại Nội',
    subtitle: 'Quần thể Di tích Cố đô Huế · Di sản Văn hóa Thế giới UNESCO',
    categoryTitle: 'Di tích Lịch sử & Cung đình',
    address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế, Thừa Thiên Huế',
    coordinates: { lat: 16.4698, lng: 107.5786 },
    rarity: 'legendary',
    contentType: 'culture',
    discoveryRadius: 50.0,
    interactionRadius: 150,
    historicalPeriod: 'Triều đại nhà Nguyễn (1802 - 1945)',
    yearEstablished: '1804',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
    'QUẦN THỂ DI SẢN CUNG ĐÌNH — Kinh đô của nước Việt Nam dưới triều Nguyễn suốt 143 năm, nơi kết tinh đỉnh cao kiến trúc cung đình phương Đông, Nhã nhạc cung đình và chiều sâu trầm tích lịch sử dân tộc.',
    fullDescription:
    'Hoàng thành Huế được xây dựng từ thời vua Gia Long và Minh Mạng, gồm Hoàng thành và Tử Cấm thành với hệ thống hào nước, cổng thành Ngọ Môn kiên cố và điện Thái Hòa uy nghiêm.',
    witnessStory: {
      id: 'witness-co-do-hue',
      title: 'Ký ức chiều Thu 1945: Lễ thoái vị lịch sử tại Ngọ Môn',
      memoryFilmTitle: 'Thước phim Ký ức: Chiều thu 1945 và lời tuyên bố thoái vị tại Ngọ Môn',
      duration: '04:10',
      speakerName: 'Nhà nghiên cứu Nguyễn Đắc Xuân',
      speakerRole: 'Nhà văn hóa Huế học · Hội viên Hội Khoa học Lịch sử Việt Nam',
      speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote:
      '“Chiều 30/8/1945, trước hàng vạn đồng bào, vua Bảo Đại trao ấn vàng và kiếm ngọc cho phái đoàn chính quyền cách mạng, kết thúc ngàn năm chế độ phong kiến với lời nói bất hủ: Thà làm dân một nước độc lập hơn làm vua một nước nô lệ.”',
      fullStory:
      'Ngọ Môn là nơi chứng kiến sự chuyển giao vận mệnh lịch sử dân tộc, mở đầu một trang sử độc lập mới cho đất nước.',
      historicalSource: 'Trung tâm Bảo tồn Di tích Cố đô Huế',
    },
    storyChallengeIds: ['story-co-do-hue'],
    rewardExp: 400,
    tags: ['Di tích lịch sử', 'UNESCO', 'Cố đô Huế', 'Ngọ Môn'],
  },
  {
    id: 'van-mieu-quoc-tu-giam',
    name: 'Văn Miếu - Quốc Tử Giám',
    subtitle: 'Trường Đại học đầu tiên của Việt Nam · Biểu tượng hiền tài Thăng Long',
    categoryTitle: 'Di tích Lịch sử & Văn hóa',
    address: '58 Phố Quốc Tử Giám, Phường Văn Miếu, Quận Đống Đa, Hà Nội',
    coordinates: { lat: 21.0278, lng: 105.8355 },
    rarity: 'legendary',
    contentType: 'culture',
    discoveryRadius: 50.0,
    interactionRadius: 150,
    historicalPeriod: 'Thời kỳ Lý - Trần - Lê (1070 đến nay)',
    yearEstablished: '1070',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
    'CÁI NÔI NHO HỌC ĐẠI VIỆT — Được xây dựng năm 1070 dưới thời vua Lý Thánh Tông, nơi tôn vinh đạo học, gìn giữ 82 tấm bia tiến sĩ - Di sản tư liệu thế giới ghi danh các bậc hiền tài làm rạng danh non sông.',
    fullDescription:
    'Văn Miếu - Quốc Tử Giám gồm Khuê Văn Các, giếng Thiên Quang, bia Tiến sĩ và nhà Thái Học, là minh chứng cho tinh thần "Hiền tài là nguyên khí của quốc gia".',
    witnessStory: {
      id: 'witness-van-mieu',
      title: 'Hồn thiêng Khuê Văn Các và 82 Tấm bia Tiến sĩ trường tồn',
      memoryFilmTitle: 'Thước phim Ký ức: Nét bút nghìn năm trên đá rùa Văn Miếu',
      duration: '04:20',
      speakerName: 'GS. Vũ Khiêu',
      speakerRole: 'Anh hùng Lao động · Giáo sư Triết học và Văn hóa học',
      speakerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      quote:
      '“Hiền tài là nguyên khí quốc gia, nguyên khí thịnh thì thế nước mạnh, nguyên khí suy thì thế nước yếu. Từng hàng chữ khắc trên bia đá là lời non sông dặn dò muôn đời con cháu.”',
      fullStory:
      'Bia đá Văn Miếu dựng trên lưng rùa đá qua hàng trăm năm mưa nắng vẫn sừng sững, lưu danh hàng ngàn tiến sĩ, trạng nguyên của dân tộc.',
      historicalSource: 'Trung tâm Hoạt động Văn hóa Khoa học Văn Miếu - Quốc Tử Giám',
    },
    storyChallengeIds: ['story-van-mieu'],
    rewardExp: 380,
    tags: ['Di tích lịch sử', 'Khuê Văn Các', 'Quốc Tử Giám', 'Hiền tài'],
  },
];

export const NATIONAL_CAMPAIGN_LOCATIONS: HistoricalLocation[] = [
  {
    id: 'hoang-thanh-thang-long',
    name: 'Hoàng Thành Thăng Long - Hầm Chỉ Huy Tác Chiến T1',
    subtitle: 'Di tích Quốc gia Đặc biệt · Trung tâm Hoàng thành Thăng Long',
    categoryTitle: 'Chiến trường & Căn cứ Tác chiến',
    category: 'battlefield',
    rarity: 'legendary',
    contentType: 'battlefield',
    region: 'Hà Nội',
    campaign: 'Hào Khí Thăng Long',
    address: '19C Hoàng Diệu, Quán Thánh, Ba Đình, Hà Nội',
    coordinates: { lat: 21.0341, lng: 105.8401 },
    discoveryRadius: 15,
    interactionRadius: 100,
    historicalPeriod: 'Điện Biên Phủ trên không (12/1972)',
    yearEstablished: '1010',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'Nơi hội tụ hơn 1.000 năm lịch sử dân tộc và là căn hầm chỉ huy tối mật của Bộ Tổng Tư lệnh trong suốt 12 ngày đêm Điện Biên Phủ trên không năm 1972.',
    description:
      'Nơi hội tụ hơn 1.000 năm lịch sử dân tộc và là căn hầm chỉ huy tối mật của Bộ Tổng Tư lệnh trong suốt 12 ngày đêm Điện Biên Phủ trên không năm 1972.',
    fullDescription:
      'Căn hầm T1 được xây dựng từ năm 1967 dưới lòng đất Hoàng thành Thăng Long, bảo đảm an toàn trước bom đạn hạng nặng. Từ căn hầm này, Đại tướng Võ Nguyên Giáp và Bộ chỉ huy đã phát đi những mệnh lệnh lịch sử đánh bại cuộc tập kích chiến lược B-52 của không quân Mỹ.',
    witnessStory: {
      id: 'witness-hoang-thanh-thang-long',
      title: 'Ký ức 12 ngày đêm Điện Biên Phủ trên không',
      duration: '04:30',
      speakerName: 'Đại tá Nguyễn Văn Khả',
      speakerRole: 'Sĩ quan trực ban tại Hầm T1 tháng 12/1972',
      witnessName: 'Đại tá Nguyễn Văn Khả - Nguyên Cán bộ Cục Tác chiến',
      role: 'Sĩ quan trực ban tại Hầm T1 tháng 12/1972',
      quote:
        'Dưới lớp bê tông dày hàng mét giữa lòng Hoàng Thành cổ kính, tiếng chuông điện thoại nóng từ các trận địa tên lửa phòng không dội về dồn dập. Khi chiếc B-52 đầu tiên bốc cháy trên bầu trời Hà Nội đêm 18/12, cả căn hầm tác chiến như vỡ òa.',
      fullStory:
        'Trong suốt 12 ngày đêm, căn hầm không ngủ. Mọi diễn biến trên bầu trời miền Bắc đều được vẽ trực tiếp lên tấm bản đồ tác chiến lớn. Từng đường bay của pháo đài bay B-52 đều bị theo dõi sát sao.',
      historicalSource: 'Trung tâm Bảo tồn Di sản Thăng Long - Hà Nội',
    },
    storyChallengeIds: [],
    rewardExp: 600,
    tags: ['Hà Nội', 'Hoàng Thành', 'Hầm T1', 'Điện Biên Phủ trên không', '1972'],
  },
  {
    id: 'nha-tu-hoa-lo',
    name: 'Di Tích Nhà Tù Hỏa Lò',
    subtitle: 'Di tích Lịch sử Nhà tù Hỏa Lò (Maison Centrale)',
    categoryTitle: 'Địa danh Ký ức & Nhân chứng',
    category: 'witness',
    rarity: 'rare',
    contentType: 'witness',
    region: 'Hà Nội',
    campaign: 'Hào Khí Thăng Long',
    address: 'Số 1 phố Hỏa Lò, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    coordinates: { lat: 21.0253, lng: 105.8465 },
    discoveryRadius: 10,
    interactionRadius: 80,
    historicalPeriod: 'Thời kỳ Kháng chiến chống Pháp (1896 - 1954)',
    yearEstablished: '1896',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'Biểu tượng cho ý chí kiên cường bất khuất của các chiến sĩ cách mạng Việt Nam giữa chốn lao tù thực dân.',
    description:
      'Biểu tượng cho ý chí kiên cường bất khuất của các chiến sĩ cách mạng Việt Nam giữa chốn lao tù thực dân.',
    fullDescription:
      'Nhà tù Hỏa Lò do thực dân Pháp xây dựng năm 1896, là một trong những nhà tù kiên cố bậc nhất Đông Dương thời bấy giờ nhằm giam giữ các chiến sĩ cách mạng yêu nước. Nơi đây đã trở thành trường học cách mạng tôi luyện ý chí kiên cường của bao thế hệ lãnh tụ tiền bối.',
    witnessStory: {
      id: 'witness-nha-tu-hoa-lo',
      title: 'Cuộc vượt ngục qua cống ngầm đêm Giáng sinh 1945',
      duration: '03:50',
      speakerName: 'Cựu tù chính trị Hỏa Lò',
      speakerRole: 'Nhân chứng cuộc vượt ngục qua cống ngầm đêm Giáng sinh 1945',
      witnessName: 'Cựu tù chính trị Hỏa Lò',
      role: 'Nhân chứng cuộc vượt ngục qua cống ngầm đêm Giáng sinh 1945',
      quote:
        'Trong bóng tối đặc quánh và cái lạnh cắt da của đêm tháng Chạp, từng người chúng tôi lách qua đường cống ngầm chật hẹp dưới chân tường đá. Chỉ có niềm tin về ngày độc lập mới giúp chúng tôi vượt qua cánh cửa tử thần ấy.',
      fullStory:
        'Đêm Giáng sinh năm 1945, lợi dụng lúc lính gác mải mê tiệc tùng, các tù chính trị đã cưa chấn song sắt miệng cống, bí mật bò qua đường cống thoát nước bốc mùi ngột ngạt để thoát ra ngoài phố Nam Ngư, trở về với phong trào cách mạng.',
      historicalSource: 'Ban Quản lý Di tích Nhà tù Hỏa Lò',
    },
    storyChallengeIds: [],
    rewardExp: 450,
    tags: ['Hà Nội', 'Hỏa Lò', 'Tù chính trị', 'Nhân chứng'],
  },
  {
    id: 'thanh-co-quang-tri',
    name: 'Thành Cổ Quảng Trị - Mùa Hè Đỏ Lửa 1972',
    subtitle: 'Di tích Quốc gia Đặc biệt Thành Cổ Quảng Trị',
    categoryTitle: 'Chiến trường Lịch sử Oanh liệt',
    category: 'battlefield',
    rarity: 'legendary',
    contentType: 'battlefield',
    region: 'Quảng Trị',
    campaign: 'Vành Đai Thép Miền Trung',
    address: 'Phường 2, Thị xã Quảng Trị, Tỉnh Quảng Trị',
    coordinates: { lat: 16.7505, lng: 107.1897 },
    discoveryRadius: 25,
    interactionRadius: 120,
    historicalPeriod: 'Chiến dịch 81 ngày đêm mùa hè đỏ lửa 1972',
    yearEstablished: '1809',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'Khúc tráng ca 81 ngày đêm mùa hè năm 1972 bảo vệ từng tấc đất Thành Cổ và dòng sông Thạch Hãn.',
    description:
      'Khúc tráng ca 81 ngày đêm mùa hè năm 1972 bảo vệ từng tấc đất Thành Cổ và dòng sông Thạch Hãn.',
    fullDescription:
      'Thành Cổ Quảng Trị là chiến trường khốc liệt nhất trong cuộc kháng chiến chống Mỹ cứu nước. Trong 81 ngày đêm mùa hè năm 1972, mảnh đất chưa đầy 3 cây số vuông này phải hứng chịu hơn 328.000 tấn bom đạn, tương đương sức công phá của 7 quả bom nguyên tử ném xuống Hiroshima.',
    witnessStory: {
      id: 'witness-thanh-co-quang-tri',
      title: 'Bức thư dưới đáy ba lô và khúc tráng ca sông Thạch Hãn',
      duration: '04:10',
      speakerName: 'Liệt sĩ Lê Văn Huỳnh',
      speakerRole: 'Chiến sĩ bảo vệ Thành Cổ Quảng Trị năm 1972',
      witnessName: 'Liệt sĩ Lê Văn Huỳnh (Trích bức thư gửi gia đình)',
      role: 'Chiến sĩ bảo vệ Thành Cổ Quảng Trị năm 1972',
      quote:
        'Đò lên Thạch Hãn ơi chèo nhẹ, đáy sông còn đó bạn tôi nằm. Có tuổi hai mươi thành sóng nước, vỗ yên bờ bãi mãi ngàn năm...',
      fullStory:
        'Những người lính tuổi mười chín, đôi mươi vượt sông Thạch Hãn vào Thành Cổ với tinh thần quyết tử cho Tổ quốc quyết sinh. Mỗi tấc đất Thành Cổ hôm nay đều thấm đượm máu xương của các anh hùng liệt sĩ.',
      historicalSource: 'Bảo tàng Thành Cổ Quảng Trị & Di tích Quốc gia',
    },
    storyChallengeIds: [],
    rewardExp: 650,
    tags: ['Quảng Trị', 'Thành Cổ', 'Thạch Hãn', '1972', 'Khúc tráng ca'],
  },
  {
    id: 'doi-a1-dien-bien-phu',
    name: 'Đồi A1 - Chiến Trường Điện Biên Phủ',
    subtitle: 'Cứ điểm Eliane 2 · Di tích Quốc gia Đặc biệt Chiến trường Điện Biên Phủ',
    categoryTitle: 'Cứ điểm Chiến trường Lịch sử',
    category: 'battlefield',
    rarity: 'legendary',
    contentType: 'battlefield',
    region: 'Điện Biên',
    campaign: 'Lừng Lẫy Năm Châu',
    address: 'Phường Mường Thanh, Thành phố Điện Biên Phủ, Tỉnh Điện Biên',
    coordinates: { lat: 21.3856, lng: 103.0218 },
    discoveryRadius: 30,
    interactionRadius: 150,
    historicalPeriod: 'Chiến dịch Điện Biên Phủ (1954)',
    yearEstablished: '1954',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    historicalSummary:
      'Cứ điểm phòng ngự kiên cố bậc nhất tại phân khu trung tâm tập đoàn cứ điểm Điện Biên Phủ, nơi diễn ra khối bộc phá 960kg lịch sử đêm 6/5/1954.',
    description:
      'Cứ điểm phòng ngự kiên cố bậc nhất tại phân khu trung tâm tập đoàn cứ điểm Điện Biên Phủ, nơi diễn ra khối bộc phá 960kg lịch sử đêm 6/5/1954.',
    fullDescription:
      'Đồi A1 (Eliane 2) có vị trí sống còn khống chế toàn bộ phân khu trung tâm Mường Thanh. Quân đội ta đã đào đường hầm bí mật dài 47m xuyên vào lòng đồi và đặt khối bộc phá 960kg thuốc nổ. Tiếng nổ long trời lở đất đêm 6/5/1954 đã báo hiệu hồi kết của tập đoàn cứ điểm Điện Biên Phủ.',
    witnessStory: {
      id: 'witness-doi-a1-dien-bien-phu',
      title: 'Đường hầm bí mật và khối bộc phá 960kg',
      duration: '04:45',
      speakerName: 'Anh hùng Nguyễn Phú Xuyên Khung',
      speakerRole: 'Đại đội trưởng công binh đào đường hầm Đồi A1',
      witnessName: 'Anh hùng Nguyễn Phú Xuyên Khung',
      role: 'Đại đội trưởng công binh đào đường hầm Đồi A1',
      quote:
        'Suốt 16 ngày đêm đào từng centimet đất sét cứng dưới làn đạn pháo, khi tiếng nổ trầm đục của gần một tấn thuốc nổ vang lên lúc 20 giờ 30 phút ngày 6/5/1954, chúng tôi biết giờ toàn thắng đã điểm.',
      fullStory:
        'Chiến sĩ công binh phải dùng xẻng ngắn, dùng mũ nan cạo đất trong đường hầm chật hẹp thiếu dưỡng khí. Mỗi tấc đất đào được là một tấc xương máu hướng tới ngày toàn thắng Điện Biên Phủ.',
      historicalSource: 'Bảo tàng Chiến thắng Lịch sử Điện Biên Phủ',
    },
    storyChallengeIds: [],
    rewardExp: 700,
    tags: ['Điện Biên', 'Đồi A1', '1954', 'Điện Biên Phủ', 'Lừng lẫy năm châu'],
  },
];

// Nạp thêm các di tích chiến dịch quốc gia vào danh sách mặc định
MOCK_LOCATIONS.push(...NATIONAL_CAMPAIGN_LOCATIONS);

