@echo off
echo Starting Spring Boot backend...
start powershell -NoExit -Command "cd backend; .\mvnw spring-boot:run"

echo Starting React frontend...
start powershell -NoExit -Command "cd frontend; npm run dev"

echo Both applications are starting in separate windows.
echo Wait a few seconds for the frontend to be ready, then visit http://localhost:5173 in your browser.
pause
