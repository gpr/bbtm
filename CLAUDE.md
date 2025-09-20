# Blood Bowl Tournament Management Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-20

## Active Technologies
- JavaScript/TypeScript with React 18+ (001-i-want-to)
- Firebase (Authentication, Firestore) (001-i-want-to)
- Material-UI for components (001-i-want-to)
- Jest + React Testing Library + Cypress (001-i-want-to)

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

specs/
├── 001-i-want-to/
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   └── contracts/
```

## Commands
```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run test          # Run tests
npm run test:e2e      # Run Cypress tests

# Firebase
firebase emulators:start  # Start Firebase emulators
firebase deploy           # Deploy to Firebase hosting
```

## Code Style
- TypeScript for type safety
- React functional components with hooks
- Material-UI for consistent design
- React Hook Form + Zod for form validation
- Firebase SDK for backend operations

## Architecture Patterns
- Context + useReducer for state management
- Custom hooks for Firebase operations
- Error boundaries for error handling
- Route-based code splitting
- TDD approach with contract tests first

## Recent Changes
- 001-i-want-to: Added Blood Bowl tournament management system with React + Firebase

<!-- MANUAL ADDITIONS START -->
<!-- Add your custom development notes here -->
<!-- MANUAL ADDITIONS END -->