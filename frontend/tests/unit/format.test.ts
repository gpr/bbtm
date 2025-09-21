import { describe, it, expect } from 'vitest';
import {
  capitalizeWords,
  formatTeamRace,
  formatTournamentStatus,
  formatRegistrationStatus,
  formatParticipantCount,
  truncateText,
  formatFileSize,
  getInitials,
  formatCurrency,
  generateId,
} from '../../src/utils/format';

describe('Format Utilities', () => {
  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle single words', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });

    it('should handle already capitalized text', () => {
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('formatTeamRace', () => {
    it('should format team races correctly', () => {
      expect(formatTeamRace('dark_elf')).toBe('Dark Elf');
      expect(formatTeamRace('chaos_chosen')).toBe('Chaos Chosen');
      expect(formatTeamRace('human')).toBe('Human');
    });
  });

  describe('formatTournamentStatus', () => {
    it('should format known statuses', () => {
      expect(formatTournamentStatus('draft')).toBe('Draft');
      expect(formatTournamentStatus('registration_open')).toBe('Registration Open');
      expect(formatTournamentStatus('registration_closed')).toBe('Registration Closed');
      expect(formatTournamentStatus('in_progress')).toBe('In Progress');
      expect(formatTournamentStatus('completed')).toBe('Completed');
      expect(formatTournamentStatus('cancelled')).toBe('Cancelled');
    });

    it('should handle unknown statuses', () => {
      expect(formatTournamentStatus('custom_status')).toBe('Custom Status');
    });
  });

  describe('formatRegistrationStatus', () => {
    it('should format known statuses', () => {
      expect(formatRegistrationStatus('pending')).toBe('Pending');
      expect(formatRegistrationStatus('confirmed')).toBe('Confirmed');
      expect(formatRegistrationStatus('declined')).toBe('Declined');
      expect(formatRegistrationStatus('waitlist')).toBe('Waitlisted');
    });

    it('should handle unknown statuses', () => {
      expect(formatRegistrationStatus('custom')).toBe('Custom');
    });
  });

  describe('formatParticipantCount', () => {
    it('should format with maximum', () => {
      expect(formatParticipantCount(5, 10)).toBe('5/10');
      expect(formatParticipantCount(0, 16)).toBe('0/16');
    });

    it('should format without maximum', () => {
      expect(formatParticipantCount(5)).toBe('5');
      expect(formatParticipantCount(0)).toBe('0');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle exact length', () => {
      expect(truncateText('Exactly10!', 10)).toBe('Exactly10!');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle fractional sizes', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });

  describe('getInitials', () => {
    it('should generate initials from names', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Mary Jane Watson')).toBe('MJ'); // Only first 2 initials
      expect(getInitials('Cher')).toBe('C');
    });

    it('should handle lowercase names', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(10)).toBe('$10.00');
      expect(formatCurrency(10.5)).toBe('$10.50');
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-10)).toBe('-$10.00');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[a-z0-9_]+$/);
    });

    it('should generate IDs with prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test_[a-z0-9_]+$/);
    });

    it('should generate IDs without prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9_]+$/);
      expect(id).not.toMatch(/^test_/);
    });
  });
});