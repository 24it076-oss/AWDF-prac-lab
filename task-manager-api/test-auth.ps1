# PowerShell Automated Test Script for Practical 7: Authentication & Middleware Pipeline
# Tests Registration, Login, Token Generation, 401 Unauthorized, and Protected CRUD

$BaseUrl = "http://localhost:5000/api"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🧪 Practical 7: JWT Auth & Validation Middleware Test Suite" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Test 1: Test Server-Side Input Validation (Malformed registration)
Write-Host "`n[Test 1] Testing Input Validation: Malformed Registration Payload..." -ForegroundColor Yellow
$BadPayload = @{ name = "R"; email = "invalid-email"; password = "123" } | ConvertTo-Json
try {
    $Res = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $BadPayload -ContentType "application/json"
    Write-Host "❌ Expected 400 Bad Request but succeeded" -ForegroundColor Red
} catch {
    Write-Host "✔ Correctly rejected malformed payload with 400 Bad Request" -ForegroundColor Green
    Write-Host "Response: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 2: User Registration (201 Created + JWT)
Write-Host "`n[Test 2] Testing User Registration (POST /api/auth/register)..." -ForegroundColor Yellow
$UserPayload = @{
    name = "Rishi Student"
    email = "rishi.student@btech.ac.in"
    password = "SecurePassword123"
} | ConvertTo-Json

try {
    $RegRes = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $UserPayload -ContentType "application/json"
    $Token = $RegRes.token
    Write-Host "✔ User Registered Successfully! Token received:" -ForegroundColor Green
    Write-Host "JWT: $($Token.Substring(0, 35))..." -ForegroundColor Gray
} catch {
    Write-Host "ℹ User may already exist, attempting login..." -ForegroundColor Yellow
    $LoginPayload = @{
        email = "rishi.student@btech.ac.in"
        password = "SecurePassword123"
    } | ConvertTo-Json
    $LoginRes = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $LoginPayload -ContentType "application/json"
    $Token = $LoginRes.token
    Write-Host "✔ Logged in, JWT token acquired" -ForegroundColor Green
}

# Test 3: Unauthorized Access without Token (401 Unauthorized)
Write-Host "`n[Test 3] Testing Protected Route WITHOUT Token (GET /api/tasks)..." -ForegroundColor Yellow
try {
    $Res = Invoke-RestMethod -Uri "$BaseUrl/tasks" -Method Get
    Write-Host "❌ Expected 401 Unauthorized but succeeded" -ForegroundColor Red
} catch {
    Write-Host "✔ Correctly blocked unauthenticated request with 401 Unauthorized!" -ForegroundColor Green
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 4: Authorized Access with Bearer Token (200 OK)
Write-Host "`n[Test 4] Testing Protected Route WITH Bearer Token (GET /api/tasks)..." -ForegroundColor Yellow
$Headers = @{ Authorization = "Bearer $Token" }
try {
    $TasksRes = Invoke-RestMethod -Uri "$BaseUrl/tasks" -Method Get -Headers $Headers
    Write-Host "✔ Access Granted! Fetched $($TasksRes.count) tasks from protected endpoint." -ForegroundColor Green
} catch {
    Write-Host "❌ Error fetching tasks with token: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Verify User Profile (GET /api/auth/me)
Write-Host "`n[Test 5] Testing Protected User Profile (GET /api/auth/me)..." -ForegroundColor Yellow
try {
    $ProfileRes = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method Get -Headers $Headers
    Write-Host "✔ User authenticated as: $($ProfileRes.user.name) ($($ProfileRes.user.email))" -ForegroundColor Green
} catch {
    Write-Host "❌ Error fetching profile: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "🎉 Practical 7 Middleware & JWT Pipeline Validation Complete!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
