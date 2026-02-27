# Utility Contracts: Date Utilities

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This document defines the public interface contracts for utility functions created for the overdue todo items feature. These are pure functions with no side effects, designed for testability and reusability.

## Module: dateUtils

**File**: `packages/frontend/src/utils/dateUtils.js`

### Module Exports

```javascript
export { isOverdue, getOverdueDays, formatOverdueText };
```

---

## Function: isOverdue

Determines whether a todo item is currently overdue based on its due date and completion status.

### Function Signature

```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - Due date in ISO 8601 format (YYYY-MM-DD) or null
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} True if overdue (past due date and not completed), false otherwise
 */
function isOverdue(dueDate, completed)
```

### Input Contract

| Parameter   | Type           | Required | Valid Values                          |
|-------------|----------------|----------|---------------------------------------|
| `dueDate`   | `string|null`  | Yes      | ISO 8601 date string or `null`        |
| `completed` | `boolean`      | Yes      | `true` or `false`                     |

### Output Contract

| Return Type | Description                                          |
|-------------|------------------------------------------------------|
| `boolean`   | `true` if overdue, `false` otherwise                 |

### Business Rules

1. Returns `false` if `dueDate` is `null` or falsy
2. Returns `false` if `completed` is `true` (completed tasks are never overdue)
3. Returns `false` if `dueDate` is today or in the future
4. Returns `true` if `dueDate` is in the past AND `completed` is `false`

### Date Comparison Rules

- Compares dates only (time component ignored)
- Uses client browser's local timezone
- "Today" = current date at 00:00:00 local time
- "Due date" = dueDate at 00:00:00 local time
- Comparison: `dueDate < today` (strictly less than, not <=)

### Edge Cases

| Input                              | Expected Output | Reason                                    |
|------------------------------------|-----------------|-------------------------------------------|
| `isOverdue(null, false)`           | `false`         | No due date → not overdue                 |
| `isOverdue('', false)`             | `false`         | Empty string is falsy                     |
| `isOverdue('2026-02-27', false)`   | `false`         | Due today → not overdue (boundary)        |
| `isOverdue('2026-02-28', false)`   | `false`         | Due tomorrow → not overdue                |
| `isOverdue('2026-02-26', false)`   | `true`          | Due yesterday → overdue                   |
| `isOverdue('2026-02-20', true)`    | `false`         | Completed → never overdue                 |
| `isOverdue('invalid-date', false)` | `false`         | Invalid date treated as no due date       |

### Example Usage

```javascript
import { isOverdue } from '../utils/dateUtils';

// Example 1: Overdue task
const overdue = isOverdue('2026-02-25', false);
console.log(overdue); // true (assuming today is 2026-02-27)

// Example 2: Completed task with past due date
const notOverdue = isOverdue('2026-02-20', true);
console.log(notOverdue); // false (completed tasks are never overdue)

// Example 3: Future task
const future = isOverdue('2026-03-01', false);
console.log(future); // false
```

### Testing Contract

**Required test cases**:
```javascript
describe('isOverdue', () => {
  test('returns false when dueDate is null');
  test('returns false when completed is true');
  test('returns false when dueDate is today');
  test('returns false when dueDate is in the future');
  test('returns true when dueDate is past and not completed');
  test('returns false for invalid date strings');
});
```

---

## Function: getOverdueDays

Calculates the number of days a todo item is overdue.

### Function Signature

```javascript
/**
 * Calculates how many days a todo is overdue
 * @param {string} dueDate - Due date in ISO 8601 format (YYYY-MM-DD)
 * @returns {number} Number of days overdue (always >= 1 if called correctly)
 */
function getOverdueDays(dueDate)
```

### Input Contract

| Parameter | Type     | Required | Valid Values                    |
|-----------|----------|----------|---------------------------------|
| `dueDate` | `string` | Yes      | Valid ISO 8601 date string      |

**Precondition**: This function should only be called when `isOverdue()` returns `true`.

### Output Contract

| Return Type | Description                                          |
|-------------|------------------------------------------------------|
| `number`    | Integer representing days overdue (minimum 1)        |

### Calculation Rules

