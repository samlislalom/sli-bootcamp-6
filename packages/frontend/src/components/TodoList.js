import React from 'react';
import TodoCard from './TodoCard';
import { isOverdue, getOverdueDays } from '../utils/dateUtils';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  // Compute overdue status for all todos
  const todosWithStatus = todos.map(todo => {
    const overdueStatus = isOverdue(todo.dueDate, todo.completed);
    return {
      ...todo,
      isOverdue: overdueStatus,
      overdueDays: overdueStatus ? getOverdueDays(todo.dueDate) : null
    };
  });

  return (
    <div className="todo-list">
      {todosWithStatus.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
