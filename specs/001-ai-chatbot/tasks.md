---
description: "Task breakdown for AI Todo Chatbot Integration"
---

# Tasks: AI Todo Chatbot Integration

**Feature**: 001-ai-chatbot
**Input**: Design documents from `/specs/001-ai-chatbot/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded. Focus is on implementation and manual validation per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with:
- Backend: `backend/src/`
- Frontend: `frontend/src/`
- Tests: `backend/tests/` and `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Verify existing project structure matches plan.md (backend/ and frontend/ directories)
- [x] T002 [P] Install backend dependencies: cohere, mcp, asyncpg in backend/requirements.txt
- [x] T003 [P] Install frontend dependencies: @openai/chatkit, react-markdown, dompurify in frontend/package.json
- [x] T004 Add COHERE_API_KEY to backend/.env file per quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Layer

- [x] T005 [P] Create Conversation SQLModel in backend/src/models/conversation.py per data-model.md
- [x] T006 [P] Create Message SQLModel in backend/src/models/message.py per data-model.md
- [x] T007 Create Alembic migration for conversations and messages tables in backend/alembic/versions/
- [x] T008 Run migration and verify tables exist per quickstart.md Step 3

### MCP Server & Tools

- [x] T009 [P] Create MCP server initialization in backend/src/mcp_server/__init__.py
- [x] T010 [P] Implement add_task tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T011 [P] Implement list_tasks tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T012 [P] Implement complete_task tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T013 [P] Implement update_task tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T014 [P] Implement delete_task tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T015 [P] Implement get_current_user tool in backend/src/mcp_server/tools.py per contracts/mcp-tools.yaml
- [x] T016 Create tool executor with Pydantic validation in backend/src/mcp_server/executor.py per research.md Decision 10

### AI & Chat Services

- [x] T017 [P] Create Cohere service wrapper in backend/src/services/cohere_service.py per research.md Decision 1
- [x] T018 Implement chat orchestration service in backend/src/services/chat_service.py with iterative tool execution loop per research.md Decision 3
- [x] T019 Add JSON tool call parsing with strict validation in backend/src/services/chat_service.py per research.md Decision 2
- [x] T020 Implement conversation history loading (50 messages) in backend/src/services/chat_service.py per research.md Decision 9
- [x] T021 Add retry logic for Cohere API failures in backend/src/services/cohere_service.py per research.md Decision 7

### Middleware & Security

- [x] T022 [P] Extend JWT authentication middleware for chat endpoint in backend/src/middleware/auth.py
- [x] T023 [P] Implement rate limiting middleware (60 req/min per user) in backend/src/middleware/rate_limit.py per research.md Decision 8

### API Endpoint

- [x] T024 Create POST /api/{user_id}/chat endpoint in backend/src/routes/chat.py per contracts/chat-endpoint.yaml
- [x] T025 Add conversation_id validation and ownership check in backend/src/routes/chat.py per research.md Decision 4
- [x] T026 Integrate chat service with endpoint and handle errors in backend/src/routes/chat.py
- [x] T027 Register chat route in backend/src/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Language Task Creation (Priority: P1) 🎯 MVP

**Goal**: Enable users to create tasks using natural language through a chat interface

**Independent Test**: Type "Add task: Buy groceries" in chat and verify task appears in task list (per quickstart.md Test 1)

**Why MVP**: This is the core value proposition - conversational task management. All other stories build on this foundation.

### Frontend Chat UI Components

- [x] T028 [P] [US1] Create ChatButton component in frontend/src/components/chat/ChatButton.tsx with floating button and pulse animation per spec.md UI/UX Requirements
- [x] T029 [P] [US1] Create ChatPanel component in frontend/src/components/chat/ChatPanel.tsx with glassmorphic design per research.md Decision 5
- [x] T030 [P] [US1] Create MessageBubble component in frontend/src/components/chat/MessageBubble.tsx with markdown rendering per research.md Decision 6
- [x] T031 [P] [US1] Create MessageInput component in frontend/src/components/chat/MessageInput.tsx with 500 char limit and Enter to send
- [x] T032 [P] [US1] Create TypingIndicator component in frontend/src/components/chat/TypingIndicator.tsx with animated dots

