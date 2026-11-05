// src/components/minigame/StorytellerEngine.tsx
"use client";

import React, { useState, useEffect } from "react";

export interface InteractiveElement {
  id: string;
  labelVi: string;
  labelEn: string;
  hintVi: string;
  hintEn: string;
  icon: string;
  isCorrect: boolean;
  artifactImage: string;
  artifactDetailVi: string;
  artifactDetailEn: string;
}

export interface StoryFrame {
  stageNumber: number;
  timeStamp: string;
  titleVi: string;
  titleEn: string;
  narrativeVi: string;
  narrativeEn: string;
  imageUrl: string;
  imageCaptionVi: string;
  imageCaptionEn: string;
  promptVi: string;
  promptEn: string;
  elements: InteractiveElement[];
}

export interface HeritageChapter {
  id: "dinh-doc-lap" | "ben-nha-rong";
  nameVi: string;
  nameEn: string;
  year: string;
  locationVi: string;
  locationEn: string;
  overviewVi: string;
  overviewEn: string;
  heroImage: string;
  epilogueVi: string;
  epilogueEn: string;
  frames: StoryFrame[];
}

const HERITAGE_CHAPTERS: Record<"dinh-doc-lap" | "ben-nha-rong", HeritageChapter> = {
  "dinh-doc-lap": {
    id: "dinh-doc-lap",
    nameVi: "Chiến dịch Hồ Chí Minh - Dinh Độc Lập",
    nameEn: "Ho Chi Minh Campaign - Independence Palace",
    year: "30/04/1975",
    locationVi: "Số 135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM",
    locationEn: "135 Nam Ky Khoi Nghia, District 1, HCMC",
    heroImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    overviewVi:
      "Di tích Quốc gia Đặc biệt Dinh Độc Lập là nơi chứng kiến thời khắc lịch sử trưa ngày 30/04/1975 khi Lữ đoàn Tăng thiết giáp 203 tiến vào cổng chính, kết thúc 30 năm chiến tranh và thống nhất đất nước.",
    overviewEn:
      "The Independence Palace Special National Monument witnessed the historic noon of April 30, 1975, when the 203rd Armored Brigade entered the main gate, ending 30 years of war and reunifying the country.",
    epilogueVi:
      "6 mảnh ghép thời gian từ rạng sáng đến 11 giờ 30 phút ngày 30/04/1975 đã hợp nhất thành bức tranh toàn cảnh ngày toàn thắng. Non sông thu về một mối, mở ra kỷ nguyên hòa bình và độc lập cho toàn dân tộc.",
    epilogueEn:
      "The 6 chronological frames from dawn to 11:30 AM on April 30, 1975 have united into a complete panorama of Victory Day, ushering in an era of peace and reunification.",
    frames: [
      {
        stageNumber: 1,
        timeStamp: "05:30 • 30/04/1975",
        titleVi: "Khung 1: Năm Cánh Quân Thần Tốc Hợp Điểm",
        titleEn: "Frame 1: Five Columns Converge on Saigon",
        narrativeVi:
          "Rạng sáng 30/04/1975, năm cánh quân lớn cùng lực lượng vũ trang tại chỗ đồng loạt vượt qua các tuyến phòng thủ vòng ngoài, tiến thẳng vào trung tâm Sài Gòn với tinh thần 'Thần tốc, táo bạo, bất ngờ, chắc thắng'.",
        narrativeEn:
          "At dawn on April 30, 1975, five main army corps simultaneously breached the outer defense perimeters, advancing directly toward central Saigon.",
        imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Bản đồ tác chiến 5 mũi tiến công vào nội đô Sài Gòn",
        imageCaptionEn: "Tactical map of the 5-pronged advance into central Saigon",
        promptVi: "Chọn kỷ vật chỉ huy gắn liền với mệnh lệnh tiến quân thần tốc:",
        promptEn: "Select the command relic tied to the rapid advance order:",
        elements: [
          {
            id: "ddl-1-a",
            labelVi: "Bản đồ Tác chiến Chiến dịch Hồ Chí Minh",
            labelEn: "Ho Chi Minh Campaign Tactical Map",
            hintVi: "Bản đồ đánh dấu 5 mũi tiến công hợp vây hướng về mục tiêu Dinh Độc Lập.",
            hintEn: "The operational map marking 5 converging arrows toward Independence Palace.",
            icon: "🗺️",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Bản đồ tác chiến có chữ ký phê duyệt của Bộ Tư lệnh Chiến dịch tại căn cứ Tà Thiết.",
            artifactDetailEn: "Operational map signed by the Campaign High Command at Ta Thiet base.",
          },
          {
            id: "ddl-1-b",
            labelVi: "La bàn Hàng hải Viễn dương",
            labelEn: "Oceanic Maritime Compass",
            hintVi: "Kỷ vật thuộc về hành trình đường biển.",
            hintEn: "Belongs to a maritime voyage.",
            icon: "🧭",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Dụng cụ định hướng trên tàu biển đầu thế kỷ XX.",
            artifactDetailEn: "Early 20th-century maritime navigation instrument.",
          },
          {
            id: "ddl-1-c",
            labelVi: "Trống đồng Cổ Loa",
            labelEn: "Co Loa Bronze Drum",
            hintVi: "Kỷ vật thời kỳ dựng nước Âu Lạc.",
            hintEn: "Relic from the Au Lac era.",
            icon: "🥁",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Hiện vật tiêu biểu của nền văn minh sông Hồng.",
            artifactDetailEn: "Iconic artifact of the Red River civilization.",
          },
        ],
      },
      {
        stageNumber: 2,
        timeStamp: "09:15 • 30/04/1975",
        titleVi: "Khung 2: Vượt Cầu Thị Nghè Tiến Vào Nội Đô",
        titleEn: "Frame 2: Crossing Thi Nghe Bridge into the Inner City",
        narrativeVi:
          "Đại đội 4 thuộc Lữ đoàn Tăng thiết giáp 203 dẫn đầu đội hình thọc sâu vượt qua cầu Thị Nghè, đập tan các ổ đề kháng cuối cùng trên trục đường Hồng Thập Tự (nay là Nguyễn Thị Minh Khai).",
        narrativeEn:
          "Company 4 of the 203rd Armored Brigade spearheaded the deep-thrust column across Thi Nghe Bridge along Hong Thap Tu Street.",
        imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Tuyến đường cơ động của biên đội xe tăng tiến về trung tâm",
        imageCaptionEn: "Armored column route advancing toward the city center",
        promptVi: "Chọn trang bị liên lạc giúp các mũi xe tăng hiệp đồng tác chiến:",
        promptEn: "Select the communication gear coordinating the tank squadrons:",
        elements: [
          {
            id: "ddl-2-a",
            labelVi: "Mũ Công tác & Điện đài Thiết giáp",
            labelEn: "Tanker Helmet & Field Radio",
            hintVi: "Thiết bị giữ liên lạc giữa trưởng xe và sở chỉ huy tiền phương.",
            hintEn: "Equipment maintaining contact between tank commanders and forward HQ.",
            icon: "🎧",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Mũ chống chấn động tích hợp tai nghe vô tuyến của kíp chiến đấu xe tăng T-54B/Type-59.",
            artifactDetailEn: "Padded tanker helmet with integrated radio headset used by T-54B/Type-59 crews.",
          },
          {
            id: "ddl-2-b",
            labelVi: "Ống nhòm Kịch trường Cổ điển",
            labelEn: "Vintage Opera Glasses",
            hintVi: "Không phải khí tài quân sự.",
            hintEn: "Not military equipment.",
            icon: "🔭",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Vật dụng cá nhân trong nhà hát.",
            artifactDetailEn: "Personal theater accessory.",
          },
          {
            id: "ddl-2-c",
            labelVi: "Đèn Bão Dầu Hỏa",
            labelEn: "Kerosene Storm Lantern",
            hintVi: "Dùng trong sinh hoạt dưới hầm trú ẩn.",
            hintEn: "Used inside underground shelters.",
            icon: "🏮",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Đèn thắp sáng dân dụng thời kháng chiến.",
            artifactDetailEn: "Civilian lighting lantern.",
          },
        ],
      },
      {
        stageNumber: 3,
        timeStamp: "10:45 • 30/04/1975",
        titleVi: "Khung 3: Xe Tăng 843 & 390 Húc Đổ Cổng Dinh Độc Lập",
        titleEn: "Frame 3: Tanks 843 & 390 Breach the Palace Gates",
        narrativeVi:
          "Xe tăng 843 do Đại đội trưởng Bùi Quang Thận chỉ huy lao vào cổng phụ bên trái, tiếp ngay sau đó xe tăng 390 do Chính trị viên Vũ Đăng Toàn chỉ huy húc tung cánh cổng sắt chính tiến thẳng vào sân Dinh.",
        narrativeEn:
          "Tank 843 commanded by Bui Quang Than rammed the left side gate, immediately followed by Tank 390 under Vu Dang Toan crashing straight through the main iron gate.",
        imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Cổng chính Dinh Độc Lập nơi hai chiếc xe tăng lịch sử tiến vào",
        imageCaptionEn: "Main gate of Independence Palace entered by the two historic tanks",
        promptVi: "Chọn Bảo vật Quốc gia gắn liền với khoảnh khắc mở cánh cổng thống nhất:",
        promptEn: "Select the National Treasure tied to breaching the main gate:",
        elements: [
          {
            id: "ddl-3-a",
            labelVi: "Biên đội Xe tăng 843 & 390",
            labelEn: "Armored Tanks 843 & 390",
            hintVi: "Hai chiếc xe tăng dẫn đầu Lữ đoàn 203 tiến vào sân cỏ Dinh Độc Lập.",
            hintEn: "The two lead tanks of Brigade 203 entering the Palace lawn.",
            icon: "🛡️",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Cả hai chiếc xe tăng 843 và 390 đều đã được công nhận là Bảo vật Quốc gia Việt Nam.",
            artifactDetailEn: "Both Tanks 843 and 390 are officially recognized as National Treasures of Vietnam.",
          },
          {
            id: "ddl-3-b",
            labelVi: "Đầu máy Hơi nước Tự lực",
            labelEn: "Tu Luc Steam Locomotive",
            hintVi: "Phương tiện giao thông đường sắt.",
            hintEn: "Railway transport vehicle.",
            icon: "🚂",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Đầu máy xe lửa lịch sử ngành đường sắt Việt Nam.",
            artifactDetailEn: "Historic steam locomotive of Vietnam Railways.",
          },
          {
            id: "ddl-3-c",
            labelVi: "Thuyền Độc Mộc Tây Nguyên",
            labelEn: "Central Highlands Dugout Canoe",
            hintVi: "Phương tiện vượt sông Pô Cô.",
            hintEn: "River-crossing canoe.",
            icon: "🛶",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Phương tiện vận chuyển bộ đội qua sông.",
            artifactDetailEn: "Troop transport canoe.",
          },
        ],
      },
      {
        stageNumber: 4,
        timeStamp: "11:15 • 30/04/1975",
        titleVi: "Khung 4: Bước Chân Thần Tốc Lên Cầu Thang Chính",
        titleEn: "Frame 4: Ascending the Grand Staircase",
        narrativeVi:
          "Đại đội trưởng Bùi Quang Thận rút lá cờ trên tháp pháo xe tăng 843, cùng các chiến sĩ bộ binh Quân đoàn 2 băng qua thảm cỏ và tiến nhanh lên bậc thềm tam cấp hướng tới nóc tòa nhà.",
        narrativeEn:
          "Company Commander Bui Quang Than detached the flag from Tank 843's antenna and sprinted up the grand staircase toward the rooftop.",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Hành lang và cầu thang trung tâm bên trong Dinh Độc Lập",
        imageCaptionEn: "Central corridor and grand staircase inside Independence Palace",
        promptVi: "Chọn kỷ vật thiêng liêng được người chiến sĩ cầm chặt trên tay khi chạy lên tầng thượng:",
        promptEn: "Select the sacred relic held tightly while ascending to the roof:",
        elements: [
          {
            id: "ddl-4-a",
            labelVi: "Lá cờ Mặt trận Dân tộc Giải phóng",
            labelEn: "National Liberation Front Flag",
            hintVi: "Lá cờ nửa đỏ nửa xanh với ngôi sao vàng năm cánh ở giữa.",
            hintEn: "Half-red, half-blue banner with a central five-pointed gold star.",
            icon: "🚩",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Lá cờ lịch sử có ghi dòng chữ 'Quết tâm - 11g30 30/4/1975' lưu giữ tại Bảo tàng Lịch sử Quân sự.",
            artifactDetailEn: "The historic flag inscribed with '11:30 30/4/1975' preserved at the Military History Museum.",
          },
          {
            id: "ddl-4-b",
            labelVi: "Chiếu Dời Đô Khắc Gỗ",
            labelEn: "Woodblock Edict on the Transfer of the Capital",
            hintVi: "Văn kiện thời Lý Công Uẩn năm 1010.",
            hintEn: "1010 royal edict by Ly Cong Uan.",
            icon: "📜",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Tư liệu Hán Nôm thời nhà Lý.",
            artifactDetailEn: "Ly Dynasty royal document.",
          },
          {
            id: "ddl-4-c",
            labelVi: "Bình Gốm Chu Đậu",
            labelEn: "Chu Dau Ceramic Vase",
            hintVi: "Hiện vật mỹ thuật cổ truyền.",
            hintEn: "Traditional ceramic art piece.",
            icon: "🏺",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Gốm cổ Hải Dương thế kỷ XV.",
            artifactDetailEn: "15th-century ceramic artifact.",
          },
        ],
      },
      {
        stageNumber: 5,
        timeStamp: "11:30 • 30/04/1975",
        titleVi: "Khung 5: Cờ Giải Phóng Tung Bay Trên Nóc Dinh",
        titleEn: "Frame 5: Liberation Banner Flies Above the Rooftop",
        narrativeVi:
          "Đúng 11 giờ 30 phút ngày 30/04/1975, lá cờ Giải phóng được kéo lên tung bay kiêu hãnh trên cột cờ nóc Dinh Độc Lập, báo hiệu Chiến dịch Hồ Chí Minh toàn thắng.",
        narrativeEn:
          "At exactly 11:30 AM on April 30, 1975, the Liberation banner was raised atop the Independence Palace flagpole, signaling complete victory.",
        imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Khoảnh khắc lịch sử 11:30 trưa ngày 30/04/1975 trên nóc Dinh",
        imageCaptionEn: "The historic 11:30 AM moment atop the Palace roof",
        promptVi: "Chọn hiện vật ghi dấu chính xác thời khắc lịch sử 11 giờ 30 phút:",
        promptEn: "Select the artifact marking the exact 11:30 AM historic moment:",
        elements: [
          {
            id: "ddl-5-a",
            labelVi: "Đồng hồ Chiến dịch & Nhật ký Cắm cờ",
            labelEn: "Campaign Watch & Flag-Raising Log",
            hintVi: "Ghi nhận mốc thời gian 11 giờ 30 phút trưa ngày 30/04/1975.",
            hintEn: "Recorded the exact timestamp of 11:30 AM on April 30, 1975.",
            icon: "⏱️",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Mốc thời gian 11:30 được ghi trực tiếp lên cổ lá cờ lịch sử ngay trên tầng thượng.",
            artifactDetailEn: "The 11:30 timestamp was written directly onto the flag collar on the rooftop.",
          },
          {
            id: "ddl-5-b",
            labelVi: "Đồng hồ Mặt trời Đá Xanh",
            labelEn: "Bluestone Sundial",
            hintVi: "Dụng cụ đo giờ tại Hoàng thành Huế.",
            hintEn: "Timekeeping instrument at Hue Imperial City.",
            icon: "☀️",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Nhật khuê thời Nguyễn.",
            artifactDetailEn: "Nguyen Dynasty sundial.",
          },
          {
            id: "ddl-5-c",
            labelVi: "Chuông Đồng Chùa Cổ",
            labelEn: "Ancient Pagoda Bronze Bell",
            hintVi: "Pháp khí kiến trúc tôn giáo.",
            hintEn: "Religious architectural bell.",
            icon: "🔔",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Đại hồng chung đúc đồng.",
            artifactDetailEn: "Cast bronze temple bell.",
          },
        ],
      },
      {
        stageNumber: 6,
        timeStamp: "12:15 • 30/04/1975",
        titleVi: "Khung 6: Bản Tuyên Bố Hòa Bình Trên Đài Phát Thanh",
        titleEn: "Frame 6: Peace Broadcast at Saigon Radio Station",
        narrativeVi:
          "Từ Dinh Độc Lập, các cán bộ chỉ huy Trung đoàn 66 (Quân đoàn 2) đưa nội các chính quyền Sài Gòn sang Đài Phát thanh để đọc tuyên bố chấm dứt chiến tranh, tránh đổ máu cho nhân dân thành phố.",
        narrativeEn:
          "Officers of Regiment 66 (2nd Corps) escorted the Saigon cabinet to the Radio Station to broadcast the unconditional surrender, sparing the city further bloodshed.",
        imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Máy ghi âm và micro phát thanh bản tin hòa bình trưa 30/04/1975",
        imageCaptionEn: "Tape recorder and microphone broadcasting peace at noon on April 30, 1975",
        promptVi: "Chọn kỷ vật truyền đi thông điệp hòa bình thống nhất trên sóng phát thanh:",
        promptEn: "Select the relic that recorded and broadcast the peace announcement:",
        elements: [
          {
            id: "ddl-6-a",
            labelVi: "Máy Ghi âm Cassette & Micro Phát thanh",
            labelEn: "Cassette Recorder & Broadcast Microphone",
            hintVi: "Thiết bị thu âm lời tuyên bố đầu hàng vô điều kiện tại Đài Phát thanh Sài Gòn.",
            hintEn: "Recorded the unconditional surrender statement at Saigon Radio Station.",
            icon: "🎙️",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Chiếc máy ghi âm băng từ lưu giữ toàn vẹn âm thanh lịch sử trưa 30/04/1975.",
            artifactDetailEn: "Magnetic tape recorder preserving the historic audio broadcast of April 30, 1975.",
          },
          {
            id: "ddl-6-b",
            labelVi: "Đàn Đá Bình Phước",
            labelEn: "Binh Phuoc Lithophone",
            hintVi: "Nhạc cụ cổ đại bằng đá.",
            hintEn: "Prehistoric stone musical instrument.",
            icon: "🎶",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Nhạc khí tiền sử niên đại 3.000 năm.",
            artifactDetailEn: "3,000-year-old prehistoric lithophone.",
          },
          {
            id: "ddl-6-c",
            labelVi: "Kính Viễn Vọng Thiên Văn",
            labelEn: "Astronomical Telescope",
            hintVi: "Dụng cụ quan sát bầu trời.",
            hintEn: "Sky observation instrument.",
            icon: "🔭",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Thiết bị nghiên cứu thiên văn học.",
            artifactDetailEn: "Astronomical research device.",
          },
        ],
      },
    ],
  },
  "ben-nha-rong": {
    id: "ben-nha-rong",
    nameVi: "Hành Trình Vượt Biển - Bến Nhà Rồng",
    nameEn: "Voyage Across the Seas - Dragon Wharf",
    year: "05/06/1911",
    locationVi: "Số 01 Nguyễn Tất Thành, Quận 4, TP.HCM",
    locationEn: "01 Nguyen Tat Thanh, District 4, HCMC",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    overviewVi:
      "Trụ sở thương cảng Messageries Maritimes với biểu tượng đôi rồng chầu mặt trăng trên nóc mái – nơi người thanh niên Nguyễn Tất Thành với tên gọi Văn Ba bước lên tàu Amiral Latouche-Tréville ngày 05/06/1911.",
    overviewEn:
      "The historic Messageries Maritimes building topped with two ceramic dragons flanking the moon, where young Nguyen Tat Thanh boarded the Amiral Latouche-Tréville on June 5, 1911.",
    epilogueVi:
      "Chuyến hải trình khởi đầu từ Bến cảng Nhà Rồng ngày 05/06/1911 đã đi qua 3 đại dương, 4 châu lục trong suốt 30 năm, đặt nền móng cho nền độc lập của dân tộc Việt Nam.",
    epilogueEn:
      "The voyage begun at Dragon Wharf on June 5, 1911 spanned 3 oceans and 4 continents over 30 years, laying the foundation for Vietnam's independence.",
    frames: [
      {
        stageNumber: 1,
        timeStamp: "02/06/1911 • Thương cảng Sài Gòn",
        titleVi: "Khung 1: Bến Cảng Bên Dòng Sông Sài Gòn",
        titleEn: "Frame 1: The Wharf by the Saigon River",
        narrativeVi:
          "Đầu tháng 6 năm 1911, tại bến cảng Nhà Rồng tấp nập tàu buôn Pháp, người thanh niên Nguyễn Tất Thành quyết tâm tìm kiếm cơ hội làm việc trên một con tàu viễn dương sang phương Tây.",
        narrativeEn:
          "In early June 1911, at the bustling Dragon Wharf, young Nguyen Tat Thanh sought work aboard an ocean liner bound for Europe.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Kiến trúc Bến Nhà Rồng bên ngã ba sông Sài Gòn đầu thế kỷ XX",
        imageCaptionEn: "Dragon Wharf architecture by the Saigon River in the early 20th century",
        promptVi: "Chọn biểu tượng kiến trúc đặc trưng trên đỉnh mái tòa nhà Bến Nhà Rồng:",
        promptEn: "Select the distinctive architectural emblem atop the Dragon Wharf roof:",
        elements: [
          {
            id: "bnr-1-a",
            labelVi: "Phù điêu Lưỡng Long Chầu Nguyệt",
            labelEn: "Two Dragons Flanking the Moon Crest",
            hintVi: "Đôi rồng gốm men xanh chầu mặt trăng trên đỉnh mái tòa nhà thương cảng.",
            hintEn: "Glazed ceramic dragons flanking the moon atop the port building roof.",
            icon: "🐉",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Kiến trúc kết hợp Á – Âu xây dựng năm 1863 tạo nên tên gọi dân gian 'Nhà Rồng'.",
            artifactDetailEn: "Built in 1863, this East-West roof motif gave rise to the popular name 'Dragon House'.",
          },
          {
            id: "bnr-1-b",
            labelVi: "Xe tăng Thiết giáp T-54B",
            labelEn: "T-54B Armored Tank",
            hintVi: "Thuộc chiến dịch năm 1975.",
            hintEn: "Belongs to the 1975 campaign.",
            icon: "🛡️",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Hiện vật thuộc Dinh Độc Lập, không thuộc bối cảnh 1911.",
            artifactDetailEn: "Artifact of Independence Palace, not from 1911.",
          },
          {
            id: "bnr-1-c",
            labelVi: "Cổng Thành Đá Tổ Ong",
            labelEn: "Laterite Stone Citadel Gate",
            hintVi: "Kiến trúc thành cổ Sơn Tây.",
            hintEn: "Son Tay ancient citadel gate.",
            icon: "🏯",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Kiến trúc quân sự thế kỷ XIX ở miền Bắc.",
            artifactDetailEn: "19th-century northern military citadel.",
          },
        ],
      },
      {
        stageNumber: 2,
        timeStamp: "03/06/1911 • Tàu Amiral Latouche-Tréville",
        titleVi: "Khung 2: Thẻ Thủy Thủ Mang Tên Văn Ba",
        titleEn: "Frame 2: Seaman Pass Under the Name Van Ba",
        narrativeVi:
          "Với tên gọi Văn Ba, người thanh niên được nhận vào làm phụ bếp trên con tàu buôn kết hợp chở khách mang tên Đô đốc Latouche-Tréville của hãng Năm Sao.",
        narrativeEn:
          "Using the name Van Ba, he was hired as a kitchen assistant aboard the mixed cargo-passenger steamer Amiral Latouche-Tréville.",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Mô hình tàu buôn hơi nước Amiral Latouche-Tréville năm 1911",
        imageCaptionEn: "Scale model of the steamship Amiral Latouche-Tréville (1911)",
        promptVi: "Chọn kỷ vật ghi danh người phụ bếp trẻ tuổi trên con tàu viễn dương:",
        promptEn: "Select the document registering the young kitchen helper aboard the ship:",
        elements: [
          {
            id: "bnr-2-a",
            labelVi: "Sổ Lương Thủy Thủ 'Văn Ba'",
            labelEn: "Crew Payroll Ledger 'Van Ba'",
            hintVi: "Văn bản ghi nhận công việc phụ bếp từ ngày 03/06/1911.",
            hintEn: "Official ship roster recording Van Ba's employment starting June 3, 1911.",
            icon: "🪪",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Bản sao tư liệu danh sách thủy thủ đoàn tàu Amiral Latouche-Tréville trưng bày tại Bảo tàng Hồ Chí Minh.",
            artifactDetailEn: "Archival crew list copy displayed at the Ho Chi Minh Museum.",
          },
          {
            id: "bnr-2-b",
            labelVi: "Máy Ghi Âm Phát Thanh",
            labelEn: "Radio Tape Recorder",
            hintVi: "Thiết bị năm 1975.",
            hintEn: "1975 broadcast equipment.",
            icon: "🎙️",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Thiết bị thuộc thời kỳ kháng chiến chống Mỹ.",
            artifactDetailEn: "Equipment from the 1975 era.",
          },
          {
            id: "bnr-2-c",
            labelVi: "Mũ Sắt Chiến Sĩ",
            labelEn: "Combat Steel Helmet",
            hintVi: "Trang bị chiến đấu bộ binh.",
            hintEn: "Infantry combat gear.",
            icon: "🪖",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Trang bị quân sự hiện đại.",
            artifactDetailEn: "Modern military helmet.",
          },
        ],
      },
      {
        stageNumber: 3,
        timeStamp: "05/06/1911 • Nhổ Neo Rời Bến",
        titleVi: "Khung 3: Hải Trình Vượt Đại Dương Tìm Đường Cứu Nước",
        titleEn: "Frame 3: Setting Sail Across the Ocean",
        narrativeVi:
          "Trưa ngày 05/06/1911, con tàu Amiral Latouche-Tréville kéo còi nhổ neo rời cảng Sài Gòn tiến ra cửa biển Cần Giờ, mở đầu cuộc hành trình vạn dặm tìm con đường giải phóng dân tộc.",
        narrativeEn:
          "At noon on June 5, 1911, the Amiral Latouche-Tréville weighed anchor and steamed down the Saigon River toward the open sea.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
        imageCaptionVi: "Hải đồ từ cảng Sài Gòn hướng tới cảng Marseille (Pháp)",
        imageCaptionEn: "Maritime chart from Saigon Port to Marseille, France",
        promptVi: "Chọn kỷ vật gắn liền với hành trình vượt đại dương năm 1911:",
        promptEn: "Select the relic representing the 1911 ocean voyage:",
        elements: [
          {
            id: "bnr-3-a",
            labelVi: "La Bàn Hải Trình & Hải Đồ Sài Gòn - Marseille",
            labelEn: "Maritime Compass & Saigon-Marseille Chart",
            hintVi: "Định hướng chuyến hải trình vượt Ấn Độ Dương và kênh đào Suez.",
            hintEn: "Guided the voyage across the Indian Ocean and Suez Canal.",
            icon: "🧭",
            isCorrect: true,
            artifactImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Hải trình lịch sử đi qua Singapore, Colombo, Port Said trước khi cập cảng Marseille ngày 06/07/1911.",
            artifactDetailEn: "Historic route passing Singapore, Colombo, and Port Said before reaching Marseille on July 6, 1911.",
          },
          {
            id: "bnr-3-b",
            labelVi: "Bản đồ 5 Cánh Quân 1975",
            labelEn: "1975 Five Columns Map",
            hintVi: "Thuộc Chiến dịch Hồ Chí Minh.",
            hintEn: "Belongs to the Ho Chi Minh Campaign.",
            icon: "🗺️",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Tư liệu quân sự năm 1975.",
            artifactDetailEn: "1975 military document.",
          },
          {
            id: "bnr-3-c",
            labelVi: "Trống trận Tây Sơn",
            labelEn: "Tay Son War Drum",
            hintVi: "Kỷ vật thế kỷ XVIII.",
            hintEn: "18th-century war drum.",
            icon: "🥁",
            isCorrect: false,
            artifactImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
            artifactDetailVi: "Hiện vật thời nghĩa quân Tây Sơn.",
            artifactDetailEn: "Tay Son era artifact.",
          },
        ],
      },
    ],
  },
};

