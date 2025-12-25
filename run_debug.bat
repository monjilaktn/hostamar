@echo off
echo ===================================================
echo  HOSTAMAR LOCAL DEBUG LAUNCHER
echo ===================================================

echo [1/3] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo CRITICAL ERROR: Python is not installed or not in PATH.
    pause
    exit /b
)

echo.
echo [2/3] Installing Dependencies...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo WARNING: Dependency installation had issues. Trying to run anyway...
)

echo.
echo [3/3] Starting Server...
echo Visit http://127.0.0.1:8000 in your browser once started.
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

echo.
echo ===================================================
echo  SERVER CRASHED OR STOPPED
echo ===================================================
pause
