# Quickstart: Implementing Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This quickstart guide provides step-by-step instructions for implementing the overdue todo items feature following Test-Driven Development (TDD) principles as required by the project constitution.

**Time Estimate**: 2-3 hours for complete implementation and testing

## Prerequisites

- Project repository cloned and dependencies installed
- Development server running (`npm start`)
- Familiarity with React, Jest, and React Testing Library
- Constitution read and understood (especially TDD principle)

## Implementation Workflow

This feature follows strict TDD workflow:
1. ✍️ Write tests (Red)
2. ✅ Implement minimal code to pass (Green)
3. 🔧 Refactor while keeping tests green
4. 🔁 Repeat

## Phase 1: Utility Functions (TDD)

### Step 1.1: Create Test File

Create the test file **before** the implementation file:

```bash
mkdir -p packages/frontend/src/utils/__tests__
touch packages/frontend/src/utils/__tests__/dateUtils.test.js
```

### Step 1.2: Write Tests for `isOverdue`

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue } from '../dateUtils';

describe('dateUtils - isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27')); // Mock "today"
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns false when dueDate is null', () => {
    expect(isOverdue(null, false)).toBe(false);
  });

  test('returns false when dueDate is empty string', () => {
    expect(isOverdue('', false)).toBe(false);
  });

  test('returns false when completed is true (even with past date)', () => {
    expect(isOverdue('2026-02-20', true)).toBe(false);
  });

  test('returns false when dueDate is today', () => {
    expect(isOverdue('2026-02-27', false)).toBe(false);
  });

  test('returns false when dueDate is in the future', () => {
    expect(isOverdue('2026-02-28', false)).toBe(false);
    expect(isOverdue('2026-03-15', false)).toBe(false);
  });

  test('returns true when dueDate is past and not completed', () => {
    expect(isOverdue('2026-02-26', false)).toBe(true); // Yesterday
    expect(isOverdue('2026-02-20', false)).toBe(true); // Last week
    expect(isOverdue('2025-12-31', false)).toBe(true); // Months ago
  });

  test('handles invalid date strings gracefully', () => {
    expect(isOverdue('invalid-date', false)).toBe(false);
    expect(isOverdue('2026-13-45', false)).toBe(false);
  });
});
```

### Step 1.3: Run Tests (Should Fail ❌)

```bash
cd packages/frontend
npm test -- dateUtils.test.js
```

**Expected**: All tests fail (file doesn't exist yet). This is the "Red" phase.

### Step 1.4: Implement `isOverdue`

Create the implementation file:

```bash
touch packages/frontend/src/utils/dateUtils.js
```

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - Due date in ISO 8601 format (YYYY-MM-DD)
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} True if overdue, false otherwise
 */
export const isOverdue = (dueDate, completed) => {
  // Rule 1: No due date or completed → not overdue
  if (!dueDate || completed) {
    return false;
  }

  // Rule 2: Compare dates (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  
  // Rule 3: Handle invalid dates
  if (isNaN(due.getTime())) {
    return false;
  }

  due.setHours(0, 0, 0, 0);

  // Rule 4: Overdue if due date is before today
  return due < today;
};
```

### Step 1.5: Run Tests (Should Pass ✅)

```bash
npm test -- dateUtils.test.js
```

**Expected**: All `isOverdue` tests pass. This is the "Green" phase.

### Step 1.6: Write Tests for `getOverdueDays`

Add to the same test file:

```javascript
import { isOverdue, getOverdueDays } from '../dateUtils';

describe('dateUtils - getOverdueDays', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns 1 for task due yesterday', () => {
    expect(getOverdueDays('2026-02-26')).toBe(1);
  });

  test('returns 7 for task due one week ago', () => {
    expect(getOverdueDays('2026-02-20')).toBe(7);
  });

  test('returns 0 for task due today', () => {
    expect(getOverdueDays('2026-02-27')).toBe(0);
  });

  test('returns correct count for large numbers', () => {
    expect(getOverdueDays('2025-02-27')).toBe(365);
  });

  test('returns 57 for task due on Jan 1', () => {
    expect(getOverdueDays('2026-01-01')).toBe(57);
  });
});
```

### Step 1.7: Run Tests (Should Fail ❌)

