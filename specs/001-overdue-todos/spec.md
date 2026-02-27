# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: February 27, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date."

## Clarifications

### Session 2026-02-27

- Q: Visual Indicator Combination - The spec mentions that overdue items need "distinct visual indicators" and shouldn't rely solely on color (FR-007), but doesn't specify which combination to use. → A: Red text color + warning icon (⚠️ or similar)
- Q: Date Comparison Reference - The spec mentions "system or server date" for determining overdue status, but this creates ambiguity for timezone handling and client-server architecture. → A: Use client browser's local date (user's timezone)
- Q: Overdue Duration Display - The spec shows that all overdue items get the same visual indicator, but doesn't specify whether users should see HOW LONG a task has been overdue. → A: Show duration text (e.g., "3 days overdue") next to each overdue item
- Q: Duration Text Units - The edge cases mention using "appropriate units" for duration, but don't specify when to switch between days/weeks/months. → A: Always use days (e.g., "45 days overdue")
- Q: Overdue Item Positioning - The spec describes visual indicators for overdue items but doesn't specify whether overdue items should have any special positioning or sorting behavior in the todo list. → A: Maintain existing sort order (no special positioning)

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

As a user viewing my todo list, I can immediately see which tasks are overdue through visual indicators without having to manually compare dates. Overdue items are clearly distinguished from on-time tasks through color, styling, or iconography that draws my attention.

**Why this priority**: This is the core value of the feature - enabling users to identify overdue tasks at a glance. Without this, users must manually check each task's due date against today's date, which defeats the purpose of the feature.

**Independent Test**: Can be fully tested by creating tasks with various due dates (past, today, future) and verifying that only tasks with due dates in the past and incomplete status are marked as overdue with distinct visual indicators.

**Acceptance Scenarios**:

1. **Given** I have a todo item with a due date in the past and status is not completed, **When** I view my todo list, **Then** that item displays with visual indicators (red text + warning icon) and duration text showing it is overdue
2. **Given** I have a todo item with a due date of today, **When** I view my todo list, **Then** that item does not display as overdue
3. **Given** I have a todo item with a due date in the past but status is completed, **When** I view my todo list, **Then** that item does not display as overdue
4. **Given** I have multiple overdue items in my list, **When** I view my todo list, **Then** all overdue items are consistently marked with the same visual indicators and show their respective overdue durations

---

### User Story 2 - Overdue Indicator Persistence (Priority: P2)

As a user, the overdue status automatically updates based on the current date, so tasks that become overdue overnight are automatically shown as overdue the next time I access the application, without any manual refresh or action needed.

**Why this priority**: This ensures the feature remains accurate and useful over time. Users should trust that the overdue indicators are always current, but this is secondary to initially showing overdue status.

**Independent Test**: Can be fully tested by creating a todo with today's due date, waiting until the next day (or simulating date change), and verifying it automatically shows as overdue.

**Acceptance Scenarios**:

1. **Given** I have a todo item due today, **When** the date changes to tomorrow, **Then** the item automatically appears as overdue when I next view my list
2. **Given** I have been away from the application for several days, **When** I return and view my todo list, **Then** all items with due dates in the past are marked as overdue based on the current date

### Edge Cases

- What happens when a todo item has no due date set? (Expected: Item is not marked as overdue, since there's no date to compare against)
- What happens when a user's system clock is set incorrectly? (Expected: Overdue status is based on the client browser's local date, so an incorrect system clock will affect overdue calculations)
- What happens when a user completes an overdue task? (Expected: The overdue visual indicator is removed immediately, regardless of the due date)
- What happens at exactly midnight when today's tasks become overdue? (Expected: Tasks due on the previous day show as overdue; timing depends on when the user views the list)
- What happens with todos that have been overdue for extended periods (weeks, months)? (Expected: All overdue items display the same visual indicator; duration text always uses days regardless of length, e.g., "45 days overdue")
- What happens with the duration text for a task that is 1 day overdue vs multiple days? (Expected: Use proper pluralization - "1 day overdue" vs "2 days overdue")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine if a todo item is overdue by comparing its due date against the client browser's current local date (user's timezone)
- **FR-002**: System MUST mark a todo as overdue only when both conditions are met: (a) the due date is before the current date, AND (b) the todo status is not completed
- **FR-003**: System MUST apply distinct visual indicators to overdue items using red text color combined with a warning icon (⚠️ or similar), ensuring accessibility for users with color vision deficiencies
- **FR-003a**: System MUST display duration text next to each overdue item showing how long the task has been overdue, always expressed in days (e.g., "1 day overdue", "45 days overdue") with proper pluralization
- **FR-004**: System MUST NOT mark todos without due dates as overdue
- **FR-005**: System MUST update overdue status in real-time when a todo's completion status changes
- **FR-006**: System MUST calculate overdue status based on date only (not time), treating "due today" as not overdue
- **FR-007**: Visual indicators for overdue status MUST be clearly distinguishable for users with color vision deficiencies (should not rely solely on color)
- **FR-008**: System MUST NOT change the sort order or positioning of overdue items; overdue status is indicated only through visual styling (icon, color, duration text)

### Key Entities

- **Todo Item**: Represents a task in the system. Relevant attributes include:  
  - Due date (optional date field)
  - Completion status (completed/not completed)
  - Other standard todo attributes (title, description, priority, etc.)
  
- **Current Date**: The client browser's local date (in the user's timezone) used for comparison. This is the reference point for determining if a todo is overdue. Not stored as data but computed at time of display from the browser's date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify which tasks are overdue within 3 seconds of viewing their todo list, without reading individual due dates
- **SC-002**: Overdue visual indicators are clearly distinguishable to users with color vision deficiencies (verified through accessibility testing)
- **SC-003**: Users can accurately identify overdue status for 100% of tasks when comparing against a reference list
- **SC-004**: The overdue status is updated accurately when system date changes (100% accuracy in automated date-based testing)
- **SC-005**: Task completion removes overdue indicators immediately for 100% of test cases
- **SC-006**: Zero false positives (tasks incorrectly marked as overdue) and zero false negatives (overdue tasks not marked) in functional testing
