# Implementation Plan: Console Todo Application

**Branch**: `001-console-todo` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-console-todo/spec.md`

## Summary

Build a Python 3.13+ console todo application with in-memory storage supporting five core operations: Add, Delete, Update, View, and Mark Complete. The application uses argparse for CLI, dataclasses for models, and pytest for testing. All data is stored in-memory (Dict + List pattern) and lost on exit. Focus on simplicity, testability, and clean code without over-engineering.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (stdlib only for core app), pytest for testing
**Storage**: In-memory (Dict for O(1) lookup + List for insertion order)
**Testing**: pytest with monkeypatch and capsys fixtures
**Target Platform**: Cross-platform console (Windows/Linux/macOS)
**Project Type**: Single project (console application)
**Performance Goals**: <1 second response time for all operations, handles 100+ tasks
**Constraints**: In-memory only (no persistence), single-user, session-based
**Scale/Scope**: Simple Phase I learning project, foundation for 4 future phases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Spec-Driven Development**: All code generated from spec.md
✅ **Test-First Development**: pytest tests defined before implementation
✅ **Technology Stack Compliance**: Python 3.13+ with UV as required
✅ **Clean Code**: Simple patterns, no over-engineering
✅ **No Manual Coding**: Code generation via /sp.implement
✅ **PHR Required**: Create PHR after planning complete
⏳ **ADR Suggestion**: Will evaluate after design (none expected for simple Phase I)

**Violations**: None

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo/
├── spec.md              # Feature specification ✅
├── plan.md              # This file (implementation plan) ✅
├── research.md          # Technical research & decisions ✅
├── data-model.md        # Entity definitions ✅
├── quickstart.md        # Getting started guide ⏳
├── contracts/           # Interface contracts
│   └── cli-interface.md # CLI command contracts ✅
├── checklists/
│   └── requirements.md  # Spec quality checklist ✅
└── tasks.md             # Task breakdown (/sp.tasks output) ⏳
```

### Source Code (repository root)

```text
src/
└── todo_app/
    ├── __init__.py      # Package init
    ├── models.py        # Task dataclass
    ├── storage.py       # TaskStore class (in-memory)
    ├── cli.py           # argparse CLI & command handlers
    └── main.py          # Entry point

tests/
├── __init__.py
├── test_models.py       # Task dataclass tests
├── test_storage.py      # TaskStore method tests
└── test_cli.py          # CLI integration tests

pyproject.toml           # UV package config
README.md                # User documentation
.gitignore               # Git ignore patterns
```

**Structure Decision**: Single project layout using src pattern. This separates importable code from project root, prevents accidental imports during development, and scales well for future phases. Test directory mirrors source structure for clarity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitutional requirements met.

---

## Phase 0: Research ✅ COMPLETE

**Objective**: Resolve all technical unknowns and establish implementation patterns.

**Artifacts Created**:
- ✅ `research.md` - Technical decisions with rationale

**Key Decisions Made**:

1. **CLI Framework**: argparse (built-in, zero deps)
2. **Data Structure**: Dict + List + dataclass pattern
3. **ID Generation**: UUID v4 (standard, collision-proof)
4. **Testing**: pytest with monkeypatch/capsys
5. **Package Manager**: UV (10-100x faster than pip)
6. **Error Handling**: Try-except with validation functions
7. **Console I/O**: print() + sys.stderr (simple, sufficient)

**Alternatives Considered**: Click (heavier), Typer (deps), sequential IDs (fragile), unittest (verbose) - all documented in research.md

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Objective**: Define data model and interface contracts.

**Artifacts Created**:
- ✅ `data-model.md` - Task entity, validation rules, storage model
- ✅ `contracts/cli-interface.md` - CLI command interface specifications

### Data Model Summary

**Task Entity**:
```python
@dataclass
class Task:
    id: str              # UUID v4
    title: str           # 1-200 chars, non-empty after trim
    completed: bool      # Default: False
    created_at: str      # ISO 8601 datetime
```

**Storage Pattern**:
```python
class TaskStore:
    _tasks: Dict[str, Task]  # O(1) lookup by ID
    _order: List[str]        # Insertion order for display
```

**Operations**: add, get, list, update, mark_complete, delete (all O(1) except list which is O(n))

### Contract Summary

**Commands**: add, list, complete, incomplete, update, delete

**Output Patterns**:
- Success: stdout with ✓ symbol
- Errors: stderr with descriptive messages
- Exit codes: 0 (success), 1 (error), 130 (interrupted)

**ID Handling**: Full UUID or partial (min 8 chars) with prefix matching

---

## Phase 2: Implementation Planning ⏳ IN PROGRESS

**Objective**: Create detailed task breakdown for TDD implementation.

**Next Step**: Run `/sp.tasks` to generate tasks.md with:
- Test cases for each requirement
- Implementation tasks ordered by dependency
- Acceptance criteria per task
- Red-Green-Refactor workflow

