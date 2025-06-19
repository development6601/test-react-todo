import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'priority' | 'category'>>) => void;
}

export const TodoList = ({ todos, onToggle, onDelete, onUpdate }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No todos yet</h3>
          <p>Add a todo above to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <span className="todo-count">
          {todos.length} {todos.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="todo-list-items">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}; 