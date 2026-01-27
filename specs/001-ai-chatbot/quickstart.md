# Quickstart Guide: AI Todo Chatbot Integration

**Feature**: 001-ai-chatbot
**Date**: 2026-01-25
**Phase**: Phase 1 - Setup Instructions

## Overview

This guide provides step-by-step instructions for setting up and testing the AI Todo Chatbot feature in your local development environment.

## Prerequisites

Before starting, ensure you have:

- ✅ Existing Phase II application running (Next.js frontend + FastAPI backend)
- ✅ Python 3.13+ installed
- ✅ Node.js 18+ installed
- ✅ Cohere API key (sign up at [cohere.com](https://cohere.com))
- ✅ PostgreSQL database (Neon Serverless) accessible
- ✅ Better Auth configured with JWT tokens

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend

# Install Cohere Python SDK
pip install cohere

# Install MCP SDK
pip install mcp

# Install additional dependencies
pip install asyncpg pydantic
```

### Step 2: Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# Existing variables (keep these)
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_secret_here

# New variable for Phase III
COHERE_API_KEY=ZCpzCoO6NkF4Ed9TYZjbYKH3Stom3P1d1yNSdgCt
```

**Security Note**: Never commit `.env` files to version control. Add `.env` to `.gitignore`.

### Step 3: Run Database Migrations

Create and run the migration to add Conversation and Message tables:

```bash
# Generate migration (if using Alembic)
alembic revision --autogenerate -m "Add conversations and messages tables"

# Review the generated migration file in alembic/versions/

# Apply migration
alembic upgrade head
```

**Verify Migration**:
```bash
# Connect to database and verify tables exist
psql $DATABASE_URL -c "\dt"

# Should show:
# - conversations
# - messages
# - tasks (existing)
# - users (existing)
```

### Step 4: Start Backend Server

```bash
# From backend/ directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend**:
```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected: {"status": "ok"}
```

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend

# Install OpenAI ChatKit (UI components)
npm install @openai/chatkit

# Install markdown rendering
npm install react-markdown

# Install sanitization library
npm install dompurify
npm install @types/dompurify --save-dev
```

### Step 2: Configure Environment Variables

Add the following to your `frontend/.env.local` file:

```env
# Existing variables (keep these)
NEXT_PUBLIC_API_URL=http://localhost:8000

# No new variables needed for frontend
# (Cohere API key stays on backend only)
```

### Step 3: Start Frontend Server

```bash
# From frontend/ directory
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.3s
```

**Verify Frontend**:
- Open browser to http://localhost:3000
- Log in with existing credentials
- You should see the main todo app interface

---

## Testing the Chatbot

### Step 1: Locate the Chatbot Button

After logging in, look for the floating chatbot button:
- **Location**: Bottom-right corner of the screen
- **Appearance**: Circular emerald button with chat bubble icon
- **Animation**: Subtle pulse effect every 3 seconds

### Step 2: Open the Chat Panel

Click the chatbot button. The chat panel should:
- Slide in from the bottom-right
- Display "AI Assistant" header
- Show empty message area
- Display input field with "Type your message..." placeholder

### Step 3: Test Basic Task Creation

**Test 1: Simple Task Creation**

Type in the chat:
```
Add task: Buy groceries
```

**Expected Response**:
```
I've added 'Buy groceries' to your tasks. ✓
```

**Verification**:
- Check the main task list
- "Buy groceries" should appear as a pending task

---

**Test 2: Task Querying**

Type in the chat:
```
Show my tasks
```

**Expected Response**:
```
You have 1 task:
1. Buy groceries (pending)
```

---

**Test 3: Task Completion**

Type in the chat:
```
Mark 'Buy groceries' as done
```

**Expected Response**:
```
Great! I've marked 'Buy groceries' as complete. ✓
```

**Verification**:
- Check the main task list
- "Buy groceries" should now show as completed

---

**Test 4: User Identity Query**

Type in the chat:
```
Who am I?
```

**Expected Response**:
```
You are logged in as [your-email@example.com].
```

---

**Test 5: Multi-Step Operation**

Type in the chat:
```
Add task 'Call dentist' and show my pending tasks
```

**Expected Response**:
```
I've added 'Call dentist' to your tasks. ✓

Here are your pending tasks:
1. Call dentist
```

---

### Step 4: Test Error Handling

**Test 1: Non-Existent Task**

Type in the chat:
```
Complete task xyz999
```

**Expected Response**:
```
I couldn't find task xyz999. Would you like to see your current tasks?
```

---

**Test 2: Ambiguous Request**

Type in the chat:
```
Add task
```

**Expected Response**:
```
What would you like to add? Please tell me the task title.
```

---

**Test 3: Rate Limiting**

Send 61 messages rapidly (within 1 minute).

**Expected Response** (on 61st message):
```
HTTP 429: Too many requests. Please wait a moment.
```

---

## Troubleshooting

### Issue: Chatbot doesn't respond

**Symptoms**: Messages sent but no response appears

**Possible Causes**:
1. Cohere API key not configured
2. Backend server not running
3. Network connectivity issues

**Solutions**:
```bash
# Check backend logs
tail -f backend/logs/app.log

# Verify Cohere API key
echo $COHERE_API_KEY

# Test Cohere API directly
curl -X POST https://api.cohere.ai/v1/chat \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "model": "command-r-plus"}'
```

---

### Issue: Tasks don't appear in main list

**Symptoms**: Chatbot confirms task creation but task not visible

**Possible Causes**:
1. JWT token invalid or expired
2. User isolation issue
3. Database connection problem

**Solutions**:
```bash
# Check JWT token in browser DevTools
# Application > Local Storage > auth_token

# Verify database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tasks;"

# Check backend logs for errors
grep ERROR backend/logs/app.log
```

---

### Issue: Chat panel doesn't open

**Symptoms**: Clicking chatbot button has no effect

**Possible Causes**:
1. JavaScript error in frontend
2. CSS conflict
3. Component not mounted

**Solutions**:
```bash
# Check browser console for errors
# Open DevTools (F12) > Console tab

# Verify ChatButton component is rendered
# DevTools > Elements > Search for "ChatButton"

# Restart frontend with clean cache
rm -rf frontend/.next
npm run dev
```

---

### Issue: Rate limited immediately

**Symptoms**: First message returns 429 error

**Possible Causes**:
1. Rate limiter state persisted from previous session
2. Multiple users sharing same IP (development)

**Solutions**:
```bash
# Clear rate limiter cache (if using Redis)
redis-cli FLUSHDB

# Or restart backend server
# Rate limiter uses in-memory cache by default
```

---

## Development Workflow

### Making Changes

**Backend Changes**:
1. Edit files in `backend/src/`
2. Server auto-reloads (uvicorn --reload)
3. Test changes via chat interface

**Frontend Changes**:
1. Edit files in `frontend/src/`
2. Next.js auto-reloads
3. Refresh browser to see changes

### Running Tests

**Backend Tests**:
```bash
cd backend
pytest tests/ -v
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

**E2E Tests**:
```bash
cd frontend
npm run test:e2e
```

---

## Next Steps

After verifying the chatbot works locally:

1. **Review Implementation**: Check generated code against spec.md
2. **Run Full Test Suite**: Ensure all tests pass
3. **Performance Testing**: Test with multiple concurrent users
4. **Security Audit**: Verify JWT validation and user isolation
5. **Deploy to Staging**: Test in production-like environment

---

## Useful Commands

### Backend

```bash
# View logs
tail -f backend/logs/app.log

# Check database
psql $DATABASE_URL

# Run specific test
pytest tests/integration/test_chat_endpoint.py -v

# Check Cohere API usage
curl https://api.cohere.ai/v1/usage \
  -H "Authorization: Bearer $COHERE_API_KEY"
```

### Frontend

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Support

If you encounter issues not covered in this guide:

1. Check the [spec.md](./spec.md) for feature requirements
2. Review [plan.md](./plan.md) for architectural decisions
3. Consult [data-model.md](./data-model.md) for database schema
4. Check backend logs for detailed error messages
5. Verify all environment variables are set correctly

---

## Summary

You should now have:
- ✅ Backend running with Cohere API integration
- ✅ Frontend with chatbot UI components
- ✅ Database tables for conversations and messages
- ✅ Working chatbot that can manage tasks via natural language

The chatbot is ready for development and testing. Proceed to `/sp.tasks` to generate detailed implementation tasks.
