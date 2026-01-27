# Data Model: AI Todo Chatbot Integration

**Feature**: 001-ai-chatbot
**Date**: 2026-01-25
**Phase**: Phase 1 - Data Model Design

## Overview

This document defines the database schema for the AI chatbot feature, including new tables for conversation persistence and their relationships with existing entities.

## New Tables

### Conversation

Represents a chat session between a user and the AI assistant.

**Table Name**: `conversations`

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique conversation identifier |
| user_id | VARCHAR(255) | NOT NULL, FOREIGN KEY → users(id) | Owner of the conversation |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When conversation was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last message timestamp (auto-update) |

**Indexes**:
- `idx_conversation_user_id` on `user_id` (for efficient user conversation queries)
- `idx_conversation_updated_at` on `updated_at` (for sorting by recent activity)

**Relationships**:
- Many-to-One with User (user_id → users.id)
- One-to-Many with Message (id ← messages.conversation_id)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
```

---

### Message

Represents a single message within a conversation (user or assistant).

**Table Name**: `messages`

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique message identifier |
| conversation_id | UUID | NOT NULL, FOREIGN KEY → conversations(id) | Parent conversation |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('user', 'assistant') | Message sender role |
| content | TEXT | NOT NULL | Message text content |
| tool_calls | JSONB | NULLABLE | Tool invocation details (JSON array) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When message was sent |

**Indexes**:
- `idx_message_conversation_id` on `conversation_id` (for loading conversation history)
- `idx_message_created_at` on `created_at` (for chronological ordering)
- Composite index: `idx_message_conversation_created` on `(conversation_id, created_at)` (optimized history queries)

**Relationships**:
- Many-to-One with Conversation (conversation_id → conversations.id)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str = Field(sa_column=Column(TEXT))
    tool_calls: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    class Config:
        arbitrary_types_allowed = True
```

---

## Existing Tables (No Changes)

### Task

The existing Task table remains unchanged. The chatbot accesses tasks through MCP tools, which use the existing task service layer.

**Table Name**: `tasks`

**Columns** (reference only, no modifications):
- id: UUID (PRIMARY KEY)
- user_id: VARCHAR(255) (FOREIGN KEY → users.id)
- title: VARCHAR(500)
- completed: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Note**: MCP tools will query tasks filtered by user_email/user_id to ensure multi-tenant isolation.

---

## Entity Relationships

```
User (existing)
  ├─→ Conversation (new, one-to-many)
  │     └─→ Message (new, one-to-many)
  └─→ Task (existing, one-to-many)
```

**Key Points**:
- Users can have multiple conversations
- Each conversation belongs to exactly one user
- Each conversation can have many messages
- Each message belongs to exactly one conversation
- Tasks are accessed via MCP tools (no direct relationship to conversations)

---

## Data Access Patterns

### Pattern 1: Load Conversation History

**Query**: Fetch most recent 50 messages for a conversation

```sql
SELECT id, role, content, tool_calls, created_at
FROM messages
WHERE conversation_id = :conversation_id
ORDER BY created_at DESC
LIMIT 50;
```

**Index Used**: `idx_message_conversation_created` (composite index)

**Performance**: O(log n) lookup + sequential scan of 50 rows

---

### Pattern 2: Create New Message

**Query**: Insert message and update conversation timestamp

```sql
-- Insert message
INSERT INTO messages (id, conversation_id, role, content, tool_calls, created_at)
VALUES (:id, :conversation_id, :role, :content, :tool_calls, NOW());

-- Update conversation timestamp (automatic via onupdate trigger)
```

**Index Used**: Primary key insert

**Performance**: O(log n) insert

---

### Pattern 3: List User Conversations

**Query**: Fetch all conversations for a user, sorted by recent activity

```sql
SELECT id, created_at, updated_at
FROM conversations
WHERE user_id = :user_id
ORDER BY updated_at DESC
LIMIT 20;
```

**Index Used**: `idx_conversation_user_id` + `idx_conversation_updated_at`

**Performance**: O(log n) lookup + sequential scan of 20 rows

---

### Pattern 4: Validate Conversation Ownership

**Query**: Check if conversation belongs to user

```sql
SELECT id
FROM conversations
WHERE id = :conversation_id AND user_id = :user_id;
```

**Index Used**: Primary key + `idx_conversation_user_id`

**Performance**: O(log n) lookup

---

## Migration Scripts

### Alembic Migration: Create Conversations and Messages Tables

