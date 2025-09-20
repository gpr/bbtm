# API Contracts: Blood Bowl Tournament Management System

**Date**: 2025-09-20
**Feature**: Blood Bowl Tournament Management System
**Phase**: 1 - API Contract Definitions

## Overview
This document defines the API contracts for Firebase Firestore operations, providing a REST-like interface specification for frontend-backend communication.

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request**:
```typescript
{
  email: string;
  password: string;
  displayName?: string;
}
```

**Response Success (201)**:
```typescript
{
  user: {
    id: string;
    email: string;
    displayName?: string;
    createdAt: string; // ISO timestamp
  },
  token: string;
}
```

**Response Error (400/409)**:
```typescript
{
  error: {
    code: "INVALID_EMAIL" | "EMAIL_EXISTS" | "WEAK_PASSWORD";
    message: string;
  }
}
```

### POST /auth/login
Authenticate existing user.

**Request**:
```typescript
{
  email: string;
  password: string;
}
```

**Response Success (200)**:
```typescript
{
  user: {
    id: string;
    email: string;
    displayName?: string;
  },
  token: string;
}
```

**Response Error (401)**:
```typescript
{
  error: {
    code: "INVALID_CREDENTIALS" | "USER_NOT_FOUND";
    message: string;
  }
}
```

### POST /auth/logout
Invalidate user session.

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success (204)**: No content

## Tournament Endpoints

### GET /tournaments
List tournaments with filtering options.

**Query Parameters**:
- `public?: boolean` - Filter by public tournaments
- `organizer?: string` - Filter by organizer ID
- `registrationOpen?: boolean` - Filter by registration status
- `limit?: number` - Page size (default: 25, max: 50)
- `cursor?: string` - Pagination cursor

**Response Success (200)**:
```typescript
{
  tournaments: Array<{
    id: string;
    name: string;
    description?: string;
    organizer: string;
    organizerEmail: string;
    maxParticipants?: number;
    registrationOpen: boolean;
    registrationDeadline?: string; // ISO timestamp
    startDate?: string; // ISO timestamp
    endDate?: string; // ISO timestamp
    isPublic: boolean;
    participantCount: number;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
  }>;
  nextCursor?: string;
  hasMore: boolean;
}
```

### GET /tournaments/:id
Get tournament details.

**Response Success (200)**:
```typescript
{
  tournament: {
    id: string;
    name: string;
    description?: string;
    organizer: string;
    organizerEmail: string;
    maxParticipants?: number;
    registrationOpen: boolean;
    registrationDeadline?: string; // ISO timestamp
    startDate?: string; // ISO timestamp
    endDate?: string; // ISO timestamp
    isPublic: boolean;
    participantCount: number;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
  }
}
```

**Response Error (404)**:
```typescript
{
  error: {
    code: "TOURNAMENT_NOT_FOUND";
    message: string;
  }
}
```

### POST /tournaments
Create new tournament.

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```typescript
{
  name: string;
  description?: string;
  maxParticipants?: number;
  registrationDeadline?: string; // ISO timestamp
  startDate?: string; // ISO timestamp
  endDate?: string; // ISO timestamp
  isPublic: boolean;
}
```

**Response Success (201)**:
```typescript
{
  tournament: {
    id: string;
    name: string;
    description?: string;
    organizer: string;
    organizerEmail: string;
    maxParticipants?: number;
    registrationOpen: boolean;
    registrationDeadline?: string; // ISO timestamp
    startDate?: string; // ISO timestamp
    endDate?: string; // ISO timestamp
    isPublic: boolean;
    participantCount: number;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
  }
}
```

**Response Error (400/401)**:
```typescript
{
  error: {
    code: "VALIDATION_ERROR" | "UNAUTHORIZED";
    message: string;
    details?: Record<string, string>; // Field-specific errors
  }
}
```

### PUT /tournaments/:id
Update tournament (organizer only).

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```typescript
{
  name?: string;
  description?: string;
  maxParticipants?: number;
  registrationOpen?: boolean;
  registrationDeadline?: string; // ISO timestamp
  startDate?: string; // ISO timestamp
  endDate?: string; // ISO timestamp
  isPublic?: boolean;
}
```

**Response Success (200)**:
```typescript
{
  tournament: {
    // Full tournament object with updates
  }
}
```

### DELETE /tournaments/:id
Delete tournament (organizer only).

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success (204)**: No content

**Response Error (403)**:
```typescript
{
  error: {
    code: "FORBIDDEN";
    message: "Only organizer can delete tournament";
  }
}
```

## Registration Endpoints

