@echo off
setlocal
cd /d "%~dp0"

echo [1/3] npm install...
npm install
if errorlevel 1 (
    echo FAIL: npm install error
    pause & exit /b 1
)

echo [2/3] npx tsc --noEmit...
npx tsc --noEmit
if errorlevel 1 ( echo WARN: TypeScript errors found, continuing... )

echo [3/3] npx vite build...
npx vite build
if errorlevel 1 (
    echo FAIL: vite build error
    pause & exit /b 1
)

if exist "dist\index.html" (
    if not exist "output" mkdir output
    copy /Y "dist\index.html" "output\WeddingPlanner.html" >nul
    echo SUCCESS: output\WeddingPlanner.html
    start "" "output"
) else (
    echo FAIL: dist\index.html not found
)
pause
