@echo off
TITLE Hostamar Emergency Launcher
COLOR 0E

echo ===================================================
echo  HOSTAMAR EMERGENCY MODE
echo ===================================================

:: 1. Cleanup
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Navigate
cd /d "G:\My Drive\hostamar-local"

:: 3. Launch Safe Server
echo Starting Safe Server on Port 8000...
python app/main_safe.py

pause
