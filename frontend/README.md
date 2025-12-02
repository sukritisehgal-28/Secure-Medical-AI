# 🏥 Secure Medical Notes AI - Premium React Frontend

A beautiful, modern React/TypeScript frontend for the Secure Medical Notes AI platform with glassmorphic design, smooth animations, and emoji-enhanced UX.

## ✨ Features

- 🎨 **Premium Glassmorphic Design** - Modern UI with glassmorphism effects and smooth gradients
- 🌓 **Dark Mode Support** - Seamless theme switching with persistent state
- 🎭 **Smooth Animations** - Framer Motion powered animations and micro-interactions
- 😊 **Emoji-Enhanced UX** - Friendly, intuitive interface with contextual emojis
- 🔐 **Real API Integration** - Connected to FastAPI backend with JWT authentication
- 👨‍⚕️ **Doctor Dashboard** - Patient management, clinical notes, AI analytics, calendar
- 👩‍⚕️ **Nurse Dashboard** - Patient care, vitals monitoring, medication tracking, timeline
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Vite build tool for lightning-fast development and production builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- FastAPI backend running on `http://localhost:8000`
- PostgreSQL/SQLite database with seed data

### Installation

```bash
# 1. Navigate to the React app directory
cd "Design Premium Landing Page"

# 2. Install dependencies
npm install

# 3. Create .env file (already created)
# Make sure VITE_API_BASE_URL=http://localhost:8000 in .env

# 4. Start development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Building for Production

```bash
# Build optimized production bundle
npm run build

# The build output will be in the `build/` directory
```

## 🔌 API Integration

The React app connects to your FastAPI backend. Ensure the backend is running:

```bash
# From project root, start the FastAPI server
uvicorn api.main:app --reload --port 8000
```

### Demo Credentials

**Doctor Login:**
- Email: `dr.williams@hospital.com`
- Password: `password123`

**Nurse Login:**
- Email: `nurse.davis@hospital.com`
- Password: `password123`

## 📁 Project Structure

```
Design Premium Landing Page/
├── src/
│   ├── components/
│   │   ├── Hero.tsx                    # Hero section with medical patterns
│   │   ├── LandingPage.tsx             # Main landing page
│   │   ├── Login.tsx                   # Authentication with API integration  ✨
│   │   ├── DoctorDashboard.tsx         # Doctor workspace with tabs
│   │   ├── NurseDashboard.tsx          # Nurse workspace with emojis ✨ NEW!
│   │   ├── MedicalPreview.tsx          # Stats and preview section
│   │   ├── MedicalBenefits.tsx         # Benefits grid with gradients
│   │   ├── TestimonialsSlideshow.tsx   # Customer testimonials
│   │   ├── PatientsTab.tsx             # Patient management interface
│   │   ├── ClinicalNotesTab.tsx        # Clinical documentation studio
│   │   ├── CalendarTab.tsx             # Appointment scheduling
│   │   └── ui/                         # 48 Radix UI components
│   ├── services/
│   │   └── api.ts                      # API service layer ✨ NEW!
│   ├── App.tsx                         # Main app with routing
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Tailwind + custom styles
├── .env                                # Environment variables
├── vite.config.ts                      # Vite configuration
└── package.json                        # Dependencies
```

## 🎨 Design System

### Color Palette

- **Primary:** Purple (`#667eea` to `#764ba2`) - Medical/Healthcare brand
- **Secondary:** Indigo, Blue - Trust and professionalism
- **Accent:** Pink (Nurse), Cyan, Teal - Energy and vitality
- **Status Colors:**
  - Success: Green
  - Warning: Orange/Yellow
  - Danger: Red
  - Info: Blue

### Visual Effects

- **Glassmorphism:** `bg-white/50 backdrop-blur-xl`
- **Gradient Glows:** Multi-layer blur overlays
- **Medical Patterns:** SVG medical cross grid backgrounds
- **Floating Animations:** Y-axis motion with easeInOut
- **Hover Effects:** Scale, translate, shadow transitions

## 🔧 Technology Stack

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool and dev server

