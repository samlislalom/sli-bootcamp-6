<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Constitution Type: MINOR (new constitution from template)
Modified Principles: All principles newly defined from project documentation
Added Sections: All sections (initial creation)
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check aligns with principles
  ✅ spec-template.md - Requirements structure supports constitution
  ✅ tasks-template.md - Task organization reflects test-first principle
Follow-up TODOs: None (all placeholders filled)
-->

# Todo App Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

Tests MUST be written before implementation. The workflow is strict:
- Write tests describing expected behavior
- Ensure tests fail (Red)
- Implement minimal code to pass tests (Green)
- Refactor while keeping tests green
- **Target Coverage**: 80%+ across all packages
- Tests MUST be independent, isolated, and not rely on shared state
- Mock all external dependencies (API calls, timers, etc.)

**Rationale**: Test-first development ensures code is testable by design, documents expected behavior, prevents regressions, and maintains high quality standards throughout the codebase.

### II. Code Consistency & Style

All code MUST follow standardized formatting and naming conventions:
- **Indentation**: 2 spaces for all file types
- **Line Length**: Maximum 100 characters
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Components/Classes**: `PascalCase`
- **Import Order**: External libraries → Internal modules → Styles (with blank line separators)
- **No trailing whitespace**, use LF line endings
- ESLint rules MUST be followed; all linting errors MUST be resolved before commits

**Rationale**: Consistent style reduces cognitive load, improves readability, facilitates code reviews, and prevents style-related merge conflicts.

### III. Simplicity & Focus (YAGNI)

Code and features MUST prioritize simplicity:
- **KISS Principle**: Prefer straightforward implementations over complex ones
- **DRY Principle**: Extract common code into shared functions/utilities
- **No Feature Creep**: Build only what is specified; avoid premature optimization
- **Single Responsibility**: Each module/component has one clear purpose
- Complex solutions MUST be justified in writing

**Rationale**: Simple code is easier to understand, maintain, test, and debug. Complexity should only be introduced when clearly necessary and justified.

### IV. SOLID Architecture

Code structure MUST follow SOLID principles:
- **Single Responsibility**: One reason to change per module
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for parent types
- **Interface Segregation**: Depend on specific interfaces, not broad ones
- **Dependency Inversion**: Depend on abstractions, not concrete implementations
- Components MUST have focused, minimal prop interfaces
- Use composition over inheritance

**Rationale**: SOLID principles create maintainable, flexible, and testable code that scales as the project grows.

### V. Design System Adherence

All UI implementations MUST follow the established design system:
- **Color Palette**: Use defined colors for light/dark modes (no arbitrary colors)
- **Typography**: Follow defined font sizes, weights, and families
- **Spacing**: Use 8px grid system (xs=8px, sm=16px, md=24px, lg=32px, xl=48px)
- **Components**: Follow Material Design-inspired patterns
- **Accessibility**: WCAG AA color contrast, keyboard navigation, proper ARIA labels
- **Theme Toggle**: Support light/dark modes with localStorage persistence

**Rationale**: Consistent design creates a cohesive user experience, improves usability, ensures accessibility, and reduces design debt.

### VI. Error Handling & Robustness

All operations that can fail MUST have proper error handling:
- Use try-catch blocks around operations that can throw errors
- Provide meaningful, actionable error messages to users
- Log errors appropriately for debugging
- Validate input data at API boundaries
- Use default values and guard clauses to prevent undefined errors
- Never leave error cases unhandled

**Rationale**: Robust error handling prevents application crashes, improves user experience, and facilitates debugging and maintenance.

### VII. Monorepo Architecture

Project structure MUST follow the established monorepo pattern:
- **Frontend**: React application in `packages/frontend/`
- **Backend**: Express.js API in `packages/backend/`
- **Workspace Management**: npm workspaces for dependency management
- **Colocation**: Tests in `__tests__/` directories next to source files
- **Single User**: No multi-user or authentication complexity
- **Persistence**: Backend handles all data persistence

**Rationale**: Monorepo structure enables code sharing, consistent tooling, simplified dependencies, and coordinated versioning across frontend and backend.

## Technical Standards

### Code Organization

**File Structure Requirements**:
- Group related code together logically
- Follow import order: external → internal → styles
- Place imports at top, exports at bottom
- Use relative paths for internal modules
- Avoid circular dependencies

**Directory Structure**:
```
packages/frontend/src/
  components/          # Reusable UI components with collocated tests
  services/           # API services and business logic
  utils/              # Utility functions
  styles/             # Global and theme styles

packages/backend/src/
  routes/             # Express route handlers
  controllers/        # Business logic
  services/           # Data access layer
  middleware/         # Express middleware
```

### Documentation Requirements

- Comment only "why", not "what"
- Use JSDoc for public functions and components
- Keep comments updated when code changes
- Avoid obvious comments
- Document complex business logic

### Git Practices

- **Atomic Commits**: One logical change per commit
- **Clear Messages**: Format: `type: description` (e.g., `feat: add todo editing`, `fix: resolve date formatting bug`)
- **Feature Branches**: Use pattern `feature/description` or `###-feature-name`
- **Pull Requests**: Required for code review before merging

## Development Workflow

### Pre-Commit Requirements

Before committing code, developers MUST verify:
- [ ] Code follows naming conventions
- [ ] Imports are organized correctly
- [ ] No linting errors or warnings
- [ ] No console.log statements in production code
- [ ] Tests exist for new functionality
- [ ] All tests pass
- [ ] Git commits are atomic and well-described

### Code Review Standards

Pull requests MUST:
- Pass all automated tests
- Meet code coverage targets (80%+)
- Follow all coding guidelines
- Include tests for new features
- Have clear, descriptive commit messages
- Be reviewed by at least one other developer
- Address all review comments before merging

### Testing Strategy

**Test Types**:
1. **Unit Tests**: Individual components/functions in isolation
2. **Integration Tests**: Component interactions and API communication
3. **E2E Tests**: Out of scope for initial development

**Test Organization**:
- Tests collocated in `__tests__/` directories
- Test files named `{filename}.test.js`
- Use Arrange-Act-Assert pattern
- Create fixtures/mocks for consistent test data
- Follow DRY principles in test code

## Governance

### Authority

This constitution supersedes all other development practices and standards. When conflicts arise between this document and other guidance:
1. Constitution principles take precedence
2. Consult team lead for clarification
3. Document resolution for future reference

### Amendment Process

Constitution changes require:
1. Written proposal with rationale
2. Team review and approval
3. Version increment following semantic versioning:
   - **MAJOR**: Backward incompatible changes, principle removals/redefinitions
   - **MINOR**: New principles added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Update of LAST_AMENDED_DATE
5. Propagation to dependent templates and documentation

### Compliance

- All code reviews MUST verify compliance with constitution principles
- Violations MUST be justified in writing with explanation of why simpler alternatives are insufficient
- Complexity MUST be documented in plan.md Complexity Tracking section
- Regular audits to ensure ongoing compliance

### Living Document

This constitution is a living document that evolves with the project:
- Incorporate learnings from development experience
- Update based on team feedback
- Keep synchronized with project documentation
- Review quarterly for relevance and accuracy

---

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