### Frontend Services & Hooks

- [x] T033 [P] [US1] Create chat TypeScript types in frontend/src/types/chat.ts for Conversation, Message, ChatRequest, ChatResponse
- [x] T034 [US1] Implement chatService API client in frontend/src/services/chatService.ts with POST /api/{user_id}/chat
- [x] T035 [US1] Create useChat hook in frontend/src/hooks/useChat.ts for state management (messages, loading, send)

### Frontend Integration

- [x] T036 [US1] Add ChatButton to authenticated layout in frontend/src/app/(authenticated)/layout.tsx
- [x] T037 [US1] Wire up ChatPanel with useChat hook and handle conversation_id persistence
- [x] T038 [US1] Add auto-scroll to latest message in ChatPanel component
- [x] T039 [US1] Add responsive behavior (full-screen on mobile <768px) in ChatPanel component

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create tasks via chat

---

## Phase 4: User Story 2 - Conversational Task Querying (Priority: P1)

**Goal**: Enable users to query their tasks using natural language

**Independent Test**: Type "Show my tasks" and verify chatbot returns accurate task list (per quickstart.md Test 2)

**Implementation Note**: This story is already enabled by the list_tasks MCP tool (T011) and chat endpoint (T024). No additional implementation needed.

### Validation Tasks

- [x] T040 [US2] Verify "Show my tasks" query works per quickstart.md Test 2
- [x] T041 [US2] Verify "What tasks are pending?" query filters correctly per spec.md User Story 2 Scenario 2
- [x] T042 [US2] Verify "What have I finished?" query shows completed tasks per spec.md User Story 2 Scenario 3
- [x] T043 [US2] Verify empty task list response per spec.md User Story 2 Scenario 4

**Checkpoint**: User Stories 1 AND 2 are both functional - create and query tasks via chat

---

## Phase 5: User Story 3 - Task Status Management via Chat (Priority: P2)

**Goal**: Enable users to mark tasks complete or update them through conversation

**Independent Test**: Create a task, then type "Mark 'Buy groceries' as done" and verify status changes (per quickstart.md Test 3)

**Implementation Note**: This story is already enabled by complete_task (T012) and update_task (T013) MCP tools. No additional implementation needed.

### Validation Tasks

- [x] T044 [US3] Verify "Mark 'Buy groceries' as complete" works per quickstart.md Test 3
- [x] T045 [US3] Verify task completion by ID works per spec.md User Story 3 Scenario 2
- [x] T046 [US3] Verify task title update works per spec.md User Story 3 Scenario 3
- [x] T047 [US3] Verify bulk completion confirmation prompt per spec.md User Story 3 Scenario 4

**Checkpoint**: User Stories 1, 2, AND 3 are functional - full CRUD except delete

---

## Phase 6: User Story 6 - Multi-Step Task Operations (Priority: P2)

**Goal**: Enable users to perform multiple operations in a single request

**Independent Test**: Type "Add 'Weekly meeting' and show my pending tasks" and verify both operations complete (per quickstart.md Test 5)

**Implementation Note**: This story is already enabled by the iterative tool execution loop (T018). No additional implementation needed.

### Validation Tasks

- [x] T048 [US6] Verify "Add task and show my list" multi-step query per quickstart.md Test 5
- [x] T049 [US6] Verify "Mark as done and delete" chained operations per spec.md User Story 6 Scenario 2
- [x] T050 [US6] Verify 3+ operation chains execute in logical order per spec.md User Story 6 Scenario 3
- [x] T051 [US6] Verify max 5 iterations prevents infinite loops per research.md Decision 3

**Checkpoint**: User Stories 1, 2, 3, AND 6 are functional - intelligent multi-step operations work

---

## Phase 7: User Story 4 - Task Deletion via Chat (Priority: P3)

**Goal**: Enable users to delete tasks through conversation

**Independent Test**: Create a task, then type "Delete 'Buy groceries'" and verify task is removed (per spec.md User Story 4)

**Implementation Note**: This story is already enabled by the delete_task MCP tool (T014). No additional implementation needed.

