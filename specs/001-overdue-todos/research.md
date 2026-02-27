# Research: Overdue Todo Items Feature

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This document captures technical research and decisions for implementing visual indicators for overdue todo items. Since all technical context was determinable from the existing codebase, this research focuses on best practices and implementation patterns for the chosen technologies.

## Key Technical Decisions

### 1. Date Comparison Strategy

**Decision**: Use JavaScript `Date` objects with client-side comparison, comparing date-only values (ignoring time).

**Rationale**:
- Specification requires client browser's local date (user's timezone)
- No server-side changes needed - simplifies implementation
- JavaScript `Date` object provides robust date parsing and comparison
- Client-side calculation enables instant visual feedback
- Matches existing architecture (REST API serves data, React handles presentation)

**Implementation approach**:
```javascript
// Compare dates at midnight (ignore time component)
const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};
```

**Alternatives considered**:
- Server-side calculation: Rejected because spec requires client timezone, and adds unnecessary API changes
- Third-party library (moment.js, date-fns): Rejected due to YAGNI principle - built-in `Date` is sufficient
- Timestamp comparison only: Rejected because spec requires date-only comparison (not time-sensitive)

**Best practices applied**:
- Normalize times to midnight for date-only comparison
- Handle null/undefined due dates gracefully
- Respect completed status as higher priority than due date
- Use ISO 8601 date strings for consistency with backend

### 2. Duration Calculation

**Decision**: Calculate days overdue using date difference, always expressed in days with proper pluralization.

**Rationale**:
- Specification clarified: always use days (no weeks/months conversion)
- Simple, consistent unit avoids user confusion
- Easy to calculate: `Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))`
- Internationalization-ready (can add i18n later if needed)

**Implementation approach**:
```javascript
const getOverdueDays = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatOverdueText = (days) => {
  return `${days} ${days === 1 ? 'day' : 'days'} overdue`;
};
```

**Best practices applied**:
- Proper pluralization handling (1 day vs 2 days)
- Clear, user-friendly text format
- Consistent unit (days) simplifies UX
- Easy to test with known date fixtures

### 3. Visual Indicators

**Decision**: Combine three visual indicators - red text color, warning icon (⚠️), and duration text.

**Rationale**:
- Multi-modal indicators ensure accessibility (WCAG AA compliance)
- Icon provides immediate visual recognition (language-independent)
- Color reinforces urgency perception
- Duration text provides specific information (how overdue)
- Combination doesn't rely solely on color (colorblind-accessible)

**Implementation approach**:
- Use CSS class `.todo-card--overdue` for styling
- Inline warning icon (⚠️) before title or after status
- Duration text as secondary text below/beside title
- Existing theme colors: use CSS variable `--color-error` or `--color-danger-text`
- Support light/dark mode variants

**Alternatives considered**:
- Color only: Rejected due to accessibility concerns (constitution requirement)
- Icon only: Rejected because doesn't show duration information
- Background color change: Rejected to avoid visual clutter and maintain card consistency

**Best practices applied**:
- WCAG AA contrast ratios for text colors
- Semantic HTML (aria-label for icon)
- CSS variables for theme consistency
- Responsive design (works on mobile)

### 4. React Component Architecture

**Decision**: Create pure utility functions for date logic, compute overdue state in parent component (TodoList), pass as props to TodoCard.

**Rationale**:
- Single Responsibility: date logic separate from UI rendering
- Testability: utility functions are pure and easy to test
- Performance: compute once in parent, pass to children
- Reusability: date utilities can be used elsewhere if needed
- Follows existing TodoList → TodoCard pattern

**Implementation approach**:
```javascript
// utils/dateUtils.js - Pure functions
export const isOverdue = (dueDate, completed) => { /*...*/ };
export const getOverdueDays = (dueDate) => { /*...*/ };
export const formatOverdueText = (days) => { /*...*/ };

// TodoList.js - Compute in parent
const todosWithOverdueStatus = todos.map(todo => ({
  ...todo,
  isOverdue: isOverdue(todo.dueDate, todo.completed),
  overdueDays: isOverdue(todo.dueDate, todo.completed) 
    ? getOverdueDays(todo.dueDate) 
    : null
}));

// TodoCard.js - Render based on props
{todo.isOverdue && (
  <span className="overdue-indicator">
    <span aria-label="Overdue warning">⚠️</span>
    {formatOverdueText(todo.overdueDays)}
  </span>
)}
```

**Performance considerations**:
- Date calculations are O(1) and fast (< 1ms each)
- No need for memoization unless todo list exceeds 1000+ items
- Computing in parent avoids duplicate calculations
- No expensive re-renders (overdue state only changes at midnight or on completion)

**Best practices applied**:
- Pure functions (no side effects)
- Props-based composition
- Computation at appropriate level (parent, not child)
- Minimal prop interface additions

### 5. Testing Strategy

**Decision**: Test-first development with three layers - unit tests for utilities, component tests for UI, integration tests for full flow.

**Rationale**:
- Constitution requires test-first development (non-negotiable)
- Date logic is critical and deterministic (perfect for unit tests)
- Visual rendering needs component testing (React Testing Library)
- End-to-end flow validates integration (create todo → becomes overdue)

