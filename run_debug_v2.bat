@echo off
TITLE Hostamar Local Debugger V2
COLOR 0A

echo ===================================================
echo  HOSTAMAR DIAGNOSTIC LAUNCHER (CEO MODE)
echo ===================================================

:: 1. Kill potential zombie processes holding port 8000
echo [1/4] Cleaning up old processes...
taskkill /F /IM python.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo - Python processes terminated. Port 8000 should be free.
) else (
    echo - No existing Python processes found.
)

:: 2. Navigate to project root
cd /d "G:\My Drive\hostamar-local"
echo [2/4] Working Directory: %CD%

:: 3. Check/Install Critical Dependencies (Fast check)
echo [3/4] Verifying Core Dependencies...
python -c "import fastapi, uvicorn, pydantic, langchain_openai" >nul 2>&1
if %errorlevel% neq 0 (
    echo - Missing dependencies detected! Installing...
    python -m pip install -r requirements.txt
) else (
    echo - All core libraries found.
)

:: 4. Launch Server
echo.
echo [4/4] Starting Uvicorn Server...
echo ---------------------------------------------------
echo  OPEN YOUR BROWSER TO: http://127.0.0.1:8000
echo ---------------------------------------------------
echo.

:: Using python -m uvicorn is safer for Windows PATH issues
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

:: If we reach here, the server crashed or was stopped
COLOR 0C
echo.
echo ===================================================
echo  CRITICAL ERROR: SERVER STOPPED UNEXPECTEDLY
echo ===================================================
echo Possible fixes:
echo 1. Check the error message above (Red text).
echo 2. Ensure 'app/main.py' exists in the folder.
echo 3. Ensure no other app is using Port 8000.
echo.
pause