### Validation Tasks

- [x] T052 [US4] Verify "Delete 'Buy groceries'" prompts for confirmation per spec.md User Story 4 Scenario 1
- [x] T053 [US4] Verify deletion by task ID works per spec.md User Story 4 Scenario 3
- [x] T054 [US4] Verify "Delete all tasks" requires explicit confirmation per spec.md User Story 4 Scenario 4

**Checkpoint**: User Stories 1-4 and 6 are functional - full CRUD operations via chat

---

## Phase 8: User Story 5 - User Identity Queries (Priority: P3)

**Goal**: Enable users to query their identity for verification

**Independent Test**: Type "Who am I?" and verify chatbot responds with logged-in user's email (per quickstart.md Test 4)

**Implementation Note**: This story is already enabled by the get_current_user MCP tool (T015). No additional implementation needed.

### Validation Tasks

- [x] T055 [US5] Verify "Who am I?" query returns user email per quickstart.md Test 4
- [x] T056 [US5] Verify "What's my email?" query works per spec.md User Story 5 Scenario 2
- [x] T057 [US5] Verify "Show my account info" query works per spec.md User Story 5 Scenario 3

**Checkpoint**: All 6 user stories are functional - complete feature implementation

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

### Error Handling & Edge Cases

- [x] T058 [P] Verify ambiguous input handling per spec.md Edge Cases (empty task title prompts for clarification)
- [x] T059 [P] Verify non-existent task error messages per quickstart.md Test 1 (Error Handling)
- [x] T060 [P] Verify rate limiting (61st request returns 429) per quickstart.md Test 3 (Error Handling)
- [x] T061 [P] Verify JWT expiration handling per spec.md Edge Cases (session timeout)
- [x] T062 [P] Verify network failure retry logic per research.md Decision 7

### Performance & Security

- [x] T063 [P] Verify chat response latency <2 seconds for 95% of requests per plan.md Performance Goals
- [x] T064 [P] Verify conversation history loads <1 second per plan.md Performance Goals
- [x] T065 [P] Verify user isolation (no cross-user data leakage) per spec.md Security & Privacy
- [x] T066 [P] Verify input sanitization prevents XSS per spec.md Security & Privacy
- [x] T067 [P] Test with 100 concurrent users per plan.md Performance Goals

### Documentation & Cleanup

- [x] T068 [P] Run through complete quickstart.md validation end-to-end
- [x] T069 [P] Verify all environment variables documented in quickstart.md
- [x] T070 [P] Add inline code comments for complex logic (tool parsing, iterative loop)
- [x] T071 [P] Update main README.md with chatbot feature description
- [x] T072 Code cleanup: remove debug logs, unused imports, commented code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Stories 2-6 (Phases 4-8)**: All depend on Foundational phase completion
  - Can proceed in parallel after Phase 2
  - Or sequentially in priority order (US1 → US2 → US6 → US3 → US4 → US5)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Requires Foundational phase - No dependencies on other stories
- **US2 (P1)**: Requires Foundational phase - No dependencies on other stories (independent)
- **US3 (P2)**: Requires Foundational phase - No dependencies on other stories (independent)
- **US4 (P3)**: Requires Foundational phase - No dependencies on other stories (independent)
- **US5 (P3)**: Requires Foundational phase - No dependencies on other stories (independent)
- **US6 (P2)**: Requires Foundational phase - No dependencies on other stories (independent)

### Within Each Phase

**Phase 2 (Foundational)**:
- Database models (T005-T006) before migration (T007)
- Migration (T007) before running it (T008)
- MCP tools (T010-T015) can run in parallel
- Cohere service (T017) before chat service (T018)
- Chat service (T018) depends on tool executor (T016)
- Middleware (T022-T023) can run in parallel
- Endpoint (T024) depends on chat service (T018) and middleware (T022-T023)

**Phase 3 (US1)**:
- UI components (T028-T032) can run in parallel
- Types (T033) before service (T034) and hook (T035)
- Service (T034) before hook (T035)
- Hook (T035) before integration (T036-T039)

### Parallel Opportunities

