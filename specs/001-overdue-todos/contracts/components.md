# Component Contracts: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This document defines the public interface contracts for React components modified or created for the overdue todo items feature. These contracts specify prop signatures, expected behaviors, and component responsibilities.

## TodoCard Component (Modified)

**File**: `packages/frontend/src/components/TodoCard.js`

### Props Interface

```javascript
/**
 * TodoCard component props
 * @typedef {Object} TodoCardProps
 * @property {Object} todo - Todo item object
 * @property {number} todo.id - Unique identifier
 * @property {string} todo.title - Task description
 * @property {string|null} todo.dueDate - Due date (ISO 8601) or null
 * @property {boolean} todo.completed - Completion status
 * @property {boolean} todo.isOverdue - Whether todo is overdue (NEW)
 * @property {number|null} todo.overdueDays - Days overdue or null (NEW)
 * @property {Function} onToggle - Callback when completion status toggled
 * @property {Function} onEdit - Callback when todo edited
 * @property {Function} onDelete - Callback when todo deleted
 * @property {boolean} isLoading - Loading state for async operations
 */
```

### New Props (Added for Overdue Feature)

| Prop Name       | Type           | Required | Default | Description                                    |
|-----------------|----------------|----------|---------|------------------------------------------------|
| `todo.isOverdue` | `boolean`     | Yes      | N/A     | Whether the todo is currently overdue          |
| `todo.overdueDays` | `number|null` | Yes    | `null`  | Number of days overdue (null if not overdue)   |

### Behavioral Contract

**Rendering Rules**:
1. If `todo.isOverdue === true`:
   - Display overdue visual indicators (icon, text, styling)
   - Apply `.todo-card--overdue` CSS class
   - Render warning icon (⚠️) with aria-label
   - Display formatted overdue text (e.g., "3 days overdue")

2. If `todo.isOverdue === false`:
   - Do NOT display any overdue indicators
   - Use standard todo card styling

3. Overdue indicators must be visually distinct:
   - Red text color (CSS variable: `--color-error`)
   - Warning icon (⚠️) included
   - Duration text visible

### Accessibility Requirements

- Warning icon MUST have `aria-label="Overdue warning"`
- Overdue text MUST be readable by screen readers
- Color contrast MUST meet WCAG AA (4.5:1 minimum)
- Keyboard navigation MUST remain functional

### Example Usage

```javascript
// Parent component computes overdue status
const todoWithStatus = {
  id: 1,
  title: 'Submit report',
  dueDate: '2026-02-25',
  completed: false,
  isOverdue: true,        // NEW: Computed by parent
  overdueDays: 2          // NEW: Computed by parent
};

<TodoCard
  todo={todoWithStatus}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isLoading={false}
/>
```

### Expected Output (when overdue)

```html
<div class="todo-card todo-card--overdue">
  <div class="todo-card__content">
    <h3 class="todo-card__title">Submit report</h3>
    <div class="overdue-indicator">
      <span class="overdue-icon" aria-label="Overdue warning">⚠️</span>
      <span class="overdue-text">2 days overdue</span>
    </div>
    <!-- ... rest of card content ... -->
  </div>
</div>
```

---

## TodoList Component (Modified)

**File**: `packages/frontend/src/components/TodoList.js`

### Props Interface (Unchanged)

```javascript
/**
 * TodoList component props
 * @typedef {Object} TodoListProps
 * @property {Array<Object>} todos - Array of todo items
 * @property {Function} onToggle - Callback when todo toggled
 * @property {Function} onEdit - Callback when todo edited
 * @property {Function} onDelete - Callback when todo deleted
 * @property {boolean} isLoading - Loading state
 */
```

**Note**: Props interface remains unchanged. Component internally computes overdue status.

### Behavioral Contract

**Internal Processing** (NEW):
1. For each todo in `todos` array:
   - Compute `isOverdue` using `dateUtils.isOverdue(todo.dueDate, todo.completed)`
   - Compute `overdueDays` using `dateUtils.getOverdueDays(todo.dueDate)` if overdue
   - Create enhanced todo object with overdue fields

2. Pass enhanced todos to TodoCard children

**Computation Location**:
- Overdue calculation happens in TodoList component (parent)
- TodoCard receives pre-computed overdue status as props
- Avoids duplicate calculations in child components

### Example Implementation Pattern

```javascript
import { isOverdue, getOverdueDays } from '../utils/dateUtils';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  // Compute overdue status for all todos
  const todosWithStatus = todos.map(todo => ({
    ...todo,
    isOverdue: isOverdue(todo.dueDate, todo.completed),
    overdueDays: isOverdue(todo.dueDate, todo.completed) 
      ? getOverdueDays(todo.dueDate) 
      : null
  }));

  return (
    <div className="todo-list">
      {todosWithStatus.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
```

