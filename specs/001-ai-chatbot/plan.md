# Implementation Plan: AI Todo Chatbot Integration

**Branch**: `001-ai-chatbot` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-chatbot/spec.md`

## Summary

Integrate an intelligent, conversational AI chatbot into the existing full-stack Todo application, enabling users to manage tasks through natural language. The chatbot uses Cohere API (command-r-plus model) for reasoning and tool invocation, MCP SDK for tool definitions, and persists conversations in the database. The frontend features a premium glassmorphic chat panel that slides in from the bottom-right corner, harmonizing with the existing flagship UI design.

**Core Capabilities**: Natural language task creation, querying, completion, updates, deletion, user identity queries, and multi-step operation chaining.

**Technical Approach**: Stateless backend architecture with database-persisted conversations, strict JSON tool call parsing, iterative tool execution loop for complex queries, JWT-based authentication for multi-tenant isolation, and responsive chat UI with typing indicators and auto-scroll.

## Technical Context

**Language/Version**:
- Backend: Python 3.13+
- Frontend: TypeScript 5.x with Next.js 16+ (App Router)

**Primary Dependencies**:
- Backend: FastAPI, SQLModel, cohere (Python SDK), mcp (Official MCP SDK), asyncpg
- Frontend: React 19, Tailwind CSS, OpenAI ChatKit (UI components), axios/fetch

**Storage**: Neon Serverless PostgreSQL (existing) with new tables: Conversation, Message

**Testing**:
- Backend: pytest, pytest-asyncio
- Frontend: Jest, React Testing Library
- Integration: Playwright for E2E chat flows

**Target Platform**: Web application (browser-based, responsive design)

**Project Type**: Web (monorepo with backend/ and frontend/ directories)

**Performance Goals**:
- Chat response latency: <2 seconds for 95% of requests
- Conversation history load: <1 second
- Support 100 concurrent users without degradation
- Cohere API calls: <500ms average latency

**Constraints**:
- Stateless backend (no server-side session state)
- JWT authentication required for all chat requests
- User isolation enforced at database query level
- Rate limiting: 60 requests/minute per user
- Message character limit: 500 characters
- Conversation history: Load most recent 50 messages for context

**Scale/Scope**:
- Expected users: 1000 concurrent users
- Conversations per user: Unlimited (no cleanup policy)
- Messages per conversation: Unlimited (paginated loading)
- Tool operations: 6 tools (add_task, list_tasks, complete_task, update_task, delete_task, get_current_user)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Technology Stack Compliance

✅ **AI Provider**: Cohere API (command-r-plus model) - COMPLIANT
✅ **Frontend UI**: OpenAI ChatKit components - COMPLIANT
✅ **MCP Server**: Official MCP SDK (Python) - COMPLIANT
✅ **Architecture**: Stateless chat endpoint with database persistence - COMPLIANT
✅ **Endpoint**: Single `/api/{user_id}/chat` - COMPLIANT
✅ **Authentication**: JWT for user_id extraction - COMPLIANT
✅ **Database**: Extends existing Neon PostgreSQL - COMPLIANT
✅ **Environment**: COHERE_API_KEY, BETTER_AUTH_SECRET, DATABASE_URL - COMPLIANT

### Spec-Driven Development

✅ **Specification**: Complete spec.md with 6 user stories, 25 functional requirements, 12 success criteria
✅ **No Manual Coding**: All implementation via Claude Code agents
✅ **Test-First**: Tests defined in spec, will be written before implementation

### Clean Code & Simplicity

✅ **No Over-Engineering**: Implements only specified features
✅ **Smallest Viable Diff**: Extends existing backend/frontend without refactoring unrelated code
✅ **Clear Naming**: Tool names follow verb_noun pattern (add_task, list_tasks, etc.)

### Security & Privacy

✅ **JWT Authentication**: All chat requests require valid JWT
✅ **User Isolation**: Database queries filter by user_id from JWT
✅ **Input Validation**: User inputs sanitized to prevent XSS/injection
✅ **Rate Limiting**: 60 requests/minute per user
✅ **API Key Security**: COHERE_API_KEY in environment, never exposed to frontend

**GATE STATUS**: ✅ PASSED - All constitutional requirements met

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-chatbot/
├── spec.md                    # Feature specification (complete)
├── plan.md                    # This file (/sp.plan command output)
├── research.md                # Phase 0 output (architectural decisions)
├── data-model.md              # Phase 1 output (database schema)
├── quickstart.md              # Phase 1 output (setup instructions)
├── contracts/                 # Phase 1 output (API contracts)
│   ├── chat-endpoint.yaml    # OpenAPI spec for /api/{user_id}/chat
│   └── mcp-tools.yaml        # MCP tool definitions
├── checklists/
│   └── requirements.md       # Spec quality checklist (complete)
└── tasks.md                   # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── conversation.py          # NEW: Conversation SQLModel
│   │   ├── message.py               # NEW: Message SQLModel
│   │   └── task.py                  # EXISTING: Task model (no changes)
│   ├── services/
│   │   ├── cohere_service.py        # NEW: Cohere API client wrapper
│   │   ├── chat_service.py          # NEW: Chat orchestration logic
│   │   └── task_service.py          # EXISTING: Task CRUD (no changes)
│   ├── mcp_server/
│   │   ├── __init__.py              # NEW: MCP server initialization
│   │   ├── tools.py                 # NEW: 6 MCP tool definitions
│   │   └── executor.py              # NEW: Tool execution logic
│   ├── routes/
│   │   ├── chat.py                  # NEW: POST /api/{user_id}/chat endpoint
│   │   └── tasks.py                 # EXISTING: Task endpoints (no changes)
│   ├── middleware/
│   │   └── auth.py                  # EXISTING: JWT validation (extend for chat)
│   └── database.py                  # EXISTING: DB connection (extend for new models)
└── tests/
    ├── unit/
    │   ├── test_cohere_service.py   # NEW: Cohere service tests
    │   ├── test_chat_service.py     # NEW: Chat service tests
    │   └── test_mcp_tools.py        # NEW: MCP tool tests
    ├── integration/
    │   └── test_chat_endpoint.py    # NEW: Chat endpoint integration tests
    └── e2e/
        └── test_chat_flows.py       # NEW: End-to-end chat scenarios

frontend/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatButton.tsx       # NEW: Floating chatbot button
│   │   │   ├── ChatPanel.tsx        # NEW: Glassmorphic chat panel
│   │   │   ├── MessageBubble.tsx    # NEW: User/assistant message display
│   │   │   ├── MessageInput.tsx     # NEW: Text input with send button
│   │   │   └── TypingIndicator.tsx  # NEW: Animated typing dots
│   │   └── tasks/                   # EXISTING: Task UI components (no changes)
│   ├── services/
│   │   ├── chatService.ts           # NEW: Chat API client
│   │   └── taskService.ts           # EXISTING: Task API client (no changes)
│   ├── hooks/
│   │   ├── useChat.ts               # NEW: Chat state management hook
│   │   └── useTasks.ts              # EXISTING: Task state hook (no changes)
│   ├── types/
│   │   ├── chat.ts                  # NEW: Chat TypeScript types
│   │   └── task.ts                  # EXISTING: Task types (no changes)
│   └── app/
│       └── (authenticated)/
│           └── layout.tsx           # MODIFY: Add ChatButton to layout
└── tests/
    ├── components/
    │   └── chat/                    # NEW: Chat component tests
    └── integration/
        └── chat.test.tsx            # NEW: Chat integration tests
```

