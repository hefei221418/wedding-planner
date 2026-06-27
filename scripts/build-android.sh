#!/bin/bash
# Android APK 打包脚本 — 需要 Node.js 和 Android Studio

set -e

echo "1/4 构建前端..."
npm run build

echo "2/4 安装 Capacitor..."
npm install --save-dev @capacitor/core @capacitor/cli @capacitor/android

echo "3/4 初始化 Android 项目..."
npx cap init "婚礼筹备助手" "com.wedding.planner" --web-dir=dist
npx cap add android

echo "4/4 同步代码到 Android 项目..."
npx cap sync

echo ""
echo "✅ 完成！打开 Android Studio："
echo "   npx cap open android"
echo "   然后点 Build → Build Bundle(s) / APK(s)"
