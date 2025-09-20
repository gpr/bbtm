// T025: User interface and types
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string; // Firebase Auth UID
  email: string; // Required, unique
  displayName?: string; // Optional display name
  createdAt: Timestamp; // Account creation date
  updatedAt: Timestamp; // Last profile update
  isActive: boolean; // Account status
}

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName?: string;
    createdAt: string; // ISO timestamp
  };
  token: string;
}

export interface AuthError {
  code: 'INVALID_EMAIL' | 'EMAIL_EXISTS' | 'WEAK_PASSWORD' | 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND';
  message: string;
}

// Firebase User type extensions
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// User profile update interface
export interface UpdateUserProfile {
  displayName?: string;
  // Future fields can be added here
}

// User state for React context
export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// User actions for state management
export type UserAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };