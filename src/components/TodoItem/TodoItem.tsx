import { useState } from 'react';
import type { Todo } from '../../types';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'priority' | 'category'>>) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, {
        text: editText.trim(),
        category: editCategory.trim(),
        priority: editPriority
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditCategory(todo.category);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="todo-edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="edit-text-input"
            autoFocus
          />
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Category"
            className="edit-category-input"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="edit-priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
      </div>
      
      <div className="todo-content">
        <div className="todo-text">{todo.text}</div>
        <div className="todo-meta">
          {todo.category && (
            <span className="todo-category">{todo.category}</span>
          )}
          <span 
            className="todo-priority"
            style={{ color: getPriorityColor(todo.priority) }}
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
          </span>
          <span className="todo-date">
            {todo.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="edit-button"
          disabled={todo.completed}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}; 