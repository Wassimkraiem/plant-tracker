# 🌱 Plant Tracker

A full-stack plant tracking application built with Next.js (frontend) and .NET (backend). Track your plants, manage watering schedules, and organize care tasks all in one place.

## 📚 Documentation

- **🚀 [Quick Start Guide](QUICK-START.md)** - Absolute beginner? Start here!
- **🐳 [Docker Guide](DOCKER-GUIDE.md)** - Complete Docker documentation
- **📖 This file** - Complete project documentation

## Features

- 📝 Add and manage plants with detailed information
- 💧 Track watering schedules and history
- ✅ Create and manage care tasks (pruning, fertilizing, etc.)
- 📊 View plant details and growth timeline
- 🌿 Pre-loaded examples: Olive trees, tomatoes, cucumbers, peppers

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **.NET 8.0** - Web API
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **Swagger** - API documentation

## Getting Started

### 🐳 Docker (Recommended - Easiest Way!)

**Prerequisites:** Docker and Docker Compose installed

**Quick Start:**

#### Windows:
```bash
docker-start.bat
```

#### Linux/Mac:
```bash
chmod +x docker-start.sh
./docker-start.sh
```

Or manually:
```bash
docker-compose up --build
```

That's it! 🎉 The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/swagger

**To Stop:**
```bash
# Windows
docker-stop.bat

# Linux/Mac
./docker-stop.sh

# Or manually
docker-compose down
```

---

### 💻 Manual Setup (Without Docker)

**Prerequisites:**
- Node.js 18+ and npm
- .NET 8.0 SDK

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/PlantTracker.API
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will start at `http://localhost:5000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

Or use the quick start scripts:
```bash
# Windows
start-backend.bat   # Terminal 1
start-frontend.bat  # Terminal 2

# Linux/Mac
./start-backend.sh   # Terminal 1
./start-frontend.sh  # Terminal 2
```

## API Endpoints

- `GET /api/plants` - Get all plants
- `GET /api/plants/{id}` - Get plant by ID
- `POST /api/plants` - Create new plant
- `PUT /api/plants/{id}` - Update plant
- `DELETE /api/plants/{id}` - Delete plant
- `POST /api/plants/{id}/water` - Log watering
- `GET /api/plants/{id}/watering-logs` - Get watering history
- `POST /api/plants/{id}/tasks` - Create care task
- `PUT /api/plants/tasks/{taskId}` - Update care task
- `DELETE /api/plants/tasks/{taskId}` - Delete care task

## Project Structure

```
plant_tracker/
├── backend/
│   └── PlantTracker.API/
│       ├── Controllers/      # API controllers
│       ├── Data/            # Database context
│       ├── Models/          # Data models
│       └── Program.cs       # App entry point
│
└── frontend/
    ├── app/                 # Next.js App Router
    │   ├── plant/[id]/     # Plant detail page
    │   ├── add/            # Add plant page
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Home page
    ├── components/          # React components
    └── types/              # TypeScript types
```

## Sample Plants

The application comes pre-loaded with example plants:

- 🫒 **Mediterranean Olive Tree** - Water every 7 days
- 🍅 **Cherry Tomatoes** - Water every 2 days
- 🥒 **Garden Cucumber** - Water daily
- 🫑 **Bell Peppers** - Water every 2 days

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

