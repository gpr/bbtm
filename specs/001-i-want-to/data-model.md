# Data Model: Blood Bowl Tournament Management System

**Date**: 2025-09-20
**Feature**: Blood Bowl Tournament Management System
**Phase**: 1 - Data Model Design

## Overview
This document defines the data structures for managing Blood Bowl tournaments, user accounts, and coach registrations using Firestore as the database.

## Core Entities

### User
Represents registered application users who can create and manage tournaments.

```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;                 // Required, unique
  displayName?: string;          // Optional display name
  createdAt: Timestamp;          // Account creation date
  updatedAt: Timestamp;          // Last profile update
  isActive: boolean;             // Account status
}
```

**Collection**: `users`
**Document ID**: Firebase Auth UID
**Validation Rules**:
- email: Must be valid email format, required
- displayName: Optional, max 100 characters
- isActive: Default true

**Relationships**:
- One-to-many with Tournament (user can create multiple tournaments)

### Tournament
Represents a Blood Bowl tournament event with metadata and settings.

```typescript
interface Tournament {
  id: string;                    // Auto-generated document ID
  name: string;                  // Tournament name, required
  description?: string;          // Optional tournament description
  organizer: string;             // User ID of tournament creator
  organizerEmail: string;        // Email of organizer (denormalized)
  maxParticipants?: number;      // Optional participant limit
  registrationOpen: boolean;     // Registration status
  registrationDeadline?: Timestamp; // Optional deadline
  startDate?: Timestamp;         // Tournament start date
  endDate?: Timestamp;           // Tournament end date
  isPublic: boolean;             // Public visibility
  createdAt: Timestamp;          // Creation timestamp
  updatedAt: Timestamp;          // Last modification
  participantCount: number;      // Current participant count (calculated)
}
```

**Collection**: `tournaments`
**Document ID**: Auto-generated
**Validation Rules**:
- name: Required, max 200 characters, min 3 characters
- organizer: Must be valid user ID
- maxParticipants: If set, must be > 0 and < 1000
- registrationDeadline: Must be future date if set
- startDate: Must be after registrationDeadline if both set
- participantCount: Read-only, updated via Cloud Functions

**Relationships**:
- Many-to-one with User (organizer)
- One-to-many with CoachRegistration

