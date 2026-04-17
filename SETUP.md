# mate Digital Dog Tag - ステージング環境 セットアップガイド

## 📁 プロジェクト構成

```
mate-dogtag-staging/
├── public/                  ← Webアプリ本体
│   ├── index.html           ← メインページ（プロフィール表示）
│   ├── css/style.css        ← mateブランドスタイル
│   └── js/
│       ├── firebase-config.js  ← Firebase設定（環境切替）
│       └── demo-data.js     ← デモ用犬プロフィールデータ
├── scripts/
│   └── seed-firestore.js    ← Emulatorにテストデータ投入
├── firebase.json            ← Firebase設定
├── .firebaserc              ← Firebaseプロジェクト紐付け
├── package.json
└── SETUP.md                 ← このファイル
```

---

## 🚀 クイックスタート（ローカルプレビュー）

Firebase不要。ブラウザだけで画面を確認できます。

```bash
# 1. プロジェクトフォルダに移動
cd mate-dogtag-staging

# 2. 依存パッケージをインストール
npm install

# 3. ローカルサーバー起動（ブラウザが自動で開きます）
npm run dev
```

→ `http://localhost:3000` でプロフィールページが表示されます。
→ 画面下部のボタンで **自分の犬 / 他人の犬 / 迷子モード / 新規登録** を切り替え可能。

---

## 🔥 Firebase Emulator で動作テスト

Firestore/Auth/Storageをローカルで動かしたい場合：

```bash
# 1. Firebase CLIをインストール（初回のみ）
npm install -g firebase-tools

# 2. Firebaseにログイン（初回のみ）
firebase login

# 3. Emulator起動
npm run emulators

# 4. テストデータ投入（別ターミナルで）
npm run seed
```

→ Emulator UI: `http://localhost:4000`
→ Firestore内のデータを直接確認・編集できます。

---

## 🌐 URL共有（チーム・関係者に見せる）

Firebase Hostingの **プレビューチャンネル** を使います。
一時的なURLが発行され、7日間有効です。

```bash
# 1. .firebaserc のプロジェクトIDを設定
#    "YOUR_FIREBASE_PROJECT_ID" → 実際のFirebaseプロジェクトIDに変更

# 2. プレビューチャンネルにデプロイ
npm run staging:deploy
```

→ コンソールに `https://YOUR_PROJECT--staging-XXXXX.web.app` のURLが表示されます。
→ このURLをチームに共有すれば、誰でもスマホ/PCで確認できます。

---

## 🔄 画面切替ガイド

ステージング環境では、画面下部のスイッチャーで4パターンを切り替えられます：

| ボタン | 表示内容 | 確認ポイント |
|--------|----------|-------------|
| 🏠 自分の犬 | オーナー視点のフル表示 | 全情報表示・編集ボタンあり |
| 👀 他人の犬 | NFC読み取り時のビジター視点 | 連絡先・医療情報が非公開 |
| 🚨 迷子モード | 迷子時の緊急表示 | 赤いアラート・電話ボタン |
| ✨ 新規登録 | 最小限の登録状態 | 空欄の表示テスト |

URLパラメータでも切替可能：
```
http://localhost:3000?demo=mydog      ← 自分の犬
http://localhost:3000?demo=otherdog   ← 他人の犬
http://localhost:3000?demo=lostdog    ← 迷子モード
http://localhost:3000?demo=newdog     ← 新規登録
```

---

## 📱 既存コードとの統合

すでに作成済みのmate dogtagコードがある場合：

1. `public/` フォルダに既存のHTML/CSS/JSをコピー
2. `public/js/firebase-config.js` の設定値を実際の値に更新
3. `.firebaserc` のプロジェクトIDを更新

---

## ⚠️ 注意事項

- ステージングバナーとデモスイッチャーは本番デプロイ時に削除してください
- `firebase-config.js` の API Key は本番用と分けることを推奨します
- デモデータの電話番号は仮の値です（090-XXXX-XXXXなど）
