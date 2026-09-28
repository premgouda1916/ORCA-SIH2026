# ORCA — Marine EcOsystem Reasoning with Collaborative Agents

**Smart India Hackathon 2026 Prototype**  
**Problem Statement ID:** 26176  
**Theme:** Space Technology  
**Category:** Software  
**Team:** INNOVEXA  

---

## 🌊 Overview & Core Solution

Marine information is historically fragmented across multiple web portals—satellite oceanography, Potential Fishing Zone (PFZ) advisories, Ocean State Forecasts (OSF), IMD radar warnings, and maritime GIS boundary maps. 

**ORCA (Marine EcOsystem Reasoning with Collaborative Agents)** provides a unified **"ASK THE SEA"** conversational decision-support engine. By coordinating 7 specialized AI agents, ORCA retrieves space oceanography data, performs spatial/temporal reasoning, checks restricted defense geofences, and delivers explainable, evidence-backed advisories with interactive Leaflet GIS visualization.

---

## 🚀 Key Prototype Capabilities

1. **"ASK THE SEA" Conversational UI:** Type natural language marine queries in English, Kannada, Hindi, Telugu, or Tamil.
2. **7 Collaborative Autonomous Agents:**
   - **User Interaction / Language Agent:** Multilingual NLU, unicode block detection, intent classification.
   - **Orchestrator Agent:** Central planner, context memory across turns, agent execution timing.
   - **PFZ + Ocean Agent:** Potential Fishing Zone identification, SST & Chlorophyll-a thermal front evaluation.
   - **Weather + Safety Agent:** Wind speed, wave swell height, sea state, lightning, and cyclone risk assessment.
   - **Route + GIS Agent:** Distance, compass bearing, geofence collision detection, and safe corridor routing.
   - **Risk Assessment Agent:** Composite risk level synthesis (`LOW`, `CAUTION`, `HIGH`, `UNSAFE`) & conflict engine.
   - **Reporting & Visualization Agent:** Evidence audit trail generation and GIS payload construction.
3. **Interactive Leaflet Marine GIS Map:**
   - User vessel departure location
   - PFZ markers with SST (°C), Chlorophyll ($mg/m^3$), depth ($m$), and distance ($km$) popups
   - Hazard radius centroids (Lightning warnings, high swell swells)
   - Prohibited Naval Defense geofences (Karwar Naval Base, Coral MPAs, IMBL border corridor)
   - Safe Navigation polyline corridor
4. **Data Transparency System:** Clearly displays `DATA STATUS: LIVE INCOIS / CACHED SNAPSHOT / DEMO MODE`.
5. **SIH Judge Preset Toolbar:** 1-click test triggers for all 12 SIH final acceptance test categories.
6. **Ecosystem Analytics & Evidence Hub:** Verified INCOIS coverage metrics (1,223 spatial nodes, 586 landing centres, 14 advisory sectors).

---

## 🎯 Final Acceptance Test Coverage