### GET /tournaments/:tournamentId/registrations
List tournament registrations (organizer only).

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status?: "pending" | "confirmed" | "cancelled" | "waitlist"`
- `limit?: number` - Page size (default: 25)
- `cursor?: string` - Pagination cursor

**Response Success (200)**:
```typescript
{
  registrations: Array<{
    id: string;
    tournamentId: string;
    alias: string;
    email: string;
    teamRace: TeamRace;
    fullName?: string;
    nafNumber?: string;
    teamName?: string;
    userId?: string;
    isAnonymous: boolean;
    registeredAt: string; // ISO timestamp
    status: RegistrationStatus;
  }>;
  nextCursor?: string;
  hasMore: boolean;
}
```

### POST /tournaments/:tournamentId/registrations
Register for tournament.

**Request**:
```typescript
{
  alias: string;
  email: string;
  teamRace: TeamRace;
  fullName?: string;
  nafNumber?: string;
  teamName?: string;
}
```

**Response Success (201)**:
```typescript
{
  registration: {
    id: string;
    tournamentId: string;
    alias: string;
    email: string;
    teamRace: TeamRace;
    fullName?: string;
    nafNumber?: string;
    teamName?: string;
    userId?: string;
    isAnonymous: boolean;
    registeredAt: string; // ISO timestamp
    status: RegistrationStatus;
  }
}
```

**Response Error (400/409)**:
```typescript
{
  error: {
    code: "VALIDATION_ERROR" | "DUPLICATE_ALIAS" | "DUPLICATE_EMAIL" | "TOURNAMENT_FULL" | "REGISTRATION_CLOSED";
    message: string;
    details?: Record<string, string>;
  }
}
```

### GET /tournaments/:tournamentId/registrations/:id
Get registration details.

**Response Success (200)**:
```typescript
{
  registration: {
    id: string;
    tournamentId: string;
    alias: string;
    email: string;
    teamRace: TeamRace;
    fullName?: string;
    nafNumber?: string;
    teamName?: string;
    userId?: string;
    isAnonymous: boolean;
    registeredAt: string; // ISO timestamp
    status: RegistrationStatus;
  }
}
```

### PUT /tournaments/:tournamentId/registrations/:id
Update registration.

**Request**:
```typescript
{
  alias?: string;
  teamRace?: TeamRace;
  fullName?: string;
  nafNumber?: string;
  teamName?: string;
  status?: RegistrationStatus; // Organizer only
}
```

**Response Success (200)**:
```typescript
{
  registration: {
    // Full registration object with updates
  }
}
```

### DELETE /tournaments/:tournamentId/registrations/:id
Cancel registration.

**Response Success (204)**: No content

## Common Error Responses

### 400 Bad Request
```typescript
{
  error: {
    code: "VALIDATION_ERROR";
    message: "Request validation failed";
    details: Record<string, string>; // Field-specific errors
  }
}
```

### 401 Unauthorized
```typescript
{
  error: {
    code: "UNAUTHORIZED";
    message: "Authentication required";
  }
}
```

### 403 Forbidden
```typescript
{
  error: {
    code: "FORBIDDEN";
    message: "Insufficient permissions";
  }
}
```

### 404 Not Found
```typescript
{
  error: {
    code: "RESOURCE_NOT_FOUND";
    message: "Requested resource does not exist";
  }
}
```

### 409 Conflict
```typescript
{
  error: {
    code: "CONFLICT";
    message: "Resource conflict (duplicate, etc.)";
  }
}
```

### 500 Internal Server Error
```typescript
{
  error: {
    code: "INTERNAL_ERROR";
    message: "An unexpected error occurred";
  }
}
```

## Type Definitions

### TeamRace Enum
```typescript
enum TeamRace {
  HUMAN = "human",
  ORC = "orc",
  DWARF = "dwarf",
  SKAVEN = "skaven",
  WOOD_ELF = "wood_elf",
  DARK_ELF = "dark_elf",
  HIGH_ELF = "high_elf",
  CHAOS = "chaos",
  UNDEAD = "undead",
  HALFLING = "halfling",
  GOBLIN = "goblin",
  AMAZON = "amazon",
  LIZARDMAN = "lizardman",
  NORSE = "norse",
  NECROMANTIC = "necromantic",
  NURGLE = "nurgle",
  VAMPIRE = "vampire",
  CHAOS_DWARF = "chaos_dwarf",
  UNDERWORLD = "underworld",
  OGRE = "ogre"
}
```

### RegistrationStatus Enum
```typescript
enum RegistrationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  WAITLIST = "waitlist"
}
```

## Firebase Implementation Notes

### Firestore Operations Mapping
- GET /tournaments → `tournaments` collection query
- POST /tournaments → `tournaments` collection add
- GET /tournaments/:id → `tournaments/{id}` document get
- PUT /tournaments/:id → `tournaments/{id}` document update
- DELETE /tournaments/:id → `tournaments/{id}` document delete
- GET /tournaments/:id/registrations → `tournaments/{id}/registrations` subcollection query
- POST /tournaments/:id/registrations → `tournaments/{id}/registrations` subcollection add

### Authentication Integration
- Firebase Auth tokens in Authorization header
- User ID from token used for ownership validation
- Anonymous access allowed for tournament registration

### Real-time Updates
- Use Firestore listeners for live data updates
- Implement proper listener cleanup
- Handle connection state changes

### Error Handling
- Map Firebase errors to standard HTTP error codes
- Provide user-friendly error messages
- Log detailed errors for debugging

This contract specification provides a clear interface for frontend-backend communication while leveraging Firebase's document-based architecture.