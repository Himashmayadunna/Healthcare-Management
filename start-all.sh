#!/bin/bash

# Healthcare Dashboard - Full Stack Startup Script
# Starts both backend and frontend services

echo "🏥 Healthcare Dashboard - Starting Services..."
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start Backend Server
echo "📡 Starting Backend Server..."
cd backend
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:5000"
echo "   API Base: http://localhost:5000/api"
sleep 2

# Start Frontend Server
echo ""
echo "🎨 Starting Frontend Server..."
cd ../
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running on http://localhost:3000"
sleep 3

echo ""
echo "════════════════════════════════════════════════════"
echo "🎉 Healthcare Dashboard is Ready!"
echo "════════════════════════════════════════════════════"
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo "API:       http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop both services"
echo "════════════════════════════════════════════════════"
echo ""

# Wait for both processes
wait