---

## OverdueIndicator Component (Optional New Subcomponent)

**File**: `packages/frontend/src/components/OverdueIndicator.js` (optional extraction)

**Note**: This is an optional subcomponent that can be extracted from TodoCard for better separation of concerns. Initial implementation can inline this in TodoCard.

### Props Interface

```javascript
/**
 * OverdueIndicator component props
 * @typedef {Object} OverdueIndicatorProps
 * @property {number} days - Number of days overdue
 */
```

### Behavioral Contract

**Rendering**:
1. Display warning icon (⚠️) with aria-label
2. Format and display overdue text with proper pluralization
3. Apply appropriate styling (red text, spacing)

### Example Usage

```javascript
<OverdueIndicator days={3} />
// Renders: ⚠️ 3 days overdue
```

---

## Component Responsibility Matrix

| Component      | Responsibilities                                  | Does NOT Handle                    |
|----------------|---------------------------------------------------|------------------------------------|
| **TodoList**   | - Fetch todos<br>- Compute overdue status<br>- Pass to children | - Render overdue indicators<br>- Style individual cards |
| **TodoCard**   | - Render todo content<br>- Display overdue indicators<br>- Handle user interactions | - Compute overdue status<br>- Fetch data |
| **OverdueIndicator** (optional) | - Render icon + text<br>- Format duration text | - Compute days overdue<br>- Apply card-level styling |

---

## Backward Compatibility

**Existing TodoCard consumers**:
- Components passing todos without `isOverdue` or `overdueDays` props will NOT break
- Missing overdue props default to falsy → no indicators shown
- Graceful degradation if date utils not available

**Migration path**:
1. Add overdue fields to todo objects at TodoList level
2. TodoCard updates automatically show indicators
3. No breaking changes to other components

---

## Testing Contract

### Unit Tests (Component Level)

**TodoCard.test.js**:
```javascript
describe('TodoCard overdue indicators', () => {
  test('renders overdue indicators when isOverdue is true', () => {
    const overdueTodo = {
      id: 1,
      title: 'Task',
      isOverdue: true,
      overdueDays: 3,
      completed: false
    };
    render(<TodoCard todo={overdueTodo} {...handlers} />);
    expect(screen.getByLabelText('Overdue warning')).toBeInTheDocument();
    expect(screen.getByText('3 days overdue')).toBeInTheDocument();
  });

  test('does not render overdue indicators when isOverdue is false', () => {
    const normalTodo = {
      id: 1,
      title: 'Task',
      isOverdue: false,
      overdueDays: null,
      completed: false
    };
    render(<TodoCard todo={normalTodo} {...handlers} />);
    expect(screen.queryByLabelText('Overdue warning')).not.toBeInTheDocument();
  });
});
```

**TodoList.test.js**:
```javascript
describe('TodoList overdue calculation', () => {
  test('computes overdue status for todos', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-25', completed: false }, // Overdue
      { id: 2, dueDate: '2026-02-28', completed: false }  // Not overdue
    ];
    render(<TodoList todos={todos} {...handlers} />);
    expect(screen.getByText(/days overdue/i)).toBeInTheDocument();
  });
});
```

---

## CSS Contract

### Required CSS Classes

```css
/* Applied to TodoCard when overdue */
.todo-card--overdue {
  /* Optional card-level styling */
}

/* Container for overdue indicator */
.overdue-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-error);
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xs);
}

/* Warning icon */
.overdue-icon {
  font-size: 1.2em;
  line-height: 1;
}

/* Overdue text */
.overdue-text {
  /* Inherits color from .overdue-indicator */
}
```

### CSS Variable Requirements

Must be defined in `theme.css`:
```css
--color-error: #d32f2f;           /* Light mode */
--color-error-dark: #f44336;      /* Dark mode */
--spacing-xs: 8px;
--font-size-small: 0.875rem;
```

---

## Performance Contract

**Computational Guarantees**:
- Overdue calculation: O(1) per todo
- Rendering overhead: < 5ms for 100 todos
- No memory leaks from date objects

**Re-render Optimization**:
- Overdue status computed in parent (TodoList)
- TodoCard receives props (no internal computation)
- React memo can be applied to TodoCard if needed

---

## Summary

**Modified Components**:
- TodoCard: New props (`isOverdue`, `overdueDays`), renders indicators
- TodoList: Computes overdue status, passes to children

**New Components** (optional):
- OverdueIndicator: Extracted subcomponent for indicator rendering

**Contract Guarantees**:
- Backward compatible (graceful degradation)
- Accessibility compliant (WCAG AA)
- Performance efficient (O(1) per todo)
- Testable (clear prop interfaces)