```bash
npm test -- dateUtils.test.js
```

### Step 1.8: Implement `getOverdueDays`

Add to `dateUtils.js`:

```javascript
/**
 * Calculates how many days a todo is overdue
 * @param {string} dueDate - Due date in ISO 8601 format
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
```

### Step 1.9: Run Tests (Should Pass ✅)

```bash
npm test -- dateUtils.test.js
```

### Step 1.10: Write Tests for `formatOverdueText`

Add to test file:

```javascript
import { isOverdue, getOverdueDays, formatOverdueText } from '../dateUtils';

describe('dateUtils - formatOverdueText', () => {
  test('uses singular "day" for 1', () => {
    expect(formatOverdueText(1)).toBe('1 day overdue');
  });

  test('uses plural "days" for 2', () => {
    expect(formatOverdueText(2)).toBe('2 days overdue');
  });

  test('uses plural "days" for larger numbers', () => {
    expect(formatOverdueText(7)).toBe('7 days overdue');
    expect(formatOverdueText(45)).toBe('45 days overdue');
    expect(formatOverdueText(365)).toBe('365 days overdue');
  });

  test('handles edge case of 0 (though should not occur)', () => {
    expect(formatOverdueText(0)).toBe('0 days overdue');
  });
});
```

### Step 1.11: Implement `formatOverdueText`

Add to `dateUtils.js`:

```javascript
/**
 * Formats overdue duration as text
 * @param {number} days - Number of days overdue
 * @returns {string} Formatted text (e.g., "3 days overdue")
 */
export const formatOverdueText = (days) => {
  return `${days} ${days === 1 ? 'day' : 'days'} overdue`;
};
```

### Step 1.12: Run All Utility Tests (Should Pass ✅)

```bash
npm test -- dateUtils.test.js
```

**Checkpoint**: All utility functions implemented and tested (Phase 1 complete).

---

## Phase 2: Component Updates (TDD)

### Step 2.1: Update TodoCard Tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add new test cases at the end of the file:

```javascript
describe('TodoCard - Overdue indicators', () => {
  test('renders overdue indicators when todo is overdue', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-02-25',
      completed: false,
      isOverdue: true,
      overdueDays: 2
    };

    render(
      <TodoCard
        todo={overdueTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={false}
      />
    );

    // Check for warning icon with aria-label
    expect(screen.getByLabelText('Overdue warning')).toBeInTheDocument();

    // Check for overdue text
    expect(screen.getByText('2 days overdue')).toBeInTheDocument();
  });

  test('does not render overdue indicators when not overdue', () => {
    const normalTodo = {
      id: 1,
      title: 'Normal task',
      dueDate: '2026-03-01',
      completed: false,
      isOverdue: false,
      overdueDays: null
    };

    render(
      <TodoCard
        todo={normalTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={false}
      />
    );

    expect(screen.queryByLabelText('Overdue warning')).not.toBeInTheDocument();
    expect(screen.queryByText(/days overdue/i)).not.toBeInTheDocument();
  });

  test('does not render overdue for completed todo with past due date', () => {
    const completedTodo = {
      id: 1,
      title: 'Completed task',
      dueDate: '2026-02-20',
      completed: true,
      isOverdue: false,  // Should be computed as false
      overdueDays: null
    };

    render(
      <TodoCard
        todo={completedTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={false}
      />
    );

    expect(screen.queryByLabelText('Overdue warning')).not.toBeInTheDocument();
  });

  test('uses singular form for 1 day overdue', () => {
    const todo = {
      id: 1,
      title: 'Task',
      isOverdue: true,
      overdueDays: 1,
      completed: false
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('1 day overdue')).toBeInTheDocument();
  });
});
```

### Step 2.2: Run TodoCard Tests (Should Fail ❌)

```bash
npm test -- TodoCard.test.js
```

### Step 2.3: Update TodoCard Component

**File**: `packages/frontend/src/components/TodoCard.js`

Add import at top:

```javascript
import { formatOverdueText } from '../utils/dateUtils';
```

Add overdue indicator rendering (find appropriate location in JSX, typically after title):

```javascript
// Inside the component's return statement, add:
{todo.isOverdue && todo.overdueDays && (
  <div className="overdue-indicator">
    <span className="overdue-icon" aria-label="Overdue warning">⚠️</span>
    <span className="overdue-text">{formatOverdueText(todo.overdueDays)}</span>
  </div>
)}
```

