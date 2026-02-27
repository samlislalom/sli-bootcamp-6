# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: February 27, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement visual indicators for overdue todo items by comparing due dates against the current browser date. Overdue items (incomplete tasks with past due dates) will display with red text, a warning icon (⚠️), and duration text showing how many days overdue. The feature uses client-side date comparison for immediate visual feedback without server modifications.

## Technical Context

**Language/Version**: JavaScript ES6+ (Node.js 18+ for backend, Modern browsers for frontend)  
**Primary Dependencies**: React 18.2.0, Express 4.18.2, better-sqlite3 11.10.0, axios 1.6.2, Jest 29.7.0  
**Storage**: SQLite database via better-sqlite3 (backend persistence)  
**Testing**: Jest with React Testing Library (frontend), Jest with supertest (backend), 80%+ coverage target  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari latest versions), client-side rendering  
**Project Type**: Web application (monorepo: React SPA frontend + Express REST API backend)  
**Performance Goals**: Instant visual feedback (<50ms for date comparison), smooth UI rendering (60fps)  
**Constraints**: Client-side date comparison using browser local time, single-user application (no multi-tenant complexity), no authentication/authorization layer  
**Scale/Scope**: Small single-user todo application, existing codebase with ~20 components, incremental feature addition

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Phase 0) ✅ PASS

✅ **Test-First Development**: Feature will follow TDD workflow - write tests first for date comparison logic, visual indicator rendering, and duration text formatting. Target 80%+ coverage.

✅ **Code Consistency & Style**: Will follow existing codebase conventions - 2-space indentation, camelCase variables, PascalCase components, ESLint compliance, organized imports.

✅ **Simplicity & Focus (YAGNI)**: Implementation is minimal - adds date comparison utility, updates TodoCard component styling, no new backend endpoints needed. Uses existing todo structure.

✅ **SOLID Architecture**: Single Responsibility maintained - date logic in utility module, visual display in TodoCard component, no prop interface bloat. 

✅ **Design System Adherence**: Will use existing color palette (red from theme for overdue), follows 8px grid spacing, maintains WCAG AA contrast, supports light/dark modes.

✅ **Error Handling & Robustness**: Will handle edge cases - missing due dates, invalid dates, timezone issues, with appropriate defaults and validation.

✅ **Monorepo Architecture**: Feature integrates cleanly into existing structure - frontend components updated, backend unchanged (uses existing dueDate field), tests collocated.

### Post-Design Check (After Phase 1) ✅ PASS

✅ **Test-First Development**: Quickstart.md documents explicit TDD workflow with tests before implementation. All utility functions and components have comprehensive test plans. Coverage target 80%+ maintained.

✅ **Code Consistency & Style**: Design documents specify JSDoc comments, existing naming conventions (camelCase, PascalCase), ESLint compliance. Component structure follows existing patterns (TodoCard, TodoList).

✅ **Simplicity & Focus (YAGNI)**: Design adds only essential elements - 3 pure utility functions, minimal component updates, no optional features. DRY principle applied (utilities reusable, computed once in parent).

✅ **SOLID Architecture**: Single Responsibility verified - dateUtils module for calculations, TodoList for computation, TodoCard for rendering. Pure functions ensure Open/Closed principle. No tight coupling.

✅ **Design System Adherence**: CSS contract specifies existing theme variables (--color-error, --spacing-xs, --font-size-small). WCAG AA compliance documented with multi-modal indicators (color + icon + text). Light/dark mode support included.

✅ **Error Handling & Robustness**: Edge cases documented in data-model.md (null dates, invalid dates, boundary conditions). Graceful degradation specified for missing props. Defensive programming in utility functions.

✅ **Monorepo Architecture**: Design respects packages/frontend and packages/backend separation. Tests collocated in __tests__ directories. No new packages or architectural changes. Backend API unchanged.

**Verdict**: No constitutional violations introduced during design phase. Feature maintains all core principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── todoService.js        # Existing: No changes needed (dueDate field exists)
│   │   ├── app.js                    # Existing: REST API routes (no changes)
│   │   └── index.js                  # Existing: Server entry
│   └── __tests__/
│       └── app.test.js               # Update: Test overdue behavior if needed
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoCard.js           # Update: Add overdue visual indicators
    │   │   ├── TodoList.js           # Update: Pass date comparison results
    │   │   └── __tests__/
    │   │       ├── TodoCard.test.js  # Update: Test overdue rendering
    │   │       └── TodoList.test.js  # Update: Test overdue integration
    │   ├── utils/                    # New: Create directory
    │   │   ├── dateUtils.js          # New: Date comparison & duration logic
    │   │   └── __tests__/
    │   │       └── dateUtils.test.js # New: Test date utilities
    │   ├── styles/
    │   │   └── theme.css             # Existing: May need overdue color tokens
    │   └── App.js                    # Existing: Root component (minimal/no changes)
    └── public/
        └── index.html                # Existing: No changes
```

**Structure Decision**: Monorepo web application structure selected. This is an incremental feature addition requiring:
- **Frontend changes only** for visual indicators (no backend API changes)
- **New utility module** for date comparison logic (`utils/dateUtils.js`)
- **Component updates** to TodoCard and TodoList for rendering overdue state
- **Test additions** collocated with new/modified code following TDD
- **No database schema changes** (uses existing `dueDate` and `completed` fields)

This minimizes scope and follows existing architecture patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitution principles are satisfied:
- Test-first approach will be followed
- Existing code style and patterns maintained
- Simple, incremental implementation
- SOLID principles preserved
- Design system adherence ensured
- Proper error handling included
- Monorepo structure respected
