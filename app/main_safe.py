# app/main.py (Emergency Safe Mode)
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

# Safe Import Strategy
try:
    from app import auth, brain
    BRAIN_ACTIVE = True
except ImportError:
    BRAIN_ACTIVE = False
    print("WARNING: Brain module failed to load.")

app = FastAPI(title="Hostamar Safe Mode")

app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.get("/")
def root():
    return {"status": "Safe Mode Active", "brain": "Online" if BRAIN_ACTIVE else "Offline"}

@app.get("/health")
def health():
    return {"status": "operational", "mode": "emergency"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
