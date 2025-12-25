@echo off
TITLE Hostamar Live Deployment
COLOR 0A

echo ===================================================
echo  HOSTAMAR.COM DEPLOYMENT (CEO MODE)
echo ===================================================

:: 1. Force Kill old processes
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Navigate
cd /d "G:\My Drive\hostamar-local"

:: 3. Install Critical Fixes
echo [1/2] Updating Libraries...
python -m pip install langchain-chroma chromadb pydantic-settings --upgrade

:: 4. Launch Server
echo.
echo [2/2] Starting Server...
echo Visit: http://127.0.0.1:8000
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

pause