**Structure Decision**: Web application (Option 2) with backend/ and frontend/ directories. This feature extends the existing monorepo structure by adding new chat-related modules to both backend and frontend without modifying existing task management code. The separation ensures clean boundaries and allows independent testing of chat functionality.

## Complexity Tracking

> **No violations detected - this section is empty**

All architectural decisions comply with Phase III constitutional requirements. No complexity justifications needed.

## Phase 0: Research & Architectural Decisions

### Decision 1: Cohere Model Selection

**Decision**: Use `command-r-plus` model

**Rationale**:
- Superior reasoning capabilities for complex natural language understanding
- Better tool-use accuracy (critical for reliable task operations)
- Handles multi-step queries more reliably
- Slightly higher latency acceptable for quality gains

**Alternatives Considered**:
- `command-r`: Faster but less accurate for complex queries
- `command-r-plus` chosen for flagship quality over speed

**Impact**: All Cohere API calls will use `command-r-plus` model parameter

---

### Decision 2: Tool Call Parsing Strategy

**Decision**: Strict JSON block extraction with validation

**Rationale**:
- Ensures reliable tool invocation (no ambiguous parsing)
- Cohere can be prompted to output structured JSON in code blocks
- Validation catches malformed responses early
- Cleaner error handling and debugging

**Alternatives Considered**:
- Regex fallback: More forgiving but error-prone
- Strict parsing chosen for reliability and maintainability

