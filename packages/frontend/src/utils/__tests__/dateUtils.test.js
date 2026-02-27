import { isOverdue, getOverdueDays, formatOverdueText } from '../dateUtils';

describe('dateUtils - isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27')); // Mock "today"
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns false when dueDate is null', () => {
    expect(isOverdue(null, false)).toBe(false);
  });

  test('returns false when dueDate is empty string', () => {
    expect(isOverdue('', false)).toBe(false);
  });

  test('returns false when completed is true (even with past date)', () => {
    expect(isOverdue('2026-02-20', true)).toBe(false);
  });

  test('returns false when dueDate is today', () => {
    expect(isOverdue('2026-02-27', false)).toBe(false);
  });

  test('returns false when dueDate is in the future', () => {
    expect(isOverdue('2026-02-28', false)).toBe(false);
    expect(isOverdue('2026-03-15', false)).toBe(false);
  });

  test('returns true when dueDate is past and not completed', () => {
    expect(isOverdue('2026-02-26', false)).toBe(true); // Yesterday
    expect(isOverdue('2026-02-20', false)).toBe(true); // Last week
    expect(isOverdue('2025-12-31', false)).toBe(true); // Months ago
  });

  test('handles invalid date strings gracefully', () => {
    expect(isOverdue('invalid-date', false)).toBe(false);
    expect(isOverdue('2026-13-45', false)).toBe(false);
  });
});

describe('dateUtils - getOverdueDays', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns 1 for task due yesterday', () => {
    expect(getOverdueDays('2026-02-26')).toBe(1);
  });

  test('returns 7 for task due one week ago', () => {
    expect(getOverdueDays('2026-02-20')).toBe(7);
  });

  test('returns 0 for task due today', () => {
    expect(getOverdueDays('2026-02-27')).toBe(0);
  });

  test('returns correct count for large numbers', () => {
    expect(getOverdueDays('2025-02-27')).toBe(365);
  });

  test('returns 57 for task due on Jan 1', () => {
    expect(getOverdueDays('2026-01-01')).toBe(57);
  });
});

describe('dateUtils - formatOverdueText', () => {
  test('uses singular "day" for 1', () => {
    expect(formatOverdueText(1)).toBe('1 day overdue');
  });

  test('uses plural "days" for 2', () => {
    expect(formatOverdueText(2)).toBe('2 days overdue');
  });

  test('uses plural "days" for larger numbers', () => {
    expect(formatOverdueText(7)).toBe('7 days overdue');
    expect(formatOverdueText(30)).toBe('30 days overdue');
    expect(formatOverdueText(365)).toBe('365 days overdue');
  });
});
