# 🐾 mate — Digital Dog Tag

骨型 NFC キーホルダーにタップするだけで、愛犬のプロフィール・医療情報・迷子連絡先にアクセスできる、ペットライフスタイルブランド **mate** の Web サービス。

> **Status:** Staging 環境構築済み / Firebase 未接続

---

## ✨ 主な機能

- **🐶 プロフィール表示** — オーナー表示・ビジター表示の自動切替
- **🚨 迷子モード** — NFC タップで即連絡・最終目撃地の共有
- **📝 4 ステップ登録ウィザード** — 基本情報 → 飼い主 → 医療 → 確認
- **✏️ タブ式編集画面** — 基本 / 飼い主 / 医療 の3タブ
- **🖼 写真アップロード** — 未設定時はブランド SVG がデフォルト表示
- **🌍 環境切替** — `?env=local|staging|prod` で Firebase 接続先を切替
- **👀 デモビュー** — `?demo=mydog|otherdog|lostdog|newdog` で 4 パターン確認

---

## 🛠 技術スタック

| 領域 | 使用技術 |
|------|----------|
| フロント | HTML / CSS / Vanilla JS (ES Modules) |
| 認証 | Firebase Authentication (Anonymous + Email) |
| DB | Firestore |
| ストレージ | Firebase Storage |
| ホスティング | Firebase Hosting |
| CI/CD | GitHub Actions |
| ローカル開発 | Firebase Emulator Suite |

---

## 🚀 クイックスタート

### 必要なもの
- Node.js 18 以上
- npm
- Firebase CLI (`npm i -g firebase-tools`)

### セットアップ

```bash
# 1. クローン
git clone https://github.com/taichisekiguchi-code/mate-dogtag.git
cd mate-dogtag

# 2. 依存インストール
npm install

# 3. Firebase ログイン
firebase login

# 4. エミュレータ + ローカルサーバ起動
npm run emulators   # 別タブで
npm run dev         # → http://localhost:3000
```

### URL パラメータで動作確認

| パターン | URL |
|---|---|
| 自分の犬表示 | `http://localhost:3000/?demo=mydog` |
| 他人の犬表示 | `http://localhost:3000/?demo=otherdog` |
| 迷子モード | `http://localhost:3000/?demo=lostdog` |
| 新規登録 | `http://localhost:3000/register.html` |
| 編集画面 | `http://localhost:3000/edit.html?demo=mydog` |

---

## 📁 ディレクトリ構成

```
mate-dogtag/
├── public/              # Firebase Hosting ルート
│   ├── index.html       # プロフィール表示
│   ├── register.html    # 新規登録ウィザード
│   ├── edit.html        # 編集画面
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js              # Firebase/Demo 共通ロジック
│   │   ├── demo-data.js        # デモプロフィール
│   │   └── firebase-config.js  # 環境別 Firebase 初期化
│   └── images/default-dog.svg  # デフォルト画像
├── functions/           # Cloud Functions (予定)
├── scripts/             # Firestore シード等
├── firebase.json
├── .firebaserc          # プロジェクト ID (未設定)
├── .github/workflows/   # GitHub Actions CI/CD
└── SETUP.md             # ローカル構築詳細
```

---

## 🔀 ブランチ戦略

- `main` — 本番 (Firebase prod)
- `staging` — ステージング (Firebase Hosting preview channel)
- `feature/*` — 機能開発

---

## 🗺 ロードマップ

- [x] Phase 1: ステージング環境構築
- [x] Phase 2: 登録・編集画面
- [x] Phase 3: デフォルト画像対応
- [ ] Phase 4: GitHub / Firebase 本接続 ← **今ここ**
- [ ] Phase 5: 迷子モード強化（通知 / 目撃報告）
- [ ] Phase 6: 管理ダッシュボード

---

## 📝 関連ドキュメント

- [`SETUP.md`](./SETUP.md) — ローカル環境の構築手順
- [`MIGRATION.md`](./MIGRATION.md) — GitHub / Firebase への移行手順

---

© 2026 mate — pet lifestyle brand by Taichi Sekiguchi
