@echo off
TITLE Hostamar Safe Mode
COLOR 0B

echo ===================================================
echo  HOSTAMAR SAFE MODE LAUNCHER
echo ===================================================

:: 1. Cleanup
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Environment Setup
set OPENAI_API_KEY=sk-dummy-key-for-local-testing
set SECRET_KEY=local_dev_secret
cd /d "G:\My Drive\hostamar-local"

:: 3. Launch Server on ALTERNATE PORT 8080
echo.
echo [INFO] Starting Server on Port 8080...
echo Visit: http://127.0.0.1:8080
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --log-level debug --no-use-colors

echo.
echo ===================================================
echo  CRASHED. PRESS ANY KEY TO CLOSE.
echo ===================================================
pause
