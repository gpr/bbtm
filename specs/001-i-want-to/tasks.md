# Tasks: Blood Bowl Tournament Management System

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/api-contracts.md, quickstart.md

## Execution Flow (main)

```bash
1. Load plan.md from feature directory
   → Tech stack: React 18+, TypeScript, Firebase, Mantine UI, Vite, Render
   → Structure: Web application (frontend + Firebase backend)
2. Load design documents:
   → data-model.md: User, Tournament, CoachRegistration entities
   → contracts/: Authentication, Tournament, Registration endpoints
   → quickstart.md: 5 core user workflow scenarios
3. Generate tasks by category:
   → Setup: project init, dependencies, tooling
   → Tests: contract tests, integration tests (TDD)
   → Core: models, services, components
   → Integration: Firebase, deployment
   → Polish: validation, optimization, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T045)
6. Validate task completeness
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` for React application
- **Tests**: `frontend/tests/` for all test files
- **Configuration**: Repository root for config files

## Phase 3.1: Setup and Infrastructure

- [ ] T001 Create project structure per implementation plan (frontend/, docs/, .github/)
- [ ] T002 Initialize React project with Vite, TypeScript, and pnpm
- [ ] T003 [P] Configure ESLint, Prettier, and Husky git hooks
- [ ] T004 [P] Setup Mantine UI dependencies and provider in frontend/src/main.tsx
- [ ] T005 [P] Configure Firebase project and SDK in frontend/src/config/firebase.ts
- [ ] T006 [P] Setup Vitest and testing environment in frontend/vitest.config.ts
- [ ] T007 [P] Configure React Router setup in frontend/src/App.tsx
- [ ] T008 [P] Setup Storybook for component documentation

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests [P]

- [ ] T009 [P] Contract test POST /auth/register in frontend/tests/contract/auth-register.test.ts
- [ ] T010 [P] Contract test POST /auth/login in frontend/tests/contract/auth-login.test.ts
- [ ] T011 [P] Contract test GET /tournaments in frontend/tests/contract/tournaments-list.test.ts
- [ ] T012 [P] Contract test POST /tournaments in frontend/tests/contract/tournaments-create.test.ts
- [ ] T013 [P] Contract test GET /tournaments/:id in frontend/tests/contract/tournaments-get.test.ts
- [ ] T014 [P] Contract test PUT /tournaments/:id in frontend/tests/contract/tournaments-update.test.ts
- [ ] T015 [P] Contract test DELETE /tournaments/:id in frontend/tests/contract/tournaments-delete.test.ts
- [ ] T016 [P] Contract test POST /tournaments/:id/registrations in frontend/tests/contract/registrations-create.test.ts
- [ ] T017 [P] Contract test GET /tournaments/:id/registrations in frontend/tests/contract/registrations-list.test.ts
- [ ] T018 [P] Contract test PUT /tournaments/:id/registrations/:id in frontend/tests/contract/registrations-update.test.ts

### Integration Tests [P]

- [ ] T019 [P] Integration test user registration workflow in frontend/tests/integration/user-registration.test.ts
- [ ] T020 [P] Integration test tournament creation workflow in frontend/tests/integration/tournament-creation.test.ts
- [ ] T021 [P] Integration test registered coach registration in frontend/tests/integration/coach-registration-user.test.ts
- [ ] T022 [P] Integration test anonymous coach registration in frontend/tests/integration/coach-registration-anon.test.ts
- [ ] T023 [P] Integration test tournament management in frontend/tests/integration/tournament-management.test.ts
- [ ] T024 [P] Integration test error handling and validation in frontend/tests/integration/error-handling.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models and Types [P]

- [ ] T025 [P] User interface and types in frontend/src/types/user.ts
- [ ] T026 [P] Tournament interface and types in frontend/src/types/tournament.ts
- [ ] T027 [P] CoachRegistration interface and types in frontend/src/types/registration.ts
- [ ] T028 [P] TeamRace and RegistrationStatus enums in frontend/src/types/enums.ts
- [ ] T029 [P] Zod validation schemas in frontend/src/schemas/validation.ts

### Firebase Services

