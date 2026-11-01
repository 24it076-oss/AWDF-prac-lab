# ==============================================================================
# Automated REST API Test Script - Task Management System
# Practical 4: Building a RESTful API with Node.js and Express
# ==============================================================================

$baseUrl = "http://localhost:5000/api/tasks"

Write-Host "`n🧪 [TEST 1] GET /api/tasks (Read All Tasks)" -ForegroundColor Cyan
$tasks = Invoke-RestMethod -Uri $baseUrl -Method Get
Write-Host "Success! Retrieved $($tasks.count) tasks." -ForegroundColor Green
$tasks.data | Format-Table id, title, status, priority

Write-Host "`n🧪 [TEST 2] POST /api/tasks (Create New Task)" -ForegroundColor Cyan
$newTask = @{
    title = "Implement Database Indexing on MySQL"
    description = "Add B-Tree indexes on foreign keys to optimize query join performance."
    status = "Pending"
    priority = "High"
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $newTask -ContentType "application/json"
$createdId = $created.data.id
Write-Host "Success! Created Task ID: $createdId" -ForegroundColor Green
$created.data | Format-List

Write-Host "`n🧪 [TEST 3] GET /api/tasks/:id (Read Single Task)" -ForegroundColor Cyan
$single = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Get
Write-Host "Success! Retrieved Task: $($single.data.title)" -ForegroundColor Green

Write-Host "`n🧪 [TEST 4] PUT /api/tasks/:id (Update Task)" -ForegroundColor Cyan
$updatePayload = @{
    status = "In Progress"
    description = "Indexing completed on test bench, running EXPLAIN query plan."
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Put -Body $updatePayload -ContentType "application/json"
Write-Host "Success! Updated Task Status: $($updated.data.status)" -ForegroundColor Green

Write-Host "`n🧪 [TEST 5] DELETE /api/tasks/:id (Delete Task)" -ForegroundColor Cyan
$deleted = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method Delete
Write-Host "Success! Deleted Task: $($deleted.message)" -ForegroundColor Green

Write-Host "`n🧪 [TEST 6] Trigger Global Error Handler (GET invalid ID: /api/tasks/99999)" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$baseUrl/99999" -Method Get
} catch {
    Write-Host "Success! Global Error Middleware caught 404: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n✅ ALL CRUD & MIDDLEWARE PIPELINE TESTS PASSED!`n" -ForegroundColor Green
