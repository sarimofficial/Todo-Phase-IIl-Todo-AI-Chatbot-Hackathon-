# Data Model: Console Todo Application

**Feature**: Console Todo Application
**Branch**: `001-console-todo`
**Date**: 2025-12-27

## Overview

This document defines the data entities, their attributes, relationships, and validation rules for the console todo application.

---

## Entities

### Task

Represents a single todo item that users can create, update, complete, and delete.

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `id` | string (UUID v4) | Yes | Unique identifier for the task | Auto-generated, immutable |
| `title` | string | Yes | Description of what needs to be done | 1-200 characters, non-empty after trim |
| `completed` | boolean | Yes | Whether the task is completed | Defaults to `false` |
| `created_at` | string (ISO 8601) | Yes | When the task was created | Auto-generated, immutable, format: `YYYY-MM-DDTHH:MM:SS.ssssss` |

**Example**:
```json
{
  "id": "a3f2c1b0-9876-4def-8901-234567890abc",
  "title": "Buy groceries",
  "completed": false,
  "created_at": "2025-12-27T10:30:45.123456"
}
```

**Validation Rules**:

1. **id**:
   - Must be valid UUID v4 format
   - Auto-generated on creation
   - Cannot be modified after creation
   - Must be unique across all tasks

2. **title**:
   - Cannot be empty or whitespace-only
   - Must be between 1-200 characters after trimming
   - Special characters allowed (emojis, quotes, etc.)
   - Leading/trailing whitespace automatically trimmed

3. **completed**:
   - Must be boolean (true/false)
   - Defaults to false on creation
   - Can be toggled between true/false

4. **created_at**:
   - Must be valid ISO 8601 datetime string
   - Auto-generated on creation using current system time
   - Cannot be modified after creation
   - Timezone-aware (uses local system timezone)

**State Transitions**:

```
[New Task]
    ↓
[Incomplete] ←→ [Complete]
    ↓              ↓
[Deleted]      [Deleted]
```

**Business Rules**:
- A task can be deleted in any state (incomplete or complete)
- A task can be toggled between incomplete and complete multiple times
- Task titles can be updated while in any state
- Task IDs and creation timestamps are immutable

---

## Relationships

### Phase I: No Relationships

In Phase I, tasks are independent entities with no relationships to other entities.

**Future Phases** (out of scope for Phase I):
- Phase II+: Tasks may belong to Users (one-to-many)
- Phase III+: Tasks may have Tags (many-to-many)
- Phase V+: Tasks may have Parent Tasks (hierarchical)

---

## Storage Model

### In-Memory Storage (Phase I)

**Structure**:
```python
TaskStore {
    _tasks: Dict[str, Task]      # id → Task mapping (for O(1) lookup)
    _order: List[str]            # ordered list of task IDs (for display order)
}
```

**Operations**:

| Operation | Complexity | Description |
|-----------|-----------|-------------|
| Add | O(1) | Insert task into dict and append ID to order list |
| Get by ID | O(1) | Dictionary lookup |
| List all | O(n) | Iterate order list and lookup each task |
| Update | O(1) | Dictionary update (after ID lookup) |
| Delete | O(1) dict + O(n) list | Remove from dict, remove ID from order list |
| Mark complete | O(1) | Update completed field via dictionary |

**Persistence**:
- Phase I: In-memory only (data lost on application exit)
- No file I/O, no database
- Data exists only during application runtime

**Future Phases** (out of scope for Phase I):
- Phase II: PostgreSQL with SQLModel ORM
- Phase III: Database-persisted conversation state
- Phase IV+: Cloud database with event streaming

---

## Data Integrity

### Uniqueness Constraints

1. **Task ID**: Must be unique across all tasks
   - Enforced by: UUID v4 generation (collision probability: ~1 in 2^122)
   - Validation: Check for existence before operations

### Referential Integrity

Not applicable for Phase I (no relationships between entities).

### Data Validation

**On Task Creation**:
1. Validate title is non-empty after trim
2. Validate title length ≤ 200 characters
3. Generate unique UUID v4 for ID
4. Set completed = false
5. Generate ISO 8601 timestamp for created_at

**On Task Update**:
1. Validate task ID exists
2. If updating title: validate non-empty and length ≤ 200
3. If toggling completion: validate boolean value

