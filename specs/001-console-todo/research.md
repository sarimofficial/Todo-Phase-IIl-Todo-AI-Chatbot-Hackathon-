# Research: Console Todo Application

**Feature**: Console Todo Application
**Branch**: `001-console-todo`
**Date**: 2025-12-27

## Overview

This document captures research findings and technical decisions for implementing a Python 3.13+ console todo application with in-memory storage.

---

## 1. Python Console App Architecture

### Decision: Command-Driven CLI with argparse

**What**: Use Python's built-in argparse module for command-line interface with subcommands (add, list, complete, update, delete).

**Rationale**:
- Zero external dependencies (built-in standard library)
- Clear structure for subcommands
- Automatic help generation and usage messages
- Easy to test with monkeypatch
- Python 3.13 compatibility guaranteed
- Simple for learning project, scales to more complex CLIs

**Alternatives Considered**:
- **Menu-driven loop**: More verbose code, harder to test, less user-friendly for repeated operations
- **Click framework**: Excellent for complex CLIs but adds external dependency and overkill for Phase I
- **Typer**: Modern and user-friendly but adds dependency when argparse suffices

**Implementation Pattern**:
```python
import argparse

def main():
    parser = argparse.ArgumentParser(description='Simple console todo application')
    subparsers = parser.add_subparsers(dest='command', required=True)

    # add command
    add_parser = subparsers.add_parser('add', help='Add a new task')
    add_parser.add_argument('title', help='Task title')

    # list command
    list_parser = subparsers.add_parser('list', help='List all tasks')

    # complete command
    complete_parser = subparsers.add_parser('complete', help='Mark task as complete')
    complete_parser.add_argument('task_id', help='Task ID')

    args = parser.parse_args()
    # Dispatch to handlers
```

---

## 2. Project Structure

### Decision: Src Layout with Separate Test Directory

**What**: Use src layout pattern with test directory mirroring source structure.

```
todo-app/
├── src/
│   └── todo_app/
│       ├── __init__.py
│       ├── cli.py          # argparse setup & command handlers
│       ├── models.py       # Task dataclass
│       ├── storage.py      # in-memory TaskStore class
│       └── main.py         # entry point
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_storage.py
│   └── test_cli.py
├── pyproject.toml          # UV config
├── README.md
└── .gitignore
```

**Rationale**:
- Src layout keeps importable code separate from project root
- Prevents accidental imports from project root during development
- Clean organization with proper test mirroring
- Industry standard for Python packages
- Scales well for future phases

**Alternatives Considered**:
- **Flat layout** (all .py files in root): Messy, doesn't scale, mixes concerns
- **Nested tests in src**: Harder to separate test dependencies

---

## 3. In-Memory Data Storage

### Decision: Dict + List Combination with Task Dataclass

**What**: Use dictionary for O(1) lookup by ID, list for insertion order, dataclass for Task model.

**Implementation**:
```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List
import uuid

@dataclass
class Task:
    """Represents a single todo item."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    completed: bool = False
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

class TaskStore:
    """In-memory task storage."""
    def __init__(self):
        self._tasks: Dict[str, Task] = {}  # id -> Task mapping
        self._order: List[str] = []         # maintain insertion order
```

**Rationale**:
- Dict lookup by ID is O(1) - efficient for get/update/delete
- List maintains insertion order for display consistency
- Dataclasses provide type safety, immutability options, and built-in __repr__
- UUID v4 provides universally unique IDs without coordination
- No external dependencies (all built-in)

**Alternatives Considered**:
- **List only**: O(n) lookup, simpler but inefficient for large task lists
- **Custom counter IDs (1, 2, 3)**: Simpler but doesn't scale across sessions, ID collision risk
- **UUID v1 (time-based)**: Exposes MAC address (privacy concern), unnecessary here
- **Custom classes instead of dataclass**: More boilerplate, less Pythonic

### ID Generation Strategy

**Decision**: UUID v4 (random)

**Rationale**:
- Universally unique without coordination
- Standard library support
- Collision probability negligible for small datasets
- Future-proof for distributed systems (Phase II+)

**Alternatives Considered**:
- Sequential integers: Simple but fragile, doesn't scale
- Timestamp-based: Collision risk with rapid operations

---

## 4. Testing Approach

### Decision: pytest with monkeypatch and capsys

**What**: Use pytest as testing framework with built-in fixtures for console I/O testing.

**Test Organization**:
- `test_models.py`: Unit tests for Task dataclass
- `test_storage.py`: Unit tests for TaskStore methods (add, list, complete, delete, update)
- `test_cli.py`: Integration tests for command handlers using capsys

**Key Testing Patterns**:

```python
import pytest

# Test console output
def test_list_command(capsys):
    """Test list command output."""
    store = TaskStore()
    store.add_task('Buy groceries')
    cmd_list(store)

    captured = capsys.readouterr()
    assert 'Buy groceries' in captured.out

# Test user input
def test_add_with_input(monkeypatch):
    """Test adding task with user input."""
    monkeypatch.setattr('builtins.input', lambda _: 'New task')
    store = TaskStore()
    result = store.add_task('New task')
    assert result is not None
```

**Rationale**:
- pytest is the Python standard for testing
- capsys fixture captures stdout/stderr cleanly
- monkeypatch allows simulating user input
- Simple setup, minimal boilerplate
- Excellent error reporting

**Alternatives Considered**:
- **unittest**: More verbose, fewer built-in fixtures
- **pytest-console-scripts**: Better for subprocess testing, unnecessary for Phase I
- **Mocking everything**: Less realistic; monkeypatch + capsys is cleaner

---

## 5. Package Management with UV

### Decision: Use UV for All Python Tooling