- Uses client browser's current date as reference
- Compares dates only (time component ignored)
- Formula: `Math.floor((currentDate - dueDate) / millisecondsPerDay)`
- Always returns integer (no fractional days)
- Minimum return value: 1 (for tasks due yesterday)
- No maximum (can be hundreds or thousands)

### Edge Cases

| Input                              | Expected Output | Notes                                   |
|------------------------------------|-----------------|-----------------------------------------|
| `getOverdueDays('2026-02-26')`     | `1`             | Due yesterday (assuming today = Feb 27) |
| `getOverdueDays('2026-02-20')`     | `7`             | Due 7 days ago                          |
| `getOverdueDays('2025-02-27')`     | `365`           | Due 1 year ago (non-leap year)          |
| `getOverdueDays('2026-02-27')`     | `0`             | Due today (should not call this if using `isOverdue` correctly) |

### Example Usage

```javascript
import { getOverdueDays } from '../utils/dateUtils';

// Assuming today is 2026-02-27
const days1 = getOverdueDays('2026-02-25');
console.log(days1); // 2

const days2 = getOverdueDays('2026-02-20');
console.log(days2); // 7

const days3 = getOverdueDays('2026-01-01');
console.log(days3); // 57
```

### Testing Contract

**Required test cases**:
```javascript
describe('getOverdueDays', () => {
  test('returns 1 for task due yesterday');
  test('returns correct count for task due multiple days ago');
  test('returns 0 for task due today (boundary)');
  test('handles large day counts (365+ days)');
});
```

---

## Function: formatOverdueText

Formats the overdue duration as user-friendly text with proper pluralization.

### Function Signature

```javascript
/**
 * Formats overdue duration as text
 * @param {number} days - Number of days overdue
 * @returns {string} Formatted text (e.g., "3 days overdue")
 */
function formatOverdueText(days)
```

### Input Contract

| Parameter | Type     | Required | Valid Values              |
|-----------|----------|----------|---------------------------|
| `days`    | `number` | Yes      | Integer >= 1              |

### Output Contract

| Return Type | Description                                          |
|-------------|------------------------------------------------------|
| `string`    | Formatted text with proper pluralization             |

### Formatting Rules

- Template: `{days} {day|days} overdue`
- Singular: "1 day overdue"
- Plural: "2 days overdue", "7 days overdue", "365 days overdue"
- Always includes the word "overdue"
- No capitalization (lowercase)
- No punctuation at end

### Edge Cases

