// ============================================================
// Firebase Configuration Template
// ------------------------------------------------------------
// このファイルを `firebase-config.js` にコピーして、
// Firebase Console からコピーした値に置き換えてください。
//
//   cp firebase-config.example.js firebase-config.js
//
// ※ firebase-config.js は .gitignore されていません（クライアント公開値）
//   機密値（サービスアカウント鍵など）は絶対にコミットしないこと。
// ============================================================

const ENV = {
  current: new URLSearchParams(window.location.search).get('env') || 'local'
};

// === 環境別 Firebase プロジェクト設定 ===
const firebaseConfigs = {
  staging: {
    apiKey: "YOUR_STAGING_API_KEY",
    authDomain: "mate-dogtag-staging.firebaseapp.com",
    projectId: "mate-dogtag-staging",
    storageBucket: "mate-dogtag-staging.appspot.com",
    messagingSenderId: "000000000000",
    appId: "YOUR_STAGING_APP_ID"
  },
  prod: {
    apiKey: "YOUR_PROD_API_KEY",
    authDomain: "mate-dogtag.firebaseapp.com",
    projectId: "mate-dogtag",
    storageBucket: "mate-dogtag.appspot.com",
    messagingSenderId: "000000000000",
    appId: "YOUR_PROD_APP_ID"
  }
};

// local の場合も staging 設定を使ってエミュレータに接続
const firebaseConfig = firebaseConfigs[ENV.current === 'prod' ? 'prod' : 'staging'];

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getStorage, connectStorageEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

if (ENV.current === 'local') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('🔧 Firebase Emulator に接続中...');
}

console.log(`🏷️ 環境: ${ENV.current}`);

export { app, db, auth, storage, ENV };
