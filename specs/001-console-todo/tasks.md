# Tasks: Console Todo Application

**Input**: Design documents from `/specs/001-console-todo/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: INCLUDED - Test-First Development (TDD) is mandatory per constitution
**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- All file paths are absolute from repository root

## Path Conventions

Using **single project** layout per plan.md:
- Source: `src/todo_app/`
- Tests: `tests/`
- Config: Repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Python project with UV package manager (uv init --python 3.13)
- [x] T002 Create src/todo_app/ package structure with __init__.py
- [x] T003 [P] Create tests/ directory structure with __init__.py
- [x] T004 [P] Create pyproject.toml with project metadata and pytest dependency
- [x] T005 [P] Create .gitignore for Python project (*.pyc, __pycache__, .pytest_cache, .venv)
- [x] T006 [P] Create README.md with setup and usage instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Task model that ALL user stories depend on

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [x] T007 [P] Write failing test for Task dataclass creation in tests/test_models.py
- [x] T008 [P] Write failing test for Task validation (empty title, long title) in tests/test_models.py
- [x] T009 Implement Task dataclass in src/todo_app/models.py (id, title, completed, created_at)
- [x] T010 Implement Task validation in src/todo_app/models.py (__post_init__ method)
- [x] T011 Run tests for Task model - verify all tests pass

**Checkpoint**: Task model complete and validated - user story implementation can now begin ✅

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP Foundation

**Goal**: Users can add new tasks with titles and see them stored

**Independent Test**: Launch app, add task "Buy groceries", verify task created with UUID and stored

### Tests for User Story 1 (RED phase)

> **TDD: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US1] Write failing test for TaskStore.add_task() in tests/test_storage.py
- [x] T013 [P] [US1] Write failing test for empty title validation in tests/test_storage.py
- [x] T014 [P] [US1] Write failing test for title length validation in tests/test_storage.py
- [x] T015 [P] [US1] Write failing integration test for 'add' CLI command in tests/test_cli.py

### Implementation for User Story 1 (GREEN phase)

- [x] T016 [US1] Implement TaskStore class skeleton in src/todo_app/storage.py
- [x] T017 [US1] Implement TaskStore.add_task(title) method with validation in src/todo_app/storage.py
- [x] T018 [US1] Implement argparse CLI parser setup in src/todo_app/cli.py
- [x] T019 [US1] Implement 'add' command handler in src/todo_app/cli.py
- [x] T020 [US1] Create main entry point in src/todo_app/main.py
- [x] T021 [US1] Run all User Story 1 tests - verify all pass

### Refactor for User Story 1

- [x] T022 [US1] Refactor: Extract validation logic to separate function if needed
- [x] T023 [US1] Refactor: Add docstrings to Task and TaskStore

**Checkpoint**: User Story 1 complete - users can add tasks via CLI ✅

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1) 🎯 MVP Core

**Goal**: Users can view all tasks with their completion status

**Independent Test**: Add 3 tasks, run list command, verify all displayed with status symbols

### Tests for User Story 2 (RED phase)

- [x] T024 [P] [US2] Write failing test for TaskStore.list_tasks() in tests/test_storage.py
- [x] T025 [P] [US2] Write failing test for empty list scenario in tests/test_storage.py
- [x] T026 [P] [US2] Write failing integration test for 'list' CLI command in tests/test_cli.py
- [x] T027 [P] [US2] Write failing test for task display format (symbols, ID, title) in tests/test_cli.py

### Implementation for User Story 2 (GREEN phase)

- [x] T028 [US2] Implement TaskStore.list_tasks() method in src/todo_app/storage.py
- [x] T029 [US2] Implement TaskStore.count() method in src/todo_app/storage.py
- [x] T030 [US2] Implement 'list' command handler with formatting in src/todo_app/cli.py
- [x] T031 [US2] Add output symbols (✓ for complete, ○ for incomplete) in src/todo_app/cli.py
- [x] T032 [US2] Run all User Story 2 tests - verify all pass

### Refactor for User Story 2

- [x] T033 [US2] Refactor: Extract task formatting logic to separate function
- [x] T034 [US2] Refactor: Add docstrings for list operations

**Checkpoint**: User Stories 1 & 2 complete - users can add and view tasks ✅ (MVP Complete!)

---

## Phase 5: User Story 3 - Mark Tasks as Complete (Priority: P2)

**Goal**: Users can mark tasks as complete/incomplete to track progress

**Independent Test**: Add task, mark complete, verify status changes; mark incomplete, verify toggle

### Tests for User Story 3 (RED phase)

- [ ] T035 [P] [US3] Write failing test for TaskStore.mark_complete(task_id, True) in tests/test_storage.py
- [ ] T036 [P] [US3] Write failing test for TaskStore.mark_complete(task_id, False) in tests/test_storage.py
- [ ] T037 [P] [US3] Write failing test for non-existent task ID in tests/test_storage.py
- [ ] T038 [P] [US3] Write failing test for partial ID matching (min 8 chars) in tests/test_storage.py
- [ ] T039 [P] [US3] Write failing integration test for 'complete' CLI command in tests/test_cli.py
- [ ] T040 [P] [US3] Write failing integration test for 'incomplete' CLI command in tests/test_cli.py

### Implementation for User Story 3 (GREEN phase)

- [ ] T041 [US3] Implement TaskStore.get_task(task_id) method in src/todo_app/storage.py
- [ ] T042 [US3] Implement TaskStore.find_by_partial_id(partial_id) method in src/todo_app/storage.py
- [ ] T043 [US3] Implement TaskStore.mark_complete(task_id, completed) method in src/todo_app/storage.py
- [ ] T044 [US3] Implement 'complete' command handler with ID lookup in src/todo_app/cli.py
- [ ] T045 [US3] Implement 'incomplete' command handler in src/todo_app/cli.py
- [ ] T046 [US3] Add error handling for task not found in src/todo_app/cli.py
- [ ] T047 [US3] Run all User Story 3 tests - verify all pass

### Refactor for User Story 3

- [ ] T048 [US3] Refactor: Consolidate partial ID matching logic
- [ ] T049 [US3] Refactor: Add docstrings for completion operations

**Checkpoint**: User Stories 1-3 complete - full task tracking with completion status ✅

---

## Phase 6: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Users can update task titles to correct mistakes

**Independent Test**: Add task, update title, verify change persists in list

### Tests for User Story 4 (RED phase)

- [ ] T050 [P] [US4] Write failing test for TaskStore.update_task(task_id, new_title) in tests/test_storage.py
- [ ] T051 [P] [US4] Write failing test for empty title validation on update in tests/test_storage.py
- [ ] T052 [P] [US4] Write failing test for non-existent task on update in tests/test_storage.py
- [ ] T053 [P] [US4] Write failing integration test for 'update' CLI command in tests/test_cli.py

### Implementation for User Story 4 (GREEN phase)

- [ ] T054 [US4] Implement TaskStore.update_task(task_id, title) method in src/todo_app/storage.py
- [ ] T055 [US4] Implement 'update' command handler with validation in src/todo_app/cli.py
- [ ] T056 [US4] Add output showing old and new titles in src/todo_app/cli.py
- [ ] T057 [US4] Run all User Story 4 tests - verify all pass

### Refactor for User Story 4

- [ ] T058 [US4] Refactor: Consolidate title validation across add and update
- [ ] T059 [US4] Refactor: Add docstrings for update operations

**Checkpoint**: User Stories 1-4 complete - task CRUD with completion status ✅

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Users can delete tasks to maintain clean list

**Independent Test**: Add 3 tasks, delete middle task, verify only 2 remain in list

### Tests for User Story 5 (RED phase)

- [ ] T060 [P] [US5] Write failing test for TaskStore.delete_task(task_id) in tests/test_storage.py
- [ ] T061 [P] [US5] Write failing test for non-existent task deletion in tests/test_storage.py
- [ ] T062 [P] [US5] Write failing test for deleted task not in list in tests/test_storage.py
- [ ] T063 [P] [US5] Write failing integration test for 'delete' CLI command in tests/test_cli.py

### Implementation for User Story 5 (GREEN phase)

- [ ] T064 [US5] Implement TaskStore.delete_task(task_id) method in src/todo_app/storage.py
- [ ] T065 [US5] Implement 'delete' command handler with confirmation output in src/todo_app/cli.py
- [ ] T066 [US5] Add error handling for delete operations in src/todo_app/cli.py
- [ ] T067 [US5] Run all User Story 5 tests - verify all pass

### Refactor for User Story 5

- [ ] T068 [US5] Refactor: Consolidate error handling patterns across all commands
- [ ] T069 [US5] Refactor: Add docstrings for delete operations

**Checkpoint**: All User Stories 1-5 complete - full CRUD operations ✅

---

## Phase 8: Edge Cases & Error Handling

**Purpose**: Handle edge cases from spec.md

- [ ] T070 [P] Write test for very long title (1000+ chars) in tests/test_models.py
- [ ] T071 [P] Write test for special characters (emojis, quotes, newlines) in tests/test_models.py
- [ ] T072 [P] Write test for rapid task additions in tests/test_storage.py
- [ ] T073 [P] Write test for ambiguous partial ID (multiple matches) in tests/test_storage.py
- [ ] T074 Implement title length cap (200 chars) with error message in src/todo_app/models.py
- [ ] T075 [P] Implement special character handling (strip newlines) in src/todo_app/models.py
- [ ] T076 [P] Implement ambiguous ID error message in src/todo_app/storage.py
- [ ] T077 Run all edge case tests - verify all pass

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting all user stories

- [ ] T078 [P] Add comprehensive docstrings to all modules
- [ ] T079 [P] Add type hints throughout src/todo_app/
- [ ] T080 [P] Update README.md with complete examples from all user stories
- [ ] T081 [P] Add usage examples to docstrings
- [ ] T082 Run all tests with coverage report (uv run pytest --cov=todo_app)
- [ ] T083 Verify 100% test coverage for models.py and storage.py
- [ ] T084 Verify all acceptance criteria from spec.md are met
- [ ] T085 Run quickstart.md validation - test all commands manually
- [ ] T086 [P] Add --help text for all CLI commands
- [ ] T087 [P] Add --version flag to CLI

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately ✅
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories ⚠️
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational (can run parallel with US1 if team capacity)
- **User Story 3 (Phase 5)**: Depends on Foundational (can run parallel with US1, US2)
- **User Story 4 (Phase 6)**: Depends on Foundational (can run parallel with others)
- **User Story 5 (Phase 7)**: Depends on Foundational (can run parallel with others)
- **Edge Cases (Phase 8)**: Depends on all user stories being complete
- **Polish (Phase 9)**: Depends on all prior phases

### User Story Dependencies

- **US1 (Add Tasks)**: Independent - No dependencies on other stories ✅
- **US2 (View Tasks)**: Independent - No dependencies on other stories ✅
- **US3 (Complete Tasks)**: Independent - Uses same Task model but separate operations ✅
- **US4 (Update Tasks)**: Independent - Uses same Task model but separate operations ✅
- **US5 (Delete Tasks)**: Independent - Uses same Task model but separate operations ✅

**All user stories are independently testable after Foundational phase completes** 🎯

### Within Each User Story (TDD Cycle)

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimum code to pass tests
3. **REFACTOR**: Clean up code while keeping tests green
4. **VERIFY**: Run all tests for that story before moving on

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T006 can all run in parallel

**Phase 2 (Foundational)**: T007, T008 can run in parallel (different test files)

**After Foundational Phase Completes**: All 5 user stories can be worked on in parallel by different team members:
- Developer A: User Story 1 (T012-T023)
- Developer B: User Story 2 (T024-T034)
- Developer C: User Story 3 (T035-T049)
- Developer D: User Story 4 (T050-T059)
- Developer E: User Story 5 (T060-T069)

**Within Each User Story**:
- All test tasks marked [P] can run in parallel
- Tests before implementation (TDD)
- Implementation tasks run sequentially (build on each other)

---

## Parallel Example: User Story 1 (Add Tasks)

### RED Phase (Parallel Tests):
```bash
# All these can be written in parallel by different team members:
T012: "Write failing test for TaskStore.add_task()"
T013: "Write failing test for empty title validation"
T014: "Write failing test for title length validation"
T015: "Write failing integration test for 'add' CLI command"
```

### GREEN Phase (Sequential Implementation):
```bash
# These build on each other, run sequentially:
T016: Implement TaskStore skeleton
T017: Implement add_task() method
T018: Implement CLI parser
T019: Implement 'add' command handler
T020: Create main entry point
T021: Run all tests
```

### REFACTOR Phase:
```bash
T022: Extract validation logic
T023: Add docstrings
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only) 🎯

