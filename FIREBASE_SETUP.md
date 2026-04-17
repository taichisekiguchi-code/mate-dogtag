# Firebase 残り設定ガイド（5分で完了）

## ✅ 完了済み
- [x] GitHub リポジトリ: `taichisekiguchi-code/mate-dogtag` (Public)
- [x] Firebase プロジェクト: `mate-dogtag` (Spark プラン)
- [x] Authentication: メール/パスワード ✅ / 匿名 ✅

---

## 🔥 Step 1: Firestore Database を有効化

1. 開く → https://console.firebase.google.com/u/0/project/mate-dogtag/firestore
2. **「データベースの作成」** をクリック
3. モード: **本番モード** を選択
4. ロケーション: **asia-northeast1（東京）** を選択
5. **「作成」** をクリック

---

## 📦 Step 2: Storage を有効化

1. 開く → https://console.firebase.google.com/u/0/project/mate-dogtag/storage
2. **「開始」** をクリック
3. セキュリティルール: **本番モード** を選択 → 「次へ」
4. ロケーション: **asia-northeast1（東京）** を選択
5. **「完了」** をクリック

---

## 🌐 Step 3: Web アプリを登録して設定値を取得

1. 開く → https://console.firebase.google.com/u/0/project/mate-dogtag/settings/general
2. ページ下部の **「アプリを追加」** → **ウェブ（</>アイコン）** をクリック
3. ニックネーム: **mate-web** と入力
4. 「Firebase Hosting も設定する」は **チェックしない**
5. **「アプリを登録」** をクリック
6. 表示される `firebaseConfig` の値を **すべてメモ** する：

```javascript
const firebaseConfig = {
  apiKey: "ここの値",
  authDomain: "ここの値",
  projectId: "ここの値",
  storageBucket: "ここの値",
  messagingSenderId: "ここの値",
  appId: "ここの値"
};
```

7. **「コンソールに進む」** をクリック

---

## 📝 Step 4: firebase-config.js に値を反映

`public/js/firebase-config.js` を作成（`firebase-config.example.js` をコピー）して、
Step 3 でメモした値を貼り付ける：

```bash
cp public/js/firebase-config.example.js public/js/firebase-config.js
```

エディタで開いて staging の値を書き換え：

```javascript
const firebaseConfigs = {
  staging: {
    apiKey: "Step3の値",
    authDomain: "mate-dogtag.firebaseapp.com",
    projectId: "mate-dogtag",
    storageBucket: "mate-dogtag.firebasestorage.app",
    messagingSenderId: "Step3の値",
    appId: "Step3の値"
  },
  prod: {
    // 本番用（後で別プロジェクトを作ったら設定）
  }
};
```

---

## 🚀 Step 5: Git push

```bash
cd ~/Downloads/mate-dogtag-staging
git init
git remote add origin https://github.com/taichisekiguchi-code/mate-dogtag.git
git add -A
git commit -m "Initial commit: mate Digital Dog Tag"
git branch -M main
git push -u origin main
```

> ⚠️ push 時にユーザー名とパスワード（Personal Access Token）を聞かれます。
> Token の作り方 → `GIT_SETUP.md` を参照

---

## ✨ 全部終わったら

上の Step 3 の `firebaseConfig` の値をこのチャットに貼り付けてくれれば、
`firebase-config.js` を自動で書き換えます！