```python
"""Add conversations and messages tables for AI chatbot

Revision ID: 001_chatbot_tables
Revises: <previous_revision>
Create Date: 2026-01-25
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001_chatbot_tables'
down_revision = '<previous_revision>'
branch_labels = None
depends_on = None

def upgrade():
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', sa.String(255), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP, server_default=sa.func.now(), nullable=False),
    )

    # Create indexes for conversations
    op.create_index('idx_conversation_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversation_updated_at', 'conversations', ['updated_at'])

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('conversations.id'), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('content', sa.TEXT, nullable=False),
        sa.Column('tool_calls', postgresql.JSONB, nullable=True),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("role IN ('user', 'assistant')", name='check_message_role')
    )

    # Create indexes for messages
    op.create_index('idx_message_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_message_created_at', 'messages', ['created_at'])
    op.create_index('idx_message_conversation_created', 'messages', ['conversation_id', 'created_at'])

def downgrade():
    op.drop_index('idx_message_conversation_created', table_name='messages')
    op.drop_index('idx_message_created_at', table_name='messages')
    op.drop_index('idx_message_conversation_id', table_name='messages')
    op.drop_table('messages')

    op.drop_index('idx_conversation_updated_at', table_name='conversations')
    op.drop_index('idx_conversation_user_id', table_name='conversations')
    op.drop_table('conversations')
```

---

## Data Validation Rules

### Conversation Validation

- `user_id` must reference existing user
- `created_at` and `updated_at` must be valid timestamps
- `updated_at` must be >= `created_at`

### Message Validation

- `conversation_id` must reference existing conversation
- `role` must be either 'user' or 'assistant'
- `content` must not be empty (min length: 1 character)
- `content` max length: 10,000 characters (reasonable limit for chat messages)
- `tool_calls` must be valid JSON if provided
- `created_at` must be valid timestamp

---

## Storage Estimates

### Assumptions

- Average message length: 200 characters
- Average tool_calls JSON: 100 characters (when present, ~30% of messages)
- Messages per conversation: 50 (average)
- Conversations per user: 5 (average)
- Active users: 1000

### Storage Calculations

**Per Message**:
- Fixed columns (id, conversation_id, role, created_at): ~60 bytes
- content (200 chars avg): ~200 bytes
- tool_calls (30% of messages, 100 chars): ~30 bytes (amortized)
- Total per message: ~290 bytes

**Per Conversation**:
- Fixed columns: ~80 bytes
- 50 messages: 50 × 290 = 14,500 bytes
- Total per conversation: ~14.6 KB

**Total Storage (1000 users)**:
- 1000 users × 5 conversations × 14.6 KB = ~73 MB
- With indexes: ~100 MB
- Growth rate: ~10 MB per 1000 new conversations

**Conclusion**: Storage requirements are minimal. No partitioning or archival strategy needed initially.

---

## Performance Considerations

### Query Optimization

1. **Conversation History Loading**: Composite index on (conversation_id, created_at) ensures fast retrieval
2. **User Conversation List**: Separate indexes on user_id and updated_at for efficient sorting
3. **Message Insertion**: Primary key index handles inserts efficiently

### Scaling Strategy

- **Current Scale**: Handles 10,000 users with <1GB storage
- **Future Scale**: If conversations exceed 100,000, consider:
  - Partitioning messages table by created_at (monthly partitions)
  - Archiving conversations older than 6 months to cold storage
  - Implementing conversation cleanup policy (optional)

### Connection Pooling

- Use asyncpg with connection pool (min: 10, max: 50 connections)
- Ensures efficient database access under concurrent load

---

## Security Considerations

### Data Isolation

- All queries MUST filter by user_id from JWT
- Conversation ownership validated before access
- No cross-user data leakage possible with proper filtering

### Data Retention

- No automatic deletion (conversations retained indefinitely)
- Users can manually delete conversations (future feature)
- GDPR compliance: Provide data export and deletion endpoints (future)

### Sensitive Data

- Messages may contain sensitive task information
- Encrypt database at rest (Neon PostgreSQL default)
- Use SSL/TLS for all database connections
- Never log message content in application logs

---

## Summary

The data model introduces two new tables (Conversation and Message) that integrate seamlessly with the existing schema. The design prioritizes:

1. **Performance**: Optimized indexes for common query patterns
2. **Scalability**: Efficient storage with clear growth projections
3. **Security**: User isolation enforced at database level
4. **Simplicity**: Minimal schema changes, no modifications to existing tables
5. **Flexibility**: Supports multiple conversations per user for future features

The schema is ready for implementation via Alembic migrations.