**Minimum Viable Product** includes only:

1. Complete **Phase 1: Setup** (T001-T006)
2. Complete **Phase 2: Foundational** (T007-T011) - Task model
3. Complete **Phase 3: User Story 1** (T012-T023) - Add tasks
4. Complete **Phase 4: User Story 2** (T024-T034) - View tasks
5. **STOP and VALIDATE**: Test MVP independently
6. Demo: "Users can add tasks and view their list"

**MVP delivers core value**: Task capture and viewing (minimal todo list functionality)

### Incremental Delivery (Priority Order)

After MVP, add one story at a time in priority order:

1. **Foundation** (Phase 1-2) → Infrastructure ready ✅
2. **MVP** (Phase 3-4) → Add + View tasks → Demo! 🎯
3. **+US3** (Phase 5) → Add completion tracking → Demo!
4. **+US4** (Phase 6) → Add update capability → Demo!
5. **+US5** (Phase 7) → Add delete capability → Demo! (Full CRUD)
6. **Edge Cases** (Phase 8) → Handle all edge cases
7. **Polish** (Phase 9) → Production ready

Each increment is independently testable and deployable ✅

### Parallel Team Strategy

With 5 developers after Foundational phase:

```
Phase 1-2: All team members collaborate
    ↓
Foundational Complete ✅
    ↓
Split into parallel streams:

Dev A → User Story 1 (Add) → T012-T023
Dev B → User Story 2 (View) → T024-T034
Dev C → User Story 3 (Complete) → T035-T049
Dev D → User Story 4 (Update) → T050-T059
Dev E → User Story 5 (Delete) → T060-T069
    ↓
All stories complete in parallel
    ↓
Merge and test integration
    ↓
Edge Cases + Polish together
```

