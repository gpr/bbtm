// Validation utility functions

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if value is within length limits
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  const length = value?.trim().length || 0;
  return length >= min && length <= max;
}

/**
 * Sanitize string by removing dangerous characters
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .trim();
}

/**
 * Validate tournament name
 */
export function isValidTournamentName(name: string): boolean {
  return !isEmpty(name) && isValidLength(name, 3, 100);
}

/**
 * Validate coach name
 */
export function isValidCoachName(name: string): boolean {
  return !isEmpty(name) && isValidLength(name, 2, 50);
}

/**
 * Validate team name
 */
export function isValidTeamName(name: string): boolean {
  return !isEmpty(name) && isValidLength(name, 2, 50);
}

/**
 * Check if participant count is valid
 */
export function isValidParticipantCount(count: number, min = 4, max = 1000): boolean {
  return Number.isInteger(count) && count >= min && count <= max;
}

/**
 * Generate a safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract error message from error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}