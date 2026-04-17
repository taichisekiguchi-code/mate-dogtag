# mate Digital Dog Tag - Claude Code プロジェクトガイド

## プロジェクト概要

NFC タグを使った犬のデジタルドッグタグ Web アプリ。NFC タグをスマホでかざすと犬のプロフィール（名前・犬種・医療情報・飼い主連絡先）が表示される。迷子モード時は緊急連絡先を目立つ形で表示。

## 技術スタック

- **フロントエンド**: HTML / CSS / Vanilla JS (ES Modules)
- **バックエンド**: Firebase (BaaS) - サーバーレス構成
  - Authentication: 匿名認証 + Email/Password
  - Firestore: asia-northeast1 (東京) - 犬プロフィール・ユーザーデータ
  - Storage: 犬の写真保存 (※ Blaze プラン必要、現在未有効化)
  - Hosting: 静的ファイル配信
- **Firebase SDK**: v10.7.0 (CDN 経由、npm バンドルなし)
- **CI/CD**: GitHub Actions → Firebase Hosting 自動デプロイ

## ディレクトリ構成

```
mate-dogtag/
├── public/                  # Firebase Hosting でそのまま配信
│   ├── index.html           # メインページ (プロフィール表示)
│   ├── register.html        # 新規犬登録フォーム
│   ├── edit.html            # プロフィール編集フォーム
│   ├── css/style.css        # スタイルシート
│   ├── images/              # 静的画像
│   │   └── default-dog.svg  # デフォルト犬アイコン
│   └── js/
│       ├── firebase-config.js         # Firebase 接続設定 (実値入り)
│       ├── firebase-config.example.js # 設定テンプレート (.gitignore 対象外)
│       ├── app.js                     # コアロジック (CRUD, Auth, Upload)
│       └── demo-data.js              # デモ用犬データ (4パターン)
├── scripts/
│   └── seed-firestore.js   # Firestore 初期データ投入
├── .github/workflows/
│   ├── deploy-prod.yml      # main push → 本番デプロイ
│   └── deploy-preview.yml   # PR → プレビューチャネル
├── firebase.json            # Hosting + Emulator 設定
├── .firebaserc              # Firebase プロジェクト紐付け (mate-dogtag)
├── package.json             # npm scripts & 依存
└── .gitignore
```

## 環境切り替え

URL パラメータ `?env=` で制御:
- `local` (デフォルト): Firebase Emulator に接続。デモデータで動作
- `staging`: Firebase プロジェクトに直接接続 (ステージング用)
- `prod`: 本番 Firebase に接続

`?demo=` パラメータでデモプロフィールを切替:
- `mydog`: オーナー表示 (全情報閲覧可)
- `otherdog`: ビジター表示 (連絡先非公開)
- `lostdog`: 迷子モード (緊急連絡先表示)
- `newdog`: 最小限登録状態

## 開発コマンド

```bash
# ローカル開発サーバー起動 (live-server)
npm run dev

# Firebase Emulator 起動 (Auth, Firestore, Storage, Hosting)
npm run emulators

# Firestore にデモデータ投入
npm run seed

# ステージングデプロイ (7日間有効のプレビューURL)
npm run staging:deploy

# 本番デプロイ
npm run prod:deploy
```

## Firestore データモデル

### `dogs` コレクション
```
dogs/{tagId}
├── name: string            # 犬の名前
├── breed: string           # 犬種
├── age: string             # "3歳"
├── weight: string          # "10.2kg"
├── birthday: string        # "2023-04-15"
├── gender: string          # "♂" / "♀"
├── color: string           # 毛色
├── photo: string?          # Storage URL
├── personality: string     # 性格・特徴
├── favorites: string[]     # 好きなもの
├── isLostMode: boolean     # 迷子モードフラグ
├── lostMessage: string?    # 迷子時メッセージ
├── lostSince: string?      # 行方不明日
├── lastSeenLocation: string?
├── ownerId: string         # Auth UID
├── owner: {
│     name, phone, email, address
│   }
├── medical: {
│     vaccination, allergies, microchip, vet
│   }
├── socialLinks: {
│     instagram: string?
│   }
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### `users` コレクション
```
users/{uid}
├── name: string
├── phone: string
├── email: string
├── address: string
└── updatedAt: Timestamp
```

## Firebase 設定

- **プロジェクト ID**: `mate-dogtag`
- **リージョン**: asia-northeast1 (東京)
- **Web アプリ名**: `mate-web`
- **認証**: Anonymous + Email/Password 有効
- **Firestore**: プロダクションモード
- **Storage**: 未有効化 (Blaze プラン必要)
- **Hosting**: Emulator port 5000

## 開発ルール

### コーディング規約
- JavaScript は ES Modules (`import` / `export`) を使用
- Firebase SDK は CDN (`https://www.gstatic.com/firebasejs/10.7.0/`) から読み込み。npm import しない
- 日本語コメントを積極的に使う
- 関数名・変数名は英語 camelCase
- CSS クラス名は kebab-case

### ファイル編集時の注意
- `firebase-config.js` には実際の API キーが入っている。値を変更しないこと
- `firebase-config.example.js` はテンプレート。新しい設定項目を追加した場合はこちらも更新
- `demo-data.js` のデモデータ構造は `app.js` の CRUD 関数と整合性を保つこと
- HTML ファイルは `public/` 直下に配置 (Firebase Hosting のルート)

### Git ルール
- ブランチ: `main` が本番。機能追加は feature ブランチを切る
- コミットメッセージ: 日本語 OK。先頭に絵文字推奨 (例: `✨ 新機能追加`, `🐛 バグ修正`, `📝 ドキュメント更新`)
- `firebase-config.js` はリポジトリに含める (公開 API キーのため問題なし)
- `.env` や `serviceAccountKey.json` は絶対にコミットしない

### デプロイ
- `main` への push で GitHub Actions が自動デプロイ
- PR 作成時はプレビューチャネルにデプロイ
- Secrets 必要: `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`

## 現在の状態 (2026-04-17)

### 完了済み
- Firebase プロジェクト作成 + Auth + Firestore 設定
- GitHub リポジトリに全ファイル push
- CI/CD ワークフロー設定
- デモモードで全画面動作確認可能

### 未対応 (TODO)
- [ ] Firebase Storage 有効化 (Blaze プランへのアップグレード必要)
- [ ] Firestore Security Rules の設定
- [ ] GitHub Actions Secrets の設定 (`FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`)
- [ ] Firebase Hosting の初期デプロイ
- [ ] OGP メタタグ (SNS シェア対応)
- [ ] PWA 対応 (manifest.json, service worker)
- [ ] NFC タグとの連携テスト
