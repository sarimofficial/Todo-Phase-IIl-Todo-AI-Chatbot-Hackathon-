# Research: Full-Stack Todo Web Application

**Feature**: 002-fullstack-web
**Date**: 2025-12-28
**Status**: Complete

## Research Summary

This document captures research findings for implementing the Phase II Full-Stack Todo Web Application.

---

## R1: Better Auth + FastAPI JWT Integration

### Decision
Use Better Auth on the frontend to manage sessions and issue JWT tokens. FastAPI backend verifies these tokens using the shared `BETTER_AUTH_SECRET`.

### Rationale
- Better Auth is a JavaScript/TypeScript library designed for Next.js
- FastAPI is a separate Python service that needs JWT verification
- JWT tokens are self-contained and can be verified independently
- No need for FastAPI to call the frontend to verify users

### Integration Pattern

```
Frontend (Next.js + Better Auth)          Backend (FastAPI)
┌─────────────────────────────────┐       ┌─────────────────────────────┐
│ 1. User logs in                 │       │                             │
│ 2. Better Auth creates session  │       │                             │
│ 3. Better Auth issues JWT       │       │                             │
│ 4. Store JWT in httpOnly cookie │       │                             │
│    or localStorage              │       │                             │
│                                 │       │                             │
│ 5. API call with header:        │──────▶│ 6. Extract Bearer token     │
│    Authorization: Bearer <jwt>  │       │ 7. Verify signature with    │
│                                 │       │    BETTER_AUTH_SECRET       │
│                                 │◀──────│ 8. Return user-specific data│
└─────────────────────────────────┘       └─────────────────────────────┘
```

### Backend JWT Verification (Python)

```python
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Session-based auth | Simple | Requires shared session store | Stateful, harder to scale |
| OAuth2 password flow | Standard | Complex setup | Over-engineered for hackathon |
| Custom JWT from FastAPI | Full control | Duplicate auth logic | Better Auth already handles this |

---

## R2: Neon PostgreSQL Connection with SQLModel

### Decision
Use SQLModel with async database sessions connected to Neon PostgreSQL via connection string.

### Rationale
- SQLModel combines SQLAlchemy and Pydantic
- Async support for better performance
- Native PostgreSQL support via asyncpg
- Neon provides serverless PostgreSQL with connection pooling

### Connection Pattern

```python
from sqlmodel import SQLModel, create_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine

DATABASE_URL = "postgresql+asyncpg://user:pass@host/db?sslmode=require"

engine = create_async_engine(DATABASE_URL, echo=True)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session
```

### Neon-Specific Configuration

- SSL mode: `require` (mandatory for Neon)
- Connection pooling: Use Neon's built-in pooler endpoint
- Idle timeout: Configure for serverless wake-up

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Supabase PostgreSQL | More features | Different ecosystem | Neon specified in hackathon |
| Local PostgreSQL | Full control | Deployment complexity | Cloud deployment required |
| SQLite | Simple | Not suitable for multi-user | No concurrent access |

---

## R3: Next.js App Router Structure

### Decision
Use Next.js 16+ with App Router, organizing pages by feature with route groups.

### Rationale
- App Router is the recommended approach for new Next.js projects
- Server Components by default for better performance
- Route groups for organizing auth vs protected routes
- Built-in layouts for consistent UI structure

### Route Structure

```
app/
├── layout.tsx              # Root layout (providers, fonts)
├── page.tsx                # Home redirect to /dashboard or /login
├── (auth)/                 # Auth route group (no layout prefix)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
└── dashboard/              # Protected area
    ├── layout.tsx          # Auth check wrapper
    └── page.tsx            # Task list
```

### Protected Route Pattern

```tsx
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return <>{children}</>
}
```

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Pages Router | More examples | Legacy approach | App Router is current standard |
| Single page app | Simple routing | No SSR benefits | SEO, performance concerns |

---

## R4: API Client Pattern

### Decision
Use native `fetch` with a custom API client wrapper that handles authentication headers.

### Rationale
- Native fetch is built-in, no extra dependency
- Simple wrapper handles JWT token injection
- Type-safe with TypeScript generics
- Easy error handling

### API Client Implementation

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken() // from Better Auth or localStorage

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  return response.json()
}

export const api = {
  tasks: {
    list: (userId: string) => fetchWithAuth<Task[]>(`/api/${userId}/tasks`),
    create: (userId: string, data: CreateTask) =>
      fetchWithAuth<Task>(`/api/${userId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
    // ... other methods
  }
}
```

### Alternatives Considered

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Axios | Interceptors, cleaner API | Extra dependency | fetch is sufficient |
| TanStack Query | Caching, revalidation | Complexity | Over-engineered for scope |
| tRPC | Type-safe end-to-end | Requires backend changes | FastAPI doesn't support it |

---

## R5: Form Handling

### Decision
Use controlled components with React's useState for simple forms. Consider React Hook Form if forms become complex.

### Rationale
- Task forms are simple (title, description)
- Built-in React state is sufficient
- No need for form library overhead
- Easy validation with inline checks

### Simple Form Pattern

```tsx
function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    onSubmit({ title })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      {error && <span className="text-red-500">{error}</span>}
      <button type="submit">Add Task</button>
    </form>
  )
}
```

---

## R6: Backend Deployment Options

### Decision
Deploy FastAPI backend to Railway (primary) or Render (fallback).

### Rationale
- Railway: Easy Python deployment, free tier, automatic builds
- Render: Similar features, good free tier
- Both support environment variables and PostgreSQL

### Deployment Requirements

| Requirement | Railway | Render |
|-------------|---------|--------|
| Python 3.13 | Yes | Yes |
| Free tier | Yes (limited) | Yes (spins down) |
| Custom domain | Yes | Yes |
| Environment vars | Yes | Yes |
| Auto-deploy | Yes (GitHub) | Yes (GitHub) |

### Configuration Files

**railway.json** or **Procfile**:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**requirements.txt** includes:
- fastapi
- uvicorn
- sqlmodel
- asyncpg
- python-jose
- python-dotenv

---

## Research Completion Status

| Topic | Status | Decision Made |
|-------|--------|---------------|
| Better Auth + FastAPI JWT | Complete | JWT verification via shared secret |
| Neon PostgreSQL + SQLModel | Complete | Async sessions with SSL |
| Next.js App Router | Complete | Route groups for auth/dashboard |
| API Client | Complete | Native fetch with wrapper |
| Form Handling | Complete | useState, React Hook Form if needed |
| Backend Deployment | Complete | Railway primary, Render backup |

All research items resolved. Ready for implementation phase.
