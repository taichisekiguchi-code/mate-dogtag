// ============================================================
// Firebase Configuration - Staging / Production 切り替え
// ============================================================

const ENV = {
  // 'local'   → Firebase Emulator に接続
  // 'staging' → Firebase Staging プロジェクトに接続
  // 'prod'    → 本番 Firebase プロジェクトに接続
  current: new URLSearchParams(window.location.search).get('env') || 'local'
};

// === Firebase プロジェクト設定 ===
const firebaseConfig = {
  apiKey: "AIzaSyD6lpaiqIYf8C0lfgf8ciY95asRzZhnoEA",
  authDomain: "mate-dogtag.firebaseapp.com",
  projectId: "mate-dogtag",
  storageBucket: "mate-dogtag.firebasestorage.app",
  messagingSenderId: "368553109228",
  appId: "1:368553109228:web:f42037fc7b27c70ab967c9"
};

// Firebase 初期化
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getStorage, connectStorageEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ローカル開発時は Emulator に接続
if (ENV.current === 'local') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('🔧 Firebase Emulator に接続中...');
}

console.log(`🏷️ 環境: ${ENV.current}`);

export { app, db, auth, storage, ENV };
