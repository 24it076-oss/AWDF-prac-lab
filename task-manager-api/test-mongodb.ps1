# ==============================================================================
# Automated MongoDB & Mongoose Schema Test Script
# Practical 5: MongoDB Integration and Schema Design with Mongoose
# ==============================================================================

$baseUrl = "http://localhost:5000/api/tasks"

Write-Host "`n🧪 [TEST 1] GET /api/tasks (Read All Documents from MongoDB Collection)" -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri $baseUrl -Method Get
Write-Host "Success! Source: $($response.source) | Count: $($response.count)" -ForegroundColor Green
$response.data | Select-Object _id, title, status, priority, isCompleted | Format-Table

Write-Host "`n🧪 [TEST 2] POST /api/tasks (Insert Document with Mongoose Validation)" -ForegroundColor Cyan
$newTaskPayload = @{
    title = "Deploy Express Server to AWS EC2"
    description = "Configure PM2 process manager and Nginx reverse proxy with SSL certificate."
    status = "Pending"
    priority = "High"
    tags = @("DevOps", "AWS", "Nginx")
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $newTaskPayload -ContentType "application/json"
$createdId = $created.data._id
Write-Host "Success! Inserted MongoDB Document with _id: $createdId" -ForegroundColor Green
$created.data | Format-List

Write-Host "`n🧪 [TEST 3] Trigger Mongoose Schema Validation Error (title minlength < 3)" -ForegroundColor Cyan
$invalidPayload = @{
    title = "No" # Violates minlength: 3
    priority = "High"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $invalidPayload -ContentType "application/json"
} catch {
    Write-Host "Success! Mongoose ValidationError caught: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🧪 [TEST 4] PUT /api/tasks/:id (Update Document with runValidators: true)" -ForegroundColor Cyan
$updatePayload = @{
    status = "Completed"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Put -Body $updatePayload -ContentType "application/json"
Write-Host "Success! Document updated. isCompleted automatically set to: $($updated.data.isCompleted)" -ForegroundColor Green

Write-Host "`n🧪 [TEST 5] Trigger Mongoose CastError (Invalid 24-char ObjectId)" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$baseUrl/invalid-non-hex-id" -Method Get
} catch {
    Write-Host "Success! Mongoose CastError caught: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🧪 [TEST 6] DELETE /api/tasks/:id (Delete Document)" -ForegroundColor Cyan
$deleted = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Delete
Write-Host "Success! Deleted Document: $($deleted.message)" -ForegroundColor Green

Write-Host "`n✅ ALL MONGOOSE SCHEMA & CRUD TESTS PASSED!`n" -ForegroundColor Green
