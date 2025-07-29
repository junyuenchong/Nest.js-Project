# Update backend .env file
$backendEnv = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_DATABASE=BLOG

# JWT Configuration (UNIQUE SECRETS)
JWT_ACCESS_SECRET=ca07229d70a5ae4f7145769bdfa895fbf7f2b2ccad7931d69c1a5e77ec64f31b8fdb8f6fb56e33a1ed6a8a39ce27d802e
JWT_REFRESH_SECRET=24055541db6a11c8720e80403a35c5b6be52ee49a58202050fd93b7253324dca71ddce48c84b9431d3573b1879bf0157f069ce352c76d6c2c66698638d434498
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CSRF Configuration (UNIQUE SECRET)
CSRF_SECRET=2310a6eafd54ea3aeadcb68c89cc94a6a1985773273c4395b4f19eae8e840dc670a5108468e68d914505e77ec64f31b8fdb8f6fb56e33a1ed6a8a39ce27d802e

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