### Step 2.4: Add CSS Styles

**File**: `packages/frontend/src/App.css` or create `packages/frontend/src/components/TodoCard.css`

```css
/* Overdue indicator styling */
.overdue-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 8px;
}

.overdue-icon {
  font-size: 1.2em;
  line-height: 1;
}

.overdue-text {
  font-weight: 500;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .overdue-indicator {
    color: #f44336;
  }
}
```

### Step 2.5: Run TodoCard Tests (Should Pass ✅)

```bash
npm test -- TodoCard.test.js
```

---

## Phase 3: Data Flow Integration (TDD)

### Step 3.1: Update TodoList Tests

**File**: `packages/frontend/src/components/__tests__/TodoList.test.js`

Add test cases:

```javascript
import { isOverdue, getOverdueDays } from '../../utils/dateUtils';

describe('TodoList - Overdue calculation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('computes and passes overdue status to TodoCard', () => {
    const todos = [
      {
        id: 1,
        title: 'Overdue task',
        dueDate: '2026-02-25',
        completed: false
      },
      {
        id: 2,
        title: 'Future task',
        dueDate: '2026-03-01',
        completed: false
      }
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={false}
      />
    );

    // Should show overdue indicator for first todo
    expect(screen.getByText('2 days overdue')).toBeInTheDocument();

    // Should not show overdue for second todo
    const overdueIndicators = screen.getAllByLabelText('Overdue warning');
    expect(overdueIndicators).toHaveLength(1);
  });

  test('handles todos without due dates', () => {
    const todos = [
      {
        id: 1,
        title: 'No due date',
        dueDate: null,
        completed: false
      }
    ];

    render(<TodoList todos={todos} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.queryByLabelText('Overdue warning')).not.toBeInTheDocument();
  });
});
```

### Step 3.2: Run TodoList Tests (Should Fail ❌)

```bash
npm test -- TodoList.test.js
```

### Step 3.3: Update TodoList Component

**File**: `packages/frontend/src/components/TodoList.js`

Add import at top:

```javascript
import { isOverdue, getOverdueDays } from '../utils/dateUtils';
```

Modify the component to compute overdue status:

```javascript
function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  // Compute overdue status for all todos
  const todosWithStatus = todos.map(todo => {
    const overdue = isOverdue(todo.dueDate, todo.completed);
    return {
      ...todo,
      isOverdue: overdue,
      overdueDays: overdue ? getOverdueDays(todo.dueDate) : null
    };
  });

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

### Step 3.4: Run TodoList Tests (Should Pass ✅)

```bash
npm test -- TodoList.test.js
```

---

## Phase 4: Integration Testing & Verification

### Step 4.1: Run Full Test Suite

```bash
cd packages/frontend
npm test -- --coverage
```

**Expected**:
- All tests pass ✅
- Coverage >= 80% for modified/new files
- No console errors or warnings

### Step 4.2: Manual Testing Checklist

Start the development server:

```bash
npm start
```

Test scenarios (refer to spec.md User Stories):

- [ ] Create a todo with a past due date → Shows overdue indicator
- [ ] Create a todo with today's date → Does NOT show overdue
- [ ] Create a todo with future date → Does NOT show overdue
- [ ] Complete an overdue todo → Overdue indicator disappears
- [ ] Create todo without due date → No overdue indicator
- [ ] Check pluralization: 1 day vs 2+ days
- [ ] Test in light mode → Red text visible
- [ ] Test in dark mode → Red text visible with good contrast
- [ ] Use screen reader → "Overdue warning" announced

### Step 4.3: Accessibility Verification

Install and run jest-axe (optional but recommended):

```bash
npm install --save-dev jest-axe
```

Add accessibility test:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('TodoCard with overdue indicator has no accessibility violations', async () => {
  const { container } = render(
    <TodoCard todo={overdueTodo} {...handlers} />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Step 4.4: Cross-Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Phase 5: Refinement & Documentation

### Step 5.1: Code Review Checklist

Before committing, verify:

- [ ] All tests pass
- [✅] Code follows project conventions (2-space indent, camelCase, etc.)
- [ ] ESLint errors resolved
- [ ] No console.log statements
- [ ] JSDoc comments added to functions
- [ ] Edge cases handled
- [ ] Accessibility requirements met
- [ ] Git commits are atomic and well-described

### Step 5.2: Refactoring (Optional)

Consider:
- Extracting OverdueIndicator as separate component (if TodoCard gets too large)
- Memoizing overdue calculations (if performance issues with 1000+ todos)
- Adding custom React hook `useOverdueStatus(todo)` (if reused elsewhere)

### Step 5.3: Update Documentation

Add JSDoc to all new/modified functions.

Example:
```javascript
/**
 * Enhances todo with overdue status
 * @private
 * @param {Object} todo - Todo item
 * @returns {Object} Todo with isOverdue and overdueDays fields
 */
