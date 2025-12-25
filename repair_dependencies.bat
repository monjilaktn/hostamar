@echo off
TITLE Hostamar Dependency Repair
COLOR 0B

echo [1/2] Installing ChromaDB and Pydantic Settings...
python -m pip install chromadb pydantic-settings --upgrade

echo [2/2] Verifying all requirements...
python -m pip install -r requirements.txt

echo.
echo ===================================================
echo  REPAIR COMPLETE. NOW RUN 'run_final.bat'
echo ===================================================
pause