---

## Task Summary

**Total Tasks**: 87 tasks

**Breakdown by Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 5 tasks ⚠️ BLOCKS ALL USER STORIES
- Phase 3 (US1 - Add): 12 tasks (4 tests, 6 impl, 2 refactor)
- Phase 4 (US2 - View): 11 tasks (4 tests, 5 impl, 2 refactor)
- Phase 5 (US3 - Complete): 15 tasks (6 tests, 7 impl, 2 refactor)
- Phase 6 (US4 - Update): 10 tasks (4 tests, 4 impl, 2 refactor)
- Phase 7 (US5 - Delete): 10 tasks (4 tests, 4 impl, 2 refactor)
- Phase 8 (Edge Cases): 8 tasks
- Phase 9 (Polish): 10 tasks

**MVP Scope**: 34 tasks (Phase 1-4: Setup + Foundation + US1 + US2)

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel

**Independent User Stories**: All 5 user stories are independently testable ✅

---

## Validation Checklist

Before proceeding to /sp.implement:

- [x] All tasks follow `- [ ] [ID] [P?] [Story] Description with file path` format
- [x] Every task has clear file path specified
- [x] Tests included for all user stories (TDD approach)
- [x] Tasks organized by user story for independent implementation
- [x] Each user story has independent test criteria
- [x] Dependencies clearly documented
- [x] Parallel opportunities identified with [P] markers
- [x] MVP scope clearly defined (US1 + US2)
- [x] Incremental delivery strategy documented

---

## Notes

- **TDD is mandatory** per constitution - all tests written before implementation
- **[P] marker** indicates parallelizable tasks (different files, no dependencies)
- **[Story] label** enables traceability and independent story implementation
- **MVP = User Stories 1 & 2** (Add + View tasks) - simplest valuable increment
- Each user story checkpoint ensures independent functionality
- Stop at any checkpoint to validate, demo, or deploy
- Commit after each task or logical TDD cycle (RED→GREEN→REFACTOR)
- All tasks have explicit file paths for clear implementation guidance

---

**Tasks Generated**: 2025-12-27
**Ready For**: `/sp.implement` execution with TDD workflow
**Constitutional Compliance**: ✅ Test-First Development, ✅ Spec-Driven, ✅ Clear Tasks
