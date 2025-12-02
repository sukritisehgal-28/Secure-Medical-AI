# 🏗️ Project Structure

**Last Updated:** November 18, 2025
**Status:** Modern React-based Architecture

---

## Current Folder Organization

```
secure-med-notes-ai/
├── frontend/                    # 🆕 React 18.3 + TypeScript Frontend (Port 3000)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── DoctorDashboard.tsx      # Doctor workspace with tabs
│   │   │   ├── NurseDashboard.tsx       # Nurse workspace with emojis
│   │   │   ├── PatientsTab.tsx          # Patient management
│   │   │   ├── ClinicalNotesTab.tsx     # Note creation with templates
│   │   │   ├── CalendarTab.tsx          # Appointment scheduling
│   │   │   ├── AIAnalyticsTab.tsx       # AI analytics dashboard
│   │   │   ├── Login.tsx                # JWT authentication
│   │   │   └── ui/                      # 48 Radix UI components
│   │   ├── services/
│   │   │   └── api.ts           # API client with JWT token management
│   │   ├── App.tsx              # Main app with role-based routing
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Tailwind CSS styles
│   ├── package.json             # Node dependencies (React, Vite, etc.)
│   ├── vite.config.ts           # Vite build configuration
│   ├── tailwind.config.js       # Tailwind customization
│   ├── README.md                # Frontend documentation
│   └── FEATURES.md              # Feature inventory
│
├── api/                         # 🔌 FastAPI Backend (Port 8000)
│   ├── agents/                  # AI agents
│   │   ├── summarization_agent.py       # Note summarization with GPT-4
│   │   └── risk_agent.py                # Risk assessment agent
│   ├── db/
│   │   └── database.py          # Database connection & engine
│   ├── models/                  # SQLAlchemy models
│   │   ├── user.py              # User model
│   │   ├── patient.py           # Patient model
│   │   ├── note.py              # Clinical note model
│   │   ├── appointment.py       # Appointment model
│   │   └── audit.py             # Audit log model
│   ├── routes/                  # API endpoints
│   │   ├── auth.py              # /auth/login, /auth/signup
│   │   ├── patients.py          # /patients/* endpoints
│   │   ├── notes.py             # /notes/* endpoints
│   │   ├── ai.py                # /ai/* AI processing endpoints
│   │   └── appointments.py      # /appointments/* endpoints
│   ├── schemas/                 # Pydantic validation schemas
│   │   ├── user.py              # User validation
│   │   ├── patient.py           # Patient validation
│   │   └── note.py              # Note validation
│   ├── services/                # Business logic services
│   │   ├── ai_service.py        # OpenAI integration
│   │   └── auth_service.py      # JWT & password hashing
│   ├── deps.py                  # FastAPI dependencies (DB session, auth)
│   ├── main.py                  # FastAPI application entry point
│   └── seed_more_data.py        # Database seeding script (60+ notes)
│
├── docs/                        # 📚 Documentation
│   ├── features/                # Feature documentation
│   └── guides/                  # Technical guides
│
├── infra/                       # 🐳 Infrastructure & Deployment
│   ├── Dockerfile.api           # API container
│   └── nginx.conf               # Nginx reverse proxy config
│
├── data/                        # 📊 Data Files
│   └── policies/
│       └── hipaa.md             # HIPAA compliance policy
│
├── .venv/                       # 🐍 Python Virtual Environment (Active)
│
├── docker-compose.yml           # 🐳 PostgreSQL + Redis orchestration
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore patterns
├── start_react.sh               # ⚡ Quick start React UI + Backend
├── README.md                    # Main project documentation
├── ARCHITECTURE.md              # Detailed system architecture
├── PROJECT_PROPOSAL.md          # Original project proposal
├── PROJECT_STRUCTURE.md         # This file
├── UNNECESSARY_FILES.md         # Cleanup guide
├── OLD_UI_ANALYSIS.md           # Old Streamlit UI analysis
├── DEPRECATED_CODE_EXPLANATION.md  # Archive documentation
└── LOGIN_CREDENTIALS.txt        # Demo user credentials
```

---

## Quick Start

### One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/sakshiasati17/secure-med-notes-ai.git
cd secure-med-notes-ai

# Run the automated startup script
chmod +x start_react.sh
./start_react.sh
```

This script will:
✅ Start PostgreSQL and Redis (Docker)
✅ Check FastAPI backend status
✅ Install frontend dependencies
✅ Start React dev server (port 3000)

### Manual Setup

#### Terminal 1: Backend (FastAPI)
```bash
# Start database services
docker compose up -d

