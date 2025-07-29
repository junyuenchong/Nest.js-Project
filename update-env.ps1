# Update backend .env file with secure secrets
# SECURITY: This script now generates random secrets instead of using hardcoded values
# For production, set these environment variables:
#   $env:JWT_ACCESS_SECRET="your-secure-secret"
#   $env:JWT_REFRESH_SECRET="your-secure-secret" 
#   $env:CSRF_SECRET="your-secure-secret"
#   $env:DB_PASSWORD="your-database-password"
Write-Host "🔐 Setting up secure environment variables..." -ForegroundColor Yellow

# Generate secure secrets if not provided
$jwtAccessSecret = $env:JWT_ACCESS_SECRET
if (-not $jwtAccessSecret) {
    $jwtAccessSecret = -join ((48..57) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "⚠️  Generated new JWT_ACCESS_SECRET. Set JWT_ACCESS_SECRET environment variable for production." -ForegroundColor Yellow
}

$jwtRefreshSecret = $env:JWT_REFRESH_SECRET
if (-not $jwtRefreshSecret) {
    $jwtRefreshSecret = -join ((48..57) + (97..122) | Get-Random -Count 128 | ForEach-Object {[char]$_})
    Write-Host "⚠️  Generated new JWT_REFRESH_SECRET. Set JWT_REFRESH_SECRET environment variable for production." -ForegroundColor Yellow
}

$csrfSecret = $env:CSRF_SECRET
if (-not $csrfSecret) {
    $csrfSecret = -join ((48..57) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "⚠️  Generated new CSRF_SECRET. Set CSRF_SECRET environment variable for production." -ForegroundColor Yellow
}

# Get database password securely
$dbPassword = $env:DB_PASSWORD
if (-not $dbPassword) {
    $dbPassword = Read-Host "Enter database password (or press Enter for default 'admin')" -AsSecureString
    if ($dbPassword.Length -eq 0) {
        $dbPassword = "admin"
    } else {
        $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    }
}

$backendEnv = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=$dbPassword
DB_DATABASE=BLOG

# JWT Configuration (SECURE SECRETS)
JWT_ACCESS_SECRET=$jwtAccessSecret
JWT_REFRESH_SECRET=$jwtRefreshSecret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CSRF Configuration (SECURE SECRET)
CSRF_SECRET=$csrfSecret

# Cookie Configuration
COOKIE_ACCESS_TOKEN_NAME=accessToken
COOKIE_REFRESH_TOKEN_NAME=refreshToken
COOKIE_CSRF_TOKEN_NAME=csrfToken
COOKIE_SAME_SITE=strict
COOKIE_MAX_AGE=604800000
COOKIE_CSRF_MAX_AGE=86400000
COOKIE_PATH=/

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
DOMAIN=yourdomain.com
"@

$backendEnv | Out-File -FilePath "backend/.env" -Encoding UTF8

Write-Host "✅ Backend .env file updated successfully!" -ForegroundColor Green 