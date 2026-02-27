# Data Model: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This document defines the data model and state management for the overdue todo items feature. The feature introduces derived state (overdue status) calculated from existing todo attributes without requiring database schema changes.

## Core Entities

### Todo Item (Existing)

The todo item entity already exists in the database and application. This feature uses existing fields without modifications.

**Schema** (SQLite - `todos` table):
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  dueDate TEXT,              -- ISO 8601 date string (YYYY-MM-DD) or NULL
  completed INTEGER NOT NULL DEFAULT 0,  -- 0 = not completed, 1 = completed
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

**Attributes**:
- `id`: Unique identifier (integer, auto-increment)
- `title`: Task description (string, max 255 chars, required)
- `dueDate`: Optional due date in ISO 8601 format (string `YYYY-MM-DD` or `null`)
- `completed`: Completion status (boolean represented as integer: 0 or 1)
- `createdAt`: Timestamp when todo was created (ISO 8601 string)

**Validation Rules**:
- `title`: Required, non-empty string, max 255 characters
- `dueDate`: Optional, must be valid ISO 8601 date string if provided
- `completed`: Must be 0 (false) or 1 (true)

**Note**: No schema changes required. The feature uses existing `dueDate` and `completed` fields.

### Overdue Status (Derived State - New)

The overdue status is **derived state** calculated on the client-side from todo attributes. It is not stored in the database.

**Calculation Logic**:
```javascript
isOverdue = (dueDate !== null) 
         && (completed === false) 
         && (dueDate < currentDate)
```

**Attributes**:
- `isOverdue`: Boolean indicating if todo is overdue
- `overdueDays`: Integer representing days overdue (null if not overdue)
- `overdueText`: Formatted string (e.g., "3 days overdue") for display

**Calculation Rules**:
1. **No due date** → NOT overdue (`isOverdue = false`)
2. **Completed** → NOT overdue (regardless of due date)
3. **Due date today** → NOT overdue (boundary condition)
4. **Due date in future** → NOT overdue
5. **Due date in past AND not completed** → IS overdue (`isOverdue = true`)

**Date Comparison**:
- Uses client browser's local date (user's timezone)
- Compares dates only (ignores time component)
- "Current date" = today at 00:00:00 local time
- "Due date" = dueDate at 00:00:00 local time

**Duration Calculation**:
```javascript
overdueDays = Math.floor((currentDate - dueDate) / millisecondsPerDay)
```
- Always expressed in days (no weeks/months)
- Minimum value: 1 (for tasks due yesterday)
- No maximum (can be hundreds of days)

## State Transitions

### Overdue State Lifecycle

```
┌─────────────────┐
│  Todo Created   │
│  (no due date)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Not Overdue   │ ◄──────────┐
│  (dueDate null  │            │
│   or future)    │            │
└────────┬────────┘            │
         │                     │
         │ (date changes       │
         │  from future        │ (completed
         │  to past)           │  toggled)
         ▼                     │
┌─────────────────┐            │
│    Overdue      │ ───────────┘
│  (dueDate past  │
│  & !completed)  │
└─────────────────┘
         │
         │ (completed
         │  toggled)
         ▼
┌─────────────────┐
│   Completed     │
│  (never shown   │
│   as overdue)   │
└─────────────────┘
```

### Transition Triggers

| From State    | To State      | Trigger                                      | Timing          |
|---------------|---------------|----------------------------------------------|-----------------|
| Not Overdue   | Overdue       | Current date advances past due date          | Midnight local  |
| Not Overdue   | Overdue       | User edits due date to past date             | Immediate       |
| Overdue       | Not Overdue   | User marks todo as completed                 | Immediate       |
| Overdue       | Not Overdue   | User edits due date to future date           | Immediate       |
| Any           | Not Overdue   | User removes due date                        | Immediate       |

### State Update Timing

**Automatic updates**:
- When todo list re-renders (calculates overdue on each render)
- When user completes a todo (triggers re-render)
- When user edits due date (triggers re-render)
- When component mounts (first render calculates state)

**Midnight transitions**:
- Overdue status automatically updates when user next views the app
- No background workers or timers needed
- Relies on user accessing the app to see updated state
- Browser's date automatically advances to new day

**Performance**: Date calculations are fast (< 1ms per todo). No caching or memoization needed for typical use (< 1000 todos).

## Data Flow

### Client-Side Data Flow (Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. API Fetch:                                              │
│     todoService.getTodos()                                  │
│     → Returns: [{ id, title, dueDate, completed, ... }]    │
│                                                             │
│  2. State Storage (App.js):                                 │
│     const [todos, setTodos] = useState([])                  │
│                                                             │
│  3. Overdue Calculation (TodoList.js):                      │
│     const todosWithStatus = todos.map(todo => ({           │
│       ...todo,                                              │
│       isOverdue: isOverdue(todo.dueDate, todo.completed),  │
│       overdueDays: getOverdueDays(todo.dueDate)            │
│     }))                                                     │
│                                                             │
│  4. Render (TodoCard.js):                                   │
│     {todo.isOverdue && <OverdueIndicator days={...} />}    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.js (root)
  │
  ├── State: todos[] (from API)
  │
  └── TodoList.js
        │
        ├── Computes: todosWithStatus[] (adds isOverdue, overdueDays)
        │
        └── TodoCard.js (foreach todo)
              │
              ├── Props: todo.isOverdue, todo.overdueDays
              │
              └── Renders: Visual indicators if isOverdue