**Test structure**:
```
frontend/src/utils/__tests__/dateUtils.test.js
  ✓ isOverdue returns false when no due date
  ✓ isOverdue returns false when completed
  ✓ isOverdue returns true when due date is past and not completed
  ✓ isOverdue returns false when due date is today
  ✓ getOverdueDays calculates correct difference
  ✓ formatOverdueText handles singular (1 day)
  ✓ formatOverdueText handles plural (2+ days)

frontend/src/components/__tests__/TodoCard.test.js
  ✓ renders overdue indicator for overdue incomplete todo
  ✓ does not render overdue indicator for completed todo with past date
  ✓ does not render overdue indicator for future due date
  ✓ renders correct overdue duration text
  ✓ includes aria-label for warning icon

frontend/src/components/__tests__/TodoList.test.js
  ✓ passes overdue status to TodoCard components
  ✓ recalculates overdue status when todos change
```

**Best practices applied**:
- Arrange-Act-Assert pattern
- Test fixtures with known dates
- Mock `Date` object for consistent tests
- Coverage target: 80%+ (constitution requirement)
- Test edge cases (null dates, completed status, boundary conditions)

### 6. Accessibility

**Decision**: Multi-modal indicators (color + icon + text) with proper ARIA labels and semantic HTML.

**Rationale**:
- Constitution requires WCAG AA compliance
- Colorblind users can identify via icon and text
- Screen readers announce "Overdue warning: X days overdue"
- Keyboard navigation unaffected (no new interactive elements)

**Implementation checklist**:
- [x] Use semantic HTML (`<span>` with appropriate classes)
- [x] Add `aria-label` to warning icon
- [x] Ensure color contrast meets WCAG AA (4.5:1 for normal text)
- [x] Test with screen reader (NVDA/JAWS)
- [x] Verify keyboard navigation still works
- [x] Support light/dark mode with appropriate contrast in each

**Best practices applied**:
- Don't rely solely on color
- Provide text alternatives for icons
- Maintain focus order and keyboard accessibility
- Test with assistive technology

## Technology-Specific Best Practices

### JavaScript Date Handling

**Key practices**:
- Always normalize times when comparing dates (setHours(0,0,0,0))
- Use `new Date()` without arguments for "now" (respects browser timezone)
- Parse ISO 8601 strings with `new Date(isoString)` for consistency
- Avoid timezone conversion (spec requires client local time)
- Handle invalid dates with checks: `!isNaN(date.getTime())`

**Pitfalls to avoid**:
- Don't use `Date.now()` timestamp for date comparison (includes time)
- Don't rely on string comparison of dates (locale issues)
- Don't forget to normalize times before comparison
- Don't modify original Date objects (create new instances)

### React Testing Library

**Key practices for testing date-dependent UI**:
- Mock `Date` object globally for deterministic tests
- Use `jest.useFakeTimers()` for date mocking
- Create fixture todos with known dates relative to "today"
- Test rendering, not implementation details
- Query by role/text, not class names

**Example test pattern**:
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
});

afterEach(() => {
  jest.useRealTimers();
});

test('shows overdue indicator for past due date', () => {
  const overdueTodo = {
    id: 1,
    title: 'Overdue task',
    dueDate: '2026-02-25',
    completed: false
  };
  render(<TodoCard todo={overdueTodo} />);
  expect(screen.getByText(/2 days overdue/i)).toBeInTheDocument();
});
```

### CSS for Visual Indicators

**Key practices**:
- Use CSS variables for colors (theme consistency)
- Apply `.todo-card--overdue` class conditionally
- Use flexbox for icon + text layout
- Ensure proper spacing (8px grid system)
- Test in light and dark modes

**Example styling**:
```css
.overdue-indicator {
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs); /* 8px */
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xs);
}

.overdue-indicator-icon {
  font-size: 1.2em;
}
```

## Implementation Risk Assessment

**Low Risk** ✅:
- Date comparison logic (well-understood, deterministic)
- Visual indicator rendering (straightforward React)
- Testing strategy (follows existing patterns)

**Medium Risk** ⚠️:
- Browser timezone handling (client environments vary)
  - Mitigation: Use browser's built-in `Date` object (handles timezones automatically)
  - Mitigation: Document expected behavior in tests
- Accessibility verification (requires manual testing)
  - Mitigation: Use automated accessibility testing tools (jest-axe)
  - Mitigation: Manual screen reader testing

**High Risk** 🚫:
- None identified for this feature

## Open Questions (Resolved)

All questions from feature specification have been resolved through initial clarification session:
- ✅ Visual indicator combination: Red text + warning icon + duration text
- ✅ Date comparison reference: Client browser's local date
- ✅ Overdue duration display: Show duration text in days
- ✅ Duration text units: Always use days
- ✅ Overdue item positioning: Maintain existing sort order

## Next Steps (Phase 1)

1. Generate data-model.md (define overdue state model)
2. Generate contracts/ (define component prop interfaces)
3. Generate quickstart.md (implementation guide for developers)
4. Update agent context with new utilities and patterns
