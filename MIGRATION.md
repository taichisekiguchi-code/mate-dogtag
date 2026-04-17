# 🚚 mate Dog Tag — GitHub + Firebase 移行手順書

> **目的:** 複数 PC / クラウドから開発を続けられるように、プロジェクトを GitHub と Firebase に接続する。
> **対象:** Taichi (コードは書かず、指示ベースで進行)

---

## 🗺 全体の流れ

```
┌─────────┐    push    ┌──────────┐   deploy   ┌────────────┐
│  あなた ├──────────▶│  GitHub  ├──────────▶│  Firebase  │
│ (PC/Web)│            │ (mate-   │  Actions   │  Hosting   │
└─────────┘            │  dogtag) │            └────────────┘
                       └──────────┘
```

どの PC でも `git clone` すれば続きから開発可能に。

---

## 📋 やること 5 ステップ

### ✅ STEP 1: GitHub リポジトリを作る (5 分)

1. https://github.com/new にアクセス
2. **Repository name:** `mate-dogtag`
3. **Description:** `mate Digital Dog Tag - NFC pet profile web app`
4. **Public / Private:** お好みで（私物なら Private 推奨）
5. **Add a README file:** ❌ チェック入れない（既に用意済み）
6. **.gitignore:** ❌ None（既に用意済み）
7. 「Create repository」

---

### ✅ STEP 2: Firebase プロジェクトを作る (5 分)

1. https://console.firebase.google.com にアクセス
2. 「プロジェクトを追加」
3. **プロジェクト名:** `mate-dogtag`
4. Google Analytics はお好み（不要なら OFF で OK）
5. 作成完了を待つ

作成後、左メニューから **Build** を展開して以下を有効化:

| サービス | 設定 |
|---------|------|
| **Authentication** | 「Sign-in method」→ 匿名 と メール/パスワード を有効化 |
| **Firestore Database** | 本番モードで開始、ロケーションは `asia-northeast1`（東京）|
| **Storage** | 本番モードで開始、ロケーションは `asia-northeast1` |
| **Hosting** | 「始める」を押して画面を進める |

#### 🔑 Firebase 設定値をコピー

1. Firebase Console → プロジェクト設定（⚙️アイコン）
2. 「マイアプリ」→ `</>` ウェブアプリを追加
3. **アプリのニックネーム:** `mate-web`
4. Firebase Hosting にもチェック ✅
5. 表示される `firebaseConfig = { ... }` の中身をまるごとコピー

---

### ✅ STEP 3: Firebase 設定ファイルを作る (3 分)

ローカル PC で以下を実行:

```bash
cd ~/Downloads/mate-dogtag-staging   # 今のフォルダに移動
cp public/js/firebase-config.example.js public/js/firebase-config.js
```

`public/js/firebase-config.js` を開いて、**staging** と **prod** の両方に STEP 2 でコピーした値を貼り付ける。
（最初は両方同じ値で OK、本番と staging を分ける時に staging 用プロジェクトを別途作成）

`.firebaserc` を以下に書き換え:

```json
{
  "projects": {
    "default": "mate-dogtag"
  }
}
```

---

### ✅ STEP 4: GitHub に Push (5 分)

ターミナルで実行:

```bash
cd ~/Downloads/mate-dogtag-staging

# Git 初期化
git init
git branch -M main

# コミット
git add .
git commit -m "🎉 Initial commit - mate Dog Tag staging complete"

# GitHub リポジトリに接続
git remote add origin https://github.com/taichisekiguchi-code/mate-dogtag.git

# Push
git push -u origin main
```

GitHub の認証を求められたら、**Personal Access Token** を作成して使用:
- https://github.com/settings/tokens → 「Generate new token (classic)」
- Scopes: `repo` にチェック
- 生成されたトークンをパスワード欄に貼り付け

---

### ✅ STEP 5: GitHub Actions の自動デプロイを設定 (5 分)

ローカルで以下を実行:

```bash
# Firebase CLI のサービスアカウントを生成
firebase init hosting:github
```

対話形式で以下に答える:
- リポジトリ: `taichisekiguchi-code/mate-dogtag`
- 「Set up the workflow file for PR previews?」 → **Yes**
- 「Set up automatic deployment to live on merge?」 → **Yes**
- ブランチ: `main`

これだけで、GitHub Secrets に Firebase 認証情報が自動登録されます。

#### 追加で必要な Secret を 1 つ登録

https://github.com/taichisekiguchi-code/mate-dogtag/settings/secrets/actions

- Name: `FIREBASE_PROJECT_ID`
- Value: `mate-dogtag`

---

## 🎉 完了後の動作確認

### どの PC からでも作業再開

```bash
git clone https://github.com/taichisekiguchi-code/mate-dogtag.git
cd mate-dogtag
npm install
cp public/js/firebase-config.example.js public/js/firebase-config.js  # 設定値を入れる
npm run dev
```

### 変更を本番反映

```bash
git add .
git commit -m "Add 迷子モード改善"
git push
# → GitHub Actions が自動で Firebase Hosting にデプロイ
# → https://mate-dogtag.web.app に反映される
```

### プレビュー URL で共有

```bash
git checkout -b feature/lost-mode
# 編集
git push -u origin feature/lost-mode
# GitHub で PR を作成
# → 自動で preview URL が PR コメントに投稿される
```

---

## 🆘 困ったとき

| 症状 | 対処 |
|------|------|
| `git push` で認証エラー | Personal Access Token を再発行、`repo` scope が必要 |
| Firebase デプロイが失敗 | GitHub Actions のログを確認、Secret 名が正しいか確認 |
| Emulator に接続できない | `firebase emulators:start` が起動しているか確認 |
| どこまで進めたか分からない | このファイル下部のチェックリストで管理 |

---

## ✅ 進捗チェックリスト

- [ ] GitHub リポジトリ作成 (`taichisekiguchi-code/mate-dogtag`)
- [ ] Firebase プロジェクト作成 (`mate-dogtag`)
- [ ] Authentication / Firestore / Storage / Hosting 有効化
- [ ] `firebase-config.js` を作成して設定値を貼り付け
- [ ] `.firebaserc` のプロジェクト ID を書き換え
- [ ] 初回 `git push` 成功
- [ ] `firebase init hosting:github` で Actions 設定
- [ ] `FIREBASE_PROJECT_ID` Secret 追加
- [ ] `main` ブランチへの push で自動デプロイ確認
- [ ] PR 作成で preview URL が出ることを確認

---

## 📞 次の開発フェーズ

移行が終わったら、Claude に以下を伝えて開発継続:

> 「mate-dogtag の GitHub 移行完了。次は Phase 5 の迷子モード強化をやって」

Claude はどの PC からでも `git clone` したプロジェクトで続きから作業できます 🐾
