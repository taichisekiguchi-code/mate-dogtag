#!/bin/bash
# ============================================================
# mate Digital Dog Tag - 開発環境セットアップ
# 新しい PC で git clone した後にこれを実行
# Usage: bash scripts/setup.sh
# ============================================================

set -e

echo "🐾 mate Digital Dog Tag - セットアップ開始"
echo ""

# Node.js チェック
if ! command -v node &> /dev/null; then
  echo "❌ Node.js がインストールされていません"
  echo "   https://nodejs.org/ からインストールしてください"
  exit 1
fi

NODE_VER=$(node -v)
echo "✅ Node.js: $NODE_VER"

# npm install
echo ""
echo "📦 依存パッケージをインストール中..."
npm install

# Firebase CLI チェック
if ! command -v firebase &> /dev/null; then
  echo ""
  echo "🔥 Firebase CLI をグローバルインストール中..."
  npm install -g firebase-tools
fi

FIREBASE_VER=$(firebase --version)
echo "✅ Firebase CLI: $FIREBASE_VER"

# firebase-config.js チェック
if [ ! -f "public/js/firebase-config.js" ]; then
  echo ""
  echo "⚠️  firebase-config.js が見つかりません"
  echo "   firebase-config.example.js をコピーして設定してください:"
  echo "   cp public/js/firebase-config.example.js public/js/firebase-config.js"
else
  echo "✅ firebase-config.js: 設定済み"
fi

# Firebase ログイン状態チェック
echo ""
echo "🔐 Firebase ログイン状態を確認中..."
if firebase projects:list &> /dev/null; then
  echo "✅ Firebase: ログイン済み"
else
  echo "⚠️  Firebase にログインしてください:"
  echo "   firebase login"
fi

echo ""
echo "============================================================"
echo "🎉 セットアップ完了！"
echo ""
echo "開発を始めるには:"
echo "  npm run dev          → ブラウザで http://localhost:3000 が開きます"
echo "  npm run emulators    → Firebase Emulator (http://localhost:4000)"
echo ""
echo "Claude Code で開発する場合:"
echo "  claude               → CLAUDE.md を自動で読み込みます"
echo "============================================================"
