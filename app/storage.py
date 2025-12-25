# app/storage.py
import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class LocalStorage:
    def save_file(self, file: UploadFile, user_id: str):
        user_folder = os.path.join(UPLOAD_DIR, user_id)
        if not os.path.exists(user_folder):
            os.makedirs(user_folder)
            
        file_path = os.path.join(user_folder, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_path

    def list_files(self, user_id: str):
        user_folder = os.path.join(UPLOAD_DIR, user_id)
        if not os.path.exists(user_folder):
            return []
        return os.listdir(user_folder)

storage = LocalStorage()
