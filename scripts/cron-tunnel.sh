#!/bin/bash
# Hostamar Ollama Tunnel Keepalive — script mode
# Uses Windows SSH client to tunnel remote Ollama (192.168.1.3:11434)
# to localhost:11434 via the Windows host. WSL localhost forwards to Windows.

SSH="/mnt/c/Windows/System32/OpenSSH/ssh.exe"
SSH_KEY="C:\\Users\\romel\\.ssh\\id_ed25519_wsl"
REMOTE="romel@192.168.1.3"
TUNNEL_PORT=11435
REMOTE_PORT=11434

# 1. Check if tunnel is alive
TUNNEL_ALIVE=$(curl -sf --max-time 5 "http://127.0.0.1:${TUNNEL_PORT}/api/tags" > /dev/null 2>&1; echo $?)

if [ "$TUNNEL_ALIVE" -eq 0 ]; then
    echo "Ollama tunnel ($TUNNEL_PORT → $REMOTE:$REMOTE_PORT): UP"
    exit 0
fi

# 2. Tunnel is down — attempt restart
echo "Ollama tunnel: DOWN — attempting restart"

# Kill stale SSH processes (Windows-style)
/mnt/c/Windows/System32/taskkill.exe /f /im ssh.exe 2>/dev/null || true
sleep 2

# 3. Verify remote machine is reachable
$SSH -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "$REMOTE" \
    "curl -s http://localhost:${REMOTE_PORT}/api/tags" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "Remote Ollama ($REMOTE:$REMOTE_PORT): UNREACHABLE — host may be offline"
    exit 0
fi

# 4. Start tunnel in background via sleep trick
# The -L flag forwards Windows localhost:$TUNNEL_PORT -> remote localhost:$REMOTE_PORT
# WSL has a local Ollama on 11434, so we use 11435 for the tunnel
nohup $SSH \
    -o ConnectTimeout=10 \
    -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -i "$SSH_KEY" \
-L ${TUNNEL_PORT}:127.0.0.1:${REMOTE_PORT} \
    "$REMOTE" \
    "sleep 99999" > /dev/null 2>&1 &

# Give it time to establish
sleep 5

# Verify
curl -sf --max-time 5 "http://127.0.0.1:${TUNNEL_PORT}/api/tags" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Tunnel restarted successfully — Ollama reachable at localhost:${TUNNEL_PORT}"
else
    echo "Tunnel restart FAILED — check SSH connectivity"
fi
