import typer
from typing_extensions import Annotated
import json
import requests

app = typer.Typer(help="Hostamar CLI - Manage your Enterprise AI Platform")

API_BASE_URL = "https://hostamar.com/api"
TOKEN = ""

def get_headers():
    if not TOKEN:
        print("❌ Error: Not logged in. Please run 'hostamar-cli login'.")
        raise typer.Exit(1)
    return {"Authorization": f"Bearer {TOKEN}"}

@app.command()
def login(username: str = typer.Option(..., prompt=True), password: str = typer.Option(..., prompt=True, hide_input=True)):
    """Login to the Hostamar platform."""
    try:
        res = requests.post(f"{API_BASE_URL}/auth/login", json={"username": username, "password": password})
        res.raise_for_status()
        global TOKEN
        TOKEN = res.json()['token']
        print(f"✅ Login successful. Welcome, {username}!")
    except requests.RequestException as e:
        print(f"❌ Login failed: {e.response.json().get('message', e)}")

@app.command()
def list_dgp(pretty: bool = typer.Option(False, "--pretty", help="Pretty print the JSON output.")):
    """List all managed DGP Assets."""
    try:
        res = requests.get(f"{API_BASE_URL}/dgp", headers=get_headers())
        res.raise_for_status()
        if pretty:
            print(json.dumps(res.json(), indent=2))
        else:
            print(json.dumps(res.json()))
    except requests.RequestException as e:
        print(f"❌ Error: {e.response.json().get('message', e)}")

@app.command()
def status():
    """Get the real-time system status."""
    try:
        res = requests.get(f"{API_BASE_URL}/system/status", headers=get_headers())
        res.raise_for_status()
        print(json.dumps(res.json(), indent=2))
    except requests.RequestException as e:
        print(f"❌ Error: {e.response.json().get('message', e)}")

if __name__ == "__main__":
    app()
