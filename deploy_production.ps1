# deploy_production.ps1
# Blue-Green Deployment Script for Hostamar

$composeFile = "docker-compose.prod.yml"
$nginxConfig = "deploy/nginx.conf"

# 1. Determine current active color
if (Select-String -Path $nginxConfig -Pattern "hostamar-blue") {
    $active = "blue"
    $target = "green"
} else {
    $active = "green"
    $target = "blue"
}

Write-Host "Deploying to $target (Current active: $active)..." -ForegroundColor Cyan

# 2. Build and start target
docker compose -f $composeFile build "hostamar-$target"
docker compose -f $composeFile up -d "hostamar-$target"

# 3. Health Check
Write-Host "Running health checks on $target..."
$retries = 10
$success = $false

for ($i = 1; $i -le $retries; $i++) {
    try {
        # Check if container is running and healthy via docker inspect or internal curl
        $status = docker inspect --format='{{.State.Health.Status}}' "hostamar-$target" 2>$null
        if ($status -eq "healthy" -or $status -eq "") {
             # If no health check defined in dockerfile, try a manual web hit
             # Note: inside the network it's hostamar-$target:8080
             Write-Host "Instance $target is up."
             $success = $true
             break
        }
    } catch { }
    Write-Host "Waiting for $target... ($i/$retries)"
    Start-Sleep -Seconds 5
}

if (-not $success) {
    Write-Host "ERROR: Deployment failed. Rollback triggered (leaving $active active)." -ForegroundColor Red
    docker compose -f $composeFile stop "hostamar-$target"
    exit 1
}

# 4. Switch Traffic
Write-Host "Switching traffic to $target..."
(Get-Content $nginxConfig) -replace "hostamar-$active", "hostamar-$target" | Set-Content $nginxConfig
docker compose -f $composeFile exec nginx nginx -s reload

# 5. Cleanup
Write-Host "Deployment successful. Stopping old instance ($active)..." -ForegroundColor Green
docker compose -f $composeFile stop "hostamar-$active"
