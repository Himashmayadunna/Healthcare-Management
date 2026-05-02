@echo off
REM Healthcare Dashboard - Full Stack Startup Script (Windows)
REM Starts both backend and frontend services

echo.
echo 🏥 Healthcare Dashboard - Starting Services...
echo.

REM Start Backend Server
echo 📡 Starting Backend Server...
cd backend
call npm install 2>nul
start cmd /k npm start
timeout /t 2 /nobreak

REM Start Frontend Server
echo.
echo 🎨 Starting Frontend Server...
cd..
call npm install 2>nul
start cmd /k npm run dev
timeout /t 3 /nobreak

echo.
echo ════════════════════════════════════════════════════
echo 🎉 Healthcare Dashboard is Ready!
echo ════════════════════════════════════════════════════
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo API:       http://localhost:5000/api
echo Database:  Oracle DB (as configured in backend/.env)
echo ════════════════════════════════════════════════════
echo.
pause
