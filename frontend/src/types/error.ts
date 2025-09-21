// TypeScript error types for consistent error handling
import { FirebaseError } from 'firebase/app';

// Base error interface from error service
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}

// Union type for all possible errors in the application
export type ApplicationError =
  | FirebaseError
  | Error
  | AppError
  | string
  | unknown;

// Type guard to check if error is a Firebase error
export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

// Type guard to check if error is a standard Error
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Type guard to check if error is an AppError
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

// Helper type for error objects with potential code property
export interface ErrorWithCode {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

// Type for unknown errors that might have a message
export interface ErrorWithMessage {
  message: string;
  [key: string]: unknown;
}