**What**: UV is a fast, Rust-based Python package manager that replaces pip, virtualenv, and poetry.

**Setup**:
```bash
# Install UV (once)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create project
uv init --python 3.13

# Add dependencies
uv add pytest            # test framework
uv add pytest-cov        # coverage reporting

# Run commands
uv run python -m todo_app.main add "Buy groceries"
uv run pytest
```

**pyproject.toml Configuration**:
```toml
[project]
name = "todo-app"
version = "0.1.0"
description = "Simple console todo application"
requires-python = ">=3.13"
dependencies = []

[project.optional-dependencies]
dev = ["pytest>=8.0", "pytest-cov>=6.0"]

[project.scripts]
todo = "todo_app.main:main"

[tool.uv]
python-preference = "only-managed"
```

**Rationale**:
- **10-100x faster** than pip (Rust-based implementation)
- Automatic virtual environment management
- Replaces multiple tools (pip + virtualenv + pipx + poetry)
- Auto-installs missing Python versions
- Deterministic dependency resolution
- Constitutional requirement for Phase I

**Alternatives Considered**:
- **poetry**: Heavier, slower, overkill for simple project
- **pip + venv**: Standard but slower, requires manual venv management
- **pipx**: For tools only, not project dependencies

---

## 6. Error Handling & Input Validation

### Decision: Defensive Pattern with Try-Except + Type Validation

**What**: Use try-except blocks with specific exception types and validation functions.

**Pattern**:
```python
def validate_task_title(title: str) -> str:
    """Validate and normalize task title."""
    if not isinstance(title, str):
        raise TypeError(f"Task title must be string, got {type(title)}")

    normalized = title.strip()
    if not normalized:
        raise ValueError("Task title cannot be empty")

    if len(normalized) > 200:
        raise ValueError("Task title exceeds 200 characters")

    return normalized

# Usage in CLI
def cmd_add(args):
    try:
        title = validate_task_title(args.title)
        task_id = store.add_task(title)
        print(f"✓ Task added (ID: {task_id[:8]}...)")
        return 0
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\nCancelled.", file=sys.stderr)
        return 130
```

**Error Categories**:
- **ValueError**: Invalid data (empty string, out of range)
- **TypeError**: Wrong type passed
- **KeyError**: Task ID not found
- **KeyboardInterrupt**: User abort (Ctrl+C)
- **Exception**: Unexpected errors (log and report)

**Rationale**:
- Pythonic EAFP (Easier to Ask Forgiveness than Permission)
- Clear, actionable error messages
- Proper exit codes (0 = success, 1 = error, 130 = interrupted)
- Separation of stdout (success) and stderr (errors)

**Alternatives Considered**:
- **Assertions**: Only for internal checks, not user input validation
- **Silent failures**: Confusing for users
- **Complex regex validation**: Overkill for simple title validation
- **Pydantic**: Excellent but adds dependency; dataclass validation sufficient

---

## 7. Console I/O Best Practices

### Decision: Simple print() with sys.stderr for Errors

**What**: Use built-in print() for output, sys.stderr for errors, input() for user input.

**Pattern**:
```python
import sys

# Success output to stdout
print("Tasks:")
for task in store.list_tasks():
    status = "✓" if task.completed else "○"
    print(f"  [{status}] {task.id[:8]}... {task.title}")

# Errors to stderr
print(f"Error: Task not found", file=sys.stderr)

# User input with error handling
try:
    title = input("Enter task title: ").strip()
except EOFError:
    print("No input available", file=sys.stderr)
    sys.exit(1)
```

**Rationale**:
- Built-in functions are sufficient for Phase I
- sys.stderr separation allows proper error redirection
- Simple visual feedback with Unicode symbols (✓, ○)
- No external dependencies needed

**Alternatives Considered**:
- **Rich library**: Beautiful formatting but adds dependency, overkill for simple todo
- **Colorama**: Cross-platform colors, unnecessary for Phase I
- **Logging module**: Better for long-running apps, verbose for simple CLI

---

## 8. Thread Safety Considerations

### Decision: No Thread Safety for Phase I

**What**: Single-threaded execution, no locking mechanisms.

**Rationale**:
- Phase I is single-user console application
- No concurrent access patterns in specification
- Adding threading would be over-engineering
- If needed in Phase II+, wrap TaskStore with `threading.Lock()`

**Future Consideration**:
If threading is added later:
```python
import threading

class TaskStore:
    def __init__(self):
        self._tasks = {}
        self._order = []
        self._lock = threading.Lock()

    def add_task(self, title):
        with self._lock:
            # ... operation
```

---

## Summary of Technical Decisions

| Aspect | Decision | Primary Benefit |
|--------|----------|----------------|
| CLI Framework | argparse (built-in) | Zero dependencies, simple |
| Project Structure | src layout | Separation, scalability |
| Data Storage | Dict + List + dataclass | O(1) lookup + order |
| ID Generation | UUID v4 | Unique, standard |
| Testing | pytest + fixtures | Simple I/O testing |
| Package Manager | UV | Speed, integration |
| Error Handling | Try-except + validation | Clear user feedback |
| Console I/O | print() + sys.stderr | Built-in, sufficient |
| Thread Safety | None (single-threaded) | Simplicity |

---

## Constitutional Compliance

**Spec-Driven Development**: ✅ All decisions derived from spec requirements
**Test-First Development**: ✅ Testing approach defined before implementation
**Clean Code**: ✅ Simple patterns, no over-engineering
**Technology Stack**: ✅ Python 3.13+ with UV as required
**No Manual Coding**: ✅ Decisions guide code generation in next phases

---

**Research completed**: 2025-12-27
**Ready for Phase 1**: Data Model & Contracts Design
