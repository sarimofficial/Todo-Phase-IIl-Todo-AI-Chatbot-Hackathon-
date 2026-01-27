# Research & Architectural Decisions: AI Todo Chatbot Integration

**Feature**: 001-ai-chatbot
**Date**: 2026-01-25
**Phase**: Phase 0 - Research

## Overview

This document captures all architectural decisions made during the planning phase for the AI Todo Chatbot integration. Each decision includes the chosen approach, rationale, alternatives considered, and implementation impact.

## Decision 1: Cohere Model Selection

**Decision**: Use `command-r-plus` model

**Rationale**:
- Superior reasoning capabilities for complex natural language understanding
- Better tool-use accuracy (critical for reliable task operations)
- Handles multi-step queries more reliably
- Slightly higher latency acceptable for quality gains

**Alternatives Considered**:
- `command-r`: Faster (lower latency) but less accurate for complex queries
- `command-r-plus`: Chosen for flagship quality over speed

**Impact**: All Cohere API calls will use `command-r-plus` model parameter

**Implementation Notes**:
```python
import cohere
co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
response = co.chat(
    model="command-r-plus",  # Use command-r-plus for superior reasoning
    message=user_message,
    chat_history=conversation_history
)
```

---

## Decision 2: Tool Call Parsing Strategy

**Decision**: Strict JSON block extraction with validation

**Rationale**:
- Ensures reliable tool invocation (no ambiguous parsing)
- Cohere can be prompted to output structured JSON in code blocks
- Validation catches malformed responses early
- Cleaner error handling and debugging

**Alternatives Considered**:
- Regex fallback: More forgiving but error-prone and harder to maintain
- Strict parsing: Chosen for reliability and maintainability

**Implementation Notes**:
```python
# Prompt Cohere to output tool calls as:
# ```json
# {"tool": "add_task", "params": {"title": "Buy groceries", "user_email": "user@example.com"}}
# ```

import json
import re

def extract_tool_call(response_text: str) -> dict | None:
    # Extract JSON from code block
    match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
    if not match:
        return None

    try:
        tool_call = json.loads(match.group(1))
        # Validate structure
        if "tool" in tool_call and "params" in tool_call:
            return tool_call
    except json.JSONDecodeError:
        return None

    return None
```

---

## Decision 3: Multi-Step Operation Chaining

**Decision**: Iterative loop - execute tools and feed results back to Cohere until final response

**Rationale**:
- Enables complex queries like "List pending tasks then delete the first one"
- Cohere can reason about tool results and decide next action
- More intelligent than single-pass execution
- Aligns with agent-style behavior

**Alternatives Considered**:
- Single Cohere call: Simpler but can't handle multi-step queries
- Iterative loop: Chosen for intelligence and user experience

**Implementation Flow**:
1. User sends message
2. Call Cohere with message + history + tool definitions
3. If response contains tool call → execute tool → feed result back to Cohere (goto step 2)
4. If response is final text → return to user
5. Max iterations: 5 (prevent infinite loops)

**Implementation Notes**:
```python
async def process_chat_message(message: str, conversation_id: str, user_email: str):
    max_iterations = 5
    iteration = 0

    while iteration < max_iterations:
        # Call Cohere
        response = await cohere_service.chat(message, conversation_id)

        # Check for tool call
        tool_call = extract_tool_call(response.text)
        if not tool_call:
            # Final response - return to user
            return response.text

        # Execute tool
        tool_result = await execute_tool(tool_call, user_email)

        # Feed result back to Cohere
        message = f"Tool result: {json.dumps(tool_result)}"
        iteration += 1

    # Max iterations reached
    return "I'm having trouble completing this request. Please try breaking it into smaller steps."
```

---

## Decision 4: Conversation Persistence Strategy

**Decision**: Optional conversation_id - create new if not provided, support resuming via ID

**Rationale**:
- Flexibility: Users can start fresh or continue existing conversations
- Simplicity: Frontend doesn't need to manage conversation IDs initially
- Scalability: Supports multiple conversations per user in future

**Alternatives Considered**:
- Single conversation per user: Too restrictive, doesn't support multiple chat sessions
- Always new conversation: Loses context unnecessarily
- Optional conversation_id: Chosen for best user experience and flexibility

**Implementation Notes**:
```python
async def handle_chat_request(user_id: str, message: str, conversation_id: str | None):
    if conversation_id:
        # Resume existing conversation
        conversation = await get_conversation(conversation_id, user_id)
        if not conversation:
            raise HTTPException(404, "Conversation not found")
    else:
        # Create new conversation
        conversation = await create_conversation(user_id)

    # Process message...
    return {"conversation_id": conversation.id, "response": response_text}
```

---

## Decision 5: Frontend Chat Panel Layout

**Decision**: Slide-in panel from bottom-right with glassmorphic card

**Rationale**:
- Premium aesthetic matches flagship UI design
- Non-intrusive (doesn't block main content)
- Familiar pattern (similar to support chat widgets)
- Responsive (full-screen on mobile)

**Alternatives Considered**:
- Full bottom sheet: Too intrusive on desktop, blocks content
- Side panel: Conflicts with potential sidebar navigation
- Bottom-right slide-in: Chosen for elegance and usability

**Specifications**:
- Desktop: 400px × 600px, fixed bottom-right, 24px margins
- Mobile: Full-screen overlay with slide-up animation
- Glassmorphic: backdrop-blur, semi-transparent background, subtle shadow

**Implementation Notes**:
```tsx
// ChatPanel.tsx
<div className={`
  fixed bottom-24 right-6
  w-[400px] h-[600px]
  bg-white/90 dark:bg-gray-900/90
  backdrop-blur-lg
  rounded-2xl shadow-2xl
  md:block
  ${isOpen ? 'translate-y-0' : 'translate-y-full'}
  transition-transform duration-300
`}>
  {/* Chat content */}
