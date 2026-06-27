@echo off
cd /d "%~dp0"
echo Starting local server on http://localhost:5173
echo Open this URL in your browser.
echo Press Ctrl+C to stop.
npx serve dist -l 5173
