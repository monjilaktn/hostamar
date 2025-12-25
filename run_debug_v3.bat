@echo off
TITLE Hostamar Local Debugger V3 (Fixing Import Error)
COLOR 0A

echo ===================================================
echo  HOSTAMAR REPAIR & LAUNCH (V3)
echo ===================================================

:: 1. Kill potential zombie processes
echo [1/4] Cleaning up...
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Navigate
cd /d "G:\My Drive\hostamar-local"

:: 3. Force Install Fix
echo [2/4] Installing Missing SQLite Checkpoint Library...
python -m pip install -r requirements.txt --upgrade

:: 4. Launch Server
echo.
echo [3/4] Starting Uvicorn Server...
echo ---------------------------------------------------
echo  OPEN: http://127.0.0.1:8000
echo ---------------------------------------------------
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

COLOR 0C
echo.
echo ===================================================
echo  SERVER STOPPED
echo ===================================================
pause
