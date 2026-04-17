# 🎬 Git 初期化 — コピペで実行するだけ

MIGRATION.md の STEP 4 用の一発コマンドです。**ターミナルを開いて、上から順にコピペ**してください。

---

## ① プロジェクトフォルダに移動

```bash
cd ~/Downloads/mate-dogtag-staging
```

> ※ フォルダの場所が違う場合は、そのパスに読み替えてください

---

## ② Git 初期化 + コミット + Push

```bash
# Git 初期化
git init
git branch -M main

# ユーザー情報（まだ未設定ならこれも）
git config user.name "taichisekiguchi-code"
git config user.email "taichi.sekiguchi@good-inc.design"

# Firebase 設定ファイルを作成（存在しない場合のみ）
if [ ! -f public/js/firebase-config.js ]; then
  cp public/js/firebase-config.example.js public/js/firebase-config.js
  echo "⚠️  firebase-config.js を作成しました。Firebase Console から取得した値を貼り付けてください"
fi

# ステージ & コミット
git add .
git commit -m "🎉 Initial commit - mate Dog Tag staging complete

- Phase 1: Staging environment with 4 demo views
- Phase 2: Registration wizard + edit form
- Phase 3: Default dog SVG placeholder
- Phase 4: Ready for GitHub + Firebase migration"

# GitHub リモート追加
git remote add origin https://github.com/taichisekiguchi-code/mate-dogtag.git

# Push（初回は -u で upstream 設定）
git push -u origin main
```

---

## ③ 認証を求められたら

- **Username:** `taichisekiguchi-code`
- **Password:** Personal Access Token（パスワードではない）

### Personal Access Token の作り方

1. https://github.com/settings/tokens
2. 「Generate new token」→「Generate new token (classic)」
3. **Note:** `mate-dogtag-dev`
4. **Expiration:** 90 days（お好み）
5. **Scopes:** ✅ `repo` だけチェック
6. 下の「Generate token」
7. 表示された `ghp_xxxxxxxx...` をコピーして、git push の Password 欄に貼り付け

---

## ④ Push 成功したら

```bash
# ブラウザで確認
open https://github.com/taichisekiguchi-code/mate-dogtag
```

`public/`, `README.md`, `MIGRATION.md` などが表示されていれば成功 ✅

---

## ⑤ 次は Firebase 連携

MIGRATION.md の **STEP 5** に進む:

```bash
firebase init hosting:github
```

---

## 🆘 よくあるエラー

### `remote: Repository not found`
→ GitHub 上にリポジトリがまだ作られていません。MIGRATION.md STEP 1 をやる

### `Permission denied (publickey)`
→ HTTPS で接続してます。以下で URL を切替:
```bash
git remote set-url origin https://github.com/taichisekiguchi-code/mate-dogtag.git
```

### `Updates were rejected`
→ GitHub 側に README を追加した時など。以下で解決:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

準備完了です 🐾