**On Task Deletion**:
1. Validate task ID exists
2. Remove from storage

---

## Error Scenarios

| Scenario | Error Type | Message | HTTP Equivalent (for future) |
|----------|-----------|---------|------------------------------|
| Empty title | ValueError | "Task title cannot be empty" | 400 Bad Request |
| Title too long | ValueError | "Task title exceeds 200 characters" | 400 Bad Request |
| Task not found | KeyError | "Task with ID {id} not found" | 404 Not Found |
| Invalid UUID | ValueError | "Invalid task ID format" | 400 Bad Request |
| Duplicate ID | ValueError | "Task with ID {id} already exists" | 409 Conflict |

---

## Data Examples

### Valid Task States

**New Task (Incomplete)**:
```python
Task(
    id="f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title="Write project documentation",
    completed=False,
    created_at="2025-12-27T09:15:30.456789"
)
```

**Completed Task**:
```python
Task(
    id="f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title="Write project documentation",
    completed=True,
    created_at="2025-12-27T09:15:30.456789"
)
```

**Updated Task**:
```python
# Original
Task(id="abc...", title="Buy milk", completed=False, created_at="2025-12-27T10:00:00")

# After update
Task(id="abc...", title="Buy organic milk", completed=False, created_at="2025-12-27T10:00:00")
# Note: id and created_at unchanged
```

### Invalid Task States

**Empty Title**:
```python
# ❌ Invalid
Task(id="...", title="", completed=False, created_at="...")
Task(id="...", title="   ", completed=False, created_at="...")
```

**Title Too Long**:
```python
# ❌ Invalid (>200 characters)
Task(id="...", title="A" * 201, completed=False, created_at="...")
```

**Missing Required Fields**:
```python
# ❌ Invalid - missing title
Task(id="...", completed=False, created_at="...")
```

---

## Implementation Notes

### Python Dataclass Definition

```python
from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Task:
    """Represents a single todo item."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    completed: bool = False
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    def __post_init__(self):
        """Validate task data after initialization."""
        if not self.title or not self.title.strip():
            raise ValueError("Task title cannot be empty")
        if len(self.title) > 200:
            raise ValueError("Task title exceeds 200 characters")
        self.title = self.title.strip()
```

### Storage Class Interface

```python
from typing import List, Optional

class TaskStore:
    """In-memory storage for tasks."""

    def add_task(self, title: str) -> str:
        """Add a new task and return its ID."""
        pass

    def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by ID. Returns None if not found."""
        pass

    def list_tasks(self) -> List[Task]:
        """List all tasks in insertion order."""
        pass

    def update_task(self, task_id: str, title: str) -> Task:
        """Update a task's title. Raises KeyError if not found."""
        pass

    def mark_complete(self, task_id: str, completed: bool = True) -> Task:
        """Mark a task as complete/incomplete. Raises KeyError if not found."""
        pass

    def delete_task(self, task_id: str) -> None:
        """Delete a task. Raises KeyError if not found."""
        pass

    def count(self) -> int:
        """Return the total number of tasks."""
        pass
```

---

## Test Data

### Fixtures for Testing

```python
# Minimal valid task
{
    "id": "12345678-1234-1234-1234-123456789012",
    "title": "Test task",
    "completed": False,
    "created_at": "2025-12-27T12:00:00.000000"
}

# Edge case: maximum title length
{
    "id": "87654321-4321-4321-4321-210987654321",
    "title": "A" * 200,  # exactly 200 characters
    "completed": False,
    "created_at": "2025-12-27T12:00:00.000000"
}

# Edge case: single character title
{
    "id": "11111111-2222-3333-4444-555555555555",
    "title": "A",
    "completed": False,
    "created_at": "2025-12-27T12:00:00.000000"
}

# Completed task
{
    "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    "title": "Completed task",
    "completed": True,
    "created_at": "2025-12-27T12:00:00.000000"
}
```

---

## Future Evolution

### Phase II: Database Schema (PostgreSQL)

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### Phase V: Event Schema (Kafka)

```json
{
  "event_type": "task.created",
  "task_id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "timestamp": "iso8601",
  "metadata": {}
}
```

---

**Data model completed**: 2025-12-27
**Ready for**: Contract definitions (Phase 1 continued)
