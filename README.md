---
title: Todo Phase IIl Todo AI Chatbot Hackathon
emoji: 🤖
colorFrom: green
colorTo: gray
sdk: docker
pinned: false
---

# The Evolution of Todo - Full-Stack Application with AI Chatbot

A modern full-stack todo application with conversational AI capabilities, built with Next.js, FastAPI, and Cohere AI.

## Features

### Core Task Management
- **Add tasks**: Create new todo items via UI or chat
- **View tasks**: List all tasks with completion status
- **Mark complete**: Toggle task completion status
- **Update tasks**: Modify task titles
- **Delete tasks**: Remove tasks permanently

### AI Chatbot (Phase III) 🤖
- **Natural language task creation**: "Add task: Buy groceries"
- **Conversational queries**: "Show my pending tasks"
- **Task status management**: "Mark 'Buy groceries' as done"
- **Multi-step operations**: "Add task and show my list"
- **User identity queries**: "Who am I?"
- **Glassmorphic chat UI**: Premium slide-in chat panel
- **Conversation persistence**: Resume conversations across sessions
- **Markdown support**: Rich text formatting in responses

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel (async)
- **AI**: Cohere API (command-r-plus model)
- **Tools**: MCP SDK for tool definitions
- **Auth**: Better Auth with JWT

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **UI Components**: OpenAI ChatKit
- **Markdown**: react-markdown with DOMPurify

## Requirements

- Python 3.13 or higher
- Node.js 18 or higher
- PostgreSQL database (Neon recommended)
- Cohere API key (sign up at cohere.com)

## Installation

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add:
# - COHERE_API_KEY=your_key_here
# - BETTER_AUTH_SECRET=your_secret
# - DATABASE_URL=your_postgres_url

# Run database migrations
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local and add:
# - NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

## Usage

### Web Application

1. Navigate to `http://localhost:3000`
2. Register/login with your credentials
3. Use the main UI to manage tasks
4. Click the floating chat button (bottom-right) to open AI assistant

### AI Chatbot Examples

**Create tasks:**
```
"Add task: Buy groceries"
"Create a todo called 'Call dentist at 3pm'"
"Remind me to finish the report"
```

**Query tasks:**
```
"Show my tasks"
"What do I need to do today?"
"List completed tasks"
```

**Manage tasks:**
```
"Mark 'Buy groceries' as done"
"Change 'Call dentist' to 'Call dentist at 3pm'"
"Delete 'Old task'"
```

**Multi-step operations:**
```
"Add 'Weekly meeting' and show my pending tasks"
"Mark 'Buy groceries' as done and delete 'Old task'"
```

## Project Structure

```
phaselll/
├── backend/
│   ├── app/
│   │   ├── models/           # SQLModel database models
│   │   ├── services/         # Business logic (chat, cohere, tasks)
│   │   ├── routers/          # API endpoints (tasks, chat)
│   │   ├── middleware/       # Auth and rate limiting
│   │   ├── mcp_server/       # MCP tools and executor
│   │   └── main.py           # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages and layouts
│   │   ├── components/       # React components (chat UI)
│   │   ├── services/         # API clients
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript types
│   └── package.json
└── specs/                    # Design documents and specifications
    └── 001-ai-chatbot/
        ├── spec.md           # Feature specification
        ├── plan.md           # Implementation plan
        ├── tasks.md          # Task breakdown
        └── contracts/        # API contracts
```

## Development

### Run Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

### API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Architecture Highlights

### AI Chatbot Architecture
- **Stateless backend**: No server-side session state
- **Conversation persistence**: Database-stored chat history
- **Iterative tool execution**: Multi-step operation chaining
- **Strict JSON parsing**: Reliable tool call extraction
- **Rate limiting**: 60 requests/minute per user
- **User isolation**: JWT-based multi-tenant security

### MCP Tools (6 tools)
1. `add_task` - Create new tasks
2. `list_tasks` - Query tasks with filters
3. `complete_task` - Mark tasks complete
4. `update_task` - Update task titles
5. `delete_task` - Delete tasks
6. `get_current_user` - Get user information

## Security

- **JWT Authentication**: All API requests require valid tokens
- **User Isolation**: Database queries filtered by user_id
- **Input Sanitization**: XSS and injection prevention
- **Rate Limiting**: Prevents abuse and excessive API costs
- **API Key Security**: Cohere key stored in environment variables

## Performance Goals

- Chat response latency: <2 seconds (95th percentile)
- Conversation history load: <1 second
- Supports 100 concurrent users
- 50-message context window for AI

## Development Principles

This project follows:
- **Spec-Driven Development (SDD)**: All code generated from specifications
- **Test-Driven Development (TDD)**: Tests written before implementation
- **Clean Code**: Simple, readable, maintainable code
- **No Over-Engineering**: Minimum viable implementation
- **Constitutional Compliance**: Adheres to project constitution

## License

MIT License - Learning Project

## Project Evolution

This is Phase III of a 5-phase evolution:
1. ✅ **Phase I**: Console app (completed)
2. ✅ **Phase II**: Full-stack web application (completed)
3. ✅ **Phase III**: AI chatbot with MCP tools (current)
4. 🔜 **Phase IV**: Local Kubernetes deployment
5. 🔜 **Phase V**: Cloud deployment with Kafka & Dapr

---

**Version**: 3.0.0
**Created**: 2025-12-27
**Updated**: 2026-01-26
**Status**: Phase III - AI Chatbot Integration Complete
