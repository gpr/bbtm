// T027: CoachRegistration interface and types
import { Timestamp } from 'firebase/firestore';
import { TeamRace, RegistrationStatus } from './enums';

export interface CoachRegistration {
  id: string; // Auto-generated document ID
  tournamentId: string; // Reference to tournament

  // Coach Information (mandatory)
  alias: string; // Coach alias/nickname, required
  email: string; // Coach email, required
  teamRace: TeamRace; // Team race, required

  // Coach Information (optional)
  fullName?: string; // Coach real name
  nafNumber?: string; // NAF (National Association of Football) number
  teamName?: string; // Team name

  // Registration metadata
  userId?: string; // User ID if registered user
  isAnonymous: boolean; // True if anonymous registration
  registeredAt: Timestamp; // Registration timestamp
  status: RegistrationStatus; // Registration status
}

// Create registration request interface
export interface CreateRegistrationRequest {
  alias: string;
  email: string;
  teamRace: TeamRace;
  fullName?: string;
  nafNumber?: string;
  teamName?: string;
}

// Update registration request interface
export interface UpdateRegistrationRequest {
  alias?: string;
  teamRace?: TeamRace;
  fullName?: string;
  nafNumber?: string;
  teamName?: string;
  status?: RegistrationStatus; // Organizer only
}

// Registration response format for API
export interface RegistrationResponse {
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
  };
}

// Registration list response
export interface RegistrationListResponse {
  registrations: RegistrationResponse['registration'][];
  nextCursor?: string;
  hasMore: boolean;
}

// Registration query parameters
export interface RegistrationQueryParams {
  status?: RegistrationStatus;
  limit?: number;
  cursor?: string;
}

// Registration state for React
export interface RegistrationState {
  registrations: CoachRegistration[];
  currentRegistration: CoachRegistration | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor?: string;
}

// Registration actions for state management
export type RegistrationAction =
  | { type: 'FETCH_REGISTRATIONS_START' }
  | { type: 'FETCH_REGISTRATIONS_SUCCESS'; payload: { registrations: CoachRegistration[]; hasMore: boolean; nextCursor?: string } }
  | { type: 'FETCH_REGISTRATIONS_ERROR'; payload: string }
  | { type: 'FETCH_REGISTRATION_START' }
  | { type: 'FETCH_REGISTRATION_SUCCESS'; payload: CoachRegistration }
  | { type: 'FETCH_REGISTRATION_ERROR'; payload: string }
  | { type: 'CREATE_REGISTRATION_SUCCESS'; payload: CoachRegistration }
  | { type: 'UPDATE_REGISTRATION_SUCCESS'; payload: CoachRegistration }
  | { type: 'DELETE_REGISTRATION_SUCCESS'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_REGISTRATIONS' };

// Registration form state
export interface RegistrationFormState {
  alias: string;
  email: string;
  teamRace: TeamRace | '';
  fullName: string;
  nafNumber: string;
  teamName: string;
}

// Registration validation errors
export interface RegistrationValidationErrors {
  alias?: string;
  email?: string;
  teamRace?: string;
  fullName?: string;
  nafNumber?: string;
  teamName?: string;
}

// Registration error codes
export interface RegistrationError {
  code: 'VALIDATION_ERROR' | 'DUPLICATE_ALIAS' | 'DUPLICATE_EMAIL' | 'TOURNAMENT_FULL' | 'REGISTRATION_CLOSED';
  message: string;
  details?: Record<string, string>;
}

// Registration confirmation
export interface RegistrationConfirmation {
  success: boolean;
  registrationId: string;
  accountCreated?: boolean;
  emailSent?: boolean;
  message: string;
}

// Registration statistics
export interface RegistrationStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  confirmedRegistrations: number;
  cancelledRegistrations: number;
  waitlistRegistrations: number;
  teamRaceDistribution: Record<TeamRace, number>;
}

// Registration lookup (for anonymous users)
export interface RegistrationLookup {
  alias: string;
  email: string;
  tournamentId: string;
}

// CSV export format
export interface RegistrationCsvRow {
  alias: string;
  email: string;
  teamRace: string;
  fullName: string;
  nafNumber: string;
  teamName: string;
  status: string;
  registeredAt: string;
  isAnonymous: string;
}