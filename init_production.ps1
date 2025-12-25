# init_production.ps1
# Initialize Hostamar Production Stack

# 1. Create necessary volumes
$dirs = "data", "uploads", "knowledge_base", "ollama", "minio_data"
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
        Write-Host "Created directory: $dir"
    }
}

# 2. Start core infrastructure
Write-Host "Starting Infrastructure (Redis, MinIO, Prometheus, Grafana, Ollama)..."
docker compose -f docker-compose.prod.yml up -d redis minio prometheus grafana ollama

# 3. Pull AI Model
Write-Host "Pulling AI Model (deepseek-r1:14b) into local Ollama..."
docker exec ollama ollama pull deepseek-r1:14b

# 4. Start Nginx and initial App instance (Blue)
Write-Host "Starting Initial Application Stack..."
docker compose -f docker-compose.prod.yml up -d hostamar-blue nginx

Write-Host "==================================================="
Write-Host " Hostamar Production Stack initialized."
Write-Host " App URL: http://localhost"
Write-Host " Grafana: http://localhost:3000"
Write-Host " Prometheus: http://localhost:9090"
Write-Host "==================================================="
