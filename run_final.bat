@echo off
TITLE Hostamar Final Launcher
COLOR 0A

echo ===================================================
echo  HOSTAMAR FINAL LAUNCHER (CEO MODE)
echo ===================================================

:: 1. Force Kill old processes
echo [1/4] Cleaning up ports...
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Navigate
cd /d "G:\My Drive\hostamar-local"

:: 3. Install ALL Dependencies
echo [2/4] Installing Libraries...
python -m pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart pydantic langgraph>=0.2.0 langgraph-checkpoint>=2.0.0 langgraph-checkpoint-sqlite>=3.0.1 langchain-openai langchain-core requests argon2-cffi aiosqlite

:: 4. Launch Server with detailed logs
echo.
echo [3/4] Starting Server...
echo ---------------------------------------------------
echo  Server is starting... Wait for 'Application startup complete'
echo  Then Open: http://127.0.0.1:8000
echo ---------------------------------------------------
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

:: If server crashes, keep window open to show error
COLOR 0C
echo.
echo ===================================================
echo  CRASH REPORT
echo ===================================================
pause
