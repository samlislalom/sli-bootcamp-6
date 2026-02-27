# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature follows Test-Driven Development (TDD) as documented in quickstart.md. Tests are included and should be written BEFORE implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo web application:
- Frontend: `packages/frontend/src/`
- Backend: `packages/backend/src/` (no changes needed for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for date utilities

- [ ] T001 Create utils directory at packages/frontend/src/utils/
- [ ] T002 Create test directory at packages/frontend/src/utils/__tests__/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Note**: No foundational blocking tasks for this feature - existing infrastructure is sufficient.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately identify overdue tasks through visual indicators (red text, warning icon, duration text) without manually comparing dates.

**Independent Test**: Create todos with various due dates (past, today, future) and completion statuses. Verify that only incomplete tasks with past due dates show overdue indicators with correct duration text.

### Tests for User Story 1 (Write FIRST - TDD)

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T003 [P] [US1] Write test for isOverdue returns false when dueDate is null in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T004 [P] [US1] Write test for isOverdue returns false when completed is true in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T005 [P] [US1] Write test for isOverdue returns false when dueDate is today in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T006 [P] [US1] Write test for isOverdue returns false when dueDate is future in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T007 [P] [US1] Write test for isOverdue returns true when dueDate is past and not completed in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T008 [P] [US1] Write test for isOverdue handles invalid date strings in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T009 [P] [US1] Write test for getOverdueDays returns 1 for yesterday in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T010 [P] [US1] Write test for getOverdueDays returns 7 for one week ago in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T011 [P] [US1] Write test for getOverdueDays returns correct count for large numbers in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T012 [P] [US1] Write test for formatOverdueText uses singular day for 1 in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T013 [P] [US1] Write test for formatOverdueText uses plural days for 2+ in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T014 [US1] Run tests to verify they fail (RED phase) - npm test dateUtils.test.js in packages/frontend/

### Implementation for User Story 1 - Date Utilities

- [ ] T015 [US1] Implement isOverdue function in packages/frontend/src/utils/dateUtils.js
- [ ] T016 [US1] Implement getOverdueDays function in packages/frontend/src/utils/dateUtils.js
- [ ] T017 [US1] Implement formatOverdueText function in packages/frontend/src/utils/dateUtils.js
- [ ] T018 [US1] Run tests to verify they pass (GREEN phase) - npm test dateUtils.test.js in packages/frontend/

### Tests for User Story 1 - TodoCard Component

- [ ] T019 [P] [US1] Write test for TodoCard renders overdue indicators when isOverdue is true in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T020 [P] [US1] Write test for TodoCard does not render overdue indicators when isOverdue is false in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T021 [P] [US1] Write test for TodoCard does not render overdue for completed todo with past date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T022 [P] [US1] Write test for TodoCard uses singular form for 1 day overdue in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T023 [P] [US1] Write test for TodoCard includes aria-label for warning icon in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T024 [US1] Run tests to verify they fail (RED phase) - npm test TodoCard.test.js in packages/frontend/

### Implementation for User Story 1 - TodoCard Component

- [ ] T025 [US1] Import formatOverdueText from dateUtils in packages/frontend/src/components/TodoCard.js
- [ ] T026 [US1] Add overdue indicator rendering with icon and duration text in packages/frontend/src/components/TodoCard.js
- [ ] T027 [US1] Run tests to verify they pass (GREEN phase) - npm test TodoCard.test.js in packages/frontend/

### Tests for User Story 1 - TodoList Component

- [ ] T028 [P] [US1] Write test for TodoList computes and passes overdue status to TodoCard in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T029 [P] [US1] Write test for TodoList handles todos without due dates in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T030 [P] [US1] Write test for TodoList handles mixed overdue and non-overdue todos in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T031 [US1] Run tests to verify they fail (RED phase) - npm test TodoList.test.js in packages/frontend/

### Implementation for User Story 1 - TodoList Component

- [ ] T032 [US1] Import isOverdue and getOverdueDays from dateUtils in packages/frontend/src/components/TodoList.js
- [ ] T033 [US1] Compute overdue status for all todos before passing to TodoCard in packages/frontend/src/components/TodoList.js
- [ ] T034 [US1] Run tests to verify they pass (GREEN phase) - npm test TodoList.test.js in packages/frontend/

### Styling for User Story 1

- [ ] T035 [P] [US1] Add overdue-indicator CSS class with red text color and flexbox layout in packages/frontend/src/App.css
- [ ] T036 [P] [US1] Add overdue-icon CSS class for warning icon sizing in packages/frontend/src/App.css
- [ ] T037 [P] [US1] Add overdue-text CSS class for duration text styling in packages/frontend/src/App.css
- [ ] T038 [P] [US1] Add dark mode support for overdue indicators using prefers-color-scheme in packages/frontend/src/App.css
- [ ] T039 [P] [US1] Verify WCAG AA contrast ratios meet 4.5:1 minimum for overdue text colors

### Integration Testing for User Story 1

- [ ] T040 [US1] Manual test: Create todo with due date yesterday, verify shows overdue with "1 day overdue"
- [ ] T041 [US1] Manual test: Create todo with due date last week, verify shows overdue with "7 days overdue"
- [ ] T042 [US1] Manual test: Create todo with due date today, verify does NOT show overdue
- [ ] T043 [US1] Manual test: Create todo with due date in future, verify does NOT show overdue
- [ ] T044 [US1] Manual test: Complete an overdue todo, verify overdue indicator disappears immediately
- [ ] T045 [US1] Manual test: Verify warning icon has accessible aria-label using screen reader
- [ ] T046 [US1] Run full test suite to verify 80%+ coverage target - npm test in packages/frontend/

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can visually identify overdue tasks.

---

## Phase 4: User Story 2 - Overdue Indicator Persistence (Priority: P2)

**Goal**: Overdue status automatically updates based on current date, so tasks that become overdue overnight are shown as overdue without manual refresh.

**Independent Test**: Create a todo with today's due date, simulate date change to tomorrow (using test utilities), verify it automatically shows as overdue when component re-renders.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T047 [P] [US2] Write test for todo due today becomes overdue when date changes to tomorrow in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T048 [P] [US2] Write test for overdue status recalculated on component mount in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T049 [P] [US2] Write test for overdue status updates when todos prop changes in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T050 [US2] Run tests to verify they fail (RED phase) - npm test TodoList.test.js in packages/frontend/

### Implementation for User Story 2

**Note**: No code changes needed - existing implementation already computes overdue status on each render. This phase validates the behavior.

- [ ] T051 [US2] Verify TodoList computes overdue status on every render (no caching) in packages/frontend/src/components/TodoList.js
- [ ] T052 [US2] Run tests to verify they pass (GREEN phase) - npm test TodoList.test.js in packages/frontend/

### Integration Testing for User Story 2

- [ ] T053 [US2] Manual test: Create todo due today, leave browser open overnight, verify shows overdue next day
- [ ] T054 [US2] Manual test: Reload page after midnight, verify all newly overdue tasks display correctly
- [ ] T055 [US2] Manual test: Edit todo due date from future to past, verify overdue indicator appears immediately

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Overdue status persists and updates automatically.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

- [ ] T056 [P] Add JSDoc comments to all dateUtils functions if not already present in packages/frontend/src/utils/dateUtils.js
- [ ] T057 [P] Add PropTypes or TypeScript types for new todo props (isOverdue, overdueDays) in packages/frontend/src/components/TodoCard.js
- [ ] T058 [P] Update feature documentation if needed in specs/001-overdue-todos/
- [ ] T059 Code review: Verify ESLint compliance and coding guidelines adherence
- [ ] T060 Code review: Verify test coverage meets 80%+ target - npm test -- --coverage in packages/frontend/
- [ ] T061 Accessibility audit: Test with screen reader (NVDA or JAWS)
- [ ] T062 Accessibility audit: Test keyboard navigation still works
- [ ] T063 Cross-browser testing: Test in Chrome, Firefox, Safari
- [ ] T064 [P] Performance check: Verify date calculations < 1ms per todo
- [ ] T065 Run quickstart.md validation steps from specs/001-overdue-todos/quickstart.md
- [ ] T066 Final integration test: Run complete test suite - npm test in packages/frontend/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: No blocking tasks for this feature
- **User Story 1 (Phase 3)**: Depends on Setup (Phase 1) completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (builds on existing implementation)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories - **THIS IS THE MVP**
- **User Story 2 (P2)**: Depends on User Story 1 (validates automatic update behavior)

### Within User Story 1

**TDD Workflow (Strict Order)**:
1. **Tests first** (T003-T014): All dateUtils tests → Run to confirm FAIL
2. **Implement utilities** (T015-T018): dateUtils functions → Run tests to confirm PASS
3. **TodoCard tests** (T019-T024): Component tests → Run to confirm FAIL
4. **Implement TodoCard** (T025-T027): Add overdue rendering → Run tests to confirm PASS
5. **TodoList tests** (T028-T031): Integration tests → Run to confirm FAIL
6. **Implement TodoList** (T032-T034): Add overdue computation → Run tests to confirm PASS
7. **Styling** (T035-T039): Can be done in parallel after T026
8. **Integration testing** (T040-T046): Manual and automated validation

**Dependencies within story**:
- T015-T017 (dateUtils implementation) must complete before T025 (TodoCard import)
- T025-T026 (TodoCard update) must complete before T032-T033 (TodoList passes props)
- T035-T038 (styling) can run in parallel with component implementation
- T040-T046 (integration tests) require all implementation complete

### Parallel Opportunities

**Setup (Phase 1)**:
- T001 and T002 can run in parallel (different directories)

**User Story 1 - Tests** (can all run in parallel):
- T003-T013: All dateUtils tests (writing tests, not running)
- T019-T023: All TodoCard tests (writing tests, not running)
- T028-T030: All TodoList tests (writing tests, not running)

**User Story 1 - Styling** (can all run in parallel after T026):
- T035-T039: All CSS tasks (different style rules)

**User Story 2 - Tests** (can all run in parallel):
- T047-T049: All persistence tests

**Polish Phase** (many can run in parallel):
- T056, T057, T058: Documentation tasks
- T064: Performance check (independent)

### User Stories Can Be Worked In Parallel?

**No** - User Story 2 validates behavior that depends on User Story 1 implementation. Must be sequential.

---

## Parallel Examples

### Example 1: Setup Phase

```bash
# Both directory creation tasks can run simultaneously:
Task T001: "Create utils directory at packages/frontend/src/utils/"
Task T002: "Create test directory at packages/frontend/src/utils/__tests__/"
```

### Example 2: User Story 1 - Writing Tests

```bash
# All test writing tasks for dateUtils can be launched together:
Task T003: "Write test for isOverdue returns false when dueDate is null"
Task T004: "Write test for isOverdue returns false when completed is true"
Task T005: "Write test for isOverdue returns false when dueDate is today"
Task T006: "Write test for isOverdue returns false when dueDate is future"
Task T007: "Write test for isOverdue returns true when dueDate is past"
Task T008: "Write test for isOverdue handles invalid dates"
Task T009: "Write test for getOverdueDays returns 1 for yesterday"
Task T010: "Write test for getOverdueDays returns 7 for one week ago"
Task T011: "Write test for getOverdueDays returns correct count for large numbers"
Task T012: "Write test for formatOverdueText uses singular day"
Task T013: "Write test for formatOverdueText uses plural days"
```

### Example 3: User Story 1 - Styling

```bash
# All CSS tasks can be launched together (after TodoCard rendering is done):
Task T035: "Add overdue-indicator CSS class"
Task T036: "Add overdue-icon CSS class"
Task T037: "Add overdue-text CSS class"
Task T038: "Add dark mode support"
Task T039: "Verify WCAG AA contrast ratios"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Recommended)

1. **Complete Phase 1**: Setup (T001-T002) - ~5 minutes
2. **Complete Phase 3**: User Story 1 (T003-T046) - ~2 hours
   - Follow strict TDD: tests → fail → implement → pass → refactor
3. **STOP and VALIDATE**: 
   - Run full test suite
   - Manual testing with various due dates
   - Accessibility check with screen reader
4. **Deploy/demo if ready**: Users can now identify overdue tasks visually

**At this point you have a working MVP!** Users get immediate value.

### Incremental Delivery (Recommended)

1. **Phase 1 + Phase 3** → User Story 1 complete → Test independently → **Deploy MVP** ✅
2. **Phase 4** → User Story 2 complete → Test independently → Deploy update
3. **Phase 5** → Polish complete → Final deployment

**Benefit**: Each phase delivers value. Can stop after MVP if priorities change.

### Full Feature (All User Stories)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1 (MVP functionality)
3. Complete Phase 4: User Story 2 (persistence validation)
4. Complete Phase 5: Polish & validation
5. Final deployment with all features

**Total estimated time**: 3-4 hours for complete implementation with TDD

---

## Notes

- **TDD is mandatory**: Tests must be written FIRST and fail before implementation (per constitution)
- **[P] tasks**: Can run in parallel (different files, no dependencies)
- **[US1] / [US2] labels**: Map tasks to user stories for traceability
- **MVP scope**: User Story 1 only (T001-T046) provides core value
- **Test coverage target**: 80%+ (per constitution requirement)
- **Each user story phase ends with checkpoint**: Verify story works independently
- **Stop at any checkpoint**: Each story delivers value on its own
- **Commit frequency**: After each task or logical group (T014 → run tests, T018 → tests pass)
- **No backend changes needed**: Feature is entirely frontend (client-side date comparison)

---

## Task Summary

**Total Tasks**: 66
- Setup: 2 tasks
- Foundational: 0 tasks (no blocking prerequisites)
- User Story 1: 44 tasks (31 implementation + 13 testing)
- User Story 2: 9 tasks (5 implementation + 4 testing)
- Polish: 11 tasks

**Parallel Opportunities**: 29 tasks marked [P] can run in parallel within their phase

**MVP Task Count**: 46 tasks (Setup + User Story 1)

**Test Tasks**: 30 tasks (TDD workflow)

**Independent Test Criteria**:
- User Story 1: Create todos with various dates, verify visual indicators appear/disappear correctly
- User Story 2: Simulate date changes, verify automatic updates on re-render
