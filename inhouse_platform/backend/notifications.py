import firebase_admin
from firebase_admin import credentials, messaging
import os

# Initialize Firebase Admin SDK
# Note: In production, you would mount the google-services.json via Docker volume
# or use environment variables for credentials.
if not firebase_admin._apps:
    try:
        # Placeholder credential setup - expects path in env or default location
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase-adminsdk.json')
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("Warning: Firebase credentials not found. Notifications will be simulated.")
    except Exception as e:
        print(f"Firebase Init Error: {e}")

def send_push_notification(title, body, topic='admin_alerts'):
    """
    Sends a push notification to all devices subscribed to the topic.
    """
    try:
        if not firebase_admin._apps:
            print(f"SIMULATED NOTIFICATION: {title} - {body}")
            return

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            topic=topic,
        )
        response = messaging.send(message)
        print('Successfully sent message:', response)
    except Exception as e:
        print('Error sending message:', e)
