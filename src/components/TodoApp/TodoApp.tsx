import { useTodos } from '../../hooks/useTodos';
import { calculateStats, getUniqueCategories } from '../../utils/todoUtils';
import { TodoInput } from '../TodoInput/TodoInput';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import { TodoStats } from '../TodoStats/TodoStats';
import { TodoList } from '../TodoList/TodoList';
import './TodoApp.css';

export const TodoApp = () => {
  const {
    todos,
    filteredTodos,
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAll
  } = useTodos();

  const stats = calculateStats(todos);
  const categories = getUniqueCategories(todos);

  return (
    <div className="todo-app">
      <div className="todo-container">
        <header className="todo-header">
          <h1 className="todo-title">📝 Todo App</h1>
          <p className="todo-subtitle">
            Stay organized and get things done with this feature-rich todo application
          </p>
        </header>

        <TodoInput onAddTodo={addTodo} />

        {todos.length > 0 && (
          <>
            <TodoStats
              stats={stats}
              onClearCompleted={clearCompleted}
              onToggleAll={toggleAll}
            />

            <TodoFilters
              filter={filter}
              sortBy={sortBy}
              categories={categories}
              onFilterChange={setFilter}
              onSortChange={setSortBy}
            />
          </>
        )}

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        {todos.length === 0 && (
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome to your Todo App! 🎉</h2>
              <p>
                This is a fully-featured todo application built with React and TypeScript. 
                Here's what you can do:
              </p>
              <ul className="feature-list">
                <li>✅ Add todos with priority levels and categories</li>
                <li>🔍 Filter by status, category, and priority</li>
                <li>📊 Sort by date, priority, or alphabetically</li>
                <li>✏️ Edit existing todos inline</li>
                <li>📈 Track your progress with statistics</li>
                <li>💾 Automatic local storage persistence</li>
              </ul>
              <p>Start by adding your first todo above!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 