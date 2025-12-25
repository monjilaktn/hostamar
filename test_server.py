from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Test Server Running", "message": "If you see this, Python is working fine!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
