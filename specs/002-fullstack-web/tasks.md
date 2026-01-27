# Tasks: Full-Stack Todo Web Application

**Input**: Design documents from `/specs/002-fullstack-web/`
**Prerequisites**: spec.md, plan.md, data-model.md, research.md, contracts/api-openapi.yaml
**Branch**: `002-fullstack-web-app`
**Date**: 2025-12-28

**Tests**: Not explicitly requested - tests are OPTIONAL. Implementation focuses on functionality first.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Includes exact file paths in descriptions

## User Story Summary

| ID | Story | Priority | Backend | Frontend |
|----|-------|----------|---------|----------|
| US1 | User Registration and Login | P1 | JWT middleware | Auth pages + Better Auth |
| US2 | View Task List | P1 | GET /api/{user_id}/tasks | TaskList component |
| US3 | Add New Task | P1 | POST /api/{user_id}/tasks | TaskForm component |
| US4 | Mark Task Complete | P2 | PATCH /api/{user_id}/tasks/{id}/complete | Toggle button |
| US5 | Update Task | P2 | PUT /api/{user_id}/tasks/{id} | Edit modal |
| US6 | Delete Task | P2 | DELETE /api/{user_id}/tasks/{id} | Delete confirmation |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per plan.md: backend/app/{models,schemas,routers,services,middleware}
- [x] T002 Create frontend directory structure per plan.md: frontend/src/{app,components,lib,types}
- [x] T003 [P] Initialize backend Python project with pyproject.toml in backend/
- [x] T004 [P] Initialize frontend Next.js 16+ project with TypeScript in frontend/
- [x] T005 [P] Create backend/requirements.txt with dependencies: fastapi, uvicorn, sqlmodel, asyncpg, python-jose, pydantic-settings
- [x] T006 [P] Create frontend/package.json with dependencies: next, react, tailwindcss, better-auth
- [x] T007 [P] Configure Tailwind CSS in frontend/tailwind.config.ts
- [x] T008 [P] Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [x] T009 [P] Create frontend/.env.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET

**Checkpoint**: Project structure ready - configuration can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [x] T010 Create backend/app/config.py with Pydantic Settings for DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [x] T011 Create backend/app/database.py with async SQLModel engine for Neon PostgreSQL (per neon-db-setup skill)
- [x] T012 Create backend/app/models/__init__.py and backend/app/models/task.py with Task SQLModel (from data-model.md)
- [x] T013 Create backend/app/schemas/__init__.py and backend/app/schemas/task.py with TaskCreate, TaskUpdate, TaskRead
- [x] T014 Create backend/app/middleware/__init__.py and backend/app/middleware/auth.py with JWT verification (per jwt-middleware skill)
- [x] T015 Create backend/app/main.py with FastAPI app, CORS middleware (per cors-config skill), and health endpoint
- [x] T016 Create backend/app/__init__.py for module initialization

### Frontend Foundation

- [x] T017 [P] Create frontend/src/types/task.ts with Task, CreateTaskInput, UpdateTaskInput interfaces (from data-model.md)
- [x] T018 [P] Create frontend/src/lib/api.ts with fetchWithAuth wrapper and API client (from research.md R4)
- [x] T019 [P] Create frontend/src/lib/auth.ts with Better Auth client configuration
- [x] T020 [P] Create frontend/src/app/layout.tsx with root layout, providers, global styles
- [x] T021 [P] Create base UI components: frontend/src/components/ui/Button.tsx
- [x] T022 [P] Create base UI components: frontend/src/components/ui/Input.tsx
- [x] T023 [P] Create base UI components: frontend/src/components/ui/Card.tsx

### Database Setup

- [x] T024 Create database initialization script in backend/app/database.py init_db() function
- [x] T025 Add startup event in backend/app/main.py to call init_db() on application start

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Registration and Login (Priority: P1) 🎯 MVP

**Goal**: Allow users to create accounts and authenticate to access their personal todo list

