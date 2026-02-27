# Interface Contracts: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: February 27, 2026

## Overview

This directory contains interface contract definitions for the overdue todo items feature. Contracts define the public APIs, expected behaviors, and integration patterns for components and utilities.

## Contract Documents

### [components.md](components.md)
Defines React component interfaces for:
- **TodoCard** (modified): Props for rendering overdue indicators
- **TodoList** (modified): Computation and data flow patterns
- **OverdueIndicator** (optional): Extracted subcomponent specification

Includes:
- Prop type definitions (JSDoc format)
- Rendering contracts and business rules
- Accessibility requirements (WCAG AA)
- CSS class specifications
- Testing patterns and examples

### [utilities.md](utilities.md)
Defines utility function interfaces for:
- **isOverdue**: Determine if todo is overdue
- **getOverdueDays**: Calculate days overdue
- **formatOverdueText**: Format duration text with pluralization

Includes:
- Function signatures with JSDoc
- Input/output contracts
- Edge case handling
- Performance guarantees (O(1))
- Testing requirements

## Contract Principles

### 1. Backward Compatibility
All contracts maintain backward compatibility:
- Existing component props remain unchanged
- New props have sensible defaults or graceful degradation
- No breaking changes to public APIs

### 2. Pure Functions
Utility functions follow pure function principles:
- No side effects
- Deterministic outputs
- No external dependencies
- Thread-safe and reusable

### 3. Accessibility First
All UI contracts include accessibility requirements:
- WCAG AA compliance (4.5:1 contrast)
- Screen reader support (ARIA labels)
- Keyboard navigation preservation
- Multi-modal indicators (not color-only)

### 4. Testability
Contracts designed for testability:
- Clear input/output specifications
- Edge cases documented
- Test patterns provided
- 100% coverage achievable

### 5. Performance
Performance guarantees specified:
- O(1) time complexity for date utilities
- Minimal re-render overhead
- No memory leaks
- Efficient data flow patterns

## Contract Usage

### For Developers Implementing Features

1. **Read contracts first** before writing code
2. **Follow function signatures** exactly as specified
3. **Implement edge cases** documented in contracts
4. **Write tests** based on testing patterns
5. **Verify accessibility** requirements are met

### For Developers Consuming APIs

1. **Trust the contracts** - implementations will match
2. **Don't rely on implementation details** - only public contracts
3. **Reference examples** for common usage patterns
4. **Report violations** if implementations don't match contracts

### For Reviewers

1. **Verify implementations match contracts**
2. **Check test coverage** includes contract scenarios
3. **Validate edge cases** are handled
4. **Confirm accessibility** requirements met

## Contract Validation

### Automated Checks

- TypeScript/JSDoc validation (prop types)
- ESLint rules (function signatures)
- Unit tests (edge cases, business rules)
- Integration tests (component interactions)
- Accessibility tests (jest-axe, screen readers)

### Manual Checks

- Visual review in light/dark modes
- Screen reader testing (NVDA/JAWS)
- Keyboard navigation verification
- Cross-browser testing

## Contract Evolution

### Making Changes

**Minor changes** (backward compatible):
- Adding optional props
- Adding new utility functions
- Enhancing documentation
- Adding examples

**Major changes** (breaking):
- Changing function signatures
- Removing props or functions
- Changing return types
- Altering business rules

### Process for Breaking Changes

1. Propose change with rationale
2. Review impact on consumers
3. Create migration guide
4. Version bump (major)
5. Update all contract docs
6. Communicate to team

## Related Documentation

- [../data-model.md](../data-model.md) - Entity definitions and state transitions
- [../research.md](../research.md) - Technical decisions and best practices
- [../quickstart.md](../quickstart.md) - Implementation guide for developers
- [../plan.md](../plan.md) - Overall implementation plan

## Summary

**Total Contracts**:
- 2 modified components (TodoCard, TodoList)
- 1 optional new component (OverdueIndicator)
- 3 utility functions (isOverdue, getOverdueDays, formatOverdueText)

**Key Requirements**:
- Backward compatible
- Pure functions (utilities)
- WCAG AA accessible (components)
- 100% testable
- O(1) performance

**Contract Compliance**: All implementations MUST match these contracts exactly.