</div>
```

---

## Decision 6: Message Rendering Strategy

**Decision**: Plain text with markdown support for formatting

**Rationale**:
- Simple and secure (no XSS risk with proper sanitization)
- Markdown allows basic formatting (bold, lists, code blocks)
- Cohere can output markdown naturally
- Lightweight rendering (no heavy rich-text editor)

**Alternatives Considered**:
- Rich HTML: Security risk, over-engineered for chat use case
- Plain text only: Too limiting for formatted responses
- Markdown: Chosen for balance of simplicity and expressiveness

**Implementation Notes**:
```tsx
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

function MessageBubble({ content, role }) {
  const sanitized = DOMPurify.sanitize(content);

  return (
    <div className={role === 'user' ? 'user-message' : 'assistant-message'}>
      <ReactMarkdown>{sanitized}</ReactMarkdown>
    </div>
  );
}
```

---

## Decision 7: Error Handling & Retry Strategy

**Decision**: Single automatic retry for Cohere API failures, then graceful error message

**Rationale**:
- Handles transient network issues
- Avoids user frustration from temporary failures
- Single retry prevents excessive latency
- Clear error messages maintain trust

**Implementation Notes**:
```python
async def call_cohere_with_retry(message: str, max_retries: int = 1):
    for attempt in range(max_retries + 1):
        try:
            response = await cohere_client.chat(message=message)
            return response
        except cohere.CohereAPIError as e:
            if attempt < max_retries:
                await asyncio.sleep(1)  # Exponential backoff
                continue
            else:
                logger.error(f"Cohere API failed after {max_retries} retries: {e}")
                raise HTTPException(
                    500,
                    "I'm having trouble connecting. Please try again."
                )
```

---

## Decision 8: Rate Limiting Implementation

**Decision**: Token bucket algorithm with 60 requests/minute per user

**Rationale**:
- Prevents abuse and excessive Cohere API costs
- 60 req/min = 1 per second average (reasonable for chat)
- Token bucket allows bursts (better UX than fixed window)
- Per-user isolation prevents one user affecting others

**Implementation Notes**:
```python
from fastapi import Request, HTTPException
from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, rate: int = 60, per: int = 60):
        self.rate = rate  # tokens
        self.per = per    # seconds
        self.buckets = defaultdict(lambda: {"tokens": rate, "last_update": time.time()})

    def check_rate_limit(self, user_id: str) -> bool:
        bucket = self.buckets[user_id]
        now = time.time()

        # Refill tokens
        elapsed = now - bucket["last_update"]
        bucket["tokens"] = min(self.rate, bucket["tokens"] + elapsed * (self.rate / self.per))
        bucket["last_update"] = now

        # Check if request allowed
        if bucket["tokens"] >= 1:
            bucket["tokens"] -= 1
            return True
        return False

rate_limiter = RateLimiter(rate=60, per=60)

async def rate_limit_middleware(request: Request, call_next):
    user_id = extract_user_id_from_jwt(request)
    if not rate_limiter.check_rate_limit(user_id):
        raise HTTPException(429, "Too many requests. Please wait a moment.")
    return await call_next(request)
```

---

## Decision 9: Conversation History Context Window

**Decision**: Load most recent 50 messages for Cohere context

**Rationale**:
- Balances context quality with API token limits
- 50 messages ≈ 10-15 exchanges (sufficient for most conversations)
- Prevents excessive token usage and latency
- Older messages unlikely to be relevant

**Implementation Notes**:
```python
async def load_conversation_history(conversation_id: str, limit: int = 50):
    messages = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )

    # Reverse to chronological order
    messages = list(reversed(messages.scalars().all()))

    # Format for Cohere
    chat_history = [
        {"role": msg.role, "message": msg.content}
        for msg in messages
    ]

    return chat_history
```

---

## Decision 10: Tool Parameter Validation

**Decision**: Strict validation with Pydantic models for all tool parameters

**Rationale**:
- Type safety prevents runtime errors
- Clear error messages for invalid parameters
- Automatic validation with FastAPI/Pydantic
- Self-documenting code

**Implementation Notes**:
```python
from pydantic import BaseModel, Field, validator

class AddTaskParams(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Task title")
    user_email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$", description="User email from JWT")

    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace")
        return v.strip()

class ListTasksParams(BaseModel):
    user_email: str = Field(..., description="User email from JWT")
    status: str = Field(default="all", pattern="^(pending|completed|all)$")

# Tool executor validates params before execution
async def execute_add_task(params: dict, user_email: str):
    validated_params = AddTaskParams(**params, user_email=user_email)
    # Execute tool with validated params
    task = await task_service.create_task(validated_params.title, validated_params.user_email)
    return {"status": "success", "task_id": task.id, "message": f"Task '{task.title}' created"}
```

---

## Summary

All 10 architectural decisions have been documented with clear rationale, alternatives considered, and implementation guidance. These decisions form the foundation for the implementation phase and ensure:

1. **Quality**: command-r-plus model for superior reasoning
2. **Reliability**: Strict parsing and validation throughout
3. **Intelligence**: Multi-step tool chaining for complex queries
4. **Flexibility**: Optional conversation persistence
5. **Aesthetics**: Premium glassmorphic UI design
6. **Security**: Markdown rendering with sanitization
7. **Resilience**: Automatic retry with graceful errors
8. **Protection**: Rate limiting to prevent abuse
9. **Efficiency**: Optimized context window (50 messages)
10. **Safety**: Pydantic validation for all tool parameters

These decisions align with Phase III constitutional requirements and ensure the chatbot delivers flagship-quality user experience.
