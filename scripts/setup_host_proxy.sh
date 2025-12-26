#!/bin/bash
# setup_host_proxy.sh
# Run this on the Hostamar Production Server (hostamar-prod)
# It configures the host's Nginx to forward traffic from port 80 -> 8080

echo "--- Hostamar Domain Setup ---"

# 1. Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "[+] Installing Nginx on host..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "[v] Nginx is already installed."
fi

# 2. Create Proxy Configuration
echo "[+] Configuring Nginx Reverse Proxy..."
sudo tee /etc/nginx/sites-available/hostamar > /dev/null <<EOF
server {
    listen 80;
    server_name hostamar.com www.hostamar.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 3. Enable the Site
echo "[+] Enabling site configuration..."
sudo ln -sf /etc/nginx/sites-available/hostamar /etc/nginx/sites-enabled/

# Optional: Disable default if it exists to avoid conflicts
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "[-] Disabling default Nginx site..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# 4. Restart Nginx
echo "[+] Restarting Nginx..."
if sudo nginx -t; then
    sudo systemctl restart nginx
    echo "=================================================="
    echo " SUCCESS! Hostamar is live at http://hostamar.com"
    echo "=================================================="
else
    echo "[!] Nginx configuration failed test. Please check logs."
    exit 1
fi