```

### Utility Functions (Pure)

Located in `frontend/src/utils/dateUtils.js`:

```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - ISO 8601 date string
 * @param {boolean} completed - Completion status
 * @returns {boolean} True if overdue, false otherwise
 */
export const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};

/**
 * Calculates days overdue
 * @param {string} dueDate - ISO 8601 date string
 * @returns {number} Number of days overdue
 */
export const getOverdueDays = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Formats overdue duration text
 * @param {number} days - Number of days overdue
 * @returns {string} Formatted text (e.g., "3 days overdue")
 */
export const formatOverdueText = (days) => {
  return `${days} ${days === 1 ? 'day' : 'days'} overdue`;
};
```

## Backend Considerations

**No backend changes required** for this feature:
- Existing API endpoints (`GET /todos`, `PUT /todos/:id`, etc.) remain unchanged
- Backend returns todos with `dueDate` and `completed` fields as-is
- Overdue calculation happens entirely on the client-side
- No new API endpoints or database queries needed

**Rationale**: 
- Specification requires client-side date comparison (user's timezone)
- Avoids server timezone complexity
- Reduces API changes and backend testing scope
- Follows existing architecture pattern (client-side presentation logic)

## Edge Cases & Validation

### Edge Case Handling

| Edge Case                          | Expected Behavior                          | Implementation                |
|------------------------------------|--------------------------------------------|------------------------------ |
| Todo with no due date              | Not overdue                                | `isOverdue` returns `false`   |
| Todo completed with past due date  | Not overdue (completion takes precedence)  | Check `completed` first       |
| Due date is today                  | Not overdue (boundary condition)           | Use `<` comparison (not `<=`) |
| Due date is null string `""`       | Treated as no due date                     | Falsy check handles this      |
| Invalid date string                | Treated as no due date                     | `new Date(invalid)` → Invalid Date, caught by validation |
| System clock incorrect             | Overdue based on system clock anyway       | Documented limitation         |
| Todo 1 day overdue                 | Shows "1 day overdue" (singular)           | Pluralization logic           |
| Todo 365 days overdue              | Shows "365 days overdue"                   | No unit conversion            |
| Midnight boundary crossing         | Updates on next view (no auto-refresh)     | Calculated on render          |

### Input Validation

**Frontend validation** (before API call):
- Due date must be valid date string or null
- Todo must have ID for edit operations
- Completed must be boolean

**Backend validation** (existing, unchanged):
- Title: non-empty, max 255 chars
- DueDate: valid ISO 8601 or null
- Completed: 0 or 1 (integer boolean)

## Testing Data Model

### Test Fixtures

Create fixture todos with known dates for consistent testing:

```javascript
// Test fixtures (dateUtils.test.js)
const TODAY = '2026-02-27';
const YESTERDAY = '2026-02-26';
const TWO_DAYS_AGO = '2026-02-25';
const TOMORROW = '2026-02-28';
const ONE_WEEK_AGO = '2026-02-20';

const fixtures = {
  overdueTodo: {
    id: 1,
    title: 'Overdue task',
    dueDate: YESTERDAY,
    completed: false
  },
  completedOverdueTodo: {
    id: 2,
    title: 'Completed old task',
    dueDate: ONE_WEEK_AGO,
    completed: true  // Should NOT show as overdue
  },
  futureTodo: {
    id: 3,
    title: 'Future task',
    dueDate: TOMORROW,
    completed: false  // Should NOT show as overdue
  },
  noDueDateTodo: {
    id: 4,
    title: 'Task without date',
    dueDate: null,
    completed: false  // Should NOT show as overdue
  },
  todayTodo: {
    id: 5,
    title: 'Due today',
    dueDate: TODAY,
    completed: false  // Should NOT show as overdue
  }
};
```

### Test Coverage Requirements

Per constitution (80%+ coverage target):

- ✅ Unit tests: `dateUtils.js` functions (100% coverage expected)
- ✅ Component tests: TodoCard overdue rendering (branches: overdue/not overdue)
- ✅ Integration tests: TodoList → TodoCard data flow
- ✅ Edge cases: All scenarios in edge case table above

## Performance Characteristics

**Computational Complexity**:
- `isOverdue`: O(1) - constant time date comparison
- `getOverdueDays`: O(1) - constant time arithmetic
- `formatOverdueText`: O(1) - string template

**Memory Usage**:
- Minimal: adds 2 fields per todo (isOverdue: boolean, overdueDays: number)
- For 100 todos: ~800 bytes additional memory
- For 1000 todos: ~8 KB additional memory

**Rendering Performance**:
- No expensive re-renders (derived state computed in parent)
- No animations or transitions to optimize
- Visual indicators are static DOM elements

**Caching**: Not required for typical use cases (< 1000 todos).

## Future Extensibility

**Potential enhancements** (out of scope for current feature):

1. **Notification system**: Alert users when tasks become overdue
2. **Sort by overdue**: Filter/sort todos by overdue status
3. **Overdue summary**: Dashboard showing count of overdue items
4. **Custom overdue thresholds**: Define "soon overdue" (1-3 days before)
5. **Recurring tasks**: Overdue logic for tasks that repeat

**Architecture supports**: Current design with pure utility functions and derived state makes these extensions feasible without major refactoring.

## Summary

- **No database changes**: Uses existing `dueDate` and `completed` fields
- **Derived state**: Overdue calculated client-side on each render
- **Pure functions**: Date utilities are testable and reusable
- **Simple data flow**: API → State → Calculate → Render
- **Performance**: Fast date calculations (< 1ms per todo)
- **Extensible**: Clean separation allows future enhancements
