// T026: Tournament interface and types
import { Timestamp } from 'firebase/firestore';

export interface Tournament {
  id: string; // Auto-generated document ID
  name: string; // Tournament name, required
  description?: string; // Optional tournament description
  organizer: string; // User ID of tournament creator
  organizerEmail: string; // Email of organizer (denormalized)
  maxParticipants?: number; // Optional participant limit
  registrationOpen: boolean; // Registration status
  registrationDeadline?: Timestamp; // Optional deadline
  startDate?: Timestamp; // Tournament start date
  endDate?: Timestamp; // Tournament end date
  isPublic: boolean; // Public visibility
  createdAt: Timestamp; // Creation timestamp
  updatedAt: Timestamp; // Last modification
  participantCount: number; // Current participant count (calculated)
}

// Create tournament request interface
export interface CreateTournamentRequest {
  name: string;
  description?: string;
  maxParticipants?: number;
  registrationDeadline?: string; // ISO timestamp
  startDate?: string; // ISO timestamp
  endDate?: string; // ISO timestamp
  isPublic: boolean;
}

// Update tournament request interface
export interface UpdateTournamentRequest {
  name?: string;
  description?: string;
  maxParticipants?: number;
  registrationOpen?: boolean;
  registrationDeadline?: string; // ISO timestamp
  startDate?: string; // ISO timestamp
  endDate?: string; // ISO timestamp
  isPublic?: boolean;
}

// Tournament response format for API
export interface TournamentResponse {
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
  };
}

// Tournament list response
export interface TournamentListResponse {
  tournaments: TournamentResponse['tournament'][];
  nextCursor?: string;
  hasMore: boolean;
}

// Tournament query parameters
export interface TournamentQueryParams {
  public?: boolean;
  organizer?: string;
  registrationOpen?: boolean;
  limit?: number;
  cursor?: string;
}

// Tournament state for React
export interface TournamentState {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor?: string;
}

// Tournament actions for state management
export type TournamentAction =
  | { type: 'FETCH_TOURNAMENTS_START' }
  | { type: 'FETCH_TOURNAMENTS_SUCCESS'; payload: { tournaments: Tournament[]; hasMore: boolean; nextCursor?: string } }
  | { type: 'FETCH_TOURNAMENTS_ERROR'; payload: string }
  | { type: 'FETCH_TOURNAMENT_START' }
  | { type: 'FETCH_TOURNAMENT_SUCCESS'; payload: Tournament }
  | { type: 'FETCH_TOURNAMENT_ERROR'; payload: string }
  | { type: 'CREATE_TOURNAMENT_SUCCESS'; payload: Tournament }
  | { type: 'UPDATE_TOURNAMENT_SUCCESS'; payload: Tournament }
  | { type: 'DELETE_TOURNAMENT_SUCCESS'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_TOURNAMENTS' };

// Tournament form state
export interface TournamentFormState {
  name: string;
  description: string;
  maxParticipants: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
}

// Tournament validation errors
export interface TournamentValidationErrors {
  name?: string;
  description?: string;
  maxParticipants?: string;
  registrationDeadline?: string;
  startDate?: string;
  endDate?: string;
}

// Tournament status
export type TournamentStatus = 'draft' | 'open' | 'registration_closed' | 'in_progress' | 'completed';

// Tournament statistics
export interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  totalParticipants: number;
  averageParticipants: number;
}