# CLI Interface Contract

**Feature**: Console Todo Application
**Branch**: `001-console-todo`
**Date**: 2025-12-27

## Command Interface

### Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `add` | `<title>` | Add a new task |
| `list` | None | List all tasks |
| `complete` | `<task_id>` | Mark task as complete |
| `incomplete` | `<task_id>` | Mark task as incomplete |
| `update` | `<task_id> <new_title>` | Update task title |
| `delete` | `<task_id>` | Delete a task |

### Usage Examples

```bash
# Add task
python -m todo_app.main add "Buy groceries"

# List all tasks
python -m todo_app.main list

# Mark complete (supports partial ID matching, min 8 chars)
python -m todo_app.main complete f47ac10b

# Update task title
python -m todo_app.main update f47ac10b "Buy organic groceries"

# Delete task
python -m todo_app.main delete f47ac10b
```

### Output Format

**Success Messages**:
```
✓ Task added successfully
✓ Task marked as complete
✓ Task updated successfully
✓ Task deleted successfully
```

**Task List Format**:
```
Tasks (3):
  [○] f47ac10b... Buy groceries
  [✓] a3f2c1b0... Write documentation
  [○] 12345678... Call dentist
```

**Error Messages** (stderr):
```
Error: Task title cannot be empty
Error: Task title exceeds 200 characters
Error: Task with ID {id} not found
```

### Exit Codes

- `0` - Success
- `1` - Validation error or operation failed
- `130` - User interrupted (Ctrl+C)

### ID Handling

- Full UUID: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- Partial ID: Minimum 8 characters (e.g., `f47ac10b`)
- Display format: First 8 chars + `...` (e.g., `f47ac10b...`)
