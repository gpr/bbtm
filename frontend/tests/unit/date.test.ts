import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  formatDateTime,
  isPastDate,
  isFutureDate,
  daysBetween,
  daysUntil,
  getRelativeTime,
  isRegistrationOpen,
} from '../../src/utils/date';

describe('Date Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2024-03-15');
      expect(result).toBe('March 15, 2024');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-03-15');
      const result = formatDate(date);
      expect(result).toBe('March 15, 2024');
    });

    it('should apply custom options', () => {
      const result = formatDate('2024-03-15', {
        month: 'short',
        day: '2-digit'
      });
      expect(result).toBe('Mar 15, 2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const result = formatDateTime('2024-03-15T14:30:00Z');
      expect(result).toMatch(/Mar 15, 2024/);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('isPastDate', () => {
    it('should return true for past date', () => {
      expect(isPastDate('2024-01-10')).toBe(true);
    });

    it('should return false for future date', () => {
      expect(isPastDate('2024-01-20')).toBe(false);
    });

    it('should work with Date objects', () => {
      expect(isPastDate(new Date('2024-01-10'))).toBe(true);
      expect(isPastDate(new Date('2024-01-20'))).toBe(false);
    });
  });

  describe('isFutureDate', () => {
    it('should return true for future date', () => {
      expect(isFutureDate('2024-01-20')).toBe(true);
    });

    it('should return false for past date', () => {
      expect(isFutureDate('2024-01-10')).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between two dates', () => {
      expect(daysBetween('2024-01-01', '2024-01-05')).toBe(4);
    });

    it('should work with Date objects', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      expect(daysBetween(start, end)).toBe(4);
    });

    it('should return absolute difference', () => {
      expect(daysBetween('2024-01-05', '2024-01-01')).toBe(4);
    });
  });

  describe('daysUntil', () => {
    it('should calculate positive days for future date', () => {
      expect(daysUntil('2024-01-20')).toBe(5);
    });

    it('should calculate negative days for past date', () => {
      expect(daysUntil('2024-01-10')).toBe(-5);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for very recent times', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('just now');
    });

    it('should return relative future time', () => {
      const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days
      expect(getRelativeTime(futureDate)).toBe('in 2 days');
    });

    it('should return relative past time', () => {
      const pastDate = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      expect(getRelativeTime(pastDate)).toBe('3 hours ago');
    });

    it('should handle singular units', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
      expect(getRelativeTime(futureDate)).toBe('in 1 day');
    });
  });

  describe('isRegistrationOpen', () => {
    it('should return true for future deadline', () => {
      expect(isRegistrationOpen('2024-01-20')).toBe(true);
    });

    it('should return false for past deadline', () => {
      expect(isRegistrationOpen('2024-01-10')).toBe(false);
    });

    it('should return true for null deadline', () => {
      expect(isRegistrationOpen(null)).toBe(true);
    });
  });
});