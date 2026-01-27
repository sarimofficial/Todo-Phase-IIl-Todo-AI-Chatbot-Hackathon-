# Quick Start: Full-Stack Todo Web Application

**Feature**: 002-fullstack-web
**Date**: 2025-12-28

## Prerequisites

- Node.js 20+ (for frontend)
- Python 3.13+ (for backend)
- UV package manager (for Python)
- Neon PostgreSQL account
- Git

## Environment Setup

### 1. Clone and Navigate

```bash
cd /path/to/hackathon-todo
git checkout 002-fullstack-web-app
```

### 2. Neon Database Setup

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project named `hackathon-todo`
3. Copy the connection string (looks like `postgresql://user:pass@host/db?sslmode=require`)

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment with UV
uv venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Install dependencies
uv pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000
```

### 4. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
```

**Important**: `BETTER_AUTH_SECRET` must be the same in both frontend and backend!

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Verify Setup

### 1. Check Backend Health

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### 2. Check API Docs

Open `http://localhost:8000/docs` in browser to see Swagger UI.

### 3. Check Frontend

Open `http://localhost:3000` in browser. You should see the login page.

## Development Workflow

### Adding a New Feature

1. Update spec in `specs/002-fullstack-web/spec.md`
2. Update data model if needed in `data-model.md`
3. Update API contract in `contracts/api-openapi.yaml`
4. Implement backend changes
5. Implement frontend changes
6. Write tests
7. Create PHR for the work

### Running Tests

**Backend:**
```bash
cd backend
pytest tests/ -v
```

**Frontend:**
```bash
cd frontend
npm run test
```

### Linting

**Backend:**
```bash
cd backend
ruff check .
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Common Issues

### CORS Errors

If you see CORS errors in browser console:
1. Check `CORS_ORIGINS` in backend `.env` includes your frontend URL
2. Restart backend server

### Database Connection Errors

1. Verify Neon connection string is correct
2. Check SSL mode is `require`
3. Verify your IP is not blocked by Neon

### JWT Verification Failures

1. Ensure `BETTER_AUTH_SECRET` is identical in both frontend and backend
2. Secret must be at least 32 characters

### Port Already in Use

```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

## Deployment

### Backend Deployment (Railway)

1. Connect GitHub repo to Railway
2. Set environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `CORS_ORIGINS` (your Vercel URL)
3. Deploy

### Frontend Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your Railway URL)
   - `BETTER_AUTH_SECRET`
3. Deploy

## File Structure Reference

```
hackathon-todo/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB connection
│   │   ├── models/           # SQLModel
│   │   ├── routers/          # API routes
│   │   └── middleware/       # Auth
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   ├── package.json
│   └── .env.example
└── specs/002-fullstack-web/  # This feature's docs
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `uvicorn app.main:app --reload` | Start backend dev server |
| `npm run dev` | Start frontend dev server |
| `pytest -v` | Run backend tests |
| `npm run test` | Run frontend tests |
| `npm run build` | Build frontend for production |
| `alembic upgrade head` | Run database migrations |
