@echo off
TITLE ORCA — Marine EcOsystem Reasoning with Collaborative Agents (SIH 2026 #26176)
echo ===============================================================================
echo          ORCA — Marine Decision Support Engine (Team INNOVEXA)
echo ===============================================================================
echo Starting FastAPI Backend Server on http://127.0.0.1:8008...
start "ORCA Backend API" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload"

timeout /t 3 /nobreak > NUL

echo Starting Vite React Frontend Dashboard on http://127.0.0.1:5173...
start "ORCA Frontend UI" cmd /k "cd frontend && npm run dev"

echo ===============================================================================
echo  ORCA System Services Initialized!
echo  Frontend UI:  http://127.0.0.1:5173
echo  Backend API:   http://127.0.0.1:8008
echo  API Docs:      http://127.0.0.1:8008/docs
echo ===============================================================================
pause
