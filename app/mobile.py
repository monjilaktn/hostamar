# app/mobile.py (Phase 13: Mobile API & Realtime)
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List
import firebase_admin
from firebase_admin import messaging, credentials
import os

router = APIRouter()

# --- Connection Manager for WebSockets ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

# --- WebSocket Endpoint ---
@router.websocket("/ws/chat/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Here we would invoke the Agent Brain asynchronously
            response = f"Agent says: Processing '{data}'..." 
            await manager.send_personal_message(response, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- FCM Push Notification ---
# Initialize Firebase (Mock for local)
if os.getenv("FIREBASE_CREDENTIALS"):
    cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS"))
    firebase_admin.initialize_app(cred)

@router.post("/mobile/notify")
async def send_notification(token: str, title: str, body: str):
    """Sends a push notification to the mobile app."""
    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=token,
        )
        response = messaging.send(message)
        return {"status": "success", "msg_id": response}
    except Exception as e:
        return {"status": "mock_success", "error": str(e), "note": "Firebase not configured locally"}