| Input                      | Expected Output       | Notes                          |
|----------------------------|-----------------------|--------------------------------|
| `formatOverdueText(1)`     | `"1 day overdue"`     | Singular form                  |
| `formatOverdueText(2)`     | `"2 days overdue"`    | Plural form                    |
| `formatOverdueText(7)`     | `"7 days overdue"`    | Standard case                  |
| `formatOverdueText(365)`   | `"365 days overdue"`  | Large number (no unit conversion) |
| `formatOverdueText(0)`     | `"0 days overdue"`    | Edge case (shouldn't occur)    |

### Example Usage

```javascript
import { formatOverdueText } from '../utils/dateUtils';

const text1 = formatOverdueText(1);
console.log(text1); // "1 day overdue"

const text2 = formatOverdueText(3);
console.log(text2); // "3 days overdue"

const text3 = formatOverdueText(45);
console.log(text3); // "45 days overdue"
```

### Testing Contract

**Required test cases**:
```javascript
describe('formatOverdueText', () => {
  test('uses singular "day" for 1');
  test('uses plural "days" for 2');
  test('uses plural "days" for numbers > 2');
  test('handles large numbers (365+)');
  test('includes "overdue" suffix');
});
```

---

## Module Contract Summary

### Purity Guarantee

All functions are **pure**:
- No side effects (no mutations, no I/O, no state changes)
- Deterministic (same inputs always produce same outputs)
- No dependencies on external state
- Safe to call multiple times

### Performance Guarantees

- `isOverdue`: O(1) time complexity, < 1ms execution
- `getOverdueDays`: O(1) time complexity, < 1ms execution
- `formatOverdueText`: O(1) time complexity, < 1ms execution
- No memory leaks (local variables only)
- No object mutations

### Thread Safety

Functions are safe to call from:
- Multiple components simultaneously
- React render cycles
- Event handlers
- Async callbacks

### Error Handling

**Philosophy**: Graceful degradation rather than throwing errors

- Invalid dates → treated as "no due date" → returns `false`
- Null/undefined inputs → handled with falsy checks
- No explicit error throwing (defensive programming)

### Dependencies

**Zero external dependencies**:
- Uses only built-in JavaScript `Date` object
- No imports from other modules
- No third-party libraries (moment.js, date-fns, etc.)

### Browser Compatibility

Compatible with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ environments
- No polyfills required for `Date` operations

---

## Integration Contract

### Usage Pattern (Recommended)

```javascript
// In TodoList.js or similar parent component
import { isOverdue, getOverdueDays, formatOverdueText } from '../utils/dateUtils';

function enhanceTodoWithOverdueStatus(todo) {
  const overdue = isOverdue(todo.dueDate, todo.completed);
  
  return {
    ...todo,
    isOverdue: overdue,
    overdueDays: overdue ? getOverdueDays(todo.dueDate) : null,
    overdueText: overdue ? formatOverdueText(getOverdueDays(todo.dueDate)) : null
  };
}

// Usage
const todosWithStatus = todos.map(enhanceTodoWithOverdueStatus);
```

### Anti-Patterns (Avoid)

❌ **Calling getOverdueDays without checking isOverdue first**:
```javascript
// BAD: May call getOverdueDays on non-overdue items
const days = getOverdueDays(todo.dueDate);
```

❌ **Computing overdue status in child components**:
```javascript
// BAD: Duplicate calculations in each TodoCard
function TodoCard({ todo }) {
  const overdue = isOverdue(todo.dueDate, todo.completed); // ❌
  // ...
}
```

❌ **Not handling null due dates**:
```javascript
// BAD: Assumes dueDate always exists
const overdue = new Date(todo.dueDate) < new Date(); // ❌ Crashes if null
```

✅ **Correct pattern**:
```javascript
// GOOD: Check isOverdue first, compute once in parent
const overdue = isOverdue(todo.dueDate, todo.completed);
if (overdue) {
  const days = getOverdueDays(todo.dueDate);
  const text = formatOverdueText(days);
}
```

---

## Testing Infrastructure

### Mock Date Strategy

For consistent testing, mock the current date:

```javascript
// In test files
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Test Fixtures

```javascript
const TEST_DATES = {
  TODAY: '2026-02-27',
  YESTERDAY: '2026-02-26',
  TOMORROW: '2026-02-28',
  ONE_WEEK_AGO: '2026-02-20',
  ONE_YEAR_AGO: '2025-02-27'
};
```

### Coverage Target

- 100% function coverage (all functions executed)
- 100% branch coverage (all conditions tested)
- 100% line coverage (all lines executed)

---

## Documentation Contract

### JSDoc Requirements

All functions must have:
- Description of what the function does
- `@param` tags for all parameters
- `@returns` tag describing return value
- Examples in comments (optional but recommended)

### README Documentation

Functions should be documented in module-level README:
- Purpose of the module
- When to use each function
- Common patterns and examples
- Link to this contract document

---

## Versioning

**Initial Release**: v1.0.0 (overdue feature launch)

**Breaking Change Policy**:
- Changing function signatures = major version bump
- Changing return types = major version bump
- Changing business rules = minor version bump
- Bug fixes = patch version bump

**Future Extensions** (backward compatible):
- Additional helper functions (e.g., `isOverdueSoon(dueDate, days)`)
- Internationalization support (i18n for text formatting)
- Timezone utilities (if server-side logic added)

---

## Summary

**Module**: `dateUtils.js`
**Functions**: 3 pure utility functions
- `isOverdue(dueDate, completed)` → `boolean`
- `getOverdueDays(dueDate)` → `number`
- `formatOverdueText(days)` → `string`

**Guarantees**:
- Pure functions (no side effects)
- O(1) performance
- Zero dependencies
- 100% test coverage target
- Backward compatible
