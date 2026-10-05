# Start the Spring Boot backend
Write-Host "Starting Spring Boot backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw spring-boot:run"

# Start the React frontend
Write-Host "Starting React frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both applications are starting in separate windows."
Write-Host "Wait a few seconds for the frontend to be ready, then visit http://localhost:5173 in your browser."
