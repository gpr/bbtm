import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isEmpty,
  isValidLength,
  sanitizeString,
  isValidTournamentName,
  isValidCoachName,
  isValidTeamName,
  isValidParticipantCount,
  generateSlug,
  isValidUrl,
  getErrorMessage,
} from '../../src/utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  hello  ')).toBe(false);
    });
  });

  describe('isValidLength', () => {
    it('should validate string length correctly', () => {
      expect(isValidLength('hello', 3, 10)).toBe(true);
      expect(isValidLength('hi', 3, 10)).toBe(false);
      expect(isValidLength('this is too long for the limit', 3, 10)).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      expect(isValidLength('  hello  ', 3, 10)).toBe(true);
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>hello')).toBe('alert(xss)hello');
      expect(sanitizeString('<p>Hello <b>world</b></p>')).toBe('Hello world');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeString('hello<>&"\'')).toBe('hello');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });
  });

  describe('isValidTournamentName', () => {
    it('should validate tournament names', () => {
      expect(isValidTournamentName('Spring Championship')).toBe(true);
      expect(isValidTournamentName('XY')).toBe(false); // too short
      expect(isValidTournamentName('')).toBe(false); // empty
      expect(isValidTournamentName('A'.repeat(101))).toBe(false); // too long
    });
  });

  describe('isValidCoachName', () => {
    it('should validate coach names', () => {
      expect(isValidCoachName('John Doe')).toBe(true);
      expect(isValidCoachName('X')).toBe(false); // too short
      expect(isValidCoachName('')).toBe(false); // empty
      expect(isValidCoachName('A'.repeat(51))).toBe(false); // too long
    });
  });

  describe('isValidTeamName', () => {
    it('should validate team names', () => {
      expect(isValidTeamName('The Warriors')).toBe(true);
      expect(isValidTeamName('X')).toBe(false); // too short
      expect(isValidTeamName('')).toBe(false); // empty
      expect(isValidTeamName('A'.repeat(51))).toBe(false); // too long
    });
  });

  describe('isValidParticipantCount', () => {
    it('should validate participant counts', () => {
      expect(isValidParticipantCount(8)).toBe(true);
      expect(isValidParticipantCount(16)).toBe(true);
      expect(isValidParticipantCount(3)).toBe(false); // too low
      expect(isValidParticipantCount(1001)).toBe(false); // too high
      expect(isValidParticipantCount(5.5)).toBe(false); // not integer
    });

    it('should accept custom min/max', () => {
      expect(isValidParticipantCount(2, 2, 4)).toBe(true);
      expect(isValidParticipantCount(1, 2, 4)).toBe(false);
      expect(isValidParticipantCount(5, 2, 4)).toBe(false);
    });
  });

  describe('generateSlug', () => {
    it('should create valid slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Blood Bowl Championship 2024!')).toBe('blood-bowl-championship-2024');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Café & Bar')).toBe('caf-bar');
      expect(generateSlug('Title with (parentheses)')).toBe('title-with-parentheses');
    });

    it('should remove leading/trailing hyphens', () => {
      expect(generateSlug('---test---')).toBe('test');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error objects', () => {
      const error = new Error('Something went wrong');
      expect(getErrorMessage(error)).toBe('Something went wrong');
    });

    it('should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('should handle unknown error types', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
      expect(getErrorMessage({})).toBe('An unknown error occurred');
      expect(getErrorMessage(123)).toBe('An unknown error occurred');
    });
  });
});