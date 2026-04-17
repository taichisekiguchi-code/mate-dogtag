#!/usr/bin/env node
// ============================================================
// Firestore シードスクリプト
// Firebase Emulator にテスト用の犬データを投入する
// 使い方: node scripts/seed-firestore.js
// ============================================================

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "demo-key",
  projectId: "demo-mate-dogtag"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

const dogs = [
  {
    id: "tag-001",
    name: "コタロウ",
    breed: "柴犬",
    age: "3歳",
    weight: "10.2kg",
    birthday: "2023-04-15",
    gender: "♂",
    color: "赤",
    ownerId: "user-001",
    isLostMode: false,
    personality: "人懐っこくて元気。散歩が大好き。",
    favorites: ["ささみジャーキー", "ボール遊び", "公園の芝生"],
    medical: {
      vaccination: "2025-11-20",
      allergies: "なし",
      microchip: "392145678901234",
      vet: "渋谷ペットクリニック"
    },
    socialLinks: { instagram: "@kotaro_shiba" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "tag-002",
    name: "Mochi",
    breed: "トイプードル",
    age: "5歳",
    weight: "4.1kg",
    birthday: "2021-08-22",
    gender: "♀",
    color: "アプリコット",
    ownerId: "user-002",
    isLostMode: false,
    personality: "甘えん坊でおしゃれ好き。",
    favorites: ["さつまいもチップス", "ぬいぐるみ", "お昼寝"],
    medical: {
      vaccination: "2025-09-10",
      allergies: "チキン",
      microchip: "392198765432100",
      vet: "目黒アニマルクリニック"
    },
    socialLinks: { instagram: "@mochi_poodle" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "tag-003",
    name: "レオ",
    breed: "ゴールデンレトリバー",
    age: "7歳",
    weight: "30.5kg",
    birthday: "2019-01-10",
    gender: "♂",
    color: "ゴールド",
    ownerId: "user-003",
    isLostMode: true,
    lostMessage: "レオが迷子になっています！見つけた方はすぐにご連絡ください。",
    lostSince: "2026-03-24",
    lastSeenLocation: "世田谷区 駒沢公園付近",
    personality: "穏やかで優しい。子供にも安心。",
    favorites: [],
    medical: {},
    socialLinks: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const users = [
  {
    id: "user-001",
    name: "Taichi",
    email: "taichi@example.com",
    phone: "090-XXXX-XXXX",
    address: "東京都渋谷区"
  },
  {
    id: "user-002",
    name: "Yuki",
    email: "yuki@example.com",
    phone: "090-YYYY-YYYY",
    address: "東京都目黒区"
  },
  {
    id: "user-003",
    name: "Kenji",
    email: "kenji@example.com",
    phone: "080-XXXX-XXXX",
    address: "東京都世田谷区"
  }
];

async function seed() {
  console.log('🌱 シードデータを投入中...\n');

  for (const dog of dogs) {
    const { id, ...data } = dog;
    await setDoc(doc(db, 'dogs', id), data);
    console.log(`  🐶 ${dog.name} (${id})`);
  }

  for (const user of users) {
    const { id, ...data } = user;
    await setDoc(doc(db, 'users', id), data);
    console.log(`  👤 ${user.name} (${id})`);
  }

  console.log('\n✅ シード完了！');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ シードエラー:', err);
  process.exit(1);
});