**Implementation**:
```python
# Prompt Cohere to output tool calls as:
# ```json
# {"tool": "add_task", "params": {"title": "Buy groceries", "user_email": "user@example.com"}}
# ```
# Parse with json.loads() after extracting code block
```

---

### Decision 3: Multi-Step Operation Chaining

**Decision**: Iterative loop - execute tools and feed results back to Cohere until final response

**Rationale**:
- Enables complex queries like "List pending tasks then delete the first one"
- Cohere can reason about tool results and decide next action
- More intelligent than single-pass execution
- Aligns with agent-style behavior

**Alternatives Considered**:
- Single Cohere call: Simpler but can't handle multi-step queries
- Loop chosen for intelligence and user experience

**Implementation Flow**:
1. User sends message
2. Call Cohere with message + history + tool definitions
3. If response contains tool call → execute tool → feed result back to Cohere (goto step 2)
4. If response is final text → return to user
5. Max iterations: 5 (prevent infinite loops)

---

### Decision 4: Conversation Persistence Strategy

**Decision**: Optional conversation_id - create new if not provided, support resuming via ID

**Rationale**:
- Flexibility: Users can start fresh or continue existing conversations
- Simplicity: Frontend doesn't need to manage conversation IDs initially
- Scalability: Supports multiple conversations per user in future

**Alternatives Considered**:
- Single conversation per user: Too restrictive
- Always new conversation: Loses context unnecessarily
- Optional chosen for best user experience

**Implementation**:
- Request body: `{conversation_id?: string, message: string}`
- If conversation_id missing → create new Conversation record
- If conversation_id provided → validate ownership and load history

---

### Decision 5: Frontend Chat Panel Layout

**Decision**: Slide-in panel from bottom-right with glassmorphic card

**Rationale**:
- Premium aesthetic matches flagship UI design
- Non-intrusive (doesn't block main content)
- Familiar pattern (similar to support chat widgets)
- Responsive (full-screen on mobile)

**Alternatives Considered**:
- Full bottom sheet: Too intrusive on desktop
- Side panel: Conflicts with potential sidebar navigation
- Bottom-right slide-in chosen for elegance and usability

**Specifications**:
- Desktop: 400px × 600px, fixed bottom-right, 24px margins
- Mobile: Full-screen overlay with slide-up animation
- Glassmorphic: backdrop-blur, semi-transparent background, subtle shadow

---

### Decision 6: Message Rendering Strategy

**Decision**: Plain text with markdown support for formatting

**Rationale**:
- Simple and secure (no XSS risk with proper sanitization)
- Markdown allows basic formatting (bold, lists, code blocks)
- Cohere can output markdown naturally
- Lightweight rendering (no heavy rich-text editor)

**Alternatives Considered**:
- Rich HTML: Security risk, over-engineered
- Plain text only: Too limiting for formatted responses
- Markdown chosen for balance of simplicity and expressiveness

**Implementation**:
- Use markdown-to-jsx or react-markdown library
- Sanitize output to prevent XSS
- Support: **bold**, *italic*, `code`, lists, links

---

### Decision 7: Error Handling & Retry Strategy

**Decision**: Single automatic retry for Cohere API failures, then graceful error message

**Rationale**:
- Handles transient network issues
- Avoids user frustration from temporary failures
- Single retry prevents excessive latency
- Clear error messages maintain trust

**Implementation**:
- Catch Cohere API exceptions
- Retry once with exponential backoff (1 second)
- If still fails → return user-friendly error: "I'm having trouble connecting. Please try again."
- Log detailed errors server-side for debugging

---

### Decision 8: Rate Limiting Implementation

**Decision**: Token bucket algorithm with 60 requests/minute per user

**Rationale**:
- Prevents abuse and excessive Cohere API costs
- 60 req/min = 1 per second average (reasonable for chat)
- Token bucket allows bursts (better UX than fixed window)
- Per-user isolation prevents one user affecting others

**Implementation**:
- Use FastAPI middleware with redis or in-memory cache
- Key: `rate_limit:{user_id}`
- Bucket size: 60 tokens
- Refill rate: 1 token/second
- Return 429 Too Many Requests if exceeded

---

### Decision 9: Conversation History Context Window

**Decision**: Load most recent 50 messages for Cohere context

**Rationale**:
- Balances context quality with API token limits
- 50 messages ≈ 10-15 exchanges (sufficient for most conversations)
- Prevents excessive token usage and latency
- Older messages unlikely to be relevant

**Implementation**:
- Query: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 50`
- Reverse order before sending to Cohere (chronological)
- Include in Cohere chat history parameter