const enhanceWithOverdueStatus = (todo) => {
  // ...
};
```

---

## Troubleshooting

### Tests Failing: Date Mocking Issues

**Problem**: Tests use real current date instead of mocked date.

**Solution**: Ensure `jest.useFakeTimers()` and `jest.setSystemTime()` are in `beforeEach`:

```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Visual Indicators Not Showing

**Problem**: Overdue indicator doesn't render.

**Debug checklist**:
1. Check `todo.isOverdue` is `true` in React DevTools
2. Check `todo.overdueDays` has a value
3. Verify CSS is loaded (inspect element)
4. Check conditional rendering logic in TodoCard

### Incorrect Day Count

**Problem**: Shows wrong number of days overdue.

**Debug**:
1. Log current date: `console.log(new Date())`
2. Log due date: `console.log(new Date(todo.dueDate))`
3. Check timezone: Ensure both normalized to midnight
4. Verify date calculation math

### Accessibility Issues

**Problem**: Screen reader doesn't announce overdue status.

**Solution**: Verify:
- Icon has `aria-label="Overdue warning"`
- Text is not hidden with CSS (`display: none` prevents screen readers)
- Color contrast meets 4.5:1 ratio

---

## Quick Reference

### File Locations

```
packages/frontend/src/
├── utils/
│   ├── dateUtils.js                    # NEW: Utility functions
│   └── __tests__/
│       └── dateUtils.test.js           # NEW: Utility tests
├── components/
│   ├── TodoCard.js                     # MODIFIED: Render indicators
│   ├── TodoList.js                     # MODIFIED: Compute status
│   └── __tests__/
│       ├── TodoCard.test.js            # MODIFIED: Add overdue tests
│       └── TodoList.test.js            # MODIFIED: Add integration tests
└── App.css                             # MODIFIED: Add overdue styles
```

### Key Functions

```javascript
// dateUtils.js
isOverdue(dueDate, completed) → boolean
getOverdueDays(dueDate) → number
formatOverdueText(days) → string

// TodoList.js
const todosWithStatus = todos.map(todo => ({
  ...todo,
  isOverdue: isOverdue(todo.dueDate, todo.completed),
  overdueDays: overdue ? getOverdueDays(todo.dueDate) : null
}));

// TodoCard.js
{todo.isOverdue && (
  <div className="overdue-indicator">
    <span aria-label="Overdue warning">⚠️</span>
    <span>{formatOverdueText(todo.overdueDays)}</span>
  </div>
)}
```

### Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- dateUtils.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Success Criteria

Feature is complete when:

- ✅ All tests pass (including new overdue tests)
- ✅ Coverage >= 80% for modified files
- ✅ Overdue todos show red text + icon + duration
- ✅ Non-overdue todos show no indicators
- ✅ Completed todos never show overdue (even if past due)
- ✅ Accessibility verified (screen reader, color contrast)
- ✅ Manual testing scenarios all pass
- ✅ Code follows project conventions
- ✅ No ESLint errors

---

## Next Steps

After implementation:
1. Create pull request with descriptive title
2. Run CI/CD pipeline (wait for green ✅)
3. Request code review
4. Address review comments
5. Merge to main branch
6. Deploy to production (if applicable)

For detailed specifications, see:
- [spec.md](spec.md) - Feature specification
- [plan.md](plan.md) - Implementation plan
- [data-model.md](data-model.md) - Data entities
- [contracts/](contracts/) - Interface contracts