**Independent Test**: Create an account, log out, log back in - verifies secure user identity management

### Backend Implementation for US1

- [x] T026 [US1] Add verify_token dependency in backend/app/middleware/auth.py that extracts user_id from JWT
- [x] T027 [US1] Add verify_user_access helper in backend/app/middleware/auth.py that validates user_id in URL matches token

### Frontend Implementation for US1

- [x] T028 [P] [US1] Create frontend/src/components/auth/LoginForm.tsx with email/password inputs and submit handler
- [x] T029 [P] [US1] Create frontend/src/components/auth/RegisterForm.tsx with email/password/confirm inputs and validation
- [x] T030 [US1] Create frontend/src/app/(auth)/login/page.tsx with LoginForm and link to register
- [x] T031 [US1] Create frontend/src/app/(auth)/register/page.tsx with RegisterForm and link to login
- [x] T032 [US1] Create frontend/src/app/dashboard/layout.tsx with authentication check (redirect to /login if not authenticated)
- [x] T033 [US1] Create frontend/src/app/page.tsx with redirect logic (to /dashboard if authenticated, /login if not)
- [x] T034 [US1] Add logout functionality to dashboard layout header

**Checkpoint**: User Story 1 complete - users can register, login, and logout

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Allow authenticated users to view all their tasks in a clean interface

**Independent Test**: Log in and view task list page - displays tasks or empty state message

### Backend Implementation for US2

- [x] T035 [US2] Create backend/app/services/__init__.py and backend/app/services/task_service.py with get_tasks(user_id) function
- [x] T036 [US2] Create backend/app/routers/__init__.py and backend/app/routers/tasks.py with router setup
- [x] T037 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py with JWT verification
- [x] T038 [US2] Add tasks router to backend/app/main.py with prefix /api

### Frontend Implementation for US2

- [x] T039 [P] [US2] Create frontend/src/components/tasks/TaskItem.tsx with title, description, completed status display
- [x] T040 [US2] Create frontend/src/components/tasks/TaskList.tsx that fetches and renders TaskItems
- [x] T041 [US2] Create frontend/src/app/dashboard/page.tsx with TaskList component and empty state
- [x] T042 [US2] Add loading state and error handling to TaskList component
- [x] T043 [US2] Add api.tasks.list() method to frontend/src/lib/api.ts

**Checkpoint**: User Story 2 complete - users can view their task list

---

## Phase 5: User Story 3 - Add New Task (Priority: P1)

**Goal**: Allow authenticated users to create new tasks with title and optional description

**Independent Test**: Add a task with title and verify it appears in the list immediately

### Backend Implementation for US3

- [x] T044 [US3] Add create_task(user_id, task_data) function to backend/app/services/task_service.py
- [x] T045 [US3] Implement POST /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py with validation

### Frontend Implementation for US3

- [x] T046 [P] [US3] Create frontend/src/components/tasks/TaskForm.tsx with title input, description textarea, submit button
- [x] T047 [US3] Add TaskForm to frontend/src/app/dashboard/page.tsx above TaskList
- [x] T048 [US3] Add api.tasks.create() method to frontend/src/lib/api.ts
- [x] T049 [US3] Implement optimistic UI update - add task to list immediately on submit
- [x] T050 [US3] Add validation error display for empty title

**Checkpoint**: User Story 3 complete - users can add new tasks (MVP COMPLETE!)

---

## Phase 6: User Story 4 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Allow users to toggle task completion status with visual feedback

**Independent Test**: Click complete toggle, verify visual change, refresh page, verify persistence

### Backend Implementation for US4

- [ ] T051 [US4] Add toggle_complete(user_id, task_id) function to backend/app/services/task_service.py
- [ ] T052 [US4] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in backend/app/routers/tasks.py

### Frontend Implementation for US4

