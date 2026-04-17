// ============================================================
// デモデータ - 複数パターンの犬プロフィール
// ============================================================

const DEMO_DOGS = {
  // --- 自分の犬（オーナービュー）---
  mydog: {
    id: "tag-001",
    name: "コタロウ",
    breed: "柴犬",
    age: "3歳",
    weight: "10.2kg",
    birthday: "2023-04-15",
    gender: "♂",
    color: "赤",
    photo: null, // プレースホルダー画像を使用
    isOwner: true,
    isLostMode: false,
    owner: {
      name: "Taichi",
      phone: "090-XXXX-XXXX",
      email: "taichi@example.com",
      address: "東京都渋谷区"
    },
    medical: {
      vaccination: "2025-11-20",
      allergies: "なし",
      microchip: "392145678901234",
      vet: "渋谷ペットクリニック"
    },
    personality: "人懐っこくて元気。散歩が大好き。",
    favorites: ["ささみジャーキー", "ボール遊び", "公園の芝生"],
    socialLinks: {
      instagram: "@kotaro_shiba"
    }
  },

  // --- 他人の犬（ビジタービュー）---
  otherdog: {
    id: "tag-002",
    name: "Mochi",
    breed: "トイプードル",
    age: "5歳",
    weight: "4.1kg",
    birthday: "2021-08-22",
    gender: "♀",
    color: "アプリコット",
    photo: null,
    isOwner: false,
    isLostMode: false,
    owner: {
      name: "Yuki",
      phone: null, // ビジターには非表示
      email: null,
      address: null
    },
    medical: {
      vaccination: "2025-09-10",
      allergies: "チキン",
      microchip: null, // ビジターには非表示
      vet: null
    },
    personality: "甘えん坊でおしゃれ好き。トリミングの日はテンション高め。",
    favorites: ["さつまいもチップス", "ぬいぐるみ", "お昼寝"],
    socialLinks: {
      instagram: "@mochi_poodle"
    }
  },

  // --- 迷子モード ---
  lostdog: {
    id: "tag-003",
    name: "レオ",
    breed: "ゴールデンレトリバー",
    age: "7歳",
    weight: "30.5kg",
    birthday: "2019-01-10",
    gender: "♂",
    color: "ゴールド",
    photo: null,
    isOwner: false,
    isLostMode: true,
    lostMessage: "レオが迷子になっています！見つけた方はすぐにご連絡ください。人懐っこい大型犬です。赤い首輪をしています。",
    lostSince: "2026-03-24",
    lastSeenLocation: "世田谷区 駒沢公園付近",
    owner: {
      name: "Kenji",
      phone: "080-XXXX-XXXX",
      email: "kenji@example.com",
      address: null
    },
    medical: {
      vaccination: null,
      allergies: null,
      microchip: null,
      vet: null
    },
    personality: "穏やかで優しい。子供にも安心。",
    favorites: [],
    socialLinks: {}
  },

  // --- 最小限の登録（新規ユーザー）---
  newdog: {
    id: "tag-004",
    name: "ハナ",
    breed: "未登録",
    age: "不明",
    weight: null,
    birthday: null,
    gender: "♀",
    color: null,
    photo: null,
    isOwner: true,
    isLostMode: false,
    owner: {
      name: "未設定",
      phone: null,
      email: null,
      address: null
    },
    medical: {
      vaccination: null,
      allergies: null,
      microchip: null,
      vet: null
    },
    personality: "",
    favorites: [],
    socialLinks: {}
  }
};

// 現在選択中のデモプロフィール
let currentDemo = 'mydog';

function getDemoProfile(key) {
  return DEMO_DOGS[key] || DEMO_DOGS.mydog;
}

function getAllDemoKeys() {
  return Object.keys(DEMO_DOGS);
}

export { DEMO_DOGS, getDemoProfile, getAllDemoKeys, currentDemo };
