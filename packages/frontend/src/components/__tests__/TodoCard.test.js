import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue indicators', () => {
    it('should render overdue indicators when isOverdue is true', () => {
      const overdueTodo = { 
        ...mockTodo, 
        isOverdue: true,
        overdueDays: 3
      };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('3 days overdue')).toBeInTheDocument();
    });

    it('should not render overdue indicators when isOverdue is false', () => {
      const notOverdueTodo = { 
        ...mockTodo, 
        isOverdue: false,
        overdueDays: null
      };
      render(<TodoCard todo={notOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      expect(screen.queryByText(/overdue/)).not.toBeInTheDocument();
    });

    it('should not render overdue for completed todo with past date', () => {
      const completedOverdueTodo = { 
        ...mockTodo, 
        completed: 1,
        isOverdue: false,  // Should be false for completed todos
        overdueDays: null
      };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      expect(screen.queryByText(/overdue/)).not.toBeInTheDocument();
    });

    it('should use singular form for 1 day overdue', () => {
      const overdueTodo = { 
        ...mockTodo, 
        isOverdue: true,
        overdueDays: 1
      };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.getByText('1 day overdue')).toBeInTheDocument();
    });

    it('should include aria-label for warning icon', () => {
      const overdueTodo = { 
        ...mockTodo, 
        isOverdue: true,
        overdueDays: 3
      };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const warningIcon = screen.getByLabelText('Overdue warning');
      expect(warningIcon).toBeInTheDocument();
    });
  });
});