**Indexes Required**:
- organizer (for user's tournaments)
- isPublic + registrationOpen (for public tournament listing)
- createdAt (for chronological sorting)

### CoachRegistration
Represents a coach's registration for a specific tournament.

```typescript
interface CoachRegistration {
  id: string;                    // Auto-generated document ID
  tournamentId: string;          // Reference to tournament

  // Coach Information (mandatory)
  alias: string;                 // Coach alias/nickname, required
  email: string;                 // Coach email, required
  teamRace: TeamRace;            // Team race, required

  // Coach Information (optional)
  fullName?: string;             // Coach real name
  nafNumber?: string;            // NAF (National Association of Football) number
  teamName?: string;             // Team name

  // Registration metadata
  userId?: string;               // User ID if registered user
  isAnonymous: boolean;          // True if anonymous registration
  registeredAt: Timestamp;       // Registration timestamp
  status: RegistrationStatus;    // Registration status
}
```

**Collection**: `tournaments/{tournamentId}/registrations`
**Document ID**: Auto-generated
**Validation Rules**:
- alias: Required, max 50 characters, unique within tournament
- email: Required, valid email format
- teamRace: Required, must be valid TeamRace enum value
- fullName: Optional, max 100 characters
- nafNumber: Optional, numeric string, format validation
- teamName: Optional, max 100 characters
- userId: Must be valid user ID if provided

**Relationships**:
- Many-to-one with Tournament
- Many-to-one with User (if not anonymous)

**Indexes Required**:
- alias (unique within tournament)
- email (unique within tournament)
- userId (for user's registrations)
- registeredAt (for chronological listing)

## Enums and Constants

### TeamRace
Blood Bowl team races available for selection.

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

### RegistrationStatus
Status of a coach's tournament registration.

```typescript
enum RegistrationStatus {
  PENDING = "pending",      // Awaiting confirmation
  CONFIRMED = "confirmed",  // Registration confirmed
  CANCELLED = "cancelled",  // Registration cancelled
  WAITLIST = "waitlist"     // On waiting list (if tournament full)
}
```

## Data Access Patterns

### Tournament Creation
1. User creates tournament document
2. Tournament counter initialized
3. Security rules verify organizer ownership

### Coach Registration
1. Validate tournament exists and registration open
2. Check for duplicate alias/email within tournament
3. Create registration document
4. Update tournament participant count (Cloud Function)
5. Send confirmation (if applicable)

### Tournament Listing
1. Public tournaments: Query by isPublic=true, registrationOpen=true
2. User's tournaments: Query by organizer field
3. Pagination using Firestore cursors

### Registration Management
1. List registrations: Query tournament subcollection
2. Update registration status: Direct document update
3. Delete registration: Document delete + counter update

## Security Rules

### Users Collection
```javascript
// Users can read/write their own profile only
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

### Tournaments Collection
```javascript
// Anyone can read public tournaments
// Only authenticated users can create tournaments
// Only organizer can update/delete tournament
match /tournaments/{tournamentId} {
  allow read: if resource.data.isPublic == true ||
                 request.auth.uid == resource.data.organizer;
  allow create: if request.auth != null &&
                   request.auth.uid == request.resource.data.organizer;
  allow update, delete: if request.auth.uid == resource.data.organizer;
}
```

### Registrations Subcollection
```javascript
// Authenticated users can create registrations
// Anonymous users can create with validation
// Only organizer can read all registrations
match /tournaments/{tournamentId}/registrations/{registrationId} {
  allow read: if request.auth.uid == get(/databases/$(database)/documents/tournaments/$(tournamentId)).data.organizer ||
                 request.auth.uid == resource.data.userId;
  allow create: if validateRegistration();
  allow update: if request.auth.uid == get(/databases/$(database)/documents/tournaments/$(tournamentId)).data.organizer ||
                   request.auth.uid == resource.data.userId;
}
```

## Data Validation

### Client-Side Validation (Zod Schemas)
```typescript
const TournamentSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  maxParticipants: z.number().int().min(1).max(1000).optional(),
  registrationDeadline: z.date().min(new Date()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isPublic: z.boolean()
});

const CoachRegistrationSchema = z.object({
  alias: z.string().min(2).max(50),
  email: z.string().email(),
  teamRace: z.nativeEnum(TeamRace),
  fullName: z.string().max(100).optional(),
  nafNumber: z.string().regex(/^\d+$/).optional(),
  teamName: z.string().max(100).optional()
});
```

### Server-Side Validation (Firestore Rules)
- Type checking for all required fields
- Range validation for numeric fields
- Format validation for email fields
- Enum validation for teamRace and status fields

## Performance Considerations

### Query Optimization
- Composite indexes for common query patterns
- Limit pagination size to 25-50 items
- Use Firestore cursors for pagination
- Denormalize frequently accessed data (organizer email)

### Real-time Updates
- Use Firestore listeners for live tournament data
- Limit listeners to active components only
- Implement proper cleanup for listeners

### Caching Strategy
- Cache static data (team races) in localStorage
- Use React Query for intelligent caching
- Implement optimistic updates for better UX

## Migration and Versioning

### Schema Evolution
- All new fields must be optional for backward compatibility
- Use Cloud Functions for data migrations
- Version data model in code documentation

### Data Export/Import
- Provide tournament data export functionality
- Support CSV export for coach lists
- Backup strategy using Cloud Storage

## Metrics and Analytics

### Key Metrics to Track
- Tournament creation rate
- Registration completion rate
- User retention rate
- Anonymous vs registered user ratio

### Firebase Analytics Events
- tournament_created
- coach_registered
- registration_completed
- tournament_published

This data model provides a solid foundation for the Blood Bowl tournament management system while maintaining flexibility for future enhancements.