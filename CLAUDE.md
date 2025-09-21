# Blood Bowl Tournament Management Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-20

## Active Technologies
- TypeScript with React 18+ (001-first-release) - Constitutional requirement
- Firebase (Authentication, Firestore, Hosting) (001-first-release)
- Mantine UI components (001-first-release) - Constitutional requirement
- pnpm + Vite + Prettier + Husky + Storybook (001-first-release) - Constitutional requirements
- Jest + React Testing Library + Cypress (001-first-release)

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

specs/
├── 001-first-release/
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   └── contracts/
```

## Commands
```bash
# Development (Constitutional requirements: pnpm + Vite)
pnpm dev              # Start Vite development server
pnpm build            # Build for production
pnpm test             # Run Jest tests
pnpm test:e2e         # Run Cypress tests
pnpm storybook        # Start Storybook component documentation
pnpm format           # Run Prettier formatting

# Firebase
firebase emulators:start  # Start Firebase emulators
firebase deploy           # Deploy to Firebase hosting
```

## Code Style (Constitutional Requirements)
- TypeScript strict mode enforced (no any types without justification)
- React functional components with hooks
- Mantine UI components for consistent design and accessibility
- React Hook Form + Zod for form validation
- Firebase SDK for backend operations
- Prettier for code formatting (pre-commit hook)
- Conventional commits enforced via Husky

## Architecture Patterns (Constitutional Requirements)
- Component-First: Isolated, testable components documented in Storybook
- Context + useReducer for state management
- Custom hooks for Firebase operations with proper cleanup
- Error boundaries for error handling
- Route-based code splitting
- TDD approach: Contract tests → Implementation (NON-NEGOTIABLE)
- Type safety: TypeScript strict + Zod validation

## Recent Changes
- 001-first-release: Added Blood Bowl tournament management system with React + Firebase

<!-- MANUAL ADDITIONS START -->
<!-- Add your custom development notes here -->
<!-- MANUAL ADDITIONS END -->