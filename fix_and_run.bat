@echo off
TITLE Hostamar Self-Healing Launcher
COLOR 0A

echo ===================================================
echo  HOSTAMAR REPAIR & RUN (CEO MODE)
echo ===================================================

:: 1. Force Kill old Python processes
echo [1/5] Cleaning up lingering processes...
taskkill /F /IM python.exe /T >nul 2>&1

:: 2. Check Python Version
echo [2/5] Checking Python...
python --version
if %errorlevel% neq 0 (
    COLOR 0C
    echo ERROR: Python is not installed or not in PATH!
    pause
    exit
)

:: 3. Re-install Critical Dependencies (Force Reinstall)
echo [3/5] Fixing Dependencies (This may take a minute)...
python -m pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart pydantic langgraph>=0.2.0 langgraph-checkpoint>=2.0.0 langgraph-checkpoint-sqlite>=3.0.1 langchain-openai langchain-core requests argon2-cffi aiosqlite python-dotenv

:: 4. Verify Project Structure
if not exist "app\main.py" (
    COLOR 0C
    echo ERROR: 'app/main.py' not found! Are you in 'hostamar-local' folder?
    pause
    exit
)

:: 5. Launch Server with Debug Logs
echo.
echo [5/5] Starting Server...
echo ---------------------------------------------------
echo  Server is starting... Wait for 'Application startup complete'
echo  Then Open: http://127.0.0.1:8000
echo ---------------------------------------------------
echo.

:: Running as a module is safer
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --log-level debug

:: If server crashes, show error
COLOR 0C
echo.
echo ===================================================
echo  SERVER CRASHED - READ THE ERROR ABOVE
echo ===================================================
pause
