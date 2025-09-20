// T029: Zod validation schemas
import { z } from 'zod';
import { TeamRace, RegistrationStatus } from '../types/enums';

// User validation schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  displayName: z.string().max(100, 'Display name must be 100 characters or less').optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateUserProfileSchema = z.object({
  displayName: z.string().max(100, 'Display name must be 100 characters or less').optional(),
});

// Tournament validation schemas
export const CreateTournamentSchema = z.object({
  name: z
    .string()
    .min(3, 'Tournament name must be at least 3 characters')
    .max(200, 'Tournament name must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  maxParticipants: z
    .number()
    .int('Maximum participants must be a whole number')
    .min(1, 'Maximum participants must be at least 1')
    .max(1000, 'Maximum participants cannot exceed 1000')
    .optional(),
  registrationDeadline: z
    .date()
    .min(new Date(), 'Registration deadline must be in the future')
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isPublic: z.boolean(),
}).refine(
  (data) => {
    if (data.registrationDeadline && data.startDate) {
      return data.startDate >= data.registrationDeadline;
    }
    return true;
  },
  {
    message: 'Start date must be after registration deadline',
    path: ['startDate'],
  }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const UpdateTournamentSchema = z.object({
  name: z
    .string()
    .min(3, 'Tournament name must be at least 3 characters')
    .max(200, 'Tournament name must be 200 characters or less')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  maxParticipants: z
    .number()
    .int('Maximum participants must be a whole number')
    .min(1, 'Maximum participants must be at least 1')
    .max(1000, 'Maximum participants cannot exceed 1000')
    .optional(),
  registrationOpen: z.boolean().optional(),
  registrationDeadline: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isPublic: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.registrationDeadline && data.startDate) {
      return data.startDate >= data.registrationDeadline;
    }
    return true;
  },
  {
    message: 'Start date must be after registration deadline',
    path: ['startDate'],
  }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Registration validation schemas
export const CreateRegistrationSchema = z.object({
  alias: z
    .string()
    .min(2, 'Alias must be at least 2 characters')
    .max(50, 'Alias must be 50 characters or less')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Alias can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Please enter a valid email address'),
  teamRace: z.nativeEnum(TeamRace, {
    errorMap: () => ({ message: 'Please select a valid team race' }),
  }),
  fullName: z
    .string()
    .max(100, 'Full name must be 100 characters or less')
    .optional(),
  nafNumber: z
    .string()
    .regex(/^\d+$/, 'NAF number must contain only digits')
    .max(10, 'NAF number must be 10 digits or less')
    .optional()
    .or(z.literal('')),
  teamName: z
    .string()
    .max(100, 'Team name must be 100 characters or less')
    .optional(),
});

export const UpdateRegistrationSchema = z.object({
  alias: z
    .string()
    .min(2, 'Alias must be at least 2 characters')
    .max(50, 'Alias must be 50 characters or less')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Alias can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  teamRace: z.nativeEnum(TeamRace, {
    errorMap: () => ({ message: 'Please select a valid team race' }),
  }).optional(),
  fullName: z
    .string()
    .max(100, 'Full name must be 100 characters or less')
    .optional(),
  nafNumber: z
    .string()
    .regex(/^\d+$/, 'NAF number must contain only digits')
    .max(10, 'NAF number must be 10 digits or less')
    .optional()
    .or(z.literal('')),
  teamName: z
    .string()
    .max(100, 'Team name must be 100 characters or less')
    .optional(),
  status: z.nativeEnum(RegistrationStatus, {
    errorMap: () => ({ message: 'Please select a valid registration status' }),
  }).optional(),
});

// Registration lookup schema (for anonymous users)
export const RegistrationLookupSchema = z.object({
  alias: z.string().min(1, 'Alias is required'),
  email: z.string().email('Please enter a valid email address'),
  tournamentId: z.string().min(1, 'Tournament ID is required'),
});

// Query parameter schemas
export const TournamentQuerySchema = z.object({
  public: z.boolean().optional(),
  organizer: z.string().optional(),
  registrationOpen: z.boolean().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

export const RegistrationQuerySchema = z.object({
  status: z.nativeEnum(RegistrationStatus).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

// Form validation schemas for UI
export const TournamentFormSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().max(1000),
  maxParticipants: z.string().refine(
    (val) => val === '' || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 1000),
    'Must be a number between 1 and 1000'
  ),
  registrationDeadline: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isPublic: z.boolean(),
});

export const RegistrationFormSchema = z.object({
  alias: z.string().min(2).max(50),
  email: z.string().email(),
  teamRace: z.nativeEnum(TeamRace).or(z.literal('')),
  fullName: z.string().max(100),
  nafNumber: z.string().regex(/^(\d{1,10})?$/, 'NAF number must contain only digits'),
  teamName: z.string().max(100),
});

// Type inference for TypeScript
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof UpdateTournamentSchema>;
export type CreateRegistrationInput = z.infer<typeof CreateRegistrationSchema>;
export type UpdateRegistrationInput = z.infer<typeof UpdateRegistrationSchema>;
export type RegistrationLookupInput = z.infer<typeof RegistrationLookupSchema>;
export type TournamentQueryInput = z.infer<typeof TournamentQuerySchema>;
export type RegistrationQueryInput = z.infer<typeof RegistrationQuerySchema>;
export type TournamentFormInput = z.infer<typeof TournamentFormSchema>;
export type RegistrationFormInput = z.infer<typeof RegistrationFormSchema>;

// Validation helpers
export const validateField = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; error?: string } => {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Unknown validation error' };
  }
};

export const getFieldErrors = <T>(schema: z.ZodSchema<T>, data: unknown): Record<string, string> => {
  try {
    schema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (path) {
          fieldErrors[path] = err.message;
        }
      });
      return fieldErrors;
    }
    return {};
  }
};