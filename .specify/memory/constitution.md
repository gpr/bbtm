<!--
Sync Impact Report:
- Version change: [template] → 1.0.0 (initial constitution)
- Modified principles: All principles defined from template
- Added sections: Technology Standards, Development Workflow
- Removed sections: None
- Templates requiring updates: ✅ Updated plan-template references
- Follow-up TODOs: None
-->

# Blood Bowl Tournament Management Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)
TDD mandatory for all features: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Contract tests MUST be written before any API implementation. Integration tests required for all user workflows defined in quickstart scenarios.

### II. Mandatory Technology Stack
Frontend development MUST use the standardized toolchain: TypeScript for type safety, pnpm for package management, Vite for build tooling, Prettier for code formatting, Husky for git hooks, Storybook for component documentation, Jest for unit testing, and Mantine for UI components. Firebase provides backend services (Authentication, Firestore, Hosting). Deviations require architectural justification.

### III. Component-First Architecture
Every UI feature starts as an isolated, testable component. Components MUST be self-contained with clear props interfaces, documented in Storybook, and independently testable. Clear separation between presentation components and data-fetching logic. Reusable components follow atomic design principles.

### IV. Firebase Integration Standards
All data operations MUST use Firebase SDK with proper error handling and offline capability consideration. Firestore security rules MUST be comprehensive and tested. Authentication flows follow Firebase best practices with proper token management. Real-time listeners MUST include proper cleanup and connection state handling.

### V. Type Safety and Validation
TypeScript strict mode enforced throughout codebase. All API interfaces defined with TypeScript and validated with Zod schemas. Client-side validation provides immediate feedback; server-side validation via Firestore rules ensures data integrity. No `any` types allowed without explicit justification.

## Technology Standards

All frontend projects MUST adhere to the standardized technology stack:
- **Language**: TypeScript with strict configuration
- **Package Manager**: pnpm for consistent dependency management
- **Build Tool**: Vite for fast development and optimized builds
- **Code Quality**: Prettier for formatting, ESLint for linting
- **Git Workflow**: Husky for pre-commit hooks and conventional commits
- **Component Documentation**: Storybook for isolated component development
- **Testing**: Jest for unit tests, React Testing Library for component tests
- **UI Framework**: Mantine for consistent design system and accessibility
- **Backend**: Firebase (Authentication, Firestore, Hosting, Analytics)

## Development Workflow

Code review requirements: All changes require PR review with constitution compliance verification. Pre-commit hooks enforce formatting, linting, and test execution. Feature branches follow `###-feature-name` convention. Conventional commits required for clear change tracking. Breaking changes require major version increment and migration documentation.

## Governance

This constitution supersedes all other development practices. Amendments require documented justification, team approval, and coordinated updates to all dependent templates and workflows. All PRs must verify compliance with these principles. Complexity that violates simplicity principles must be justified in the Complexity Tracking section of feature plans. Runtime development guidance documented in agent-specific files (CLAUDE.md, etc.) supplements but cannot override constitutional requirements.

**Version**: 1.0.0 | **Ratified**: 2025-09-20 | **Last Amended**: 2025-09-20