- [ ] T030 Firebase Authentication service in frontend/src/services/auth.service.ts
- [ ] T031 Tournament Firebase service in frontend/src/services/tournament.service.ts
- [ ] T032 Registration Firebase service in frontend/src/services/registration.service.ts
- [ ] T033 Error handling service in frontend/src/services/error.service.ts

### UI Components [P]

- [ ] T034 [P] Authentication components (Login, Register) in frontend/src/components/auth/
- [ ] T035 [P] Tournament list component in frontend/src/components/tournaments/TournamentList.tsx
- [ ] T036 [P] Tournament detail component in frontend/src/components/tournaments/TournamentDetail.tsx
- [ ] T037 [P] Tournament form component in frontend/src/components/tournaments/TournamentForm.tsx
- [ ] T038 [P] Registration form component in frontend/src/components/registrations/RegistrationForm.tsx
- [ ] T039 [P] Registration list component in frontend/src/components/registrations/RegistrationList.tsx
- [ ] T040 [P] Navigation and layout components in frontend/src/components/layout/

### Pages and Routing

- [ ] T041 Dashboard page in frontend/src/pages/Dashboard.tsx
- [ ] T042 Tournament pages (List, Detail, Create, Edit) in frontend/src/pages/tournaments/
- [ ] T043 Registration pages and forms in frontend/src/pages/registrations/
- [ ] T044 Protected route components and auth guards in frontend/src/components/routing/

## Phase 3.4: Firebase Integration and Security

- [ ] T045 Firestore security rules in firestore.rules
- [ ] T046 Firebase indexes configuration in firestore.indexes.json
- [ ] T047 Real-time listeners with proper cleanup in Firebase services
- [ ] T048 Error boundary implementation in frontend/src/components/ErrorBoundary.tsx

## Phase 3.5: Deployment and CI/CD [P]

- [ ] T049 [P] Render deployment configuration in render.yaml
- [ ] T050 [P] GitHub Actions CI/CD pipeline in .github/workflows/deploy.yml
- [ ] T051 [P] Environment variables setup for production
- [ ] T052 [P] Build optimization and bundle analysis

## Phase 3.6: Polish and Validation

- [ ] T053 [P] Unit tests for utility functions in frontend/tests/unit/
- [ ] T054 [P] Component unit tests in frontend/tests/components/
- [ ] T055 [P] Custom hooks unit tests in frontend/tests/hooks/
- [ ] T056 [P] Accessibility testing and improvements
- [ ] T057 [P] Performance optimization and monitoring
- [ ] T058 Manual testing execution per quickstart.md scenarios
- [ ] T059 [P] Storybook stories for all components
- [ ] T060 [P] Documentation updates in docs/ directory

## Dependencies

### Critical Path Dependencies

- **Setup** (T001-T008) → **Tests** (T009-T024) → **Implementation** (T025-T048) → **Deployment** (T049-T052) → **Polish** (T053-T060)
- **Data Models** (T025-T029) → **Firebase Services** (T030-T033) → **UI Components** (T034-T040) → **Pages** (T041-T044)
- **Contract Tests** (T009-T018) must fail before implementing corresponding services
- **Integration Tests** (T019-T024) must fail before implementing workflows

### Service Dependencies

- T030 (Auth service) → T034 (Auth components) → T041 (Dashboard)
- T031 (Tournament service) → T035-T037 (Tournament components) → T042 (Tournament pages)
- T032 (Registration service) → T038-T039 (Registration components) → T043 (Registration pages)
- T033 (Error service) → T048 (Error boundary)

### Firebase Dependencies

- T005 (Firebase config) → T030-T032 (Firebase services)
- T045-T046 (Security rules/indexes) → T047 (Real-time listeners)

## Parallel Execution Examples

### Phase 3.2: Contract Tests (Launch together)

```bash
# All contract tests can run in parallel - different files, no shared state
Task: "Contract test POST /auth/register in frontend/tests/contract/auth-register.test.ts"
Task: "Contract test POST /auth/login in frontend/tests/contract/auth-login.test.ts"
Task: "Contract test GET /tournaments in frontend/tests/contract/tournaments-list.test.ts"
Task: "Contract test POST /tournaments in frontend/tests/contract/tournaments-create.test.ts"
```