---

### Decision 10: Tool Parameter Validation

**Decision**: Strict validation with Pydantic models for all tool parameters

**Rationale**:
- Type safety prevents runtime errors
- Clear error messages for invalid parameters
- Automatic validation with FastAPI/Pydantic
- Self-documenting code

**Implementation**:
```python
from pydantic import BaseModel, Field

class AddTaskParams(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    user_email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")

# Tool executor validates params before execution
```

## Phase 1: Data Model & Contracts

### Database Schema (data-model.md)

**New Tables**:

**Conversation**
- `id`: UUID (primary key)
- `user_id`: String (foreign key to users table, indexed)
- `created_at`: Timestamp (default: now)
- `updated_at`: Timestamp (default: now, auto-update)

**Indexes**: `idx_conversation_user_id` on `user_id`

**Message**
- `id`: UUID (primary key)
- `conversation_id`: UUID (foreign key to conversations, indexed)
- `role`: Enum('user', 'assistant')
- `content`: Text (message content)
- `tool_calls`: JSONB (nullable, stores tool invocation details)
- `created_at`: Timestamp (default: now)

**Indexes**:
- `idx_message_conversation_id` on `conversation_id`
- `idx_message_created_at` on `created_at` (for chronological ordering)

**Relationships**:
- Conversation → User (many-to-one)
- Message → Conversation (many-to-one)

**Existing Tables** (no changes):
- Task: Existing schema unchanged, accessed via MCP tools

---

### API Contracts (contracts/)

**Chat Endpoint** (`contracts/chat-endpoint.yaml`):

```yaml
openapi: 3.0.0
info:
  title: AI Chatbot API
  version: 1.0.0

paths:
  /api/{user_id}/chat:
    post:
      summary: Send message to AI chatbot
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                conversation_id:
                  type: string
                  format: uuid
                  description: Optional - resume existing conversation
                message:
                  type: string
                  minLength: 1
                  maxLength: 500
              required:
                - message
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  conversation_id:
                    type: string
                    format: uuid
                  response:
                    type: string
                  tool_calls:
                    type: array
                    items:
                      type: object
                      properties:
                        tool:
                          type: string
                        params:
                          type: object
                        result:
                          type: object
        '401':
          description: Unauthorized - invalid JWT
        '429':
          description: Too Many Requests - rate limit exceeded
        '500':
          description: Internal server error
      security:
        - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

**MCP Tools** (`contracts/mcp-tools.yaml`):

```yaml
tools:
  - name: add_task
    description: Create a new task for the user
    parameters:
      type: object
      properties:
        title:
          type: string
          description: Task title
        user_email:
          type: string
          description: User email from JWT
      required:
        - title
        - user_email
    returns:
      type: object
      properties:
        status:
          type: string
          enum: [success, error]
        task_id:
          type: string
        message:
          type: string

  - name: list_tasks
    description: List all tasks for the user
    parameters:
      type: object
      properties:
        user_email:
          type: string
        status:
          type: string
          enum: [pending, completed, all]
          default: all
      required:
        - user_email
    returns:
      type: object
      properties:
        status:
          type: string
        tasks:
          type: array
          items:
            type: object
        count:
          type: integer

  - name: complete_task
    description: Mark a task as completed
    parameters:
      type: object
      properties:
        task_id:
          type: string
        user_email:
          type: string
      required:
        - task_id
        - user_email
    returns:
      type: object
      properties:
        status:
          type: string
        message:
          type: string

  - name: update_task
    description: Update a task's title
    parameters:
      type: object
      properties:
        task_id:
          type: string
        title:
          type: string
        user_email:
          type: string
      required:
        - task_id
        - title
        - user_email
    returns:
      type: object
      properties:
        status:
          type: string
        message:
          type: string

  - name: delete_task
    description: Delete a task
    parameters:
      type: object
      properties:
        task_id:
          type: string
        user_email:
          type: string
      required:
        - task_id
        - user_email
    returns:
      type: object
      properties:
        status:
          type: string
        message:
          type: string

  - name: get_current_user
    description: Get current user information
    parameters:
      type: object
      properties:
        user_email:
          type: string
      required:
        - user_email
    returns:
      type: object
      properties:
        email:
          type: string
        user_id:
          type: string