**Phase 1 (Setup)**: T002 and T003 can run in parallel (different projects)

**Phase 2 (Foundational)**:
- T005 and T006 (different model files)
- T010, T011, T012, T013, T014, T015 (different tools in same file, but logically independent)
- T022 and T023 (different middleware files)

**Phase 3 (US1)**:
- T028, T029, T030, T031, T032 (different component files)
- T033 (types file, no dependencies)

**Phase 9 (Polish)**:
- T058, T059, T060, T061, T062 (different edge cases)
- T063, T064, T065, T066, T067 (different performance/security checks)
- T068, T069, T070, T071, T072 (different documentation/cleanup tasks)

---

## Parallel Example: Foundational Phase (Phase 2)

```bash
# Launch all MCP tools together:
Task: "Implement add_task tool in backend/src/mcp_server/tools.py"
Task: "Implement list_tasks tool in backend/src/mcp_server/tools.py"
Task: "Implement complete_task tool in backend/src/mcp_server/tools.py"
Task: "Implement update_task tool in backend/src/mcp_server/tools.py"
Task: "Implement delete_task tool in backend/src/mcp_server/tools.py"
Task: "Implement get_current_user tool in backend/src/mcp_server/tools.py"

# Launch all middleware together:
Task: "Extend JWT authentication middleware in backend/src/middleware/auth.py"
Task: "Implement rate limiting middleware in backend/src/middleware/rate_limit.py"
```

---

## Parallel Example: User Story 1 (Phase 3)

```bash
# Launch all UI components together:
Task: "Create ChatButton component in frontend/src/components/chat/ChatButton.tsx"
Task: "Create ChatPanel component in frontend/src/components/chat/ChatPanel.tsx"
Task: "Create MessageBubble component in frontend/src/components/chat/MessageBubble.tsx"
Task: "Create MessageInput component in frontend/src/components/chat/MessageInput.tsx"
Task: "Create TypingIndicator component in frontend/src/components/chat/TypingIndicator.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T027) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T028-T039)
4. **STOP and VALIDATE**: Test task creation via chat per quickstart.md
5. Deploy/demo if ready - users can now create tasks conversationally

**Estimated Tasks for MVP**: 39 tasks (Phases 1-3)

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Foundational → Backend ready, no UI yet
2. **MVP** (Phase 3): Add US1 → Test independently → Deploy/Demo (task creation via chat)
3. **Query** (Phase 4): Add US2 → Test independently → Deploy/Demo (task creation + querying)
4. **Management** (Phase 5): Add US3 → Test independently → Deploy/Demo (+ status management)
5. **Intelligence** (Phase 6): Add US6 → Test independently → Deploy/Demo (+ multi-step operations)
6. **Deletion** (Phase 7): Add US4 → Test independently → Deploy/Demo (+ task deletion)
7. **Identity** (Phase 8): Add US5 → Test independently → Deploy/Demo (+ user identity queries)
8. **Polish** (Phase 9): Final validation and cleanup → Production ready

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phases 1-2)
2. **Once Foundational is done, split work**:
   - Developer A: User Story 1 (Phase 3) - Frontend UI
   - Developer B: User Stories 2-6 validation (Phases 4-8) - Backend testing
   - Developer C: Polish & edge cases (Phase 9) - Quality assurance
3. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 72
- **Setup**: 4 tasks
- **Foundational**: 23 tasks (BLOCKS all user stories)
- **User Story 1 (P1)**: 12 tasks (MVP)
- **User Story 2 (P1)**: 4 tasks (validation only)
- **User Story 3 (P2)**: 4 tasks (validation only)
- **User Story 6 (P2)**: 4 tasks (validation only)
- **User Story 4 (P3)**: 3 tasks (validation only)
- **User Story 5 (P3)**: 3 tasks (validation only)
- **Polish**: 15 tasks

**MVP Scope** (Phases 1-3): 39 tasks
**Full Feature** (All Phases): 72 tasks

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel within their phases

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are excluded per specification (not explicitly requested)
- Validation tasks (T040-T057) ensure each story works per quickstart.md
- All file paths follow web app structure (backend/ and frontend/)