### Phase 3.2: Integration Tests (Launch together)

```bash
# All integration tests can run in parallel - different scenarios, isolated state
Task: "Integration test user registration workflow in frontend/tests/integration/user-registration.test.ts"
Task: "Integration test tournament creation workflow in frontend/tests/integration/tournament-creation.test.ts"
Task: "Integration test registered coach registration in frontend/tests/integration/coach-registration-user.test.ts"
Task: "Integration test anonymous coach registration in frontend/tests/integration/coach-registration-anon.test.ts"
```

### Phase 3.3: Data Models (Launch together)

```bash
# All data model files can be created in parallel - no dependencies
Task: "User interface and types in frontend/src/types/user.ts"
Task: "Tournament interface and types in frontend/src/types/tournament.ts"
Task: "CoachRegistration interface and types in frontend/src/types/registration.ts"
Task: "TeamRace and RegistrationStatus enums in frontend/src/types/enums.ts"
```

### Phase 3.3: UI Components (Launch together after services)

```bash
# UI components can be built in parallel once services exist
Task: "Authentication components (Login, Register) in frontend/src/components/auth/"
Task: "Tournament list component in frontend/src/components/tournaments/TournamentList.tsx"
Task: "Registration form component in frontend/src/components/registrations/RegistrationForm.tsx"
Task: "Navigation and layout components in frontend/src/components/layout/"
```

### Phase 3.5: Deployment (Launch together)

```bash
# Deployment infrastructure can be configured in parallel
Task: "Render deployment configuration in render.yaml"
Task: "GitHub Actions CI/CD pipeline in .github/workflows/deploy.yml"
Task: "Environment variables setup for production"
Task: "Build optimization and bundle analysis"
```

## Task Generation Rules Applied

1. **From Contracts (api-contracts.md)**:
   - Each endpoint → contract test task [P] (T009-T018)
   - Each service group → implementation task (T030-T032)

2. **From Data Model (data-model.md)**:
   - Each entity → TypeScript interface task [P] (T025-T027)
   - Enums → separate task [P] (T028)
   - Validation → Zod schemas task [P] (T029)

3. **From Quickstart Scenarios**:
   - Each workflow → integration test [P] (T019-T024)
   - Manual testing → validation task (T058)

4. **From Tech Stack (plan.md)**:
   - React + TypeScript → component tasks [P] (T034-T040)
   - Vite + pnpm → setup tasks (T001-T002)
   - Firebase → service and config tasks (T005, T030-T032, T045-T047)
   - Render → deployment tasks [P] (T049-T052)

## Validation Checklist

**GATE: All items verified before task execution**

- [x] All contracts have corresponding tests (T009-T018 cover all endpoints)
- [x] All entities have model tasks (T025-T029 cover User, Tournament, Registration, enums)
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] All quickstart scenarios have integration tests (T019-T024)
- [x] TDD approach enforced (contract tests must fail first)
- [x] Constitutional requirements met (TypeScript, Mantine, Vite, pnpm, Firebase)

## Quality Gates

- **Gate 1**: All contract tests fail (T009-T018) → Proceed to implementation
- **Gate 2**: All integration tests fail (T019-T024) → Proceed to workflow implementation
- **Gate 3**: All services implemented (T030-T033) → Proceed to UI components
- **Gate 4**: All components working (T034-T040) → Proceed to pages and routing
- **Gate 5**: All pages functional (T041-T044) → Proceed to deployment
- **Gate 6**: Deployment successful (T049-T052) → Proceed to polish phase

## Notes

- **TDD Enforcement**: Tests T009-T024 MUST be written and MUST FAIL before any implementation begins
- **Firebase Focus**: No traditional backend - Firebase handles auth, database, and hosting
- **Constitutional Compliance**: All mandatory technologies from constitution included
- **Render Deployment**: Optimized for Render platform with automatic CI/CD
- **Component-First**: Mantine UI components with Storybook documentation
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Performance**: Bundle optimization and monitoring included
- **Accessibility**: WCAG compliance testing included

Total tasks: 60 (setup: 8, tests: 16, implementation: 20, integration: 4, deployment: 4, polish: 8)
Parallel execution opportunities: 35 tasks marked [P] for optimal development velocity
