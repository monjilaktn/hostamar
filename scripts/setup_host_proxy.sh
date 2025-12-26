#!/bin/bash
# setup_host_proxy.sh
# Run this on the Hostamar Production Server (hostamar-prod)
# It configures the host's Nginx to forward traffic from port 80 -> 8080

echo "--- Hostamar Domain Setup (Fixing 521 Error) ---"

# 1. Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "[+] Installing Nginx on host..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "[v] Nginx is already installed."
fi

# 2. Disable Default Config to prevent conflicts
echo "[+] Cleaning up default Nginx config..."
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
    echo "[-] Removed default site."
fi

# 3. Create Robust Proxy Configuration
echo "[+] Configuring Nginx Reverse Proxy..."
sudo tee /etc/nginx/sites-available/hostamar > /dev/null <<EOF
server {
    listen 80;
    server_name hostamar.com www.hostamar.com;

    access_log /var/log/nginx/hostamar_access.log;
    error_log /var/log/nginx/hostamar_error.log;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Increase timeouts for AI responses
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
EOF

# 4. Enable the Site
echo "[+] Enabling hostamar site..."
sudo ln -sf /etc/nginx/sites-available/hostamar /etc/nginx/sites-enabled/

# 5. Restart Nginx
echo "[+] Restarting Nginx service..."
if sudo nginx -t; then
    sudo systemctl restart nginx
    echo "=================================================="
    echo " SUCCESS! Nginx is listening on Port 80."
    echo " forwarding to Docker Container on Port 8080."
    echo "=================================================="
else
    echo "[!] Nginx configuration failed test. Please check logs."
    exit 1
fi