### UI & Animation
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Beautiful icon library
- **Radix UI** - Headless accessible components
- **Tailwind CSS** - Utility-first styling

### State & API
- **Fetch API** - HTTP requests
- **LocalStorage** - Token persistence
- **React Hooks** - State management

## 🎯 Key Components

### Landing Page
- Hero section with medical background patterns
- Stats grid (50K+ notes, 10K hrs saved, 99.8% accuracy)
- Mock medical note preview
- 6 benefit cards with gradient icons
- Testimonials carousel
- Medical specialties ribbon

### Login Page ✨ UPDATED
- Role selection (Doctor vs Nurse)
- Email/password authentication
- Show/hide password toggle
- Quick login buttons for demo
- **Error handling with animations**
- **API integration with JWT tokens**

### Doctor Dashboard
- **Dashboard Tab:** Stats cards, recent notes, high-risk patients
- **Patients Tab:** Patient intelligence workspace with search
- **Clinical Notes Tab:** Documentation studio with AI generation
- **AI & Analytics Tab:** Risk assessment and insights
- **Calendar Tab:** Appointment scheduling

### Nurse Dashboard ✨ NEW!
- **Dashboard Tab:**
  - Welcome message with animated emoji 🩺
  - 4 stat cards (Assigned Patients 👥, Vitals Due 💉, Medications 💊, Tasks 📋)
  - My Patients Today list with room numbers and status
  - Today's Timeline with urgent tasks
  - Recent Vitals Recorded grid
- **My Patients Tab:** Room assignments with status indicators
- **Vitals Tab:** BP, temp, heart rate monitoring
- **Medications Tab:** Medication administration record (MAR)
- **Schedule Tab:** Shift calendar and handoff notes

## 🌟 New Features

### Emoji-Enhanced UX
- 👥 Patient counts and assignments
- 💉 Vitals and medication reminders
- 🩺 Medical procedures and tasks
- ✅ Completion status
- ⚠️ Urgent alerts
- 💊 Medications
- 📋 Tasks and checklists
- 🏥 Hospital rooms and locations
- 💓 Heart rate and vitals
- 🩹 Wound care
- 💧 IV fluids

### Animations
- Fade-in/slide-up on page load
- Staggered list animations (0.1s delay between items)
- Floating medical icons with rotate
- Hover scale effects (scale: 1.05)
- Timeline progress indicators
- **Emoji pulse animations** (scale: [1, 1.2, 1])
- Card hover lift effects (y: -5)

### Dark Mode
- Toggle button on all pages
- Persistent state across navigation
- Smooth color transitions
- Adjusted contrast for readability
- Different accent colors per theme

## 🔐 API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /patients/` - List all patients
- `GET /patients/{id}` - Get patient details
- `POST /notes/` - Create clinical note
- `POST /ai/summarize/{note_id}` - AI summarization
- `GET /ai/risk-report/{patient_id}` - Risk assessment
- `GET /ai/high-risk-patients` - High-risk patient list
- `GET /appointments/` - List appointments
- `POST /appointments/` - Create appointment

## 📝 Environment Variables

The `.env` file is already created with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### "Cannot connect to API"
- Ensure FastAPI backend is running: `uvicorn api.main:app --reload --port 8000`
- Check CORS settings in `api/main.py`
- Verify `.env` has correct API URL

### "Login failed"
- Check if database has seed data: `python api/seed_more_data.py`
- Verify credentials match database
- Check browser console for errors

### TypeScript Errors
- Run `npm install` to install all dependencies
- Restart VS Code TypeScript server
- These will disappear once npm install completes

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version: `node -v` (should be 18+)

## 📚 Additional Resources

- Original Figma Design: https://www.figma.com/design/e9Jn9DQVf9B4EQTQALzb7g/Design-Premium-Landing-Page
- FastAPI Documentation: http://localhost:8000/docs
- Radix UI Components: https://www.radix-ui.com/
- Framer Motion: https://www.framer.com/motion/
- Tailwind CSS: https://tailwindcss.com/

## 🤝 Team

**Data Center Scale Computing Course Project**

Team Members:
- Sakshi Asati
- Sukriti Sehgal

## 📄 License

Educational/Academic Project
