# Quick Start Guide: Console Todo Application

**Feature**: Console Todo Application (Phase I)
**Branch**: `001-console-todo`
**Date**: 2025-12-27

## Prerequisites

- **Python**: 3.13 or higher
- **UV**: Fast Python package manager
- **Platform**: Windows, Linux, or macOS

### Install UV

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Verify installation
uv --version
```

---

## Setup

### 1. Clone Repository (if applicable)

```bash
cd "F:\Projects\GIAIC Q4 Projects\Hackathone II"
git checkout 001-console-todo
```

### 2. Initialize Project

```bash
# Navigate to project root
cd "F:\Projects\GIAIC Q4 Projects\Hackathone II"

# UV will auto-detect Python 3.13+ or install it
uv python install 3.13

# Sync dependencies (creates venv automatically)
uv sync
```

### 3. Project Structure

```
Hackathone II/
├── src/
│   └── todo_app/
│       ├── __init__.py
│       ├── models.py
│       ├── storage.py
│       ├── cli.py
│       └── main.py
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_storage.py
│   └── test_cli.py
├── specs/001-console-todo/
│   ├── spec.md
│   ├── plan.md
│   └── ...
├── pyproject.toml
└── README.md
```

---

## Usage

### Run Todo App

```bash
# Using UV (recommended)
uv run python -m todo_app.main <command> [args]

# Examples:
uv run python -m todo_app.main add "Buy groceries"
uv run python -m todo_app.main list
uv run python -m todo_app.main complete f47ac10b
```

### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `add <title>` | Add a new task | `add "Buy milk"` |
| `list` | List all tasks | `list` |
| `complete <id>` | Mark task complete | `complete f47ac10b` |
| `incomplete <id>` | Mark task incomplete | `incomplete f47ac10b` |
| `update <id> <title>` | Update task title | `update f47ac10b "Buy organic milk"` |
| `delete <id>` | Delete a task | `delete f47ac10b` |

### Task ID Shortcuts

You can use partial IDs (minimum 8 characters):

```bash
# Full UUID
uv run python -m todo_app.main complete f47ac10b-58cc-4372-a567-0e02b2c3d479

# Short version (8+ chars)
uv run python -m todo_app.main complete f47ac10b
```

---

## Development

### Run Tests

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=todo_app --cov-report=term-missing

# Run specific test file
uv run pytest tests/test_models.py

# Run with verbose output
uv run pytest -v
```

### Code Style

```bash
# Format code (if black installed)
uv run black src/

# Check types (if mypy installed)
uv run mypy src/
```

### Project Dependencies

```bash
# Add new dependency
uv add <package-name>

# Add dev dependency
uv add --dev <package-name>

# Update dependencies
uv sync

# Show installed packages
uv pip list
```

---

## Examples

### Basic Workflow

```bash
# 1. Add some tasks
uv run python -m todo_app.main add "Buy groceries"
uv run python -m todo_app.main add "Write documentation"
uv run python -m todo_app.main add "Call dentist"

# 2. List all tasks
uv run python -m todo_app.main list
# Output:
# Tasks (3):
#   [○] f47ac10b... Buy groceries
#   [○] a3f2c1b0... Write documentation
#   [○] 12345678... Call dentist

# 3. Complete a task
uv run python -m todo_app.main complete f47ac10b
# Output:
# ✓ Task marked as complete
# ID: f47ac10b
# Title: Buy groceries

# 4. List again to see status
uv run python -m todo_app.main list
# Output:
# Tasks (3):
#   [✓] f47ac10b... Buy groceries
#   [○] a3f2c1b0... Write documentation
#   [○] 12345678... Call dentist

# 5. Update a task
uv run python -m todo_app.main update a3f2c1b0 "Write comprehensive documentation"
# Output:
# ✓ Task updated successfully
# ID: a3f2c1b0
# Old Title: Write documentation
# New Title: Write comprehensive documentation

# 6. Delete a task
uv run python -m todo_app.main delete 12345678
# Output:
# ✓ Task deleted successfully
# ID: 12345678
# Title: Call dentist
```

### Error Handling Examples

```bash
# Empty title
uv run python -m todo_app.main add ""
# Error: Task title cannot be empty

# Task not found
uv run python -m todo_app.main complete 99999999
# Error: Task with ID 99999999 not found

# Title too long
uv run python -m todo_app.main add "$(python -c 'print("A"*201)')"
# Error: Task title exceeds 200 characters
```

---

## Troubleshooting

### UV Not Found

```bash
# Ensure UV is in PATH
export PATH="$HOME/.cargo/bin:$PATH"  # Linux/macOS

# Windows: Add to PATH environment variable
# C:\Users\<YourUsername>\.cargo\bin
```

### Python Version Issues

```bash
# Check Python version
python --version

# UV can install Python for you
uv python install 3.13

# Use specific Python version
uv python pin 3.13
```

### Import Errors

```bash
# Ensure you're in project root
cd "F:\Projects\GIAIC Q4 Projects\Hackathone II"

# Sync dependencies
uv sync

# Verify package installed in editable mode
uv pip list | grep todo-app
```

### Test Failures

```bash
# Run with verbose output
uv run pytest -v

# Run specific failing test
uv run pytest tests/test_models.py::test_task_creation -v

# Clear pytest cache
rm -rf .pytest_cache __pycache__
```

---

## Important Notes

### Data Persistence

⚠️ **In-Memory Storage**: All tasks are stored in memory and **lost when the application exits**. This is by design for Phase I.

### Session-Based

- Each command execution is a separate session
- Tasks exist only during runtime
- Future phases will add persistent storage (database)

### Character Encoding

- Uses UTF-8 encoding
- Supports emojis and special characters in task titles
- Terminal must support UTF-8 for symbols (✓, ○)

---

## Next Steps

After mastering the console app:

1. **Phase II**: Migrate to web application (Next.js + FastAPI)
2. **Phase III**: Add AI chatbot with MCP tools
3. **Phase IV**: Deploy to local Kubernetes
4. **Phase V**: Cloud deployment with Kafka & Dapr

---

## Resources

- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **CLI Interface**: [contracts/cli-interface.md](./contracts/cli-interface.md)
- **Research**: [research.md](./research.md)

---

## Support

For issues or questions:
1. Check specification documents
2. Review test cases in `tests/` directory
3. Consult constitution: `.specify/memory/constitution.md`

---

**Quick Start Guide Version**: 1.0.0
**Created**: 2025-12-27
**For**: Phase I - Console Todo Application