# Activate Python environment
source .venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Start API server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2: Frontend (React)
```bash
cd frontend

# Install dependencies (first time)
npm install

# Start development server
npm run dev
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **React UI** | http://localhost:3000 | Main user interface |
| **API Server** | http://localhost:8000 | Backend REST API |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |
| **PostgreSQL** | localhost:5434 | Database (docker) |
| **Redis** | localhost:6379 | Cache & queue (docker) |

---

## Key Features by Directory

### Frontend (`/frontend/`)

**Tech Stack:**
- React 18.3 + TypeScript
- Vite 6.3 (build tool)
- Tailwind CSS (styling)
- Radix UI (48 components)
- Framer Motion (animations)
- Lucide React (icons)

**Key Components:**
- ✅ **DoctorDashboard.tsx** - Purple-to-indigo gradient, AI analytics
- ✅ **NurseDashboard.tsx** - Emoji-enhanced UX, vitals tracking
- ✅ **PatientsTab.tsx** - Patient search and management
- ✅ **ClinicalNotesTab.tsx** - Note templates with AI summarization
- ✅ **CalendarTab.tsx** - Appointment scheduling
- ✅ **Login.tsx** - JWT authentication

**Design Features:**
- Glassmorphic design with blur effects
- Dark mode support (persistent)
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time loading states

### Backend (`/api/`)

**Tech Stack:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL (database)
- Redis (cache)
- OpenAI GPT-4 (AI)
- LangChain (AI orchestration)

**Key Routes:**
- `/auth/login` - JWT authentication
- `/patients` - CRUD operations
- `/notes` - Clinical notes management
- `/ai/summarize` - AI summarization
- `/ai/risk-report` - Risk assessment
- `/appointments` - Calendar integration

**Security:**
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Audit logging for all actions

---

## Demo Credentials

**Doctor:**
- Email: `dr.williams@hospital.com`
- Password: `password123`

**Nurse:**
- Email: `nurse.davis@hospital.com`
- Password: `password123`

*See [LOGIN_CREDENTIALS.txt](LOGIN_CREDENTIALS.txt) for all demo users*

---

## Development Workflow

### Frontend Development

```bash
cd frontend

# Start dev server (hot reload)
npm run dev

# Type checking
tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
source .venv/bin/activate

# Start with auto-reload
uvicorn api.main:app --reload

# Create database tables
python -c "from api.db.database import engine, Base; from api.models import user, patient, note, audit, appointment; Base.metadata.create_all(bind=engine)"

# Seed sample data
python api/seed_more_data.py

# Run tests
pytest api/tests/
```

---

## Architecture Highlights

### Single Page Application (SPA)
- React handles all routing client-side
- Fast page transitions (no reload)
- Persistent state during navigation

### RESTful API Backend
- Stateless API design
- JWT for authentication
- JSON request/response format

### Database Layer
- PostgreSQL for relational data
- Redis for caching and sessions
- SQLAlchemy ORM for type safety

### AI Integration
- OpenAI GPT-4 for summarization
- LangChain for agent orchestration
- FAISS for vector similarity search

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://meduser:medpass123@localhost:5434/secure_med_notes

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here
```

---

## Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build
# Creates optimized bundle in frontend/dist/

# Backend is ready for production
# Use gunicorn for WSGI server
gunicorn api.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment

```bash
# Build images
docker build -f infra/Dockerfile.api -t med-notes-api .
docker build -f frontend/Dockerfile -t med-notes-ui frontend/

# Run with docker-compose
docker-compose up -d
```

---

## Directory Responsibilities

| Directory | Owner | Purpose |
|-----------|-------|---------|
| `/frontend/` | Sukriti | React UI, components, styling |
| `/api/` | Sakshi | Backend logic, AI integration |
| `/docs/` | Both | Documentation and guides |
| `/infra/` | Both | Deployment configuration |
| `/data/` | Both | Static data and policies |

---

## Related Documentation

For more details, see:
- 📖 [README.md](README.md) - Project overview and quick start
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Complete system architecture
- 🎯 [frontend/FEATURES.md](frontend/FEATURES.md) - Feature inventory
- 📝 [PROJECT_PROPOSAL.md](PROJECT_PROPOSAL.md) - Original proposal
- 🗑️ [UNNECESSARY_FILES.md](UNNECESSARY_FILES.md) - Cleanup guide

---

**Status:** ✅ Production-ready architecture with modern React frontend
**Last Updated:** November 18, 2025
