#!/bin/bash
# Windows exe 打包脚本 — 需要 Node.js

set -e

echo "1/3 构建前端..."
npm run build

echo "2/3 安装 Electron 打包工具..."
npm install --save-dev electron electron-builder concurrently wait-on

echo "3/3 打包 exe..."
npx electron-builder --win portable

echo ""
echo "✅ 完成！exe 在 dist-electron/ 目录"