export interface StorytellerEngineProps {
  initialChapter?: "dinh-doc-lap" | "ben-nha-rong";
  lang?: "vi" | "en";
  story?: any;
  stage?: any;
  onBack?: () => void;
  onStageCompleted?: () => void;
}

export default function StorytellerEngine({
  initialChapter = "dinh-doc-lap",
  lang: propLang = "vi",
  onBack: _onBack,
  onStageCompleted: _onStageCompleted,
}: StorytellerEngineProps = {}) {
  const [lang, setLang] = useState<"vi" | "en">(propLang);
  const [selectedChapterId, setSelectedChapterId] = useState<"dinh-doc-lap" | "ben-nha-rong">(
    initialChapter
  );
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [unlockedStages, setUnlockedStages] = useState<number[]>([]);
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showArtifactVault, setShowArtifactVault] = useState<boolean>(false);

  useEffect(() => {
    if (initialChapter && initialChapter !== selectedChapterId) {
      setSelectedChapterId(initialChapter);
      setCurrentStageIndex(0);
      setUnlockedStages([]);
      setSelectedElement(null);
      setFeedbackState("idle");
    }
  }, [initialChapter]);

  useEffect(() => {
    if (propLang && propLang !== lang) {
      setLang(propLang);
    }
  }, [propLang]);

  const chapter = HERITAGE_CHAPTERS[selectedChapterId];
  const totalFrames = chapter.frames.length;
  // Khi currentStageIndex === totalFrames (ví dụ Màn 7 đối với Dinh Độc Lập 6 khung), hiển thị màn Ghép Tranh Toàn Cảnh
  const isFinalPanoramaStage = currentStageIndex === totalFrames;
  const activeFrame = !isFinalPanoramaStage ? chapter.frames[currentStageIndex] : null;

  const handleSwitchChapter = (id: "dinh-doc-lap" | "ben-nha-rong") => {
    setSelectedChapterId(id);
    setCurrentStageIndex(0);
    setUnlockedStages([]);
    setSelectedElement(null);
    setFeedbackState("idle");
  };

  const handleSelectElement = (el: InteractiveElement) => {
    setSelectedElement(el);
    if (el.isCorrect) {
      setFeedbackState("correct");
      if (!unlockedStages.includes(currentStageIndex)) {
        setUnlockedStages((prev) => [...prev, currentStageIndex]);
      }
    } else {
      setFeedbackState("wrong");
    }
  };

  const handleAdvanceNextStage = () => {
    setSelectedElement(null);
    setFeedbackState("idle");
    setCurrentStageIndex((prev) => Math.min(prev + 1, totalFrames));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-7 space-y-6 pb-20">
      {/* Thanh tiêu đề & Chọn Chiến dịch (Tách biệt hoàn toàn Bến Nhà Rồng và Dinh Độc Lập) */}
      <div className="heritage-card rounded-2xl p-4 lg:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B1E1E]">
            {lang === "vi" ? "Hệ thống Giải mã Biên niên sử" : "Interactive Chronicle Engine"}
          </span>
          <h1 className="font-heritage text-xl lg:text-2xl font-bold text-[#2B2118]">
            {lang === "vi" ? chapter.nameVi : chapter.nameEn}
          </h1>
          <p className="text-xs text-[#5C4938] mt-0.5">
            📍 {lang === "vi" ? chapter.locationVi : chapter.locationEn} • Mốc {chapter.year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Nút chuyển đổi giữa 2 di tích độc lập */}
          <button
            onClick={() => handleSwitchChapter("dinh-doc-lap")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              selectedChapterId === "dinh-doc-lap"
                ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#E6C786] shadow"
                : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D] hover:bg-[#EAE0D0]"
            }`}
          >
            🏛️ Dinh Độc Lập (7 Màn)
          </button>
          <button
            onClick={() => handleSwitchChapter("ben-nha-rong")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              selectedChapterId === "ben-nha-rong"
                ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#E6C786] shadow"
                : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D] hover:bg-[#EAE0D0]"
            }`}
          >
            🚢 Bến Nhà Rồng (1911)
          </button>

          {/* Nút mở Kho Tư Liệu Di Sản & Kỷ Vật */}
          <button
            onClick={() => setShowArtifactVault(!showArtifactVault)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#B48327] text-[#FAF6EE] hover:bg-[#9E7B42] transition cursor-pointer"
          >
            🏺 {lang === "vi" ? "Tư liệu & Kỷ vật" : "Relics & Archives"}
          </button>

          {/* Chọn ngôn ngữ VI / EN */}
          <div className="flex bg-[#EAE0D0] p-1 rounded-xl border border-[#C8AE7D]">
            <button
              onClick={() => setLang("vi")}
              className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                lang === "vi" ? "bg-[#2B2118] text-[#E6C786]" : "text-[#5C4938]"
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                lang === "en" ? "bg-[#2B2118] text-[#E6C786]" : "text-[#5C4938]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Ngăn kéo Thông tin Chi tiết Di sản & Kỷ vật (Mở rộng nội dung & hình ảnh) */}
      {showArtifactVault && (
        <div className="heritage-card rounded-2xl p-5 space-y-4 border-2 border-[#B48327]">
          <div className="flex items-center justify-between border-b border-[#C8AE7D] pb-3">
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#8B1E1E]">
                {lang === "vi"
                  ? "Kho Tư Liệu Di Sản & Kỷ Vật Lịch Sử"
                  : "Historical Heritage & Relic Archives"}
              </h3>
              <p className="text-xs text-[#5C4938]">
                {lang === "vi" ? chapter.overviewVi : chapter.overviewEn}
              </p>
            </div>
            <button
              onClick={() => setShowArtifactVault(false)}
              className="px-3 py-1 rounded-lg bg-[#EAE0D0] text-xs font-bold cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapter.frames.map((frame) => {
              const correctRelic = frame.elements.find((e) => e.isCorrect)!;
              return (
                <div
                  key={frame.stageNumber}
                  className="bg-[#F4EFE6] border border-[#C8AE7D] rounded-xl overflow-hidden flex flex-col"
                >
                  <img
                    src={correctRelic.artifactImage}
                    alt={correctRelic.labelVi}
                    className="w-full h-36 object-cover sepia-[0.25]"
                  />
                  <div className="p-3.5 space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B1E1E] text-[#FAF6EE]">
                      {frame.timeStamp}
                    </span>
                    <h4 className="font-heritage font-bold text-sm text-[#2B2118]">
                      {correctRelic.icon}{" "}
                      {lang === "vi" ? correctRelic.labelVi : correctRelic.labelEn}
                    </h4>
                    <p className="text-xs text-[#5C4938] leading-relaxed">
                      {lang === "vi"
                        ? correctRelic.artifactDetailVi
                        : correctRelic.artifactDetailEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Thanh Tiến trình Màn chơi (Màn 1 -> Màn 6 + Màn 7 Toàn Cảnh) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {chapter.frames.map((frame, idx) => {
          const isUnlocked = unlockedStages.includes(idx);
          const isCurrent = currentStageIndex === idx;
          return (
            <button
              key={frame.stageNumber}
              onClick={() => {
                if (isUnlocked || idx <= unlockedStages.length) {
                  setCurrentStageIndex(idx);
                  setSelectedElement(null);
                  setFeedbackState("idle");
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition flex items-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? "bg-[#2B2118] text-[#E6C786] border-[#B48327] shadow"
                  : isUnlocked
                  ? "bg-[#2E5A44] text-[#FAF6EE] border-[#2E5A44]"
                  : "bg-[#EAE0D0] text-[#5C4938] border-[#C8AE7D] opacity-75"
              }`}
            >
              <span>{isUnlocked ? "✓" : `Màn ${frame.stageNumber}`}</span>
              <span className="hidden sm:inline">
                • {lang === "vi" ? `Khung ${frame.stageNumber}` : `Stage ${frame.stageNumber}`}
              </span>
            </button>
          );
        })}

        {/* Nút Màn Cuối (Màn 7 ở Dinh Độc Lập): Tự động mở khi hoàn thành đủ các khung */}
        <button
          onClick={() => {
            if (unlockedStages.length === totalFrames) {
              setCurrentStageIndex(totalFrames);
            }
          }}
          disabled={unlockedStages.length < totalFrames}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 border transition flex items-center gap-1.5 ${
            isFinalPanoramaStage
              ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#E6C786] shadow-md cursor-pointer"
              : unlockedStages.length === totalFrames
              ? "bg-[#B48327] text-[#FAF6EE] border-[#8B1E1E] animate-pulse cursor-pointer"
              : "bg-[#EAE0D0]/60 text-[#5C4938]/60 border-[#C8AE7D] cursor-not-allowed"
          }`}
        >
          <span>🌟</span>
          <span>
            {lang === "vi"
              ? `Màn ${totalFrames + 1}: Toàn Cảnh (${unlockedStages.length}/${totalFrames})`
              : `Stage ${totalFrames + 1}: Panorama (${unlockedStages.length}/${totalFrames})`}
          </span>
        </button>
      </div>

      {/* GIAO DIỆN MÀN 1 -> 6: Hiển thị 1 Khung Truyện Duy Nhất + Các Element Tương Ứng Ở Dưới */}
      {!isFinalPanoramaStage && activeFrame && (
        <div className="space-y-6">
          {/* Khung truyện trung tâm của màn hiện tại */}
          <div className="heritage-card rounded-2xl overflow-hidden border-2 border-[#B48327]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Hình ảnh tư liệu của khung hiện tại */}
              <div className="lg:col-span-7 relative bg-[#2B2118] min-h-[280px] sm:min-h-[360px]">
                <img
                  src={activeFrame.imageUrl}
                  alt={activeFrame.titleVi}
                  className="w-full h-full object-cover sepia-[0.22] contrast-[1.03]"
                />
                <div className="absolute top-3 left-3 bg-[#2B2118]/90 text-[#E6C786] border border-[#B48327] px-3 py-1 rounded-full text-xs font-bold">
                  Màn {activeFrame.stageNumber}/{totalFrames} • {activeFrame.timeStamp}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4">
                  <p className="text-xs text-[#E6C786] italic">
                    📷 {lang === "vi" ? activeFrame.imageCaptionVi : activeFrame.imageCaptionEn}
                  </p>
                </div>
              </div>

              {/* Nội dung dẫn chuyện của khung hiện tại */}
              <div className="lg:col-span-5 p-5 lg:p-6 flex flex-col justify-between bg-[#FAF6EE]">
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#EAE0D0] text-[#8B1E1E] text-xs font-bold">
                    {lang === "vi"
                      ? `Chương Truyện • Khung ${activeFrame.stageNumber}`
                      : `Story Chapter • Frame ${activeFrame.stageNumber}`}
                  </span>
                  <h2 className="font-heritage text-xl lg:text-2xl font-bold text-[#2B2118]">
                    {lang === "vi" ? activeFrame.titleVi : activeFrame.titleEn}
                  </h2>
                  <p className="text-sm text-[#5C4938] leading-relaxed">
                    {lang === "vi" ? activeFrame.narrativeVi : activeFrame.narrativeEn}
                  </p>
                </div>

                {/* Hộp phản hồi kết quả khi chọn Element */}
                <div className="mt-6 pt-4 border-t border-[#C8AE7D]">
                  {feedbackState === "idle" && (
                    <p className="text-xs font-bold text-[#8B1E1E]">
                      👇 {lang === "vi" ? activeFrame.promptVi : activeFrame.promptEn}
                    </p>
                  )}

                  {feedbackState === "wrong" && selectedElement && (
                    <div className="p-3.5 rounded-xl bg-[#8B1E1E]/10 border border-[#8B1E1E] space-y-1">
                      <p className="text-xs font-bold text-[#8B1E1E]">
                        ✕ {lang === "vi" ? "Chưa khớp bối cảnh lịch sử!" : "Historical mismatch!"}
                      </p>
                      <p className="text-xs text-[#2B2118]">
                        {lang === "vi" ? selectedElement.hintVi : selectedElement.hintEn}
                      </p>
                    </div>
                  )}

                  {feedbackState === "correct" && selectedElement && (
                    <div className="p-4 rounded-xl bg-[#2E5A44]/15 border-2 border-[#2E5A44] space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedElement.artifactImage}
                          alt={selectedElement.labelVi}
                          className="w-14 h-14 rounded-lg object-cover border border-[#2E5A44]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#2E5A44]">
                            ✓ {lang === "vi" ? "Giải mã chính xác!" : "Frame Decoded!"}
                          </p>
                          <p className="text-xs text-[#2B2118] mt-0.5">
                            {lang === "vi"
                              ? selectedElement.artifactDetailVi
                              : selectedElement.artifactDetailEn}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleAdvanceNextStage}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {currentStageIndex + 1 < totalFrames
                            ? lang === "vi"
                              ? `Sang Màn ${currentStageIndex + 2} (Khung tiếp theo)`
                              : `Continue to Stage ${currentStageIndex + 2}`
                            : lang === "vi"
                            ? `Mở Màn ${totalFrames + 1}: Ghép Tranh Toàn Cảnh Lịch Sử`
                            : `Open Stage ${totalFrames + 1}: Complete Chronicle Panorama`}
                        </span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KHAY ELEMENT TƯƠNG ỨNG BÊN DƯỚI KHUNG TRUYỆN */}
          <div className="heritage-card rounded-2xl p-5">
            <h3 className="font-heritage font-bold text-base text-[#2B2118] mb-3">
              🧩{" "}
              {lang === "vi"
                ? `Kỷ vật & Yếu tố Lịch sử tương ứng với Khung ${activeFrame.stageNumber}:`
                : `Interactive Historical Elements for Frame ${activeFrame.stageNumber}:`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeFrame.elements.map((el) => {
                const isPicked = selectedElement?.id === el.id;
                return (
                  <button
                    key={el.id}
                    onClick={() => handleSelectElement(el)}
                    className={`text-left p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${
                      isPicked && el.isCorrect
                        ? "bg-[#2E5A44]/15 border-2 border-[#2E5A44] shadow-md"
                        : isPicked && !el.isCorrect
                        ? "bg-[#8B1E1E]/10 border-2 border-[#8B1E1E]"
                        : "bg-[#F4EFE6] border-[#C8AE7D] hover:bg-[#EAE0D0]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#C8AE7D] flex items-center justify-center text-2xl shrink-0">
                      {el.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heritage font-bold text-sm text-[#2B2118]">
                        {lang === "vi" ? el.labelVi : el.labelEn}
                      </p>
                      <p className="text-xs text-[#5C4938] mt-1 line-clamp-2">
                        {lang === "vi" ? el.hintVi : el.hintEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GIAO DIỆN MÀN 7 (MÀN CUỐI CÙNG): TỰ ĐỘNG XẾP 6 KHUNG THÀNH 1 CÂU CHUYỆN TỔNG QUAN */}
      {isFinalPanoramaStage && (
        <div className="heritage-card rounded-2xl p-6 lg:p-8 space-y-6 border-2 border-[#8B1E1E]">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#8B1E1E] text-[#E6C786] text-xs font-bold uppercase tracking-wider">
              ★ {lang === "vi" ? `Màn ${totalFrames + 1}: Bức Tranh Toàn Cảnh Lịch Sử` : `Stage ${totalFrames + 1}: Grand Historical Panorama`}
            </span>
            <h2 className="font-heritage text-2xl lg:text-3xl font-bold text-[#2B2118]">
              {lang === "vi" ? chapter.nameVi : chapter.nameEn} ({chapter.year})
            </h2>
            <p className="text-sm text-[#5C4938] leading-relaxed">
              {lang === "vi" ? chapter.epilogueVi : chapter.epilogueEn}
            </p>
          </div>

          {/* 6 Khung Truyện Tự Động Ghép Thành Bức Tranh Biên Niên Sử Tổng Quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapter.frames.map((frame) => {
              const matchedRelic = frame.elements.find((e) => e.isCorrect)!;
              return (
                <div
                  key={frame.stageNumber}
                  className="bg-[#F4EFE6] border-2 border-[#B48327] rounded-xl overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative h-40">
                    <img
                      src={frame.imageUrl}
                      alt={frame.titleVi}
                      className="w-full h-full object-cover sepia-[0.2]"
                    />
                    <span className="absolute top-2 left-2 bg-[#2B2118]/90 text-[#E6C786] text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {frame.timeStamp}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-heritage font-bold text-sm text-[#8B1E1E]">
                        {lang === "vi" ? frame.titleVi : frame.titleEn}
                      </h4>
                      <p className="text-xs text-[#2B2118] mt-1 leading-relaxed">
                        {lang === "vi" ? frame.narrativeVi : frame.narrativeEn}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#C8AE7D] flex items-center gap-2 text-xs font-bold text-[#2E5A44]">
                      <span>{matchedRelic.icon}</span>
                      <span className="truncate">
                        {lang === "vi" ? matchedRelic.labelVi : matchedRelic.labelEn}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#EAE0D0] p-4 rounded-xl border border-[#B48327]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#8B1E1E] text-[#E6C786] flex items-center justify-center text-xl font-bold">
                🏅
              </div>
              <div>
                <p className="font-heritage font-bold text-sm text-[#2B2118]">
                  {lang === "vi"
                    ? "Đã hoàn thành Biên niên sử & Nhận thưởng +300 EXP!"
                    : "Chronicle Completed & +300 EXP Awarded!"}
                </p>
                <p className="text-xs text-[#5C4938]">
                  {lang === "vi"
                    ? "Toàn bộ kỷ vật đã được lưu vào Hộ chiếu Di sản của bạn."
                    : "All decoded relics have been recorded in your Heritage Passport."}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentStageIndex(0);
                setSelectedElement(null);
                setFeedbackState("idle");
              }}
              className="px-4 py-2.5 rounded-xl bg-[#2B2118] text-[#FAF6EE] text-xs font-bold hover:bg-[#3D2F23] transition cursor-pointer"
            >
              ↺ {lang === "vi" ? "Xem lại từng khung" : "Replay Stages"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { StorytellerEngine };