**Expected Output**: `tasks.md` with ~15-20 tasks covering:
1. Project setup (UV init, directory structure)
2. Task model implementation + tests
3. TaskStore implementation + tests
4. CLI implementation + tests
5. Integration tests
6. Documentation

---

## Architecture Decisions

### 1. In-Memory Storage Pattern

**Decision**: Use Dict (for lookups) + List (for order) combination

**Rationale**:
- Dict provides O(1) operations for get/update/delete
- List maintains insertion order for predictable display
- Simple to implement and test
- No external dependencies
- Easy to migrate to database in Phase II

**Trade-offs**:
- Memory usage proportional to task count (acceptable for Phase I scope)
- Data lost on exit (by design for this phase)
- Not suitable for large datasets (>10k tasks) but Phase I targets ~100

**Alternatives Rejected**:
- List only: O(n) lookup inefficient
- OrderedDict only: Doesn't separate concerns cleanly

### 2. UUID v4 for IDs

**Decision**: Auto-generate UUID v4 for task IDs

**Rationale**:
- Universally unique without coordination
- Standard library support (no deps)
- Scales to distributed systems (future phases)
- Negligible collision probability

**Trade-offs**:
- Longer IDs vs sequential integers
- Less human-readable (mitigated with partial ID matching)

**Alternatives Rejected**:
- Sequential integers: Fragile, doesn't scale across sessions/systems
- UUID v1: Exposes MAC address (privacy concern)

### 3. argparse for CLI

**Decision**: Use built-in argparse module

**Rationale**:
- Zero dependencies
- Sufficient for Phase I requirements
- Automatic help generation
- Easy to test with sys.argv manipulation
- Can migrate to Click/Typer later if needed

**Trade-offs**:
- More verbose than modern alternatives (Click, Typer)
- Less elegant syntax

**Alternatives Rejected**:
- Click: Adds dependency, overkill for simple Phase I
- Typer: Modern but adds dependency
- Menu loop: Harder to test, less user-friendly

### 4. Test-First with pytest

**Decision**: Write tests before implementation using pytest

**Rationale**:
- Constitutional requirement (TDD)
- pytest fixtures (capsys, monkeypatch) perfect for CLI testing
- Clear test organization
- Excellent error reporting

**Trade-offs**:
- Initial time investment (mitigated by better design)

**Alternatives Rejected**:
- unittest: More verbose, fewer fixtures
- Manual testing: Not repeatable, doesn't catch regressions

---

## Implementation Workflow

### Red-Green-Refactor Cycle

1. **Red**: Write failing test for requirement
2. **Green**: Implement minimum code to pass
3. **Refactor**: Clean up code while keeping tests green

### Dependency Order

```
1. Project Setup (UV init, structure)
   ↓
2. Task Model (dataclass + validation)
   ↓
3. TaskStore (add, get, list, update, delete)
   ↓
4. CLI Parser (argparse setup)
   ↓
5. Command Handlers (add, list, complete, update, delete)
   ↓
6. Integration Tests
   ↓
7. Documentation (README, quickstart)
```

### Test Coverage Goals

- **Unit Tests**: 100% coverage for models.py and storage.py
- **Integration Tests**: All CLI commands with happy path + error cases
- **Edge Cases**: Empty inputs, long titles, invalid IDs, concurrent operations

---

## Quality Gates

### Before /sp.implement

- ✅ All NEEDS CLARIFICATION resolved (none in this plan)
- ✅ Data model defined with validation rules
- ✅ Interface contracts specified
- ✅ Test strategy defined
- ✅ No constitutional violations

### Before Phase Completion

- All tests passing (pytest)
- No hardcoded values or secrets
- README with setup instructions
- Code follows PEP 8 style
- All acceptance criteria met from spec.md

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|------------|---------|------------|
| UUID partial matching ambiguity | Medium | Low | Require min 8 chars, show error if multiple matches |
| Special chars in titles breaking output | Low | Low | Test with edge cases (emojis, quotes, newlines) |
| Large task lists impacting performance | Low | Medium | Test with 100+ tasks, document limitations |
| Cross-platform compatibility | Low | Low | Use stdlib only, test on Windows/Linux |

---

## Success Criteria (from spec.md)

- ✅ Users can add task in <10 seconds
- ✅ Users can view list in <3 seconds
- ✅ Users can mark complete in <5 seconds
- ✅ 95% operations succeed on first attempt
- ✅ All data persists during session
- ✅ Intuitive without external docs
- ✅ <1 second response time
- ✅ Handles 100 tasks without degradation

**How to Verify**:
- Manual testing with timer
- Automated performance tests
- User acceptance testing
- Load testing with 100+ tasks

---

## Next Steps

1. **Immediate**: Run `/sp.tasks` to generate detailed task breakdown
2. **Then**: Run `/sp.implement` to execute tasks with TDD approach
3. **Then**: Verify all acceptance criteria from spec.md
4. **Finally**: Create initial commit with `/sp.git.commit_pr`

---

**Plan Status**: ✅ COMPLETE - Ready for task generation
**Created**: 2025-12-27
**Last Updated**: 2025-12-27
