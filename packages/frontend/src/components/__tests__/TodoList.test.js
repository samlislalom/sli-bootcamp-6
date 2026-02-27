import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  describe('Overdue status computation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock "today"
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should compute and pass overdue status to TodoCard', () => {
      const todosWithPastDate = [
        {
          id: 1,
          title: 'Overdue Todo',
          dueDate: '2026-02-20', // 7 days ago
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      render(<TodoList todos={todosWithPastDate} {...mockHandlers} isLoading={false} />);
      
      // Should show overdue indicator
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('7 days overdue')).toBeInTheDocument();
    });

    it('should handle todos without due dates', () => {
      const todosNoDate = [
        {
          id: 1,
          title: 'No Due Date Todo',
          dueDate: null,
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      render(<TodoList todos={todosNoDate} {...mockHandlers} isLoading={false} />);
      
      // Should not show overdue indicator
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      expect(screen.queryByText(/overdue/)).not.toBeInTheDocument();
    });

    it('should handle mixed overdue and non-overdue todos', () => {
      const mixedTodos = [
        {
          id: 1,
          title: 'Overdue Todo',
          dueDate: '2026-02-20', // Past
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Future Todo',
          dueDate: '2026-03-15', // Future
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        },
        {
          id: 3,
          title: 'Completed Past Todo',
          dueDate: '2026-02-15', // Past but completed
          completed: 1,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      render(<TodoList todos={mixedTodos} {...mockHandlers} isLoading={false} />);
      
      // Only one overdue indicator should appear (for the first todo)
      const overdueIndicators = screen.queryAllByText('⚠️');
      expect(overdueIndicators).toHaveLength(1);
      expect(screen.getByText('7 days overdue')).toBeInTheDocument();
    });
  });

  describe('User Story 2: Overdue Indicator Persistence', () => {
    it('should show todo as overdue when date changes from today to tomorrow', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock "today"
      
      const todoDueToday = [
        {
          id: 1,
          title: 'Due Today Todo',
          dueDate: '2026-02-27', // Due today
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      const { rerender } = render(<TodoList todos={todoDueToday} {...mockHandlers} isLoading={false} />);
      
      // Should not be overdue yet
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      
      // Simulate date change to tomorrow
      jest.setSystemTime(new Date('2026-02-28'));
      
      // Re-render component
      rerender(<TodoList todos={todoDueToday} {...mockHandlers} isLoading={false} />);
      
      // Should now be overdue
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('1 day overdue')).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    it('should recalculate overdue status on component mount', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27'));
      
      const todosWithPastDate = [
        {
          id: 1,
          title: 'Past Due Todo',
          dueDate: '2026-02-20',
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      // Mount the component
      render(<TodoList todos={todosWithPastDate} {...mockHandlers} isLoading={false} />);
      
      // Should compute overdue status on mount
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('7 days overdue')).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    it('should update overdue status when todos prop changes', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27'));
      
      const initialTodos = [
        {
          id: 1,
          title: 'Future Todo',
          dueDate: '2026-03-15',
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      const updatedTodos = [
        {
          id: 1,
          title: 'Future Todo',
          dueDate: '2026-02-20', // Changed to past date
          completed: 0,
          createdAt: '2026-02-01T00:00:00Z'
        }
      ];
      
      const { rerender } = render(<TodoList todos={initialTodos} {...mockHandlers} isLoading={false} />);
      
      // Should not be overdue initially
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      
      // Update todos prop
      rerender(<TodoList todos={updatedTodos} {...mockHandlers} isLoading={false} />);
      
      // Should now be overdue
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('7 days overdue')).toBeInTheDocument();
      
      jest.useRealTimers();
    });
  });
});