- [ ] T053 [US4] Add checkbox/toggle button to frontend/src/components/tasks/TaskItem.tsx
- [ ] T054 [US4] Add api.tasks.toggleComplete() method to frontend/src/lib/api.ts
- [ ] T055 [US4] Implement onClick handler in TaskItem to toggle completion
- [ ] T056 [US4] Add visual distinction between pending and completed tasks (strikethrough, color change)

**Checkpoint**: User Story 4 complete - users can mark tasks complete/incomplete

---

## Phase 7: User Story 5 - Update Task (Priority: P2)

**Goal**: Allow users to edit task title and description after creation

**Independent Test**: Click edit, modify title/description, save, verify changes persist

### Backend Implementation for US5

- [ ] T057 [US5] Add update_task(user_id, task_id, task_data) function to backend/app/services/task_service.py
- [ ] T058 [US5] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/app/routers/tasks.py
- [ ] T059 [US5] Implement GET /api/{user_id}/tasks/{task_id} endpoint for fetching single task

### Frontend Implementation for US5

- [ ] T060 [P] [US5] Create frontend/src/components/tasks/TaskEditModal.tsx with form for editing title/description
- [ ] T061 [US5] Add edit button to frontend/src/components/tasks/TaskItem.tsx
- [ ] T062 [US5] Add api.tasks.update() method to frontend/src/lib/api.ts
- [ ] T063 [US5] Implement modal open/close logic in TaskItem
- [ ] T064 [US5] Update task in list after successful edit

**Checkpoint**: User Story 5 complete - users can update tasks

---

## Phase 8: User Story 6 - Delete Task (Priority: P2)

**Goal**: Allow users to permanently delete tasks with confirmation

**Independent Test**: Click delete, confirm, verify task removed, refresh, verify deletion persists

### Backend Implementation for US6

- [ ] T065 [US6] Add delete_task(user_id, task_id) function to backend/app/services/task_service.py
- [ ] T066 [US6] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/app/routers/tasks.py

### Frontend Implementation for US6

- [ ] T067 [US6] Add delete button to frontend/src/components/tasks/TaskItem.tsx
- [ ] T068 [US6] Add confirmation dialog/modal for delete action
- [ ] T069 [US6] Add api.tasks.delete() method to frontend/src/lib/api.ts
- [ ] T070 [US6] Remove task from list immediately on successful delete

**Checkpoint**: User Story 6 complete - users can delete tasks

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T071 [P] Add responsive design improvements to all components (320px+ mobile support)
- [ ] T072 [P] Add loading spinners/states to all async operations
- [ ] T073 [P] Improve error messages with user-friendly text
- [ ] T074 [P] Add form validation feedback (character limits, required fields)
- [ ] T075 [P] Create frontend/.env.local.example with actual placeholder values
- [ ] T076 [P] Create backend/README.md with setup and running instructions
- [ ] T077 [P] Create frontend/README.md with setup and running instructions
- [ ] T078 Run quickstart.md validation - verify setup instructions work
- [ ] T079 Test all 6 endpoints with curl/Postman to verify API contract
- [ ] T080 End-to-end manual testing of all user stories

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ──────────────────────┐
                                     │
Phase 2: Foundational ◀──────────────┘
         │
         │ ⚠️ BLOCKS ALL USER STORIES
         ▼
┌────────────────────────────────────────────────────────────┐
│ User Stories can proceed in parallel after Phase 2:        │
│                                                            │
│   Phase 3: US1 (Auth) ─┬─▶ Phase 4: US2 (View Tasks)       │
│                        │                                   │
│                        ├─▶ Phase 5: US3 (Add Task)         │
│                        │                                   │
│                        ├─▶ Phase 6: US4 (Complete)         │
│                        │                                   │
│                        ├─▶ Phase 7: US5 (Update)           │
│                        │                                   │
│                        └─▶ Phase 8: US6 (Delete)           │
└────────────────────────────────────────────────────────────┘
         │
         ▼
