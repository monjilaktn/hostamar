# app/main.py (Phase 14: Enterprise Operations Ready)
from fastapi import FastAPI, Depends, HTTPException, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os
import uuid

# Load Env
load_dotenv()

from app import auth, security, payment, brain, storage, knowledge, monitoring, guardrails, mobile

app = FastAPI(title="Hostamar Enterprise AI Platform")

# --- MONITORING ---
# Exposes /metrics endpoint for Prometheus
Instrumentator().instrument(app).expose(app)

# Include Mobile Router
app.include_router(mobile.router)

# Startup Logic
@app.on_event("startup")
async def startup_event():
    await brain.init_brain()
    print("[SUCCESS] Hostamar AI Engine Live (Monitored).")

# Middleware & Security
app.add_middleware(security.SecurityHeadersMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=["*"])

templates = Jinja2Templates(directory="app/templates")

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    thread_id: str

# --- UI ROUTES ---
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/login")

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/dashboard/phase6", response_class=HTMLResponse)
async def ph6_page(request: Request):
    return templates.TemplateResponse("dashboard_phase6.html", {"request": request})

@app.get("/dashboard/phase7", response_class=HTMLResponse)
async def ph7_page(request: Request):
    return templates.TemplateResponse("dashboard_phase7.html", {"request": request})

@app.get("/dashboard/ai", response_class=HTMLResponse)
async def ai_dashboard(request: Request):
    return templates.TemplateResponse("dashboard_ai.html", {"request": request})

@app.get("/dashboard/upload", response_class=HTMLResponse)
async def upload_page(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})

# --- CORE API ---
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == "admin" and form_data.password == "hostamar123":
        token = security.create_access_token(data={"sub": form_data.username})
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect credentials")

@app.post("/agent/chat")
async def chat(request: ChatRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    input_msg = HumanMessage(content=request.message)
    try:
        print(f"[DEBUG] Invoking brain for message: {request.message}")
        response = await brain.agent_executor.ainvoke({"messages": [input_msg]}, config=config)
        raw_text = response["messages"][-1].content
        return guardrails.validate_agent_output(raw_text)
    except Exception as e:
        import traceback
        print(f"[ERROR] Chat Exception: {str(e)}")
        traceback.print_exc()
        return {"response": f"Error: {str(e)}"}

@app.post("/upload")
async def upload(file: UploadFile = File(...), user=Depends(security.get_current_user)):
    path = storage.storage.save_file(file, user["username"])
    return {"status": "success", "filename": file.filename}

@app.post("/payment/initiate")
async def pay(amount: float, gateway: str = "sslcommerz", user=Depends(security.get_current_user)):
    tran_id = f"HOST-{uuid.uuid4().hex[:8].upper()}"
    info = {"name": user["username"], "email": "user@example.com"}
    if gateway == "sslcommerz":
        return payment.SSLCommerzAdapter().initiate_payment(amount, tran_id, info)
    return {"error": "Gateway not supported"}

@app.get("/health")
def health():
    return {"status": "operational", "version": "2.2.0-monitored", "cloud": "k8s-ready"}