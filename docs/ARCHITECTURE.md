# Architecture Documentation

## Overview

The Blood Bowl Tournament Management System is built as a single-page application (SPA) using React with a Firebase backend. The architecture follows modern web development best practices with a focus on scalability, maintainability, and security.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Firebase      │    │   Render.com    │
│   (React SPA)   │◄──►│   Backend       │    │   Hosting       │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Components  │ │    │ │ Firestore   │ │    │ │ Static      │ │
│ │ Services    │ │    │ │ Auth        │ │    │ │ Files       │ │
│ │ State Mgmt  │ │    │ │ Storage     │ │    │ │ CDN         │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Routes
│   ├── HomePage
│   ├── TournamentsPage
│   │   ├── TournamentList
│   │   ├── TournamentCard
│   │   └── TournamentFilters
│   ├── TournamentDetailPage
│   │   ├── TournamentInfo
│   │   ├── RegistrationList
│   │   └── RegistrationForm
│   ├── CreateTournamentPage
│   │   └── TournamentForm
│   ├── Dashboard
│   │   ├── UserTournaments
│   │   └── UserRegistrations
│   └── AuthPage
│       ├── LoginForm
│       └── RegisterForm
└── ProtectedRoute
```

### Service Layer

The application uses a service-oriented architecture with dedicated services for different domains:

- **AuthService**: User authentication and profile management
- **TournamentService**: Tournament CRUD operations and real-time updates
- **RegistrationService**: Registration management and validation
- **ErrorService**: Error handling and logging

### State Management

State is managed using React's built-in hooks and context:

- **Local State**: Component-level state with `useState`
- **Authentication State**: Global auth context with `useContext`
- **Server State**: Real-time Firebase listeners with custom hooks
- **Form State**: React Hook Form for complex form management

## Backend Architecture

### Firebase Services

#### Firestore Database

```
/users/{userId}
  - id: string
  - email: string
  - displayName: string
  - isActive: boolean
  - createdAt: timestamp
  - updatedAt: timestamp

/tournaments/{tournamentId}
  - id: string
  - name: string
  - description: string
  - organizerId: string
  - organizerEmail: string
  - maxParticipants: number
  - registrationDeadline: timestamp
  - startDate: timestamp
  - endDate: timestamp
  - status: enum
  - format: enum
  - isPublic: boolean
  - participantCount: number
  - createdAt: timestamp
  - updatedAt: timestamp

/registrations/{registrationId}
  - id: string
  - tournamentId: string
  - userId: string (optional for anonymous)
  - coachName: string
  - teamName: string
  - teamRace: enum
  - contactEmail: string
  - notes: string
  - status: enum
  - isAnonymous: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

#### Security Rules

Firestore security rules implement:
- User authentication requirements
- Data validation
- Access control (users can only modify their own data)
- Organizer permissions for tournament management

#### Indexes

Optimized compound indexes for:
- Tournament listing and filtering
- Registration queries by tournament
- User-specific data retrieval

## Data Flow

### Authentication Flow

1. User submits login/register form
2. AuthService calls Firebase Auth
3. Auth state change triggers listener
4. User profile loaded from Firestore
5. App state updated with user data
6. Protected routes become accessible

### Tournament Creation Flow

1. User submits tournament form
2. TournamentForm validates data with Zod
3. TournamentService creates Firestore document
4. Real-time listener updates UI
5. User redirected to tournament detail page

### Registration Flow

1. User submits registration form
2. RegistrationService validates and checks duplicates
3. Registration document created in Firestore
4. Tournament participant count updated
5. Real-time listeners update all connected clients

## Security

### Authentication

- Firebase Authentication with email/password
- JWT tokens for API authorization
- Automatic token refresh
- Secure logout with token cleanup

### Authorization

- Role-based access control
- Tournament organizer permissions
- User data isolation
- Anonymous registration support

### Data Validation

- Client-side validation with Zod schemas
- Server-side validation with Firestore rules
- XSS prevention with input sanitization
- CSRF protection through Firebase SDK

## Performance

### Frontend Optimization

- Code splitting with dynamic imports
- Bundle optimization with Vite
- Component lazy loading
- Image optimization
- Service worker for caching

### Backend Optimization

- Efficient Firestore queries with indexes
- Real-time listeners with proper cleanup
- Data denormalization for read performance
- Pagination for large datasets

## Monitoring and Logging

### Error Handling

- Global error boundary for React errors
- Service-level error handling
- User-friendly error messages
- Error reporting to logging service

### Analytics

- Performance monitoring
- User interaction tracking
- Error rate monitoring
- Bundle size analysis

## Testing Strategy

### Unit Tests

- Component testing with React Testing Library
- Service layer testing with mocks
- Utility function testing
- Hook testing

### Integration Tests

- End-to-end user flows
- Firebase integration tests
- API contract testing
- Cross-browser testing

### Accessibility Testing

- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA attribute verification

## Deployment

### CI/CD Pipeline

1. Code push triggers GitHub Actions
2. Run tests and linting
3. Build application
4. Deploy to Render.com
5. Run smoke tests
6. Notify team of deployment status

### Environment Management

- Development: Local Firebase emulators
- Staging: Dedicated Firebase project
- Production: Production Firebase project with monitoring

### Rollback Strategy

- Automatic rollback on failed health checks
- Manual rollback capability
- Database migration rollback procedures
- Feature flag toggles for gradual rollouts