```

---

### Quickstart Guide (quickstart.md)

**Prerequisites**:
- Existing Phase II application running (Next.js frontend + FastAPI backend)
- Cohere API key (sign up at cohere.com)
- Python 3.13+ and Node.js 18+

**Backend Setup**:
1. Install dependencies: `pip install cohere mcp`
2. Add to `.env`: `COHERE_API_KEY=your_key_here`
3. Run migrations: `alembic upgrade head` (creates Conversation and Message tables)
4. Start backend: `uvicorn main:app --reload`

**Frontend Setup**:
1. Install dependencies: `npm install @openai/chatkit`
2. Start frontend: `npm run dev`
3. Navigate to app - chatbot button appears bottom-right

**Testing the Chatbot**:
1. Click floating chat button (emerald circle, bottom-right)
2. Type: "Add task: Buy groceries"
3. Verify task appears in main task list
4. Type: "Show my tasks"
5. Verify chatbot lists all tasks

**Troubleshooting**:
- If chatbot doesn't respond: Check COHERE_API_KEY in backend logs
- If tasks don't appear: Verify JWT token is valid
- If rate limited: Wait 60 seconds and try again

## Phase 2: Implementation Sequence

**Phase 2 is handled by `/sp.tasks` command - NOT created by `/sp.plan`**

The tasks.md file will be generated by running `/sp.tasks` after this plan is approved. It will break down the implementation into:
- Phase 1: Database migrations (Conversation, Message tables)
- Phase 2: MCP tools implementation (6 tools)
- Phase 3: Backend chat service (Cohere integration, tool execution loop)
- Phase 4: Backend chat endpoint (POST /api/{user_id}/chat)
- Phase 5: Frontend chat UI (ChatButton, ChatPanel, MessageBubble, etc.)
- Phase 6: Integration testing (E2E chat flows)

## Architectural Decision Records (ADRs)

📋 **Architectural decisions detected**:

1. **Cohere Model Selection (command-r-plus vs command-r)**
   - Impact: Long-term AI quality and cost
   - Alternatives: command-r (faster, cheaper) vs command-r-plus (smarter, more expensive)
   - Scope: Affects all chat interactions

2. **Multi-Step Tool Chaining Strategy**
   - Impact: Chatbot intelligence and user experience
   - Alternatives: Single-pass vs iterative loop
   - Scope: Core chat orchestration logic

3. **Conversation Persistence Model**
   - Impact: Data model and user experience
   - Alternatives: Single conversation per user vs multiple conversations
   - Scope: Database schema and API design

**Recommendation**: Document these decisions with `/sp.adr "Phase III Chatbot Architecture Decisions"` after plan approval.

## Next Steps

1. **Review this plan** - Ensure all architectural decisions align with project goals
2. **Approve plan** - Confirm readiness to proceed with implementation
3. **Run `/sp.tasks`** - Generate detailed task breakdown with test cases
4. **Create ADR** (optional) - Document architectural decisions for future reference
5. **Begin implementation** - Execute tasks using specialized agents (Database Engineer, Backend Engineer, Frontend Engineer)

## Success Criteria Alignment

This plan ensures all 12 success criteria from spec.md are achievable:

✅ SC-001: Task creation <10 seconds (optimized Cohere calls + async DB)
✅ SC-002: Query results <2 seconds (efficient DB queries + caching)
✅ SC-003: 95% NLU accuracy (command-r-plus model + strict parsing)
✅ SC-004: Full workflow via chat (all 6 tools implemented)
✅ SC-005: History load <1 second (indexed queries + pagination)
✅ SC-006: Context across 10+ exchanges (50-message history window)
✅ SC-007: Zero data leakage (JWT validation + user_id filtering)
✅ SC-008: 100 concurrent users (async FastAPI + connection pooling)
✅ SC-009: 90% first-interaction success (clear error messages + examples)
✅ SC-010: Mobile responsive (full-screen overlay <768px)
✅ SC-011: Clear error messages (user-friendly text + retry logic)
✅ SC-012: 80% multi-step success (iterative tool execution loop)

---

**Plan Status**: ✅ COMPLETE - Ready for `/sp.tasks` phase
**Estimated Complexity**: Medium-High (new AI integration, but well-defined scope)
**Risk Level**: Low (proven technologies, clear requirements, constitutional compliance)
