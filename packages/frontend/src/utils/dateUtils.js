/**
 * Date utility functions for overdue todo items
 */

/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - Due date in ISO 8601 format (YYYY-MM-DD) or null
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} True if overdue (past due date and not completed), false otherwise
 */
export const isOverdue = (dueDate, completed) => {
  // Rule 1: No due date or completed → not overdue
  if (!dueDate || completed) {
    return false;
  }

  // Rule 2: Compare dates (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  
  // Rule 3: Handle invalid dates
  if (isNaN(due.getTime())) {
    return false;
  }

  due.setHours(0, 0, 0, 0);

  // Rule 4: Overdue if due date is before today
  return due < today;
};

/**
 * Calculates how many days a todo is overdue
 * @param {string} dueDate - Due date in ISO 8601 format (YYYY-MM-DD)
 * @returns {number} Number of days overdue (always >= 0)
 */
export const getOverdueDays = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Formats overdue duration as user-friendly text
 * @param {number} days - Number of days overdue
 * @returns {string} Formatted text (e.g., "3 days overdue")
 */
export const formatOverdueText = (days) => {
  return `${days} ${days === 1 ? 'day' : 'days'} overdue`;
};