| Test # | Category / Query | System Response & Output |
| :--- | :--- | :--- |
| **TEST 1** | *"What is the nearest PFZ?"* | Finds nearest PFZ (`PFZ-MNG-01`), distance ($25.5km$), direction ($WNW$), and map marker. |
| **TEST 2** | *"What is the nearest PFZ and is it safe to go tomorrow morning?"* | Synthesizes PFZ + wave height ($1.8m$) + wind ($16.5 kts$) + risk (`CAUTION`). |
| **TEST 3** | *"What fishing zones should I avoid?"* | Highlights St. Mary's Coral MPA & lightning hazard centroids. |
| **TEST 4** | *"What is the safest route?"* | Calculates safe maritime corridor detour avoiding restricted defense zones. |
| **TEST 5** | *"Show areas with high chlorophyll and favorable SST."* | Filters active PFZ nodes matching $SST \in [28.0, 29.0]^\circ C$ and $Chl \ge 3.0 mg/m^3$. |
| **TEST 6** | *"Why has fish productivity declined?"* | Diagnostic breakdown correlating coastal upwelling index, thermal shift ($+1.4^\circ C$), and pelagic fish migration. |
| **TEST 7** | *"Are there any cyclone or lightning warnings?"* | Displays IMD Doppler radar alerts & wave swell advisories with timestamps. |
| **TEST 8** | *"Am I entering a restricted area?"* | Shapely polygon intersection check against Karwar Naval Base (Project Seabird). |
| **TEST 9** | *"ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗುವುದು ಸುರಕ್ಷಿತವೇ?"* | Detects Kannada unicode (`kn`) and responds in localized Kannada summary. |
| **TEST 10**| *"What about the route?"* (Follow-up) | Multi-turn memory retains previous PFZ context without re-prompting. |
| **TEST 11**| Offline / Fallback Mode | Seamlessly falls back to cached snapshot or demo data with `DATA STATUS: CACHED`. |
| **TEST 12**| Unsupported Query | Responds politely with supported marine decision capabilities and suggested prompts. |

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS, Lucide Icons, Recharts
- **Backend:** Python 3.13, FastAPI, Pydantic v2, Shapely (GIS Math), NumPy, HTTPX, Uvicorn
- **Spatial Engine:** Haversine distance, compass bearing vectors, Shapely polygon intersection
- **Data Integrations:** INCOIS PFZ WebGIS, INCOIS Ocean State Forecast (OSF), INCOIS ERDDAP, Bhuvan ISRO

---

## ⚡ Quick Start & Run Instructions

### 1. Automatic One-Click Launcher (Windows)
Double-click `start.bat` in the root folder. It will launch both backend and frontend servers automatically!

### 2. Manual Startup

#### Backend Server:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload
```
*Backend API available at:* `http://127.0.0.1:8008`  
*API Swagger Documentation:* `http://127.0.0.1:8008/docs`

#### Frontend Dashboard:
```bash
cd frontend
npm run dev
```
*Frontend UI available at:* `http://127.0.0.1:5173`

---

## 📡 REST API Endpoints

- `POST /api/chat` — Conversational Ask the Sea agentic decision endpoint.
- `GET /api/pfz` — Active Potential Fishing Zone advisories.
- `GET /api/ocean` — Ocean state observation parameters (SST, Chlorophyll, Upwelling).
- `GET /api/weather` — Hydrodynamic weather & sea state forecast.
- `GET /api/hazards` — Active marine warnings (lightning, high waves, cyclones).
- `GET /api/geofences` — Restricted naval defense & coral marine protected areas.
- `GET /api/routes` — Calculated safe maritime navigation route.
- `GET /api/alerts` — Proactive marine alert feed.
- `GET /api/analytics` — 7-day SST, Chlorophyll, and Wave trend datasets.
- `GET /api/evidence` — INCOIS coverage metadata (1,223 nodes, 586 landing centres, 14 sectors).
- `GET /api/health` — System health check.

---

## 🏆 SIH Presentation Alignment (6-Slide Strategy)

- **Slide 1: Identity** — ORCA: Marine EcOsystem Reasoning with Collaborative Agents (Team INNOVEXA).
- **Slide 2: Idea & Solution** — "Ask the Sea" natural language decision-support assistant replacing manual multi-portal searches.
- **Slide 3: Technical Approach** — 7 collaborative agents, FastAPI, Leaflet GIS, Shapely spatial math, Pydantic schemas.
- **Slide 4: Feasibility** — Modular Python/React architecture, INCOIS public data connectors, seamless cached fallback.
- **Slide 5: Impact** — Protects coastal fishermen, prevents vessel boundary breaches, optimizes fuel consumption by $18-25\%$.
- **Slide 6: Research & Evidence** — Verified INCOIS WebGIS metrics, satellite oceanography (EOS-06/MODIS), Bhuvan ISRO layers.

---
*Developed for Smart India Hackathon 2026 by Team INNOVEXA.*