Phase 9: Polish (after all user stories complete)
```

### User Story Dependencies

- **US1 (Auth)**: Required for ALL other user stories - must complete first
- **US2 (View)**: Depends on US1 - provides the base for displaying tasks
- **US3 (Add)**: Depends on US2 - needs task list to show added tasks
- **US4 (Complete)**: Depends on US3 - needs tasks to toggle
- **US5 (Update)**: Depends on US3 - needs tasks to edit
- **US6 (Delete)**: Depends on US3 - needs tasks to delete

### Recommended Order (Serial Execution)

1. Phase 1: Setup (T001-T009)
2. Phase 2: Foundational (T010-T025)
3. Phase 3: US1 - Auth (T026-T034)
4. Phase 4: US2 - View (T035-T043)
5. Phase 5: US3 - Add (T044-T050) → **MVP COMPLETE**
6. Phase 6: US4 - Complete (T051-T056)
7. Phase 7: US5 - Update (T057-T064)
8. Phase 8: US6 - Delete (T065-T070)
9. Phase 9: Polish (T071-T080)

---

## Parallel Opportunities

### Phase 1 - All Setup tasks can run in parallel:
```
T003 [P] Initialize backend Python project
T004 [P] Initialize frontend Next.js project
T005 [P] Create backend/requirements.txt
T006 [P] Create frontend/package.json
T007 [P] Configure Tailwind CSS
T008 [P] Create backend/.env.example
T009 [P] Create frontend/.env.example
```

### Phase 2 - Frontend foundation can run in parallel:
```
T017 [P] Create frontend/src/types/task.ts
T018 [P] Create frontend/src/lib/api.ts
T019 [P] Create frontend/src/lib/auth.ts
T020 [P] Create frontend/src/app/layout.tsx
T021-T023 [P] Create base UI components
```

### Per User Story - Auth forms can run in parallel:
```
T028 [P] [US1] Create LoginForm.tsx
T029 [P] [US1] Create RegisterForm.tsx
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (9 tasks)
2. Complete Phase 2: Foundational (16 tasks)
3. Complete Phase 3: US1 - Auth (9 tasks)
4. Complete Phase 4: US2 - View (9 tasks)
5. Complete Phase 5: US3 - Add (7 tasks)
6. **STOP and VALIDATE**: Test complete MVP flow
7. Deploy to staging environment

**MVP Task Count**: 50 tasks

### Incremental Delivery

| Milestone | Tasks | Cumulative | Delivers |
|-----------|-------|------------|----------|
| Setup + Foundation | T001-T025 | 25 | Project structure ready |
| + US1 (Auth) | T026-T034 | 34 | Users can register/login |
| + US2 (View) | T035-T043 | 43 | Users see task list |
| + US3 (Add) | T044-T050 | 50 | **MVP - Full create/view flow** |
| + US4 (Complete) | T051-T056 | 56 | Toggle completion |
| + US5 (Update) | T057-T064 | 64 | Edit tasks |
| + US6 (Delete) | T065-T070 | 70 | Delete tasks |
| + Polish | T071-T080 | 80 | Production ready |

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 80 |
| Setup Phase | 9 tasks |
| Foundational Phase | 16 tasks |
| US1 (Auth) | 9 tasks |
| US2 (View) | 9 tasks |
| US3 (Add) | 7 tasks |
| US4 (Complete) | 6 tasks |
| US5 (Update) | 8 tasks |
| US6 (Delete) | 6 tasks |
| Polish Phase | 10 tasks |
| Parallel Opportunities | 25+ tasks |
| MVP Scope | 50 tasks (US1-US3) |

---

## Notes

- All backend tasks use path prefix: `backend/app/`
- All frontend tasks use path prefix: `frontend/src/`
- [P] tasks can run in parallel within their phase
- [USx] label maps task to specific user story
- JWT verification uses `python-jose` with BETTER_AUTH_SECRET
- Neon PostgreSQL requires `?sslmode=require` in connection string
- Better Auth handles user registration/login on frontend
- Backend only verifies JWT tokens, does not manage users
