
# Implementation Plan: Blood Bowl Tournament Management System

**Branch**: `001-first-release` | **Date**: 2025-09-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/opt/home/gpr/workspaces/bbtm/specs/001-first-release/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Web application for managing Blood Bowl tournaments with React frontend and Firebase backend. Allows tournament organizers to create tournaments and coaches to register with their team information. Supports both registered user accounts and anonymous registration forms. Core functionality includes user authentication, tournament creation, and coach registration with mandatory fields (alias, email, team race) and optional fields (full name, NAF number, team name).

## Technical Context
**Language/Version**: TypeScript with React 18+ for frontend (constitutional requirement)
**Primary Dependencies**: React, Firebase (Authentication, Firestore), React Router, Mantine UI components
**Storage**: Firebase Firestore for data persistence
**Testing**: Jest with React Testing Library for frontend unit tests, Cypress for integration tests
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: web - determines source structure (frontend + backend/Firebase)
**Performance Goals**: <2s initial page load, <500ms form submissions, responsive design for mobile and desktop
**Constraints**: Firebase free tier limitations, client-side data validation, offline capability not required for MVP
**Scale/Scope**: 100+ tournaments, 1000+ coaches per tournament, 5-10 key user interfaces
**Build Tools**: pnpm (package management), Vite (build), Prettier (formatting), Husky (git hooks), Storybook (component docs)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Status**: Blood Bowl Tournament Management Constitution v1.0.0

✅ **I. Test-First Development**: TDD approach with contract tests before implementation, integration tests for all quickstart scenarios
✅ **II. Mandatory Technology Stack**: TypeScript, pnpm, Vite, Prettier, Husky, Storybook, Jest, Mantine UI, Firebase backend
✅ **III. Component-First Architecture**: UI features as isolated, testable components with Storybook documentation
✅ **IV. Firebase Integration Standards**: Proper SDK usage, comprehensive security rules, real-time listener management
✅ **V. Type Safety and Validation**: TypeScript strict mode, Zod validation schemas, no any types

**Post-Design Re-evaluation**:
✅ **Technology Compliance**: All mandatory tools specified in technical context
✅ **Testing Strategy**: Contract tests before implementation, comprehensive test scenarios
✅ **Component Design**: Atomic design principles with clear separation of concerns
✅ **Type Safety**: Full TypeScript interfaces with Zod validation
✅ **Firebase Standards**: Security rules, error handling, offline considerations

**No constitutional violations identified** - design fully compliant with all constitutional requirements.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 (Web application) - React frontend with Firebase backend services

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Setup and Infrastructure Tasks**:
   - Project initialization (Vite + React + TypeScript)
   - Firebase configuration and setup
   - Development tooling (ESLint, Prettier, testing)
   - CI/CD pipeline setup with Render deployment

2. **Contract Test Tasks** (from contracts/api-contracts.md):
   - Authentication contract tests [P]
   - Tournament CRUD contract tests [P]
   - Registration CRUD contract tests [P]
   - Error handling contract tests [P]

3. **Data Model Tasks** (from data-model.md):
   - TypeScript interfaces for User, Tournament, CoachRegistration [P]
   - Zod validation schemas [P]
   - Firebase security rules [P]
   - Firestore indexes configuration [P]

4. **Core Service Implementation**:
   - Firebase authentication service
   - Tournament service with CRUD operations
   - Registration service with validation
   - Error handling and notification service

5. **UI Component Tasks**:
   - Authentication components (Login, Register) [P]
   - Tournament management components [P]
   - Registration form components [P]
   - Layout and navigation components [P]

6. **Deployment and Infrastructure Tasks**:
   - Render web service configuration [P]
   - GitHub Actions CI/CD pipeline setup [P]
   - Environment variable configuration for Render [P]
   - Production build optimization and testing [P]
   - Domain configuration and SSL setup [P]

7. **Integration Test Tasks** (from quickstart.md scenarios):
   - User registration and tournament creation workflow
   - Registered user coach registration workflow
   - Anonymous coach registration workflow
   - Tournament management workflow
   - Error handling and validation workflow

**Ordering Strategy**:
1. **Phase A**: Setup and contract tests (parallel execution)
2. **Phase B**: Data models and services (dependency order)
3. **Phase C**: UI components (parallel execution where possible)
4. **Phase D**: Deployment infrastructure (parallel execution)
5. **Phase E**: Integration tests and end-to-end validation

**Dependency Management**:
- Contract tests must pass before implementation
- Data models before services before UI
- Core services before dependent components
- Deployment infrastructure after UI components
- Integration tests after deployment setup complete

**Parallel Execution Markers**:
- [P] for tasks that can run independently
- Clear dependency chains for sequential tasks
- Resource allocation for optimal development flow

**Estimated Output**:
- 40-45 numbered tasks in tasks.md
- 5 distinct phases with clear gates
- Mix of parallel and sequential execution
- Complete test coverage before implementation
- Production-ready deployment pipeline

**Quality Gates**:
- All contract tests passing before Phase B
- All unit tests passing before Phase C
- All component tests passing before Phase D
- Deployment pipeline functional before Phase E
- All integration tests passing before production deployment
- Performance validation in Phase E

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
